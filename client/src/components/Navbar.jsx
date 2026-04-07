import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Home, Search, ListPlus, LayoutDashboard, 
    LogOut, Menu, X, Heart, User as UserIcon, Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const navLinks = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Search PGs', path: '/search', icon: Search },
    ];

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    {/* Left: Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
                            <div className="bg-[#1e3a5f] p-1.5 rounded-xl shadow-lg">
                                <Home className="text-white" size={20} />
                            </div>
                            <span className="text-2xl font-black text-[#1e3a5f] tracking-tighter">NearNest</span>
                        </Link>
                    </div>

                    {/* Right: Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.path} 
                                to={link.path} 
                                className="text-gray-500 hover:text-[#3b82f6] font-bold transition-all flex items-center gap-1.5 text-sm"
                            >
                                <link.icon size={16} />
                                {link.name}
                            </Link>
                        ))}
                        
                        {!isAuthenticated && (
                            <Link 
                                to="/register" 
                                className="text-gray-500 hover:text-[#3b82f6] font-bold transition-all flex items-center gap-1.5 text-sm"
                            >
                                <ListPlus size={16} /> List Your PG
                            </Link>
                        )}

                        <div className="h-6 w-px bg-gray-100 mx-2"></div>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-5">
                                <Link to="/wishlist" className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50" title="Wishlist">
                                    <Heart size={20} />
                                </Link>

                                {user?.role === 'seeker' && (
                                    <Link to="/my-requests" className="text-gray-500 hover:text-[#3b82f6] transition-colors p-2 rounded-xl hover:bg-blue-50" title="My Visits">
                                        <Calendar size={20} />
                                    </Link>
                                )}

                                {user?.role === 'owner' ? (
                                    <Link 
                                        to="/dashboard" 
                                        className="bg-[#1e3a5f] text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#2c538a] transition-all shadow-lg flex items-center gap-2"
                                    >
                                        <LayoutDashboard size={16} /> Dashboard
                                    </Link>
                                ) : (
                                    <Link 
                                        to="/profile" 
                                        className="flex items-center gap-2 group"
                                    >
                                        <div className="w-10 h-10 rounded-full border-2 border-gray-50 overflow-hidden shadow-sm group-hover:border-[#3b82f6] transition-all">
                                            <img src={user?.profilePic || 'https://via.placeholder.com/40'} alt="Profile" className="w-full h-full object-cover" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-700 group-hover:text-[#3b82f6] transition-all">{user?.name?.split(' ')[0] || 'User'}</span>
                                    </Link>
                                )}

                                {user?.role === 'owner' && (
                                    <Link to="/profile" title="Profile Settings" className="text-gray-400 hover:text-[#3b82f6] transition-colors">
                                        <UserIcon size={20} />
                                    </Link>
                                )}

                                <button 
                                    onClick={() => { logout(); closeMenu(); }}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-all hover:bg-red-50 rounded-xl"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-gray-600 hover:text-[#3b82f6] font-bold text-sm">Login</Link>
                                <Link 
                                    to="/register" 
                                    className="bg-[#3b82f6] text-white px-7 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile: Hamburger Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMenu} className="text-[#1e3a5f] p-2 bg-gray-50 rounded-xl">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile: Dropdown Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 py-6 px-4 space-y-4 animate-in slide-in-from-top duration-300">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.path} 
                            to={link.path} 
                            onClick={closeMenu}
                            className="flex items-center gap-4 text-gray-700 font-bold p-4 hover:bg-gray-50 rounded-2xl transition-all"
                        >
                            <div className="bg-blue-50 p-2 rounded-xl">
                                <link.icon size={20} className="text-[#3b82f6]" />
                            </div>
                            {link.name}
                        </Link>
                    ))}
                    
                    {isAuthenticated && (
                        <>
                            <Link 
                                to="/wishlist" 
                                onClick={closeMenu}
                                className="flex items-center gap-4 text-gray-700 font-bold p-4 hover:bg-red-50 rounded-2xl transition-all"
                            >
                                <div className="bg-red-50 p-2 rounded-xl">
                                    <Heart size={20} className="text-red-500" />
                                </div>
                                My Wishlist
                            </Link>
                            {user?.role === 'seeker' && (
                                <Link 
                                    to="/my-requests" 
                                    onClick={closeMenu}
                                    className="flex items-center gap-4 text-gray-700 font-bold p-4 hover:bg-blue-50 rounded-2xl transition-all"
                                >
                                    <div className="bg-blue-50 p-2 rounded-xl">
                                        <Calendar size={20} className="text-blue-500" />
                                    </div>
                                    My Visits
                                </Link>
                            )}
                        </>
                    )}

                    <div className="h-px bg-gray-50 my-2"></div>
                    
                    {isAuthenticated ? (
                        <div className="space-y-2">
                            <Link 
                                to="/profile" 
                                onClick={closeMenu}
                                className="flex items-center gap-4 text-gray-700 font-bold p-4 hover:bg-gray-50 rounded-2xl"
                            >
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
                                    <img src={user?.profilePic} alt="Profile" className="w-full h-full object-cover" />
                                </div>
                                Profile Settings
                            </Link>
                            {user?.role === 'owner' && (
                                <Link 
                                    to="/dashboard" 
                                    onClick={closeMenu}
                                    className="flex items-center gap-4 text-gray-700 font-bold p-4 hover:bg-gray-50 rounded-2xl"
                                >
                                    <div className="bg-blue-50 p-2 rounded-xl">
                                        <LayoutDashboard size={20} className="text-[#3b82f6]" />
                                    </div>
                                    Owner Dashboard
                                </Link>
                            )}
                            <button 
                                onClick={() => { logout(); closeMenu(); }}
                                className="flex items-center gap-4 w-full text-red-500 font-black p-4 hover:bg-red-50 rounded-2xl transition-all uppercase text-xs tracking-widest"
                            >
                                <LogOut size={20} /> Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <Link 
                                to="/login" 
                                onClick={closeMenu}
                                className="text-center py-4 font-bold text-gray-700 hover:bg-gray-50 rounded-2xl"
                            >
                                Login
                            </Link>
                            <Link 
                                to="/register" 
                                onClick={closeMenu}
                                className="text-center py-5 font-black bg-[#3b82f6] text-white rounded-[20px] shadow-xl uppercase text-xs tracking-widest"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
