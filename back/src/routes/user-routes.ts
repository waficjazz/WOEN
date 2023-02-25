import express from "express";
const { auth } = require("../middleware/auth");
const userController = require("../controllers/user-controller");

const router = express.Router();

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/project", auth, userController.createProject);
router.get("/all/projects", auth, userController.listProjects);

module.exports = router;
