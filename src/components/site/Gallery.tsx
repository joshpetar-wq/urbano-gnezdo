"use client";

import { useCallback, useEffect, useState } from "react";

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, step]);

  if (!images.length) return null;

  return (
    <>
      <ul className="columns-2 gap-3 sm:columns-3 [&>li]:mb-3">
        {images.map((src, i) => (
          <li key={src + i} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="block w-full overflow-hidden rounded-xl"
              aria-label={`${title} ${i + 1}/${images.length}`}
            >
              <img src={src} alt="" loading="lazy" className="w-full transition-transform duration-300 hover:scale-[1.03]" />
            </button>
          </li>
        ))}
      </ul>

      {index !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/95 p-4"
          onClick={close}
        >
          <img
            src={images[index]}
            alt=""
            className="max-h-[86vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute top-4 left-5 text-sm font-semibold text-white/80">
            {index + 1} / {images.length}
          </p>
          <button type="button" onClick={close} className="absolute top-3 right-4 rounded-full bg-white/10 px-4 py-2 font-semibold text-white hover:bg-white/20">
            ✕<span className="sr-only">Close</span>
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); step(-1); }}
                className="absolute left-3 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 text-2xl text-white hover:bg-white/20"
                aria-label="Previous"
              >‹</button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); step(1); }}
                className="absolute right-3 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 text-2xl text-white hover:bg-white/20"
                aria-label="Next"
              >›</button>
            </>
          )}
        </div>
      )}
    </>
  );
}
