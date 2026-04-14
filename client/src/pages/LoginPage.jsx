import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../config';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setApiError('');

        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/login`, formData);

            const user = res.data.user;
            const token = res.data.token;

            login(user, token);

            // Role-based redirection
            if (user.role === 'owner') {
                navigate('/dashboard');
            } else {
                navigate('/search');
            }
        } catch (error) {
            setApiError(error.response?.data?.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 py-20">
            <div className="w-full max-w-[420px] bg-white rounded-[40px] shadow-2xl overflow-hidden p-10 border border-gray-100">
                {/* Logo & Header */}
                <div className="text-center mb-10">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <div className="w-10 h-10 bg-[#1e3a5f] rounded-xl flex items-center justify-center">
                            <span className="text-white font-black text-2xl">N</span>
                        </div>
                        <span className="text-2xl font-black text-[#1e3a5f]">NearNest</span>
                    </div>
                    <h1 className="text-2xl font-black text-[#1e3a5f]">Welcome back</h1>
                    <p className="text-gray-400 font-medium text-sm mt-1">Please enter your details to sign in.</p>
                </div>

                {/* API Error Banner */}
                {apiError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                        <AlertCircle size={18} /> {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className={`flex items-center gap-3 bg-gray-50 p-3.5 rounded-2xl border ${errors.email ? 'border-red-300' : 'border-gray-50'}`}>
                                <Mail size={18} className="text-gray-400" />
                                <input 
                                    type="email" name="email" placeholder="john@example.com"
                                    className="bg-transparent w-full outline-none text-sm font-semibold text-[#1e3a5f]"
                                    value={formData.email} onChange={handleInputChange}
                                />
                            </div>
                            {errors.email && <p className="text-[10px] font-bold text-red-500 ml-2">{errors.email}</p>}
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Password</label>
                                <a href="#" className="text-[10px] font-black text-[#3b82f6] hover:underline uppercase tracking-widest">Forgot?</a>
                            </div>
                            <div className={`flex items-center gap-3 bg-gray-50 p-3.5 rounded-2xl border ${errors.password ? 'border-red-300' : 'border-gray-50'}`}>
                                <Lock size={18} className="text-gray-400" />
                                <input 
                                    type="password" name="password" placeholder="••••••••"
                                    className="bg-transparent w-full outline-none text-sm font-semibold text-[#1e3a5f]"
                                    value={formData.password} onChange={handleInputChange}
                                />
                            </div>
                            {errors.password && <p className="text-[10px] font-bold text-red-500 ml-2">{errors.password}</p>}
                        </div>
                    </div>

                    <button 
                        type="submit" disabled={loading}
                        className="w-full bg-[#3b82f6] text-white py-4 rounded-[20px] font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-3 mt-4"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : 'Login'}
                    </button>
                </form>

                <div className="mt-8 text-center pt-8 border-t border-gray-50">
                    <p className="text-gray-400 text-sm font-medium">
                        New here? <Link to="/register" className="text-[#3b82f6] font-black hover:underline underline-offset-4">Create an account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
