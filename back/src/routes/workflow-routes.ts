import express from "express";

const workflowController = require("../controllers/workflow-controller");

const router = express.Router();

router.post("/create", workflowController.createWorkflow);
router.get("/list", workflowController.getWorkflows);
module.exports = router;
