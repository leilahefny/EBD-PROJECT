const Notification = require('../models/Notification')

// GET /api/notifications - get notifications for current user (newest first)
exports.getNotificationsForUser = async (req, res) => {
    try {
        const userId = req.user && req.user.id
        if (!userId) return res.status(401).json({ message: 'Unauthorized' })

        const items = await Notification.find({ userId }).sort({ createdAt: -1 })
        res.json(items)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
}

// POST /api/notifications - create a notification (admin/system)
exports.createNotification = async (req, res) => {
    try {
        const { userId, type, message, meta } = req.body
        if (!userId || !type || !message) return res.status(400).json({ message: 'Missing fields' })

        const n = new Notification({ userId, type, message, meta })
        await n.save()
        res.status(201).json(n)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
}
