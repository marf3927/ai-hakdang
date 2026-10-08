import { Fragment, useState } from "react";
import { Spark } from "./icons.jsx";

const LABEL = { todo: "아직", learning: "배우는 중", learned: "이해함" };

// 로드맵을 책의 차례처럼 보여 준다. 트랙 = 편, 단계 = 장. 지금 장만 펼쳐 두고 다른 장은 눌러서 연다.
export default function TableOfContents({ data }) {
  const { roadmap, stages, stateOf, currentStage } = data;
  const [open, setOpen] = useState(() => new Set([currentStage]));
  const toggle = (id) => setOpen((s) => {
    const n = new Set(s);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });
  const done = new Set(stages.filter((s) => s.checked).map((s) => s.id));
  const parts = (roadmap.tracks || [{ id: undefined, title: "" }]).map((t) => ({
    track: t,
    stages: stages.filter((s) => s.track === t.id),
  }));

  return parts.map(({ track: t, stages: list }) => (
    <section className="part" key={t.id || "all"}>
      {t.title && (
        <>
          <div className="part-head">
            <h3>{t.title} 편</h3>
            {t.goal && <p>{t.goal}</p>}
          </div>
          {t.graduation && <p className="part-grad">졸업 — {t.graduation}</p>}
        </>
      )}
      <ol className="toc">
        {list.map((s) => {
          const isOpen = open.has(s.id);
          const cls = `${s.id === currentStage ? "is-now" : ""} ${s.checked ? "is-done" : ""}`.trim();
          return (
            <Fragment key={s.id}>
              <li className={cls} id={s.id}>
                <button type="button" className="toc-row" aria-expanded={isOpen} onClick={() => toggle(s.id)}>
                  <span className="no">{s.id.slice(1)}</span>
                  <span className="t">{s.title}</span>
                  <span className="p">
                    {s.checked ? <><Spark /> 다 읽음 {s.checked}</> : `${s.learned}/${s.concepts.length}${s.id === currentStage ? " · 지금" : ""}`}
                  </span>
                </button>
                {isOpen && <Chapter stage={s} stateOf={stateOf} />}
              </li>
              {roadmap.projects
                .filter((p) => p.after === s.id)
                .map((p) => (
                  <li key={p.what} className={`milestone${done.has(p.after) ? " is-done" : ""}`}>
                    <b>{done.has(p.after) ? "만들 수 있어요" : "여기까지 오면"}</b> · {p.what}
                  </li>
                ))}
            </Fragment>
          );
        })}
      </ol>
    </section>
  ));
}

function Chapter({ stage: s, stateOf }) {
  return (
    <div className="chapter">
      {s.goal && <p className="goal">{s.goal}</p>}
      <ul className="concepts">
        {s.concepts.map((c) => {
          const st = stateOf(c.id);
          return (
            <li key={c.id} className={st}>
              <span className="st">{st === "learned" ? "✓ " : st === "learning" ? "✎ " : ""}{LABEL[st]}</span>
              <div>
                <strong>{c.name}</strong>
                <p>{c.desc} · 검색어 {c.q}</p>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="terms"><b>더 알아둘 용어</b>{s.terms.join(" · ")}</p>
      <p className="check"><b>확인</b>{s.check}</p>
    </div>
  );
}
