import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/ToastContext'
import Notifications from './Notifications'

export default function Gam3yaDetails() {
    // All hooks must be at the top, before any return
    const [showDetails, setShowDetails] = useState(false)
    const { id } = useParams()
    const [gam3ya, setGam3ya] = useState(null)
    const [error, setError] = useState('')
    const [joining, setJoining] = useState(false)
    const [message, setMessage] = useState('')
    const navigate = useNavigate()
    const [schedule, setSchedule] = useState([])
    const addToast = useToast()
    const [tab, setTab] = useState('details')

    useEffect(() => { load() }, [id])
    useEffect(() => {
        // require login to view details — redirect to login if missing
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        if (!user || !user.id) navigate('/login')
    }, [])

    // Fetch full Gam3ya data and schedule
    const load = async () => {
        setError('')
        try {
            // Fetch main Gam3ya data
            const { data } = await api.get(`/api/gam3yas/${id}`)
            if (!data || !data.gam3ya) throw new Error('Gam3ya not found')
            // Fetch schedule (optional)
            let scheduleData = []
            try {
                const schedRes = await api.get(`/api/gam3yas/${id}/schedule`)
                scheduleData = schedRes.data.schedule || []
            } catch { }
            setGam3ya(data.gam3ya)
            setSchedule(scheduleData)
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to load')
        }
    }

    if (error) return <p style={{ color: '#f87171', textAlign: 'center', marginTop: 40 }}>{error}</p>
    if (!gam3ya) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#13111a', animation: 'fade-in 1s' }}>
            <div className="card" style={{ marginBottom: 16, padding: 32, borderRadius: 20, background: '#232136', boxShadow: '0 8px 40px 0 #7c3aed22', border: '1.5px solid #232136' }}>
                <h2 style={{ color: '#a78bfa', fontWeight: 700 }}>Gam3ya Details</h2>
                <p style={{ color: '#b3b3c6' }}>No data available for this Gam3ya.</p>
            </div>
        </div>
    )

    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const isMember = gam3ya.members && gam3ya.members.some(m => String(m._id) === String(user.id))

    const handleJoin = async () => {
        if (!user || !user.id) return setMessage('Please login to join')
        setJoining(true); setMessage('')
        try {
            await api.post(`/api/gam3yas/${gam3ya._id}/join`)
            setMessage('Joined successfully')
            addToast('Joined successfully', 'success')
            // reload data
            await load()
        } catch (err) {
            const m = err?.response?.data?.message || 'Failed to join'
            setMessage(m)
            addToast(m, 'error')
        } finally { setJoining(false) }
    }

    // Visual badge for payment status
    const statusBadge = (status, overdue) => {
        if (status === 'paid') return <span style={{ color: 'white', background: 'green', borderRadius: 8, padding: '2px 10px', fontWeight: 600 }}>Paid</span>
        if (overdue) return <span style={{ color: 'white', background: '#cc3300', borderRadius: 8, padding: '2px 10px', fontWeight: 600 }}>Overdue</span>
        return <span style={{ color: '#333', background: '#ffe066', borderRadius: 8, padding: '2px 10px', fontWeight: 600 }}>Unpaid</span>
    }

    if (!isMember) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#13111a', animation: 'fade-in 1s' }}>
                <div className="card" style={{ marginBottom: 16, padding: 32, borderRadius: 20, background: '#232136', boxShadow: '0 8px 40px 0 #7c3aed22', border: '1.5px solid #232136', textAlign: 'center' }}>
                    <h2 style={{ color: '#a78bfa', fontWeight: 700 }}>Gam3ya Details</h2>
                    <p style={{ color: '#b3b3c6' }}>You are not a member of this Gam3ya. No details available.</p>
                </div>
            </div>
        )
    }

    // Show all details for members, with a message at the top
    return (
        <div style={{ minHeight: '100vh', background: '#13111a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ maxWidth: 700, width: '100%', padding: 36, borderRadius: 28, background: '#232136', boxShadow: '0 8px 40px 0 #7c3aed22', border: '1.5px solid #232136', display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ marginBottom: 16, color: '#059669', fontWeight: 700, textAlign: 'center' }}>You are already a member of this Gam3ya.</div>
                {/* --- BEGIN: All details for members --- */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 2 }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #a78bfa 10%, #7c3aed 90%)', borderRadius: 10 }}>
                        <svg width="36" height="36" fill="none" viewBox="0 0 48 48">
                            <rect x="6" y="12" width="36" height="24" rx="6" fill="#a78bfa" fillOpacity="0.12" />
                            <rect x="10" y="16" width="28" height="16" rx="4" fill="#a78bfa" />
                            <circle cx="36" cy="24" r="2.5" fill="#fff" />
                        </svg>
                    </span>
                    <span style={{ fontSize: '2rem', fontWeight: 700, color: '#a78bfa', letterSpacing: '-0.5px' }}>{gam3ya?.name || 'Gam3ya'}</span>
                </div>
                <div style={{ fontSize: '1rem', color: '#fff', marginBottom: 2 }}>
                    <span style={{ fontWeight: 600, color: '#c4b5fd', marginRight: 4 }}>Members:</span>
                    <span style={{ color: '#b3b3c6', fontWeight: 500 }}>{Array.isArray(gam3ya?.members) ? gam3ya.members.map(m => m.username).join(', ') : 'N/A'}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px 18px', marginBottom: 2 }}>
                    <div><span style={{ fontWeight: 600, color: '#c4b5fd', marginRight: 4 }}>Start Date:</span> <span style={{ color: '#b3b3c6', fontWeight: 500 }}>{gam3ya?.createdAt ? new Date(gam3ya.createdAt).toLocaleDateString() : 'N/A'}</span></div>
                    <div><span style={{ fontWeight: 600, color: '#c4b5fd', marginRight: 4 }}>Monthly Amount:</span> <span style={{ color: '#b3b3c6', fontWeight: 500 }}>{gam3ya?.monthlyAmount !== undefined ? gam3ya.monthlyAmount : 'N/A'}</span></div>
                    <div><span style={{ fontWeight: 600, color: '#c4b5fd', marginRight: 4 }}>Max Members:</span> <span style={{ color: '#b3b3c6', fontWeight: 500 }}>{gam3ya?.maxMembers !== undefined ? gam3ya.maxMembers : 'N/A'}</span></div>
                    <div><span style={{ fontWeight: 600, color: '#c4b5fd', marginRight: 4 }}>Total Required:</span> <span style={{ color: '#b3b3c6', fontWeight: 500 }}>{gam3ya?.maxMembers !== undefined ? gam3ya.maxMembers : 'N/A'}</span></div>
                    <div><span style={{ fontWeight: 600, color: '#c4b5fd', marginRight: 4 }}>Current Count:</span> <span style={{ color: '#b3b3c6', fontWeight: 500 }}>{Array.isArray(gam3ya?.members) ? gam3ya.members.length : 'N/A'}</span></div>
                    <div><span style={{ fontWeight: 600, color: '#c4b5fd', marginRight: 4 }}>Duration:</span> <span style={{ color: '#b3b3c6', fontWeight: 500 }}>{gam3ya?.maxMembers !== undefined ? gam3ya.maxMembers : 'N/A'} months</span></div>
                    <div><span style={{ fontWeight: 600, color: '#c4b5fd', marginRight: 4 }}>Status:</span> <span style={{ color: '#b3b3c6', fontWeight: 500 }}>{
                        Array.isArray(gam3ya?.members) && gam3ya.maxMembers && gam3ya.members.length < gam3ya.maxMembers ? 'Upcoming'
                            : (Array.isArray(gam3ya?.payoutOrder) && gam3ya.payoutOrder.length === gam3ya.maxMembers ? 'Active' : 'Completed')
                    }</span></div>
                </div>
                <div style={{ fontSize: '1rem', color: '#fff', marginBottom: 2 }}>
                    <span style={{ fontWeight: 600, color: '#c4b5fd', marginRight: 4 }}>Payout Order:</span>
                    <span style={{ color: '#b3b3c6', fontWeight: 500 }}>{Array.isArray(gam3ya?.payoutOrder) ? gam3ya.payoutOrder.map((u, i) => <span key={u._id}>{i + 1}. {u.username}{i < gam3ya.payoutOrder.length - 1 ? ', ' : ''}</span>) : 'N/A'}</span>
                </div>
                <div style={{ margin: '8px 0 0 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span style={{ color: '#a78bfa', fontWeight: 600 }}>You are already a member of this Gam3ya.</span>
                </div>
                <div style={{ display: 'flex', gap: 16, margin: '18px 0 0 0' }}>
                    <button className={tab === 'details' ? 'details-tab active' : 'details-tab'} style={{ background: tab === 'details' ? 'linear-gradient(90deg, #a78bfa 60%, #7c3aed 100%)' : '#181622', color: tab === 'details' ? '#fff' : '#a78bfa', border: 'none', borderRadius: '8px 8px 0 0', padding: '10px 28px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px #8b5cf622', transition: 'background 0.2s, color 0.2s' }} onClick={() => setTab('details')}>Details</button>
                    <button className={tab === 'notifications' ? 'details-tab active' : 'details-tab'} style={{ background: tab === 'notifications' ? 'linear-gradient(90deg, #a78bfa 60%, #7c3aed 100%)' : '#181622', color: tab === 'notifications' ? '#fff' : '#a78bfa', border: 'none', borderRadius: '8px 8px 0 0', padding: '10px 28px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px #8b5cf622', transition: 'background 0.2s, color 0.2s' }} onClick={() => setTab('notifications')}>Notifications</button>
                    <button className={tab === 'history' ? 'details-tab active' : 'details-tab'} style={{ background: tab === 'history' ? 'linear-gradient(90deg, #a78bfa 60%, #7c3aed 100%)' : '#181622', color: tab === 'history' ? '#fff' : '#a78bfa', border: 'none', borderRadius: '8px 8px 0 0', padding: '10px 28px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px #8b5cf622', transition: 'background 0.2s, color 0.2s' }} onClick={() => setTab('history')}>Payment History</button>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '0 0 12px 12px', boxShadow: '0 2px 12px #8b5cf622', padding: '18px 12px 12px 12px', marginBottom: 0 }}>
                    {tab === 'details' && (
                        <div>
                            <h3 style={{ color: '#a78bfa', fontWeight: 700, marginBottom: 10 }}>Monthly Payment Tracking & Schedule</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
                                <thead><tr style={{ color: '#c4b5fd', background: '#181622' }}><th>Month</th><th>Deadline</th><th>Receiver</th><th>Status</th></tr></thead>
                                <tbody>
                                    {schedule.map(s => {
                                        const myStatus = s.myStatus || null
                                        const overdue = new Date(s.deadline) < new Date() && (!(myStatus && myStatus.status === 'paid'))
                                        return (
                                            <tr key={s.month} style={overdue ? { background: '#3f0d0d33', color: '#f87171' } : {}}>
                                                <td>{s.month}</td>
                                                <td>{s.deadline ? new Date(s.deadline).toLocaleDateString() : 'N/A'}</td>
                                                <td>{s.receiver ? `${s.receiver.username}` : 'TBD'}</td>
                                                <td>{statusBadge(myStatus ? myStatus.status : 'unpaid', overdue)}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            <div>
                                <PaymentsSection gam3yaId={gam3ya._id} onChange={load} />
                            </div>
                        </div>
                    )}
                    {tab === 'notifications' && (
                        <div>
                            <Notifications />
                        </div>
                    )}
                    {tab === 'history' && (
                        <div>
                            <PaymentsSection gam3yaId={gam3ya._id} onlyHistory={true} />
                        </div>
                    )}
                </div>
                {/* --- END: All details for members --- */}
            </div>
        </div>
    )
}

// ...existing PaymentsSection and other helper functions below...

function PaymentsSection({ gam3yaId, payments = [], onChange, onlyHistory }) {
    const [loading, setLoading] = React.useState(false)
    const [history, setHistory] = React.useState([])
    const user = JSON.parse(localStorage.getItem('user') || '{ }')
    const userId = user.id
    const addToast = useToast()

    const currentMonth = (() => {
        const d = new Date()
        const mm = String(d.getMonth() + 1).padStart(2, '0')
        return `${d.getFullYear()}-${mm}`
    })()

    const loadHistory = async () => {
        if (!userId) return setHistory([])
        try {
            const r = await api.get(`/api/payments/${gam3yaId}/${userId}`)
            setHistory(r.data || [])
        } catch (err) {
            setHistory([])
        }
    }

    React.useEffect(() => { loadHistory() }, [gam3yaId])

    const mark = async (status) => {
        if (!userId) { addToast('Not logged in', 'error'); return }
        setLoading(true)
        try {
            await api.post('/api/payments/mark-paid', { userId, gam3yaId, month: currentMonth, status })
            await loadHistory()
            if (onChange) await onChange()
        } catch (err) {
            addToast(err?.response?.data?.message || 'Failed', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            {!onlyHistory && <>
                <p>Current month: {currentMonth}</p>
                <div style={{ marginBottom: 12 }}>
                    <button className="btn accent" onClick={() => mark('paid')} disabled={loading}>Mark Paid</button>
                    <button className="btn" onClick={() => mark('unpaid')} disabled={loading} style={{ marginLeft: 8 }}>Mark Unpaid</button>
                </div>
            </>}
            <h4>Payment History</h4>
            {history.length === 0 ? <p>No payments recorded.</p> : (
                <ul>
                    {history.map(p => (
                        <li key={p._id}>{p.month} — <span style={{ color: p.status === 'paid' ? 'green' : '#cc3300', fontWeight: 600 }}>{p.status}</span></li>
                    ))}
                </ul>
            )}
        </div>
    )
}

