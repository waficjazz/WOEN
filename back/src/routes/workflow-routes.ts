import express from "express";

const userController = require("../controllers/container-controller");

const router = express.Router();

router.post("/create", userController.createContainer);
module.exports = router;
