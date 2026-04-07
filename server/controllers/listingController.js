const Listing = require('../models/Listing');

// Known landmarks/colleges in Pune with their coordinates
const KNOWN_LOCATIONS = {
    'pict': { lat: 18.4575, lng: 73.8508, name: 'PICT Dhankawadi' },
    'pict college': { lat: 18.4575, lng: 73.8508, name: 'PICT Dhankawadi' },
    'bharati vidyapeeth': { lat: 18.4555, lng: 73.8488, name: 'Bharati Vidyapeeth' },
    'mit': { lat: 18.5164, lng: 73.8074, name: 'MIT Kothrud' },
    'mit college': { lat: 18.5164, lng: 73.8074, name: 'MIT Kothrud' },
    'coep': { lat: 18.5290, lng: 73.8503, name: 'COEP Shivajinagar' },
    'fergusson': { lat: 18.5236, lng: 73.8395, name: 'Fergusson College' },
    'fergusson college': { lat: 18.5236, lng: 73.8395, name: 'Fergusson College' },
    'symbiosis': { lat: 18.5620, lng: 73.9100, name: 'Symbiosis Viman Nagar' },
    'infosys': { lat: 18.5880, lng: 73.7350, name: 'Infosys Hinjewadi' },
    'wipro': { lat: 18.5850, lng: 73.7420, name: 'Wipro Hinjewadi' },
    'tcs': { lat: 18.5913, lng: 73.7389, name: 'TCS Hinjewadi' },
    'pune university': { lat: 18.5564, lng: 73.8236, name: 'Savitribai Phule Pune University' },
    'sppu': { lat: 18.5564, lng: 73.8236, name: 'SPPU' },
    'pune station': { lat: 18.5285, lng: 73.8743, name: 'Pune Railway Station' },
    'sinhgad': { lat: 18.4738, lng: 73.8135, name: 'Sinhgad College' },
    'sinhgad college': { lat: 18.4738, lng: 73.8135, name: 'Sinhgad College' },
    'jspm': { lat: 18.5050, lng: 73.9310, name: 'JSPM Hadapsar' },
    'magarpatta': { lat: 18.5020, lng: 73.9260, name: 'Magarpatta City' },
    'phoenix mall': { lat: 18.5679, lng: 73.9143, name: 'Phoenix Mall Viman Nagar' },
    'hinjewadi': { lat: 18.5913, lng: 73.7389, name: 'Hinjewadi IT Park' },
    'baner': { lat: 18.5590, lng: 73.7820, name: 'Baner' },
    'wakad': { lat: 18.5990, lng: 73.7630, name: 'Wakad' },
    'aundh': { lat: 18.5590, lng: 73.8070, name: 'Aundh' },
    'kothrud': { lat: 18.5074, lng: 73.8077, name: 'Kothrud' },
    'hadapsar': { lat: 18.5020, lng: 73.9260, name: 'Hadapsar' },
    'katraj': { lat: 18.4522, lng: 73.8545, name: 'Katraj' },
    'kondhwa': { lat: 18.4670, lng: 73.8910, name: 'Kondhwa' },
    'dhankawadi': { lat: 18.4575, lng: 73.8508, name: 'Dhankawadi' },
    'warje': { lat: 18.4870, lng: 73.8080, name: 'Warje' },
    'shivajinagar': { lat: 18.5310, lng: 73.8450, name: 'Shivajinagar' },
    'viman nagar': { lat: 18.5679, lng: 73.9143, name: 'Viman Nagar' },
    'nibm': { lat: 18.4670, lng: 73.8910, name: 'NIBM Road' },
    'deccan': { lat: 18.5180, lng: 73.8400, name: 'Deccan Gymkhana' },
    'fc road': { lat: 18.5240, lng: 73.8410, name: 'FC Road' },
};

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
        const { city, type, gender, minRent, maxRent, amenities, lat, lng, radius } = req.query;
        let query = {};

        // Check if city matches a known landmark for proximity search
        let searchLat = lat ? parseFloat(lat) : null;
        let searchLng = lng ? parseFloat(lng) : null;
        let searchRadius = radius ? parseFloat(radius) : 5; // default 5km

        if (city) {
            const normalizedCity = city.toLowerCase().trim();
            const knownLocation = KNOWN_LOCATIONS[normalizedCity];
            
            if (knownLocation) {
                // Use known location's coordinates for proximity search
                searchLat = knownLocation.lat;
                searchLng = knownLocation.lng;
            } else {
                // Fallback: text-based search on city and address fields
                query.$or = [
                    { city: new RegExp(city, 'i') },
                    { address: new RegExp(city, 'i') },
                    { title: new RegExp(city, 'i') }
                ];
            }
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

        let listings = await Listing.find(query).sort({ createdAt: -1 });

        // If we have coordinates, calculate distance and sort by proximity
        if (searchLat && searchLng) {
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

            // Filter by radius
            listings = listings.filter(l => l.distance <= searchRadius);

            // Sort by nearest first
            listings.sort((a, b) => a.distance - b.distance);
        }

        res.json(listings);
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
