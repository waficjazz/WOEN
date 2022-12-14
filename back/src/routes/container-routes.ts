import express from "express";
const { auth } = require("../middleware/auth");
const userController = require("../controllers/container-controller");

const router = express.Router();

router.get("/images", auth, userController.listImages);
router.post("/create", auth, userController.createContainer);
router.post("/run", auth, userController.runContainer);
router.get("/list", auth, userController.listContainers);
router.delete("/remove", auth, userController.removeContainer);
router.post("/logs", auth, userController.getContainerLogs);
router.post("/save", auth, userController.saveContainer);
router.get("/saved", auth, userController.getSavedContainers);
module.exports = router;
