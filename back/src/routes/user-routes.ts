import express from "express";

const userController = require("../controllers/user-controller");

const router = express.Router();

router.post("/signup", userController.signup);
router.post("/login", userController.getUsers);

module.exports = router;
