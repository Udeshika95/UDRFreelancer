const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gigId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
    minBid: { type: Number, required: true },
    maxBid: { type: Number, required: true },
    description: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Bid', bidSchema);