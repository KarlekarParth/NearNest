import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, Grid, Map as MapIcon, Loader2, Frown } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import SkeletonCard from '../components/SkeletonCard';
import MapView from '../components/MapView';

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    // Dynamic Map Center - initialize from URL if available, otherwise default to Pune
    const urlLat = searchParams.get('lat');
    const urlLng = searchParams.get('lng');
    const [mapCenter, setMapCenter] = useState({ 
        lat: urlLat ? parseFloat(urlLat) : 18.5204, 
        lng: urlLng ? parseFloat(urlLng) : 73.8567 
    });
    // Filter States
    const [filters, setFilters] = useState({
        city: searchParams.get('city') || '',
        type: 'All',
        gender: 'All',
        minRent: '',
        maxRent: '',
        amenities: []
    });

    const amenitiesOptions = ['Wi-Fi', 'Food', 'Laundry', 'AC', 'Parking'];

    const fetchListings = async (isLoadMore = false) => {
        if (!isLoadMore) setLoading(true);
        else setLoadingMore(true);

        try {
            const params = new URLSearchParams();
            if (filters.city) params.append('city', filters.city);

            const lat = searchParams.get('lat');
            const lng = searchParams.get('lng');
            if (lat) params.append('lat', lat);
            if (lng) params.append('lng', lng);

            if (filters.type !== 'All') params.append('type', filters.type);
            if (filters.gender !== 'All') params.append('gender', filters.gender);
            if (filters.minRent) params.append('minRent', filters.minRent);
            if (filters.maxRent) params.append('maxRent', filters.maxRent);
            if (filters.amenities.length > 0) params.append('amenities', filters.amenities.join(','));

            const currentPage = isLoadMore ? page + 1 : 1;
            params.append('page', currentPage);
            params.append('limit', '6'); // 6 for layout mapping

            const response = await axios.get(`http://localhost:5000/api/listings?${params.toString()}`);
            const fetchedListings = response.data.listings || response.data;
            
            if (isLoadMore) {
                setListings(prev => [...prev, ...fetchedListings]);
                setPage(currentPage);
            } else {
                setListings(fetchedListings);
                setPage(1);
                if (fetchedListings.length > 0 && fetchedListings[0].location) {
                    setMapCenter(fetchedListings[0].location);
                }
            }
            
            setHasMore(response.data.hasMore || false);

        } catch (error) {
            console.error('Error fetching listings:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, [searchParams]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleAmenityToggle = (amenity) => {
        setFilters(prev => {
            const newAmenities = prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity];
            return { ...prev, amenities: newAmenities };
        });
    };

    const applyFilters = async () => {
        const newParams = {};
        if (filters.city) {
            newParams.city = filters.city;
            try {
                // Call Nominatim API for geocoding
                const nomRes = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(filters.city)}`);
                if (nomRes.data && nomRes.data.length > 0) {
                    const { lat, lon } = nomRes.data[0];
                    newParams.lat = lat;
                    newParams.lng = lon;
                    setMapCenter({ lat: parseFloat(lat), lng: parseFloat(lon) });
                }
            } catch (err) {
                console.error("Nominatim search failed", err);
            }
        }
        setSearchParams(newParams);
        fetchListings();
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-700">
            <div className="flex flex-col lg:flex-row gap-8">
                
                {/* 1. FILTER SIDEBAR */}
                <aside className="lg:w-1/4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-fit lg:sticky lg:top-24">
                    <div className="flex items-center gap-2 mb-6 text-[#1e3a5f]">
                        <Filter size={20} />
                        <h2 className="text-xl font-bold">Filters</h2>
                    </div>

                    <div className="space-y-6">
                        {/* City Filter */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-wider">City/Area</label>
                            <input 
                                type="text"
                                className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#3b82f6] outline-none"
                                placeholder="Search area..."
                                value={filters.city}
                                onChange={(e) => handleFilterChange('city', e.target.value)}
                            />
                        </div>

                        {/* Type Filter */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Property Type</label>
                            <div className="flex flex-wrap gap-2">
                                {['All', 'PG', 'Hostel'].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => handleFilterChange('type', t)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                            filters.type === t 
                                            ? 'bg-[#3b82f6] text-white shadow-md' 
                                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100 active:scale-95'
                                        }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Gender Filter */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Gender</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['All', 'Male', 'Female', 'Co-ed'].map(g => (
                                    <button
                                        key={g}
                                        onClick={() => handleFilterChange('gender', g)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                            filters.gender === g 
                                            ? 'bg-[#1e3a5f] text-white shadow-md' 
                                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100 active:scale-95'
                                        }`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Rent Filter */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Budget (₹)</label>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="number"
                                    placeholder="Min"
                                    className="w-1/2 bg-gray-50 border-none rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#3b82f6]"
                                    value={filters.minRent}
                                    onChange={(e) => handleFilterChange('minRent', e.target.value)}
                                />
                                <span className="text-gray-300">-</span>
                                <input 
                                    type="number"
                                    placeholder="Max"
                                    className="w-1/2 bg-gray-50 border-none rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#3b82f6]"
                                    value={filters.maxRent}
                                    onChange={(e) => handleFilterChange('maxRent', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Amenities Checkboxes */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Amenities</label>
                            <div className="space-y-2">
                                {amenitiesOptions.map(amenity => (
                                    <label key={amenity} className="flex items-center gap-3 group cursor-pointer">
                                        <div className="relative flex items-center">
                                            <input 
                                                type="checkbox"
                                                className="peer hidden"
                                                checked={filters.amenities.includes(amenity)}
                                                onChange={() => handleAmenityToggle(amenity)}
                                            />
                                            <div className="w-5 h-5 border-2 border-gray-200 rounded-lg group-hover:border-[#3b82f6] peer-checked:bg-[#3b82f6] peer-checked:border-[#3b82f6] transition-all"></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">{amenity}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={applyFilters}
                            className="w-full bg-[#1e3a5f] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#2c538a] transition-all shadow-lg active:scale-95 mt-4"
                        >
                            Apply Filters
                        </button>
                    </div>
                </aside>

                {/* 2. MAIN AREA */}
                <main className="lg:w-3/4">
                    {/* Header Controls */}
                    <div className="flex justify-between items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-[#1e3a5f] tracking-tight">Available Stays</h1>
                            <p className="text-gray-400 font-medium text-sm">{loading ? 'Searching...' : `${listings.length} properties found`}</p>
                        </div>
                    </div>

                    {/* Map placed above listings */}
                    <div className="mb-8">
                        <MapView lat={mapCenter.lat} lng={mapCenter.lng} properties={listings} />
                    </div>

                    {/* Results Content */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : (
                        listings.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    {listings.map(listing => (
                                        <ListingCard key={listing._id} listing={listing} />
                                    ))}
                                </div>
                                {hasMore && (
                                    <div className="flex justify-center mt-12">
                                        <button 
                                            onClick={() => fetchListings(true)}
                                            disabled={loadingMore}
                                            className="bg-white border-2 border-[#1e3a5f] text-[#1e3a5f] px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#1e3a5f] hover:text-white transition-all shadow-md active:scale-95 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loadingMore ? <Loader2 size={18} className="animate-spin" /> : <Grid size={18} />}
                                            {loadingMore ? 'Loading More...' : 'Load More Stays'}
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center gap-6 bg-white rounded-[40px] border border-dashed border-gray-200">
                                <div className="bg-gray-50 p-8 rounded-full">
                                    <Frown size={64} className="text-gray-300" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-[#1e3a5f] mb-2">No listings found</h3>
                                    <p className="text-gray-500 max-w-sm px-6">We couldn't find any stays matching your filters. Try adjusting your search criteria!</p>
                                </div>
                                <button 
                                    onClick={() => setFilters({ city: '', type: 'All', gender: 'All', minRent: '', maxRent: '', amenities: [] })}
                                    className="text-[#3b82f6] font-bold underline active:scale-95"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )
                    )}
                </main>
            </div>
        </div>
    );
};

export default SearchPage;
