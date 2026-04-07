import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ListingCard from '../components/ListingCard';
import SkeletonCard from '../components/SkeletonCard';
import { Heart, Frown, Loader2 } from 'lucide-react';

const WishlistPage = () => {
    const { token } = useAuth();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWishlist = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/auth/wishlist', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setListings(res.data);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchWishlist();
        }
    }, [token]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-700">
            <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-red-50 text-red-500 rounded-3xl">
                    <Heart size={32} fill="currentColor" />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-[#1e3a5f] tracking-tight">My Wishlist</h1>
                    <p className="text-gray-400 font-medium tracking-wide">Your curated collection of potential stays.</p>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : listings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {listings.map(listing => (
                        <ListingCard key={listing._id} listing={listing} />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-[50px] border border-dashed border-gray-200 p-20 text-center flex flex-col items-center gap-6">
                    <div className="p-10 bg-gray-50 rounded-full">
                        <Frown size={80} className="text-gray-200" />
                    </div>
                    <div className="max-w-sm">
                        <h3 className="text-2xl font-black text-[#1e3a5f] mb-2">No favorites yet?</h3>
                        <p className="text-gray-400 font-medium tracking-wide italic">Explore properties and tap the heart icon to save the best ones for later!</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WishlistPage;
