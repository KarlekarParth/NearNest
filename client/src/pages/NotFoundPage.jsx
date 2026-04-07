import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
            {/* Animated 404 Illustration placeholder */}
            <div className="relative mb-12">
                <div className="text-9xl font-black text-gray-100 select-none">404</div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Search size={80} className="text-[#3b82f6] animate-bounce" />
                </div>
            </div>

            <h1 className="text-4xl font-black text-[#1e3a5f] mb-4 tracking-tight">Nest Not Found</h1>
            <p className="text-gray-500 font-medium max-w-sm mb-12 leading-relaxed text-lg">
                The property or page you are looking for has been moved or doesn't exist anymore. Let's find you another stay!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                    to="/search" 
                    className="bg-[#3b82f6] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center gap-3"
                >
                    <Search size={18} /> Search PGs
                </Link>
                <Link 
                    to="/" 
                    className="bg-white text-[#1e3a5f] border-2 border-gray-100 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95 flex items-center gap-3"
                >
                    <Home size={18} /> Back to Home
                </Link>
            </div>
            
            <button 
                onClick={() => window.history.back()}
                className="mt-12 text-[#3b82f6] font-bold text-sm underline underline-offset-4 flex items-center gap-2"
            >
                <ArrowLeft size={14} /> Go Back
            </button>
        </div>
    );
};

export default NotFoundPage;
