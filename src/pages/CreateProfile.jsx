import React from 'react';

/**
 * Create Profile Page Component
 * Form for workers/contractors to create their professional profile
 */
const CreateProfile = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Create Your Professional Profile
            </h1>
            <div className="bg-white rounded-lg shadow-md p-8">
                <p className="text-gray-600 mb-6">
                    Build your profile to showcase your skills and experience to potential employers.
                </p>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Skills & Specializations
                        </label>
                        <select
                            multiple
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option>Structural Fabrication</option>
                            <option>Stainless Steel Work</option>
                            <option>Mild Steel Work</option>
                            <option>Piping</option>
                            <option>Welding</option>
                            <option>Maintenance</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Years of Experience
                        </label>
                        <input
                            type="number"
                            placeholder="e.g., 5"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bio
                        </label>
                        <textarea
                            rows="5"
                            placeholder="Tell us about your experience and expertise..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>
                    <button className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                        Create Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateProfile;
