/**
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * XSSProtection クラス
 * 目的: XSS対策を担当し表示データを安全化する
 * 入力: ユーザー入力値・表示対象文字列
 * 処理: 危険文字のエスケープや正規化を行う
 * 出力: 安全化された文字列
 * 補足: DOM反映前に本クラスを経由する
 * @author Takumi Harada
 * @date 2026-04-01
 */
export class XSSProtection {
  static escape(value) {
    if (value === null || value === undefined) {
      return "";
    }

    return String(value).replace(/[&<>"']/g, (ch) => {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[ch];
    });
  }

  static normalizeFullWidthAscii(value) {
    if (!value) {
      return "";
    }

    return String(value)
      .replace(/[Ａ-Ｚａ-ｚ０-９＠．]/g, (ch) => {
        return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0);
      })
      .replace(/ー/g, "-")
      .replace(/[ \u3000]/g, "");
  }
}
