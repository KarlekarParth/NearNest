import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <footer className="bg-white border-t border-gray-100 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">N</span>
                        </div>
                        <span className="text-xl font-bold text-[#1e3a5f]">NearNest</span>
                    </div>
                    <p className="text-gray-500 font-medium">
                        © 2025 NearNest · PICT, Pune
                    </p>
                    <div className="flex gap-6 text-gray-400">
                        <a href="#" className="hover:text-[#3b82f6] transition-colors">About</a>
                        <a href="#" className="hover:text-[#3b82f6] transition-colors">Privacy</a>
                        <a href="#" className="hover:text-[#3b82f6] transition-colors">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
