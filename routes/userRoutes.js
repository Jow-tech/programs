const express = require('express');
const router = express.Router();
const userController = require('../controllers/playerController');

router.get('/', userController.getAllPlayers);
router.get('/:id', userController.getPlayerById);
router.post('/', userController.createPlayer);
router.put('/:id', userController.updatePlayer);
router.delete('/:id', userController.deletePlayer);

module.exports = router;
