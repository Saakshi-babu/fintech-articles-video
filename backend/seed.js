const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Workflow = require('./models/Workflow');
const Step = require('./models/Step');
const Resource = require('./models/Resource');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear existing data
        await Workflow.deleteMany({});
        await Step.deleteMany({});
        await Resource.deleteMany({});

        // === APPLY WORKFLOWS ===

        // 1. PAN Card
        const panWorkflow = await Workflow.create({
            title: 'Apply for PAN Card',
            description: 'Step-by-step guide to apply for a Permanent Account Number (PAN) in India.',
            type: 'apply',
            category: 'Government',
        });
        await createSteps(panWorkflow._id, [
            { order: 1, title: 'Visit NSDL or UTIITSL Website', description: 'Go to the official NSDL (Protean) website.', actionChecklist: ['Open https://www.onlineservices.nsdl.com/', 'Select Application Type: New PAN (Form 49A)', 'Select Category: Individual'] },
            { order: 2, title: 'Fill Personal Details', description: 'Enter details exactly as per Aadhaar.', actionChecklist: ['Enter Name & DOB', 'Enter Email & Mobile', 'Submit and save Token Number'] },
            { order: 3, title: 'Submit Documents', description: 'Use Aadhaar e-KYC for paperless submission.', actionChecklist: ['Select "Submit digitally through e-KYC"', 'Enter Aadhaar Number', 'Authenticate via OTP'] },
            { order: 4, title: 'Payment & Submission', description: 'Pay the fee (approx ₹101).', actionChecklist: ['Pay via UPI/Card', 'Download Acknowledgement'] }
        ]);

        // 2. Aadhaar Card
        const aadhaarWorkflow = await Workflow.create({
            title: 'Apply for Aadhaar Card',
            description: 'Guide to enrolling for a new Aadhaar card or updating details.',
            type: 'apply',
            category: 'Government',
        });
        await createSteps(aadhaarWorkflow._id, [
            { order: 1, title: 'Locate Enrolment Center', description: 'New Aadhaar enrolment requires a physical visit.', actionChecklist: ['Visit https://appointments.uidai.gov.in/easearch.aspx', 'Find nearest center', 'Book an appointment online (optional but recommended)'] },
            { order: 2, title: 'Gather Documents', description: 'You need Proof of Identity (POI) and Proof of Address (POA).', actionChecklist: ['POI: Passport, PAN, Voter ID', 'POA: Passport, Voter ID, Ration Card', 'Proof of Birth: Birth Certificate'] },
            { order: 3, title: 'Visit Center', description: 'Go to the center with your documents.', actionChecklist: ['Fill Enrolment Form', 'Submit Biometrics (Iris, Fingerprints, Photo)', 'Collect Acknowledgement Slip'] },
            { order: 4, title: 'Track Status', description: 'It takes up to 90 days for generation.', actionChecklist: ['Visit https://myaadhaar.uidai.gov.in/CheckAadhaarStatus', 'Enter Enrolment ID from slip'] }
        ]);

        // 3. Driving License (DL)
        const dlWorkflow = await Workflow.create({
            title: 'Apply for Driving License',
            description: 'Process to get a Learner\'s License (LL) and then a Permanent DL.',
            type: 'apply',
            category: 'Government',
        });
        await createSteps(dlWorkflow._id, [
            { order: 1, title: 'Apply for Learner\'s License (LL)', description: 'Visit Parivahan Sewa portal.', actionChecklist: ['Go to https://parivahan.gov.in/', 'Select State', 'Apply for Learner License', 'Fill details & Upload documents'] },
            { order: 2, title: 'Take LL Test', description: 'Online or offline test on traffic rules.', actionChecklist: ['Watch safety tutorial', 'Take online test (if available in state)', 'Download Learner License after passing'] },
            { order: 3, title: 'Apply for Permanent DL', description: 'After 30 days of holding LL.', actionChecklist: ['Login to Parivahan again', 'Apply for Driving License', 'Book Driving Test Slot'] },
            { order: 4, title: 'Driving Test', description: 'Visit RTO for the physical test.', actionChecklist: ['Take car/bike to RTO', 'Pass the driving skill test', 'DL will be posted to your address'] }
        ]);

        // 4. Bank Account Opening
        const bankWorkflow = await Workflow.create({
            title: 'Open Savings Account',
            description: 'Open a digital zero-balance savings account online.',
            type: 'apply',
            category: 'Banking',
        });
        await createSteps(bankWorkflow._id, [
            { order: 1, title: 'Choose a Bank', description: 'Compare interest rates and minimum balance requirements.', actionChecklist: ['Research heavyweights like SBI, HDFC, ICICI', 'Look for "Digital Savings Account"'] },
            { order: 2, title: 'Start Online Application', description: 'Visit bank website or download app.', actionChecklist: ['Click "Open Account"', 'Enter Mobile Number linked to Aadhaar', 'Verify OTP'] },
            { order: 3, title: 'Video KYC', description: 'Complete KYC without visiting a branch.', actionChecklist: ['Keep PAN & Aadhaar ready', 'Ensure good lighting', 'Connect with agent via video call', 'Show original PAN card'] },
            { order: 4, title: 'Account Activation', description: 'Get account details instantly.', actionChecklist: ['Receive Account No. & IFSC', 'Set up Net Banking/Mobile App', 'Order Debit Card'] }
        ]);

        // === LEARN WORKFLOWS ===

        // 5. Banking Basics
        const bankingLearn = await Workflow.create({
            title: 'Banking Basics',
            description: 'Understand types of accounts, deposits, and safety.',
            type: 'learn',
            category: 'Personal Finance',
        });
        await createSteps(bankingLearn._id, [
            { order: 1, title: 'Savings vs Current Accounts', description: 'Savings is for personal use with interest; Current is for business with no transaction limits.', actionChecklist: ['Check interest rates', 'Understand minimum balance penalties'] },
            { order: 2, title: 'Fixed Deposits (FD)', description: 'Safe investment with higher interest than savings.', actionChecklist: ['Compare FD rates (6-8%)', 'Understand lock-in periods'] },
            { order: 3, title: 'Cheques & Demand Drafts', description: 'Traditional payment methods explained.', actionChecklist: ['How to fill a cheque', 'When to use a DD'] }
        ]);

        // 6. Income Tax
        const taxLearn = await Workflow.create({
            title: 'Income Tax Basics',
            description: 'Demystifying tax slabs, deductions, and filing.',
            type: 'learn',
            category: 'Tax',
        });
        await createSteps(taxLearn._id, [
            { order: 1, title: 'Old vs New Tax Regime', description: 'Understand the two options for calculating tax.', actionChecklist: ['New Regime: Lower rates, no deductions', 'Old Regime: Higher rates, many deductions (80C, HRA)'] },
            { order: 2, title: 'Key Deductions (Sec 80C)', description: 'Save tax by investing.', actionChecklist: ['PPF, ELSS, LIC', 'Max limit: ₹1.5 Lakhs'] },
            { order: 3, title: 'Filing ITR', description: 'When and how to file returns.', actionChecklist: ['Visit incometax.gov.in', 'Due date is usually July 31st'] }
        ]);

        // 7. Credit & Loans
        const creditLearn = await Workflow.create({
            title: 'Credit Score & Loans',
            description: 'How to build credit and borrow responsibly.',
            type: 'learn',
            category: 'Credit',
        });
        await createSteps(creditLearn._id, [
            { order: 1, title: 'What is CIBIL Score?', description: 'A 3-digit number (300-900) reflecting creditworthiness.', actionChecklist: ['750+ is excellent', 'Check for free once a year'] },
            { order: 2, title: 'Good Debt vs Bad Debt', description: 'Not all loans are bad.', actionChecklist: ['Good: Home loan, Education loan (Building assets)', 'Bad: Credit card debt, Personal loan for luxury'] },
            { order: 3, title: 'Credit Card Best Practices', description: 'Avoid debt traps.', actionChecklist: ['Pay full amount due, not minimum', 'Keep utilization under 30%'] }
        ]);

        // 8. Investments
        const investLearn = await Workflow.create({
            title: 'Investment Basics',
            description: 'Grow your money with stocks, mutual funds, and gold.',
            type: 'learn',
            category: 'Investing',
        });
        await createSteps(investLearn._id, [
            { order: 1, title: 'The Power of Compounding', description: 'Money makes money over time.', actionChecklist: ['Start early', 'Be consistent'] },
            { order: 2, title: 'Mutual Funds', description: 'Professional money management for beginners.', actionChecklist: ['SIP (Systematic Investment Plan)', 'Equity vs Debt funds'] },
            { order: 3, title: 'Stock Market', description: 'Buying shares of companies.', actionChecklist: ['Understand risk', 'Long-term vs Trading'] }
        ]);

        // 9. Budgeting
        const budgetLearn = await Workflow.create({
            title: 'Budgeting 101',
            description: 'Master your monthly cash flow.',
            type: 'learn',
            category: 'Personal Finance',
        });
        await createSteps(budgetLearn._id, [
            { order: 1, title: 'The 50-30-20 Rule', description: 'A simple budgeting framework.', actionChecklist: ['50% Needs (Rent, Food)', '30% Wants (Fun, Travel)', '20% Savings/Debt Repayment'] },
            { order: 2, title: 'Tracking Expenses', description: 'Know where your money goes.', actionChecklist: ['Use an app or spreadsheet', 'Review monthly'] },
            { order: 3, title: 'Emergency Fund', description: 'Prepare for the unexpected.', actionChecklist: ['Save 3-6 months of expenses', 'Keep in liquid fund or savings account'] }
        ]);

        console.log('Data Seeded Successfully with Expanded Content');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

async function createSteps(workflowId, stepsData) {
    for (const stepData of stepsData) {
        await Step.create({ workflowId, ...stepData });
    }
}

seedData();
