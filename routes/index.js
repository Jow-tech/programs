const express = require('express');
const router = express.Router();

// Importar rotas da API
const userRoutes = require('./userRoutes');
const spaceRoutes = require('./spaceRoutes');
const reservationRoutes = require('./reservationRoutes');
const cleaningRoutes = require('./cleaningRoutes');
const employeeRoutes = require('./employeeRoutes');

// Configurar rotas da API
router.use('/users', userRoutes);
router.use('/spaces', spaceRoutes);
router.use('/reservations', reservationRoutes);
router.use('/cleaning', cleaningRoutes);
router.use('/employees', employeeRoutes);

module.exports = router;
