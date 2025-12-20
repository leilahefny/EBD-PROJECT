import React from 'react'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Gam3yasList from './pages/Gam3yasList'
import Gam3yaDetails from './pages/Gam3yaDetails'
import AdminDashboard from './pages/AdminDashboard'
import Notifications from './pages/Notifications'
import Header from './components/Header'
import { ToastProvider } from './components/ToastContext'

export default function App() {
    return (
        <ErrorBoundary>
            <ToastProvider>
                <Header />
                <main className="container">
                    <div className="card">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/notifications" element={<Notifications />} />
                            <Route path="/gam3yas" element={<Gam3yasList />} />
                            <Route path="/gam3yas/:id" element={<Gam3yaDetails />} />
                            <Route path="/gam3ya/:id" element={<Gam3yaDetails />} />
                            <Route path="/admin" element={<AdminDashboard />} />
                        </Routes>
                    </div>
                </main>
            </ToastProvider>
        </ErrorBoundary>
    )
}
