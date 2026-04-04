/**
 * カーソル発光・3Dティルト・マグネット・リビールなどトップページの視覚演出を初期化・制御するクラス。
 * @author Takumi Harada
 */
export class StyleManager {
  initCursorGlow(selector = "#cursor-glow") {
    const glow = document.querySelector(selector);
    if (!glow) {
      return;
    }

    window.addEventListener("mousemove", (event) => {
      glow.style.setProperty("--x", `${event.clientX}px`);
      glow.style.setProperty("--y", `${event.clientY}px`);
    });
  }

  initTilt(selector = ".js-tilt, .js-tilt-hero") {
    document.querySelectorAll(selector).forEach((element) => {
      const applyTilt = (clientX, clientY) => {
        const rect = element.getBoundingClientRect();
        const x = (clientX - rect.left) / rect.width - 0.5;
        const y = (clientY - rect.top) / rect.height - 0.5;
        const power = element.classList.contains("js-tilt-hero") ? 45 : 35;
        element.style.transform = `perspective(1200px) rotateY(${x * power}deg) rotateX(${-y * power}deg) translateY(-5px)`;
      };

      element.addEventListener("mousemove", (event) => {
        applyTilt(event.clientX, event.clientY);
      });

      element.addEventListener("touchmove", (event) => {
        if (!event.touches[0]) {
          return;
        }
        applyTilt(event.touches[0].clientX, event.touches[0].clientY);
      });

      element.addEventListener("mouseleave", () => {
        element.style.transform = "";
      });

      element.addEventListener("touchend", () => {
        element.style.transform = "";
      });
    });
  }

  initMagnet(selector = ".js-mgt") {
    document.querySelectorAll(selector).forEach((element) => {
      element.addEventListener("mousemove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.7;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.7;
        element.style.transform = `translate(${x}px, ${y}px) scale(1.1)`;
      });

      element.addEventListener("mouseleave", () => {
        element.style.transform = "";
      });
    });
  }

  initReveal(selector = ".reveal") {
    const targets = document.querySelectorAll(selector);
    if (!targets.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1 }
    );

    targets.forEach((target) => observer.observe(target));
  }
}
