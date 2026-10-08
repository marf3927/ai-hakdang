// 밝게 · 어둡게 선택을 기억한다. 학습 지도와 모든 수업이 <head> 에서 불러 깜빡임 없이 적용한다.
(function () {
  try {
    const t = localStorage.getItem("hakdang-theme");
    if (t === "light" || t === "dark") document.documentElement.dataset.theme = t;
  } catch {}
  // 학습 지도 안(iframe)에서 열린 수업은 지도의 머리 줄이 이미 있으니 수업 머리 줄을 숨긴다.
  if (window.self !== window.top) document.documentElement.classList.add("in-frame");
})();
