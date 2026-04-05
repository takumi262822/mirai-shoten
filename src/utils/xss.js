/**
 * HTML 特殊文字をエンティティに変換し XSS を防ぐサニタイズクラス。全角英数字の正規化も担う。
 * @author Takumi Harada
 * @date 2026/3/31
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
