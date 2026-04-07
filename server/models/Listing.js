const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['PG', 'Hostel'],
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Co-ed'],
        required: true
    },
    rent: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    amenities: {
        type: [String],
        default: []
    },
    photos: {
        type: [String],
        default: []
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ownerContact: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    occupancy: {
        type: String,
        enum: ['Single', 'Double', 'Triple'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Listing', ListingSchema);
