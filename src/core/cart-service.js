/**
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * CartService クラス
 * 目的: アプリ/ゲームの進行制御を担当する
 * 入力: 初期データ・現在状態・ユーザー操作
 * 処理: 初期化・分岐・状態更新を実行する
 * 出力: 進行更新された画面状態
 * 補足: 各下位クラスの責務を束ねる
 * @author Takumi Harada
 * @date 2026-04-01
 */
/**
 * 処理概要:
 * - 入力値: 数量入力値またはカート配列
 * - 計算処理: 数量の正規化と商品金額合計の算出を担当する
 * - 出力処理: カート保存前に使える安全な数量値と総額を返す
 */
export class CartService {
  static normalizeQuantity(value) {
    return Math.max(1, Number.parseInt(value, 10) || 1);
  }

  static calculateTotal(cart) {
    return cart.reduce((sum, item) => {
      return sum + Number(item.price) * Number(item.quantity);
    }, 0);
  }
}
