export class VisitModal {
  constructor(modalEl) {
    this.modalEl = modalEl;
    this.closeOnOutsideClick();
  }
  // Відкриття модального вікна
  open() {
    this.modalEl.style.visibility = "visible";
    this.modalEl.style.opacity = 1;
  }
  // Закриття модального вікна
  close() {
    this.modalEl.style.visibility = "hidden";
    this.modalEl.style.opacity = 0;
  }
  // Закриття модального вікна при кліку поза ним
  closeOnOutsideClick() {
    this.modalEl.addEventListener("click", (event) => {
      if (event.target === this.modalEl) {
        this.close();
      }
    });
  }
}

export class Visit {
  constructor({ doctor, purpose, description, urgency, fullName, status }) {
    this.doctor = doctor;
    this.purpose = purpose;
    this.description = description;
    this.urgency = urgency;
    this.fullName = fullName;
    this.status = status;
  }

  static generateUniqueFields(doctor) {
    let fieldsHTML = "";

    if (doctor === "cardiologist") {
      fieldsHTML = `
        <label for="bloodPressure">Тиск:</label>
        <input type="text" id="bloodPressure" name="bloodPressure" required>
        <label for="bmi">Індекс маси тіла:</label>
        <input type="text" id="bmi" name="bmi" required>
        <label for="heartDiseases">Перенесені захворювання:</label>
        <textarea id="heartDiseases" name="heartDiseases" required></textarea>
        <label for="age">Вік:</label>
        <input type="number" id="age" name="age" required>`;
    } else if (doctor === "dentist") {
      fieldsHTML = `
        <label for="lastVisitDate">Дата останнього відвідування:</label>
        <input type="date" id="lastVisitDate" name="lastVisitDate" required>`;
    } else if (doctor === "therapist") {
      fieldsHTML = `
        <label for="age">Вік:</label>
        <input type="number" id="age" name="age" required>`;
    }

    return fieldsHTML;
  }
}

export class VisitDentist extends Visit {
  constructor({
    doctor,
    purpose,
    description,
    urgency,
    fullName,
    status,
    lastVisitDate,
  }) {
    super({ doctor, purpose, description, urgency, fullName, status });
    this.lastVisitDate = lastVisitDate;
  }
}

export class VisitCardiologist extends Visit {
  constructor({
    doctor,
    purpose,
    description,
    urgency,
    fullName,
    status,
    bloodPressure,
    bmi,
    heartDiseases,
    age,
  }) {
    super({ doctor, purpose, description, urgency, fullName, status });
    this.bloodPressure = bloodPressure;
    this.bmi = bmi;
    this.heartDiseases = heartDiseases;
    this.age = age;
  }
}

export class VisitTherapist extends Visit {
  constructor({
    doctor,
    purpose,
    description,
    urgency,
    fullName,
    status,
    age,
  }) {
    super({ doctor, purpose, description, urgency, fullName, status });
    this.age = age;
  }
}
