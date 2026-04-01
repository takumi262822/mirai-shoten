/**
 * @author Takumi Harada
 * @date 2026-03-31
 */
import test from "node:test";
import assert from "node:assert/strict";
import { Validator } from "../src/utils/validator.js";

// 必須入力チェックが空文字や空白のみを拒否できるかを確認する。
test('必須入力チェックが空文字と空白のみを拒否できること', () => {
  assert.equal(Validator.isRequired("abc"), true);
  assert.equal(Validator.isRequired("  "), false);
});

// メールアドレス検証が基本的な形式の正誤を判定できるかを確認する。
test('メールアドレス検証が基本的な形式の正誤を判定できること', () => {
  assert.equal(Validator.isEmail("test@example.com"), true);
  assert.equal(Validator.isEmail("invalid-email"), false);
});

// 郵便番号検証がハイフン有無の日本形式を受け付けるかを確認する。
test('郵便番号検証がハイフン有無の日本形式を受け付けること', () => {
  assert.equal(Validator.isZip("123-4567"), true);
  assert.equal(Validator.isZip("1234567"), true);
  assert.equal(Validator.isZip("12-34567"), false);
});

// 電話番号検証が一般的な国内表記を受け付けるかを確認する。
test('電話番号検証が一般的な国内表記を受け付けること', () => {
  assert.equal(Validator.isTel("09012345678"), true);
  assert.equal(Validator.isTel("03-1234-5678"), true);
  assert.equal(Validator.isTel("12345"), false);
});
