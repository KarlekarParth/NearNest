const Listing = require('../models/Listing');



// Haversine formula to calculate distance between two coordinates in km
function getDistanceKm(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radius of Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// @desc    Get all listings with filtering and proximity search
// @route   GET /api/listings
// @access  Public
exports.getListings = async (req, res) => {
    try {
        const { city, type, gender, minRent, maxRent, amenities, lat, lng, radius, page = 1, limit = 8 } = req.query;
        let query = {};

        // Proximity search logic uses lat/lng if provided
        let searchLat = lat ? parseFloat(lat) : null;
        let searchLng = lng ? parseFloat(lng) : null;
        let searchRadius = radius ? parseFloat(radius) : 10; // default 10km

        // Fallback: text-based search on city and address fields if lat/lng not provided
        if (city && (!searchLat || !searchLng)) {
            query.$or = [
                { city: new RegExp(city, 'i') },
                { address: new RegExp(city, 'i') },
                { title: new RegExp(city, 'i') }
            ];
        }

        if (type) query.type = type;
        if (gender) query.gender = gender;
        
        if (minRent || maxRent) {
            query.rent = {};
            if (minRent) query.rent.$gte = Number(minRent);
            if (maxRent) query.rent.$lte = Number(maxRent);
        }

        if (amenities && typeof amenities === 'string' && amenities.trim() !== '') {
            const amenitiesList = amenities.split(',').map(a => a.trim()).filter(a => a !== '');
            if (amenitiesList.length > 0) {
                query.amenities = { $all: amenitiesList };
            }
        }

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        // If we have coordinates, calculate distance and sort by proximity
        if (searchLat && searchLng) {
            let listings = await Listing.find(query).sort({ createdAt: -1 });

            listings = listings.map(listing => {
                const listingObj = listing.toObject();
                if (listingObj.location && listingObj.location.lat && listingObj.location.lng) {
                    listingObj.distance = getDistanceKm(
                        searchLat, searchLng,
                        listingObj.location.lat, listingObj.location.lng
                    );
                } else {
                    listingObj.distance = 9999;
                }
                return listingObj;
            });

            // Filter by radius and sort by nearest first
            listings = listings.filter(l => l.distance <= searchRadius);
            listings.sort((a, b) => a.distance - b.distance);

            // Manual Slicing for Pagination since we did in-memory sort
            const total = listings.length;
            const endIndex = pageNum * limitNum;
            const paginatedListings = listings.slice(skip, endIndex);

            return res.json({
                listings: paginatedListings,
                total,
                page: pageNum,
                hasMore: endIndex < total
            });
        } else {
            // Standard search without coordinates - Use purely MongoDB skip/limit
            const total = await Listing.countDocuments(query);
            const listings = await Listing.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum);

            return res.json({
                listings,
                total,
                page: pageNum,
                hasMore: skip + listings.length < total
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
exports.getListingById = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id)
            .populate('owner', 'name email');
        
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        res.json(listing);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private (Owner Only)
exports.createListing = async (req, res) => {
    try {
        if (req.user.role !== 'owner') {
             return res.status(403).json({ message: 'Only owners can create listings' });
        }
        let photos = [];
        if (req.files && req.files.length > 0) {
            photos = req.files.map(file => file.path);
        } else if (req.body.photos) {
            // Fallback for manual URLs if provided as string or array
            photos = typeof req.body.photos === 'string' ? JSON.parse(req.body.photos) : req.body.photos;
        }

        const listingData = { ...req.body, photos, owner: req.user._id };
        
        // Parse location if sent as string (common with multipart/form-data)
        if (typeof listingData.location === 'string') {
            listingData.location = JSON.parse(listingData.location);
        }
        // Parse amenities if sent as string
        if (typeof listingData.amenities === 'string') {
            listingData.amenities = JSON.parse(listingData.amenities);
        }

        const listing = await Listing.create(listingData);
        res.status(201).json(listing);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error: error.message });
    }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private
exports.updateListing = async (req, res) => {
    try {
        let listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // Handle file uploads
        let updateData = { ...req.body };
        
        if (req.files && req.files.length > 0) {
            const newPhotos = req.files.map(file => file.path);
            // Append or replace? Usually replace for simplicity in MVP, or handle removal logic
            updateData.photos = newPhotos;
        }

        // Parse JSON strings if necessary
        if (updateData.location && typeof updateData.location === 'string') {
            updateData.location = JSON.parse(updateData.location);
        }
        if (updateData.amenities && typeof updateData.amenities === 'string') {
            updateData.amenities = JSON.parse(updateData.amenities);
        }

        listing = await Listing.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        res.json(listing);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private
exports.deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // Check ownership
        if (listing.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized to delete this listing' });
        }

        await listing.deleteOne();
        res.json({ message: 'Listing removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get listings for the logged-in owner
// @route   GET /api/listings/mine
// @access  Private
exports.getMyListings = async (req, res) => {
    try {
        const listings = await Listing.find({ owner: req.user._id }).sort({ createdAt: -1 });
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
