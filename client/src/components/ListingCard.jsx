import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MapPin, Users, CheckCircle, Wifi, Coffee, Utensils, Wind, Car, Heart } from 'lucide-react';

const ListingCard = ({ listing }) => {
    const navigate = useNavigate();
    const { user, token, login } = useAuth();
    const { 
        _id, 
        title, 
        type, 
        gender, 
        rent, 
        address, 
        city, 
        amenities = [], 
        photos = [], 
        isVerified 
    } = listing;

    const [isWishlisted, setIsWishlisted] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    useEffect(() => {
        if (user && user.wishlist) {
            setIsWishlisted(user.wishlist.includes(_id));
        }
    }, [user, _id]);

    const handleCardClick = () => {
        navigate(`/listing/${_id}`);
    };

    const toggleWishlist = async (e) => {
        e.stopPropagation(); // Don't navigate to detail page
        if (!token) return navigate('/login');

        setWishlistLoading(true);
        try {
            const res = await axios.post(`http://localhost:5000/api/auth/wishlist/${_id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Update local user context with new wishlist
            const updatedUser = { ...user, wishlist: res.data.wishlist };
            login(updatedUser, token);
            setIsWishlisted(!isWishlisted);
        } catch (error) {
            console.error('Wishlist toggle failed:', error);
        } finally {
            setWishlistLoading(false);
        }
    };

    const amenityIcons = {
        'Wi-Fi': Wifi,
        'Food': Utensils,
        'Laundry': Coffee,
        'AC': Wind,
        'Parking': Car
    };

    return (
        <div 
            onClick={handleCardClick}
            className="group bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 active:scale-[0.98]"
        >
            {/* Top: Photo (16/9) */}
            <div className="relative aspect-video overflow-hidden bg-gray-200">
                {photos.length > 0 ? (
                    <img 
                        src={photos[0]} 
                        alt={title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-200">
                        <MapPin size={48} />
                    </div>
                )}
                
                {/* Badges Overlay */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {isVerified && (
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg border border-white/20">
                            <CheckCircle size={12} /> Verified
                        </div>
                    )}
                    <span className="bg-[#1e3a5f]/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                        {type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md ${
                        gender === 'Male' ? 'bg-blue-600 text-white' : 
                        gender === 'Female' ? 'bg-pink-600 text-white' : 
                        'bg-purple-600 text-white'
                    }`}>
                        {gender}
                    </span>
                </div>

                {/* Wishlist Button */}
                <button 
                    onClick={toggleWishlist}
                    disabled={wishlistLoading}
                    className="absolute top-4 right-4 p-2.5 rounded-2xl backdrop-blur-md transition-all duration-300 shadow-lg border border-white/20 group/heart bg-white/10 hover:bg-white/30"
                >
                    <Heart 
                        size={20} 
                        className={`transition-all duration-300 ${isWishlisted ? 'text-red-500 fill-red-500 scale-110' : 'text-white group-hover/heart:scale-110'}`} 
                    />
                </button>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="mb-2">
                    <h3 className="text-xl font-bold text-[#1e3a5f] group-hover:text-[#3b82f6] transition-colors line-clamp-1 leading-tight">
                        {title}
                    </h3>
                    <p className="text-gray-400 text-xs flex items-center gap-1 mt-2 font-medium">
                        <MapPin size={14} className="text-[#3b82f6] shrink-0" />
                        <span className="line-clamp-1">{address}, {city}</span>
                    </p>
                </div>

                {/* Amenity chips (max 2 shown for grid clarity) */}
                <div className="flex flex-wrap gap-2 my-5">
                    {amenities.slice(0, 2).map((amenity, index) => {
                        const Icon = amenityIcons[amenity] || CheckCircle;
                        return (
                            <span key={index} className="flex items-center gap-1.5 bg-gray-50 text-gray-500 px-3 py-1.5 rounded-xl text-[10px] font-bold border border-gray-100">
                                <Icon size={12} /> {amenity}
                            </span>
                        );
                    })}
                    {amenities.length > 2 && (
                        <span className="text-gray-400 text-[10px] font-bold self-center ml-1">
                            +{amenities.length - 2} more
                        </span>
                    )}
                </div>

                {/* Bottom */}
                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div>
                        <span className="text-2xl font-black text-[#1e3a5f]">₹{rent?.toLocaleString() || '0'}</span>
                        <span className="text-gray-400 text-[10px] font-bold ml-1 uppercase">/mo</span>
                    </div>
                    <button 
                        className="bg-blue-50 text-[#3b82f6] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest group-hover:bg-[#3b82f6] group-hover:text-white transition-all active:scale-90 shadow-sm"
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ListingCard;
