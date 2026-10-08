import { useCallback, useEffect, useState } from "react";
import { shapeState } from "./shape.mjs";

// 창으로 돌아올 때마다 다시 읽는다 — AI가 진도 파일을 고쳤을 수 있다.
export function useLearningState() {
  const [state, setState] = useState({ status: "loading" });

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/state", { cache: "no-store" });
      setState({ status: "ready", ...shapeState(await res.json()) });
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
