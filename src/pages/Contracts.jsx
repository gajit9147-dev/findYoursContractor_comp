import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContracts } from '../contexts/ContractsContext';
import ContractCard from '../components/ContractCard';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { Briefcase, Filter, X, DollarSign, MapPin, Tag, Calendar, AlertCircle, RefreshCw } from 'lucide-react';

const Contracts = () => {
    const navigate = useNavigate();
    const { getFilteredContracts, filters, setFilters, applyToContract, loading, error, refreshContracts } = useContracts();
    const [showFilters, setShowFilters] = useState(false);
    const [selectedContract, setSelectedContract] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [applyingId, setApplyingId] = useState(null);

    const filteredContracts = getFilteredContracts();

    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'structural', label: 'Structural' },
        { value: 'ss', label: 'Stainless Steel (SS)' },
        { value: 'ms', label: 'Mild Steel (MS)' },
        { value: 'piping', label: 'Piping' },
        { value: 'welding', label: 'Welding' },
        { value: 'maintenance', label: 'Maintenance' },
    ];

    const handleViewDetails = (contract) => {
        setSelectedContract(contract);
        setShowDetailsModal(true);
    };

    const handleApply = async (contractId) => {
        setApplyingId(contractId);
        try {
            const result = await applyToContract(contractId, {
                bidAmount: selectedContract?.budgetMax || 0,
                proposedDays: 30,
                message: 'I am interested in this contract.'
            });

            if (result.success) {
                toast.success('Application submitted successfully!');
                setShowDetailsModal(false);
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setApplyingId(null);
        }
    };

    const clearFilters = () => {
        setFilters({
            category: 'all',
            location: '',
            budgetMin: 0,
            budgetMax: 1000000,
            deadline: null,
            searchKeyword: '',
        });
    };

    const activeFilterCount = () => {
        let count = 0;
        if (filters.category !== 'all') count++;
        if (filters.location) count++;
        if (filters.budgetMin > 0 || filters.budgetMax < 1000000) count++;
        if (filters.searchKeyword) count++;
        return count;
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-red-100">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={refreshContracts}
                        className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Browse Contracts
                        </h1>
                        <p className="text-gray-600">
                            {loading ? 'Refreshing list...' : `${filteredContracts.length} contract${filteredContracts.length !== 1 ? 's' : ''} available`}
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
                    <div className={`${showFilters ? 'flex' : 'hidden'} lg:flex lg:w-80 flex-shrink-0`}>
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
                                {/* Search */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Search
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Keywords..."
                                        value={filters.searchKeyword}
                                        onChange={(e) => setFilters({ ...filters, searchKeyword: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Category Filter */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <Tag className="w-4 h-4" />
                                        Category
                                    </label>
                                    <select
                                        value={filters.category}
                                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Location Filter */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
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

                                {/* Budget Range */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" />
                                        Max Budget
                                    </label>
                                    <div className="space-y-3">
                                        <input
                                            type="range"
                                            min="0"
                                            max="1000000"
                                            step="10000"
                                            value={filters.budgetMax}
                                            onChange={(e) => setFilters({ ...filters, budgetMax: parseInt(e.target.value) })}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>₹0</span>
                                            <span className="font-bold text-gray-900 text-sm">₹{filters.budgetMax.toLocaleString()}</span>
                                            <span>₹10L+</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contract Grid */}
                    <div className="flex-1">
                        {loading && filteredContracts.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-md p-12 flex items-center justify-center">
                                <LoadingSpinner size="large" />
                            </div>
                        ) : filteredContracts.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                {filteredContracts.map(contract => (
                                    <ContractCard
                                        key={contract.id}
                                        contract={contract}
                                        onViewDetails={handleViewDetails}
                                        onApply={handleApply}
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon={Briefcase}
                                title="No Contracts Found"
                                message="Try adjusting your filters or check back later for new opportunities."
                                actionLabel="Clear Filters"
                                onAction={clearFilters}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Contract Details Modal */}
            {showDetailsModal && selectedContract && (
                <Modal
                    isOpen={showDetailsModal}
                    onClose={() => setShowDetailsModal(false)}
                    title={selectedContract.title}
                    size="large"
                >
                    <div className="space-y-6">
                        {/* Company Info */}
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Briefcase className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">{selectedContract.company}</h3>
                                <p className="text-sm text-gray-500">Posted on {selectedContract.postedDate}</p>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Max Budget</p>
                                <p className="text-2xl font-bold text-blue-600">₹{selectedContract.budgetMax?.toLocaleString() || selectedContract.budget.toLocaleString()}</p>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Deadline</p>
                                <p className="text-2xl font-bold text-purple-600">{selectedContract.deadline}</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Location</p>
                                <p className="text-lg font-semibold text-green-700">{selectedContract.location}</p>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Applicants</p>
                                <p className="text-lg font-semibold text-orange-600">{selectedContract.applicants} applied</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Project Description</h4>
                            <p className="text-gray-700 leading-relaxed">{selectedContract.description}</p>
                        </div>

                        {/* Apply Button */}
                        <div className="pt-4 border-t border-gray-200">
                            <button
                                onClick={() => handleApply(selectedContract.id)}
                                disabled={applyingId === selectedContract.id}
                                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {applyingId === selectedContract.id ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </div>
                                ) : (
                                    'Apply to This Contract'
                                )}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Contracts;
