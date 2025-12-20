import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }

    return (
        <aside style={{ height: '100vh', width: 220, background: 'linear-gradient(135deg, #f5f7fa 0%, #e0e7ef 100%)', boxShadow: '2px 0 16px #e0e7ef22', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0', position: 'fixed', left: 0, top: 0, zIndex: 100 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
                <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(90deg,#8b5cf6,#7c3aed)', display: 'inline-block', marginBottom: 8 }}></span>
                <span style={{ fontWeight: 900, fontSize: 26, color: '#23263b', letterSpacing: '-1px', textAlign: 'center' }}>Gam3ly Shokran</span>
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 18, width: '100%' }}>
                <Link to="/">
                    <button className="btn accent" style={{ width: '90%', fontWeight: 800, fontSize: 18, background: 'linear-gradient(90deg, #7c3aed 60%, #8b5cf6 100%)', color: '#fff', borderRadius: 10, boxShadow: '0 1px 4px #7c3aed22', border: 'none', padding: '12px 0', margin: '0 auto' }}>Home</button>
                </Link>
                {user && user.id ? (
                    <>
                        <Link to="/dashboard">
                            <button className="btn accent" style={{ width: '90%', fontWeight: 800, fontSize: 18, background: 'linear-gradient(90deg, #7c3aed 60%, #8b5cf6 100%)', color: '#fff', borderRadius: 10, boxShadow: '0 1px 4px #7c3aed22', border: 'none', padding: '12px 0', margin: '0 auto' }}>Dashboard</button>
                        </Link>
                        <Link to="/gam3yas">
                            <button className="btn accent" style={{ width: '90%', fontWeight: 800, fontSize: 18, background: 'linear-gradient(90deg, #7c3aed 60%, #8b5cf6 100%)', color: '#fff', borderRadius: 10, boxShadow: '0 1px 4px #7c3aed22', border: 'none', padding: '12px 0', margin: '0 auto' }}>Gam3yas</button>
                        </Link>
                        <Link to="/notifications">
                            <button className="btn accent" style={{ width: '90%', fontWeight: 800, fontSize: 18, background: 'linear-gradient(90deg, #7c3aed 60%, #8b5cf6 100%)', color: '#fff', borderRadius: 10, boxShadow: '0 1px 4px #7c3aed22', border: 'none', padding: '12px 0', margin: '0 auto' }}>Notifications</button>
                        </Link>
                        {user.role === 'admin' && (
                            <Link to="/admin">
                                <button className="btn accent" style={{ width: '90%', fontWeight: 800, fontSize: 18, background: 'linear-gradient(90deg, #7c3aed 60%, #8b5cf6 100%)', color: '#fff', borderRadius: 10, boxShadow: '0 1px 4px #7c3aed22', border: 'none', padding: '12px 0', margin: '0 auto' }}>Create Gam3ya</button>
                            </Link>
                        )}
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            <button className="btn accent" style={{ width: '90%', fontWeight: 800, fontSize: 18, background: 'linear-gradient(90deg, #7c3aed 60%, #8b5cf6 100%)', color: '#fff', borderRadius: 10, boxShadow: '0 1px 4px #7c3aed22', border: 'none', padding: '12px 0', margin: '0 auto' }}>Login</button>
                        </Link>
                        <Link to="/signup">
                            <button className="btn accent" style={{ width: '90%', fontWeight: 800, fontSize: 18, background: 'linear-gradient(90deg, #7c3aed 60%, #8b5cf6 100%)', color: '#fff', borderRadius: 10, boxShadow: '0 1px 4px #7c3aed22', border: 'none', padding: '12px 0', margin: '0 auto' }}>Signup</button>
                        </Link>
                    </>
                )}
            </nav>
            <div style={{ marginTop: 'auto', marginBottom: 24, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {user && user.id ? (
                    <>
                        <div className="muted" style={{ fontWeight: 600, color: '#6b7280', marginBottom: 8 }}>{user.username}</div>
                        <button className="btn" style={{ fontWeight: 700, background: '#e0e7ef', color: '#7c3aed', borderRadius: 8, padding: '10px 0', border: 'none', width: '90%' }} onClick={logout}>Logout</button>
                    </>
                ) : null}
            </div>
        </aside>
    )
}
