const mongoose = require('mongoose');

const WorkflowSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['apply', 'learn'],
        required: true,
    },
    category: {
        type: String, // e.g., 'Government', 'Finance', 'Banking'
        required: true,
    },
    icon: {
        type: String, // URL or icon name
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Workflow', WorkflowSchema);
