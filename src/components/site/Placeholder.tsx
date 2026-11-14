// Shown when a news item or project has no image.
export default function Placeholder({ label, tone = "moss" }: { label?: string; tone?: "moss" | "navy" }) {
  const bg = tone === "navy" ? "bg-navy" : "bg-moss";
  return (
    <div className={`relative flex h-full w-full items-end overflow-hidden ${bg}`} aria-hidden="true">
      <img
        src="/brand/stork.svg"
        alt=""
        className={`absolute -right-[8%] -bottom-[18%] w-[70%] ${tone === "navy" ? "opacity-25 invert" : "opacity-[0.16]"}`}
      />
      {label && (
        <span className={`relative m-5 text-sm font-semibold ${tone === "navy" ? "text-white/80" : "text-navy/70"}`}>
          {label}
        </span>
      )}
    </div>
  );
}
