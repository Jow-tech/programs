// services/reservationService.js

const db = require('../config/db');

// Função para obter todas as reservas
const getAllReservations = async () => {
  try {
    const result = await db.query('SELECT * FROM reservation ORDER BY id');
    return result.rows;
  } catch (error) {
    throw new Error('Erro ao obter reservas: ' + error.message);
  }
};

// Função para obter uma reserva por ID
const getReservationById = async (id) => {
  try {
    const result = await db.query('SELECT * FROM reservation WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error('Erro ao obter reserva: ' + error.message);
  }
};

// Função para criar uma nova reserva
const createReservation = async (user_id, space_id, reservation_date, initial_hour, final_hour, status) => {
  try {
    const result = await db.query(
      'INSERT INTO reservation (user_id, space_id, reservation_date, initial_hour, final_hour, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user_id, space_id, reservation_date, initial_hour, final_hour, status]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Erro ao criar reserva: ' + error.message);
  }
};

// Função para atualizar uma reserva por ID
const updateReservation = async (id, user_id, space_id, reservation_date, initial_hour, final_hour, status) => {
  try {
    const result = await db.query(
      'UPDATE reservation SET user_id = $1, space_id = $2, reservation_date = $3, initial_hour = $4, final_hour = $5, status = $6 WHERE id = $7 RETURNING *',
      [user_id, space_id, reservation_date, initial_hour, final_hour, status, id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Erro ao atualizar reserva: ' + error.message);
  }
};

// Função para deletar uma reserva por ID
const deleteReservation = async (id) => {
  try {
    const result = await db.query('DELETE FROM reservation WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error('Erro ao deletar reserva: ' + error.message);
  }
};

module.exports = {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation
};
