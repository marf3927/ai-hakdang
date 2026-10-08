import Meter from "./Meter.jsx";
import { Cursor } from "./icons.jsx";

export default function BookHead({ data }) {
  return (
    <section className="wrap bookhead">
      <NextChapter data={data} />
      <Ledger data={data} />
    </section>
  );
}

function NextChapter({ data }) {
  if (data.status === "offline") {
    return (
      <div>
        <p className="kicker"><Cursor />시작하기</p>
        <h1>학습 지도 서버가 꺼져 있습니다</h1>
        <p className="why">터미널에서 이 폴더로 가서 <code>npm start</code> 를 실행한 뒤 새로 고치세요.</p>
      </div>
    );
  }
  const next = data.next;
  if (!next) {
    return (
      <div>
        <p className="kicker"><Cursor />첫 수업</p>
        <h1>AI 선생님을 불러 보세요</h1>
        <p className="why">이 폴더에서 Claude Code 는 <code>/hakdang</code>, Codex 는 <code>$hakdang</code>.</p>
      </div>
    );
  }
  return (
    <div>
      <p className="kicker"><Cursor />다음에 읽을 장 · {data.stageName?.(next.stage)}</p>
      <h1>{next.title}</h1>
      {next.why && <p className="why">{next.why}</p>}
      <p className="how">AI에게 "다음 수업"이라고 말하면 시작합니다.</p>
    </div>
  );
}

function Ledger({ data }) {
  const warn = data.errors?.length ? (
    <p className="notice">{data.errors.join(" ")} — AI에게 "progress.json 고쳐 줘"라고 말해 보세요.</p>
  ) : null;
  if (data.status === "offline") {
    return (
      <aside className="ledger-card" aria-label="내 학습 상태">
        <h2>기록을 읽을 수 없어요</h2>
        <p className="small muted">학습 지도 서버가 꺼져 있어요. 켜면 내 기록이 여기에 나옵니다.</p>
      </aside>
    );
  }
  if (data.status !== "ready" || !data.learner) {
    return (
      <aside className="ledger-card" aria-label="내 학습 상태">
        <h2>아직 시작 전</h2>
        <p className="small muted">첫 수업이 끝나면 여기에 진도가 쌓입니다.</p>
        {warn}
      </aside>
    );
  }
  const { learner: L, totals: t, progress: P } = data;
  return (
    <aside className="ledger-card" aria-label="내 학습 상태">
      <h2>{L.name}님의 기록</h2>
      <p className="small muted">{L.level} · 주 {L.hours || "—"}</p>
      {L.goal && <p className="small">만들고 싶은 것 <b>{L.goal}</b></p>}
      <p><span className="num">{t.learned}</span> <span className="muted">/ {t.concepts} 개념 이해</span></p>
      <Meter learned={t.learned} learning={t.learning} total={t.concepts} label={`전체 ${t.concepts}개 중 ${t.learned}개 이해함`} />
      <p className="small muted">
        {t.quiz ? `퀴즈 ${t.quiz}문제 중 ${t.right}문제 정답` : "아직 푼 퀴즈 없음"}
        {P.updated && ` · 갱신 ${P.updated}`}
      </p>
      {warn}
    </aside>
  );
}
