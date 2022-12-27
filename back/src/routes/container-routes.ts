import express from "express";
const { auth } = require("../middleware/auth");
const containerController = require("../controllers/container-controller");

const router = express.Router();

router.get("/images", auth, containerController.listImages);
router.post("/create", auth, containerController.createContainer);
router.post("/run", auth, containerController.runContainer);
router.get("/list", auth, containerController.listContainers);
router.delete("/remove", auth, containerController.removeContainer);
router.post("/logs", auth, containerController.getContainerLogs);
router.post("/save", auth, containerController.saveContainer);
router.post("/pause", auth, containerController.pauseContainer);
router.post("/unpause", auth, containerController.unpauseContainer);
router.get("/saved", auth, containerController.getSavedContainers);
module.exports = router;
