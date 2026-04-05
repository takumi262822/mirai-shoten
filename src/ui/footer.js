/**
 * フッターの年表示要素に現在年を通年新更する UI クラス。
 * @author Takumi Harada
 * @date 2026/3/31
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
