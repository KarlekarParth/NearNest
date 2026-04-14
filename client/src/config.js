// Centralized Configuration for NearNest Frontend
// This will automatically connect to your Render backend when deployed, 
// and fallback to localhost during local development.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
