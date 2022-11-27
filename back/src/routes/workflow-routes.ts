import express from "express";

const workflowController = require("../controllers/workflow-controller");

const router = express.Router();

router.get("/all", workflowController.getAllWorkflows);
router.get("/one/:wid", workflowController.getWorkflow);
router.get("/template/:wid", workflowController.getWorkflowTemplate);
router.get("/all/templates", workflowController.getAllWorkflowsTemplates);

router.delete("/job/:jid", workflowController.deleteJobTemplate);
router.delete("/template/:tid", workflowController.deleteWorkflowTemplate);
router.delete("/one/:wid", workflowController.deleteWorkflow);

router.post("/job/update", workflowController.upateJobDependencies);
router.post("/job/create", workflowController.createJobTemplate);
router.post("/:wid/placement", workflowController.updateWorkflowPlacements);
router.post("/create", workflowController.createWorkflowTemplate);

router.post("/init", workflowController.initWorkflow);
module.exports = router;
