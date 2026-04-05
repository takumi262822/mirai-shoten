/**
 * 数量値の正規化とカート合計金額の計算を担うサービスクラス。
 * @author Takumi Harada
 * @date 2026/3/31
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
