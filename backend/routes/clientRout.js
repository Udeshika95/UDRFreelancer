const express = require('express');
const { saveGig, viewAllGigs, viewGigsByClient, deleteGig,editGig } = require('../controllers/clientController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All freelancer routes require authentication
router.post('/saveGig', protect, saveGig);
router.get('/viewAllGigs', protect, viewAllGigs);
router.get('/viewGigs/:clientId', protect, viewGigsByClient);
router.delete('/deleteGig/:id', protect, deleteGig);
router.put('/editGig/:id', protect, editGig);

module.exports = router