import { XSSProtection } from "../utils/xss.js";

/**
 * カート追加通知・注文表示など EC 画面共通の DOM 部品を生成・更新するクラス。
 * @author Takumi Harada
 */
export class UIComponents {
  static showAddToCartNotice() {
    const box = document.createElement("div");
    const subTitle = document.createElement("span");
    subTitle.textContent = "THANK YOU";
    Object.assign(subTitle.style, {
      fontSize: "0.6em",
      letterSpacing: "5px",
      display: "block",
      marginBottom: "10px"
    });

    box.appendChild(subTitle);
    box.appendChild(document.createTextNode("Added to Collection"));

    Object.assign(box.style, {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%) scale(0.8)",
      background: "rgba(255,255,255,0.15)",
      backdropFilter: "blur(40px)",
      webkitBackdropFilter: "blur(40px)",
      padding: "50px 80px",
      borderRadius: "40px",
      border: "1px solid rgba(255,255,255,0.4)",
      boxShadow: "0 30px 80px rgba(0,0,0,0.2)",
      zIndex: "3000",
      textAlign: "center",
      fontSize: "1.4em",
      fontWeight: "200",
      color: "#fff",
      opacity: "0",
      transition: "all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)",
      pointerEvents: "none"
    });

    document.body.appendChild(box);

    setTimeout(() => {
      box.style.opacity = "1";
      box.style.transform = "translate(-50%, -50%) scale(1)";
    }, 10);

    for (let i = 0; i < 25; i += 1) {
      const particle = document.createElement("div");
      Object.assign(particle.style, {
        position: "fixed",
        top: "50%",
        left: "50%",
        width: "3px",
        height: "3px",
        background: "#fff",
        borderRadius: "50%",
        zIndex: "3001",
        pointerEvents: "none",
        transition: "all 1.2s cubic-bezier(0.1, 0.5, 0.1, 1)"
      });

      document.body.appendChild(particle);
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 250 + 50;

      setTimeout(() => {
        particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
        particle.style.opacity = "0";
        setTimeout(() => particle.remove(), 1200);
      }, 10);
    }

    setTimeout(() => {
      box.style.opacity = "0";
      box.style.transform = "translate(-50%, -50%) scale(1.1)";
      setTimeout(() => box.remove(), 600);
    }, 1800);
  }

  static renderCartRows(cart) {
    return cart
      .map((item, index) => {
        return `
          <div class="cart-card">
            <div class="product-icon">${XSSProtection.escape(item.image)}</div>
            <div class="product-main">
              <div class="product-name">${XSSProtection.escape(item.name)}</div>
              <div class="product-price">\u00a5${Number(item.price).toLocaleString()}</div>
            </div>
            <div class="qty-controls">
              <input type="number" class="qty-input" value="${XSSProtection.escape(item.quantity)}" min="1" data-action="updateQty" data-index="${index}">
              <button class="btn-delete" data-action="deleteItem" data-index="${index}">削除</button>
            </div>
          </div>`;
      })
      .join("");
  }
}
