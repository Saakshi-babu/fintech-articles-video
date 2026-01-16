import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkflowSteps, getWorkflow, generateExplanation, getRecommendedResources } from '../services/api';

const StepFlow = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // 1. All hooks must be at the top level
    const [steps, setSteps] = useState([]);
    const [workflow, setWorkflow] = useState(null); // Added context
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResources, setAiResources] = useState(null);
    const [isSaved, setIsSaved] = useState(false);

    // 2. Data Fetching Effect
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch both workflow details (for title context) and steps
                const [workflowData, stepsData] = await Promise.all([
                    getWorkflow(id),
                    getWorkflowSteps(id)
                ]);
                setWorkflow(workflowData);
                setSteps(stepsData);
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // 3. AI Resources Logic
    useEffect(() => {
        if (!steps || steps.length === 0 || !workflow) return;

        const step = steps[currentStepIndex];
        // Only fetch if no hardcoded resources exist
        if (step && (!step.resources || step.resources.length === 0)) {
            // Contextual Search: "PAN Card: Submission" instead of just "Submission"
            // FIX: Filter out generic words like "Submit" that confuse the AI with programming topics.
            const genericSteps = ["Submit", "Submission", "Next", "Introduction", "Start", "End", "Complete", "Finish"];

            let queryTopic = workflow.title;
            // Only append step title if it's NOT generic
            if (!genericSteps.some(g => step.title.toLowerCase().includes(g.toLowerCase()))) {
                queryTopic += ` ${step.title}`;
            }

            fetchAiResources(queryTopic);
        } else {
            setAiResources(null);
        }
    }, [currentStepIndex, steps, workflow]);

    // 4. Saved Status Effect
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('savedWorkflows') || '[]');
        setIsSaved(saved.some(w => w.id === id));
    }, [id]);

    const fetchAiResources = async (topic) => {
        setAiLoading(true);
        try {
            const data = await getRecommendedResources(topic);
            if (data && !data.error && data.resources) {
                setAiResources(data.resources);
            }
        } catch (error) {
            console.error("AI recommendation failed", error);
        } finally {
            setAiLoading(false);
        }
    };

    const toggleSave = () => {
        const saved = JSON.parse(localStorage.getItem('savedWorkflows') || '[]');
        if (isSaved) {
            const updated = saved.filter(w => w.id !== id);
            localStorage.setItem('savedWorkflows', JSON.stringify(updated));
            setIsSaved(false);
        } else {
            // Use accurate workflow title now!
            const title = workflow ? workflow.title : (steps[0]?.title || 'Saved Guide');
            const newSave = { id, title };
            saved.push(newSave);
            localStorage.setItem('savedWorkflows', JSON.stringify(saved));
            setIsSaved(true);
            alert("Guide saved to bookmarks!");
        }
    };

    // 5. Derived State and Logic
    // Loading/Error States
    if (loading) return <div className="container" style={{ paddingTop: '5rem' }}>Loading steps...</div>;
    if (steps.length === 0) return <div className="container" style={{ paddingTop: '5rem' }}>No steps found for this workflow.</div>;

    const currentStep = steps[currentStepIndex];
    const progress = ((currentStepIndex + 1) / steps.length) * 100;

    // Merge DB resources and AI resources
    const dbResources = currentStep.resources || [];
    const displayResources = {
        articles: dbResources.filter(r => r.type === 'article').map(r => ({ title: r.title, url: r.url })),
        videos: dbResources.filter(r => r.type === 'video').map(r => ({ title: r.title, url: r.url }))
    };

    if (aiResources) {
        if (displayResources.articles.length === 0) displayResources.articles = aiResources.articles || [];
        if (displayResources.videos.length === 0) displayResources.videos = aiResources.videos || [];
    }

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <button onClick={() => navigate(-1)} className="btn-secondary">
                    ← Exit
                </button>
                <button
                    onClick={toggleSave}
                    className="btn-secondary"
                    style={{ color: isSaved ? 'var(--primary-color)' : 'var(--text-secondary)', borderColor: isSaved ? 'var(--primary-color)' : 'var(--border-subtle)' }}
                >
                    {isSaved ? '♥ Saved' : '♡ Save Guide'}
                </button>
            </div>

            {/* Progress Bar */}
            <div style={{ background: '#E2E8F0', height: '8px', borderRadius: '4px', marginBottom: '2rem' }}>
                <div style={{ background: 'var(--primary-color)', height: '100%', borderRadius: '4px', width: `${progress}%`, transition: 'width 0.3s' }}></div>
            </div>

            <div className="glass-card" style={{ padding: '3rem' }}>
                {workflow && (
                    <div style={{ marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {workflow.title}
                    </div>
                )}
                <h5 style={{ color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Step {currentStepIndex + 1} of {steps.length}</h5>
                <h1 style={{ marginTop: '0.5rem', marginBottom: '1.5rem', fontSize: '2rem' }}>{currentStep.title}</h1>

                <div style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '2rem', whiteSpace: 'pre-line' }}>
                    {currentStep.description}
                </div>

                {currentStep.actionChecklist && currentStep.actionChecklist.length > 0 && (
                    <div style={{ background: '#F1F5F9', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #E2E8F0' }}>
                        <h3 style={{ marginTop: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>✅ Action Checklist</h3>
                        <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)' }}>
                            {currentStep.actionChecklist.map((item, idx) => (
                                <li key={idx} style={{ marginBottom: '0.5rem' }}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                    <button
                        className="btn-secondary"
                        disabled={currentStepIndex === 0}
                        onClick={() => setCurrentStepIndex(prev => prev - 1)}
                    >
                        Previous
                    </button>
                    <button
                        className="btn-primary"
                        onClick={() => {
                            if (currentStepIndex < steps.length - 1) {
                                setCurrentStepIndex(prev => prev + 1);
                            } else {
                                alert('Workflow Completed! Great job.');
                                navigate('/');
                            }
                        }}
                    >
                        {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next Step'}
                    </button>
                </div>
            </div>

            {/* Resources Section */}
            <div style={{ marginTop: '3rem' }}>
                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem' }}>
                    Recommended Resources
                    {aiLoading && <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--secondary-accent)', background: '#ECFDF5', padding: '2px 8px', borderRadius: '4px' }}>AI Fetching...</span>}
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {/* Articles */}
                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <h3 style={{ marginTop: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.5rem' }}>📄</span> Articles
                        </h3>
                        {displayResources.articles.length > 0 ? (
                            <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)' }}>
                                {displayResources.articles.map((res, idx) => (
                                    <li key={idx} style={{ marginBottom: '0.8rem' }}>
                                        <a href={res.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '500' }}>
                                            {res.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: 'var(--text-muted)' }}>No articles available.</p>
                        )}
                    </div>

                    {/* Videos */}
                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <h3 style={{ marginTop: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.5rem' }}>🎥</span> Videos
                        </h3>
                        {displayResources.videos.length > 0 ? (
                            <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)' }}>
                                {displayResources.videos.map((res, idx) => (
                                    <li key={idx} style={{ marginBottom: '0.8rem' }}>
                                        <a href={res.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '500' }}>
                                            {res.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: 'var(--text-muted)' }}>No videos available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepFlow;
