/**
 * @author Takumi Harada
 * @date 2026-03-31
 */
import test from "node:test";
import assert from "node:assert/strict";
import { AppConstants } from "../src/constants/app-constants.js";
import { CodeDefinitions } from "../src/constants/code-definitions.js";

// 主要画面のルートが許可済み遷移先として定義されているかを確認する。
test('主要画面のルートが許可済み遷移先として定義されていること', () => {
  const requiredRoutes = [
    "index.html",
    "cart.html",
    "checkout.html",
    "checkout-complete.html",
    "contact.html",
    "contact-confirm.html",
    "contact-complete.html"
  ];

  requiredRoutes.forEach((route) => {
    assert.equal(AppConstants.allowedPaths.includes(route), true);
  });
});

// 商品詳細ページがすべて遷移許可リストに含まれているかを確認する。
test('商品詳細ページがすべて遷移許可リストに含まれていること', () => {
  const productPages = Object.keys(CodeDefinitions.productsByPage);

  productPages.forEach((page) => {
    assert.equal(AppConstants.allowedPaths.includes(page), true);
  });
});

// 各商品の定義に画面表示と購入処理に必要な項目がそろっているかを確認する。
test('各商品の定義に画面表示と購入処理に必要な項目がそろっていること', () => {
  Object.values(CodeDefinitions.productsByPage).forEach((product) => {
    assert.ok(product.id);
    assert.ok(product.name);
    assert.equal(typeof product.price, "number");
    assert.ok(product.image);
  });
});
