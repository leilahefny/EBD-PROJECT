import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Signup() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    React.useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user && user.id) navigate('/dashboard');
    }, [navigate]);

    const submit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            await api.post('/api/auth/register', { username, email, password })
            navigate('/login')
        } catch (err) {
            setError(err?.response?.data?.message || 'Signup failed')
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: '#13111a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ maxWidth: 420, width: '100%', padding: 36, borderRadius: 22, background: '#232136', boxShadow: '0 8px 32px 0 #7c3aed22', border: '2px solid #232136', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
                    <svg width="44" height="44" fill="none" viewBox="0 0 48 48" style={{ marginBottom: 8 }}>
                        <rect x="6" y="12" width="36" height="24" rx="6" fill="#a78bfa" fillOpacity="0.10" />
                        <rect x="10" y="16" width="28" height="16" rx="4" fill="#a78bfa" />
                        <circle cx="36" cy="24" r="2.5" fill="#fff" />
                    </svg>
                    <h2 style={{ margin: 0, fontWeight: 800, fontSize: 28, color: '#fff', letterSpacing: '-0.5px' }}>Create your account</h2>
                </div>
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18, width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label htmlFor="username" style={{ fontWeight: 600, marginBottom: 2, color: '#c4b5fd' }}>Username</label>
                        <input id="username" value={username} onChange={e => setUsername(e.target.value)} className="input" style={{ padding: 12, borderRadius: 8, border: '1.5px solid #a78bfa', fontSize: 16, color: '#fff', background: '#181622' }} autoFocus />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label htmlFor="email" style={{ fontWeight: 600, marginBottom: 2, color: '#c4b5fd' }}>Email</label>
                        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" style={{ padding: 12, borderRadius: 8, border: '1.5px solid #a78bfa', fontSize: 16, color: '#fff', background: '#181622' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label htmlFor="password" style={{ fontWeight: 600, marginBottom: 2, color: '#c4b5fd' }}>Password</label>
                        <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="input" style={{ padding: 12, borderRadius: 8, border: '1.5px solid #a78bfa', fontSize: 16, color: '#fff', background: '#181622' }} />
                    </div>
                    {error && <div style={{ color: '#f87171', fontSize: 15, marginTop: 2, fontWeight: 500 }}>{error}</div>}
                    <button type="submit" className="btn accent" style={{ marginTop: 8, fontWeight: 700, fontSize: 17, background: 'linear-gradient(90deg, #a78bfa 60%, #7c3aed 100%)', color: '#fff', borderRadius: 10, boxShadow: '0 2px 8px #7c3aed22', border: 'none', padding: '12px 0' }}>Sign Up</button>
                </form>
                <div style={{ marginTop: 18, textAlign: 'center', fontSize: 15 }}>
                    <span style={{ color: '#b3b3c6' }}>Already have an account? </span>
                    <span style={{ color: '#a78bfa', cursor: 'pointer', fontWeight: 700 }} onClick={() => navigate('/login')}>Sign in</span>
                </div>
            </div>
        </div>
    )
}
