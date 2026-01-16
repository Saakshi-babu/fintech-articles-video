const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Workflow = require('./models/Workflow');

dotenv.config();

const checkWorkflows = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const workflows = await Workflow.find({});
        console.log('--- DB Workflows ---');
        workflows.forEach(w => console.log(`[${w.type}] ${w.title}`));
        console.log('--------------------');

        // Check specifically for apply
        const applyCount = await Workflow.countDocuments({ type: 'apply' });
        console.log(`Total 'apply' workflows: ${applyCount}`);

        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkWorkflows();
