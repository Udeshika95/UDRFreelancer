const express = require('express');
const { saveGig, viewAllGigs, viewGigsByClient, deleteGig } = require('../controllers/clientController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All freelancer routes require authentication
router.post('/saveGig', protect, saveGig);
router.get('/viewAllGigs', protect, viewAllGigs);
router.get('/viewGigs/:id', protect, viewGigsByClient);
router.delete('/deleteGig/:id', protect, deleteGig);

module.exports = router