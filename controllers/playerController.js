const playerModel = require("../models/playerModel");

const getAllPlayers = async (req, res) => {
  try {
    const players = await playerModel.getAllPlayers();
    res.status(200).json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPlayerById = async (req, res) => {
  try {
    const player = await playerModel.getPlayerById(req.params.id);
    if (player) {
      res.status(200).json(player);
    } else {
      res.status(404).json({ error: "Player not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPlayer = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;
    const newPlayer = await playerModel.createPlayer(
      username,
      email,
      phone,
      password
    );
    res.status(201).json(newPlayer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePlayer = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;
    const updatedPlayer = await playerModel.updatePlayer(
      req.params.id,
      username,
      email,
      phone,
      password
    );
    if (updatedPlayer) {
      res.status(200).json(updatedPlayer);
    } else {
      res.status(404).json({ error: "Player not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePlayer = async (req, res) => {
  try {
    const deletedPlayer = await playerModel.deletePlayer(req.params.id);
    if (deletedPlayer) {
      res.status(200).json(deletedPlayer);
    } else {
      res.status(404).json({ error: "Player not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
};
