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

// View all Gigs 
const viewAllGigs = async (req, res) => {
    console.log("Viewing all gigs");
    try {
        const gigs = await Gig.find(); // No filter, fetch everything
        res.status(200).json(gigs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// View all gigs by client id
const viewGigsByClient = async (req, res) => {
    console.log("Viewing gigs by client ID:", req.params.clientId);
    try {
        const clientId = req.params.clientId;
        const gigs = await Gig.find({ clientId });
        res.status(200).json(gigs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = { saveGig, viewAllGigs,viewGigsByClient }