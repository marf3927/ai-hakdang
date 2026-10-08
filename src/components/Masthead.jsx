import Bar from "./Bar.jsx";
import { Cursor } from "./icons.jsx";

export default function Masthead({ data }) {
  return (
    <header className="night">
      <div className="stars" aria-hidden="true" />
      <div className="wrap masthead">
        <div className="brand-row">
          <img src="/assets/brand/icon.png" alt="" width="88" height="88" />
          <div>
            <h1 className="wordmark">AI학당</h1>
            <p className="tagline">각자의 작업을 함께 배우는 곳</p>
          </div>
        </div>
        <div className="hero-grid">
          <NextCard data={data} />
          <MeCard data={data} />
        </div>
      </div>
    </header>
  );
}

function NextCard({ data }) {
  if (data.status === "offline") {
    return (
      <section className="next-card" aria-label="다음 수업">
        <p className="label"><Cursor />시작하기</p>
        <h2>학습 지도 서버가 꺼져 있습니다</h2>
        <p className="how">터미널에서 이 폴더로 가서 <code>npm start</code> 를 실행한 뒤 새로 고치세요.</p>
      </section>
    );
  }
  const next = data.next;
  return (
    <section className="next-card" aria-label="다음 수업">
      {next ? (
        <>
          <p className="label"><Cursor />다음 수업 · {data.stageName?.(next.stage)}</p>
          <h2>{next.title}</h2>
          {next.why && <p>{next.why}</p>}
          <p className="how">AI에게 "다음 수업"이라고 말하면 시작합니다.</p>
        </>
      ) : (
        <>
          <p className="label"><Cursor />첫 수업</p>
          <h2>AI 선생님을 불러 보세요</h2>
          <p className="how">이 폴더에서 Claude Code 는 <code>/hakdang</code>, Codex 는 <code>$hakdang</code>.</p>
        </>
      )}
    </section>
  );
}

function MeCard({ data }) {
  const warn = data.errors?.length ? (
    <p className="notice">{data.errors.join(" ")} — AI에게 "progress.json 고쳐 줘"라고 말해 보세요.</p>
  ) : null;
  if (data.status !== "ready" || !data.learner) {
    return (
      <section className="me-card" aria-label="내 학습 상태">
        <h2>아직 시작 전</h2>
        <p className="small">첫 수업이 끝나면 여기에 진도가 쌓입니다.</p>
        {warn}
      </section>
    );
  }
  const { learner: L, totals: t, progress: P } = data;
  return (
    <section className="me-card" aria-label="내 학습 상태">
      <h2>{L.name}님의 기록</h2>
      <p className="muted small">{L.level} · 주 {L.hours || "—"}</p>
      {L.goal && <p className="small">만들고 싶은 것 <b>{L.goal}</b></p>}
      <p className="me-num"><strong>{t.learned}</strong><span className="muted">/ {t.concepts} 개념 이해</span></p>
      <Bar learned={t.learned} learning={t.learning} total={t.concepts} label={`전체 ${t.concepts}개 중 ${t.learned}개 이해함`} />
      <p className="muted small">
        {t.quiz ? `퀴즈 ${t.quiz}문제 중 ${t.right}문제 정답` : "아직 푼 퀴즈 없음"}
        {P.updated && ` · 갱신 ${P.updated}`}
      </p>
      {warn}
    </section>
  );
}
