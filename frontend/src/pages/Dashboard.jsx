
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastContext';

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const addToast = useToast();

    useEffect(() => {
        api.get('/api/dashboard').then(res => {
            setData(res.data);
            setLoading(false);
        }).catch(() => {
            addToast('Failed to load dashboard', 'error');
            setLoading(false);
        });
    }, []);

    if (loading) return <div style={{ minHeight: '100vh', background: '#13111a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

    // Calculate user's groups and total saved (original logic)
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    let yourGroups = [];
    if (Array.isArray(data?.yourGroups) && data.yourGroups.length > 0) {
        yourGroups = data.yourGroups;
    } else if (Array.isArray(data?.gam3yas)) {
        yourGroups = data.gam3yas.filter(g => Array.isArray(g.members) && g.members.includes(user?._id));
    }
    const yourGroupsCount = yourGroups.length;
    const yourGroupsNames = yourGroups.map(g => g.name).join(', ');
    const totalSaved = yourGroups.reduce((sum, g) => sum + (g.monthlyAmount || 0), 0);

    return (
        <div style={{ minHeight: '100vh', background: '#13111a', color: '#fff', padding: '0', margin: 0 }}>
            <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 0 32px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 36 }}>
                    <span style={{ fontSize: 36, color: '#a78bfa', background: 'rgba(124,58,237,0.10)', borderRadius: 10, padding: 8 }}>💳</span>
                    <h1 style={{ margin: 0, fontWeight: 900, fontSize: 38, color: '#fff', letterSpacing: '-1px' }}>Dashboard</h1>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32 }}>
                    <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, boxShadow: '0 2px 12px #7c3aed11', border: '1.5px solid #232136', padding: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ fontSize: 18, color: '#c4b5fd', fontWeight: 700 }}>Total Gam3yas</div>
                        <div style={{ fontWeight: 800, fontSize: 32, color: '#a78bfa' }}>{data?.totalGam3yas ?? '--'}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, boxShadow: '0 2px 12px #7c3aed11', border: '1.5px solid #232136', padding: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ fontSize: 18, color: '#c4b5fd', fontWeight: 700 }}>Your Groups</div>
                        <div style={{ fontWeight: 800, fontSize: 32, color: '#a78bfa' }}>{yourGroupsCount}</div>
                        <div style={{ color: '#b3b3c6', fontSize: 15, marginTop: 6 }}>{yourGroupsNames || 'No groups joined yet.'}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, boxShadow: '0 2px 12px #7c3aed11', border: '1.5px solid #232136', padding: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ fontSize: 18, color: '#c4b5fd', fontWeight: 700 }}>Total Saved</div>
                        <div style={{ fontWeight: 800, fontSize: 32, color: '#a78bfa' }}>{totalSaved} <span style={{ fontSize: 20 }}>💵</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

