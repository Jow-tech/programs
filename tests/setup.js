// tests/setup.js
// Configuração global para os testes Jest

// Mock da conexão com o banco de dados
jest.mock('../config/db', () => ({
  query: jest.fn()
}));

// Configurações globais para os testes
beforeEach(() => {
  // Limpar todos os mocks antes de cada teste
  jest.clearAllMocks();
});

afterEach(() => {
  // Restaurar mocks após cada teste
  jest.restoreAllMocks();
});

// Dados de teste reutilizáveis
global.testData = {
  player: {
    valid: {
      id: 1,
      username: 'testuser',
      email: 'test@test.com',
      phone: '123456789',
      password: 'password123'
    },
    invalid: {
      username: '',
      email: 'invalid-email',
      phone: null,
      password: ''
    }
  },
  space: {
    valid: {
      id: 1,
      name: 'Sala de Reunião',
      type: 'Reunião',
      capacity: 10,
      location: 'Andar 1'
    },
    invalid: {
      name: '',
      type: null,
      capacity: -1,
      location: ''
    }
  },
  reservation: {
    valid: {
      id: 1,
      user_id: 1,
      space_id: 1,
      reservation_date: '2025-01-15',
      initial_hour: '2025-01-15T14:00:00.000Z',
      final_hour: '2025-01-15T18:00:00.000Z',
      status: 'confirmed'
    },
    invalid: {
      user_id: null,
      space_id: '',
      reservation_date: 'invalid-date',
      initial_hour: null,
      final_hour: '',
      status: 'invalid-status'
    }
  },
  cleaning: {
    valid: {
      id: 1,
      reservation_id: 1,
      space_id: 1,
      employee_id: 1,
      cleaning_date: '2025-01-16',
      status: 'completed'
    },
    invalid: {
      reservation_id: null,
      space_id: '',
      employee_id: -1,
      cleaning_date: 'invalid-date',
      status: ''
    }
  },
  employee: {
    valid: {
      id: 1,
      name: 'João Silva',
      role: 'Limpeza',
      phone: '111222333',
      email: 'joao@empresa.com'
    },
    invalid: {
      name: '',
      role: null,
      phone: '',
      email: 'invalid-email'
    }
  }
};

// Funções utilitárias para testes
global.testUtils = {
  // Simular erro de conexão com banco
  mockDatabaseError: () => {
    return new Error('Erro de conexão com o banco de dados');
  },
  
  // Simular resposta vazia do banco
  mockEmptyResult: () => ({
    rows: []
  }),
  
  // Simular resposta com dados do banco
  mockSuccessResult: (data) => ({
    rows: Array.isArray(data) ? data : [data]
  })
};
