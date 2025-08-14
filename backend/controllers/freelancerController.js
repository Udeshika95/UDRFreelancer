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

// Read bids by gigId
const readByGigId = async (req, res) => {
    try {

        // Directly find bids with the provided gigId
        console.log("BID:gigId" + req.params.gigId)
        const bids = await Bid.find({ gigId: req.params.gigId }); // No populate
        console.log("BID:" + bids)
        res.status(200).json(bids);
    } catch (error) {
        console.error('Error fetching bids:', error);
        res.status(500).json({ message: error.message });
    }
};

const deleteBid = async (req, res) => {
    try {
        const bid = await Bid.findByIdAndDelete(req.params.bidId);
        if (!bid) return res.status(404).json({ message: 'Bid not found' });
        res.status(200).json({ message: 'Bid deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { saveBids, readByGigId, deleteBid }