import React, { useState, useEffect } from 'react';

export default function Notifications() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Sample notification alerts
    const sampleAlerts = [
        {
            _id: 'sample1',
            type: 'info',
            title: '🎉 Congrats! It’s your turn to receive money',
            body: 'You are the payout recipient this month. Please check your account for details.',
            createdAt: new Date().toISOString(),
        },
        {
            _id: 'sample2',
            type: 'warning',
            title: '⏰ Reminder: Tomorrow is the payment deadline',
            body: 'Please make sure to pay your monthly Gam3ya installment before the deadline.',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        },
        {
            _id: 'sample3',
            type: 'success',
            title: '✅ Thank you! You have paid in your turn',
            body: 'Your payment was received successfully. Thank you for staying on track!',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        },
    ];

    const load = async () => {
        setLoading(true); setError('')
        try {
            const { data } = await api.get('/api/notifications')
            setItems(data)
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to load notifications')
        } finally { setLoading(false) }
    }

    useEffect(() => { load() }, [])

    return (
        <div style={{ minHeight: '100vh', background: '#13111a', color: '#fff', padding: '40px 0' }}>
            <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 36 }}>
                    <h1 style={{ margin: 0, fontWeight: 900, fontSize: 32, color: '#fff', letterSpacing: '-1px' }}>Notifications</h1>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {/* Show sample alerts first */}
                    {sampleAlerts.map(n => (
                        <div key={n._id} style={{ background: '#232136', borderRadius: 14, boxShadow: '0 2px 8px #7c3aed22', padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
                            <span style={{ fontSize: 22, color: '#a78bfa' }}>{n.type === 'success' ? '✅' : n.type === 'warning' ? '⏰' : '🎉'}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, color: '#c4b5fd', fontSize: 18 }}>{n.title.replace(/^\W+/, '')}</div>
                                <div style={{ color: '#b3b3c6', fontSize: 15 }}>{n.body}</div>
                                <div style={{ color: '#a1a1aa', fontSize: 13, marginTop: 2 }}>{new Date(n.createdAt).toLocaleString()}</div>
                            </div>
                        </div>
                    ))}
                    {loading && <p>Loading...</p>}
                    {/* Error message removed as requested */}
                    {(sampleAlerts.length === 0 && items.length === 0) ? (
                        <div style={{ textAlign: 'center', color: '#a78bfa', fontWeight: 600, fontSize: 20, padding: 40, background: '#232136', borderRadius: 16, boxShadow: '0 2px 12px #7c3aed22' }}>
                            No notifications yet.
                        </div>
                    ) : items.map(n => (
                        <div key={n._id} style={{ background: '#232136', borderRadius: 14, boxShadow: '0 2px 8px #7c3aed22', padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
                            <span style={{ fontSize: 22, color: '#a78bfa' }}>{n.type === 'payment' ? '💵' : '🔔'}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, color: '#c4b5fd', fontSize: 18 }}>{n.title}</div>
                                <div style={{ color: '#b3b3c6', fontSize: 15 }}>{n.body}</div>
                                <div style={{ color: '#a1a1aa', fontSize: 13, marginTop: 2 }}>{new Date(n.createdAt).toLocaleString()}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
