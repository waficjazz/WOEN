import express from "express";

const workflowController = require("../controllers/workflow-controller");

const router = express.Router();

router.get("/:wid", workflowController.getWorkflowTemplate);
router.post("/:wid/placement", workflowController.updateWorkflowPlacements);
router.post("/create", workflowController.createWorkflowTemplate);
router.get("/list/all", workflowController.getAllWorkflowsTemplates);
router.post("/job/create", workflowController.createJobTemplate);
router.post("/job/update", workflowController.upateJobDependencies);
router.delete("/job/:jid", workflowController.deleteJobTemplate);
module.exports = router;
