// /api/state 응답을 화면이 쓰는 모양으로 바꾼다. React 없이 테스트할 수 있게 순수 함수로 둔다(test/shape.test.mjs).

export function shapeState({ root = "", roadmap, prompts = null, progress, quiz = [], errors = [] }) {
  if (!roadmap) return { roadmap: null, errors };
  const P = progress || {};
  const conceptState = P.concepts || {};
  const stageState = P.stages || {};
  const stateOf = (id) => conceptState[id] || "todo";

  const stages = roadmap.stages.map((s) => {
    const states = s.concepts.map((c) => stateOf(c.id));
    return {
      ...s,
      no: s.id.replace(/^\D+/, ""),
      learned: states.filter((x) => x === "learned").length,
      learning: states.filter((x) => x === "learning").length,
      checked: stageState[s.id]?.checked || null,
    };
  });

  const tracks = roadmap.tracks?.length ? roadmap.tracks : [{ id: undefined, title: "" }];
  const parts = tracks.map((track) => ({ track, stages: stages.filter((s) => s.track === track.id) }));
  const trackTitle = Object.fromEntries(tracks.map((t) => [t.id, t.title]));

  return {
    root,
    prompts,
    roadmap,
    stages,
    parts,
    progress: P,
    learner: P.learner || null,
    lessons: P.lessons || [],
    next: P.next || null,
    stateOf,
    quiz,
    errors,
    totals: {
      concepts: stages.reduce((n, s) => n + s.concepts.length, 0),
      learned: stages.reduce((n, s) => n + s.learned, 0),
      learning: stages.reduce((n, s) => n + s.learning, 0),
      quiz: quiz.length,
      right: quiz.filter((q) => q.correct).length,
    },
    currentStage: P.next?.stage || P.learner?.start || stages[0]?.id,
    stageName: (id) => {
      const s = stages.find((x) => x.id === id);
      return s ? `${trackTitle[s.track] ? trackTitle[s.track] + " " : ""}${s.no}장 ${s.title}` : "";
    },
  };
}

// 복사용 문장의 {root} · {title} 같은 자리를 채운다. 모르는 자리는 그대로 둔다.
export function fillPrompt(text, values) {
  return text.replace(/\{(\w+)\}/g, (all, key) => (values[key] !== undefined ? values[key] : all));
}

// 화면 안에서 수업을 여는 주소: #/lesson/me/lessons/<파일>.html — 그 폴더의 html 만 받는다.
export function lessonFromHash(hash) {
  const m = /^#\/lesson\/(.+)$/.exec(hash || "");
  if (!m) return null;
  let p;
  try {
    p = decodeURIComponent(m[1]);
  } catch {
    return null;
  }
  return /^me\/lessons\/[\w.-]+\.html$/.test(p) && !p.includes("..") ? p : null;
}
