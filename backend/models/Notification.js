const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['reminder', 'success', 'payout'], required: true },
    message: { type: String, required: true },
    meta: { type: Object },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Notification', NotificationSchema)
