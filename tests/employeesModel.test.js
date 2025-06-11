// tests/employeesModel.test.js
const db = require('../config/db');
const employeesModel = require('../models/employeesModel');

// Mock do módulo de banco de dados
jest.mock('../config/db');

describe('EmployeesModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllEmployees', () => {
    test('deve retornar todos os funcionários com sucesso', async () => {
      // Arrange
      const mockEmployees = [
        testData.employee.valid,
        { ...testData.employee.valid, id: 2, name: 'Maria Santos', role: 'Manutenção' }
      ];
      db.query.mockResolvedValue(testUtils.mockSuccessResult(mockEmployees));

      // Act
      const result = await employeesModel.getAllEmployees();

      // Assert
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM employees ORDER BY id');
      expect(result).toEqual(mockEmployees);
      expect(result).toHaveLength(2);
    });

    test('deve lançar erro quando há falha na conexão com banco', async () => {
      // Arrange
      const dbError = testUtils.mockDatabaseError();
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(employeesModel.getAllEmployees()).rejects.toThrow('Erro ao obter funcionários: Erro de conexão com o banco de dados');
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM employees ORDER BY id');
    });

    test('deve lançar erro quando query SQL falha', async () => {
      // Arrange
      const sqlError = new Error('relation "employees" does not exist');
      db.query.mockRejectedValue(sqlError);

      // Act & Assert
      await expect(employeesModel.getAllEmployees()).rejects.toThrow('Erro ao obter funcionários: relation "employees" does not exist');
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM employees ORDER BY id');
    });
  });

  describe('getEmployeeById', () => {
    test('deve retornar funcionário específico por ID com sucesso', async () => {
      // Arrange
      const employeeId = 1;
      const mockEmployee = testData.employee.valid;
      db.query.mockResolvedValue(testUtils.mockSuccessResult(mockEmployee));

      // Act
      const result = await employeesModel.getEmployeeById(employeeId);

      // Assert
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM employees WHERE id = $1', [employeeId]);
      expect(result).toEqual(mockEmployee);
    });

    test('deve retornar undefined quando funcionário não existe', async () => {
      // Arrange
      const employeeId = 999;
      db.query.mockResolvedValue(testUtils.mockEmptyResult());

      // Act
      const result = await employeesModel.getEmployeeById(employeeId);

      // Assert
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM employees WHERE id = $1', [employeeId]);
      expect(result).toBeUndefined();
    });

    test('deve lançar erro quando ID é inválido', async () => {
      // Arrange
      const invalidId = 'invalid';
      const dbError = new Error('invalid input syntax for type integer');
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(employeesModel.getEmployeeById(invalidId)).rejects.toThrow('Erro ao obter funcionário: invalid input syntax for type integer');
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM employees WHERE id = $1', [invalidId]);
    });
  });

  describe('createEmployee', () => {
    test('deve criar novo funcionário com sucesso', async () => {
      // Arrange
      const { name, role, phone, email } = testData.employee.valid;
      const mockCreatedEmployee = { ...testData.employee.valid, id: 3 };
      db.query.mockResolvedValue(testUtils.mockSuccessResult(mockCreatedEmployee));

      // Act
      const result = await employeesModel.createEmployee(name, role, phone, email);

      // Assert
      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO employees (name, role, phone, email) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, role, phone, email]
      );
      expect(result).toEqual(mockCreatedEmployee);
      expect(result.id).toBeDefined();
    });

    test('deve lançar erro quando dados obrigatórios estão ausentes', async () => {
      // Arrange
      const dbError = new Error('null value in column "name" violates not-null constraint');
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(employeesModel.createEmployee('', '', '', '')).rejects.toThrow('Erro ao criar funcionário: null value in column "name" violates not-null constraint');
    });

    test('deve lançar erro quando email já existe (violação de unique)', async () => {
      // Arrange
      const { name, role, phone, email } = testData.employee.valid;
      const dbError = new Error('duplicate key value violates unique constraint "employees_email_key"');
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(employeesModel.createEmployee(name, role, phone, email)).rejects.toThrow('Erro ao criar funcionário: duplicate key value violates unique constraint "employees_email_key"');
    });
  });

  describe('updateEmployee', () => {
    test('deve atualizar funcionário existente com sucesso', async () => {
      // Arrange
      const employeeId = 1;
      const { name, role, phone, email } = testData.employee.valid;
      const mockUpdatedEmployee = { ...testData.employee.valid, name: 'João Silva Santos' };
      db.query.mockResolvedValue(testUtils.mockSuccessResult(mockUpdatedEmployee));

      // Act
      const result = await employeesModel.updateEmployee(employeeId, name, role, phone, email);

      // Assert
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE employees SET name = $1, role = $2, phone = $3, email = $4 WHERE id = $5 RETURNING *',
        [name, role, phone, email, employeeId]
      );
      expect(result).toEqual(mockUpdatedEmployee);
    });

    test('deve retornar undefined quando funcionário não existe para atualização', async () => {
      // Arrange
      const employeeId = 999;
      const { name, role, phone, email } = testData.employee.valid;
      db.query.mockResolvedValue(testUtils.mockEmptyResult());

      // Act
      const result = await employeesModel.updateEmployee(employeeId, name, role, phone, email);

      // Assert
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE employees SET name = $1, role = $2, phone = $3, email = $4 WHERE id = $5 RETURNING *',
        [name, role, phone, email, employeeId]
      );
      expect(result).toBeUndefined();
    });

    test('deve lançar erro quando dados de atualização são inválidos', async () => {
      // Arrange
      const employeeId = 1;
      const dbError = new Error('value too long for type character varying(255)');
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(employeesModel.updateEmployee(employeeId, 'a'.repeat(300), null, '', 'invalid-email')).rejects.toThrow('Erro ao atualizar funcionário: value too long for type character varying(255)');
    });
  });

  describe('deleteEmployee', () => {
    test('deve deletar funcionário existente com sucesso', async () => {
      // Arrange
      const employeeId = 1;
      const mockDeletedEmployee = testData.employee.valid;
      db.query.mockResolvedValue(testUtils.mockSuccessResult(mockDeletedEmployee));

      // Act
      const result = await employeesModel.deleteEmployee(employeeId);

      // Assert
      expect(db.query).toHaveBeenCalledWith('DELETE FROM employees WHERE id = $1 RETURNING *', [employeeId]);
      expect(result).toEqual(mockDeletedEmployee);
    });

    test('deve retornar undefined quando funcionário não existe para deleção', async () => {
      // Arrange
      const employeeId = 999;
      db.query.mockResolvedValue(testUtils.mockEmptyResult());

      // Act
      const result = await employeesModel.deleteEmployee(employeeId);

      // Assert
      expect(db.query).toHaveBeenCalledWith('DELETE FROM employees WHERE id = $1 RETURNING *', [employeeId]);
      expect(result).toBeUndefined();
    });

    test('deve lançar erro quando há constraint de foreign key', async () => {
      // Arrange
      const employeeId = 1;
      const dbError = new Error('update or delete on table "employees" violates foreign key constraint');
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(employeesModel.deleteEmployee(employeeId)).rejects.toThrow('Erro ao deletar funcionário: update or delete on table "employees" violates foreign key constraint');
      expect(db.query).toHaveBeenCalledWith('DELETE FROM employees WHERE id = $1 RETURNING *', [employeeId]);
    });
  });
});
