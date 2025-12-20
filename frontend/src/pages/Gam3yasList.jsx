import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastContext';

const Gam3yasList = () => {
    const [gam3yas, setGam3yas] = useState([]);
    const [form, setForm] = useState({ name: '', monthlyAmount: '', maxMembers: '' });
    const [formError, setFormError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user') || '{}');
        } catch {
            return {};
        }
    });

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        try {
            const res = await api.get('/api/gam3yas');
            setGam3yas(res.data);
        } catch (err) {
            addToast('Failed to load gam3yas', 'error');
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setFormError('');
        if (!form.name || !form.monthlyAmount || !form.maxMembers) {
            setFormError('All fields required');
            return;
        }
        try {
            // Optimistically add new Gam3ya to UI
            const tempId = 'temp-' + Date.now();
            const newGam3ya = {
                _id: tempId,
                name: form.name,
                monthlyAmount: Number(form.monthlyAmount),
                maxMembers: Number(form.maxMembers),
                members: [],
            };
            setGam3yas(prev => [newGam3ya, ...prev]);
            setShowForm(false);
            setForm({ name: '', monthlyAmount: '', maxMembers: '' });
            // Call backend
            await api.post('/api/gam3yas', {
                name: form.name,
                monthlyAmount: Number(form.monthlyAmount),
                maxMembers: Number(form.maxMembers)
            });
            addToast('Gam3ya created!', 'success');
            await load(); // Replace temp with real data
        } catch (err) {
            setFormError(err?.response?.data?.message || 'Failed to create');
        }
    };

    const join = async (id) => {
        if (!user || !user.id) return navigate('/login');
        const gam3ya = gam3yas.find(g => g._id === id);
        if (!gam3ya) return;
        const alreadyMember = gam3ya.members.some(m => m._id === user.id);
        if (alreadyMember) {
            addToast('You are already in this Gam3ya', 'info');
            return;
        }
        if (gam3ya.members.length >= gam3ya.maxMembers) {
            addToast('Gam3ya is full', 'warning');
            return;
        }
        // Optimistically increment members in UI
        setGam3yas(prev => prev.map(g =>
            g._id === id && g.members.length < g.maxMembers
                ? { ...g, members: [...g.members, { _id: user.id, username: user.username }] }
                : g
        ));
        try {
            await api.post(`/api/gam3yas/${id}/join`);
            addToast('Joined successfully', 'success');
            await load();
        } catch (err) {
            addToast(err?.response?.data?.message || 'Failed to join', 'error');
            // Optionally revert optimistic update
            setGam3yas(prev => prev.map(g =>
                g._id === id
                    ? { ...g, members: g.members.filter(m => m._id !== user.id) }
                    : g
            ));
        }
    };

    // Remove duplicate state and handlers

    return (
        <div style={{ minHeight: '100vh', background: '#13111a', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
            {/* Hero Section */}
            <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 0 32px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 36, justifyContent: 'center' }}>
                    <svg width="54" height="54" fill="none" viewBox="0 0 48 48" style={{ filter: 'drop-shadow(0 2px 8px #8b5cf6aa)' }}>
                        <rect x="6" y="12" width="36" height="24" rx="6" fill="#8b5cf6" fillOpacity="0.12" />
                        <rect x="10" y="16" width="28" height="16" rx="4" fill="#8b5cf6" />
                        <circle cx="36" cy="24" r="2.5" fill="#fff" />
                    </svg>
                    <div>
                        <h1 style={{ margin: 0, fontWeight: 900, fontSize: 38, color: '#fff', letterSpacing: '-1px' }}>Explore Gam3ya Groups</h1>
                        <div style={{ color: '#b3b3c6', fontSize: 20, fontWeight: 500, marginTop: 4 }}>Join, save, and grow together. Find your next group below.</div>
                    </div>
                </div>
                {/* Call to Action */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
                    <button className="btn accent" style={{ fontWeight: 700, fontSize: 18, background: 'linear-gradient(90deg, #a78bfa 60%, #7c3aed 100%)', color: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #7c3aed22', border: 'none', padding: '14px 0', minWidth: 180 }} onClick={() => setShowForm(true)}>Create Gam3ya</button>
                </div>
                {/* Create Gam3ya Form Modal */}
                {showForm && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(36,36,64,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <form onSubmit={handleCreate} style={{ background: '#232136', borderRadius: 18, boxShadow: '0 4px 32px #7c3aed33', padding: 36, minWidth: 340, display: 'flex', flexDirection: 'column', gap: 18 }}>
                            <h2 style={{ margin: 0, fontWeight: 800, color: '#a78bfa', fontSize: 26 }}>Create Gam3ya</h2>
                            <input name="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Gam3ya Name" required style={{ fontSize: 18, padding: 10, borderRadius: 8, border: '1.5px solid #a78bfa', background: '#181622', color: '#fff' }} />
                            <input name="maxMembers" value={form.maxMembers} onChange={e => setForm({ ...form, maxMembers: e.target.value })} placeholder="Max Members" type="number" min="2" required style={{ fontSize: 18, padding: 10, borderRadius: 8, border: '1.5px solid #a78bfa', background: '#181622', color: '#fff' }} />
                            <input name="monthlyAmount" value={form.monthlyAmount} onChange={e => setForm({ ...form, monthlyAmount: e.target.value })} placeholder="Monthly Amount" type="number" min="1" required style={{ fontSize: 18, padding: 10, borderRadius: 8, border: '1.5px solid #a78bfa', background: '#181622', color: '#fff' }} />
                            {/* Optionally add start date if needed */}
                            {formError && <div style={{ color: '#f87171', fontWeight: 600 }}>{formError}</div>}
                            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                                <button type="submit" className="btn accent" style={{ fontWeight: 700, fontSize: 18, background: 'linear-gradient(90deg, #a78bfa 60%, #7c3aed 100%)', color: '#fff', borderRadius: 10, border: 'none', padding: '10px 28px' }}>Create</button>
                                <button type="button" className="btn" style={{ fontWeight: 700, fontSize: 18, background: '#232136', color: '#a78bfa', borderRadius: 10, border: 'none', padding: '10px 28px' }} onClick={() => setShowForm(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}
                {/* Gam3ya Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
                    {gam3yas.filter(g => g.members.length <= g.maxMembers).length === 0 ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#a78bfa', fontWeight: 600, fontSize: 20, padding: 40, background: '#232136', borderRadius: 16, boxShadow: '0 2px 12px #7c3aed22' }}>
                            No Gam3yas found. Be the first to create one!
                        </div>
                    ) : gam3yas.filter(g => g.members.length <= g.maxMembers).map(g => (
                        <div key={g._id} className="card" style={{ padding: 32, borderRadius: 22, background: '#232136', boxShadow: '0 4px 24px #7c3aed22', border: '1.5px solid #232136', display: 'flex', flexDirection: 'column', gap: 14, transition: 'box-shadow 0.2s', minHeight: 220 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                <svg width="32" height="32" fill="none" viewBox="0 0 40 40">
                                    <ellipse cx="20" cy="34" rx="16" ry="6" fill="#a78bfa" fillOpacity="0.18" />
                                    <ellipse cx="20" cy="28" rx="12" ry="4" fill="#a78bfa" fillOpacity="0.32" />
                                    <ellipse cx="20" cy="22" rx="8" ry="3" fill="#a78bfa" fillOpacity="0.5" />
                                </svg>
                                <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 22, margin: 0 }}>{g.name}</h3>
                            </div>
                            <div style={{ color: '#b3b3c6', fontWeight: 500, fontSize: 16 }}>Monthly: <span style={{ color: '#a78bfa', fontWeight: 700 }}>{g.monthlyAmount}</span></div>
                            <div style={{ color: '#b3b3c6', fontWeight: 500, fontSize: 16 }}>Members: <span style={{ color: '#a78bfa', fontWeight: 700 }}>{g.members.length} / {g.maxMembers}</span></div>
                            <div style={{ color: '#b3b3c6', fontWeight: 500, fontSize: 16 }}>Duration: <span style={{ color: '#a78bfa', fontWeight: 700 }}>{g.maxMembers} months</span></div>
                            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                                <button className="btn accent" style={{ fontWeight: 700, fontSize: 16, background: 'linear-gradient(90deg, #a78bfa 60%, #7c3aed 100%)', color: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #7c3aed22', border: 'none', padding: '10px 0', flex: 1 }} onClick={() => navigate(`/gam3ya/${g._id}`)}>View Details</button>
                                {(() => {
                                    const alreadyMember = g.members.some(m => m._id === user.id);
                                    const isFull = g.members.length >= g.maxMembers;
                                    let label = 'Join';
                                    let disabled = false;
                                    let btnStyle = { fontWeight: 700, fontSize: 16, background: '#181622', color: '#a78bfa', borderRadius: 8, border: 'none', padding: '10px 0', flex: 1 };
                                    if (alreadyMember) {
                                        label = 'Joined';
                                        disabled = true;
                                        btnStyle = { ...btnStyle, background: '#232136', color: '#059669', cursor: 'not-allowed' };
                                    } else if (isFull) {
                                        label = 'Full';
                                        disabled = true;
                                        btnStyle = { ...btnStyle, background: '#232136', color: '#b91c1c', cursor: 'not-allowed' };
                                    }
                                    return (
                                        <button className="btn" style={btnStyle} disabled={disabled} onClick={() => join(g._id)}>{label}</button>
                                    );
                                })()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Gam3yasList;

