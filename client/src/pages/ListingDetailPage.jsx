import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    MapPin, Users, CheckCircle, Wifi, Coffee, Utensils, Wind, Car, 
    Phone, Mail, Loader2, ArrowLeft, MessageCircle, ShieldCheck,
    Calendar, Send, Heart, User as UserIcon, Star, Trash2,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import MapView from '../components/MapView';
import { useAuth } from '../context/AuthContext';

const ListingDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token, login } = useAuth();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    
    // Booking Form State
    const [bookingData, setBookingData] = useState({ visitDate: '', message: '' });
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    // Reviews State
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [reviewLoading, setReviewLoading] = useState(false);



    const fetchListing = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/listings/${id}`);
            setListing(response.data);
            if (user && user.wishlist) setIsWishlisted(user.wishlist.includes(id));
        } catch (error) {
            console.error('Error fetching listing:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/reviews/${id}`);
            setReviews(res.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    useEffect(() => {
        fetchListing();
        fetchReviews();
    }, [id, user]);

    const toggleWishlist = async () => {
        if (!token) return navigate('/login');
        try {
            const res = await axios.post(`http://localhost:5000/api/auth/wishlist/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const updatedUser = { ...user, wishlist: res.data.wishlist };
            login(updatedUser, token);
            setIsWishlisted(!isWishlisted);
        } catch (error) {
            console.error('Wishlist toggle failed:', error);
        }
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!token) return navigate('/login');
        setBookingLoading(true);
        try {
            await axios.post('http://localhost:5000/api/bookings', { listingId: id, ...bookingData }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookingSuccess(true);
        } catch (error) {
            console.error('Booking failed:', error);
        } finally {
            setBookingLoading(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!token) return navigate('/login');
        setReviewLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/reviews', {
                listingId: id,
                ...newReview
            }, { headers: { Authorization: `Bearer ${token}` } });
            setReviews([res.data, ...reviews]);
            setNewReview({ rating: 5, comment: '' });
        } catch (error) {
            alert(error.response?.data?.message || 'Review failed');
        } finally {
            setReviewLoading(false);
        }
    };

    const deleteReview = async (reviewId) => {
        if (!window.confirm('Delete this review?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReviews(reviews.filter(r => r._id !== reviewId));
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <Loader2 className="animate-spin text-[#3b82f6]" size={48} />
            <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">Fetching Nest Details...</p>
        </div>
    );

    if (!listing) return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
            <div className="bg-gray-100 p-8 rounded-full mb-8"><ShieldCheck size={64} className="text-gray-200" /></div>
            <h2 className="text-3xl font-black text-[#1e3a5f] mb-4 text-center">Sorry, we couldn't find <br /> that nest.</h2>
            <Link to="/search" className="flex items-center gap-2 text-[#3b82f6] font-bold hover:underline">
                <ArrowLeft size={18} /> Back to Search
            </Link>
        </div>
    );

    const amenityIcons = { 'Wi-Fi': Wifi, 'Food': Utensils, 'Laundry': Coffee, 'AC': Wind, 'Parking': Car };
    const whatsappUrl = `https://wa.me/${listing.ownerContact.replace(/\D/g, '')}?text=Hi, I found your PG "${listing.title}" on NearNest and I'm interested!`;

    const averageRating = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 'New';

    const nextImage = () => {
        if (listing && listing.photos) setCurrentImageIndex(prev => (prev + 1) % listing.photos.length);
    };

    const prevImage = () => {
        if (listing && listing.photos) setCurrentImageIndex(prev => (prev === 0 ? listing.photos.length - 1 : prev - 1));
    };

    return (
        <div className="bg-gray-50 pb-20 animate-in fade-in duration-700">
            {/* Top Nav */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 flex justify-between items-center">
                <Link to="/search" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#3b82f6] transition-colors font-bold text-xs uppercase tracking-widest group">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Search results
                </Link>
                <button 
                    onClick={toggleWishlist}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                        isWishlisted ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-white text-gray-400 border border-gray-100'
                    }`}
                >
                    <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
                    {isWishlisted ? 'Saved' : 'Save'}
                </button>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                {/* Visuals - Carousel (Top) */}
                <div className="bg-white p-2 rounded-[40px] shadow-sm border border-gray-100">
                    <div className="relative aspect-video lg:aspect-[21/9] rounded-[32px] overflow-hidden bg-gray-100">
                        <img src={listing.photos[currentImageIndex] || 'https://via.placeholder.com/1200'} alt={listing.title} className="w-full h-full object-cover transition-transform duration-500" />
                        
                        {/* Status Badges */}
                        <div className="absolute top-6 left-6 flex gap-3">
                            {listing.isVerified && (
                                <div className="bg-green-500 text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 font-black text-xs uppercase tracking-widest border-2 border-white/20">
                                    <CheckCircle size={18} /> Verified
                                </div>
                            )}
                            <div className="bg-white/90 backdrop-blur-md text-[#1e3a5f] px-5 py-2.5 rounded-full shadow-xl font-black text-xs uppercase tracking-widest">
                                {listing.type}
                            </div>
                        </div>

                        {/* Carousel Controls */}
                        {listing.photos.length > 1 && (
                            <>
                                <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#1e3a5f] p-3 rounded-full shadow-lg backdrop-blur-md transition-all active:scale-95 border-none cursor-pointer">
                                    <ChevronLeft size={24} />
                                </button>
                                <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#1e3a5f] p-3 rounded-full shadow-lg backdrop-blur-md transition-all active:scale-95 border-none cursor-pointer">
                                    <ChevronRight size={24} />
                                </button>
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/30 px-4 py-2 rounded-full backdrop-blur-md">
                                    {listing.photos.map((_, i) => (
                                        <button key={i} onClick={() => setCurrentImageIndex(i)} className={`w-2.5 h-2.5 rounded-full transition-all border-none cursor-pointer p-0 shrink-0 ${i === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Details Container (Left) */}
                    <div className="lg:col-span-7 space-y-10">
                        <div className="bg-white p-12 rounded-[40px] shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="flex gap-2 mb-8 relative z-10"><span className="px-5 py-2 rounded-full text-[10px] font-black underline uppercase tracking-widest bg-blue-50 text-blue-700">{listing.gender} PG</span></div>
                            <h1 className="text-4xl font-black text-[#1e3a5f] mb-4 leading-tight">{listing.title}</h1>
                            <p className="text-gray-400 font-bold mb-10 flex items-center gap-2"><MapPin size={20} className="text-[#3b82f6]" /> {listing.address}, {listing.city}</p>
                            <div className="flex items-end gap-3 mb-12"><span className="text-5xl lg:text-6xl font-black text-[#3b82f6] tracking-tighter">₹{listing.rent.toLocaleString()}</span><span className="text-gray-400 font-black text-lg pb-2">/ month</span></div>
                            
                            {/* Description Section */}
                            {listing.description && (
                                <div className="mb-12">
                                    <h3 className="text-sm font-black text-[#1e3a5f] mb-4 uppercase tracking-widest">About this place</h3>
                                    <p className="text-gray-600 leading-relaxed font-medium">{listing.description}</p>
                                </div>
                            )}

                            {/* Amenities Section */}
                            <div className="mb-10">
                                <h3 className="text-sm font-black text-[#1e3a5f] mb-6 uppercase tracking-widest">Amenities</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {listing.amenities.map(a => { const Icon = amenityIcons[a] || CheckCircle; return (<div key={a} className="flex items-center gap-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50 hover:bg-white transition-all"><Icon size={20} className="text-[#3b82f6]" /><span className="font-bold text-gray-700 text-xs">{a}</span></div>); })}
                                </div>
                            </div>
                            
                            <div className="p-8 bg-blue-50 rounded-3xl flex justify-between items-center"><div className="text-xs font-black text-blue-600 uppercase tracking-widest">Stay Type<p className="text-2xl font-black text-[#1e3a5f] normal-case">{listing.occupancy} Sharing</p></div><Users size={40} className="text-[#3b82f6] opacity-20" /></div>
                        </div>

                        {/* Map Section (Placed under details) */}
                        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
                            <h2 className="text-xl font-black text-[#1e3a5f] mb-8 flex items-center gap-2 text-sm uppercase tracking-widest">
                                <MapPin className="text-[#3b82f6]" size={20} /> Neighborhood Map
                            </h2>
                            {listing.location && listing.location.lat && listing.location.lng ? (
                                <MapView lat={listing.location.lat} lng={listing.location.lng} properties={[listing]} zoom={15} />
                            ) : <div className="h-[350px] bg-gray-50 rounded-3xl animate-pulse flex items-center justify-center text-gray-400 font-bold text-sm">Map Unavailable</div>}
                        </div>
                        
                        {/* REVIEWS SECTION */}
                        <div className="bg-white p-12 rounded-[50px] shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-12">
                                <div>
                                    <h2 className="text-2xl font-black text-[#1e3a5f] tracking-tight">Community Feedback</h2>
                                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Found {reviews.length} reviews</p>
                                </div>
                                <div className="flex items-center gap-2 bg-yellow-50 px-5 py-3 rounded-2xl border border-yellow-100">
                                    <Star className="text-yellow-500 fill-yellow-500" size={24} />
                                    <span className="text-2xl font-black text-[#1e3a5f]">{averageRating}</span>
                                </div>
                            </div>

                            {/* Review Form */}
                            {user && user.role === 'seeker' && !reviews.find(r => r.user?._id === user._id) && (
                                <form onSubmit={handleReviewSubmit} className="mb-16 p-8 bg-gray-50 rounded-[35px] border border-gray-100">
                                    <h3 className="text-sm font-black text-[#1e3a5f] uppercase tracking-widest mb-6">Leave a Review</h3>
                                    <div className="flex items-center gap-3 mb-6">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <button 
                                                key={s} type="button" 
                                                onClick={() => setNewReview({ ...newReview, rating: s })}
                                                className={`transition-all border-none bg-transparent cursor-pointer p-0 ${newReview.rating >= s ? 'text-yellow-500 scale-110' : 'text-gray-200 hover:text-yellow-200'}`}
                                            >
                                                <Star fill={newReview.rating >= s ? 'currentColor' : 'none'} size={32} />
                                            </button>
                                        ))}
                                    </div>
                                    <textarea 
                                        className="w-full bg-white border-none rounded-2xl p-5 text-sm font-medium focus:ring-2 focus:ring-[#3b82f6] outline-none mb-6 shadow-sm"
                                        placeholder="Share your stay experience..."
                                        rows="3" required
                                        value={newReview.comment}
                                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                    ></textarea>
                                    <button 
                                        type="submit" disabled={reviewLoading}
                                        className="px-10 py-4 border-none cursor-pointer bg-[#1e3a5f] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-900 transition-all active:scale-95 flex items-center gap-3"
                                    >
                                        {reviewLoading ? <Loader2 className="animate-spin" /> : <Send size={16} />}
                                        Post Review
                                    </button>
                                </form>
                            )}

                            <div className="space-y-10">
                                {reviews.length > 0 ? reviews.map(r => (
                                    <div key={r._id} className="border-b border-gray-100 pb-10 last:border-0 last:pb-0 relative group">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                                                <img src={r.user?.profilePic || 'https://via.placeholder.com/100'} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-[#1e3a5f] text-sm">{r.user?.name}</h4>
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={12} className={i < r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-100'} />
                                                    ))}
                                                </div>
                                            </div>
                                            {user && user._id === r.user?._id && (
                                                <button onClick={() => deleteReview(r._id)} className="ml-auto bg-transparent border-none cursor-pointer p-2 text-gray-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-gray-600 font-medium leading-relaxed italic">"{r.comment}"</p>
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-4">{new Date(r.createdAt).toLocaleDateString()}</p>
                                    </div>
                                )) : (
                                    <div className="text-center py-20 text-gray-300 italic">No reviews yet. Be the first!</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Booking/Owner info (Right) */}
                    <div className="lg:col-span-5 space-y-8">
                        {/* Schedule visit form */}
                        {(!user || user.role === 'seeker') && (
                            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
                                {bookingSuccess ? (
                                    <div className="text-center py-10 animate-in zoom-in">
                                        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={40} /></div>
                                        <h3 className="text-2xl font-black text-[#1e3a5f] mb-2">Request Sent!</h3>
                                        <p className="text-gray-400 font-medium">Owner will contact you shortly.</p>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-xl font-black text-[#1e3a5f] mb-8 flex items-center gap-2 uppercase text-xs tracking-widest"><Calendar className="text-[#3b82f6]" size={20} /> Schedule Visit</h2>
                                        <form onSubmit={handleBookingSubmit} className="space-y-6">
                                            <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visit Date</label><input type="date" required className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 outline-none" value={bookingData.visitDate} onChange={(e) => setBookingData({...bookingData, visitDate: e.target.value})} /></div>
                                            <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Message</label><textarea rows="3" className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 outline-none" placeholder="Hi, interested in a visit..." value={bookingData.message} onChange={(e) => setBookingData({...bookingData, message: e.target.value})}></textarea></div>
                                            <button type="submit" disabled={bookingLoading} className="w-full border-none cursor-pointer bg-[#1e3a5f] text-white py-5 rounded-[25px] font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 flex items-center justify-center gap-3">{bookingLoading ? <Loader2 className="animate-spin" /> : <Send size={18} />}{token ? 'Send Request' : 'Login to Book'}</button>
                                        </form>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Owner Card */}
                        <div className="bg-[#1e3a5f] p-12 rounded-[50px] shadow-2xl relative overflow-hidden group">
                            <div className="flex items-center gap-6 mb-12 relative z-10">
                                <div className="w-20 h-20 bg-white/10 rounded-2xl overflow-hidden border border-white/20 shadow-inner"><img src={listing.owner.profilePic || 'https://via.placeholder.com/80'} className="w-full h-full object-cover" alt="" /></div>
                                <div><p className="text-blue-300 text-[10px] font-black uppercase tracking-widest">Verified Host</p><h3 className="text-2xl font-black text-white">{listing.owner.name}</h3></div>
                            </div>
                            <div className="space-y-4 relative z-10">
                                <a href={`tel:${listing.ownerContact}`} className="w-full bg-[#22c55e] text-white py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#16a34a] hover:scale-[1.02] flex items-center justify-center gap-3 transition-all no-underline"><Phone size={20} /> Call Owner</a>
                                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-white/10 text-white border border-white/20 py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-[#22c55e] flex items-center justify-center gap-3 transition-all no-underline"><MessageCircle size={20} /> WhatsApp</a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ListingDetailPage;
