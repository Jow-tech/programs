// tests/cleaningModel.test.js
const db = require('../config/db');
const cleaningModel = require('../models/cleaningModel');

// Mock do módulo de banco de dados
jest.mock('../config/db');

describe('CleaningModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCleanings', () => {
    test('deve retornar todos os agendamentos de limpeza com sucesso', async () => {
      // Arrange
      const mockCleanings = [
        testData.cleaning.valid,
        { ...testData.cleaning.valid, id: 2, reservation_id: 2, employee_id: 2 }
      ];
      db.query.mockResolvedValue(testUtils.mockSuccessResult(mockCleanings));

      // Act
      const result = await cleaningModel.getAllCleanings();

      // Assert
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM cleaning ORDER BY id');
      expect(result).toEqual(mockCleanings);
      expect(result).toHaveLength(2);
    });

    test('deve lançar erro quando há falha na conexão com banco', async () => {
      // Arrange
      const dbError = testUtils.mockDatabaseError();
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(cleaningModel.getAllCleanings()).rejects.toThrow('Erro ao obter agendamentos de limpeza: Erro de conexão com o banco de dados');
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM cleaning ORDER BY id');
    });

    test('deve lançar erro quando query SQL falha', async () => {
      // Arrange
      const sqlError = new Error('relation "cleaning" does not exist');
      db.query.mockRejectedValue(sqlError);

      // Act & Assert
      await expect(cleaningModel.getAllCleanings()).rejects.toThrow('Erro ao obter agendamentos de limpeza: relation "cleaning" does not exist');
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM cleaning ORDER BY id');
    });
  });

  describe('getCleaningById', () => {
    test('deve retornar agendamento de limpeza específico por ID com sucesso', async () => {
      // Arrange
      const cleaningId = 1;
      const mockCleaning = testData.cleaning.valid;
      db.query.mockResolvedValue(testUtils.mockSuccessResult(mockCleaning));

      // Act
      const result = await cleaningModel.getCleaningById(cleaningId);

      // Assert
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM cleaning WHERE id = $1', [cleaningId]);
      expect(result).toEqual(mockCleaning);
    });

    test('deve retornar undefined quando agendamento não existe', async () => {
      // Arrange
      const cleaningId = 999;
      db.query.mockResolvedValue(testUtils.mockEmptyResult());

      // Act
      const result = await cleaningModel.getCleaningById(cleaningId);

      // Assert
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM cleaning WHERE id = $1', [cleaningId]);
      expect(result).toBeUndefined();
    });

    test('deve lançar erro quando ID é inválido', async () => {
      // Arrange
      const invalidId = 'invalid';
      const dbError = new Error('invalid input syntax for type integer');
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(cleaningModel.getCleaningById(invalidId)).rejects.toThrow('Erro ao obter agendamento de limpeza: invalid input syntax for type integer');
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM cleaning WHERE id = $1', [invalidId]);
    });
  });

  describe('createCleaning', () => {
    test('deve criar novo agendamento de limpeza com sucesso', async () => {
      // Arrange
      const { reservation_id, space_id, employee_id, cleaning_date, status } = testData.cleaning.valid;
      const mockCreatedCleaning = { ...testData.cleaning.valid, id: 3 };
      db.query.mockResolvedValue(testUtils.mockSuccessResult(mockCreatedCleaning));

      // Act
      const result = await cleaningModel.createCleaning(reservation_id, space_id, employee_id, cleaning_date, status);

      // Assert
      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO cleaning (reservation_id, space_id, employee_id, cleaning_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [reservation_id, space_id, employee_id, cleaning_date, status]
      );
      expect(result).toEqual(mockCreatedCleaning);
      expect(result.id).toBeDefined();
    });

    test('deve lançar erro quando dados obrigatórios estão ausentes', async () => {
      // Arrange
      const dbError = new Error('null value in column "reservation_id" violates not-null constraint');
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(cleaningModel.createCleaning(null, null, null, '', '')).rejects.toThrow('Erro ao criar agendamento de limpeza: null value in column "reservation_id" violates not-null constraint');
    });

    test('deve lançar erro quando foreign key é inválida', async () => {
      // Arrange
      const { cleaning_date, status } = testData.cleaning.valid;
      const invalidReservationId = 999;
      const invalidSpaceId = 999;
      const invalidEmployeeId = 999;
      const dbError = new Error('insert or update on table "cleaning" violates foreign key constraint');
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(cleaningModel.createCleaning(invalidReservationId, invalidSpaceId, invalidEmployeeId, cleaning_date, status)).rejects.toThrow('Erro ao criar agendamento de limpeza: insert or update on table "cleaning" violates foreign key constraint');
    });
  });

  describe('updateCleaning', () => {
    test('deve atualizar agendamento de limpeza existente com sucesso', async () => {
      // Arrange
      const cleaningId = 1;
      const { reservation_id, space_id, employee_id, cleaning_date, status } = testData.cleaning.valid;
      const mockUpdatedCleaning = { ...testData.cleaning.valid, status: 'in_progress' };
      db.query.mockResolvedValue(testUtils.mockSuccessResult(mockUpdatedCleaning));

      // Act
      const result = await cleaningModel.updateCleaning(cleaningId, reservation_id, space_id, employee_id, cleaning_date, status);

      // Assert
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE cleaning SET reservation_id = $1, space_id = $2, employee_id = $3, cleaning_date = $4, status = $5 WHERE id = $6 RETURNING *',
        [reservation_id, space_id, employee_id, cleaning_date, status, cleaningId]
      );
      expect(result).toEqual(mockUpdatedCleaning);
    });

    test('deve retornar undefined quando agendamento não existe para atualização', async () => {
      // Arrange
      const cleaningId = 999;
      const { reservation_id, space_id, employee_id, cleaning_date, status } = testData.cleaning.valid;
      db.query.mockResolvedValue(testUtils.mockEmptyResult());

      // Act
      const result = await cleaningModel.updateCleaning(cleaningId, reservation_id, space_id, employee_id, cleaning_date, status);

      // Assert
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE cleaning SET reservation_id = $1, space_id = $2, employee_id = $3, cleaning_date = $4, status = $5 WHERE id = $6 RETURNING *',
        [reservation_id, space_id, employee_id, cleaning_date, status, cleaningId]
      );
      expect(result).toBeUndefined();
    });

    test('deve lançar erro quando dados de atualização são inválidos', async () => {
      // Arrange
      const cleaningId = 1;
      const dbError = new Error('invalid input syntax for type date');
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(cleaningModel.updateCleaning(cleaningId, null, '', -1, 'invalid-date', '')).rejects.toThrow('Erro ao atualizar agendamento de limpeza: invalid input syntax for type date');
    });
  });

  describe('deleteCleaning', () => {
    test('deve deletar agendamento de limpeza existente com sucesso', async () => {
      // Arrange
      const cleaningId = 1;
      const mockDeletedCleaning = testData.cleaning.valid;
      db.query.mockResolvedValue(testUtils.mockSuccessResult(mockDeletedCleaning));

      // Act
      const result = await cleaningModel.deleteCleaning(cleaningId);

      // Assert
      expect(db.query).toHaveBeenCalledWith('DELETE FROM cleaning WHERE id = $1 RETURNING *', [cleaningId]);
      expect(result).toEqual(mockDeletedCleaning);
    });

    test('deve retornar undefined quando agendamento não existe para deleção', async () => {
      // Arrange
      const cleaningId = 999;
      db.query.mockResolvedValue(testUtils.mockEmptyResult());

      // Act
      const result = await cleaningModel.deleteCleaning(cleaningId);

      // Assert
      expect(db.query).toHaveBeenCalledWith('DELETE FROM cleaning WHERE id = $1 RETURNING *', [cleaningId]);
      expect(result).toBeUndefined();
    });

    test('deve lançar erro quando há constraint de foreign key', async () => {
      // Arrange
      const cleaningId = 1;
      const dbError = new Error('update or delete on table "cleaning" violates foreign key constraint');
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(cleaningModel.deleteCleaning(cleaningId)).rejects.toThrow('Erro ao deletar agendamento de limpeza: update or delete on table "cleaning" violates foreign key constraint');
      expect(db.query).toHaveBeenCalledWith('DELETE FROM cleaning WHERE id = $1 RETURNING *', [cleaningId]);
    });
  });
});
