"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { BD_UNIVERSITIES } from "@/lib/universities";
import { inputCls } from "./FounderForm";

const MAX_SUGGESTIONS = 8;

/**
 * Searchable university field. Type-to-filter against a curated BD university
 * list; picking a suggestion locks in the exact canonical spelling so the
 * campus race can count it correctly. Typing something not on the list still
 * works (free text) — the backend's alias table catches known variants as a
 * safety net, this field just stops most drift at the source.
 */
export function UniversityField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const suggestions = useMemo(() => {
    const q = value.trim().toLowerCase();
    const pool = q
      ? BD_UNIVERSITIES.filter((u) => u.toLowerCase().includes(q))
      : BD_UNIVERSITIES;
    return pool.slice(0, MAX_SUGGESTIONS);
  }, [value]);

  useEffect(() => setHighlight(0), [suggestions.length, open]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function pick(name: string) {
    onChange(name);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      pick(suggestions[highlight]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <input
        className={inputCls}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        placeholder="Start typing your university…"
      />
      {open && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-[calc(100%+6px)] z-20 max-h-64 overflow-y-auto rounded-xl border border-white/10 bg-noir-950/95 py-1.5 shadow-2xl backdrop-blur-[var(--fx-glass-xl)]"
        >
          {suggestions.map((name, i) => (
            <li key={name} role="option" aria-selected={i === highlight}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(name)}
                className={`block w-full px-4 py-2.5 text-left text-sm transition-colors ${
                  i === highlight ? "bg-treasure/15 text-treasure" : "text-ink-soft hover:bg-white/5"
                }`}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
