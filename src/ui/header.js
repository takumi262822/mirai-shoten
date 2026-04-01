/**
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * Header クラス
 * 目的: UI部品の生成・更新を担当する
 * 入力: 表示データ・DOM要素・操作イベント
 * 処理: 画面要素を生成/更新し必要なイベントを接続する
 * 出力: 更新されたUI表示
 * 補足: ビジネスロジックは別クラスに分離する
 * @author Takumi Harada
 * @date 2026-04-01
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
