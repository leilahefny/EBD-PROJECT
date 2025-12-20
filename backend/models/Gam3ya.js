const mongoose = require('mongoose');

const Gam3yaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    monthlyAmount: { type: Number, required: true },
    maxMembers: { type: Number, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    payoutOrder: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Gam3ya', Gam3yaSchema);
