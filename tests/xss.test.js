/**
 * @author Takumi Harada
 * @date 2026-03-31
 */
import test from "node:test";
import assert from "node:assert/strict";
import { XSSProtection } from "../src/utils/xss.js";

test("XSSProtection.escape escapes special chars", () => {
  const input = "<script>alert('x')</script>";
  const escaped = XSSProtection.escape(input);
  assert.equal(escaped, "&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt;");
});

test("XSSProtection.normalizeFullWidthAscii converts full width chars", () => {
  const input = "ＡＢＣ１２３＠．";
  const normalized = XSSProtection.normalizeFullWidthAscii(input);
  assert.equal(normalized, "ABC123@.");
});
