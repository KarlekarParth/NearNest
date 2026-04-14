import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
    Calendar, MapPin, Clock, CheckCircle, XCircle, 
    Loader2, ArrowRight, MessageSquare, ShieldCheck, Frown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const MyRequestsPage = () => {
    const { token } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/bookings/my-requests`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(res.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchRequests();
    }, [token]);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-50 text-green-600 border-green-100';
            case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-orange-50 text-orange-600 border-orange-100';
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-16 animate-in fade-in duration-700">
            <div className="flex items-center gap-5 mb-12">
                <div className="p-5 bg-[#1e3a5f] text-white rounded-[25px] shadow-2xl">
                    <Calendar size={32} />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-[#1e3a5f] tracking-tighter">Visit Schedule</h1>
                    <p className="text-gray-400 font-bold italic tracking-wide">Track and manage your upcoming property viewings.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-20 gap-4">
                    <Loader2 className="animate-spin text-[#3b82f6]" size={48} />
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-300">Syncing Schedule...</p>
                </div>
            ) : requests.length > 0 ? (
                <div className="grid gap-8">
                    {requests.map(req => (
                        <div key={req._id} className="bg-white rounded-[45px] shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row group hover:shadow-2xl transition-all duration-500">
                            {/* Listing Preview */}
                            <div className="md:w-72 h-48 md:h-auto relative overflow-hidden shrink-0">
                                <img 
                                    src={req.listing.photos[0] || 'https://via.placeholder.com/400'} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                    alt="" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex items-end">
                                    <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 backdrop-blur-md shadow-2xl ${getStatusStyles(req.status)} text-white`}>
                                        {req.status}
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-8 flex-grow flex flex-col justify-between gap-6">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div>
                                        <h3 className="text-2xl font-black text-[#1e3a5f] mb-2 tracking-tight group-hover:text-[#3b82f6] transition-colors">{req.listing.title}</h3>
                                        <p className="text-gray-400 font-bold text-sm flex items-center gap-2">
                                            <MapPin size={16} className="text-[#3b82f6]" /> {req.listing.address}, {req.listing.city}
                                        </p>
                                    </div>
                                    <div className="text-left md:text-right">
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Scheduled Date</p>
                                        <p className="text-xl font-black text-[#1e3a5f]">{new Date(req.visitDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 items-center border-t border-gray-50 pt-6">
                                    <div className="flex items-center gap-3 bg-gray-50 px-5 py-2.5 rounded-2xl border border-gray-100">
                                        <div className="w-8 h-8 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center font-black text-xs shadow-inner">
                                            {req.owner.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Host</p>
                                            <p className="text-xs font-bold text-[#1e3a5f]">{req.owner.name}</p>
                                        </div>
                                    </div>
                                    
                                    {req.message && (
                                        <div className="flex items-center gap-3 bg-blue-50/50 px-5 py-2.5 rounded-2xl border border-blue-100/50 flex-grow max-w-md">
                                            <MessageSquare size={16} className="text-[#3b82f6] opacity-30 shrink-0" />
                                            <p className="text-xs italic font-medium text-gray-600 line-clamp-1">"{req.message}"</p>
                                        </div>
                                    )}

                                    <Link 
                                        to={`/listing/${req.listing._id}`}
                                        className="ml-auto flex items-center gap-2 text-[#3b82f6] font-black text-xs uppercase tracking-widest hover:underline group/link"
                                    >
                                        View Property <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-[60px] border border-dashed border-gray-200 p-24 text-center flex flex-col items-center gap-6 animate-in slide-in-from-bottom-4 duration-700">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center shadow-inner">
                        <Frown size={64} className="text-gray-200" />
                    </div>
                    <div className="max-w-md">
                        <h3 className="text-2xl font-black text-[#1e3a5f] mb-3">No visits scheduled</h3>
                        <p className="text-gray-400 font-medium tracking-wide italic">Once you request a visit for a property, the schedule and status tracking will appear here.</p>
                        <Link to="/search" className="inline-block mt-8 bg-[#3b82f6] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95">Explore Listings</Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyRequestsPage;
