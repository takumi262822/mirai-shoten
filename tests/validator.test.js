/**
 * @author Takumi Harada
 * @date 2026-03-31
 */
import test from "node:test";
import assert from "node:assert/strict";
import { Validator } from "../src/utils/validator.js";

test("Validator.isRequired validates non-empty input", () => {
  assert.equal(Validator.isRequired("abc"), true);
  assert.equal(Validator.isRequired("  "), false);
});

test("Validator.isEmail validates email format", () => {
  assert.equal(Validator.isEmail("test@example.com"), true);
  assert.equal(Validator.isEmail("invalid-email"), false);
});

test("Validator.isZip validates japanese zip format", () => {
  assert.equal(Validator.isZip("123-4567"), true);
  assert.equal(Validator.isZip("1234567"), true);
  assert.equal(Validator.isZip("12-34567"), false);
});

test("Validator.isTel validates telephone format", () => {
  assert.equal(Validator.isTel("09012345678"), true);
  assert.equal(Validator.isTel("03-1234-5678"), true);
  assert.equal(Validator.isTel("12345"), false);
});
