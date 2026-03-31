# 設計書: 未来商店商材 (mirai-shoten)

## 1. 目的
- 開発目的: EC風フロントを題材に、画面遷移・フォーム検証・カート操作の設計力を示す。
- 評価してほしい点: Main集約、Validator/XSS分離、UIコンポーネント再利用。

## 2. 画面構成・遷移
- 画面一覧:
  - トップ (`index.html`)
  - 商品詳細 (`hokkori-mug.html`, `aroma-candle.html`, `organic-linen.html`)
  - カート (`cart.html`)
  - 購入 (`checkout.html`, `checkout-complete.html`)
  - 問い合わせ (`contact.html`, `contact-confirm.html`, `contact-complete.html`)
- 遷移:
  - トップ -> 商品詳細 -> カート -> 購入
  - トップ -> 問い合わせ -> 確認 -> 完了

## 3. クラス設計
| クラス | 責務 | 主なメソッド | 依存 |
|---|---|---|---|
| Main | 画面判定と初期化 | init, initHomePage, initCartPage など | Header, Footer, Validator, XSS |
| Header | ヘッダーUI制御 | initMobileMenu, initScrollClass | DOM |
| Footer | フッター表示制御 | setYear | DOM |
| UIComponents | UI断片の再利用 | showAddToCartNotice, renderCartRows | XSSProtection |
| StyleManager | 視覚効果管理 | initTilt, initReveal, initCursorGlow | DOM |
| Validator | フォーム妥当性検証 | isEmail, isTel, isZip など | 正規表現 |
| XSSProtection | エスケープ/正規化 | escape, normalizeFullWidthAscii | 文字列処理 |
| CartService | 数量/金額計算 | normalizeQuantity, calculateTotal | Main |

## 4. データ設計
- 定数: `src/constants/app-constants.js`
- 商品定義: `src/constants/code-definitions.js`
- 永続化:
  - `futureShopCart`
  - `adminOrders`

## 5. 非機能
- 命名規則: 英語kebab-caseへ統一済み。
- 品質ゲート: `npm run lint`, `npm test`, GitHub Actions CI。
- 対応環境: Chrome / Edge 最新版推奨。
- 既知制約: ビルドツールなし（確認容易性優先）。

## 6. 今後改善
- UI回帰テストの追加。
- 注文データスキーマの厳密化。

## 7. 提出チェックリスト
- [ ] 起動手順を第三者が再現できる
- [ ] lint/test が通る
- [ ] カート計算とフォーム検証を説明できる
- [ ] 既知制約を説明できる
