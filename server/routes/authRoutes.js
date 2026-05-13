const express = require('express');
const { 
    register, 
    login, 
    updateProfile, 
    toggleWishlist, 
    getWishlist 
} = require('../controllers/authController');
const { protect } = require('../middleware/protect');
const { upload } = require('../utils/cloudinary');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Private Routes
router.put('/profile', protect, upload.single('profilePic'), updateProfile);
router.post('/wishlist/:id', protect, toggleWishlist);
router.get('/wishlist', protect, getWishlist);

module.exports = router;
