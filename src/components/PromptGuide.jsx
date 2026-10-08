import CopyButton from "./CopyButton.jsx";
import { fillPrompt } from "../shape.mjs";

// "어떻게 해야 하지?" 에 대한 답. 문장은 data/prompts.json 한 곳에서 온다.
export default function PromptGuide({ data }) {
  const P = data.prompts;
  if (!P) return null;
  const values = { root: data.root };
  return (
    <section className="wrap guide" aria-labelledby="guide-title">
      <h2 id="guide-title" className="sec-title">AI 선생님에게 이렇게 말하세요</h2>
      <div className="guide-grid">
        <div>
          <h3>{P.open.title}</h3>
          <ol className="guide-steps">
            {P.open.steps.map((s) => <li key={s}>{s}</li>)}
          </ol>
          <ul className="prompt-list">
            {P.open.commands.map((c) => {
              const text = fillPrompt(c.text, values);
              return (
                <li key={c.id}>
                  <span className="when">{c.label}</span>
                  <code>{text}</code>
                  <CopyButton text={text} />
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <h3>이렇게 말하세요</h3>
          <ul className="prompt-list">
            {P.say.map((p) => (
              <li key={p.id}>
                <span className="when">{p.when}</span>
                <q>{p.text}</q>
                <CopyButton text={p.text} />
              </li>
            ))}
          </ul>
          <p className="small muted">괄호 ( ) 안은 내 상황으로 바꿔 쓰세요. 그냥 평소 말투로 말해도 됩니다.</p>
        </div>
      </div>
    </section>
  );
}
