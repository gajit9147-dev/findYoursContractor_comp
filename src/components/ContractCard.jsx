import React from 'react';
import { MapPin, Calendar, DollarSign, Building2, Users } from 'lucide-react';

const ContractCard = ({ contract, onViewDetails, onApply }) => {
    const getCategoryBadgeColor = (category) => {
        const colors = {
            structural: 'bg-blue-100 text-blue-700',
            ss: 'bg-purple-100 text-purple-700',
            ms: 'bg-gray-100 text-gray-700',
            piping: 'bg-green-100 text-green-700',
            welding: 'bg-orange-100 text-orange-700',
            maintenance: 'bg-yellow-100 text-yellow-700',
        };
        return colors[category] || 'bg-gray-100 text-gray-700';
    };

    const getCategoryLabel = (category) => {
        const labels = {
            structural: 'Structural',
            ss: 'Stainless Steel',
            ms: 'Mild Steel',
            piping: 'Piping',
            welding: 'Welding',
            maintenance: 'Maintenance',
        };
        return labels[category] || category;
    };

    const formatDeadline = (deadline) => {
        const date = new Date(deadline);
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
            {/* Header */}
            <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryBadgeColor(contract.category)}`}>
                        {getCategoryLabel(contract.category)}
                    </span>
                    <span className="text-xs text-gray-500">Posted {contract.postedDate}</span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {contract.title}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {contract.description}
                </p>

                {/* Company */}
                <div className="flex items-center gap-2 text-sm text-gray-700 mb-4">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{contract.company}</span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="font-semibold text-green-700">₹{contract.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span>{formatDeadline(contract.deadline)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 col-span-2">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span>{contract.location}</span>
                    </div>
                </div>

                {/* Applicants */}
                <div className="flex items-center gap-2 text-sm text-gray-500 pb-4 border-b border-gray-100">
                    <Users className="w-4 h-4" />
                    <span>{contract.applicants} applicants</span>
                </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex gap-3">
                <button
                    onClick={() => onViewDetails(contract)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all"
                >
                    View Details
                </button>
                <button
                    onClick={() => onApply(contract.id)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm"
                >
                    Apply Now
                </button>
            </div>
        </div>
    );
};

export default ContractCard;
