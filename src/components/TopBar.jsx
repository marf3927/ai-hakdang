import { useState } from "react";

const CHOICES = [
  ["system", "시스템"],
  ["light", "밝게"],
  ["dark", "어둡게"],
];

// 고른 값은 localStorage 에 두고 assets/theme.js 가 수업 페이지에서도 같은 값을 쓴다.
function readTheme() {
  try {
    return localStorage.getItem("hakdang-theme") || "system";
  } catch {
    return "system";
  }
}

export default function TopBar() {
  const [theme, setTheme] = useState(readTheme);

  const choose = (t) => {
    setTheme(t);
    try {
      if (t === "system") localStorage.removeItem("hakdang-theme");
      else localStorage.setItem("hakdang-theme", t);
    } catch {}
    if (t === "system") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = t;
  };

  return (
    <header className="wrap top">
      <span className="mark"><img src="/assets/brand/icon.png" alt="" width="36" height="36" /></span>
      <b>AI학당</b>
      <span>각자의 작업을 함께 배우는 곳</span>
      <div className="theme-toggle" role="group" aria-label="화면 밝기">
        {CHOICES.map(([id, label]) => (
          <button key={id} type="button" aria-pressed={theme === id} onClick={() => choose(id)}>{label}</button>
        ))}
      </div>
    </header>
  );
}
