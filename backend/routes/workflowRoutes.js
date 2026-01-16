const express = require('express');
const router = express.Router();
const { getWorkflows, getWorkflowSteps, getWorkflowById } = require('../controllers/workflowController');

router.get('/', getWorkflows);
router.get('/:id', getWorkflowById); // Add this BEFORE :id/steps or ensure no conflict. Actually :id matches everything so place it carefully.
// Wait, :id matches "123". :id/steps matches "123/steps". 
// Express matches explicitly defined paths first usually, but params are tricky.
// Better to place specific paths first.
// However, :id is a param. 
// Let's use:
// router.get('/:id', getWorkflowById);
// router.get('/:id/steps', getWorkflowSteps);
// Express route matching: "/:id/steps" vs "/:id". 
// If I request "/123/steps", it matches "/:id" if I don't define the other one differently?
// Actually express handles "/:id/steps" correctly even if "/:id" is defined, provided param matching doesn't consume it inappropriately.
// Standard practice: Put simple params last if possible, OR rely on specific suffix match. 
// "/:id/steps" is more specific than "/:id" IN THIS CASE? No, they share prefix.
// The order matters.
// If I put router.get('/:id', ...) FIRST, it might intercept /:id/steps if strict routing isn't used or if not careful.
// BUT "/:id/steps" has a suffix. 
// Safest: router.get('/:id/steps') first.
router.get('/:id/steps', (req, res, next) => {
    console.log(`Hit /:id/steps with id: ${req.params.id}`);
    next();
}, getWorkflowSteps);

router.get('/:id', (req, res, next) => {
    console.log(`Hit /:id with id: ${req.params.id}`);
    next();
}, getWorkflowById);

module.exports = router;
