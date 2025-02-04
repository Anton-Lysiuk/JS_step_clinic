export class Api {
  constructor() {
    this.baseUrl = "https://ajax.test-danit.com/api/v2/cards";
  }

  get token() {
    return localStorage.getItem("outh");
  }

  // Отримання даних картки
  getCard(id) {
    return axios.get(`${this.baseUrl}/${id}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
  }

  // Отримання карток з сервера
  getAllCards() {
    return axios.get(this.baseUrl, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
  }

  // Створення картки
  createCard(data) {
    return axios.post(this.baseUrl, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  // Оновлення картки
  updateCard(id, data) {
    return axios.put(`${this.baseUrl}/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  // Видалення картки
  deleteCard(id) {
    return axios.delete(`${this.baseUrl}/${id}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
  }
}
