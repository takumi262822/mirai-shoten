# 設計書: 未来商店商材 (mirai-shoten)

## 1. 文書概要

### 1.1 目的
本書は 未来商店商材 の実装設計を整理するための設計書である。画面構成や見た目の説明は SCREEN-OVERVIEW.md に分離し、本書では JavaScript 実装を対象に、クラス単位・メソッド単位・主要分岐単位で処理内容を定義する。

### 1.2 対象範囲
- フロント画面の初期化処理
- 商品追加、カート更新、購入完了までの処理
- 問い合わせ入力、確認画面反映の処理
- 共通 UI、入力検証、XSS 対策、演出処理
- localStorage を用いたデータ保存処理

### 1.3 対象外
- サーバーサイド処理
- 決済代行連携
- 会員認証の実装
- 在庫管理、配送管理などの外部業務機能

## 2. システム構成

### 2.1 モジュール構成
| 区分 | ファイル | 役割 |
|---|---|---|
| エントリー | src/main.js | DOMContentLoaded 時に Main を起動する |
| 画面制御 | src/core/main.js | ページ判定、イベント登録、localStorage 更新を統括する |
| 計算 | src/core/cart-service.js | 数量正規化と合計金額計算を行う |
| 定数 | src/constants/app-constants.js | 画面遷移許可パス、storage key、既定表示値を管理する |
| 定数 | src/constants/code-definitions.js | 商品ページと商品情報の対応を管理する |
| UI | src/ui/header.js | モバイルメニューとスクロール連動ヘッダーを制御する |
| UI | src/ui/footer.js | フッター年表示を制御する |
| UI | src/ui/components.js | カート通知、カート一覧 HTML 生成を担当する |
| スタイル | src/styles/style-manager.js | トップ画面の演出を初期化する |
| 入力検証 | src/utils/validator.js | 必須、メール、電話番号などの検証を行う |
| セキュリティ | src/utils/xss.js | HTML エスケープと全角英数字正規化を行う |

### 2.2 起動シーケンス
1. src/main.js が src/core/main.js を読み込む。
2. DOMContentLoaded 発火後に Main インスタンスを生成する。
3. Main.init() が共通処理を実行する。
4. 現在ページ名に応じて各初期化メソッドへ分岐する。
5. 各画面でイベント登録、DOM 更新、localStorage 操作を行う。

## 3. データ設計

### 3.1 localStorage
| キー | 用途 | 保存値 |
|---|---|---|
| futureShopCart | カート情報保持 | 商品配列 |
| adminOrders | 管理画面連携用注文履歴 | 注文配列 |

### 3.2 カートデータ
| 項目 | 型 | 内容 |
|---|---|---|
| id | string | 商品 ID |
| name | string | 商品名 |
| price | number | 単価 |
| image | string | 商品アイコン |
| quantity | number | 購入数 |

### 3.3 注文データ (adminOrders 1件分)
| 項目 | 型 | 形式・内容 |
|---|---|---|
| id | string | `#${Math.floor(1000 + Math.random() * 9000)}` 例: `#4521` |
| customer | string | `XSSProtection.escape(name.value)` |
| email | string | `XSSProtection.escape(email.value)` |
| address | string | `〒${zip} ${address}` 例: `〒123-4567 東京都渋谷区1-1` |
| items | string | `商品名(数量)` を `", "` で結合 例: `ほっこり陶器マグ(2), アロマキャンドル(1)` |
| price | string | `summaryTotal.textContent` の値 例: `¥5000` |
| status | string | 固定値 `準備中` |
| date | string | `new Date().toLocaleString()` の結果 |

### 3.4 定数・識別子

定数の具体値は `docs/定数定義書.adoc`、識別子の種別値は `docs/コード定義書.adoc` を参照すること。

## 4. 設計方針

### 4.1 ページ別初期化

`init()` が currentPageName を評価して該当ページの初期化メソッドを呼び分ける。各初期化メソッドは独立しており、他ページの DOM 状態に依存しない。

### 4.2 ナビゲーションのホワイトリスト

画面遷移は AppConstants.allowedPaths に含まれるパスのみ許可する。不正なパスへの遷移試行は initNavigation() で無効化し、js-nav 要素のクリックイベントに一元化する。

### 4.3 カート操作の一元化

localStorage への直接操作は Main.initProductPage() と Main.initCartPage() に限定し、CartService.normalizeQuantity() を通じて数量の正規化を行ってから保存する。

### 4.4 XSS 対策

ユーザー入力値は xss.js の XSSProtection.escape() でエスケープしてから localStorage に保存し、画面への反映時は textContent を使用する。

## 5. 関連ドキュメント

| ドキュメント | 内容 |
|---|---|
| README.md | プロジェクト概要・実行手順 |
| SCREEN-OVERVIEW.md | 画面構成・遷移・UI 説明 |
| docs/機能設計書.adoc | クラス・メソッド・分岐単位の詳細仕様 |
| docs/コード定義書.adoc | 識別子・種別コードの定義 |
| docs/定数定義書.adoc | 定数値・設定値一覧 |
