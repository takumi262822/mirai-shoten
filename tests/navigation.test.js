/**
 * @author Takumi Harada
 * @date 2026-03-31
 */
import test from "node:test";
import assert from "node:assert/strict";
import { AppConstants } from "../src/constants/app-constants.js";
import { CodeDefinitions } from "../src/constants/code-definitions.js";

test("critical routes exist in allowedPaths", () => {
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

test("all product pages are allowed navigation targets", () => {
  const productPages = Object.keys(CodeDefinitions.productsByPage);

  productPages.forEach((page) => {
    assert.equal(AppConstants.allowedPaths.includes(page), true);
  });
});

test("product definitions contain required fields", () => {
  Object.values(CodeDefinitions.productsByPage).forEach((product) => {
    assert.ok(product.id);
    assert.ok(product.name);
    assert.equal(typeof product.price, "number");
    assert.ok(product.image);
  });
});
