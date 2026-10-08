import BookHead from "./components/BookHead.jsx";
import Margin from "./components/Margin.jsx";
import TableOfContents from "./components/TableOfContents.jsx";
import TopBar from "./components/TopBar.jsx";
import { useLearningState } from "./useLearningState.js";

export default function App() {
  const data = useLearningState();

  return (
    <>
      <TopBar />
      <BookHead data={data} />
      {data.status === "ready" && data.roadmap ? (
        <div className="wrap book">
          <main>
            <h2 className="sec-title">차례 — {data.roadmap.title}</h2>
            <p className="intro">{data.roadmap.intro}</p>
            <TableOfContents data={data} />
          </main>
          <Margin data={data} />
        </div>
      ) : data.status === "ready" ? (
        <div className="wrap book"><p className="notice">로드맵을 읽지 못했습니다. {data.errors?.join(" ")}</p></div>
      ) : null}
      <footer className="foot">
        <div className="wrap">
          <span>학습 지도 켜기 <code>npm start</code></span>
          <span>Claude Code <code>/hakdang</code></span>
          <span>Codex <code>$hakdang</code></span>
          <span>이 창으로 돌아오면 새 기록을 다시 읽습니다</span>
        </div>
      </footer>
    </>
  );
}
