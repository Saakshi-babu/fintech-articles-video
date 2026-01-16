const Workflow = require('../models/Workflow');
const Step = require('../models/Step');
const Resource = require('../models/Resource');

// @desc    Get all workflows
// @route   GET /api/workflows
// @access  Public
const getWorkflows = async (req, res) => {
    try {
        const { type } = req.query;
        const filter = type ? { type } : {};
        const workflows = await Workflow.find(filter);
        res.json(workflows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get workflow steps
// @route   GET /api/workflows/:id/steps
// @access  Public
const getWorkflowSteps = async (req, res) => {
    try {
        const steps = await Step.find({ workflowId: req.params.id }).sort({ order: 1 });
        // Fetch resources for each step
        const stepsWithResources = await Promise.all(steps.map(async (step) => {
            const resources = await Resource.find({ stepId: step._id });
            return { ...step._doc, resources };
        }));

        res.json(stepsWithResources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single workflow by ID
// @route   GET /api/workflows/:id
// @access  Public
const getWorkflowById = async (req, res) => {
    try {
        const workflow = await Workflow.findById(req.params.id);
        if (workflow) {
            res.json(workflow);
        } else {
            res.status(404).json({ message: 'Workflow not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getWorkflows,
    getWorkflowSteps,
    getWorkflowById,
};
