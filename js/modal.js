import Filter from "./filter.js";
import { loadCardsFromServer } from "./createModal.js";
export class Modal {
  constructor() {
    this.token = null;
    this.checkAuthOnLoad(); // Додаємо перевірку авторизації при створенні об'єкта
  }

  checkAuthOnLoad() {
    const tokenFromStorage = localStorage.getItem("outh");
    if (tokenFromStorage) {
      this.setToken(tokenFromStorage);
    }
  }

  render() {
    if (!root) return;

    root.innerHTML = "";
    const template = document.querySelector("#template");
    if (!template) return;

    const form = template.content.cloneNode(true);
    root.append(form);

    const overlay = document.querySelector(".overlay");
    const closeButton = document.querySelector(".close-btn");
    const loginForm = document.querySelector(".form");
    const registerButton = document.querySelector(".btn_reg");

    if (closeButton) {
      closeButton.addEventListener("click", () => {
        overlay?.remove();
      });
    }

    if (overlay) {
      overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
          overlay.remove();
        }
      });
    }

    if (loginForm) {
      loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const email = document.querySelector("#email")?.value.trim();
        const password = document.querySelector("#password")?.value.trim();
        if (email && password) {
          const fetchInstance = new Fetch(this);
          fetchInstance.getToken(email, password);
        } else {
          alert("Будь ласка, введіть email та пароль");
        }
      });
    }

    if (registerButton) {
      registerButton.addEventListener("click", () => {
        window.open(
          "https://ajax.test-danit.com/front-pages/cards-register.html",
          "_blank"
        );
      });
    }
  }

  showAuthenticatedState() {
    const loginButton = document.querySelector("#loginButton");
    const createButton = document.querySelector("#createButton");
    const logOutBtn = document.querySelector("#logOutBtn");
    const noItemsText = document.querySelector("#NoItems");

    if (loginButton) loginButton.style.display = "none";
    if (createButton) createButton.style.display = "block";
    if (logOutBtn) logOutBtn.style.display = "block";

    // Показуємо текст "No items have been added"
    const filterContainer = document.getElementById("filter-container");
    filterContainer.classList.add = "filter-container";

    const filterForm = new Filter(filterContainer);
    filterForm.createForm();

    if (noItemsText) {
      noItemsText.style.display = "block";
    }

    if (logOutBtn) {
      logOutBtn.addEventListener("click", () => {
        this.logout();
      });
    }
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem("outh", token);
    console.log("Token saved in Modal:", this.token);

    const overlay = document.querySelector(".overlay");
    if (overlay) {
      overlay.remove();
    }

    this.showAuthenticatedState();
  }

  logout() {
    localStorage.removeItem("outh");
    this.token = null;
    console.log("Token removed and user logged out");

    const loginButton = document.querySelector("#loginButton");
    const createButton = document.querySelector("#createButton");
    const logOutBtn = document.querySelector("#logOutBtn");
    const noItemsText = document.querySelector("#NoItems");

    if (loginButton) loginButton.style.display = "block";
    if (createButton) createButton.style.display = "none";
    if (logOutBtn) logOutBtn.style.display = "none";

    // При виході приховуємо текст "No items have been added"
    if (noItemsText) {
      noItemsText.style.display = "none";
    }
    const filterContainer = document.getElementById("filter-container");
    filterContainer.classList.add = "filter-container";

    window.location.reload();
  }
}

class Fetch {
  constructor(modalInstance) {
    this.modal = modalInstance;
  }

  getToken(email, password) {
    fetch("https://ajax.test-danit.com/api/v2/cards/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Incorrect login or password");
        }
        return response.text();
      })
      .then((token) => {
        this.modal.setToken(token);
        loadCardsFromServer();
      })
      .catch((error) => {
        alert("Неправильний логін або пароль");
        location.reload();
        console.error("Error:", error);
      });
  }
}
