const Bid = require('../models/Bid');

// Save Bid
const saveBids = async (req, res) => {
    try {
        console.log("Saving bid...");
        const bid = new Bid(req.body);
        await bid.save();
        res.status(201).json(bid);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { saveBids }