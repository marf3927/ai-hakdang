export default function Margin({ data }) {
  const { lessons, roadmap, stageName } = data;
  return (
    <aside className="margin" aria-label="여백 메모">
      <section>
        <h2>내 수업</h2>
        {lessons.length ? (
          <ol>
            {[...lessons].reverse().map((l) => (
              <li key={l.file}>
                <a href={`#/lesson/${l.file}`}>{l.title}</a>
                <span className="muted">{l.date || ""} · {stageName(l.stage)}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="small muted">아직 없어요. 첫 수업이 여기에 쌓입니다.</p>
        )}
      </section>

      {roadmap.recommended_stack && (
        <section>
          <h2>기본 추천 구성</h2>
          <p className="small">{roadmap.recommended_stack.summary}</p>
          <p className="small muted" style={{ marginTop: "var(--space-2xs)" }}>{roadmap.recommended_stack.rule}</p>
        </section>
      )}

      {roadmap.electives?.length > 0 && (
        <section>
          <h2>선택 주제</h2>
          <ul>
            {roadmap.electives.map((e) => (
              <li key={e.title}>
                <b>{e.title}</b>
                <span className="muted">{e.desc}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2>표시 읽는 법</h2>
        <ul className="legend">
          <li><span className="muted">아직</span>수업 전</li>
          <li><span style={{ color: "var(--color-now)", fontWeight: 700 }}>✎ 배우는 중</span>수업을 받음</li>
          <li><span className="hl" style={{ fontWeight: 700 }}>✓ 이해함</span>내 말로 설명함</li>
        </ul>
      </section>
    </aside>
  );
}
