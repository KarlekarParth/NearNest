const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Route Imports
const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// =======================
// ✅ CORS CONFIG (IMPORTANT)
// =======================
const allowedOrigins = [
    'https://nearnest-mu.vercel.app',
    process.env.FRONTEND_URL // Vercel URL
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// =======================
// ✅ MIDDLEWARE
// =======================
app.use(express.json());

// =======================
// ✅ ROUTES
// =======================
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check route (IMPORTANT for deployment)
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'NearNest API is running 🚀'
    });
});

// =======================
// ✅ GLOBAL ERROR HANDLER
// =======================
app.use((err, req, res, next) => {
    console.error(err.stack);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// =======================
// ✅ DATABASE CONNECTION
// =======================
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('❌ MONGO_URI is missing in environment variables');
    process.exit(1); // stop server if no DB
}

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1); // stop deployment if DB fails
    });