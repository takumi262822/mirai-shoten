/**
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * Footer クラス
 * 目的: UI部品の生成・更新を担当する
 * 入力: 表示データ・DOM要素・操作イベント
 * 処理: 画面要素を生成/更新し必要なイベントを接続する
 * 出力: 更新されたUI表示
 * 補足: ビジネスロジックは別クラスに分離する
 * @author Takumi Harada
 * @date 2026-04-01
 */
/**
 * 処理概要:
 * - 入力値: 年表示先のセレクタ
 * - 更新処理: 現在年を算出して対象要素へ書き込む
 * - 出力処理: フッター表記を毎年手修正しなくても済む状態にする
 */
export class Footer {
  setYear(selector = "[data-current-year]") {
    const target = document.querySelector(selector);
    if (!target) {
      return;
    }

    target.textContent = String(new Date().getFullYear());
  }
}
