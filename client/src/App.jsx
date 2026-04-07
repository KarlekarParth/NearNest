import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ListingDetailPage from './pages/ListingDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';
import MyRequestsPage from './pages/MyRequestsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <Router>
                    <Toaster 
                        position="top-right"
                        toastOptions={{
                            style: {
                                borderRadius: '20px',
                                background: '#1e3a5f',
                                color: '#fff',
                                fontFamily: 'Outfit, sans-serif',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                padding: '16px 24px',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#3b82f6',
                                    secondary: '#fff',
                                },
                            },
                        }}
                    />
                    <Layout>
                        <div className="animate-in fade-in duration-500">
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/search" element={<SearchPage />} />
                                <Route path="/listing/:id" element={<ListingDetailPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/register" element={<RegisterPage />} />
                                
                                {/* Private Routes */}
                                <Route 
                                    path="/dashboard" 
                                    element={<ProtectedRoute><OwnerDashboardPage /></ProtectedRoute>} 
                                />
                                <Route 
                                    path="/profile" 
                                    element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} 
                                />
                                <Route 
                                    path="/wishlist" 
                                    element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} 
                                />
                                <Route 
                                    path="/my-requests" 
                                    element={<ProtectedRoute><MyRequestsPage /></ProtectedRoute>} 
                                />

                                <Route path="*" element={<NotFoundPage />} />
                            </Routes>
                        </div>
                    </Layout>
                </Router>
            </AuthProvider>
        </ErrorBoundary>
    );
}

export default App;
