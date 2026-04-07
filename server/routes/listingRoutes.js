const express = require('express');
const { 
    getListings, 
    getListingById, 
    createListing, 
    updateListing, 
    deleteListing,
    getMyListings
} = require('../controllers/listingController');
const { protect } = require('../middleware/protect');
const { upload } = require('../utils/cloudinary');
const router = express.Router();

router.route('/')
    .get(getListings)
    .post(protect, upload.array('photos', 5), createListing);

router.get('/mine', protect, getMyListings);

router.route('/:id')
    .get(getListingById)
    .put(protect, upload.array('photos', 5), updateListing)
    .delete(protect, deleteListing);

module.exports = router;
