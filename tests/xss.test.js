/**
 * @author Takumi Harada
 * @date 2026-03-31
 */
import test from "node:test";
import assert from "node:assert/strict";
import { XSSProtection } from "../src/utils/xss.js";

// HTML特殊文字のエスケープで危険なタグ文字列を無害化できるかを確認する。
test('HTML 特殊文字のエスケープで危険なタグ文字列を無害化できること', () => {
  const input = "<script>alert('x')</script>";
  const escaped = XSSProtection.escape(input);
  assert.equal(escaped, "&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt;");
});

// 全角ASCII文字を半角へ正規化して入力ゆれを抑制できるかを確認する。
test('全角 ASCII 文字を半角へ正規化して入力ゆれを抑制できること', () => {
  const input = "ＡＢＣ１２３＠．";
  const normalized = XSSProtection.normalizeFullWidthAscii(input);
  assert.equal(normalized, "ABC123@.");
});
