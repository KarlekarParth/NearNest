const express = require('express');
const { 
    addReview, 
    getListingReviews, 
    deleteReview 
} = require('../controllers/reviewController');
const { protect } = require('../middleware/protect');
const router = express.Router();

router.post('/', protect, addReview);
router.get('/:listingId', getListingReviews);
router.delete('/:id', protect, deleteReview);

module.exports = router;
