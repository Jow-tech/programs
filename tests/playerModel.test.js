// tests/playerModel.test.js
const db = require('../config/db');
const playerModel = require('../models/playerModel');

// Mock do módulo de banco de dados
jest.mock('../config/db');

describe('PlayerModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPlayers', () => {
    test('deve retornar todos os players com sucesso', async () => {
      // Arrange
      const mockPlayers = [
        testData.player.valid,
        { ...testData.player.valid, id: 2, username: 'user2', email: 'user2@test.com' }
      ];
      db.query.mockResolvedValue(testUtils.mockSuccessResult(mockPlayers));

      // Act
      const result = await playerModel.getAllPlayers();

      // Assert
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM player ORDER BY id');
      expect(result).toEqual(mockPlayers);
      expect(result).toHaveLength(2);
    });

    test('deve lançar erro quando há falha na conexão com banco', async () => {
      // Arrange
      const dbError = testUtils.mockDatabaseError();
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(playerModel.getAllPlayers()).rejects.toThrow('Erro ao obter players: Erro de conexão com o banco de dados');
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM player ORDER BY id');
    });

    test('deve lançar erro quando query SQL falha', async () => {
      // Arrange
      const sqlError = new Error('Syntax error in SQL query');
      db.query.mockRejectedValue(sqlError);

      // Act & Assert
      await expect(playerModel.getAllPlayers()).rejects.toThrow('Erro ao obter players: Syntax error in SQL query');
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM player ORDER BY id');
    });
  });

  describe('getPlayerById', () => {
    test('deve retornar player específico por ID com sucesso', async () => {
      // Arrange
      const playerId = 1;
      const mockPlayer = testData.player.valid;
      db.query.mockResolvedValue(testUtils.mockSuccessResult(mockPlayer));

      // Act
      const result = await playerModel.getPlayerById(playerId);

      // Assert
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM player WHERE id = $1', [playerId]);
      expect(result).toEqual(mockPlayer);
    });

    test('deve retornar undefined quando player não existe', async () => {
      // Arrange
      const playerId = 999;
      db.query.mockResolvedValue(testUtils.mockEmptyResult());

      // Act
      const result = await playerModel.getPlayerById(playerId);

      // Assert
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM player WHERE id = $1', [playerId]);
      expect(result).toBeUndefined();
    });

    test('deve lançar erro quando ID é inválido', async () => {
      // Arrange
      const invalidId = 'invalid';
      const dbError = new Error('invalid input syntax for type integer');
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(playerModel.getPlayerById(invalidId)).rejects.toThrow('Erro ao obter player: invalid input syntax for type integer');
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM player WHERE id = $1', [invalidId]);
    });
  });

  describe('createPlayer', () => {
    test('deve criar novo player com sucesso', async () => {
      // Arrange
      const { username, email, phone, password } = testData.player.valid;
      const mockCreatedPlayer = { ...testData.player.valid, id: 3 };
      db.query.mockResolvedValue(testUtils.mockSuccessResult(mockCreatedPlayer));

      // Act
      const result = await playerModel.createPlayer(username, email, phone, password);

      // Assert
      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO player (username, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING *',
        [username, email, phone, password]
      );
      expect(result).toEqual(mockCreatedPlayer);
      expect(result.id).toBeDefined();
    });

    test('deve lançar erro quando dados obrigatórios estão ausentes', async () => {
      // Arrange
      const dbError = new Error('null value in column "username" violates not-null constraint');
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(playerModel.createPlayer('', '', '', '')).rejects.toThrow('Erro ao criar player: null value in column "username" violates not-null constraint');
    });

    test('deve lançar erro quando email já existe (violação de unique)', async () => {
      // Arrange
      const { username, email, phone, password } = testData.player.valid;
      const dbError = new Error('duplicate key value violates unique constraint "player_email_key"');
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(playerModel.createPlayer(username, email, phone, password)).rejects.toThrow('Erro ao criar player: duplicate key value violates unique constraint "player_email_key"');
    });
  });

  describe('updatePlayer', () => {
    test('deve atualizar player existente com sucesso', async () => {
      // Arrange
      const playerId = 1;
      const { username, email, phone, password } = testData.player.valid;
      const mockUpdatedPlayer = { ...testData.player.valid, username: 'updated_user' };
      db.query.mockResolvedValue(testUtils.mockSuccessResult(mockUpdatedPlayer));

      // Act
      const result = await playerModel.updatePlayer(playerId, username, email, phone, password);

      // Assert
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE player SET username = $1, email = $2, phone = $3, password = $4 WHERE id = $5 RETURNING *',
        [username, email, phone, password, playerId]
      );
      expect(result).toEqual(mockUpdatedPlayer);
    });

    test('deve retornar undefined quando player não existe para atualização', async () => {
      // Arrange
      const playerId = 999;
      const { username, email, phone, password } = testData.player.valid;
      db.query.mockResolvedValue(testUtils.mockEmptyResult());

      // Act
      const result = await playerModel.updatePlayer(playerId, username, email, phone, password);

      // Assert
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE player SET username = $1, email = $2, phone = $3, password = $4 WHERE id = $5 RETURNING *',
        [username, email, phone, password, playerId]
      );
      expect(result).toBeUndefined();
    });

    test('deve lançar erro quando dados de atualização são inválidos', async () => {
      // Arrange
      const playerId = 1;
      const dbError = new Error('invalid input syntax for type integer');
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(playerModel.updatePlayer(playerId, null, 'invalid-email', '', '')).rejects.toThrow('Erro ao atualizar player: invalid input syntax for type integer');
    });
  });

  describe('deletePlayer', () => {
    test('deve deletar player existente com sucesso', async () => {
      // Arrange
      const playerId = 1;
      const mockDeletedPlayer = testData.player.valid;
      db.query.mockResolvedValue(testUtils.mockSuccessResult(mockDeletedPlayer));

      // Act
      const result = await playerModel.deletePlayer(playerId);

      // Assert
      expect(db.query).toHaveBeenCalledWith('DELETE FROM player WHERE id = $1 RETURNING *', [playerId]);
      expect(result).toEqual(mockDeletedPlayer);
    });

    test('deve retornar undefined quando player não existe para deleção', async () => {
      // Arrange
      const playerId = 999;
      db.query.mockResolvedValue(testUtils.mockEmptyResult());

      // Act
      const result = await playerModel.deletePlayer(playerId);

      // Assert
      expect(db.query).toHaveBeenCalledWith('DELETE FROM player WHERE id = $1 RETURNING *', [playerId]);
      expect(result).toBeUndefined();
    });

    test('deve lançar erro quando há constraint de foreign key', async () => {
      // Arrange
      const playerId = 1;
      const dbError = new Error('update or delete on table "player" violates foreign key constraint');
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(playerModel.deletePlayer(playerId)).rejects.toThrow('Erro ao deletar player: update or delete on table "player" violates foreign key constraint');
      expect(db.query).toHaveBeenCalledWith('DELETE FROM player WHERE id = $1 RETURNING *', [playerId]);
    });
  });
});
