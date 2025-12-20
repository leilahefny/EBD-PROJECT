const Gam3ya = require('../models/Gam3ya');
const User = require('../models/User');
const Notification = require('../models/Notification')

exports.createGam3ya = async (req, res) => {
    try {
        const { name, monthlyAmount, maxMembers } = req.body;
        const g = new Gam3ya({ name, monthlyAmount, maxMembers, members: [], payoutOrder: [] });
        await g.save();
        return res.status(201).json(g);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.listGam3yas = async (req, res) => {
    try {
        // populate both members and payoutOrder with basic user info
        const list = await Gam3ya.find()
            .populate('members', 'username email')
            .populate('payoutOrder', 'username email');
        res.json(list);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getGam3ya = async (req, res) => {
    try {
        const gam3ya = await Gam3ya.findById(req.params.id)
            .populate('members', 'username email')
            .populate('payoutOrder', 'username email');
        if (!gam3ya) return res.status(404).json({ message: 'Not found' });
        // Include caller id so frontend can decide UI (e.g., hide Join if already member)
        const userId = req.user && req.user.id
        res.json({ gam3ya, userId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.joinGam3ya = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        // Use atomic $addToSet to avoid duplicates at DB level
        const updated = await Gam3ya.findByIdAndUpdate(id, { $addToSet: { members: userId } }, { new: true });
        if (!updated) return res.status(404).json({ message: 'Not found' });

        // Re-fetch full populated document
        let gam3ya = await Gam3ya.findById(id).populate('members', 'username email').populate('payoutOrder', 'username email');

        // Ensure we don't exceed maxMembers
        if (gam3ya.members.length > gam3ya.maxMembers) return res.status(400).json({ message: 'Gam3ya is full' });

        // If reached maxMembers and payoutOrder missing, generate order based on join order
        if (gam3ya.members.length === gam3ya.maxMembers && (!gam3ya.payoutOrder || gam3ya.payoutOrder.length === 0)) {
            // Use join order: members array order is join order
            gam3ya.payoutOrder = gam3ya.members.map(m => m._id.toString());
            await gam3ya.save();
            await gam3ya.populate('payoutOrder', 'username email');
            // Create payout notifications for each member about their upcoming payout month
            try {
                const start = new Date(gam3ya.createdAt || Date.now());
                for (let idx = 0; idx < gam3ya.payoutOrder.length; idx++) {
                    const uid = gam3ya.payoutOrder[idx]._id || gam3ya.payoutOrder[idx];
                    const m = new Date(start.getFullYear(), start.getMonth() + 1 + idx, 1);
                    const monthStr = `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}`;
                    await Notification.create({ userId: uid, type: 'payout', message: 'Congratulations! This is your turn to collect the Gam3ya money. You do NOT need to pay this month.', meta: { gam3yaId: gam3ya._id, month: monthStr } });
                }
            } catch (e) { console.error('Failed to create payout notifications', e); }
        }

        // Always return the latest populated gam3ya (with payoutOrder)
        gam3ya = await Gam3ya.findById(id).populate('members', 'username email').populate('payoutOrder', 'username email');
        res.json(gam3ya);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.generatePayoutOrder = async (req, res) => {
    try {
        const gam3ya = await Gam3ya.findById(req.params.id);
        if (!gam3ya) return res.status(404).json({ message: 'Not found' });
        if (gam3ya.payoutOrder && gam3ya.payoutOrder.length > 0) return res.status(400).json({ message: 'Payout order already generated' });
        // Use join order
        gam3ya.payoutOrder = gam3ya.members.map(m => m._id.toString());
        await gam3ya.save();
        await gam3ya.populate('payoutOrder', 'username email')

        // Create payout notifications for each member about their upcoming payout month
        try {
            const start = new Date(gam3ya.createdAt || Date.now())
            for (let idx = 0; idx < gam3ya.payoutOrder.length; idx++) {
                const uid = gam3ya.payoutOrder[idx]._id || gam3ya.payoutOrder[idx]
                const m = new Date(start.getFullYear(), start.getMonth() + 1 + idx, 1)
                const monthStr = `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}`
                await Notification.create({ userId: uid, type: 'payout', message: 'Congratulations! This is your turn to collect the Gam3ya money. You do NOT need to pay this month.', meta: { gam3yaId: gam3ya._id, month: monthStr } })
            }
        } catch (e) { console.error('Failed to create payout notifications', e) }
        res.json(gam3ya);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET /api/gam3yas/dashboard - return aggregated dashboard data for current user
exports.dashboard = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        // Find gam3yas where user is a member
        const gam3yas = await Gam3ya.find({ members: userId })
            .populate('members', 'username email')
            .populate('payoutOrder', 'username email');

        const totalJoined = gam3yas.length;
        // Active = gam3ya that has started (members length === maxMembers) and payout not completed
        const active = gam3yas.filter(g => g.members.length >= 1 && g.members.length === g.maxMembers).length;

        // Upcoming unpaid payments for this user (simple calculation based on createdAt schedule)
        const upcoming = [];
        const now = new Date();

        for (const g of gam3yas) {
            const start = new Date(g.createdAt || Date.now());
            for (let i = 0; i < g.maxMembers; i++) {
                const m = new Date(start.getFullYear(), start.getMonth() + 1 + i, 1);
                const deadline = new Date(m.getFullYear(), m.getMonth() + 1, 0);
                // If deadline is in the future or within 7 days, include as upcoming
                if (deadline >= now && (deadline - now) <= (1000 * 60 * 60 * 24 * 90)) {
                    upcoming.push({ gam3yaId: g._id, gam3yaName: g.name, month: `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}`, deadline: deadline.toISOString().slice(0, 10) })
                }
            }
        }

        // Next payout date: if user is in payoutOrder, find the month index
        let nextPayout = null;
        for (const g of gam3yas) {
            if (g.payoutOrder && g.payoutOrder.length > 0) {
                const idx = g.payoutOrder.findIndex(u => String(u._id) === String(userId));
                if (idx >= 0) {
                    const start = new Date(g.createdAt || Date.now());
                    const m = new Date(start.getFullYear(), start.getMonth() + 1 + idx, 1);
                    nextPayout = { gam3yaId: g._id, gam3yaName: g.name, month: `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}`, date: new Date(m.getFullYear(), m.getMonth() + 1, 0).toISOString().slice(0, 10) };
                    break;
                }
            }
        }

        res.json({ totalJoined, active, upcoming, nextPayout });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

// GET /api/gam3yas/:id/schedule
exports.schedule = async (req, res) => {
    try {
        const gam3ya = await Gam3ya.findById(req.params.id)
            .populate('members', 'username email')
            .populate('payoutOrder', 'username email');
        if (!gam3ya) return res.status(404).json({ message: 'Not found' });

        // Fetch all payments for this gam3ya once
        const Payment = require('../models/Payment');
        const payments = await Payment.find({ gam3yaId: gam3ya._id });
        const paymentsMap = new Map();
        for (const p of payments) {
            paymentsMap.set(`${p.userId}_${p.month}`, p.status);
        }

        const start = new Date(gam3ya.createdAt || Date.now());
        const schedule = [];
        for (let i = 0; i < gam3ya.maxMembers; i++) {
            const m = new Date(start.getFullYear(), start.getMonth() + 1 + i, 1);
            // deadline: 5th of month
            const deadline = new Date(m.getFullYear(), m.getMonth(), 5);
            const month = `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}`;
            const receiver = (gam3ya.payoutOrder && gam3ya.payoutOrder[i]) ? gam3ya.payoutOrder[i] : null;

            // build statuses
            const statuses = gam3ya.members.map(member => {
                const key = `${member._id}_${month}`;
                const status = paymentsMap.get(key) || 'unpaid';
                return { userId: member._id, username: member.username, status };
            });

            schedule.push({ month, deadline: deadline.toISOString().slice(0, 10), amount: gam3ya.monthlyAmount, receiver, statuses });
        }

        // Privacy: creator sees all, others see only their own
        const userId = req.user && req.user.id;
        let safeSchedule = schedule;
        if (String(gam3ya.members[0]._id) !== String(userId)) {
            // Only show current user's status per month
            safeSchedule = schedule.map(s => ({
                month: s.month,
                deadline: s.deadline,
                amount: s.amount,
                receiver: s.receiver,
                myStatus: s.statuses.find(st => String(st.userId) === String(userId)) || { userId: userId, username: 'You', status: 'unpaid' }
            }));
        }
        res.json({ gam3ya, schedule: safeSchedule });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}
