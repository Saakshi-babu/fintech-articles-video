import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="container" style={{ textAlign: 'center', paddingTop: '10vh' }}>
            <div style={{ marginBottom: '1rem', display: 'inline-block', padding: '0.5rem 1rem', background: '#DBEAFE', color: '#1E40AF', borderRadius: '50px', fontSize: '0.9rem', fontWeight: '600' }}>
                ✨ AI-Powered Financial Guide
            </div>

            <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: '1.1' }}>
                FinGuide AI
            </h1>

            <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                Your personal assistant for official documents and financial literacy. Simple, step-by-step guidance you can trust.
            </p>

            <button
                onClick={() => navigate('/saved')}
                className="btn-secondary"
                style={{ marginBottom: '4rem', background: '#fff' }}
            >
                ♥ My Saved Guides
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
                {/* Option 1: Apply */}
                <div
                    className="glass-card"
                    style={{ padding: '3rem', cursor: 'pointer', textAlign: 'left' }}
                    onClick={() => navigate('/apply')}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.querySelector('.icon-bg').style.background = '#EFF6FF';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.querySelector('.icon-bg').style.background = '#F8FAFC';
                    }}
                >
                    <div className="icon-bg" style={{ width: '60px', height: '60px', borderRadius: '12px', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', transition: 'background 0.3s' }}>
                        <span style={{ fontSize: '2rem' }}>📝</span>
                    </div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Apply for Services</h2>
                    <p>Guided steps for Driving License, PAN, Aadhaar, and other essential documents.</p>
                    <div style={{ marginTop: '1.5rem', color: 'var(--primary-color)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Get Started <span>→</span>
                    </div>
                </div>

                {/* Option 2: Learn */}
                <div
                    className="glass-card"
                    style={{ padding: '3rem', cursor: 'pointer', textAlign: 'left' }}
                    onClick={() => navigate('/learn')}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.querySelector('.icon-bg-2').style.background = '#ECFDF5';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.querySelector('.icon-bg-2').style.background = '#F8FAFC';
                    }}
                >
                    <div className="icon-bg-2" style={{ width: '60px', height: '60px', borderRadius: '12px', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', transition: 'background 0.3s' }}>
                        <span style={{ fontSize: '2rem' }}>🎓</span>
                    </div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Learn Finance</h2>
                    <p>Master the basics of banking, loans, taxes, and smart investments.</p>
                    <div style={{ marginTop: '1.5rem', color: 'var(--primary-color)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Start Learning <span>→</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
