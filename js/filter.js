class Filter {
  constructor(container) {
    this.container = container;
  }
  createForm() {
    this.container.innerHTML = "";
    //Создаем форму
    this.form = document.createElement("form");
    this.form.action = "#";
    this.form.id = "filter-form";
    this.form.style.display = "flex";
    this.form.style.gap = "10px";
    this.form.style.marginBottom = "20px";
    this.form.style.justifyContent = "center";
    //Поле для поиска по заголовку
    this.inpTitle = document.createElement("input");
    this.inpTitle.style.width = `${500}px`;
    this.inpTitle.classList.add("find-title");
    this.inpTitle.type = "text";
    this.inpTitle.placeholder = "Пошук за заголовком/вмістом візиту";
    this.inpTitle.name = "title";
    //Выпадающий список для статуса
    this.selectStatus = document.createElement("select");
    this.selectStatus.style.width = `${200}px`;
    this.selectStatus.name = "status";
    this.selectStatus.classList.add("filter-status");
    this.selectStatus.innerHTML = `
          <option value = "">Статус запису</option>
          <option value = "Open">Відкритий</option>
          <option value = "Done">Зачинений</option>
      
          `;
    //Выпадающий список для приоритета
    this.selectPriority = document.createElement("select");
    this.selectPriority.style.width = `${200}px`;
    this.selectPriority.name = "priority";
    this.selectPriority.classList.add("filter-priority");
    this.selectPriority.innerHTML = `
          <option value="">Терміновість</option>
          <option value="high">Звичайна</option>
          <option value="normal">Пріоритетна</option>
          <option value= "emergency">Невідкладна</option>
          `;

    //Обработчики событий для фильтрации
    this.filterVisits = this.filterVisits.bind(this);
    this.inpTitle.addEventListener("input", this.filterVisits);
    this.selectStatus.addEventListener("change", this.filterVisits);
    this.selectPriority.addEventListener("change", this.filterVisits);

    this.form.append(this.inpTitle, this.selectStatus, this.selectPriority);
    this.container.append(this.form);
  }

  filterVisits() {
    // Знаходження всіх карт на сторінці
    const cards = [...document.querySelectorAll(".card")];

    if (cards.length === 0) {
      return alert("Наразі немає візітів для фільтрування");
    }

    // Отримання всіх даних з форми
    const searchText = this.inpTitle.value.toLowerCase();
    const statusValue = this.selectStatus.value;
    const priorityValue = this.selectPriority.value;

    cards.forEach((card) => {
      // Знаходження необхідних полів для обробки
      const cardTitle = card.querySelector(".card-fullname");
      const cardDescription = card.querySelector(".card-description");
      const cardPriority = card.querySelector(".card-urgency");
      const cardStatus = card.querySelector(".card-status");

      // Знаходження всіх значень полів задля відповідного пошуку
      const searchResult = searchText
        ? cardTitle.textContent.toLowerCase().includes(searchText) ||
          cardDescription.textContent.toLowerCase().includes(searchText)
        : true;
      const statusResult = statusValue
        ? cardStatus.textContent.includes(statusValue)
        : true;
      const priorityResult = priorityValue
        ? cardPriority.textContent.includes(priorityValue)
        : true;

      // Зміна стану відносно перевірки на відповідність
      card.style.display =
        searchResult && statusResult && priorityResult ? "block" : "none";
      if (getComputedStyle(card).position === "absolute") {
        card.style.position = "relative";
        card.style.width = "auto";
        card.style.top = `${0}px`;
        card.style.left = `${0}px`;
        card.style.margin = `${10}px`;
        // const dragzone = document.querySelector(".dragzone");
        // dragzone.style.height = "auto";
      }
    });
  }
}

export default Filter;
