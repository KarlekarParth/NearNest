import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

/** 
 * Resolving Vite asset compilation missing icon bugs dynamically internally 
 */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

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

const LocationPickerLogic = ({ position, setPosition }) => {
    useMapEvents({
        click(e) {
            setPosition({
                lat: e.latlng.lat,
                lng: e.latlng.lng,
            });
        },
    });

    return position && position.lat && position.lng ? (
        <Marker position={[position.lat, position.lng]}>
            <Popup>
                <div className="font-bold text-[#1e3a5f] text-center text-xs">
                    Selected Location<br/>
                    <span className="text-gray-400 font-medium">Click anywhere to reposition</span>
                </div>
            </Popup>
        </Marker>
    ) : null;
};

const PickerMap = ({ location, setLocation }) => {
    // Default fallback to Pune if no location currently stored
    const defaultLocation = { lat: 18.5204, lng: 73.8567 };
    const centerLatLng = (location && location.lat) ? [location.lat, location.lng] : [defaultLocation.lat, defaultLocation.lng];

    return (
        <div className="bg-gray-50 rounded-[32px] overflow-hidden shadow-inner border border-gray-100 relative h-[350px] w-full z-0 block">
            <MapContainer 
                center={centerLatLng} 
                zoom={13} 
                style={{ height: '100%', width: '100%', minHeight: '350px' }}
                scrollWheelZoom={true}
            >
                <FixMap />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPickerLogic position={location} setPosition={setLocation} />
            </MapContainer>
        </div>
    );
};

export default PickerMap;
