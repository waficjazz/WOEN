import express from "express";

const workflowController = require("../controllers/workflow-controller");

const router = express.Router();

router.get("/:wid/jobs", workflowController.getWorkflowJobs);
router.post("/create", workflowController.createWorkflow);
router.get("/list", workflowController.getWorkflows);
router.post("/job/create", workflowController.createJob);
router.post("/job/update", workflowController.upateJobDependencies);
module.exports = router;
