/**
 * モバイルメニューの開閉とスクロール時のヘッダースタイル切替を担う UI クラス。
 * @author Takumi Harada
 */
export class Header {
  initMobileMenu(menuButtonId = "menu-btn", navId = "main-nav") {
    const button = document.getElementById(menuButtonId);
    const nav = document.getElementById(navId);

    if (!button || !nav) {
      return;
    }

    button.addEventListener("click", () => {
      nav.classList.toggle("open");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
      });
    });
  }

  initScrollClass(selector = "header", className = "scrolled", threshold = 50) {
    const header = document.querySelector(selector);
    if (!header) {
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > threshold) {
        header.classList.add(className);
      } else {
        header.classList.remove(className);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
  }
}
