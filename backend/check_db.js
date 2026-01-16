const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Workflow = require('./models/Workflow');
const Step = require('./models/Step');

dotenv.config();

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const workflowCount = await Workflow.countDocuments();
        const stepCount = await Step.countDocuments();

        console.log(`Workflows: ${workflowCount}`);
        console.log(`Steps: ${stepCount}`);

        const workflows = await Workflow.find({});
        console.log('Sample Workflow IDs:', workflows.map(w => ({ title: w.title, id: w._id })));

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkData();
