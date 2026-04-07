import React from 'react';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-12 text-center border border-red-50">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertTriangle size={40} />
            </div>
            <h1 className="text-3xl font-black text-[#1e3a5f] mb-4 tracking-tighter">Something went wrong.</h1>
            <p className="text-gray-400 font-medium mb-6">We encountered an unexpected error while rendering this page.</p>
            
            {this.state.error && (
                <div className="bg-red-50 p-4 rounded-2xl text-red-600 text-[10px] font-mono text-left mb-10 overflow-auto max-h-32 border border-red-100">
                    {this.state.error.toString()}
                </div>
            )}
            
            <div className="flex flex-col gap-4">
                <button 
                    onClick={() => window.location.reload()}
                    className="w-full bg-[#1e3a5f] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
                >
                    <RefreshCcw size={16} /> Refresh Page
                </button>
                <a 
                    href="/"
                    className="w-full bg-gray-50 text-gray-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-100 transition-all"
                >
                    <Home size={16} /> Back to Home
                </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
