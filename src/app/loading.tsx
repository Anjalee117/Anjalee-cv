export default function Loading() {
  return <main className="wrap loading-state" aria-busy="true" aria-label="Loading portfolio">
    <p className="eyebrow">ANJALEE</p><p className="font-display text-2xl">Loading portfolio…</p>
    <div className="loading-bar" /><div className="loading-bar" style={{ width: "40%" }} />
  </main>;
}
