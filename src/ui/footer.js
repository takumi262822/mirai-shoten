/**
 * @author Takumi Harada
 * @date 2026-03-31
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
