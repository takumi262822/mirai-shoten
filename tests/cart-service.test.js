/**
 * @author Takumi Harada
 * @date 2026-03-31
 */
import test from "node:test";
import assert from "node:assert/strict";
import { CartService } from "../src/core/cart-service.js";

test("CartService.normalizeQuantity returns at least 1", () => {
  assert.equal(CartService.normalizeQuantity(3), 3);
  assert.equal(CartService.normalizeQuantity(0), 1);
  assert.equal(CartService.normalizeQuantity(-2), 1);
  assert.equal(CartService.normalizeQuantity("abc"), 1);
});

test("CartService.calculateTotal returns cart total", () => {
  const cart = [
    { price: 1800, quantity: 2 },
    { price: 1200, quantity: 1 },
    { price: 2400, quantity: 3 }
  ];

  assert.equal(CartService.calculateTotal(cart), 12000);
});
