/**
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * 定数概要:
 * - productsByPage は商品ページ名と商品ID、名称、価格、画像記号の対応表
 * - 商品詳細画面では現在ページ名をキーにしてこの定義から商品情報を取得する
 */
export const CodeDefinitions = {
  productsByPage: {
    "hokkori-mug.html": {
      id: "mag_01",
      name: "ほっこり陶器マグ",
      price: 1800,
      image: "☕"
    },
    "aroma-candle.html": {
      id: "candle_01",
      name: "アロマキャンドル",
      price: 2400,
      image: "🕯️"
    },
    "organic-linen.html": {
      id: "linen_01",
      name: "オーガニックリネン",
      price: 1200,
      image: "🌿"
    }
  }
};
