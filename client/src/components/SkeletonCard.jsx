import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full animate-pulse">
            {/* Top: Photo placeholder */}
            <div className="aspect-video bg-gray-200"></div>

            {/* Body */}
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="h-6 w-3/4 bg-gray-200 rounded-lg"></div>
                    <div className="h-8 w-1/4 bg-gray-100 rounded-lg translate-x-2"></div>
                </div>

                <div className="h-4 w-1/2 bg-gray-100 rounded-md"></div>

                {/* Amenity chips placeholder */}
                <div className="flex gap-2 my-4">
                    <div className="h-6 w-16 bg-gray-50 rounded-lg border border-gray-100"></div>
                    <div className="h-6 w-16 bg-gray-50 rounded-lg border border-gray-100"></div>
                    <div className="h-6 w-16 bg-gray-50 rounded-lg border border-gray-100"></div>
                </div>

                {/* Bottom */}
                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="h-8 w-24 bg-gray-200 rounded-xl"></div>
                    <div className="h-8 w-24 bg-gray-100 rounded-xl"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
