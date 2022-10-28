import express from "express";

const workflowController = require("../controllers/workflow-controller");

const router = express.Router();

router.post("/create", workflowController.createWorkflow);
module.exports = router;
