import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();
    const user = React.useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem('user') || '{}');
        } catch {
            return {};
        }
    }, []);
    const isSignedIn = user && user.id;
    return (
        <div style={{ minHeight: '100vh', background: '#13111a', color: '#fff', padding: 0, margin: 0 }}>
            <div style={{ maxWidth: 820, margin: '0 auto', padding: '48px 0 32px 0' }}>
                {/* Header and Headline */}
                <div style={{ marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                        <span style={{ fontWeight: 900, fontSize: 26, color: '#fff', letterSpacing: '-1px', display: 'flex', alignItems: 'center' }}>
                            <span style={{ display: 'inline-block', width: 32, height: 32, borderRadius: '8px', background: 'linear-gradient(90deg,#8b5cf6,#7c3aed)', marginRight: 10 }}></span>
                            Gam3ly
                        </span>
                    </div>
                    <h1 style={{ fontWeight: 900, fontSize: 48, margin: 0, color: '#fff', letterSpacing: '-2px', lineHeight: 1.1 }}>
                        Save together. <span style={{ color: '#a78bfa' }}>Grow together.</span>
                    </h1>
                    <div style={{ color: '#b3b3c6', fontSize: 20, margin: '18px 0 0 0', maxWidth: 600 }}>
                        Gam3ly Shokran is a trusted platform for rotating savings. Create groups, join communities, pay monthly, and receive your share in turn.
                    </div>
                </div>
                {/* Buttons */}
                <div style={{ display: 'flex', gap: 18, marginBottom: 36 }}>
                    <button className="btn accent" style={{ fontWeight: 700, fontSize: 18, background: 'linear-gradient(90deg, #a78bfa 60%, #7c3aed 100%)', color: '#fff', borderRadius: 10, border: 'none', padding: '14px 32px', minWidth: 140, display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => navigate(isSignedIn ? '/dashboard' : '/signup')}>
                        Get Started <span style={{ fontSize: 20, marginLeft: 4 }}>→</span>
                    </button>
                    <button
                        className="btn"
                        style={{ fontWeight: 700, fontSize: 18, background: '#232136', color: '#fff', borderRadius: 10, border: 'none', padding: '14px 32px', minWidth: 180, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 1px 4px #7c3aed22' }}
                        onClick={() => {
                            if (isSignedIn) {
                                navigate('/gam3yas');
                            } else {
                                alert('Please sign in to browse Gam3yas.');
                            }
                        }}
                    >
                        <span style={{ fontSize: 20, display: 'flex', alignItems: 'center' }}>👥</span> Browse Gam3yas
                    </button>
                </div>
                {/* Summary Card removed as requested */}
                {/* Quick Actions Card */}
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '28px 24px', boxShadow: '0 2px 12px #7c3aed11', border: '1.5px solid #232136' }}>
                    <div style={{ fontWeight: 700, fontSize: 20, color: '#fff', marginBottom: 18 }}>Quick Actions</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <span style={{ fontSize: 28, color: '#a78bfa', background: 'rgba(124,58,237,0.10)', borderRadius: 8, padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👥</span>
                            <div>
                                <div style={{ fontWeight: 700, color: '#c4b5fd', fontSize: 17 }}>Join a Gam3ya</div>
                                <div style={{ color: '#b3b3c6', fontSize: 15 }}>Browse available groups</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <span style={{ fontSize: 28, color: '#a78bfa', background: 'rgba(124,58,237,0.10)', borderRadius: 8, padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📦</span>
                            <div>
                                <div style={{ fontWeight: 700, color: '#c4b5fd', fontSize: 17 }}>Create a Gam3ya</div>
                                <div style={{ color: '#b3b3c6', fontSize: 15 }}>Admin access required</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
