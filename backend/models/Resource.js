const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    stepId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Step',
    },
    workflowId: { // Can be linked to a whole workflow if general
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workflow',
    },
    title: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['article', 'video'],
        required: true,
    },
    source: {
        type: String, // e.g., "YouTube", "Investopedia"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Resource', ResourceSchema);
