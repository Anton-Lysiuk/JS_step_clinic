const reg = "https://ajax.test-danit.com/front-pages/cards-register.html";
import { Modal } from "./modal.js";
import "./createModal.js";

document.addEventListener("DOMContentLoaded", () => {
  const tokenFromStorage = localStorage.getItem("outh");
  if (tokenFromStorage) {
    const modalInstance = new Modal();
    modalInstance.setToken(tokenFromStorage); // Встановлюємо токен і змінюємо інтерфейс
  }
});

// Обробник кліку для кнопки входу
document.querySelector("#loginButton").addEventListener("click", () => {
  const register = new Modal();
  register.render();
});

// Обробник кліку для кнопки створення візиту
document.querySelector("#createButton").addEventListener("click", () => {
  console.log("hello");
});

class ButtonHandler {
  constructor() {
    this.buttons = document.querySelectorAll(".btn");
    this.setActiveButton();
  }

  setActiveButton() {
    this.buttons.forEach((button) => {
      if (!button.classList.contains("active-btn")) {
        button.style.display = "none";
      }
    });
  }
}

new ButtonHandler();
