const express = require("express");
const router = express.Router();

// Importar rotas da API
const userRoutes = require("./userRoutes");
const spaceRoutes = require("./spaceRoutes");
const reservationRoutes = require("./reservationRoutes");
const cleaningRoutes = require("./cleaningRoutes");
const employeeRoutes = require("./employeeRoutes");

// Configurar rotas da API com caminhos únicos
router.use("/players", userRoutes); // /api/players
router.use("/spaces", spaceRoutes); // /api/spaces
router.use("/reservations", reservationRoutes); // /api/reservations
router.use("/cleaning", cleaningRoutes); // /api/cleaning
router.use("/employees", employeeRoutes); // /api/employees

module.exports = router;
