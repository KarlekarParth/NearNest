import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

/** 
 * Problem: Missing Marker Icons in Vite + Leaflet 
 * Fix: Deep bind native Leaflet image imports specifically routing through Vite's bundler.
 */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

/**
 * Problem: Map tiles rendering broken or incomplete upon init
 * Fix: Delay map.invalidateSize() safely letting relative DOM measure fully
 */
const FixMap = () => {
    const map = useMap();
    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 200);
        return () => clearTimeout(timer);
    }, [map]);
    return null;
};

const MapUpdater = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center && center.lat !== undefined && center.lng !== undefined) {
            map.flyTo([center.lat, center.lng], zoom || 13);
        }
    }, [center, map, zoom]);
    return null;
};

// Extractor safely formats properties handling dynamic formats eg [lng, lat], GeoJSON, or basic objs
const extractLatAndLng = (locationData) => {
    if (!locationData) return null;
    if (locationData.lat !== undefined && locationData.lng !== undefined) return { lat: locationData.lat, lng: locationData.lng };
    if (locationData.coordinates && Array.isArray(locationData.coordinates)) return { lat: locationData.coordinates[1], lng: locationData.coordinates[0] };
    if (Array.isArray(locationData) && locationData.length === 2) return { lat: locationData[1], lng: locationData[0] };
    return null;
};

const MapView = ({ lat, lng, properties = [], zoom = 13 }) => {
    const navigate = useNavigate();
    const [selectedListing, setSelectedListing] = useState(null);

    // Initial parsing
    const mapCenter = { lat: lat || 18.5204, lng: lng || 73.8567 };

    return (
        <div className="bg-white rounded-[24px] lg:rounded-[40px] overflow-hidden shadow-inner border border-gray-100 relative h-[400px] lg:h-[600px] w-full z-0 block">
            <MapContainer 
                center={[mapCenter.lat, mapCenter.lng]} 
                zoom={zoom} 
                style={{ height: '100%', width: '100%', minHeight: '400px' }}
                scrollWheelZoom={true}
            >
                <FixMap />
                <MapUpdater center={mapCenter} zoom={zoom} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {properties.map(listing => {
                    const coords = extractLatAndLng(listing.location);
                    if (!coords) return null;

                    return (
                        <Marker 
                            key={listing._id}
                            position={[coords.lat, coords.lng]}
                            eventHandlers={{
                                click: () => setSelectedListing(listing)
                            }}
                        />
                    );
                })}

                {selectedListing && (() => {
                    const popupCoords = extractLatAndLng(selectedListing.location);
                    if (!popupCoords) return null;
                    
                    return (
                        <Popup
                            position={[popupCoords.lat, popupCoords.lng]}
                            onClose={() => setSelectedListing(null)}
                        >
                            <div className="p-2 max-w-[220px]">
                                {selectedListing.images && selectedListing.images.length > 0 && (
                                    <img 
                                        src={selectedListing.images[0].url || selectedListing.images[0]} 
                                        alt={selectedListing.title}
                                        className="w-full h-24 object-cover rounded-xl mb-2"
                                    />
                                )}
                                <h3 className="font-bold text-[#1e3a5f] m-0 text-sm leading-tight">{selectedListing.title}</h3>
                                <p className="text-[#3b82f6] font-black text-lg my-1">₹{selectedListing.rent}</p>
                                <button 
                                    onClick={() => navigate(`/listing/${selectedListing._id}`)}
                                    className="mt-1 text-xs font-bold text-white bg-[#3b82f6] px-3 py-1.5 rounded-lg w-full cursor-pointer hover:bg-blue-600 transition-colors border-none"
                                >
                                    View Details
                                </button>
                            </div>
                        </Popup>
                    );
                })()}
            </MapContainer>
        </div>
    );
};

export default MapView;
