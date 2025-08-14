
const express = require('express');
const { registerUser, loginUser, updateUserProfile, getProfile,getUserById } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/profile/:id', protect, getUserById);
module.exports = router;
