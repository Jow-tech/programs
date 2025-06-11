// models/cleaningModel.js

const db = require('../config/db');

// Função para obter todos os agendamentos de limpeza
const getAllCleanings = async () => {
  try {
    const result = await db.query('SELECT * FROM cleaning ORDER BY id');
    return result.rows;
  } catch (error) {
    throw new Error('Erro ao obter agendamentos de limpeza: ' + error.message);
  }
};

// Função para obter um agendamento de limpeza por ID
const getCleaningById = async (id) => {
  try {
    const result = await db.query('SELECT * FROM cleaning WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error('Erro ao obter agendamento de limpeza: ' + error.message);
  }
};

// Função para criar um novo agendamento de limpeza
const createCleaning = async (reservation_id, space_id, employee_id, cleaning_date, status) => {
  try {
    const result = await db.query(
      'INSERT INTO cleaning (reservation_id, space_id, employee_id, cleaning_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [reservation_id, space_id, employee_id, cleaning_date, status]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Erro ao criar agendamento de limpeza: ' + error.message);
  }
};

// Função para atualizar um agendamento de limpeza por ID
const updateCleaning = async (id, reservation_id, space_id, employee_id, cleaning_date, status) => {
  try {
    const result = await db.query(
      'UPDATE cleaning SET reservation_id = $1, space_id = $2, employee_id = $3, cleaning_date = $4, status = $5 WHERE id = $6 RETURNING *',
      [reservation_id, space_id, employee_id, cleaning_date, status, id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Erro ao atualizar agendamento de limpeza: ' + error.message);
  }
};

// Função para deletar um agendamento de limpeza por ID
const deleteCleaning = async (id) => {
  try {
    const result = await db.query('DELETE FROM cleaning WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error('Erro ao deletar agendamento de limpeza: ' + error.message);
  }
};

module.exports = {
  getAllCleanings,
  getCleaningById,
  createCleaning,
  updateCleaning,
  deleteCleaning
};
