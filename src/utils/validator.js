/**
 * 氏名・フリガナ・電話番号・メールアドレスの形式チェックを担うバリデーションクラス。
 * @author Takumi Harada
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
