import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Phone, ShieldCheck, CheckCircle2, UserPlus } from 'lucide-react';
import ListingCard from '../components/ListingCard';

const HomePage = () => {
    const [city, setCity] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (city.trim()) {
            navigate(`/search?city=${encodeURIComponent(city)}`);
        }
    };

    // Static placeholder data for Featured Listings
    const featuredListings = [
        {
            _id: '1',
            title: 'Royal Orchid PG',
            rent: 8500,
            city: 'Viman Nagar, Pune',
            gender: 'Male',
            occupancy: 'Double',
            isVerified: true,
            photos: []
        },
        {
            _id: '2',
            title: 'Starlight Female Hostel',
            rent: 12000,
            city: 'Kothrud, Pune',
            gender: 'Female',
            occupancy: 'Single',
            isVerified: true,
            photos: []
        },
        {
            _id: '3',
            title: 'Modern Living Co-ed',
            rent: 10500,
            city: 'Hinjewadi, Pune',
            gender: 'Co-ed',
            occupancy: 'Double',
            isVerified: false,
            photos: []
        }
    ];

    return (
        <div className="flex flex-col min-h-screen font-sans">
            {/* 1. HERO SECTION */}
            <header className="bg-gradient-to-b from-blue-50 to-white pt-24 pb-20 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-black text-[#1e3a5f] mb-6 tracking-tight">
                        Find Your Perfect <span className="text-[#3b82f6]">PG in Pune</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto font-medium">
                        Verified listings. No brokers. Direct owner contact.
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 border border-blue-100">
                        <div className="flex-grow flex items-center px-4 gap-3">
                            <MapPin className="text-[#3b82f6]" size={24} />
                            <input 
                                type="text" 
                                placeholder="Enter your college or workplace area..." 
                                className="w-full py-4 text-lg outline-none text-gray-700 bg-transparent"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>
                        <button 
                            type="submit"
                            className="bg-[#3b82f6] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                        >
                            <Search size={20} /> Search
                        </button>
                    </form>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap justify-center gap-8 mt-12 opacity-80">
                        <div className="flex items-center gap-2 text-[#1e3a5f] font-semibold">
                            <CheckCircle2 size={24} className="text-[#3b82f6]" />
                            <span>500+ Listings</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#1e3a5f] font-semibold">
                            <ShieldCheck size={24} className="text-[#3b82f6]" />
                            <span>Verified Owners</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#1e3a5f] font-semibold">
                            <CheckCircle2 size={24} className="text-[#3b82f6]" />
                            <span>Zero Brokerage</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. HOW IT WORKS */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-[#1e3a5f] mb-4 tracking-tight uppercase">How NearNest Works</h2>
                        <div className="w-24 h-1.5 bg-[#3b82f6] mx-auto rounded-full"></div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            { step: 1, icon: Search, title: 'Search', desc: 'Enter your college or workplace to find nearby stay options.' },
                            { step: 2, icon: MapPin, title: 'Browse', desc: 'Browse PGs on the map with detailed amenities and photos.' },
                            { step: 3, icon: Phone, title: 'Connect', desc: 'Contact the owner directly to visit or book your spot.' }
                        ].map((item, i) => (
                            <div key={i} className="bg-gray-50 p-10 rounded-[40px] border border-gray-100 flex flex-col items-center text-center group hover:bg-blue-50 transition-all duration-300">
                                <div className="w-20 h-20 bg-white shadow-xl rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                    <item.icon size={40} className="text-[#3b82f6]" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#1e3a5f] mb-4">Step {item.step}: {item.title}</h3>
                                <p className="text-gray-500 text-lg leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. FEATURED LISTINGS */}
            <section className="py-24 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <h2 className="text-4xl font-black text-[#1e3a5f] mb-2 tracking-tight">Popular PGs Near You</h2>
                            <p className="text-gray-500 font-medium">Handpicked stays for a comfortable lifestyle.</p>
                        </div>
                        <button 
                            onClick={() => navigate('/search')}
                            className="bg-white text-[#3b82f6] border-2 border-[#3b82f6] px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-all"
                        >
                            View All PGs
                        </button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {featuredListings.map(listing => (
                            <ListingCard key={listing._id} listing={listing} />
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. FOOTER CTA */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto bg-[#1e3a5f] rounded-[50px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full -ml-32 -mb-32"></div>
                    
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight relative z-10">
                        Are you a PG owner? <br />
                        <span className="text-blue-300">List your property for free.</span>
                    </h2>
                    <p className="text-blue-100/70 text-lg mb-10 relative z-10 max-w-xl mx-auto">
                        Reach thousands of students and working professionals in Pune without any middleman.
                    </p>
                    <button 
                        onClick={() => navigate('/register')}
                        className="bg-[#3b82f6] text-white px-12 py-5 rounded-full font-black text-xl hover:bg-blue-600 transition-all shadow-xl hover:scale-105 active:scale-95 relative z-10 flex items-center gap-3 mx-auto"
                    >
                        <UserPlus size={24} /> List Your PG
                    </button>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
