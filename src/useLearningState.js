import { useCallback, useEffect, useState } from "react";

// /api/state 를 읽어 화면이 쓰기 좋은 모양으로 바꾼다. 창으로 돌아올 때마다 다시 읽는다 — AI가 진도 파일을 고쳤을 수 있다.
export function useLearningState() {
  const [state, setState] = useState({ status: "loading" });

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/state", { cache: "no-store" });
      setState({ status: "ready", ...shape(await res.json()) });
    } catch {
      setState({ status: "offline" });
    }
  }, []);

  useEffect(() => {
    load();
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, [load]);

  return state;
}

function shape({ roadmap, progress, quiz, errors }) {
  if (!roadmap) return { roadmap: null, errors };
  const P = progress || {};
  const conceptState = P.concepts || {};
  const stageState = P.stages || {};
  const stateOf = (id) => conceptState[id] || "todo";
  const stages = roadmap.stages.map((s) => ({
    ...s,
    learned: s.concepts.filter((c) => stateOf(c.id) === "learned").length,
    learning: s.concepts.filter((c) => stateOf(c.id) === "learning").length,
    checked: stageState[s.id]?.checked || null,
  }));
  const all = stages.flatMap((s) => s.concepts);
  return {
    roadmap,
    stages,
    progress: P,
    learner: P.learner || null,
    lessons: P.lessons || [],
    next: P.next || null,
    stateOf,
    quiz,
    errors,
    totals: {
      concepts: all.length,
      learned: all.filter((c) => stateOf(c.id) === "learned").length,
      learning: all.filter((c) => stateOf(c.id) === "learning").length,
      quiz: quiz.length,
      right: quiz.filter((q) => q.correct).length,
    },
    currentStage: P.next?.stage || P.learner?.start || roadmap.stages[0]?.id,
    stageName: (id) => {
      const s = roadmap.stages.find((x) => x.id === id);
      const t = roadmap.tracks?.find((x) => x.id === s?.track);
      return s ? `${t ? t.title + " " : ""}${s.id.slice(1)}단계 ${s.title}` : "";
    },
  };
}
