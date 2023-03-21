import express from "express";
const { auth } = require("../middleware/auth");

const workflowController = require("../controllers/workflow-controller");
const wTemplateController = require("../controllers/w-template-controller");
const router = express.Router();

router.get("/all/:pid", auth, workflowController.getAllWorkflows);
router.get("/one/:wid", auth, workflowController.getWorkflow);
router.get("/template/:wid", auth, workflowController.getWorkflowTemplate);
router.get("/all/templates/:pid", auth, workflowController.getAllWorkflowsTemplates);

router.delete("/template/:jid", auth, workflowController.deleteJobTemplate);
router.delete("/template/:tid", auth, workflowController.deleteWorkflowTemplate);
router.delete("/one/:wid", auth, workflowController.deleteWorkflow);

router.post("/job/update", auth, workflowController.upateJobDependencies);
router.post("/job/create", auth, workflowController.createJobTemplate);
router.post("/:wid/placement", auth, workflowController.updateWorkflowPlacements);
router.post("/:wid/pause", auth, workflowController.pauseWokflow);
router.post("/:wid/resume", auth, workflowController.resumeWorkflow);
router.post("/create", auth, wTemplateController.createWorkflowTemplate);
router.post("/submit", auth, wTemplateController.submitWorkflowTemplate);
router.post("/job/:jid/pause", auth, workflowController.pauseJob);
router.post("/job/:jid/unpause", auth, workflowController.unpauseJob);
router.post("/addParams", auth, workflowController.setTemplateParams);
router.post("/job/:jtid/setCond", auth, workflowController.setJobCondition);

router.post("/job/outParams", auth, workflowController.setOutputParams);
router.get("/job/outParams/:jtid", auth, workflowController.getJTOutputParams);

router.post("/job/inParams", auth, workflowController.setInputParams);
router.get("/job/inParams/:jtid", auth, workflowController.getJTInputParams);

router.post("/init", auth, workflowController.initWorkflow);
module.exports = router;
