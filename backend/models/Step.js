const mongoose = require('mongoose');

const StepSchema = new mongoose.Schema({
    workflowId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workflow',
        required: true,
    },
    order: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String, // Detailed explanation
        required: true,
    },
    websiteUrl: {
        type: String,
    },
    requiredDocuments: [{
        type: String,
    }],
    actionChecklist: [{ // Practical instructions e.g., "Click on 'New Application'"
        type: String,
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Step', StepSchema);
