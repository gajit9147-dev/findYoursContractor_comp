import React from 'react';

const EmptyState = ({ icon: Icon, title, message, actionLabel, onAction }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            {Icon && (
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Icon className="w-10 h-10 text-gray-400" />
                </div>
            )}
            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                {title}
            </h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">
                {message}
            </p>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
