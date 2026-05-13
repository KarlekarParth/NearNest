const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['seeker', 'owner'],
        default: 'seeker'
    },
    phone: {
        type: String,
        default: ''
    },
    profilePic: {
        type: String,
        default: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1480&auto=format&fit=crop'
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
