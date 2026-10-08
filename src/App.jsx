import Masthead from "./components/Masthead.jsx";
import RoadmapPath from "./components/RoadmapPath.jsx";
import SidePanel from "./components/SidePanel.jsx";
import { useLearningState } from "./useLearningState.js";

export default function App() {
  const data = useLearningState();

  return (
    <>
      <Masthead data={data} />
      {data.status === "ready" && data.roadmap ? (
        <div className="wrap paper-main">
          <main>
            <h2 className="section-title">{data.roadmap.title}</h2>
            <p className="intro">{data.roadmap.intro}</p>
            <RoadmapPath data={data} />
          </main>
          <SidePanel data={data} />
        </div>
      ) : data.status === "ready" ? (
        <div className="wrap paper-main"><p className="notice">로드맵을 읽지 못했습니다. {data.errors?.join(" ")}</p></div>
      ) : null}
      <footer className="night cmdbar">
        <div className="wrap">
          <img src="/assets/brand/icon.png" alt="" width="28" height="28" />
          <span>학습 지도 켜기 <code>npm start</code></span>
          <span>Claude Code <code>/hakdang</code></span>
          <span>Codex <code>$hakdang</code></span>
          <span>이 창으로 돌아오면 새 기록을 다시 읽습니다</span>
        </div>
      </footer>
    </>
  );
}
