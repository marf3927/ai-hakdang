import { useState } from "react";
import { copyOrSelect, shortcutLabel } from "../copy.mjs";

function selectContents(el) {
  const range = document.createRange();
  range.selectNodeContents(el);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

// localhost 는 보안 문맥이라 navigator.clipboard 를 쓸 수 있다. 막히면 글을 선택해 두고 직접 복사하게 한다.
export default function CopyButton({ text, label = "복사" }) {
  const [state, setState] = useState("idle");
  const copy = async (e) => {
    setState(await copyOrSelect(e, text, { clipboard: navigator.clipboard, select: selectContents }));
    setTimeout(() => setState("idle"), 2000);
  };
  return (
    <button type="button" className={`copy${state === "done" ? " is-done" : ""}`} onClick={copy} aria-live="polite">
      {state === "done" ? "복사됨 ✓" : state === "select" ? `선택됨 — ${shortcutLabel(navigator.userAgent)}` : label}
    </button>
  );
}
