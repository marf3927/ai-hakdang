import { Fragment } from "react";
import Bar from "./Bar.jsx";
import { Chevron, Spark } from "./icons.jsx";

const LABEL = { todo: "아직", learning: "배우는 중", learned: "이해함" };

export default function RoadmapPath({ data }) {
  const { roadmap, stages, stateOf, currentStage } = data;
  const tracks = Object.fromEntries((roadmap.tracks || []).map((t) => [t.id, t]));
  const doneStages = new Set(stages.filter((s) => s.checked).map((s) => s.id));

  return (
    <ol className="path">
      {stages.map((s, i) => {
        const trackStart = s.track && s.track !== stages[i - 1]?.track;
        const t = tracks[s.track];
        return (
          <Fragment key={s.id}>
            {trackStart && (
              <li className="track-head">
                <h3>{t?.title || s.track}</h3>
                {t?.goal && <p>{t.goal}</p>}
                {t?.graduation && <p className="muted small">졸업: {t.graduation}</p>}
              </li>
            )}
            <Stop stage={s} current={s.id === currentStage} stateOf={stateOf} />
            {roadmap.projects
              .filter((p) => p.after === s.id)
              .map((p) => (
                <li key={p.what} className={`milestone${doneStages.has(p.after) ? " is-done" : ""}`}>
                  <span className="pin" aria-hidden="true" />
                  <p><b>{doneStages.has(p.after) ? "만들 수 있어요" : "여기까지 오면"}</b> · {p.what}</p>
                </li>
              ))}
          </Fragment>
        );
      })}
    </ol>
  );
}

function Stop({ stage: s, current, stateOf }) {
  const total = s.concepts.length;
  return (
    <li className={`stop${current ? " is-current" : ""}${s.checked ? " is-checked" : ""}`} id={s.id}>
      <span className="node" aria-hidden="true">{s.checked ? <Spark /> : s.id.slice(1)}</span>
      <details className="stage" open={current}>
        <summary>
          <h3>
            {s.title}
            {current && <span className="sr-only"> (지금 단계)</span>}
          </h3>
          <span className={`count${s.checked ? " is-pass" : ""}`}>
            {s.checked ? <><Spark /> 통과 {s.checked}</> : `${s.learned}/${total}`} <Chevron />
          </span>
          <Bar learned={s.learned} learning={s.learning} total={total} label={`${total}개 중 ${s.learned}개 이해함`} />
        </summary>
        <div className="stage-body">
          {s.goal && <p className="goal">{s.goal}</p>}
          <ul className="concepts">
            {s.concepts.map((c) => {
              const st = stateOf(c.id);
              return (
                <li key={c.id} className={`c ${st}`}>
                  <span className="dot">{st === "learned" && <Spark />}</span>
                  <div>
                    <strong>{c.name}</strong>
                    <span className="state">{LABEL[st]}</span>
                    <p>{c.desc}</p>
                    <p className="q">검색어 · {c.q}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="terms"><b>더 알아둘 용어</b>{s.terms.join(" · ")}</p>
          <p className="check"><b>확인</b>{s.check}</p>
        </div>
      </details>
    </li>
  );
}
