export default function Meter({ learned, learning, total, label }) {
  const pct = (n) => (total ? (n / total) * 100 : 0);
  return (
    <div className="meter" role="img" aria-label={label}>
      <span className="m-learned" style={{ left: 0, width: `${pct(learned)}%` }} />
      <span className="m-learning" style={{ left: `${pct(learned)}%`, width: `${pct(learning)}%` }} />
    </div>
  );
}
