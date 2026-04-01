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
export class Footer {
  setYear(selector = "[data-current-year]") {
    const target = document.querySelector(selector);
    if (!target) {
      return;
    }

    target.textContent = String(new Date().getFullYear());
  }
}
