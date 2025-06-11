const express = require("express");
const router = express.Router();
const cleaningController = require("../controllers/cleaningController");

router.get("/", cleaningController.getAllCleanings);
router.get("/:id", cleaningController.getCleaningById);
router.post("/", cleaningController.createCleaning);
router.put("/:id", cleaningController.updateCleaning);
router.delete("/:id", cleaningController.deleteCleaning);

module.exports = router;
