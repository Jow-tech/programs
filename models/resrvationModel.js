const pool = require('../config/database');

const ReservationModel = {
  async getAll() {
    const res = await pool.query('SELECT * FROM reservation ORDER BY id');
    return res.rows;
  },

  async getById(id) {
    const res = await pool.query('SELECT * FROM reservation WHERE id = $1', [id]);
    return res.rows[0];
  },

  async create(reservation) {
    const { user_id, space_id, reservation_date, initial_hour, final_hour, status } = reservation;
    const res = await pool.query(
      `INSERT INTO reservation 
      (user_id, space_id, reservation_date, initial_hour, final_hour, status) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id, space_id, reservation_date, initial_hour, final_hour, status]
    );
    return res.rows[0];
  },

  async update(id, reservation) {
    const { user_id, space_id, reservation_date, initial_hour, final_hour, status } = reservation;
    const res = await pool.query(
      `UPDATE reservation SET 
        user_id=$1, space_id=$2, reservation_date=$3, initial_hour=$4, final_hour=$5, status=$6, updated_at=NOW() 
       WHERE id=$7 RETURNING *`,
      [user_id, space_id, reservation_date, initial_hour, final_hour, status, id]
    );
    return res.rows[0];
  },

  async delete(id) {
    const res = await pool.query('DELETE FROM reservation WHERE id=$1 RETURNING *', [id]);
    return res.rows[0];
  },
};

module.exports = ReservationModel;
