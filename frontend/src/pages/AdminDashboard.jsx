import React, { useState, useEffect } from 'react'
import api from '../api/axios'

export default function AdminDashboard() {
    const [name, setName] = useState('')
    const [monthlyAmount, setMonthlyAmount] = useState('')
    const [maxMembers, setMaxMembers] = useState('')
    const [message, setMessage] = useState('')
    const [creating, setCreating] = useState(false)

    const create = async (e) => {
        e.preventDefault()
        setMessage('')
        setCreating(true)
        try {
            const payload = { name, monthlyAmount: Number(monthlyAmount), maxMembers: Number(maxMembers) }
            const { data } = await api.post('/api/gam3yas', payload)
            setMessage(`Created ${data.name}`)
            setName(''); setMonthlyAmount(''); setMaxMembers('')
        } catch (err) {
            setMessage(err?.response?.data?.message || 'Create failed')
        }
        setCreating(false)
    }

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <form onSubmit={create} className="card">
                <div style={{ display: 'grid', gap: 8 }}>
                    <label>Name</label>
                    <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Family Savings" />
                    <label>Monthly Amount</label>
                    <input className="input" value={monthlyAmount} onChange={e => setMonthlyAmount(e.target.value)} placeholder="e.g., 100" />
                    <label>Max Members</label>
                    <input className="input" value={maxMembers} onChange={e => setMaxMembers(e.target.value)} placeholder="e.g., 6" />
                    <div>
                        <button type="submit" className="btn" disabled={creating}>{creating ? 'Creating...' : 'Create Gam3ya'}</button>
                    </div>
                </div>
            </form>
            {message && <p style={{ marginTop: 12 }}>{message}</p>}
        </div>
    )
}

