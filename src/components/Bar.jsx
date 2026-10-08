export default function Bar({ learned, learning, total, label }) {
  const pct = (n) => (total ? (n / total) * 100 : 0);
  return (
    <div className="bar" role="img" aria-label={label}>
      <span className="b-learned" style={{ width: `${pct(learned)}%` }} />
      <span className="b-learning" style={{ width: `${pct(learning)}%` }} />
    </div>
  );
}
