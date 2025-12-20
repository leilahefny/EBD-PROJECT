const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gam3yaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gam3ya', required: true },
    month: { type: String, required: true },
    status: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
