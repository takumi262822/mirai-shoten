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

### 3.3 注文データ
| 項目 | 型 | 内容 |
|---|---|---|
| id | string | 注文番号 |
| customer | string | 購入者名 |
| email | string | メールアドレス |
| address | string | 郵便番号付き住所 |
| items | string | 商品一覧文字列 |
| price | string | 合計金額表示 |
| status | string | 初期値は 準備中 |
| date | string | 注文日時 |

### 3.4 定数定義

#### 3.4.1 AppConstants
- storageKeys.cart: futureShopCart
- storageKeys.adminOrders: adminOrders
- allowedPaths: 画面遷移を許可する HTML 一覧
- defaults.emptyText: 未入力
- defaults.emptySelect: 未選択

#### 3.4.2 CodeDefinitions.productsByPage
- hokkori-mug.html -> ほっこり陶器マグ
- aroma-candle.html -> アロマキャンドル
- organic-linen.html -> オーガニックリネン

## 4. 詳細設計

### 4.1 エントリー処理

#### 4.1.1 src/main.js

##### 1. モジュール読込処理
- I/F:
  - 入力: なし
  - 出力: Main クラスの副作用読込
- 設定値:
  - 読込対象: ./core/main.js
- 処理:
  1. Main を含むモジュールを読込む。
  2. DOMContentLoaded 登録処理を有効化する。

### 4.2 Main クラス

#### 4.2.1 constructor
- 1. 初期状態生成処理
- I/F:
  - 入力: window.location.pathname
  - 出力: currentPageName, styleManager, header, footer
- 設定値:
  - 既定ページ名: index.html
- 処理:
  1. 現在 URL から末尾ファイル名を取得する。
  2. URL エンコード済み文字列を decodeURIComponent で復号する。
  3. StyleManager, Header, Footer を生成する。
- 分岐:
  - a. パス末尾が取得できる場合: その値を currentPageName に設定する。
  - b. それ以外の場合: index.html を設定する。

#### 4.2.2 init
- 1. 共通初期化処理
- I/F:
  - 入力: currentPageName
  - 出力: ページ別初期化完了状態
- 設定値:
  - ページ判定キー: currentPageName
- 処理:
  1. footer.setYear() を実行する。
  2. initNavigation() を実行する。
  3. index.html の場合は initHomePage() を呼ぶ。
  4. 商品ページ定義が存在する場合は initProductPage() を呼ぶ。
  5. 各画面名に応じて問い合わせ、確認、カート、購入画面初期化を呼ぶ。
- 分岐:
  - a. index.html の場合: トップ画面演出とヘッダー挙動を初期化する。
  - b. 商品ページ定義がある場合: 商品追加処理を初期化する。
  - c. contact.html の場合: 問い合わせ入力検証を初期化する。
  - d. contact-confirm.html の場合: URL パラメータ反映を行う。
  - e. cart.html の場合: カート再描画と数量更新イベントを登録する。
  - f. checkout.html の場合: 注文確認と注文確定処理を登録する。

#### 4.2.3 initNavigation
- 1. ナビゲーション遷移処理
- I/F:
  - 入力: .js-nav 要素群、data-href、loginId、loginPass
  - 出力: window.location.assign による画面遷移
- 設定値:
  - 遷移許可一覧: AppConstants.allowedPaths
  - 特例ページ: マイページ.html
- 処理:
  1. .js-nav 要素を走査する。
  2. クリック時に data-href を取得する。
  3. 許可パスでなければ処理を中断する。
  4. 遷移先が マイページ.html の場合のみログイン入力有無を確認する。
  5. 条件を満たした場合は location.assign を実行する。
- 分岐:
  - a. data-href が allowedPaths に含まれない場合: 遷移しない。
  - b. 遷移先が マイページ.html かつ入力欄が存在しない場合: 遷移しない。
  - c. 遷移先が マイページ.html かつ ID または PASSWORD が未入力の場合: アラートを表示し遷移しない。
  - d. それ以外の場合: 指定ページへ遷移する。

#### 4.2.4 initHomePage
- 1. トップ画面演出初期化処理
- I/F:
  - 入力: DOM 上の header, menu, reveal, tilt, magnet, cursor 要素
  - 出力: イベント登録済みトップ画面
- 設定値:
  - ヘッダー閾値: 50
- 処理:
  1. モバイルメニュー制御を初期化する。
  2. スクロール位置によるヘッダー class 切替を初期化する。
  3. カーソル発光、ティルト、マグネット、リビール演出を初期化する。

#### 4.2.5 initProductPage
- 1. 商品追加処理
- I/F:
  - 入力: currentPageName, quantity, .btn-cart
  - 出力: futureShopCart 更新、追加通知表示
- 設定値:
  - 商品定義取得元: CodeDefinitions.productsByPage
  - 保存先: AppConstants.storageKeys.cart
- 処理:
  1. 現在ページに対応する商品定義を取得する。
  2. 数量入力欄と追加ボタンを取得する。
  3. 要素が揃っていればクリックイベントを登録する。
  4. クリック時に数量を CartService.normalizeQuantity で正規化する。
  5. localStorage から既存カートを取得する。
  6. 同一商品 ID の存在有無で加算または新規追加する。
  7. カートを保存し、通知 UI を表示する。
- 分岐:
  - a. 商品定義または入力要素が不足している場合: 初期化しない。
  - b. 同一商品が既に存在する場合: 既存 quantity に加算する。
  - c. それ以外の場合: 新規商品として push する。

#### 4.2.6 initContactPage
- 1. 問い合わせ入力検証処理
- I/F:
  - 入力: contactForm, email, name, kana, tel, pref, usage, category
  - 出力: エラー表示更新、submit 抑止
- 設定値:
  - メール正規化: blur 時に XSSProtection.normalizeFullWidthAscii を適用
- 処理:
  1. フォームと email 要素を取得する。
  2. email blur 時に全角英数字と記号を半角へ正規化する。
  3. submit 時に既存エラー表示と is-error class を初期化する。
  4. 各入力欄を取得する。
  5. name, kana, tel, email, pref, usage, category を順に検証する。
  6. 不正項目がある場合は showError を実行し isValid を false にする。
  7. 最終的に不正がある場合は submit を中止し、画面上部へスクロールする。
- 分岐:
  - a. form または email が存在しない場合: 初期化しない。
  - b. name が未入力または危険文字を含む場合: nameError を表示する。
  - c. name に数字が含まれる場合: nameNumberError を表示する。
  - d. kana が全角カナでない場合: kanaError を表示する。
  - e. tel が 10 桁または 11 桁数字でない場合: telError を表示する。
  - f. email がメール形式でない場合: emailError を表示する。
  - g. pref が未入力または危険文字を含む場合: prefError を表示する。
  - h. usage 未選択の場合: usageError を表示する。
  - i. category 未選択の場合: categoryError を表示する。
  - j. いずれかに不正がある場合: event.preventDefault を実行する。

#### 4.2.7 initContactConfirmPage
- 1. 問い合わせ確認画面反映処理
- I/F:
  - 入力: window.location.search
  - 出力: displayName などの確認画面表示更新
- 設定値:
  - 未入力代替: AppConstants.defaults.emptyText
  - 未選択代替: AppConstants.defaults.emptySelect
- 処理:
  1. URLSearchParams を生成する。
  2. name, kana, tel, email, pref, usage, category を取得する。
  3. writeText で表示欄へ反映する。
  4. message は textarea へ値を設定する。
  5. data-action=go-back 要素に history.back を紐付ける。
- 分岐:
  - a. パラメータが存在する場合: その値を表示する。
  - b. パラメータが未設定の場合: 未入力 または 未選択 を表示する。

#### 4.2.8 initCartPage
- 1. カート画面初期化処理
- I/F:
  - 入力: cartContent, futureShopCart
  - 出力: カート DOM 再描画、数量更新、削除処理
- 設定値:
  - 保存先: AppConstants.storageKeys.cart
- 処理:
  1. cartContent コンテナを取得する。
  2. 画面内ローカル関数 renderCart を定義する。
  3. change イベントで数量入力変更を受け付ける。
  4. click イベントで削除操作を受け付ける。
  5. 初回描画として renderCart を実行する。
- 分岐:
  - a. cartContent が存在しない場合: 初期化しない。
  - b. カートが空の場合: 空カート案内を表示する。
  - c. カートに商品がある場合: 商品一覧と合計金額を表示する。
  - d. change 対象が数量入力でない場合: 更新しない。
  - e. index が不正または該当商品が存在しない場合: 更新しない。
  - f. click 対象が削除ボタンである場合: 対象商品を splice して再描画する。

##### 1-1. renderCart
- I/F:
  - 入力: futureShopCart
  - 出力: cartContent.innerHTML
- 設定値:
  - 合計計算: CartService.calculateTotal
  - 行描画: UIComponents.renderCartRows
- 処理:
  1. localStorage からカート配列を取得する。
  2. 商品がなければ空状態 HTML を描画する。
  3. 商品がある場合は合計金額を算出する。
  4. カート行 HTML と合計エリアを描画する。

#### 4.2.9 initCheckoutPage
- 1. 購入画面初期化処理
- I/F:
  - 入力: .radio-item, summaryList, summaryTotal, name, email, zip, address, payment
  - 出力: 注文サマリ表示、adminOrders 更新、checkout-complete.html への遷移
- 設定値:
  - 注文保存先: AppConstants.storageKeys.adminOrders
  - カート保存先: AppConstants.storageKeys.cart
  - 初期ステータス: 準備中
- 処理:
  1. 支払方法 UI の選択状態切替イベントを登録する。
  2. loadSummary を定義し、カート内容からサマリを描画する。
  3. 注文ボタン押下時にエラー表示を初期化する。
  4. 名前、メール、郵便番号、住所、支払方法を検証する。
  5. エラーがなければカートと既存注文履歴を取得する。
  6. 注文オブジェクトを先頭追加する。
  7. adminOrders を保存し、futureShopCart を削除する。
  8. 完了画面へ遷移する。
- 分岐:
  - a. カートが空の場合: loadSummary は 商品は未選択です と ¥0 を表示する。
  - b. カートがある場合: 商品別小計と合計を表示する。
  - c. 名前未入力の場合: nameError に ご入力が必要です を表示する。
  - d. 名前が許可文字以外を含む場合: nameError に形式エラー文言を表示する。
  - e. email, zip, address, payment のいずれかが不正な場合: 各 error を表示する。
  - f. いずれかに不正がある場合: 注文保存せず処理終了する。
  - g. 正常な場合: 注文履歴保存後に完了画面へ遷移する。

##### 1-1. loadSummary
- I/F:
  - 入力: futureShopCart
  - 出力: summaryList.innerHTML, summaryTotal.textContent
- 設定値:
  - 合計計算: CartService.calculateTotal
- 処理:
  1. カート内容と表示領域を取得する。
  2. 表示領域が無ければ終了する。
  3. カートが空なら未選択表示を行う。
  4. 商品ごとに小計行を生成する。
  5. 合計金額を算出して画面へ反映する。

#### 4.2.10 writeText
- 1. 確認画面テキスト反映処理
- I/F:
  - 入力: elementId, value
  - 出力: 対象要素 textContent 更新
- 処理:
  1. elementId の要素を取得する。
  2. 要素が存在する場合だけ textContent を設定する。

#### 4.2.11 showError
- 1. エラー表示処理
- I/F:
  - 入力: errorId, inputElement
  - 出力: エラー表示、入力欄強調
- 処理:
  1. errorId の要素を取得する。
  2. 要素が存在する場合は display=block を設定する。
  3. inputElement が指定されている場合は is-error class を付与する。

#### 4.2.12 showTextError
- 1. エラーメッセージ上書き処理
- I/F:
  - 入力: errorId, message
  - 出力: エラーメッセージ表示更新
- 処理:
  1. errorId の要素を取得する。
  2. 要素が無い場合は終了する。
  3. メッセージを書き込み display=block を設定する。

### 4.3 CartService クラス

#### 4.3.1 normalizeQuantity
- 1. 数量正規化処理
- I/F:
  - 入力: value
  - 出力: 1 以上の整数
- 設定値:
  - 最小値: 1
- 処理:
  1. Number.parseInt で整数変換する。
  2. 変換失敗時は 1 を使う。
  3. Math.max で最低値を 1 に補正する。
- 分岐:
  - a. 数値変換できる場合: 変換値を返す。
  - b. 変換できない、または 1 未満の場合: 1 を返す。

#### 4.3.2 calculateTotal
- 1. 合計金額計算処理
- I/F:
  - 入力: cart 配列
  - 出力: 総額
- 処理:
  1. reduce で全商品を走査する。
  2. 各商品について price と quantity を数値化して乗算する。
  3. 合計値を返す。

### 4.4 UIComponents クラス

#### 4.4.1 showAddToCartNotice
- 1. カート追加通知表示処理
- I/F:
  - 入力: document.body
  - 出力: 一時通知 DOM の追加と削除
- 設定値:
  - パーティクル数: 25
  - 表示時間: 1800ms
- 処理:
  1. 通知ボックスとサブタイトルを生成する。
  2. スタイルを直接設定して body に追加する。
  3. setTimeout でフェードインさせる。
  4. 25 個の粒子を生成し、ランダム方向へ飛散させる。
  5. 一定時間後に通知ボックスをフェードアウトし削除する。

#### 4.4.2 renderCartRows
- 1. カート行 HTML 生成処理
- I/F:
  - 入力: cart 配列
  - 出力: HTML 文字列
- 設定値:
  - エスケープ: XSSProtection.escape
- 処理:
  1. 配列を map で走査する。
  2. 商品アイコン、商品名、価格、数量入力、削除ボタンを含む HTML を生成する。
  3. 文字列結合して返す。

### 4.5 Header クラス

#### 4.5.1 initMobileMenu
- 1. モバイルメニュー開閉処理
- I/F:
  - 入力: menuButtonId, navId
  - 出力: open class の付与・除去
- 設定値:
  - 既定ボタン ID: menu-btn
  - 既定ナビ ID: main-nav
- 処理:
  1. ボタンとナビ要素を取得する。
  2. ボタン押下時に open class を toggle する。
  3. ナビリンク押下時に open class を除去する。
- 分岐:
  - a. button または nav が無い場合: 初期化しない。

#### 4.5.2 initScrollClass
- 1. スクロール連動ヘッダー処理
- I/F:
  - 入力: selector, className, threshold
  - 出力: className の付与・除去
- 設定値:
  - 既定 selector: header
  - 既定 className: scrolled
  - 既定 threshold: 50
- 処理:
  1. 対象ヘッダーを取得する。
  2. handleScroll を定義する。
  3. scroll イベントを登録する。
  4. 初期表示時にも handleScroll を 1 回実行する。
- 分岐:
  - a. window.scrollY が threshold より大きい場合: className を追加する。
  - b. それ以外の場合: className を除去する。

### 4.6 Footer クラス

#### 4.6.1 setYear
- 1. 年表示更新処理
- I/F:
  - 入力: selector
  - 出力: 対象要素 textContent
- 設定値:
  - 既定 selector: [data-current-year]
- 処理:
  1. 対象要素を取得する。
  2. 現在年を文字列化して反映する。
- 分岐:
  - a. 対象要素が無い場合: 何もしない。

### 4.7 StyleManager クラス

#### 4.7.1 initCursorGlow
- 1. カーソル発光追従処理
- I/F:
  - 入力: selector, mousemove event
  - 出力: CSS 変数 --x, --y 更新
- 設定値:
  - 既定 selector: #cursor-glow
- 処理:
  1. 発光要素を取得する。
  2. mousemove 時に座標を CSS 変数へ反映する。
- 分岐:
  - a. 対象要素が無い場合: 初期化しない。

#### 4.7.2 initTilt
- 1. ティルト演出処理
- I/F:
  - 入力: selector, mousemove, touchmove
  - 出力: transform 更新
- 設定値:
  - 既定 selector: .js-tilt, .js-tilt-hero
  - ヒーロー power: 45
  - 通常 power: 35
- 処理:
  1. 対象要素群を取得する。
  2. 要素ごとに applyTilt を定義する。
  3. マウス移動とタッチ移動で傾きを反映する。
  4. 離脱時に transform を初期化する。
- 分岐:
  - a. 要素が js-tilt-hero の場合: power を 45 とする。
  - b. それ以外の場合: power を 35 とする。
  - c. touchmove で touch 情報が無い場合: 更新しない。

#### 4.7.3 initMagnet
- 1. マグネット演出処理
- I/F:
  - 入力: selector, mousemove
  - 出力: transform 更新
- 設定値:
  - 既定 selector: .js-mgt
- 処理:
  1. 対象要素群を取得する。
  2. mousemove 時に中心からの差分で移動量を算出する。
  3. transform に translate と scale を設定する。
  4. mouseleave 時に transform をリセットする。

#### 4.7.4 initReveal
- 1. スクロール表示演出処理
- I/F:
  - 入力: selector, IntersectionObserver
  - 出力: active class 付与
- 設定値:
  - 既定 selector: .reveal
  - 監視閾値: 0.1
- 処理:
  1. 対象要素を取得する。
  2. IntersectionObserver を生成する。
  3. 可視領域に入った要素へ active class を付与する。
  4. 全対象を監視登録する。
- 分岐:
  - a. 対象要素が 0 件の場合: 初期化しない。
  - b. entry.isIntersecting が true の場合: active class を追加する。

### 4.8 Validator クラス

#### 4.8.1 safeNameRegex
- 1. 氏名・住所系許可文字定義
- 内容:
  - 英字
  - 半角空白
  - ひらがな
  - カタカナ
  - 漢字
  - 一部和文記号
- 実装パターン:
  - `/^[a-zA-Z\s\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u3000-\u303f]+$/`
  - \u3040-\u309f: ひらがな範囲
  - \u30a0-\u30ff: カタカナ範囲
  - \u4e00-\u9faf: CJK 統合漢字範囲
  - \u3000-\u303f: 和文記号・句読点範囲

#### 4.8.2 isRequired
- 1. 必須入力判定処理
- I/F:
  - 入力: value
  - 出力: boolean
- 処理:
  1. value を文字列化する。
  2. trim 後に空でなければ true を返す。

#### 4.8.3 isSafeText
- 1. 許可文字判定処理
- I/F:
  - 入力: value
  - 出力: boolean
- 処理:
  1. value を文字列化する。
  2. safeNameRegex に一致するか判定する。

#### 4.8.4 hasNumber
- 1. 数字含有判定処理
- I/F:
  - 入力: value
  - 出力: boolean
- 処理:
  1. 数字 0-9 を含むか正規表現で判定する。

#### 4.8.5 isKana
- 1. カナ形式判定処理
- I/F:
  - 入力: value
  - 出力: boolean
- 処理:
  1. 全角カタカナ、長音、空白のみで構成されるか判定する。
- 実装パターン:
  - `/^[ァ-ヶー\s]+$/`
  - ァ-ヶ: 小文字カタカナ ァ(U+30A1) から ヶ(U+30F6) の全角カナ範囲
  - ー: 長音符 (U+30FC)
  - \s: 空白文字

#### 4.8.6 isTel
- 1. 電話番号形式判定処理
- I/F:
  - 入力: value
  - 出力: boolean
- 処理:
  1. ハイフンを除去する。
  2. 10 桁または 11 桁数字か判定する。
- 実装パターン:
  - 前処理: `String(value).replace(/-/g, "")` でハイフンを除去する
  - 判定: `/^\d{10,11}$/` ← 10桁（固定電話）または11桁（携帯）

#### 4.8.7 isEmail
- 1. メールアドレス形式判定処理
- I/F:
  - 入力: value
  - 出力: boolean
- 処理:
  1. ローカル部@ドメイン部の形式を正規表現で判定する。
- 実装パターン:
  - `/^[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/`
  - RFC 5321 に沿ったローカル部許可文字セット
  - ドメイン部はラベルをドットで区切った形式

#### 4.8.8 isZip
- 1. 郵便番号形式判定処理
- I/F:
  - 入力: value
  - 出力: boolean
- 処理:
  1. 3 桁-4 桁、またはハイフンなし 7 桁か判定する。
- 実装パターン:
  - `/^\d{3}-?\d{4}$/`
  - `-?` でハイフン有無の両形式を許容する

### 4.9 XSSProtection クラス

#### 4.9.1 escape
- 1. HTML エスケープ処理
- I/F:
  - 入力: value
  - 出力: エスケープ済み文字列
- 設定値:
  - 変換対象: &, <, >, ", '
- 処理:
  1. null または undefined の場合は空文字を返す。
  2. 文字列化した値に対し危険文字を置換する。
- 変換テーブル:
  - `&` → `&amp;`
  - `<` → `&lt;`
  - `>` → `&gt;`
  - `"` → `&quot;`
  - `'` → `&#39;`
- 実装パターン:
  - `/[&<>"']/g` でマッチし、対応エンティティに置換する

#### 4.9.2 normalizeFullWidthAscii
- 1. 全角英数字正規化処理
- I/F:
  - 入力: value
  - 出力: 半角正規化済み文字列
- 処理:
  1. 全角英字・数字・記号を半角へ変換する。
  2. 全角長音「ー」をハイフン「-」へ変換する。
  3. 全角スペースと半角スペースを除去する。
- 実装パターン:
  - `/[Ａ-Ｚａ-ｚ０-９＠．]/g` をマッチし `charCode - 0xFEE0` で半角変換
  - `/ー/g` → `-`
  - `/[ \u3000]/g` → `""`（スペース除去）

## 5. 主要 DOM セレクター一覧

### 5.1 共通 (全画面)
| セレクター | 種別 | 役割 |
|---|---|---|
| `.js-nav` | class | ナビゲーション遷移トリガー |
| `data-href` | 属性 | 遷移先 HTML ファイル名 |
| `[data-current-year]` | 属性 | 年表示箇所 |

### 5.2 index.html (トップ)
| セレクター | 種別 | 役割 |
|---|---|---|
| `#main-header` | id | スクロール連動ヘッダー |
| `#menu-btn` | id | モバイルメニュートグルボタン |
| `#main-nav` | id | モバイルメニュー展開対象 |
| `#cursor-glow` | id | カーソル発光追従要素 |
| `#loginId` | id | ログイン ID 入力欄 |
| `#loginPass` | id | ログイン パスワード入力欄 |
| `.js-tilt` | class | 商品カードティルト対象 |
| `.js-tilt-hero` | class | ヒーローティルト対象 |
| `.js-mgt` | class | マグネット演出対象 |
| `.reveal` | class | スクロール表示演出対象 |

### 5.3 商品ページ (hokkori-mug / aroma-candle / organic-linen)
| セレクター | 種別 | 役割 |
|---|---|---|
| `#quantity` | id | 数量選択セレクトボックス |
| `.btn-cart` | class | カート追加ボタン |

### 5.4 contact.html
| セレクター | 種別 | 役割 |
|---|---|---|
| `#contactForm` | id | 問い合わせフォーム |
| `#name` | id | 氏名入力欄 |
| `#kana` | id | フリガナ入力欄 |
| `#tel` | id | 電話番号入力欄 |
| `#email` | id | メールアドレス入力欄 |
| `#pref` | id | 都道府県入力欄 |
| `input[name="usage"]` | 属性 | 利用目的ラジオボタン |
| `input[name="category"]` | 属性 | お問い合わせ種別セレクト |
| `#nameError` | id | 氏名エラー表示 |
| `#nameNumberError` | id | 氏名数字エラー表示 |
| `#kanaError` | id | フリガナエラー表示 |
| `#telError` | id | 電話番号エラー表示 |
| `#emailError` | id | メールエラー表示 |
| `#prefError` | id | 都道府県エラー表示 |
| `#usageError` | id | 利用目的エラー表示 |
| `#categoryError` | id | 種別エラー表示 |

### 5.5 contact-confirm.html
| セレクター | 種別 | 役割 |
|---|---|---|
| `#displayName` | id | 氏名確認表示 |
| `#displayKana` | id | フリガナ確認表示 |
| `#displayTel` | id | 電話番号確認表示 |
| `#displayEmail` | id | メール確認表示 |
| `#displayPref` | id | 都道府県確認表示 |
| `#displayUsage` | id | 利用目的確認表示 |
| `#displayCategory` | id | 種別確認表示 |
| `#displayMessage` | id | メッセージ確認 textarea |
| `[data-action="go-back"]` | 属性 | 前画面戻るボタン |

### 5.6 cart.html
| セレクター | 種別 | 役割 |
|---|---|---|
| `#cartContent` | id | カート一覧描画コンテナ |

### 5.7 checkout.html
| セレクター | 種別 | 役割 |
|---|---|---|
| `#name` | id | 注文者名入力欄 |
| `#email` | id | 注文者メール入力欄 |
| `#zip` | id | 郵便番号入力欄 |
| `#address` | id | 住所入力欄 |
| `input[name="payment"]` | 属性 | 支払方法ラジオボタン |
| `#summaryList` | id | 注文商品一覧表示エリア |
| `#summaryTotal` | id | 合計金額表示 |
| `.btn-order` | class | 注文確定ボタン |
| `.radio-item` | class | 支払方法選択行 |
| `#nameError` | id | 名前エラー表示 |
| `#emailError` | id | メールエラー表示 |
| `#zipError` | id | 郵便番号エラー表示 |
| `#addressError` | id | 住所エラー表示 |
| `#paymentError` | id | 支払方法エラー表示 |

## 6. 非機能要件
- 実行環境: Chrome / Edge 最新版、ローカルサーバー経由
- 品質ゲート: npm run lint、npm test、GitHub Actions CI
- セキュリティ: 全 DOM 書き込みは XSSProtection.escape() を経由する
- 制約: サーバーサイドなし。localStorage のみでデータを保持する
- 分岐:
  - a. null または undefined の場合: 空文字を返す。
  - b. それ以外の場合: HTML エンティティへ変換する。

#### 4.9.2 normalizeFullWidthAscii
- 1. メール入力正規化処理
- I/F:
  - 入力: value
  - 出力: 半角正規化済み文字列
- 設定値:
  - 変換対象: Ａ-Ｚ, ａ-ｚ, ０-９, ＠, ．, ー, 全角空白
- 処理:
  1. 入力が空なら空文字を返す。
  2. 全角英数字と一部記号を半角へ変換する。
  3. 長音記号をハイフンへ変換する。
  4. 半角空白と全角空白を除去する。
- 分岐:
  - a. value が空の場合: 空文字を返す。
  - b. それ以外の場合: 正規化結果を返す。

## 5. ページ別処理一覧

### 5.1 トップ画面
- Main.init -> initHomePage
- Header.initMobileMenu
- Header.initScrollClass
- StyleManager.initCursorGlow
- StyleManager.initTilt
- StyleManager.initMagnet
- StyleManager.initReveal

### 5.2 商品詳細画面
- Main.init -> initProductPage
- CartService.normalizeQuantity
- localStorage.futureShopCart 更新
- UIComponents.showAddToCartNotice

### 5.3 問い合わせ画面
- Main.init -> initContactPage
- XSSProtection.normalizeFullWidthAscii
- Validator 各種判定
- Main.showError

### 5.4 問い合わせ確認画面
- Main.init -> initContactConfirmPage
- Main.writeText

### 5.5 カート画面
- Main.init -> initCartPage
- UIComponents.renderCartRows
- CartService.calculateTotal

### 5.6 購入画面
- Main.init -> initCheckoutPage
- loadSummary
- Validator 各種判定
- XSSProtection.escape
- localStorage.adminOrders 更新

## 6. 例外・制約
- localStorage が無効な環境ではカートと注文履歴が保持できない。
- サーバーとの通信は行わないため、注文データはブラウザ単位でのみ保持される。
- 注文番号は Math.random による簡易生成であり、重複防止保証は行っていない。
- マイページ.html は遷移制御のみ存在し、実体画面の認証連携は未実装である。

## 7. 保守方針
- 画面説明を変更する場合は SCREEN-OVERVIEW.md を更新する。
- 処理仕様を変更する場合は本 DESIGN.md を更新する。
- 商品追加時は CodeDefinitions と商品 HTML の両方を合わせて更新する。
- 管理画面連携項目を変更する場合は adminOrders の保存項目を mirai-shoten-admin 側と整合させる。
