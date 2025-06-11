// tests/spacesModel.test.js
const db = require('../config/db');
const spacesModel = require('../models/spacesModel');

// Mock do módulo de banco de dados
jest.mock('../config/db');

describe('SpacesModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllSpaces', () => {
    test('deve retornar todos os espaços com sucesso', async () => {
      // Arrange
      const mockSpaces = [
        testData.space.valid,
        { ...testData.space.valid, id: 2, name: 'Sala B', location: 'Andar 2' }
      ];
      db.query.mockResolvedValue(testUtils.mockSuccessResult(mockSpaces));

      // Act
      const result = await spacesModel.getAllSpaces();

      // Assert
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM spaces ORDER BY id');
      expect(result).toEqual(mockSpaces);
      expect(result).toHaveLength(2);
    });

    test('deve lançar erro quando há falha na conexão com banco', async () => {
      // Arrange
      const dbError = testUtils.mockDatabaseError();
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(spacesModel.getAllSpaces()).rejects.toThrow('Erro ao obter espaços: Erro de conexão com o banco de dados');
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM spaces ORDER BY id');
    });

    test('deve lançar erro quando query SQL falha', async () => {
      // Arrange
      const sqlError = new Error('relation "spaces" does not exist');
      db.query.mockRejectedValue(sqlError);

      // Act & Assert
      await expect(spacesModel.getAllSpaces()).rejects.toThrow('Erro ao obter espaços: relation "spaces" does not exist');
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM spaces ORDER BY id');
    });
  });

  describe('getSpaceById', () => {
    test('deve retornar espaço específico por ID com sucesso', async () => {
      // Arrange
      const spaceId = 1;
      const mockSpace = testData.space.valid;
      db.query.mockResolvedValue(testUtils.mockSuccessResult(mockSpace));

      // Act
      const result = await spacesModel.getSpaceById(spaceId);

      // Assert
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM spaces WHERE id = $1', [spaceId]);
      expect(result).toEqual(mockSpace);
    });

    test('deve retornar undefined quando espaço não existe', async () => {
      // Arrange
      const spaceId = 999;
      db.query.mockResolvedValue(testUtils.mockEmptyResult());

      // Act
      const result = await spacesModel.getSpaceById(spaceId);

      // Assert
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM spaces WHERE id = $1', [spaceId]);
      expect(result).toBeUndefined();
    });

    test('deve lançar erro quando ID é inválido', async () => {
      // Arrange
      const invalidId = 'invalid';
      const dbError = new Error('invalid input syntax for type integer');
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(spacesModel.getSpaceById(invalidId)).rejects.toThrow('Erro ao obter espaço: invalid input syntax for type integer');
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM spaces WHERE id = $1', [invalidId]);
    });
  });

  describe('createSpace', () => {
    test('deve criar novo espaço com sucesso', async () => {
      // Arrange
      const { name, type, capacity, location } = testData.space.valid;
      const mockCreatedSpace = { ...testData.space.valid, id: 3 };
      db.query.mockResolvedValue(testUtils.mockSuccessResult(mockCreatedSpace));

      // Act
      const result = await spacesModel.createSpace(name, type, capacity, location);

      // Assert
      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO spaces (name, type, capacity, location) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, type, capacity, location]
      );
      expect(result).toEqual(mockCreatedSpace);
      expect(result.id).toBeDefined();
    });

    test('deve lançar erro quando dados obrigatórios estão ausentes', async () => {
      // Arrange
      const dbError = new Error('null value in column "name" violates not-null constraint');
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(spacesModel.createSpace('', '', null, '')).rejects.toThrow('Erro ao criar espaço: null value in column "name" violates not-null constraint');
    });

    test('deve lançar erro quando capacidade é inválida', async () => {
      // Arrange
      const { name, type, location } = testData.space.valid;
      const invalidCapacity = -5;
      const dbError = new Error('check constraint "spaces_capacity_check" is violated');
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(spacesModel.createSpace(name, type, invalidCapacity, location)).rejects.toThrow('Erro ao criar espaço: check constraint "spaces_capacity_check" is violated');
    });
  });

  describe('updateSpace', () => {
    test('deve atualizar espaço existente com sucesso', async () => {
      // Arrange
      const spaceId = 1;
      const { name, type, capacity, location } = testData.space.valid;
      const mockUpdatedSpace = { ...testData.space.valid, name: 'Sala Atualizada' };
      db.query.mockResolvedValue(testUtils.mockSuccessResult(mockUpdatedSpace));

      // Act
      const result = await spacesModel.updateSpace(spaceId, name, type, capacity, location);

      // Assert
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE spaces SET name = $1, type = $2, capacity = $3, location = $4 WHERE id = $5 RETURNING *',
        [name, type, capacity, location, spaceId]
      );
      expect(result).toEqual(mockUpdatedSpace);
    });

    test('deve retornar undefined quando espaço não existe para atualização', async () => {
      // Arrange
      const spaceId = 999;
      const { name, type, capacity, location } = testData.space.valid;
      db.query.mockResolvedValue(testUtils.mockEmptyResult());

      // Act
      const result = await spacesModel.updateSpace(spaceId, name, type, capacity, location);

      // Assert
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE spaces SET name = $1, type = $2, capacity = $3, location = $4 WHERE id = $5 RETURNING *',
        [name, type, capacity, location, spaceId]
      );
      expect(result).toBeUndefined();
    });

    test('deve lançar erro quando dados de atualização são inválidos', async () => {
      // Arrange
      const spaceId = 1;
      const dbError = new Error('value too long for type character varying(100)');
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(spacesModel.updateSpace(spaceId, 'a'.repeat(200), null, -1, '')).rejects.toThrow('Erro ao atualizar espaço: value too long for type character varying(100)');
    });
  });

  describe('deleteSpace', () => {
    test('deve deletar espaço existente com sucesso', async () => {
      // Arrange
      const spaceId = 1;
      const mockDeletedSpace = testData.space.valid;
      db.query.mockResolvedValue(testUtils.mockSuccessResult(mockDeletedSpace));

      // Act
      const result = await spacesModel.deleteSpace(spaceId);

      // Assert
      expect(db.query).toHaveBeenCalledWith('DELETE FROM spaces WHERE id = $1 RETURNING *', [spaceId]);
      expect(result).toEqual(mockDeletedSpace);
    });

    test('deve retornar undefined quando espaço não existe para deleção', async () => {
      // Arrange
      const spaceId = 999;
      db.query.mockResolvedValue(testUtils.mockEmptyResult());

      // Act
      const result = await spacesModel.deleteSpace(spaceId);

      // Assert
      expect(db.query).toHaveBeenCalledWith('DELETE FROM spaces WHERE id = $1 RETURNING *', [spaceId]);
      expect(result).toBeUndefined();
    });

    test('deve lançar erro quando há constraint de foreign key', async () => {
      // Arrange
      const spaceId = 1;
      const dbError = new Error('update or delete on table "spaces" violates foreign key constraint');
      db.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(spacesModel.deleteSpace(spaceId)).rejects.toThrow('Erro ao deletar espaço: update or delete on table "spaces" violates foreign key constraint');
      expect(db.query).toHaveBeenCalledWith('DELETE FROM spaces WHERE id = $1 RETURNING *', [spaceId]);
    });
  });
});
