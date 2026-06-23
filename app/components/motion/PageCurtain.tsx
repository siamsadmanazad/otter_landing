"use client";

import { AnimatePresence, motion } from "motion/react";

/**
 * PageCurtain — a full-screen cinematic wipe used on form submit before routing
 * to the next act. A signal-gradient panel sweeps up over the scene with a brief
 * "decoding…" line, masking the route change. Controlled by `show`.
 */
export function PageCurtain({ show, label = "decoding…" }: { show: boolean; label?: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="curtain"
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={{ clipPath: "inset(0% 0 0 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          style={{
            background:
              "linear-gradient(160deg, #0f1422 0%, #18203a 55%, #0f1422 100%)",
          }}
        >
          <motion.p
            className="font-mono text-xs uppercase tracking-[0.5em] text-signal-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            {label}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
