// Simulate full frontend flows via API: register admin + users, create gam3ya, users join, mark payments
const base = 'http://localhost:5001'

async function req(path, opts = {}) {
    const res = await fetch(base + path, opts)
    let body
    // clone response to safely read body multiple ways
    const clone = res.clone()
    try { body = await res.json() } catch (e) { try { body = await clone.text() } catch (err) { body = null } }
    return { status: res.status, body }
}

function expectOk(res, path) {
    if (!res || res.status >= 300) {
        console.error('[HTTP ERROR] ', path, 'status=', res && res.status, 'body=', res && res.body)
        throw new Error('Request failed: ' + path)
    }
    return res.body
}

(async () => {
    try {
        const t = Date.now()
        const admin = { username: 'admin' + t, email: `admin+${t}@example.com`, password: 'password', role: 'admin' }
        const users = [1, 2, 3].map(n => ({ username: `user${n}${t}`, email: `user${n}+${t}@example.com`, password: 'password' }))

        console.log('Register admin')
        let res = await req('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(admin) })
        expectOk(res, '/api/auth/register (admin)')
        console.log('Register users')
        for (const u of users) { res = await req('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(u) }); expectOk(res, '/api/auth/register (user)') }

        console.log('Login admin')
        let r = await req('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: admin.email, password: admin.password }) })
        expectOk(r, '/api/auth/login (admin)')
        const adminToken = r.body.token

        console.log('Login users')
        const userTokens = []
        for (const u of users) { r = await req('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: u.email, password: u.password }) }); expectOk(r, '/api/auth/login (user)'); userTokens.push(r.body.token) }

        console.log('Admin creates gam3ya (maxMembers=3)')
        r = await req('/api/gam3yas', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` }, body: JSON.stringify({ name: 'Sim Pool ' + t, monthlyAmount: 100, maxMembers: 3 }) })
        expectOk(r, '/api/gam3yas (create)')
        const gam3ya = r.body
        console.log('Gam3ya created', gam3ya._id)

        console.log('Users join')
        for (const token of userTokens) { res = await req(`/api/gam3yas/${gam3ya._id}/join`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }); expectOk(res, `/api/gam3yas/${gam3ya._id}/join`) }

        console.log('Fetch gam3ya details (via list)')
        r = await req('/api/gam3yas', { method: 'GET', headers: { Authorization: `Bearer ${adminToken}` } })
        expectOk(r, '/api/gam3yas (list)')
        const list = r.body
        const found = Array.isArray(list) ? list.find(x => x._id === gam3ya._id) : null
        if (!found) { console.error('Created gam3ya not found in list', list); throw new Error('Gam3ya missing') }
        console.log('Payout order length:', (found.payoutOrder || []).length)

        console.log('Mark payments for user1')
        // get user id
        const user1 = found.members && found.members[0]
        if (!user1) { console.error('No members in gam3ya response:', r.body); throw new Error('No members after join') }
        await req('/api/payments/mark-paid', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userTokens[0]}` }, body: JSON.stringify({ userId: user1._id, gam3yaId: gam3ya._id, month: '2025-12', status: 'paid' }) })
        r = await req(`/api/payments/${gam3ya._id}/${user1._id}`, { method: 'GET', headers: { Authorization: `Bearer ${userTokens[0]}` } })
        console.log('Payments for user1:', r.body)

        console.log('Simulation complete — all core flows exercised')
    } catch (e) { console.error('Simulation error', e) }
})()
