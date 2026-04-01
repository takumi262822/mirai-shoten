# 未来商店商材 (mirai-shoten)

企業提出向けに構成した、静的 Web フロントエンドのポートフォリオです。

`mirai-shoten-admin` は、このプロジェクトに対応する管理者向けダッシュボードです。
本プロジェクトは利用者向けフロント画面、`mirai-shoten-admin` は運用管理画面として役割を分けています。

## 1. 採用担当向けサマリー

- 目的: UI実装力と設計改善力を短時間で確認できる提出物
- 想定閲覧時間: 5-10分
- 見てほしい点: クラス分割、入力検証、XSS対策、カート導線

## 2. 作成者情報

- 作成者: Takumi Harada
- 作成日: 2026-03-31
- ドキュメント最終更新日: 2026-03-31

## 3. ディレクトリ構成

- `src/core/main.js`: 画面ごとの初期化とイベント連携
- `src/ui/header.js`: ヘッダー関連の UI 制御
- `src/ui/footer.js`: フッター関連の UI 制御
- `src/ui/components.js`: 再利用可能な UI 部品
- `src/styles/style-manager.js`: 共通スタイル演出
- `src/constants/app-constants.js`: アプリ共通定数
- `src/constants/code-definitions.js`: 商品定義データ
- `src/utils/validator.js`: 入力バリデーション
- `src/utils/xss.js`: XSS 保護ユーティリティ

## 4. 実行方法

ES Modules を利用しているため、ローカルサーバー経由で実行してください。

```powershell
cd C:\テスト\未来商店商材
python -m http.server 5504
```

ブラウザで `http://localhost:5504/index.html` を開きます。

## 5. 品質チェック（Lint / Test）

```powershell
cd C:\テスト\未来商店商材
npm install
npm run lint
npm test
```

CI: `.github/workflows/ci.yml`

### テスト方針

- `tests/validator.test.js` で入力検証、`tests/cart-service.test.js` で金額計算、`tests/navigation.test.js` で許可ルート、`tests/xss.test.js` で安全な表示処理を確認しています。
- テスト名は日本語で統一し、README の検証観点と対応が取れるようにしています。
- 購入導線の最終体験は手動確認しつつ、フォーム・遷移・計算・サニタイズのような回帰しやすいロジックを自動テストで固めています。

## 6. 5分評価ガイド

1. `index.html` で一覧・導線を確認
2. 商品詳細からカート追加を確認
3. カートで数量変更・削除・合計計算を確認
4. 購入画面で入力検証と完了遷移を確認
5. お問い合わせ画面の検証と確認画面遷移を確認

## 7. 実装の工夫

- 命名規則を kebab-case / camelCase / PascalCase で統一
- 画面遷移とロジックを `Main` に集約
- 入力値検証を `Validator` に分離
- 文字列エスケープを `XSSProtection` に分離
- `onclick` などのインラインイベントを廃止

## 8. 画面キャプチャ

提出時に使用するスクリーンショットは以下へ配置してください。

- `docs/screenshots/01-home.png`
- `docs/screenshots/02-product-detail.png`
- `docs/screenshots/03-cart.png`
- `docs/screenshots/04-checkout.png`
- `docs/screenshots/05-contact.png`
- `docs/screenshots/06-contact-confirm.png`
- `docs/screenshots/07-complete.png`

詳細は `docs/screenshots/README.md` を参照してください。

## 9. 対応環境・既知の制約

- 推奨ブラウザ: Chrome / Edge の最新安定版
- スマホ表示: レスポンシブ対応（主要導線を確認済み）
- 既知の制約: ビルドツール無し構成（確認容易性を優先）

## 10. 今後の改善

- フォーム検証ケースの拡張
- UI回帰テストの追加

## 11. 提出チェックリスト

- [ ] 命名規則（kebab-case / camelCase / PascalCase）が統一されている
- [ ] `src` 以下に責務分離されたクラス構成がある
- [ ] インライン JavaScript / インラインイベントが残っていない
- [ ] 入力バリデーションと XSS 対策が分離実装されている
- [ ] 主要遷移（商品詳細・カート・購入・問い合わせ）が動作する
- [ ] カート数量変更・削除・合計計算が正しく動作する
- [ ] `npm run lint` と `npm test` が通る
- [ ] `.github/workflows/ci.yml` で CI が有効
- [ ] README に構成・起動方法・検証観点が記載されている
- [ ] `docs/screenshots` に提出用キャプチャを格納済み

## 12. 関連プロジェクト

- 対応する管理画面: `../mirai-shoten-admin`
- 独立した別作品: `../godufo-game`, `../quiz-game`, `../脱出ゲーム`
