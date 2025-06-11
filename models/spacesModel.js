// models/spacesModel.js

const db = require('../config/db');

// Função para obter todos os espaços
const getAllSpaces = async () => {
  try {
    const result = await db.query('SELECT * FROM spaces ORDER BY id');
    return result.rows;
  } catch (error) {
    throw new Error('Erro ao obter espaços: ' + error.message);
  }
};

// Função para obter um espaço por ID
const getSpaceById = async (id) => {
  try {
    const result = await db.query('SELECT * FROM spaces WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error('Erro ao obter espaço: ' + error.message);
  }
};

// Função para criar um novo espaço
const createSpace = async (name, type, capacity, location) => {
  try {
    const result = await db.query(
      'INSERT INTO spaces (name, type, capacity, location) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, type, capacity, location]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Erro ao criar espaço: ' + error.message);
  }
};

// Função para atualizar um espaço por ID
const updateSpace = async (id, name, type, capacity, location) => {
  try {
    const result = await db.query(
      'UPDATE spaces SET name = $1, type = $2, capacity = $3, location = $4 WHERE id = $5 RETURNING *',
      [name, type, capacity, location, id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Erro ao atualizar espaço: ' + error.message);
  }
};

// Função para deletar um espaço por ID
const deleteSpace = async (id) => {
  try {
    const result = await db.query('DELETE FROM spaces WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error('Erro ao deletar espaço: ' + error.message);
  }
};

module.exports = {
  getAllSpaces,
  getSpaceById,
  createSpace,
  updateSpace,
  deleteSpace
};
