import React from 'react';
import { MapPin, Star, Briefcase, DollarSign, CheckCircle2 } from 'lucide-react';

const WorkerCard = ({ worker, onViewProfile, onContact }) => {
    const getExperienceBadgeColor = (experience) => {
        const colors = {
            beginner: 'bg-green-100 text-green-700',
            intermediate: 'bg-blue-100 text-blue-700',
            expert: 'bg-purple-100 text-purple-700',
        };
        return colors[experience] || 'bg-gray-100 text-gray-700';
    };

    const getExperienceLabel = (experience) => {
        const labels = {
            beginner: 'Beginner',
            intermediate: 'Intermediate',
            expert: 'Expert',
        };
        return labels[experience] || experience;
    };

    const getAvailabilityColor = (availability) => {
        return availability === 'available' ? 'text-green-600' : 'text-orange-600';
    };

    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
            {/* Header */}
            <div className="p-6">
                {/* Avatar and Name */}
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                        {worker.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {worker.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-semibold text-gray-700">{worker.rating}</span>
                            <span className="text-xs text-gray-500">({worker.completedProjects} projects)</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getExperienceBadgeColor(worker.experience)}`}>
                            {getExperienceLabel(worker.experience)}
                        </span>
                    </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {worker.bio}
                </p>

                {/* Skills */}
                <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                        {worker.skills.slice(0, 4).map((skill, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium"
                            >
                                {skill}
                            </span>
                        ))}
                        {worker.skills.length > 4 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                                +{worker.skills.length - 4} more
                            </span>
                        )}
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Briefcase className="w-4 h-4 text-blue-500" />
                        <span>{worker.yearsOfExperience} years experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span>{worker.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="font-semibold text-green-700">₹{worker.hourlyRate}/hr</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className={`w-4 h-4 ${worker.availability === 'available' ? 'text-green-500' : 'text-orange-500'}`} />
                        <span className={`font-medium ${getAvailabilityColor(worker.availability)}`}>
                            {worker.availability === 'available' ? 'Available' : 'Busy'}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={() => onViewProfile(worker)}
                        className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all"
                    >
                        View Profile
                    </button>
                    <button
                        onClick={() => onContact(worker.id)}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm"
                    >
                        Contact
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkerCard;
