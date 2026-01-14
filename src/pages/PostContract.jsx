import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useContracts } from '../contexts/ContractsContext';
import FileUpload from '../components/FileUpload';
import { Briefcase, DollarSign, Calendar, MapPin, FileText, CheckCircle } from 'lucide-react';

const PostContract = () => {
    const navigate = useNavigate();
    const { userRole } = useUser();
    const { addContract } = useContracts();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'structural',
        budget: '',
        deadline: '',
        location: '',
    });

    const [drawings, setDrawings] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const categories = [
        { value: 'structural', label: 'Structural' },
        { value: 'ss', label: 'Stainless Steel (SS)' },
        { value: 'ms', label: 'Mild Steel (MS)' },
        { value: 'piping', label: 'Piping' },
        { value: 'welding', label: 'Welding' },
        { value: 'maintenance', label: 'Maintenance' },
    ];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.budget || formData.budget <= 0) newErrors.budget = 'Valid budget is required';
        if (!formData.deadline) newErrors.deadline = 'Deadline is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert('Please fill all required fields correctly');
            return;
        }

        const newContract = {
            ...formData,
            budget: parseInt(formData.budget),
            drawings,
            company: 'Your Company Name', // In real app, get from user profile
        };

        addContract(newContract);
        setShowSuccess(true);

        setTimeout(() => {
            navigate('/dashboard');
        }, 2000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    if (userRole !== 'company') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-md p-8 max-w-md text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600 mb-6">Only companies can post contracts.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    if (showSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-md p-8 max-w-md text-center animate-fade-in">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Contract Posted Successfully!</h2>
                    <p className="text-gray-600">Redirecting to your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        Post a New Contract
                    </h1>
                    <p className="text-gray-600">
                        Fill in the details below to find the perfect contractor for your project
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                    {/* Contract Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Contract Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Steel Frame Fabrication for Commercial Building"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.title ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Project Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Provide detailed information about your project requirements, scope, and expectations..."
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    {/* Category and Budget Row */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Category */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {categories.map(cat => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Budget */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                Budget (₹) *
                            </label>
                            <input
                                type="number"
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                                placeholder="e.g., 50000"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.budget ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
                        </div>
                    </div>

                    {/* Deadline and Location Row */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Deadline */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Project Deadline *
                            </label>
                            <input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.deadline ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Location *
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g., Mumbai, Maharashtra"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.location ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                        </div>
                    </div>

                    {/* Drawings Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Project Drawings & Documents
                        </label>
                        <FileUpload
                            onFilesChange={setDrawings}
                            accept=".pdf,.dwg,.jpg,.jpeg,.png"
                            multiple={true}
                            maxFiles={10}
                            label="Upload project drawings, blueprints, or reference documents"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Supported formats: PDF, DWG, JPG, PNG (Max 10 files)
                        </p>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-gray-200">
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
                            >
                                Post Contract
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostContract;
