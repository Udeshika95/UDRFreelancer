const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
  gigName: { type: String, required: true },
  gigDescription: { type: String, required: true },
  minGigBudget: { type: String, required: true },
  maxGigBudget: { type: String, required: true },
  skills: [{ type: String, required: true }],
  rating: { type: Number, default: 0 },
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',  
    required: true 
  }
});

module.exports = mongoose.model('Gig', gigSchema);