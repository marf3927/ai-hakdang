import { Spark } from "./icons.jsx";

export default function SidePanel({ data }) {
  const { lessons, roadmap, stageName } = data;
  return (
    <aside className="side">
      <section>
        <h2>내 수업</h2>
        {lessons.length ? (
          <ol className="ledger">
            {[...lessons].reverse().map((l) => (
              <li key={l.file}>
                <a href={`/${l.file}`}>{l.title}</a>
                <span className="muted small">{l.date || ""} · {stageName(l.stage)}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="muted small">아직 없어요. 첫 수업이 여기에 쌓입니다.</p>
        )}
      </section>

      {roadmap.recommended_stack && (
        <section>
          <h2>기본 추천 구성</h2>
          <p className="small">{roadmap.recommended_stack.summary}</p>
          <p className="muted small">{roadmap.recommended_stack.rule}</p>
        </section>
      )}

      {roadmap.electives?.length > 0 && (
        <section>
          <h2>선택 주제</h2>
          <ul className="ledger">
            {roadmap.electives.map((e) => (
              <li key={e.title}>
                <b>{e.title}</b>
                <span className="muted small">{e.desc}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2>표시 읽는 법</h2>
        <ul className="legend">
          <li><span className="c"><span className="dot" /></span>아직 — 수업 전</li>
          <li><span className="c learning"><span className="dot" /></span>배우는 중 — 수업을 받음</li>
          <li><span className="c learned"><span className="dot"><Spark /></span></span>이해함 — 내 말로 설명함</li>
        </ul>
      </section>
    </aside>
  );
}
