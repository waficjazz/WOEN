import express from "express";

const workflowController = require("../controllers/workflow-controller");

const router = express.Router();

router.get("/:wid", workflowController.getWorkflow);
router.post("/:wid/placement", workflowController.updateWorkflowPlacements);
router.post("/create", workflowController.createWorkflow);
router.get("/list/all", workflowController.getWorkflows);
router.post("/job/create", workflowController.createJob);
router.post("/job/update", workflowController.upateJobDependencies);
module.exports = router;
