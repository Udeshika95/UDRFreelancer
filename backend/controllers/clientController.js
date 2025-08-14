const Gig = require('../models/Gig');

// save Gig
const saveGig = async (req, res) => {
    try {
        console.log("Saving gig...");
        const gig = new Gig(req.body);
        await gig.save();
        res.status(201).json(gig);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { saveGig }