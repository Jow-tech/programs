const express = require("express");
const router = express.Router();
const spacesController = require("../controllers/spaces");

router.get("/", spacesController.getAllSpaces);
router.get("/:id", spacesController.getSpaceById);
router.post("/", spacesController.createSpace);
router.put("/:id", spacesController.updateSpace);
router.delete("/:id", spacesController.deleteSpace);

module.exports = router;
