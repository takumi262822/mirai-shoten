/**
 * Application entry point and initialization class
 * @author Takumi Harada
 * @date 2026/3/31
 */
import { AppConstants } from "../constants/app-constants.js";
import { CodeDefinitions } from "../constants/code-definitions.js";
import { CartService } from "./cart-service.js";
import { StyleManager } from "../styles/style-manager.js";
import { Footer } from "../ui/footer.js";
import { Header } from "../ui/header.js";
import { UIComponents } from "../ui/components.js";
import { Validator } from "../utils/validator.js";
import { XSSProtection } from "../utils/xss.js";

/**
 * ページ別の初期化処理（商品詳細・問い合わせ・カート・購入）を分岐するエントリーポイントクラス。
 * @author Takumi Harada
 */
class Main {
  /**
   * 内部状態として現在のページ名と各 UI 管理クラスを保持する。
   * どの初期化処理を走らせるかは constructor で決めたページ名を基準に分岐する。
   */
  constructor() {
    this.currentPageName = decodeURIComponent(window.location.pathname.split("/").pop() || "index.html");
    this.styleManager = new StyleManager();
    this.header = new Header();
    this.footer = new Footer();
  }

  init() {
    this.footer.setYear();
    this.initNavigation();

    if (this.currentPageName === "index.html") {
      this.initHomePage();
    }

    if (CodeDefinitions.productsByPage[this.currentPageName]) {
      this.initProductPage();
    }

    if (this.currentPageName === "contact.html") {
      this.initContactPage();
    }

    if (this.currentPageName === "contact-confirm.html") {
      this.initContactConfirmPage();
    }

    if (this.currentPageName === "cart.html") {
      this.initCartPage();
    }

    if (this.currentPageName === "checkout.html") {
      this.initCheckoutPage();
    }
  }

  initNavigation() {
    document.querySelectorAll(".js-nav").forEach((element) => {
      element.addEventListener("click", () => {
        const targetPath = element.getAttribute("data-href") || "";
        // 指定パス以外への遷移は拒否（ホワイトリスト方式で開放リダイレクトを防ぐ）
        if (!AppConstants.allowedPaths.includes(targetPath)) {
          return;
        }

        if (targetPath === "マイページ.html") {
          const loginId = document.getElementById("loginId");
          const loginPass = document.getElementById("loginPass");
          if (!loginId || !loginPass) {
            return;
          }

          if (!Validator.isRequired(loginId.value) || !Validator.isRequired(loginPass.value)) {
            window.alert("IDとPASSWORDを入力してください。");
            return;
          }
        }

        window.location.assign(targetPath);
      });
    });
  }

  initHomePage() {
    this.header.initMobileMenu();
    this.header.initScrollClass("header", "scrolled", 50);
    this.styleManager.initCursorGlow();
    this.styleManager.initTilt();
    this.styleManager.initMagnet();
    this.styleManager.initReveal();
  }

  initProductPage() {
    const product       = CodeDefinitions.productsByPage[this.currentPageName];
    const quantityInput = document.getElementById("quantity");
    const addButton     = document.querySelector(".btn-cart");

    if (!product || !quantityInput || !addButton) {
      return;
    }

    addButton.addEventListener("click", () => {
      const quantity = CartService.normalizeQuantity(quantityInput.value);
      const cart     = JSON.parse(localStorage.getItem(AppConstants.storageKeys.cart) || "[]");
      const existingIndex = cart.findIndex((item) => item.id === product.id);

      if (existingIndex >= 0) {
        // 同じ商品がすでにカートに入っている場合は新規追加でなく数量だけ加算する
        cart[existingIndex].quantity += quantity;
      } else {
        cart.push({ ...product, quantity });
      }

      localStorage.setItem(AppConstants.storageKeys.cart, JSON.stringify(cart));
      UIComponents.showAddToCartNotice();
    });
  }

  initContactPage() {
    const form = document.getElementById("contactForm");
    const email = document.getElementById("email");

    if (!form || !email) {
      return;
    }

    email.addEventListener("blur", () => {
      email.value = XSSProtection.normalizeFullWidthAscii(email.value);
    });

    form.addEventListener("submit", (event) => {
      let isValid = true;

      document.querySelectorAll(".error-message").forEach((element) => {
        element.style.display = "none";
      });
      document.querySelectorAll("input").forEach((element) => {
        element.classList.remove("is-error");
      });

      const name = document.getElementById("name");
      const kana = document.getElementById("kana");
      const tel = document.getElementById("tel");
      const pref = document.getElementById("pref");

      if (!name || !kana || !tel || !pref) {
        return;
      }

      if (!Validator.isRequired(name.value) || !Validator.isSafeText(name.value)) {
        this.showError("nameError", name);
        isValid = false;
      } else if (Validator.hasNumber(name.value)) {
        this.showError("nameNumberError", name);
        isValid = false;
      }

      if (!Validator.isKana(kana.value)) {
        this.showError("kanaError", kana);
        isValid = false;
      }

      if (!Validator.isTel(tel.value)) {
        this.showError("telError", tel);
        isValid = false;
      }

      if (!Validator.isEmail(email.value)) {
        this.showError("emailError", email);
        isValid = false;
      }

      if (!Validator.isRequired(pref.value) || !Validator.isSafeText(pref.value)) {
        this.showError("prefError", pref);
        isValid = false;
      }

      if (!document.querySelector('input[name="usage"]:checked')) {
        this.showError("usageError");
        isValid = false;
      }

      if (!document.querySelector('input[name="category"]:checked')) {
        this.showError("categoryError");
        isValid = false;
      }

      if (!isValid) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  initContactConfirmPage() {
    const params = new URLSearchParams(window.location.search);

    this.writeText("displayName", params.get("name") || AppConstants.defaults.emptyText);
    this.writeText("displayKana", params.get("kana") || AppConstants.defaults.emptyText);
    this.writeText("displayTel", params.get("tel") || AppConstants.defaults.emptyText);
    this.writeText("displayEmail", params.get("email") || AppConstants.defaults.emptyText);
    this.writeText("displayPref", params.get("pref") || AppConstants.defaults.emptyText);
    this.writeText("displayUsage", params.get("usage") || AppConstants.defaults.emptySelect);
    this.writeText("displayCategory", params.get("category") || AppConstants.defaults.emptySelect);

    const message = document.getElementById("displayMessage");
    if (message) {
      message.value = params.get("message") || "";
    }

    document.querySelectorAll('[data-action="go-back"]').forEach((element) => {
      element.addEventListener("click", () => {
        window.history.back();
      });
    });
  }

  initCartPage() {
    const container = document.getElementById("cartContent");
    if (!container) {
      return;
    }

    // カート画面内だけで使う再描画処理を閉じ込め、外部状態を増やさないようにする。
    const renderCart = () => {
      const cart = JSON.parse(localStorage.getItem(AppConstants.storageKeys.cart) || "[]");

      if (!cart.length) {
        container.innerHTML = `
          <div class="empty-state">
            <div style="font-size: 4em; margin-bottom: 20px;">☁️</div>
            <p>カートはまだ空っぽです</p>
            <a href="index.html" class="btn-continue">お買い物をはじめる</a>
          </div>`;
        return;
      }

      const total = CartService.calculateTotal(cart);
      container.innerHTML = `
        <h2>Your Basket</h2>
        ${UIComponents.renderCartRows(cart)}
        <div class="summary-box">
          <div class="total-label">Estimated Total</div>
          <div class="total-price">\u00a5${total.toLocaleString()}</div>
          <a href="checkout.html" class="btn-checkout">ご購入手続きへ</a>
          <br>
          <a href="index.html" class="btn-continue">お買い物を続ける</a>
        </div>`;
    };

    container.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || target.dataset.action !== "updateQty") {
        return;
      }

      const index = Number.parseInt(target.dataset.index || "-1", 10);
      if (index < 0) {
        return;
      }

      const cart = JSON.parse(localStorage.getItem(AppConstants.storageKeys.cart) || "[]");
      const quantity = CartService.normalizeQuantity(target.value);
      if (!cart[index]) {
        return;
      }

      cart[index].quantity = quantity;
      localStorage.setItem(AppConstants.storageKeys.cart, JSON.stringify(cart));
      renderCart();
    });

    container.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement) || target.dataset.action !== "deleteItem") {
        return;
      }

      const index = Number.parseInt(target.dataset.index || "-1", 10);
      if (index < 0) {
        return;
      }

      const cart = JSON.parse(localStorage.getItem(AppConstants.storageKeys.cart) || "[]");
      cart.splice(index, 1);
      localStorage.setItem(AppConstants.storageKeys.cart, JSON.stringify(cart));
      renderCart();
    });

    renderCart();
  }

  initCheckoutPage() {
    const radioItems = document.querySelectorAll(".radio-item");
    radioItems.forEach((item) => {
      item.addEventListener("click", () => {
        radioItems.forEach((target) => target.classList.remove("selected"));
        item.classList.add("selected");
        const radio = item.querySelector('input[type="radio"]');
        if (radio) {
          radio.checked = true;
        }
      });
    });

    // 注文確認画面専用の集計処理として定義し、画面表示に必要な値をここで確定させる。
    const loadSummary = () => {
      const cart = JSON.parse(localStorage.getItem(AppConstants.storageKeys.cart) || "[]");
      const summaryList = document.getElementById("summaryList");
      const summaryTotal = document.getElementById("summaryTotal");
      if (!summaryList || !summaryTotal) {
        return;
      }

      if (!cart.length) {
        summaryList.innerHTML = "<div class='summary-item'>商品は未選択です</div>";
        summaryTotal.textContent = "\u00a50";
        return;
      }

      const rows = cart
        .map((item) => {
          const subtotal = Number(item.price) * Number(item.quantity);
          return `<div class="summary-item"><span>${XSSProtection.escape(item.name)} × ${XSSProtection.escape(item.quantity)}</span><span>\u00a5${subtotal.toLocaleString()}</span></div>`;
        })
        .join("");
      const total = CartService.calculateTotal(cart);

      summaryList.innerHTML = rows;
      summaryTotal.textContent = `\u00a5${total.toLocaleString()}`;
    };

    const orderButton = document.querySelector(".btn-order");
    if (orderButton) {
      orderButton.addEventListener("click", () => {
        document.querySelectorAll(".error-message").forEach((element) => {
          element.style.display = "none";
        });

        const name = document.getElementById("name");
        const email = document.getElementById("email");
        const zip = document.getElementById("zip");
        const address = document.getElementById("address");
        const payment = document.querySelector('input[name="payment"]:checked');

        if (!name || !email || !zip || !address) {
          return;
        }

        let hasError = false;

        if (!Validator.isRequired(name.value)) {
          this.showTextError("nameError", "ご入力が必要です");
          hasError = true;
        } else if (!Validator.isSafeText(name.value)) {
          this.showTextError("nameError", "お名前は漢字・ひらがな・英字のみで入力してください");
          hasError = true;
        }

        if (!Validator.isEmail(email.value)) {
          this.showError("emailError");
          hasError = true;
        }

        if (!Validator.isZip(zip.value)) {
          this.showError("zipError");
          hasError = true;
        }

        if (!Validator.isRequired(address.value)) {
          this.showError("addressError");
          hasError = true;
        }

        if (!payment) {
          this.showError("paymentError");
          hasError = true;
        }

        if (hasError) {
          return;
        }

        const cart = JSON.parse(localStorage.getItem(AppConstants.storageKeys.cart) || "[]");
        const allOrders = JSON.parse(localStorage.getItem(AppConstants.storageKeys.adminOrders) || "[]");
        const summaryTotal = document.getElementById("summaryTotal");

        allOrders.unshift({
          id: `#${Math.floor(1000 + Math.random() * 9000)}`,
          customer: XSSProtection.escape(name.value),
          email: XSSProtection.escape(email.value),
          address: `〒${XSSProtection.escape(zip.value)} ${XSSProtection.escape(address.value)}`,
          items: cart.map((item) => `${XSSProtection.escape(item.name)}(${XSSProtection.escape(item.quantity)})`).join(", "),
          price: summaryTotal ? summaryTotal.textContent : "\u00a50",
          status: "準備中",
          date: new Date().toLocaleString()
        });

        localStorage.setItem(AppConstants.storageKeys.adminOrders, JSON.stringify(allOrders));
        localStorage.removeItem(AppConstants.storageKeys.cart);
        window.location.assign("checkout-complete.html");
      });
    }

    loadSummary();
  }

  writeText(elementId, value) {
    const target = document.getElementById(elementId);
    if (target) {
      target.textContent = value;
    }
  }

  showError(errorId, inputElement) {
    const target = document.getElementById(errorId);
    if (target) {
      target.style.display = "block";
    }

    if (inputElement) {
      inputElement.classList.add("is-error");
    }
  }

  showTextError(errorId, message) {
    const target = document.getElementById(errorId);
    if (!target) {
      return;
    }

    target.textContent = message;
    target.style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new Main();
  app.init();
});
