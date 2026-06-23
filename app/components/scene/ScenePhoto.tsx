import Image from "next/image";

/**
 * ScenePhoto — a cinematic photograph graded into the Twilight Expedition
 * palette: the image is dimmed/desaturated and washed with dark + teal/violet
 * gradients so real photography blends into the noir world instead of clashing.
 * Drop into a <SceneLayer>. Set `priority` for the hero (LCP) layer only.
 */
export function ScenePhoto({
  src,
  priority = false,
  position = "center",
  grade = "deep",
}: {
  src: string;
  priority?: boolean;
  position?: string;
  grade?: "deep" | "soft";
}) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src={src}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
        style={{
          objectPosition: position,
          filter:
            grade === "deep"
              ? "brightness(0.42) saturate(0.85) contrast(1.05)"
              : "brightness(0.6) saturate(0.95)",
        }}
      />
      {/* Palette wash — blends the photo into the noir + tints it twilight. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,7,13,0.35) 0%, rgba(5,7,13,0.55) 55%, rgba(5,7,13,0.92) 100%), radial-gradient(80% 60% at 50% 30%, rgba(13,185,200,0.12), transparent 60%), radial-gradient(70% 60% at 80% 80%, rgba(109,92,246,0.14), transparent 60%)",
        }}
      />
    </div>
  );
}
