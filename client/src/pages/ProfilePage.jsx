import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, Camera, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../config';

const ProfilePage = () => {
    const { user, token, login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const fileInputRef = useRef(null);
    
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        profilePic: user?.profilePic || '',
        password: '',
        confirmPassword: ''
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(user?.profilePic || '');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password && formData.password !== formData.confirmPassword) {
            return setMessage({ type: 'error', text: 'Passwords do not match' });
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            if (formData.password) data.append('password', formData.password);
            if (selectedFile) data.append('profilePic', selectedFile);

            const res = await axios.put(`${API_BASE_URL}/api/auth/profile`, data, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            login(res.data.user, res.data.token); // Update context
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-[#1e3a5f] p-12 text-center relative">
                    <div className="relative inline-block group">
                        <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-2xl transition-transform group-hover:scale-105">
                            <img 
                                src={previewUrl || 'https://via.placeholder.com/150'} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button 
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className="absolute bottom-0 right-0 p-2.5 bg-[#3b82f6] text-white rounded-full shadow-lg hover:bg-blue-600 transition-all border-2 border-[#1e3a5f]"
                        >
                            <Camera size={18} />
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            className="hidden" 
                            accept="image/*"
                        />
                    </div>
                    <h1 className="text-3xl font-black text-white mt-6 tracking-tight">{user?.name}</h1>
                    <p className="text-blue-300 font-bold uppercase text-xs tracking-[0.2em] mt-1">{user?.role}</p>
                </div>

                <div className="p-8 lg:p-12">
                    {message.text && (
                        <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300 ${
                            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                            {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                            <span className="font-bold">{message.text}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <User size={14} /> Full Name
                                </label>
                                <input 
                                    type="text" name="name" 
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-[#3b82f6] outline-none"
                                    value={formData.name} onChange={handleChange} required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Mail size={14} /> Email Address
                                </label>
                                <input 
                                    type="email" name="email" 
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-[#3b82f6] outline-none"
                                    value={formData.email} onChange={handleChange} required
                                    disabled
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Phone size={14} /> Phone Number
                                </label>
                                <input 
                                    type="text" name="phone" 
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-[#3b82f6] outline-none"
                                    placeholder="+91 98765 43210"
                                    value={formData.phone} onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2 opacity-50 cursor-not-allowed">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Camera size={14} /> Profile Picture (Auto-uploaded)
                                </label>
                                <input 
                                    type="text"
                                    className="w-full bg-gray-100 border-none rounded-2xl p-4 text-xs font-medium outline-none cursor-not-allowed"
                                    value={selectedFile ? selectedFile.name : 'No file selected'} 
                                    disabled
                                />
                            </div>
                        </div>

                        <hr className="border-gray-50 my-4" />

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Lock size={14} /> New Password
                                </label>
                                <input 
                                    type="password" name="password" 
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-[#3b82f6] outline-none"
                                    placeholder="••••••••"
                                    value={formData.password} onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Lock size={14} /> Confirm Password
                                </label>
                                <input 
                                    type="password" name="confirmPassword" 
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-[#3b82f6] outline-none"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword} onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" disabled={loading}
                            className="w-full bg-[#1e3a5f] text-white py-5 rounded-[25px] font-black text-sm uppercase tracking-[0.2em] hover:bg-[#2c538a] transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Update My Profile'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
