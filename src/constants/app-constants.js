/**
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * 定数概要:
 * - storageKeys はカートや管理画面連携で利用する localStorage キー
 * - allowedPaths は画面遷移で許可するページのホワイトリスト
 * - defaults は未入力時の代替文言をまとめた表示定数
 */
export const AppConstants = {
  storageKeys: {
    cart: "futureShopCart",
    adminOrders: "adminOrders"
  },
  allowedPaths: [
    "index.html",
    "cart.html",
    "hokkori-mug.html",
    "aroma-candle.html",
    "organic-linen.html",
    "contact.html",
    "contact-confirm.html",
    "contact-complete.html",
    "checkout.html",
    "checkout-complete.html",
    "マイページ.html"
  ],
  defaults: {
    emptyText: "未入力",
    emptySelect: "未選択"
  }
};
