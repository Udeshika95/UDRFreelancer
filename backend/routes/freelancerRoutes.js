const express = require('express');
const { saveBids,readByGigId } = require('../controllers/freelancerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All freelancer routes require authentication
router.post('/saveBid', protect, saveBids);
router.get('/getBidByGigId/:gigId', protect, readByGigId);

module.exports = router