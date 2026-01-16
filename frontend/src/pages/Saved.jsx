import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Saved = () => {
    const navigate = useNavigate();
    const [savedWorkflows, setSavedWorkflows] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('savedWorkflows') || '[]');
        setSavedWorkflows(saved);
    }, []);

    const removeWorkflow = (id) => {
        const updated = savedWorkflows.filter(w => w.id !== id);
        setSavedWorkflows(updated);
        localStorage.setItem('savedWorkflows', JSON.stringify(updated));
    };

    return (
        <div className="container" style={{ paddingTop: '5rem' }}>
            <button onClick={() => navigate('/')} className="btn-secondary" style={{ marginBottom: '2rem' }}>
                ← Back to Home
            </button>

            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>My Saved Guides</h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Quick access to your important workflows.</p>
            </div>

            {savedWorkflows.length === 0 ? (
                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <p>You haven't saved any guides yet.</p>
                    <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>Browse Guides</button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {savedWorkflows.map((workflow) => (
                        <div
                            key={workflow.id}
                            className="glass-card"
                            style={{ padding: '2rem', cursor: 'pointer', position: 'relative' }}
                            onClick={() => navigate(`/workflow/${workflow.id}`)}
                        >
                            <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 2 }}>
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeWorkflow(workflow.id); }}
                                    style={{ background: '#FEE2E2', color: '#EF4444', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    ✕
                                </button>
                            </div>
                            <h3 style={{ marginBottom: '0.5rem' }}>{workflow.title}</h3>
                            <div style={{ color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: 'bold' }}>Continue →</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Saved;
