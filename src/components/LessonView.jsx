// 수업은 AI가 만든 독립 HTML 이다. 지도 안에서 iframe 으로 열어, 퀴즈 기록(/api/quiz)이 같은 주소에서 그대로 동작한다.
export default function LessonView({ file, title }) {
  return (
    <section className="wrap" aria-label="수업">
      <div className="lesson-frame-bar">
        <a href="#/">← 학습 지도</a>
        <b>{title || file}</b>
        <a href={`/${file}`} target="_blank" rel="noreferrer">새 창에서 열기</a>
      </div>
      <iframe className="lesson-frame" src={`/${file}`} title={title || "수업"} />
    </section>
  );
}
