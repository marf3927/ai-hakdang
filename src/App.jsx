import { useEffect, useState } from "react";
import BookHead from "./components/BookHead.jsx";
import LessonView from "./components/LessonView.jsx";
import Margin from "./components/Margin.jsx";
import PromptGuide from "./components/PromptGuide.jsx";
import TableOfContents from "./components/TableOfContents.jsx";
import TopBar from "./components/TopBar.jsx";
import { lessonFromHash } from "./shape.mjs";
import { useLearningState } from "./useLearningState.js";

function useHash() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return hash;
}

export default function App() {
  const data = useLearningState();
  const lesson = lessonFromHash(useHash());

  return (
    <>
      <TopBar />
      {lesson ? (
        <LessonView file={lesson} title={data.lessons?.find((l) => l.file === lesson)?.title} />
      ) : (
        <>
          <BookHead data={data} />
          {data.status === "ready" && <PromptGuide data={data} />}
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
        </>
      )}
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
