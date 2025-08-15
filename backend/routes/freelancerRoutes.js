const express = require('express');
const { saveBids, readByGigId, deleteBid, editBid, getFreelancers } = require('../controllers/freelancerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All freelancer routes require authentication
router.post('/saveBid', protect, saveBids);
router.get('/getBidByGigId/:gigId', protect, readByGigId);
router.delete('/deleteBidById/:bidId', protect, deleteBid);
router.put('/updateBidById/:bidId', protect, editBid);
router.get('/getFreelancers', protect, getFreelancers);

module.exports = router