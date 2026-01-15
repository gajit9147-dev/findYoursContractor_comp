import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'blue' }) => {
    const sizeClasses = {
        small: 'w-5 h-5 border-2',
        medium: 'w-10 h-10 border-4',
        large: 'w-16 h-16 border-4',
    };

    const colorClasses = {
        blue: 'border-blue-200 border-t-blue-600',
        white: 'border-white/30 border-t-white',
        gray: 'border-gray-200 border-t-gray-600',
    };

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div
                className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
                role="status"
                aria-label="loading"
            ></div>
            <p className="mt-4 text-gray-500 font-medium animate-pulse">
                Updating information...
            </p>
        </div>
    );
};

export default LoadingSpinner;
