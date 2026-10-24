import { test } from "node:test";
import assert from "node:assert/strict";
import { copyOrSelect, shortcutLabel } from "../src/copy.mjs";

function fakeClick() {
  const code = { tag: "code" };
  const button = { parentElement: { querySelector: () => code } };
  return { code, button, event: { currentTarget: button } };
}

test("클립보드가 되면 복사하고 done", async () => {
  const { event } = fakeClick();
  const written = [];
  const result = await copyOrSelect(event, "공부하자", { clipboard: { writeText: async (t) => written.push(t) }, select: () => assert.fail() });
  assert.equal(result, "done");
  assert.deepEqual(written, ["공부하자"]);
});

test("클립보드가 막히면 옆의 글을 선택해 둔다 — 클릭 처리가 끝난 뒤 currentTarget 이 비워져도", async () => {
  const { code, event } = fakeClick();
  const selected = [];
  const pending = copyOrSelect(event, "공부하자", {
    clipboard: { writeText: () => Promise.reject(new Error("NotAllowedError")) },
    select: (el) => selected.push(el),
  });
  event.currentTarget = null; // React 는 리스너가 돌아오면 바로 비운다
  assert.equal(await pending, "select");
  assert.deepEqual(selected, [code]);
});

test("클립보드 기능이 아예 없어도 선택해 둔다", async () => {
  const { code, event } = fakeClick();
  const selected = [];
  assert.equal(await copyOrSelect(event, "x", { clipboard: undefined, select: (el) => selected.push(el) }), "select");
  assert.deepEqual(selected, [code]);
});

test("복사 단축키 안내는 Mac 만 ⌘C, 나머지는 Ctrl+C", () => {
  assert.equal(shortcutLabel("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"), "⌘C");
  assert.equal(shortcutLabel("Mozilla/5.0 (Windows NT 10.0; Win64; x64)"), "Ctrl+C");
  assert.equal(shortcutLabel("Mozilla/5.0 (X11; Linux x86_64)"), "Ctrl+C");
});
