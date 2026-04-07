const Booking = require('../models/Booking');
const Listing = require('../models/Listing');

// @desc    Create a new visit request
// @route   POST /api/bookings
// @access  Private (Seeker)
exports.createBooking = async (req, res) => {
    try {
        const { listingId, visitDate, message } = req.body;

        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        const booking = await Booking.create({
            listing: listingId,
            seeker: req.user._id,
            owner: listing.owner,
            visitDate,
            message
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get seeker's bookings
// @route   GET /api/bookings/my-requests
// @access  Private (Seeker)
exports.getMyRequests = async (req, res) => {
    try {
        const bookings = await Booking.find({ seeker: req.user._id })
            .populate('listing', 'title address city photos')
            .populate('owner', 'name email phone')
            .sort({ createdAt: -1 });
        
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get owner's leads
// @route   GET /api/bookings/my-leads
// @access  Private (Owner)
exports.getMyLeads = async (req, res) => {
    try {
        const bookings = await Booking.find({ owner: req.user._id })
            .populate('listing', 'title address')
            .populate('seeker', 'name email phone profilePic')
            .sort({ createdAt: -1 });
        
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private (Owner)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Only owner can update status
        if (booking.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        booking.status = status;
        await booking.save();
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
