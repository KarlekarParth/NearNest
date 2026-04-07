const express = require('express');
const { 
    createBooking, 
    getMyRequests, 
    getMyLeads, 
    updateBookingStatus 
} = require('../controllers/bookingController');
const { protect } = require('../middleware/protect');
const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my-requests', protect, getMyRequests);
router.get('/my-leads', protect, getMyLeads);
router.put('/:id', protect, updateBookingStatus);

module.exports = router;
