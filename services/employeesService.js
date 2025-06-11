// services/employeesService.js

const db = require('../config/db');

// Função para obter todos os funcionários
const getAllEmployees = async () => {
  try {
    const result = await db.query('SELECT * FROM employees ORDER BY id');
    return result.rows;
  } catch (error) {
    throw new Error('Erro ao obter funcionários: ' + error.message);
  }
};

// Função para obter um funcionário por ID
const getEmployeeById = async (id) => {
  try {
    const result = await db.query('SELECT * FROM employees WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error('Erro ao obter funcionário: ' + error.message);
  }
};

// Função para criar um novo funcionário
const createEmployee = async (name, role, phone, email) => {
  try {
    const result = await db.query(
      'INSERT INTO employees (name, role, phone, email) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, role, phone, email]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Erro ao criar funcionário: ' + error.message);
  }
};

// Função para atualizar um funcionário por ID
const updateEmployee = async (id, name, role, phone, email) => {
  try {
    const result = await db.query(
      'UPDATE employees SET name = $1, role = $2, phone = $3, email = $4 WHERE id = $5 RETURNING *',
      [name, role, phone, email, id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Erro ao atualizar funcionário: ' + error.message);
  }
};

// Função para deletar um funcionário por ID
const deleteEmployee = async (id) => {
  try {
    const result = await db.query('DELETE FROM employees WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error('Erro ao deletar funcionário: ' + error.message);
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
