import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWorkflows } from '../services/api';

const Apply = () => {
    const [workflows, setWorkflows] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWorkflows = async () => {
            try {
                const data = await getWorkflows('apply');
                setWorkflows(data);
            } catch (error) {
                console.error('Failed to fetch workflows', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkflows();
    }, []);

    return (
        <div className="container" style={{ paddingTop: '5rem' }}>
            <button onClick={() => navigate('/')} className="btn-secondary" style={{ marginBottom: '2rem' }}>
                ← Back to Home
            </button>

            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Apply for Documents</h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Select an application type to get a step-by-step guide.</p>
            </div>

            {loading ? (
                <p>Loading available services...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {workflows.map((workflow) => (
                        <div
                            key={workflow._id}
                            className="glass-card"
                            style={{ padding: '2rem', cursor: 'pointer' }}
                            onClick={() => navigate(`/workflow/${workflow._id}`)}
                        >
                            <div style={{ width: '40px', height: '40px', background: '#EFF6FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                                {workflow.title.charAt(0)}
                            </div>
                            <h3 style={{ marginBottom: '0.5rem' }}>{workflow.title}</h3>
                            <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>{workflow.description}</p>
                            <div style={{ color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: 'bold' }}>Start Process →</div>
                        </div>
                    ))}

                    {workflows.length === 0 && (
                        <p>No application guides found. Please check backend connection.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Apply;
