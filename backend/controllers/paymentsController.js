const Payment = require('../models/Payment');
const Notification = require('../models/Notification')

exports.markPaid = async (req, res) => {
    try {
        const { userId, gam3yaId, month, status } = req.body;
        if (!userId || !gam3yaId || !month) return res.status(400).json({ message: 'Missing fields' });

        // Authorization: only admin or the owner (userId) may mark a payment
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        if (req.user.role !== 'admin' && req.user.id !== userId) return res.status(403).json({ message: 'Forbidden' });

        let payment = await Payment.findOne({ userId, gam3yaId, month });
        if (!payment) {
            payment = new Payment({ userId, gam3yaId, month, status: status || 'paid' });
        } else {
            payment.status = status || 'paid';
        }
        await payment.save();
        // create payment success notification for user
        try {
            await Notification.create({ userId, type: 'success', message: 'You have paid successfully for this month.', meta: { gam3yaId, month } })
        } catch (e) { console.error('Failed to create notification', e) }
        res.json(payment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getPaymentsForUser = async (req, res) => {
    try {
        const { gam3yaId, userId } = req.params;
        const payments = await Payment.find({ gam3yaId, userId });
        res.json(payments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
