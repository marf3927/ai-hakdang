// 복사 버튼이 하는 일. React 없이 테스트할 수 있게 순수 함수로 둔다(test/copy.test.mjs).

// React 는 리스너가 돌아오는 즉시 event.currentTarget 을 비우므로, 선택할 글은 await 전에 잡아 둔다.
export async function copyOrSelect(event, text, { clipboard, select }) {
  const button = event.currentTarget;
  const target = button.parentElement?.querySelector("code, q") || button;
  try {
    await clipboard.writeText(text);
    return "done";
  } catch {
    select(target);
    return "select";
  }
}

export function shortcutLabel(userAgent) {
  return /Mac|iPhone|iPad/.test(userAgent || "") ? "⌘C" : "Ctrl+C";
}
