/**
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * Validator クラス
 * 目的: 入力検証を担当し判定ルールを統一する
 * 入力: フォーム入力値・データオブジェクト
 * 処理: 形式/範囲/必須条件を検証して真偽値を返す
 * 出力: 検証結果（boolean）
 * 補足: 画面側でエラー表示制御と組み合わせて利用する
 * @author Takumi Harada
 * @date 2026-04-01
 */
export class Validator {
  static safeNameRegex = /^[a-zA-Z\s\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u3000-\u303f]+$/;

  static isRequired(value) {
    return Boolean(String(value || "").trim());
  }

  static isSafeText(value) {
    return this.safeNameRegex.test(String(value || ""));
  }

  static hasNumber(value) {
    return /\d/.test(String(value || ""));
  }

  static isKana(value) {
    return /^[ァ-ヶー\s]+$/.test(String(value || ""));
  }

  static isTel(value) {
    const compact = String(value || "").replace(/-/g, "");
    return /^\d{10,11}$/.test(compact);
  }

  static isEmail(value) {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(String(value || ""));
  }

  static isZip(value) {
    return /^\d{3}-?\d{4}$/.test(String(value || ""));
  }
}
