// tests/reservationModel.test.js
const db = require('../config/db');
const reservationModel = require('../models/reservationModel');

// Mock do módulo de banco de dados
jest.mock('../config/db');

describe('ReservationModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllReservations', () => {
    test('deve retornar todas as reservas com sucesso', async () => {
      // Arrange
      const mockReservations = [
        testData.reservation.valid,
        { ...testData.reservation.valid, id: 2, user_id: 2, space_id: 2 }
      ];
      db.query.mockResolvedValue(testUtils.mockSuccessResult(mockReservations));

      // Act
      const result = await reservationModel.getAllReservations();

      // Assert
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM reservation ORDER BY id');
      expect(result).toEqual(mockReservations);
      expect(result).toHaveLength(2);
    });

    test('deve lançar erro quando há falha na conexão com banco', async () => {
      // Arrange
      const dbError = testUtils.mockDatabaseError();
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(reservationModel.getAllReservations()).rejects.toThrow('Erro ao obter reservas: Erro de conexão com o banco de dados');
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM reservation ORDER BY id');
    });

    test('deve lançar erro quando query SQL falha', async () => {
      // Arrange
      const sqlError = new Error('relation "reservation" does not exist');
      db.query.mockRejectedValue(sqlError);

      // Act & Assert
      await expect(reservationModel.getAllReservations()).rejects.toThrow('Erro ao obter reservas: relation "reservation" does not exist');
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM reservation ORDER BY id');
    });
  });

  describe('getReservationById', () => {
    test('deve retornar reserva específica por ID com sucesso', async () => {
      // Arrange
      const reservationId = 1;
      const mockReservation = testData.reservation.valid;
      db.query.mockResolvedValue(testUtils.mockSuccessResult(mockReservation));

      // Act
      const result = await reservationModel.getReservationById(reservationId);

      // Assert
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM reservation WHERE id = $1', [reservationId]);
      expect(result).toEqual(mockReservation);
    });

    test('deve retornar undefined quando reserva não existe', async () => {
      // Arrange
      const reservationId = 999;
      db.query.mockResolvedValue(testUtils.mockEmptyResult());

      // Act
      const result = await reservationModel.getReservationById(reservationId);

      // Assert
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM reservation WHERE id = $1', [reservationId]);
      expect(result).toBeUndefined();
    });

    test('deve lançar erro quando ID é inválido', async () => {
      // Arrange
      const invalidId = 'invalid';
      const dbError = new Error('invalid input syntax for type integer');
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(reservationModel.getReservationById(invalidId)).rejects.toThrow('Erro ao obter reserva: invalid input syntax for type integer');
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM reservation WHERE id = $1', [invalidId]);
    });
  });

  describe('createReservation', () => {
    test('deve criar nova reserva com sucesso', async () => {
      // Arrange
      const { user_id, space_id, reservation_date, initial_hour, final_hour, status } = testData.reservation.valid;
      const mockCreatedReservation = { ...testData.reservation.valid, id: 3 };
      db.query.mockResolvedValue(testUtils.mockSuccessResult(mockCreatedReservation));

      // Act
      const result = await reservationModel.createReservation(user_id, space_id, reservation_date, initial_hour, final_hour, status);

      // Assert
      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO reservation (user_id, space_id, reservation_date, initial_hour, final_hour, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [user_id, space_id, reservation_date, initial_hour, final_hour, status]
      );
      expect(result).toEqual(mockCreatedReservation);
      expect(result.id).toBeDefined();
    });

    test('deve lançar erro quando dados obrigatórios estão ausentes', async () => {
      // Arrange
      const dbError = new Error('null value in column "user_id" violates not-null constraint');
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(reservationModel.createReservation(null, null, '', '', '', '')).rejects.toThrow('Erro ao criar reserva: null value in column "user_id" violates not-null constraint');
    });

    test('deve lançar erro quando foreign key é inválida', async () => {
      // Arrange
      const { reservation_date, initial_hour, final_hour, status } = testData.reservation.valid;
      const invalidUserId = 999;
      const invalidSpaceId = 999;
      const dbError = new Error('insert or update on table "reservation" violates foreign key constraint');
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(reservationModel.createReservation(invalidUserId, invalidSpaceId, reservation_date, initial_hour, final_hour, status)).rejects.toThrow('Erro ao criar reserva: insert or update on table "reservation" violates foreign key constraint');
    });
  });

  describe('updateReservation', () => {
    test('deve atualizar reserva existente com sucesso', async () => {
      // Arrange
      const reservationId = 1;
      const { user_id, space_id, reservation_date, initial_hour, final_hour, status } = testData.reservation.valid;
      const mockUpdatedReservation = { ...testData.reservation.valid, status: 'completed' };
      db.query.mockResolvedValue(testUtils.mockSuccessResult(mockUpdatedReservation));

      // Act
      const result = await reservationModel.updateReservation(reservationId, user_id, space_id, reservation_date, initial_hour, final_hour, status);

      // Assert
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE reservation SET user_id = $1, space_id = $2, reservation_date = $3, initial_hour = $4, final_hour = $5, status = $6 WHERE id = $7 RETURNING *',
        [user_id, space_id, reservation_date, initial_hour, final_hour, status, reservationId]
      );
      expect(result).toEqual(mockUpdatedReservation);
    });

    test('deve retornar undefined quando reserva não existe para atualização', async () => {
      // Arrange
      const reservationId = 999;
      const { user_id, space_id, reservation_date, initial_hour, final_hour, status } = testData.reservation.valid;
      db.query.mockResolvedValue(testUtils.mockEmptyResult());

      // Act
      const result = await reservationModel.updateReservation(reservationId, user_id, space_id, reservation_date, initial_hour, final_hour, status);

      // Assert
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE reservation SET user_id = $1, space_id = $2, reservation_date = $3, initial_hour = $4, final_hour = $5, status = $6 WHERE id = $7 RETURNING *',
        [user_id, space_id, reservation_date, initial_hour, final_hour, status, reservationId]
      );
      expect(result).toBeUndefined();
    });

    test('deve lançar erro quando dados de atualização são inválidos', async () => {
      // Arrange
      const reservationId = 1;
      const dbError = new Error('invalid input syntax for type timestamp');
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(reservationModel.updateReservation(reservationId, null, '', 'invalid-date', 'invalid-time', '', 'invalid-status')).rejects.toThrow('Erro ao atualizar reserva: invalid input syntax for type timestamp');
    });
  });

  describe('deleteReservation', () => {
    test('deve deletar reserva existente com sucesso', async () => {
      // Arrange
      const reservationId = 1;
      const mockDeletedReservation = testData.reservation.valid;
      db.query.mockResolvedValue(testUtils.mockSuccessResult(mockDeletedReservation));

      // Act
      const result = await reservationModel.deleteReservation(reservationId);

      // Assert
      expect(db.query).toHaveBeenCalledWith('DELETE FROM reservation WHERE id = $1 RETURNING *', [reservationId]);
      expect(result).toEqual(mockDeletedReservation);
    });

    test('deve retornar undefined quando reserva não existe para deleção', async () => {
      // Arrange
      const reservationId = 999;
      db.query.mockResolvedValue(testUtils.mockEmptyResult());

      // Act
      const result = await reservationModel.deleteReservation(reservationId);

      // Assert
      expect(db.query).toHaveBeenCalledWith('DELETE FROM reservation WHERE id = $1 RETURNING *', [reservationId]);
      expect(result).toBeUndefined();
    });

    test('deve lançar erro quando há constraint de foreign key', async () => {
      // Arrange
      const reservationId = 1;
      const dbError = new Error('update or delete on table "reservation" violates foreign key constraint');
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(reservationModel.deleteReservation(reservationId)).rejects.toThrow('Erro ao deletar reserva: update or delete on table "reservation" violates foreign key constraint');
      expect(db.query).toHaveBeenCalledWith('DELETE FROM reservation WHERE id = $1 RETURNING *', [reservationId]);
    });
  });
});
