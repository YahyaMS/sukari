type Shape = "sphere" | "cube" | "capsule" | "torus" | "cylinder"

export default function AbstractIcon({ shape = "sphere", size = 32 }: { shape?: Shape; size?: number }) {
  const id = Math.random().toString(36).slice(2)
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="rounded-[10px] shadow-soft">
      <defs>
        <linearGradient id={`g1-${id}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#dbeafe" />
          <stop offset="1" stopColor="#bfdbfe" />
        </linearGradient>
        <radialGradient id={`g2-${id}`} cx=".35" cy=".35">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".9" />
          <stop offset=".6" stopColor="#8B5CF6" stopOpacity=".7" />
          <stop offset="1" stopColor="#3B82F6" stopOpacity=".5" />
        </radialGradient>
      </defs>
      <rect width="64" height="64" rx="10" fill={`url(#g1-${id})`} />
      {shape === "sphere" && <circle cx="32" cy="32" r="18" fill={`url(#g2-${id})`} />}
      {shape === "cube" && <rect x="18" y="18" width="28" height="28" rx="4" fill={`url(#g2-${id})`} />}
      {shape === "capsule" && <rect x="16" y="24" width="32" height="16" rx="8" fill={`url(#g2-${id})`} />}
      {shape === "torus" && (
        <>
          <circle cx="32" cy="32" r="18" fill="none" stroke={`url(#g2-${id})`} strokeWidth="8" />
          <circle cx="32" cy="32" r="10" fill="url(#g1-${id})" />
        </>
      )}
      {shape === "cylinder" && (
        <>
          <ellipse cx="32" cy="22" rx="12" ry="6" fill={`url(#g2-${id})`} />
          <rect x="20" y="22" width="24" height="20" fill={`url(#g2-${id})`} />
          <ellipse cx="32" cy="42" rx="12" ry="6" fill={`url(#g1-${id})`} />
        </>
      )}
    </svg>
  )
}
