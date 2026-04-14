import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PickerMap from '../components/PickerMap';
import { API_BASE_URL } from '../config';
import { 
    LayoutGrid, PlusCircle, Trash2, Edit3, CheckCircle, 
    XCircle, Loader2, MapPin, IndianRupee, Image as ImageIcon, 
    Plus, X, Calendar, MessageCircle, User as UserIcon, Clock, Camera
} from 'lucide-react';

const LISTING_API = `${API_BASE_URL}/api/listings`;
const BOOKING_API = `${API_BASE_URL}/api/bookings`;

const OwnerDashboardPage = () => {
    const { user, token } = useAuth();
    const [activeTab, setActiveTab] = useState('my-listings');
    const [listings, setListings] = useState([]);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const fileInputRef = useRef(null);
    
    // Form State
    const initialFormState = {
        title: '',
        description: '',
        type: 'PG',
        gender: 'Male',
        occupancy: 'Single',
        rent: '',
        address: '',
        city: '',
        location: { lat: 18.5204, lng: 73.8567 },
        amenities: [],
        ownerContact: '',
        photos: [] // This will now hold File objects or existing URLs
    };
    const [formData, setFormData] = useState(initialFormState);
    const [editingId, setEditingId] = useState(null);
    const [previews, setPreviews] = useState([]); // Preview URLs for new files

    const amenitiesOptions = ['Wi-Fi', 'Food', 'Laundry', 'AC', 'Parking', 'Gym'];

    const fetchData = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            if (activeTab === 'my-listings') {
                const res = await axios.get(`${LISTING_API}/mine`, config);
                setListings(res.data);
            } else if (activeTab === 'leads') {
                const res = await axios.get(`${BOOKING_API}/my-leads`, config);
                setLeads(res.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setMessage({ type: 'error', text: 'Failed to sync data.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token && (activeTab === 'my-listings' || activeTab === 'leads')) {
            fetchData();
        }
    }, [activeTab, token]);

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`${BOOKING_API}/${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: `Lead marked as ${status}!` });
            fetchData();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update status.' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await axios.delete(`${LISTING_API}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: 'Listing removed.' });
            fetchData();
        } catch (error) {
            setMessage({ type: 'error', text: 'Delete failed.' });
        }
    };

    const handleEditStart = (listing) => {
        let extractedLocation = { lat: 18.5204, lng: 73.8567 };
        if (listing.location) {
            if (listing.location.coordinates && Array.isArray(listing.location.coordinates)) {
                extractedLocation = { lat: listing.location.coordinates[1], lng: listing.location.coordinates[0] };
            } else if (listing.location.lat !== undefined) {
                extractedLocation = listing.location;
            }
        }
        setFormData({ ...listing, location: extractedLocation, photos: [] }); // Start with empty file list for new uploads
        setPreviews(listing.photos || []); // Show existing photos as previews
        setEditingId(listing._id);
        setActiveTab('add-edit');
    };

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleLocationChange = (e) => setFormData({ ...formData, location: { ...formData.location, [e.target.name]: parseFloat(e.target.value) } });
    const handleAmenityToggle = (a) => setFormData({ ...formData, amenities: formData.amenities.includes(a) ? formData.amenities.filter(x => x !== a) : [...formData.amenities, a] });

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + formData.photos.length > 5) {
            return setMessage({ type: 'error', text: 'Max 5 photos allowed.' });
        }
        
        const newFiles = [...formData.photos, ...files];
        setFormData({ ...formData, photos: newFiles });
        
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);
    };

    const removePhoto = (index) => {
        const newFiles = formData.photos.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        setFormData({ ...formData, photos: newFiles });
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'location') {
                    data.append(key, JSON.stringify({
                        type: 'Point',
                        coordinates: [formData.location.lng, formData.location.lat]
                    }));
                } else if (key === 'amenities') {
                    data.append(key, JSON.stringify(formData[key]));
                } else if (key === 'photos') {
                    // Only append actual File objects
                    formData.photos.forEach(file => {
                        if (file instanceof File) data.append('photos', file);
                    });
                } else {
                    data.append(key, formData[key]);
                }
            });

            // If editing and no new photos, we might need to send existing URLs back 
            // but the backend logic for update usually replaces or handles existing ones.
            // For this MVP, we'll assume new uploads replace old ones or keep old if no new ones provided.

            const config = { 
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                } 
            };

            if (editingId) await axios.put(`${LISTING_API}/${editingId}`, data, config);
            else await axios.post(LISTING_API, data, config);

            setMessage({ type: 'success', text: editingId ? 'Listing updated!' : 'Property published!' });
            setTimeout(() => { 
                setActiveTab('my-listings'); 
                setFormData(initialFormState); 
                setPreviews([]);
                setEditingId(null); 
            }, 1000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Action failed.' });
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
            {/* SIDEBAR */}
            <aside className="lg:w-72 bg-[#1e3a5f] text-white p-8 flex flex-col gap-10 shadow-2xl relative z-20">
                <div className="pt-4 px-2">
                    <p className="text-blue-300 text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-50">Authorized Hub</p>
                    <h2 className="text-2xl font-black truncate tracking-tighter">{user?.name}</h2>
                </div>

                <nav className="flex flex-col gap-3">
                    <button onClick={() => setActiveTab('my-listings')} className={`flex items-center gap-4 p-5 rounded-[22px] font-bold text-sm transition-all ${activeTab === 'my-listings' ? 'bg-[#3b82f6] shadow-xl shadow-blue-500/20' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}><LayoutGrid size={20} /> My Portfolio</button>
                    <button onClick={() => setActiveTab('leads')} className={`flex items-center gap-4 p-5 rounded-[22px] font-bold text-sm transition-all ${activeTab === 'leads' ? 'bg-[#3b82f6] shadow-xl shadow-blue-500/20' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}><Calendar size={20} /> Visit Leads</button>
                    <button onClick={() => { setActiveTab('add-edit'); setEditingId(null); setFormData(initialFormState); setPreviews([]); }} className={`flex items-center gap-4 p-5 rounded-[22px] font-bold text-sm transition-all ${activeTab === 'add-edit' && !editingId ? 'bg-[#3b82f6] shadow-xl shadow-blue-500/20' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}><PlusCircle size={20} /> Add Property</button>
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-grow p-6 lg:p-14 overflow-y-auto max-h-screen">
                {message.text && (
                    <div className={`mb-10 p-5 rounded-3xl flex items-center gap-4 animate-in slide-in-from-top-4 duration-500 border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                        {message.type === 'success' ? <CheckCircle size={24} /> : <XCircle size={24} />}
                        <span className="font-black text-xs uppercase tracking-widest">{message.text}</span>
                    </div>
                )}

                {activeTab === 'my-listings' && (
                    <section className="animate-in fade-in duration-700">
                        <div className="mb-12">
                            <h1 className="text-4xl font-black text-[#1e3a5f] mb-2 tracking-tighter">Your Portfolio</h1>
                            <p className="text-gray-400 font-bold italic tracking-wide">Managing {listings.length} live units</p>
                        </div>
                        {loading ? <div className="flex justify-center p-20"><Loader2 className="animate-spin text-gray-200" size={48} /></div> : (
                            <div className="grid gap-6">
                                {listings.map(l => (
                                    <div key={l._id} className="bg-white p-7 rounded-[35px] shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:shadow-2xl transition-all duration-500">
                                        <div className="flex items-center gap-7">
                                            <div className="w-24 h-24 bg-gray-50 rounded-3xl overflow-hidden shadow-inner border border-gray-50">
                                                <img src={l.photos?.[0] || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-[#1e3a5f] group-hover:text-[#3b82f6] transition-colors tracking-tight">{l.title}</h3>
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">{l.city}</span>
                                                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${l.isVerified ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>{l.isVerified ? 'Verified' : 'Pending'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 border-l border-gray-50 pl-8">
                                            <div className="text-right"><p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Monthly Rent</p><p className="text-2xl font-black text-[#1e3a5f]">₹{l.rent.toLocaleString()}</p></div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEditStart(l)} className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-blue-50 hover:text-[#3b82f6] transition-all"><Edit3 size={20} /></button>
                                                <button onClick={() => handleDelete(l._id)} className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all"><Trash2 size={20} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {activeTab === 'leads' && (
                    <section className="animate-in fade-in duration-700">
                        <div className="mb-12"><h1 className="text-4xl font-black text-[#1e3a5f] mb-2 tracking-tighter">Visit Leads</h1><p className="text-gray-400 font-bold italic tracking-wide">Seekers interested in viewing your properties</p></div>
                        {loading ? <div className="flex justify-center p-20"><Loader2 className="animate-spin text-gray-200" size={48} /></div> : (
                            <div className="grid gap-6">
                                {leads.length > 0 ? leads.map(lead => (
                                    <div key={lead._id} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 relative overflow-hidden group hover:shadow-xl transition-all">
                                        <div className={`absolute top-0 right-0 w-2 h-full ${lead.status === 'confirmed' ? 'bg-green-500' : lead.status === 'cancelled' ? 'bg-red-500' : 'bg-orange-400'}`}></div>
                                        <div className="flex gap-6 flex-grow">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-gray-50 bg-gray-50 flex-shrink-0"><img src={lead.seeker.profilePic || 'https://via.placeholder.com/60'} className="w-full h-full object-cover" alt="" /></div>
                                            <div className="space-y-4">
                                                <div><h3 className="text-xl font-black text-[#1e3a5f]">{lead.seeker.name}</h3><p className="text-sm font-bold text-[#3b82f6] italic">Interested in: <span className="text-gray-400 not-italic">{lead.listing.title}</span></p></div>
                                                <div className="flex flex-wrap gap-4">
                                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-500"><Calendar size={14} /> {new Date(lead.visitDate).toLocaleDateString()}</div>
                                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-500 capitalize"><Clock size={14} /> {lead.status}</div>
                                                </div>
                                                {lead.message && <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 text-sm italic font-medium text-[#1e3a5f] flex gap-2"><MessageCircle size={16} className="shrink-0 mt-0.5 opacity-30" /> "{lead.message}"</div>}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3 justify-center md:min-w-[180px]">
                                            <a href={`tel:${lead.seeker.phone}`} className="flex items-center justify-center gap-2 p-4 bg-gray-50 text-[#1e3a5f] font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-white hover:shadow-md transition-all">Connect Now</a>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleStatusUpdate(lead._id, 'confirmed')} className="flex-grow p-4 bg-green-50 text-green-600 rounded-2xl hover:bg-green-500 hover:text-white transition-all"><CheckCircle size={18} /></button>
                                                <button onClick={() => handleStatusUpdate(lead._id, 'cancelled')} className="flex-grow p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><XCircle size={18} /></button>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="bg-white p-20 rounded-[50px] border border-dashed border-gray-200 text-center flex flex-col items-center">
                                        <Clock className="text-gray-100 mb-6" size={80} />
                                        <h3 className="text-2xl font-black text-[#1e3a5f] mb-2">No active leads</h3>
                                        <p className="text-gray-400 mb-8 max-w-xs">Visit requests from potential seekers will appear here automatically.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
                )}

                {activeTab === 'add-edit' && (
                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
                        <div className="mb-12"><h1 className="text-4xl font-black text-[#1e3a5f] mb-2 tracking-tighter">{editingId ? 'Modify Nest' : 'Expand Your Network'}</h1><p className="text-gray-400 font-bold italic tracking-wide">High-quality details attract premium seekers.</p></div>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="bg-white p-12 rounded-[50px] shadow-sm border border-gray-100 space-y-8 relative overflow-hidden">
                                <h3 className="text-xs font-black text-gray-300 uppercase tracking-[0.4em] relative z-10">I. Core Specifications</h3>
                                <div className="grid gap-8 relative z-10">
                                    <div className="space-y-2"><label className="text-[10px] font-black text-[#1e3a5f] uppercase tracking-widest ml-1">Title</label><input type="text" name="title" required className="w-full bg-gray-50/50 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-[#3b82f6] outline-none" value={formData.title} onChange={handleInputChange} /></div>
                                    <div className="space-y-2"><label className="text-[10px] font-black text-[#1e3a5f] uppercase tracking-widest ml-1">About the Stay</label><textarea name="description" required rows="4" className="w-full bg-gray-50/50 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-[#3b82f6] outline-none" value={formData.description} onChange={handleInputChange}></textarea></div>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Category</label><select name="type" className="w-full bg-gray-50/50 border-none rounded-2xl p-4 text-xs font-black outline-none" value={formData.type} onChange={handleInputChange}><option value="PG">PG</option><option value="Hostel">Hostel</option></select></div>
                                        <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Gender</label><select name="gender" className="w-full bg-gray-50/50 border-none rounded-2xl p-4 text-xs font-black outline-none" value={formData.gender} onChange={handleInputChange}><option value="Male">Male</option><option value="Female">Female</option><option value="Co-ed">Co-ed</option></select></div>
                                        <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Occupancy</label><select name="occupancy" className="w-full bg-gray-50/50 border-none rounded-2xl p-4 text-xs font-black outline-none" value={formData.occupancy} onChange={handleInputChange}><option value="Single">Single</option><option value="Double">Double</option><option value="Triple">Triple</option></select></div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-12 rounded-[50px] shadow-sm border border-gray-100 space-y-8">
                                <h3 className="text-xs font-black text-gray-300 uppercase tracking-[0.4em] flex items-center gap-2"><MapPin size={16} /> II. Location Sync</h3>
                                <div className="grid md:grid-cols-2 gap-8"><div className="space-y-2"><label className="text-[10px] font-black text-[#1e3a5f] uppercase tracking-widest">Address</label><input type="text" name="address" required className="w-full bg-gray-50/50 border-none rounded-2xl p-5 text-sm font-bold outline-none" value={formData.address} onChange={handleInputChange} /></div><div className="space-y-2"><label className="text-[10px] font-black text-[#1e3a5f] uppercase tracking-widest">City</label><input type="text" name="city" required className="w-full bg-gray-50/50 border-none rounded-2xl p-5 text-sm font-bold outline-none" value={formData.city} onChange={handleInputChange} /></div></div>
                                
                                {/* Location Picker map integration */}
                                <div className="space-y-4 pt-4 border-t border-gray-50">
                                    <label className="text-[10px] font-black text-[#1e3a5f] uppercase tracking-widest block">Pinpoint Exact Coordinates</label>
                                    <PickerMap location={formData.location} setLocation={(loc) => setFormData({ ...formData, location: loc })} />
                                    <p className="text-xs font-bold text-gray-400 italic">Click anywhere on the map to accurately place your property marker. Current Coordinates: {formData.location?.lat?.toFixed(4)}, {formData.location?.lng?.toFixed(4)}</p>
                                </div>
                            </div>

                            <div className="bg-[#1e3a5f] p-12 rounded-[50px] shadow-2xl space-y-10 text-white relative overflow-hidden">
                                <h3 className="text-xs font-black text-blue-300 uppercase tracking-[0.4em] flex items-center gap-2 relative z-10"><IndianRupee size={16} /> III. Financials</h3>
                                <div className="grid md:grid-cols-2 gap-10 relative z-10"><div className="space-y-3"><label className="text-xs font-black text-white/50 uppercase tracking-widest ml-1">Monthly Rent (₹)</label><input type="number" name="rent" required className="w-full bg-white/10 border border-white/20 rounded-3xl p-6 text-3xl font-black outline-none focus:bg-white/20 transition-all font-black" value={formData.rent} onChange={handleInputChange} /></div><div className="space-y-3"><label className="text-xs font-black text-white/50 uppercase tracking-widest ml-1">Owner Mobile</label><input type="text" name="ownerContact" required className="w-full bg-white/10 border border-white/20 rounded-3xl p-6 text-3xl font-black outline-none focus:bg-white/20 transition-all font-black" value={formData.ownerContact} onChange={handleInputChange} /></div></div>
                            </div>

                            {/* Multimedia (Photos) Upload */}
                            <div className="bg-white p-12 rounded-[50px] shadow-sm border border-gray-100 space-y-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xs font-black text-gray-300 uppercase tracking-[0.4em] flex items-center gap-2"><ImageIcon size={16} /> IV. Visual Narrative (Max 5)</h3>
                                    <button type="button" onClick={() => fileInputRef.current.click()} className="flex items-center gap-2 bg-blue-50 text-[#3b82f6] px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#3b82f6] hover:text-white transition-all shadow-sm"><Plus size={14} /> Add Real Photos</button>
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept="image/*" />
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                                    {previews.map((preview, i) => (
                                        <div key={i} className="relative aspect-square rounded-[25px] overflow-hidden group shadow-md border-4 border-white">
                                            <img src={preview} className="w-full h-full object-cover" alt="" />
                                            <button type="button" onClick={() => removePhoto(i)} className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-md text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-500 hover:text-white"><X size={16} /></button>
                                        </div>
                                    ))}
                                    {previews.length === 0 && (
                                        <div className="col-span-full py-16 border-2 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center gap-4 text-center cursor-pointer hover:bg-gray-50 transition-all" onClick={() => fileInputRef.current.click()}>
                                            <div className="w-16 h-16 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center"><Camera size={32} /></div>
                                            <div><p className="text-sm font-black text-[#1e3a5f]">No photos uploaded</p><p className="text-xs font-bold text-gray-300 italic uppercase tracking-widest">High quality photos convert 3x faster.</p></div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button type="submit" disabled={loading} className="flex-grow bg-[#3b82f6] text-white py-6 rounded-[30px] font-black text-lg uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center gap-4 active:scale-[0.98] tracking-widest uppercase">
                                    {loading ? <Loader2 className="animate-spin" /> : editingId ? <Edit3 size={24} /> : <CheckCircle size={24} />}
                                    {editingId ? 'Confirm Changes' : 'Publish Property'}
                                </button>
                                {editingId && <button type="button" onClick={() => { setActiveTab('my-listings'); setFormData(initialFormState); setEditingId(null); setPreviews([]); }} className="bg-white text-gray-400 px-12 rounded-[30px] font-black text-xs uppercase tracking-widest border border-gray-100 hover:bg-gray-50 transition-all">Cancel</button>}
                            </div>
                        </form>
                    </section>
                )}
            </main>
        </div>
    );
};

export default OwnerDashboardPage;
