import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkers } from '../contexts/WorkersContext';
import WorkerCard from '../components/WorkerCard';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { Users, Filter, Star, Briefcase, MapPin, Tag } from 'lucide-react';

const Workers = () => {
    const navigate = useNavigate();
    const { getFilteredWorkers, filters, setFilters } = useWorkers();
    const [showFilters, setShowFilters] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const filteredWorkers = getFilteredWorkers();

    const expertiseAreas = [
        { value: 'all', label: 'All Expertise' },
        { value: 'structural', label: 'Structural' },
        { value: 'ss', label: 'Stainless Steel' },
        { value: 'ms', label: 'Mild Steel' },
        { value: 'piping', label: 'Piping' },
        { value: 'welding', label: 'Welding' },
        { value: 'maintenance', label: 'Maintenance' },
        { value: 'fitter', label: 'Fitter' },
        { value: 'grinder', label: 'Grinder Man' },
    ];

    const experienceLevels = [
        { value: 'all', label: 'All Levels' },
        { value: 'beginner', label: 'Beginner (0-3 years)' },
        { value: 'intermediate', label: 'Intermediate (4-8 years)' },
        { value: 'expert', label: 'Expert (8+ years)' },
    ];

    const handleViewProfile = (worker) => {
        setSelectedWorker(worker);
        setShowDetailsModal(true);
    };

    const handleContact = (workerId) => {
        navigate('/messages');
    };

    const clearFilters = () => {
        setFilters({
            skills: [],
            experience: 'all',
            location: '',
            availability: false,
            expertiseArea: 'all',
            searchKeyword: '',
        });
    };

    const activeFilterCount = () => {
        let count = 0;
        if (filters.skills.length > 0) count++;
        if (filters.experience !== 'all') count++;
        if (filters.location) count++;
        if (filters.availability) count++;
        if (filters.expertiseArea !== 'all') count++;
        return count;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Find Workers & Contractors
                        </h1>
                        <p className="text-gray-600">
                            {filteredWorkers.length} skilled professional{filteredWorkers.length !== 1 ? 's' : ''} available
                        </p>
                    </div>

                    {/* Filter Toggle (Mobile) */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="md:hidden mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
                    >
                        <Filter className="w-5 h-5" />
                        Filters {activeFilterCount() > 0 && `(${activeFilterCount()})`}
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Filter Sidebar */}
                    <div className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-80 flex-shrink-0`}>
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Filter className="w-5 h-5" />
                                    Filters
                                </h2>
                                {activeFilterCount() > 0 && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                {/* Expertise Area Filter */}
                                <div>
                                    <label className="'block' text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <Tag className="w-4 h-4" />
                                        Expertise Area
                                    </label>
                                    <select
                                        value={filters.expertiseArea}
                                        onChange={(e) => setFilters({ ...filters, expertiseArea: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {expertiseAreas.map(area => (
                                            <option key={area.value} value={area.value}>
                                                {area.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Experience Level Filter */}
                                <div>
                                    <label className="'block' text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4" />
                                        Experience Level
                                    </label>
                                    <select
                                        value={filters.experience}
                                        onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {experienceLevels.map(level => (
                                            <option key={level.value} value={level.value}>
                                                {level.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Location Filter */}
                                <div>'
                                    <label className="block' text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Mumbai, Delhi"
                                        value={filters.location}
                                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Availability Toggle */}
                                <div>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filters.availability}
                                            onChange={(e) => setFilters({ ...filters, availability: e.target.checked })}
                                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">
                                            Show only available workers
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Workers Grid */}
                    <div className="flex-1">
                        {filteredWorkers.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                {filteredWorkers.map(worker => (
                                    <WorkerCard
                                        key={worker.id}
                                        worker={worker}
                                        onViewProfile={handleViewProfile}
                                        onContact={handleContact}
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon={Users}
                                title="No Workers Found"
                                message="Try adjusting your filters to find more professionals."
                                actionLabel="Clear Filters"
                                onAction={clearFilters}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Worker Details Modal */}
            {showDetailsModal && selectedWorker && (
                <Modal
                    isOpen={showDetailsModal}
                    onClose={() => setShowDetailsModal(false)}
                    title={selectedWorker.name}
                    size="large"
                >
                    <div className="space-y-6">
                        {/* Profile Header */}
                        <div className="flex items-start gap-6 pb-6 border-b border-gray-200">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                                {selectedWorker.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedWorker.name}</h2>
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                        <span className="font-semibold text-gray-700">{selectedWorker.rating}</span>
                                    </div>
                                    <span className="text-gray-500">|</span>
                                    <span className="text-gray-600">{selectedWorker.completedProjects} projects completed</span>
                                </div>
                                <p className="text-gray-700">{selectedWorker.bio}</p>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Hourly Rate</p>
                                <p className="text-2xl font-bold text-blue-600">₹{selectedWorker.hourlyRate}/hr</p>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Experience</p>
                                <p className="text-2xl font-bold text-purple-600">{selectedWorker.yearsOfExperience} years</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Location</p>
                                <p className="text-lg font-semibold text-green-700">{selectedWorker.location}</p>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Availability</p>
                                <p className={`text-lg font-semibold ${selectedWorker.availability === 'available' ? 'text-green-600' : 'text-orange-600'}`}>
                                    {selectedWorker.availability === 'available' ? 'Available' : 'Busy'}
                                </p>
                            </div>
                        </div>

                        {/* Skills */}
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedWorker.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg font-medium text-sm"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Certifications */}
                        {selectedWorker.certifications.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Certifications</h4>
                                <ul className="space-y-2">
                                    {selectedWorker.certifications.map((cert, index) => (
                                        <li key={index} className="flex items-center gap-2 text-gray-700">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                            {cert}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Contact Button */}
                        <div className="pt-6 border-t border-gray-200">
                            <button
                                onClick={() => {
                                    handleContact(selectedWorker.id);
                                    setShowDetailsModal(false);
                                }}
                                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
                            >
                                Contact This Worker
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Workers;
