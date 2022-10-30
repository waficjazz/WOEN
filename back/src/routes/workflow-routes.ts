import express from "express";

const workflowController = require("../controllers/workflow-controller");

const router = express.Router();

router.post("/create", workflowController.createWorkflow);
router.get("/list", workflowController.getWorkflows);
router.post("/job/create", workflowController.createJob);
module.exports = router;
