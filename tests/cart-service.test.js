/**
 * @author Takumi Harada
 * @date 2026-03-31
 */
import test from "node:test";
import assert from "node:assert/strict";
import { CartService } from "../src/core/cart-service.js";

// 数量の正規化処理が不正値を最小購入数の1へ補正するかを確認する。
test('数量の正規化処理が不正値を最小購入数の 1 へ補正すること', () => {
  assert.equal(CartService.normalizeQuantity(3), 3);
  assert.equal(CartService.normalizeQuantity(0), 1);
  assert.equal(CartService.normalizeQuantity(-2), 1);
  assert.equal(CartService.normalizeQuantity("abc"), 1);
});

// カート内商品の単価と数量から合計金額を正しく算出できるかを確認する。
test('カート内商品の単価と数量から合計金額を正しく算出できること', () => {
  const cart = [
    { price: 1800, quantity: 2 },
    { price: 1200, quantity: 1 },
    { price: 2400, quantity: 3 }
  ];

  assert.equal(CartService.calculateTotal(cart), 12000);
});
