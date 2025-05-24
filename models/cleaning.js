// models/CleaningModel.js
const pool = require('../config/database');

const CleaningModel = {
  async getAll() {
    const res = await pool.query('SELECT * FROM cleaning ORDER BY id');
    return res.rows;
  },

  async getById(id) {
    const res = await pool.query('SELECT * FROM cleaning WHERE id = $1', [id]);
    return res.rows[0];
  },

  async create(cleaning) {
    const { reservation_id, space_id, employee_id, cleaning_date, status } = cleaning;
    const res = await pool.query(
      `INSERT INTO cleaning (reservation_id, space_id, employee_id, cleaning_date, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [reservation_id, space_id, employee_id, cleaning_date, status]
    );
    return res.rows[0];
  },

  async update(id, cleaning) {
    const { reservation_id, space_id, employee_id, cleaning_date, status } = cleaning;
    const res = await pool.query(
      `UPDATE cleaning SET reservation_id=$1, space_id=$2, employee_id=$3, cleaning_date=$4, status=$5, updated_at=NOW()
       WHERE id=$6 RETURNING *`,
      [reservation_id, space_id, employee_id, cleaning_date, status, id]
    );
    return res.rows[0];
  },

  async delete(id) {
    const res = await pool.query('DELETE FROM cleaning WHERE id=$1 RETURNING *', [id]);
    return res.rows[0];
  },
};

module.exports = CleaningModel;
