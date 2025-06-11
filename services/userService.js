// services/userService.js

const db = require("../config/db");

// Função para obter todos os usuários (players)
const getAllPlayers = async () => {
  try {
    const result = await db.query("SELECT * FROM player ORDER BY id");
    return result.rows;
  } catch (error) {
    throw new Error("Erro ao obter usuários: " + error.message);
  }
};

// Função para obter um usuário por ID
const getPlayerById = async (id) => {
  try {
    const result = await db.query("SELECT * FROM player WHERE id = $1", [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error("Erro ao obter usuário: " + error.message);
  }
};

// Função para criar um novo usuário
const createPlayer = async (username, email, phone, password) => {
  try {
    const result = await db.query(
      "INSERT INTO player (username, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, phone, password]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Erro ao criar usuário: " + error.message);
  }
};

// Função para atualizar um usuário por ID
const updatePlayer = async (id, username, email, phone, password) => {
  try {
    const result = await db.query(
      "UPDATE player SET username = $1, email = $2, phone = $3, password = $4 WHERE id = $5 RETURNING *",
      [username, email, phone, password, id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Erro ao atualizar usuário: " + error.message);
  }
};

// Função para deletar um usuário por ID
const deletePlayer = async (id) => {
  try {
    const result = await db.query(
      "DELETE FROM player WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Erro ao deletar usuário: " + error.message);
  }
};

module.exports = {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
};
