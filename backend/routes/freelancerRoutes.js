const express = require('express');
const { saveBids,readByGigId, deleteBid } = require('../controllers/freelancerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All freelancer routes require authentication
router.post('/saveBid', protect, saveBids);
router.get('/getBidByGigId/:gigId', protect, readByGigId);
router.delete('/deleteBidById/:bidId', protect, deleteBid);

module.exports = router