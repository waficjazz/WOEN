import express from "express";
const { auth } = require("../middleware/auth");

const workflowController = require("../controllers/workflow-controller");

const router = express.Router();

router.get("/all", auth, workflowController.getAllWorkflows);
router.get("/one/:wid", auth, workflowController.getWorkflow);
router.get("/template/:wid", auth, workflowController.getWorkflowTemplate);
router.get("/all/templates", auth, workflowController.getAllWorkflowsTemplates);

router.delete("/template/:jid", auth, workflowController.deleteJobTemplate);
router.delete("/template/:tid", auth, workflowController.deleteWorkflowTemplate);
router.delete("/one/:wid", auth, workflowController.deleteWorkflow);

router.post("/job/update", auth, workflowController.upateJobDependencies);
router.post("/job/create", auth, workflowController.createJobTemplate);
router.post("/:wid/placement", auth, workflowController.updateWorkflowPlacements);
router.post("/:wid/pause", auth, workflowController.pauseWokflow);
router.post("/:wid/resume", auth, workflowController.resumeWorkflow);
router.post("/create", auth, workflowController.createWorkflowTemplate);
router.post("/job/:jid/pause", auth, workflowController.pauseJob);
router.post("/job/:jid/unpause", auth, workflowController.unpauseJob);

router.post("/init", auth, workflowController.initWorkflow);
module.exports = router;
