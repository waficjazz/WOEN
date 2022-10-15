import express from "express";

const userController = require("../controllers/container-controller");

const router = express.Router();

router.get("/images", userController.listImages);
router.post("/create", userController.createContainer);
router.post("/run", userController.runContainer);
router.get("/list", userController.listContainers);
router.delete("/remove", userController.removeContainer);
router.post("/logs", userController.getContainerLogs);
router.post("/save", userController.saveContainer);
router.get("/saved", userController.getSavedContainers);
module.exports = router;
