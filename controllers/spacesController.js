const spacesModel = require('../models/spacesModel');

const getAllSpaces = async (req, res) => {
  try {
    const spaces = await spacesModel.getAllSpaces();
    res.status(200).json(spaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSpaceById = async (req, res) => {
  try {
    const space = await spacesModel.getSpaceById(req.params.id);
    if (space) {
      res.status(200).json(space);
    } else {
      res.status(404).json({ error: 'Space not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createSpace = async (req, res) => {
  try {
    const { name, type, capacity, location } = req.body;
    const newSpace = await spacesModel.createSpace(name, type, capacity, location);
    res.status(201).json(newSpace);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSpace = async (req, res) => {
  try {
    const { name, type, capacity, location } = req.body;
    const updatedSpace = await spacesModel.updateSpace(req.params.id, name, type, capacity, location);
    if (updatedSpace) {
      res.status(200).json(updatedSpace);
    } else {
      res.status(404).json({ error: 'Space not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSpace = async (req, res) => {
  try {
    const deletedSpace = await spacesModel.deleteSpace(req.params.id);
    if (deletedSpace) {
      res.status(200).json(deletedSpace);
    } else {
      res.status(404).json({ error: 'Space not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllSpaces,
  getSpaceById,
  createSpace,
  updateSpace,
  deleteSpace,
};
