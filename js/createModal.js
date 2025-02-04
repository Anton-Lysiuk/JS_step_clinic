import { Api } from "./api.js";
import {
  VisitModal,
  Visit,
  VisitDentist,
  VisitCardiologist,
  VisitTherapist,
} from "./classes.js";
import dragAndDrop from "./drag&drop.js";

const modalContent = document.querySelector(".create-modal__content");
const createButton = document.querySelector("#createButton");
let activeCardId = null;
const api = new Api();
const modal = new VisitModal(document.querySelector("#createModal"));
const fieldNames = {
  purpose: "Мета візиту",
  description: "Опис візиту",
  fullName: "ПІБ",
  bloodPressure: "Тиск",
  bmi: "Індекс маси тіла",
  heartDiseases: "Перенесені захворювання",
  age: "Вік",
  lastVisitDate: "Дата останнього відвідування",
};

// Функція створення модального вікна
function creatingModalWindow() {
  const closeButtonModal = modalContent.querySelector(".close");
  const formDoctors = modalContent.querySelector("#formDoctors");
  const doctorDropdown = formDoctors.querySelector("#doctor");
  const uniqueFields = formDoctors.querySelector("#uniqueFields");

  createButton.addEventListener("click", function () {
    modal.open();
    activeCardId = null;
    formDoctors.reset();
    uniqueFields.innerHTML = "";
  });

  closeButtonModal.addEventListener("click", function () {
    modal.close();
  });

  // Показ додаткових полів при вибору лікаря
  doctorDropdown.addEventListener("change", function () {
    const doctor = this.value;
    uniqueFields.innerHTML = Visit.generateUniqueFields(doctor);
  });

  // Створення кастомного alert
  function getAlert(text) {
    const previousAlert = document.querySelector(".alert__wrapper");
    if (previousAlert) {
      previousAlert.remove();
    }
    const wrapper = document.createElement("div");
    wrapper.classList.add("alert__wrapper");
    const alertText = document.createElement("p");
    alertText.classList.add("alert__text");
    alertText.textContent = text;
    const closeAlert = document.createElement("button");
    closeAlert.textContent = "×";
    closeAlert.addEventListener("click", () => {
      wrapper.remove();
    });
    wrapper.append(alertText, closeAlert);
    document.body.prepend(wrapper);
    setTimeout(() => {
      wrapper.remove();
    }, 4000);
  }

  // Обробка форми при створенні або редагуванні картки
  formDoctors.addEventListener("submit", function (event) {
    event.preventDefault();

    // Валідація форми
    if (!doctorDropdown.value) {
      getAlert("Оберіть необхідного лікаря!");
      return;
    }

    // Перевірка полів на зміст значень
    const requiredFields = [...formDoctors.querySelectorAll("input, textarea")];
    const invalidRequiredField = requiredFields.find(
      (field) => !field.value.trim()
    );
    if (invalidRequiredField) {
      if (invalidRequiredField.type !== "date") {
        getAlert(
          `введіть що найменш 1 символ у полі ${
            fieldNames[invalidRequiredField.name]
          }`
        );
        return;
      } else {
        getAlert(
          `Оберіть дату візиту у полі ${fieldNames[invalidRequiredField.name]}`
        );
        return;
      }
    }

    // Перевірка полів з додатковими умовами
    for (let field of requiredFields) {
      switch (field.name) {
        case "description":
          if (field.value.length > 60) {
            getAlert(
              `У полі ${
                fieldNames[field.name]
              } не повинно бути більше 60 символів!`
            );
            return
          }
          break;
        case "fullName":
          if (!/[a-zа-я]/gi.test(field.value)) {
            console.log("pon")
            getAlert(
              `У полі ${
                fieldNames[field.name]
              } символи повинні бути або латинськими або кирилицею!`
            );
            return
          }
          break;
        case "bloodPressure":
          if (isNaN(field.value)) {
            getAlert(
              `У полі ${fieldNames[field.name]} введіть числове значення!`
            );
            return;
          }
          if (field.value < 50 || field.value > 160) {
            getAlert(`Тиск має бути у межах від 50 до 160 включно!`);
            return;
          }
          break;
        case "bmi":
          if (isNaN(field.value)) {
            getAlert(
              `У полі ${fieldNames[field.name]} введіть числове значення!`
            );
            return;
          }
          if (field.value > 70) {
            getAlert(`Будь ласка введіть Індекс маси тіла до 65!`);
            return;
          }
          break;
        case "age":
          if (isNaN(field.value)) {
            getAlert(
              `У полі ${fieldNames[field.name]} введіть числове значення!`
            );
            return;
          }
          break;
      }
    }

    const visitData = {};
    formDoctors.querySelectorAll("input, select, textarea").forEach((field) => {
      visitData[field.name] = field.value;
    });

    let visitCard;
    switch (visitData.doctor) {
      case "cardiologist":
        visitCard = new VisitCardiologist({
          doctor: visitData.doctor,
          purpose: visitData.purpose,
          description: visitData.description,
          urgency: visitData.urgency,
          fullName: visitData.fullName,
          status: visitData.status,
          bloodPressure: visitData.bloodPressure,
          bmi: visitData.bmi,
          heartDiseases: visitData.heartDiseases,
          age: visitData.age,
        });
        break;
      case "dentist":
        visitCard = new VisitDentist({
          doctor: visitData.doctor,
          purpose: visitData.purpose,
          description: visitData.description,
          urgency: visitData.urgency,
          fullName: visitData.fullName,
          status: visitData.status,
          lastVisitDate: visitData.lastVisitDate,
        });
        break;
      case "therapist":
        visitCard = new VisitTherapist({
          doctor: visitData.doctor,
          purpose: visitData.purpose,
          description: visitData.description,
          urgency: visitData.urgency,
          fullName: visitData.fullName,
          status: visitData.status,
          age: visitData.age,
        });
        break;
      default:
        visitCard = new Visit({
          doctor: visitData.doctor,
          purpose: visitData.purpose,
          description: visitData.description,
          urgency: visitData.urgency,
          fullName: visitData.fullName,
          status: visitData.status,
        });
    }

    if (activeCardId) {
      api
        .updateCard(activeCardId, visitCard)
        .then((response) => {
          refreshCardOnBoard(response.data);
          modal.close();
        })
        .catch((error) => console.error("Error:", error));
    } else {
      api
        .createCard(visitCard)
        .then((response) => {
          creatingCardOnBoard(response.data);
          modal.close();
        })
        .catch((error) => console.error("Error:", error));
    }
  });
}
creatingModalWindow();

// Функція створення картки
function creatingCardOnBoard(data) {
  const {
    id,
    description,
    urgency,
    fullName,
    doctor,
    bloodPressure,
    bmi,
    heartDiseases,
    age,
    lastVisitDate,
    status,
  } = data;

  // Створення об'єкта візиту
  let visitCard;
  const visitDoctors = {
    cardiologist: VisitCardiologist,
    dentist: VisitDentist,
    therapist: VisitTherapist,
  };

  const VisitClass = visitDoctors[doctor] || Visit;
  visitCard = new VisitClass({
    doctor,
    description,
    urgency,
    fullName,
    status,
    ...(doctor === "cardiologist"
      ? { bloodPressure, bmi, heartDiseases, age }
      : doctor === "dentist"
      ? { lastVisitDate }
      : doctor === "therapist"
      ? { age }
      : {}),
  });

  // Створення картки
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.id = id;

  const additionalInfo = `
  <div class="additional-details hidden">
      <p class="card-description"><strong>Опис:</strong> ${description}</p>
      <p class="card-urgency"><strong>Терміновість:</strong> ${urgency}</p>
      <p><strong>ПІБ:</strong> ${fullName}</p>
      <p class="card-status"><strong>Статус:</strong> ${status}</p>
      ${
        doctor === "cardiologist"
          ? `
        <p><strong>Тиск:</strong> ${bloodPressure}</p>
        <p><strong>Індекс маси тіла:</strong> ${bmi}</p>
        <p><strong>Перенесені захворювання:</strong> ${heartDiseases}</p>
        <p><strong>Вік:</strong> ${age}</p>`
          : ""
      }
      ${
        doctor === "dentist"
          ? `
        <p><strong>Дата останнього відвідування:</strong> ${lastVisitDate}</p>`
          : ""
      }
      ${doctor === "therapist" ? `<p><strong>Вік:</strong> ${age}</p>` : ""}
    </div>`;

  card.innerHTML = `
    <h3 class="card-fullname">${fullName}</h3>
    <p>${doctor}</p>
    ${additionalInfo}
    <nav class="card-nav">
        <button class="show-more button--blue">Показати більше</button>
        <button class="edit button--edit">Редагувати</button>
        <button class="delete button--delete">✖</button>
    </nav>
  `;

  textBoard.append(card);
  CardAvailabilityCheck();
}

// Функція для загрузки всех карточек с сервера при загрузке страницы
export function loadCardsFromServer() {
  if (!api.token) return;
  api
    .getAllCards()
    .then((response) => {
      const cards = response.data;
      cards.forEach((card) => creatingCardOnBoard(card));
      CardAvailabilityCheck();
    })
    .catch((error) => console.error("Error loading cards:", error));
}

// Вызываем загрузку карточек при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  loadCardsFromServer();
});

// Функція перевірки наявності карток
function CardAvailabilityCheck() {
  const noTextBoard = document.getElementById("NoItems");
  const cards = textBoard.querySelectorAll(".card");

  if (cards.length === 0) {
    noTextBoard.style.display = "block";
  } else {
    noTextBoard.style.display = "none";
  }
}

// Оновлення даних картки на сторінці
function refreshCardOnBoard(data) {
  const {
    id,
    fullName,
    doctor,
    description,
    urgency,
    bloodPressure,
    bmi,
    heartDiseases,
    age,
    lastVisitDate,
    status,
  } = data;
  const card = document.querySelector(`.card[data-id="${id}"]`);
  if (card) {
    card.querySelector("h3").textContent = fullName;
    card.querySelector("p").textContent = doctor;

    const additionalInfo = card.querySelector(".additional-details");
    if (additionalInfo) {
      additionalInfo.innerHTML = `
        <p class="card-description"><strong>Опис:</strong> ${description}</p>
        <p class="card-urgency"><strong>Терміновість:</strong> ${urgency}</p>
        <p><strong>ПІБ:</strong> ${fullName}</p>
        <p class="card-status"><strong>Статус:</strong> ${status}</p>
        ${
          doctor === "cardiologist"
            ? `
          <p><strong>Тиск:</strong> ${bloodPressure}</p>
          <p><strong>Індекс маси тіла:</strong> ${bmi}</p>
          <p><strong>Перенесені захворювання:</strong> ${heartDiseases}</p>
          <p><strong>Вік:</strong> ${age}</p>`
            : ""
        }
        ${
          doctor === "dentist"
            ? `<p><strong>Дата останнього відвідування:</strong> ${lastVisitDate}</p>`
            : ""
        }
        ${doctor === "therapist" ? `<p><strong>Вік:</strong> ${age}</p>` : ""}
      `;
    }
  }
}

// Обробка редагування картки
textBoard.addEventListener("click", (event) => {
  const card = event.target.closest(".card");
  if (card) {
    const cardId = card.dataset.id;

    if (event.target.classList.contains("delete")) {
      if (confirm("Ви впевнені, що хочете видалити картку?")) {
        api
          .deleteCard(cardId)
          .then(() => {
            card.remove();
            CardAvailabilityCheck();
          })
          .catch((error) => console.error("Error:", error));
      }
    } else if (event.target.classList.contains("edit")) {
      activeCardId = cardId;
      api
        .getCard(cardId)
        .then((response) => {
          const cardData = response.data;
          const statusField = formDoctors.querySelector("#status");
          statusField.value = cardData.status;

          Object.entries(cardData).forEach(([key, value]) => {
            const doctorSpecificFields = document.getElementById(key);
            if (doctorSpecificFields) {
              doctorSpecificFields.value = value;
            }
          });
          // Показ додаткових полів при редагуванні для кожного лікаря
          const {
            doctor,
            bloodPressure,
            bmi,
            heartDiseases,
            age,
            lastVisitDate,
          } = cardData;

          uniqueFields.innerHTML = "";
          if (doctor === "cardiologist") {
            uniqueFields.innerHTML = `
            <label for="bloodPressure">Тиск:</label>
              <input type="text" id="bloodPressure" name="bloodPressure" value="${bloodPressure}" required>
              <label for="bmi">Індекс маси тіла:</label>
              <input type="text" id="bmi" name="bmi" value="${bmi}" required>
              <label for="heartDiseases">Перенесені захворювання:</label>
              <textarea id="heartDiseases" name="heartDiseases" required>${heartDiseases}</textarea>
              <label for="age">Вік:</label>
              <input type="number" id="age" name="age" value="${age}" required>`;
          } else if (doctor === "dentist") {
            uniqueFields.innerHTML = `
              <label for="lastVisitDate">Дата останнього відвідування:</label>
              <input type="date" id="lastVisitDate" name="lastVisitDate" value="${lastVisitDate}" required>`;
          } else if (doctor === "therapist") {
            uniqueFields.innerHTML = `
              <label for="age">Вік:</label>
              <input type="number" id="age" name="age" value="${age}" required>`;
          }
        })
        .catch((error) => console.error("Error:", error));
      createModal.style.visibility = "visible";
      createModal.style.opacity = 1;
    }
  }
});

// Натискання на кнопку "Показати більше"/"Згорнути" в створенній картці
textBoard.addEventListener("click", (event) => {
  if (event.target.classList.contains("show-more")) {
    const additionalDetails = event.target
      .closest(".card")
      .querySelector(".additional-details");
    if (additionalDetails) {
      additionalDetails.classList.toggle("hidden");
      event.target.textContent = additionalDetails.classList.contains("hidden")
        ? "Показати більше"
        : "Згорнути";
    }
  }
});

const dragZone = document.querySelector(".dragzone")
dragAndDrop(textBoard, dragZone)