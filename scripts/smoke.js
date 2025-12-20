; (async () => {
    const base = 'http://localhost:5001'
    const h = { 'Content-Type': 'application/json' }
    const j = async (r) => {
        try { return await r.json() } catch (e) { return { status: r.status, text: await r.text() } }
    }

    try {
        console.log('1) Registering admin...')
        let res = await fetch(base + '/api/auth/register', { method: 'POST', headers: h, body: JSON.stringify({ username: 'admin', email: 'admin@example.com', password: 'password', role: 'admin' }) })
        console.log(await j(res))

        console.log('\n2) Registering user...')
        res = await fetch(base + '/api/auth/register', { method: 'POST', headers: h, body: JSON.stringify({ username: 'alice', email: 'alice@example.com', password: 'password' }) })
        console.log(await j(res))

        console.log('\n3) Admin login...')
        res = await fetch(base + '/api/auth/login', { method: 'POST', headers: h, body: JSON.stringify({ email: 'admin@example.com', password: 'password' }) })
        const adminLogin = await j(res)
        console.log(adminLogin)
        const adminToken = adminLogin.token

        console.log('\n4) User login...')
        res = await fetch(base + '/api/auth/login', { method: 'POST', headers: h, body: JSON.stringify({ email: 'alice@example.com', password: 'password' }) })
        const userLogin = await j(res)
        console.log(userLogin)
        const userToken = userLogin.token

        console.log('\n5) Admin creates gam3ya (maxMembers=1)...')
        res = await fetch(base + '/api/gam3yas', { method: 'POST', headers: { ...h, Authorization: `Bearer ${adminToken}` }, body: JSON.stringify({ name: 'TestGam3ya1', monthlyAmount: 100, maxMembers: 1 }) })
        const gam3ya = await j(res)
        console.log(gam3ya)

        console.log('\n6) User lists gam3yas...')
        res = await fetch(base + '/api/gam3yas', { method: 'GET', headers: { ...h, Authorization: `Bearer ${userToken}` } })
        console.log(await j(res))

        console.log('\n7) User joins gam3ya...')
        res = await fetch(base + `/api/gam3yas/${gam3ya._id}/join`, { method: 'POST', headers: { ...h, Authorization: `Bearer ${userToken}` } })
        console.log(await j(res))

        console.log('\n8) Final gam3ya from server...')
        res = await fetch(base + '/api/gam3yas', { method: 'GET', headers: { ...h, Authorization: `Bearer ${adminToken}` } })
        const all = await j(res)
        console.log(all.find(g => g._id === gam3ya._id))

    } catch (e) {
        console.error('Smoke script error:', e)
    }
})()
