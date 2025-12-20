import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5001',
    headers: { 'Content-Type': 'application/json' }
})

// attach token from localStorage if present (used in Milestone 3)
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

export default api
