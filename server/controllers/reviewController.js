const Review = require('../models/Review');
const Listing = require('../models/Listing');

// @desc    Add a review to a listing
// @route   POST /api/reviews
// @access  Private (Seeker)
exports.addReview = async (req, res) => {
    try {
        const { listingId, rating, comment } = req.body;

        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // Check if user already reviewed
        const alreadyReviewed = await Review.findOne({
            listing: listingId,
            user: req.user._id
        });

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Property already reviewed' });
        }

        const review = await Review.create({
            listing: listingId,
            user: req.user._id,
            rating: Number(rating),
            comment
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get reviews for a listing
// @route   GET /api/reviews/:listingId
// @access  Public
exports.getListingReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ listing: req.params.listingId })
            .populate('user', 'name profilePic')
            .sort({ createdAt: -1 });
        
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Only the user who wrote it can delete it
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await review.deleteOne();
        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
