const cleaningModel = require('../models/cleaningModel');

const getAllCleanings = async (req, res) => {
  try {
    const cleanings = await cleaningModel.getAllCleanings();
    res.status(200).json(cleanings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCleaningById = async (req, res) => {
  try {
    const cleaning = await cleaningModel.getCleaningById(req.params.id);
    if (cleaning) {
      res.status(200).json(cleaning);
    } else {
      res.status(404).json({ error: 'Cleaning not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCleaning = async (req, res) => {
  try {
    const { reservation_id, space_id, employee_id, cleaning_date, status } = req.body;
    const newCleaning = await cleaningModel.createCleaning(reservation_id, space_id, employee_id, cleaning_date, status);
    res.status(201).json(newCleaning);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCleaning = async (req, res) => {
  try {
    const { reservation_id, space_id, employee_id, cleaning_date, status } = req.body;
    const updatedCleaning = await cleaningModel.updateCleaning(req.params.id, reservation_id, space_id, employee_id, cleaning_date, status);
    if (updatedCleaning) {
      res.status(200).json(updatedCleaning);
    } else {
      res.status(404).json({ error: 'Cleaning not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCleaning = async (req, res) => {
  try {
    const deletedCleaning = await cleaningModel.deleteCleaning(req.params.id);
    if (deletedCleaning) {
      res.status(200).json(deletedCleaning);
    } else {
      res.status(404).json({ error: 'Cleaning not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCleanings,
  getCleaningById,
  createCleaning,
  updateCleaning,
  deleteCleaning,
};
