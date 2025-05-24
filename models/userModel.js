const pool = require('../config/database');

const PlayerModel = {
  async getAll() {
    const res = await pool.query('SELECT * FROM player ORDER BY id');
    return res.rows;
  },

  async getById(id) {
    const res = await pool.query('SELECT * FROM player WHERE id = $1', [id]);
    return res.rows[0];
  },

  async create(player) {
    const { username, email, phone, password } = player;
    const res = await pool.query(
      'INSERT INTO player (username, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, email, phone, password]
    );
    return res.rows[0];
  },

  async update(id, player) {
    const { username, email, phone, password } = player;
    const res = await pool.query(
      'UPDATE player SET username=$1, email=$2, phone=$3, password=$4, updated_at=NOW() WHERE id=$5 RETURNING *',
      [username, email, phone, password, id]
    );
    return res.rows[0];
  },

  async delete(id) {
    const res = await pool.query('DELETE FROM player WHERE id=$1 RETURNING *', [id]);
    return res.rows[0];
  },
};

module.exports = PlayerModel;
