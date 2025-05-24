const User = require("./employee");

class spaces {
  static async getAllUsers() {
    const result = await db.query('SELECT * FROM reservation');
    return result.rows;
  }

  static async getUserById(id) {
    const result = await db.query('SELECT * FROM reservations WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async createUser(data) {
    const result = await db.query(
      'INSERT INTO users (name, type, capacity, location) VALUES ($1, $2, $3, $4) RETURNING *',
      [this.name, type, capacity, location]
    );
    return result.rows[0];
  }

  static async updateUser(id, data) {
    const result = await db.query(
      'UPDATE users SET name = $1, type = $2, capacity = $3, location = $5, WHERE id = 6% RETURNING *',
      [this.name, type, capacity, location, id]
    );
    return result.rows[0];
  }

  static async deleteUser(id) {
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return result.rowCount > 0;
  }
}

module.exports = spaces;