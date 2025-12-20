// Simple end-to-end tests (no test framework) for Gam3ali Shokran API
// Runs sequential checks and exits with non-zero code on failure.

const base = 'http://localhost:5001'

async function req(path, opts = {}) {
    const res = await fetch(base + path, opts)
    let body
    try { body = await res.json() } catch { body = await res.text() }
    return { status: res.status, body }
}

function assert(cond, msg) {
    if (!cond) {
        console.error('Assertion failed:', msg)
        process.exitCode = 1
        throw new Error(msg)
    }
}

(async () => {
    try {
        const t = Date.now()
        const adminEmail = `admin+${t}@example.com`
        const userEmail = `user+${t}@example.com`
        console.log('Register admin:', adminEmail)
        let r = await req('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'admin' + t, email: adminEmail, password: 'password', role: 'admin' }) })
        assert(r.status === 201 || (r.status === 400 && r.body.message === 'Email already in use'), 'admin register failed: ' + JSON.stringify(r))

        console.log('Register user:', userEmail)
        r = await req('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'user' + t, email: userEmail, password: 'password' }) })
        assert(r.status === 201 || (r.status === 400 && r.body.message === 'Email already in use'), 'user register failed: ' + JSON.stringify(r))

        console.log('Admin login')
        r = await req('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: adminEmail, password: 'password' }) })
        assert(r.status === 200 && r.body.token, 'admin login failed: ' + JSON.stringify(r))
        const adminToken = r.body.token

        console.log('User login')
        r = await req('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: userEmail, password: 'password' }) })
        assert(r.status === 200 && r.body.token, 'user login failed: ' + JSON.stringify(r))
        const userToken = r.body.token
        const userId = r.body.user.id

        console.log('Admin create gam3ya')
        r = await req('/api/gam3yas', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` }, body: JSON.stringify({ name: 'test-pool-' + t, monthlyAmount: 50, maxMembers: 1 }) })
        assert(r.status === 201 || r.status === 200, 'create gam3ya failed: ' + JSON.stringify(r))
        const gam3yaId = r.body._id

        console.log('User join gam3ya (should trigger payout order)')
        r = await req(`/api/gam3yas/${gam3yaId}/join`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` } })
        assert(r.status === 200, 'join failed: ' + JSON.stringify(r))
        assert(r.body.payoutOrder && r.body.payoutOrder.length > 0, 'payout order not generated')

        console.log('Mark payment paid for this user/month')
        const month = '2025-12'
        r = await req('/api/payments/mark-paid', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` }, body: JSON.stringify({ userId, gam3yaId, month, status: 'paid' }) })
        assert(r.status === 200, 'mark-paid failed: ' + JSON.stringify(r))

        console.log('Get payments for user')
        r = await req(`/api/payments/${gam3yaId}/${userId}`, { method: 'GET', headers: { Authorization: `Bearer ${userToken}` } })
        assert(r.status === 200 && Array.isArray(r.body), 'get payments failed: ' + JSON.stringify(r))
        const found = r.body.find(p => p.month === month && p.status === 'paid')
        assert(found, 'paid payment not found')

        console.log('All tests passed')
        process.exit(0)
    } catch (e) {
        console.error('Test run failed:', e.message || e)
        process.exit(process.exitCode || 1)
    }
})()
