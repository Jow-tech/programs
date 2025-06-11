// Módulo para comunicação com a API REST
const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  // Método genérico para fazer requisições
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  }

  // Métodos para Usuários
  async getUsers() {
    return this.request('/users');
  }

  async getUserById(id) {
    return this.request(`/users/${id}`);
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE'
    });
  }

  // Métodos para Espaços
  async getSpaces() {
    return this.request('/spaces');
  }

  async getSpaceById(id) {
    return this.request(`/spaces/${id}`);
  }

  async createSpace(spaceData) {
    return this.request('/spaces', {
      method: 'POST',
      body: JSON.stringify(spaceData)
    });
  }

  async updateSpace(id, spaceData) {
    return this.request(`/spaces/${id}`, {
      method: 'PUT',
      body: JSON.stringify(spaceData)
    });
  }

  async deleteSpace(id) {
    return this.request(`/spaces/${id}`, {
      method: 'DELETE'
    });
  }

  // Métodos para Reservas
  async getReservations() {
    return this.request('/reservations');
  }

  async getReservationById(id) {
    return this.request(`/reservations/${id}`);
  }

  async createReservation(reservationData) {
    return this.request('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData)
    });
  }

  async updateReservation(id, reservationData) {
    return this.request(`/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reservationData)
    });
  }

  async deleteReservation(id) {
    return this.request(`/reservations/${id}`, {
      method: 'DELETE'
    });
  }

  // Métodos para Limpeza
  async getCleanings() {
    return this.request('/cleaning');
  }

  async getCleaningById(id) {
    return this.request(`/cleaning/${id}`);
  }

  async createCleaning(cleaningData) {
    return this.request('/cleaning', {
      method: 'POST',
      body: JSON.stringify(cleaningData)
    });
  }

  async updateCleaning(id, cleaningData) {
    return this.request(`/cleaning/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cleaningData)
    });
  }

  async deleteCleaning(id) {
    return this.request(`/cleaning/${id}`, {
      method: 'DELETE'
    });
  }

  // Métodos para Funcionários
  async getEmployees() {
    return this.request('/employees');
  }

  async getEmployeeById(id) {
    return this.request(`/employees/${id}`);
  }

  async createEmployee(employeeData) {
    return this.request('/employees', {
      method: 'POST',
      body: JSON.stringify(employeeData)
    });
  }

  async updateEmployee(id, employeeData) {
    return this.request(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employeeData)
    });
  }

  async deleteEmployee(id) {
    return this.request(`/employees/${id}`, {
      method: 'DELETE'
    });
  }
}

// Instância global da API
const api = new ApiService();
