const express = require('express');
const { saveBids } = require('../controllers/freelancerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All freelancer routes require authentication
router.post('/saveBid', protect, saveBids);

module.exports = router