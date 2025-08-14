const express = require('express');
const { saveGig} = require('../controllers/clientController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All freelancer routes require authentication
router.post('/saveGig', protect, saveGig);

module.exports = router