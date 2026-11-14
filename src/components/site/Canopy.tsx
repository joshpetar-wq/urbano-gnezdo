// The canopy from the logo, used as a frame for the hero photo.
// Coordinates follow the logo mark (328 × 326).
const circles: [number, number, number][] = [
  [164, 95, 85], [90, 118, 68], [238, 118, 68], [116, 66, 56], [212, 66, 56],
  [50, 150, 42], [278, 150, 42], [164, 150, 72], [118, 172, 50], [210, 172, 50],
];

export default function Canopy({ image, alt = "" }: { image?: string; alt?: string }) {
  return (
    <svg viewBox="0 0 328 330" className="h-auto w-full" role={image ? "img" : undefined} aria-label={image ? alt : undefined} aria-hidden={image ? undefined : true}>
      <defs>
        <clipPath id="canopy">
          {circles.map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} />
          ))}
        </clipPath>
        <clipPath id="below">
          <rect x="0" y="224" width="328" height="110" />
        </clipPath>
      </defs>
      <g clipPath="url(#canopy)">
        <rect width="328" height="330" fill="#3dc143" />
        {image && <image href={image} x="0" y="0" width="328" height="226" preserveAspectRatio="xMidYMid slice" />}
      </g>
      {image ? (
        // Only the legs and the nest, so the stork seems to stand inside the tree
        <g clipPath="url(#below)">
          <image href="/brand/stork.svg" x="0" y="0" width="328" height="326" />
        </g>
      ) : (
        <image href="/brand/stork.svg" x="0" y="0" width="328" height="326" />
      )}
    </svg>
  );
}
