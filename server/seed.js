const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Listing = require('./models/Listing');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding...');

        // 1. Clear existing data
        await User.deleteMany();
        await Listing.deleteMany();
        console.log('Database cleared.');

        // 2. Create sample users
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        const owner1 = await User.create({
            name: 'Rahul Sharma',
            email: 'rahul@nearnest.com',
            password: hashedPassword,
            role: 'owner',
            phone: '+91 98765 43210'
        });

        const owner2 = await User.create({
            name: 'Priya Deshmukh',
            email: 'priya@nearnest.com',
            password: hashedPassword,
            role: 'owner',
            phone: '+91 87654 32109'
        });

        const owner3 = await User.create({
            name: 'Amit Kulkarni',
            email: 'amit@nearnest.com',
            password: hashedPassword,
            role: 'owner',
            phone: '+91 76543 21098'
        });

        const seeker = await User.create({
            name: 'Test Seeker',
            email: 'seeker@nearnest.com',
            password: hashedPassword,
            role: 'seeker'
        });

        console.log('Users created:');
        console.log('  Owner 1: rahul@nearnest.com / password123');
        console.log('  Owner 2: priya@nearnest.com / password123');
        console.log('  Owner 3: amit@nearnest.com / password123');
        console.log('  Seeker:  seeker@nearnest.com / password123');

        // 3. Comprehensive Pune PG/Hostel Listings
        // PICT College: 18.4575, 73.8508
        const listings = [
            // ===== DHANKAWADI / Near PICT (18.457, 73.850) =====
            {
                title: 'Royal Orchid Boys PG',
                description: 'Luxury boys PG just 200m from PICT main gate. Walking distance to college with high-speed Wi-Fi, laundry, and daily home-cooked meals. Best for engineering students seeking a quiet study environment with 24/7 power backup.',
                type: 'PG', gender: 'Male', occupancy: 'Double', rent: 8500,
                address: 'Near PICT Main Gate, Dhankawadi',
                city: 'Dhankawadi, Pune',
                location: { lat: 18.4578, lng: 73.8504 },
                amenities: ['Wi-Fi', 'Food', 'Laundry', 'AC'],
                ownerContact: '+91 99887 76655',
                photos: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1470&auto=format&fit=crop'],
                isVerified: true, owner: owner1._id
            },
            {
                title: 'Student Nest Boys Residency',
                description: 'Budget-friendly boys residency in Dhankawadi. Minimalist design but fully functional. Daily cleaning service and pure veg meals included. 5-minute walk to PICT and Bharati Vidyapeeth campus.',
                type: 'Hostel', gender: 'Male', occupancy: 'Double', rent: 6000,
                address: 'Near Bharati Vidyapeeth, Katraj-Dehu Road Bypass',
                city: 'Dhankawadi, Pune',
                location: { lat: 18.4555, lng: 73.8488 },
                amenities: ['Wi-Fi', 'Food', 'Parking'],
                ownerContact: '+91 66554 43322',
                photos: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1469&auto=format&fit=crop'],
                isVerified: true, owner: owner1._id
            },
            {
                title: 'Premium Girls PG Dhankawadi',
                description: 'Upscale girls PG with modern automation. App-controlled lighting and biometric door locks. Managed by professional staff with best-in-class security, 24/7 CCTV, and warden facility.',
                type: 'PG', gender: 'Female', occupancy: 'Double', rent: 10500,
                address: 'Dhankawadi Main Road',
                city: 'Dhankawadi, Pune',
                location: { lat: 18.4600, lng: 73.8520 },
                amenities: ['Wi-Fi', 'Food', 'AC', 'Laundry', 'Gym'],
                ownerContact: '+91 55443 32211',
                photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1470&auto=format&fit=crop'],
                isVerified: true, owner: owner2._id
            },
            {
                title: 'PICT Scholars Hostel',
                description: 'Affordable co-ed hostel exclusively for PICT students. Common study hall, printer facility, and group discussion rooms. Just across the road from the south gate of PICT college.',
                type: 'Hostel', gender: 'Co-ed', occupancy: 'Triple', rent: 5000,
                address: 'Opposite PICT South Gate, Dhankawadi',
                city: 'Dhankawadi, Pune',
                location: { lat: 18.4565, lng: 73.8515 },
                amenities: ['Wi-Fi', 'Food', 'Parking'],
                ownerContact: '+91 88990 01122',
                photos: ['https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1470&auto=format&fit=crop'],
                isVerified: true, owner: owner3._id
            },
            {
                title: 'Green Valley Boys PG',
                description: 'Spacious rooms with garden view near PICT. Each room has attached bathroom, study desk, and wardrobe. Homely atmosphere with entertainment room, indoor games, and weekend movie screenings.',
                type: 'PG', gender: 'Male', occupancy: 'Single', rent: 11000,
                address: 'Ambegaon Budruk, near PICT',
                city: 'Dhankawadi, Pune',
                location: { lat: 18.4540, lng: 73.8530 },
                amenities: ['Wi-Fi', 'Food', 'AC', 'Laundry', 'Parking'],
                ownerContact: '+91 77889 90011',
                photos: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1470&auto=format&fit=crop'],
                isVerified: true, owner: owner1._id
            },

            // ===== KATRAJ (18.452, 73.854) =====
            {
                title: 'Starlight Girls Hostel',
                description: 'Safe and secure girls hostel in Katraj. 24/7 security, CCTV surveillance, and biometric entry system. Close to markets and public transport. Clean rooms with attached bathrooms and hot water.',
                type: 'Hostel', gender: 'Female', occupancy: 'Triple', rent: 7000,
                address: 'Market Yard Road, Katraj',
                city: 'Katraj, Pune',
                location: { lat: 18.4522, lng: 73.8545 },
                amenities: ['Wi-Fi', 'Food', 'Gym', 'Parking'],
                ownerContact: '+91 88776 65544',
                photos: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1471&auto=format&fit=crop'],
                isVerified: true, owner: owner2._id
            },
            {
                title: 'Katraj Heights Co-ed PG',
                description: 'Modern co-ed PG near Katraj Chowk with excellent bus connectivity. Fully furnished rooms with desk and wardrobe. Rooftop terrace with city views and weekend barbecue events.',
                type: 'PG', gender: 'Co-ed', occupancy: 'Double', rent: 8000,
                address: 'Near Katraj Chowk',
                city: 'Katraj, Pune',
                location: { lat: 18.4495, lng: 73.8560 },
                amenities: ['Wi-Fi', 'Food', 'Laundry'],
                ownerContact: '+91 99001 12233',
                photos: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1470&auto=format&fit=crop'],
                isVerified: false, owner: owner3._id
            },

            // ===== KOTHRUD (18.507, 73.807) =====
            {
                title: 'Eco-Stay Co-ed Hostel',
                description: 'Sustainable and eco-friendly co-ed hostel on Paud Road. Solar heating and rainwater harvesting. Community living with weekly events and workshops. Walking distance to MIT and Kothrud bus stand.',
                type: 'Hostel', gender: 'Co-ed', occupancy: 'Triple', rent: 5500,
                address: 'Paud Road, Kothrud',
                city: 'Kothrud, Pune',
                location: { lat: 18.5074, lng: 73.8077 },
                amenities: ['Wi-Fi', 'Parking', 'Food'],
                ownerContact: '+91 44332 21100',
                photos: ['https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1470&auto=format&fit=crop'],
                isVerified: true, owner: owner1._id
            },
            {
                title: 'Kothrud Elite Girls PG',
                description: 'Premium girls-only PG in the heart of Kothrud near Karve Road. Air-conditioned rooms, vegetarian meals, hot water, and warden facility. Close to Deccan area and FC Road shopping.',
                type: 'PG', gender: 'Female', occupancy: 'Single', rent: 13000,
                address: 'Karve Nagar, Kothrud',
                city: 'Kothrud, Pune',
                location: { lat: 18.4980, lng: 73.8120 },
                amenities: ['Wi-Fi', 'Food', 'AC', 'Laundry', 'Gym'],
                ownerContact: '+91 88997 76611',
                photos: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1470&auto=format&fit=crop'],
                isVerified: true, owner: owner2._id
            },
            {
                title: 'Kothrud Boys Hub',
                description: 'Affordable boys PG near Kothrud depot with excellent public transport connectivity. Includes breakfast and dinner, high-speed Wi-Fi, and common TV lounge. Popular among MIT and COEP students.',
                type: 'PG', gender: 'Male', occupancy: 'Double', rent: 7500,
                address: 'Near Kothrud Depot',
                city: 'Kothrud, Pune',
                location: { lat: 18.5050, lng: 73.8040 },
                amenities: ['Wi-Fi', 'Food', 'Parking'],
                ownerContact: '+91 77665 54488',
                photos: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1470&auto=format&fit=crop'],
                isVerified: true, owner: owner3._id
            },

            // ===== HINJEWADI (18.591, 73.739) =====
            {
                title: 'Modern Living Co-ed Stay',
                description: 'Modern co-ed PG with individual study desks and spacious balconies. Located in Hinjewadi Phase 1, ideal for IT professionals at Infosys, Wipro, and TCS. Gym, games room, and high-speed fiber internet.',
                type: 'PG', gender: 'Co-ed', occupancy: 'Single', rent: 12000,
                address: 'Hinjewadi Phase 1',
                city: 'Hinjewadi, Pune',
                location: { lat: 18.5913, lng: 73.7389 },
                amenities: ['Wi-Fi', 'AC', 'Gym', 'Parking', 'Laundry'],
                ownerContact: '+91 77665 54433',
                photos: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1470&auto=format&fit=crop'],
                isVerified: true, owner: owner1._id
            },
            {
                title: 'TechNest Boys PG Hinjewadi',
                description: 'Purpose-built PG for IT professionals. Walking distance to Rajiv Gandhi Infotech Park. Fully AC rooms, 24/7 hot water, laundry service, and complimentary breakfast. Gaming zone available.',
                type: 'PG', gender: 'Male', occupancy: 'Double', rent: 9500,
                address: 'Hinjewadi Phase 2, Near Infosys',
                city: 'Hinjewadi, Pune',
                location: { lat: 18.5880, lng: 73.7350 },
                amenities: ['Wi-Fi', 'AC', 'Gym', 'Laundry', 'Food'],
                ownerContact: '+91 99008 87766',
                photos: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1469&auto=format&fit=crop'],
                isVerified: true, owner: owner2._id
            },
            {
                title: 'Hinjewadi Girls Haven',
                description: 'Safe and luxurious girls PG in Hinjewadi Phase 3. Fully air-conditioned with attached bathrooms. Female warden, doctor on call, and dedicated yoga room. Shuttle service to tech parks.',
                type: 'PG', gender: 'Female', occupancy: 'Single', rent: 14000,
                address: 'Hinjewadi Phase 3, near Wipro Circle',
                city: 'Hinjewadi, Pune',
                location: { lat: 18.5850, lng: 73.7420 },
                amenities: ['Wi-Fi', 'AC', 'Food', 'Laundry', 'Gym', 'Parking'],
                ownerContact: '+91 88007 76655',
                photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1470&auto=format&fit=crop'],
                isVerified: true, owner: owner3._id
            },

            // ===== VIMAN NAGAR (18.567, 73.914) =====
            {
                title: 'SkyView Premium PG',
                description: 'Top-floor PG with panoramic city views in Viman Nagar. Near Phoenix Mall and Pune Airport. King-size beds, work-from-home desks, and premium dinner menus. Best for corporate professionals.',
                type: 'PG', gender: 'Co-ed', occupancy: 'Single', rent: 15000,
                address: 'Near Phoenix Mall, Viman Nagar',
                city: 'Viman Nagar, Pune',
                location: { lat: 18.5679, lng: 73.9143 },
                amenities: ['Wi-Fi', 'AC', 'Food', 'Gym', 'Laundry', 'Parking'],
                ownerContact: '+91 99112 23344',
                photos: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1470&auto=format&fit=crop'],
                isVerified: true, owner: owner1._id
            },
            {
                title: 'Viman Nagar Boys Quarters',
                description: 'Affordable boys PG near Symbiosis College. Clean rooms with shared bathrooms. Tiffin service available. Gym membership included. Close to bus stops and metro station.',
                type: 'PG', gender: 'Male', occupancy: 'Triple', rent: 6500,
                address: 'Near Symbiosis College, Viman Nagar',
                city: 'Viman Nagar, Pune',
                location: { lat: 18.5620, lng: 73.9100 },
                amenities: ['Wi-Fi', 'Gym', 'Parking'],
                ownerContact: '+91 77009 98877',
                photos: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1470&auto=format&fit=crop'],
                isVerified: false, owner: owner2._id
            },

            // ===== WAKAD (18.599, 73.763) =====
            {
                title: 'Wakad Prime Boys PG',
                description: 'Spacious boys PG near Hinjewadi-Wakad bridge. Great for IT professionals who need quick access to tech parks. Includes power backup, RO water, and weekly room cleaning.',
                type: 'PG', gender: 'Male', occupancy: 'Double', rent: 8000,
                address: 'Wakad Chowk, near D-Mart',
                city: 'Wakad, Pune',
                location: { lat: 18.5990, lng: 73.7630 },
                amenities: ['Wi-Fi', 'Food', 'Parking', 'Laundry'],
                ownerContact: '+91 88112 23344',
                photos: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1470&auto=format&fit=crop'],
                isVerified: true, owner: owner3._id
            },
            {
                title: 'Wakad Blossom Girls Hostel',
                description: 'Cozy girls hostel in Wakad with garden area. Home-cooked Maharashtrian meals, attached bathrooms, and study hall. Safe locality with 24/7 watchman and women warden.',
                type: 'Hostel', gender: 'Female', occupancy: 'Double', rent: 7500,
                address: 'Dattanagar, Wakad',
                city: 'Wakad, Pune',
                location: { lat: 18.6020, lng: 73.7580 },
                amenities: ['Wi-Fi', 'Food', 'Laundry'],
                ownerContact: '+91 99223 34455',
                photos: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1471&auto=format&fit=crop'],
                isVerified: true, owner: owner1._id
            },

            // ===== BANER (18.559, 73.782) =====
            {
                title: 'Baner Luxury Co-ed PG',
                description: 'Ultra-premium co-ed PG in Baner with rooftop pool and gym. Concierge services, laundry pickup, and gourmet chef-prepared meals. Perfect for senior professionals and startup founders.',
                type: 'PG', gender: 'Co-ed', occupancy: 'Single', rent: 18000,
                address: 'Baner Road, near Starbucks',
                city: 'Baner, Pune',
                location: { lat: 18.5590, lng: 73.7820 },
                amenities: ['Wi-Fi', 'AC', 'Food', 'Gym', 'Laundry', 'Parking'],
                ownerContact: '+91 77889 90011',
                photos: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1470&auto=format&fit=crop'],
                isVerified: true, owner: owner2._id
            },
            {
                title: 'Baner Budget Boys Hostel',
                description: 'Affordable boys hostel in Baner for freshers and interns. Basic but clean rooms with common kitchen facilities. Great rooftop hangout area with bean bags and board games.',
                type: 'Hostel', gender: 'Male', occupancy: 'Triple', rent: 5500,
                address: 'Near Baner Gaon, Baner',
                city: 'Baner, Pune',
                location: { lat: 18.5560, lng: 73.7870 },
                amenities: ['Wi-Fi', 'Parking'],
                ownerContact: '+91 66778 89900',
                photos: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1469&auto=format&fit=crop'],
                isVerified: false, owner: owner3._id
            },

            // ===== HADAPSAR (18.502, 73.926) =====
            {
                title: 'Hadapsar Tech Girls PG',
                description: 'Modern girls PG near Magarpatta City. Ideal for IT women professionals. Fully furnished with queen-size beds, work desks, and high-speed internet. Shuttle to SP Infocity and EON IT Park.',
                type: 'PG', gender: 'Female', occupancy: 'Double', rent: 9000,
                address: 'Near Magarpatta City, Hadapsar',
                city: 'Hadapsar, Pune',
                location: { lat: 18.5020, lng: 73.9260 },
                amenities: ['Wi-Fi', 'AC', 'Food', 'Laundry', 'Gym'],
                ownerContact: '+91 88997 76611',
                photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1470&auto=format&fit=crop'],
                isVerified: true, owner: owner1._id
            },
            {
                title: 'Hadapsar Boys Quarters',
                description: 'Budget-friendly boys PG near Hadapsar bus stand. Clean dorm-style rooms with lockers. Morning tea and dinner included. Popular among students at JSPM and Sinhgad colleges.',
                type: 'PG', gender: 'Male', occupancy: 'Triple', rent: 5000,
                address: 'Sadesataranali, Hadapsar',
                city: 'Hadapsar, Pune',
                location: { lat: 18.5050, lng: 73.9310 },
                amenities: ['Wi-Fi', 'Food'],
                ownerContact: '+91 77665 54499',
                photos: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1470&auto=format&fit=crop'],
                isVerified: true, owner: owner2._id
            },

            // ===== SHIVAJINAGAR / DECCAN (18.528, 73.841) =====
            {
                title: 'Deccan Heritage Girls Hostel',
                description: 'Heritage-style girls hostel near Fergusson College. Walking distance to FC Road, JM Road, and Deccan Gymkhana. Quiet rooms with courtyard garden. Library access and reading room.',
                type: 'Hostel', gender: 'Female', occupancy: 'Double', rent: 9500,
                address: 'Near Fergusson College, Shivajinagar',
                city: 'Shivajinagar, Pune',
                location: { lat: 18.5280, lng: 73.8410 },
                amenities: ['Wi-Fi', 'Food', 'Laundry'],
                ownerContact: '+91 99334 45566',
                photos: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1471&auto=format&fit=crop'],
                isVerified: true, owner: owner3._id
            },
            {
                title: 'Shivajinagar Central Boys PG',
                description: 'Prime location boys PG near Pune Railway Station and Shivajinagar bus stand. Easy connectivity to all parts of the city. Full meals, laundry, and housekeeping included.',
                type: 'PG', gender: 'Male', occupancy: 'Double', rent: 8500,
                address: 'JM Road, Shivajinagar',
                city: 'Shivajinagar, Pune',
                location: { lat: 18.5310, lng: 73.8450 },
                amenities: ['Wi-Fi', 'Food', 'Laundry', 'AC'],
                ownerContact: '+91 88776 65544',
                photos: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1470&auto=format&fit=crop'],
                isVerified: true, owner: owner1._id
            },

            // ===== AUNDH (18.559, 73.807) =====
            {
                title: 'Aundh Premium Co-ed Stay',
                description: 'Luxury co-ed PG in Aundh near University of Pune and IUCAA. Rooftop café, Netflix lounge, and community kitchen. Great for research scholars and postgraduate students.',
                type: 'PG', gender: 'Co-ed', occupancy: 'Single', rent: 14000,
                address: 'DP Road, Aundh',
                city: 'Aundh, Pune',
                location: { lat: 18.5590, lng: 73.8070 },
                amenities: ['Wi-Fi', 'AC', 'Gym', 'Parking', 'Laundry', 'Food'],
                ownerContact: '+91 77009 98811',
                photos: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1470&auto=format&fit=crop'],
                isVerified: true, owner: owner2._id
            },

            // ===== KONDHWA (18.467, 73.891) =====
            {
                title: 'Kondhwa Budget Boys Hostel',
                description: 'Cheapest boys hostel in Kondhwa area. Simple rooms with proper ventilation. Home-cooked vegetarian meals twice a day. Close to NIBM Road and popular cafes. Weekly room cleaning service.',
                type: 'Hostel', gender: 'Male', occupancy: 'Triple', rent: 4500,
                address: 'Kondhwa Budruk, near NIBM',
                city: 'Kondhwa, Pune',
                location: { lat: 18.4670, lng: 73.8910 },
                amenities: ['Wi-Fi', 'Food'],
                ownerContact: '+91 66554 43388',
                photos: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1469&auto=format&fit=crop'],
                isVerified: true, owner: owner3._id
            },

            // ===== WARJE (18.487, 73.808) =====
            {
                title: 'Warje Comfort Girls PG',
                description: 'Comfortable girls PG near Warje Malwadi. Close to Sinhgad Road and IT companies. Includes breakfast and dinner, laundry, and water purifier. 24/7 female security guard on premises.',
                type: 'PG', gender: 'Female', occupancy: 'Double', rent: 7000,
                address: 'Near Warje Bridge, Sinhgad Road',
                city: 'Warje, Pune',
                location: { lat: 18.4870, lng: 73.8080 },
                amenities: ['Wi-Fi', 'Food', 'Laundry', 'Parking'],
                ownerContact: '+91 99112 23388',
                photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1470&auto=format&fit=crop'],
                isVerified: true, owner: owner1._id
            },
        ];

        await Listing.insertMany(listings);
        console.log(`${listings.length} Pune listings inserted across all major areas.`);

        mongoose.connection.close();
        console.log('Seeding complete! Database is ready.');
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
