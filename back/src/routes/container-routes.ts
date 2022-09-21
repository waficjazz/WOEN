import express from "express";

const userController = require("../controllers/container-controller");

const router = express.Router();

router.get("/images", userController.listImages);
router.post("/create", userController.createContainer);
router.post("/run", userController.runContainer);
module.exports = router;
