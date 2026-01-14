import React from 'react';

/**
 * Settings Page Component
 * User's account settings and preferences
 */
const Settings = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Settings
            </h1>
            <div className="bg-white rounded-lg shadow-md p-8">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Account Settings</h3>
                        <p className="text-gray-600">Manage your account preferences and security settings.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Notification Preferences</h3>
                        <p className="text-gray-600">Control how and when you receive notifications.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Privacy Settings</h3>
                        <p className="text-gray-600">Manage your privacy and data preferences.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
