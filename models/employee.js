 // models/EmployeeModel.js
const pool = require('../config/database');

const EmployeeModel = {
  async getAll() {
    const res = await pool.query('SELECT * FROM employees ORDER BY id');
    return res.rows;
  },

  async getById(id) {
    const res = await pool.query('SELECT * FROM employees WHERE id = $1', [id]);
    return res.rows[0];
  },

  async create(employee) {
    const { name, role, phone, email } = employee;
    const res = await pool.query(
      'INSERT INTO employees (name, role, phone, email) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, role, phone, email]
    );
    return res.rows[0];
  },

  async update(id, employee) {
    const { name, role, phone, email } = employee;
    const res = await pool.query(
      'UPDATE employees SET name=$1, role=$2, phone=$3, email=$4, updated_at=NOW() WHERE id=$5 RETURNING *',
      [name, role, phone, email, id]
    );
    return res.rows[0];
  },

  async delete(id) {
    const res = await pool.query('DELETE FROM employees WHERE id=$1 RETURNING *', [id]);
    return res.rows[0];
  },
};

module.exports = EmployeeModel;
