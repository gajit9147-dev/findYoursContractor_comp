import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Briefcase, Users, MessageSquare, Star, TrendingUp, Clock, CheckCircle, FileText } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const { userRole } = useUser();

    // Company Dashboard
    const CompanyDashboard = () => {
        const stats = [
            { label: 'Posted Contracts', value: '5', icon: Briefcase, color: 'blue' },
            { label: 'Total Applicants', value: '42', icon: Users, color: 'green' },
            { label: 'Shortlisted', value: '8', icon: Star, color: 'purple' },
            { label: 'Awarded', value: '2', icon: CheckCircle, color: 'orange' },
        ];

        const postedContracts = [
            { id: 1, title: 'Steel Frame Fabrication', applicants: 12, status: 'Active', posted: '2 days ago' },
            { id: 2, title: 'SS Piping Installation', applicants: 8, status: 'Active', posted: '5 days ago' },
            { id: 3, title: 'Welding Work for MS Structures', applicants: 15, status: 'Active', posted: '1 week ago' },
        ];

        const recentApplicants = [
            { name: 'Rajesh Kumar', contract: 'Steel Frame Fabrication', rating: 4.8, status: 'Pending' },
            { name: 'Amit Patel', contract: 'SS Piping Installation', rating: 4.5, status: 'Shortlisted' },
            { name: 'Suresh Menon', contract: 'Steel Frame Fabrication', rating: 4.9, status: 'Shortlisted' },
        ];

        const getColorClasses = (color) => {
            const colors = {
                blue: 'bg-blue-100 text-blue-600',
                green: 'bg-green-100 text-green-600',
                purple: 'bg-purple-100 text-purple-600',
                orange: 'bg-orange-100 text-orange-600',
            };
            return colors[color] || colors.blue;
        };

        return (
            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(stat.color)}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Posted Contracts */}
                <div className="bg-white rounded-xl shadow-md">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Briefcase className="w-6 h-6" />
                            Posted Contracts
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {postedContracts.map(contract => (
                                <div key={contract.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-1">{contract.title}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                {contract.applicants} applicants
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {contract.posted}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                        {contract.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => navigate('/contracts')}
                            className="mt-6 w-full px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 font-medium transition-all"
                        >
                            View All Contracts
                        </button>
                    </div>
                </div>

                {/* Recent Applicants */}
                <div className="bg-white rounded-xl shadow-md">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Users className="w-6 h-6" />
                            Recent Applicants
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {recentApplicants.map((applicant, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                            {applicant.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{applicant.name}</h3>
                                            <p className="text-sm text-gray-600">{applicant.contract}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span className="font-semibold text-gray-700">{applicant.rating}</span>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${applicant.status === 'Shortlisted' ? 'bg-purple-100 text-purple-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {applicant.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Worker Dashboard
    const WorkerDashboard = () => {
        const stats = [
            { label: 'Applied Contracts', value: '8', icon: FileText, color: 'blue' },
            { label: 'Saved', value: '12', icon: Star, color: 'purple' },
            { label: 'Shortlisted', value: '3', icon: TrendingUp, color: 'green' },
            { label: 'Awarded', value: '1', icon: CheckCircle, color: 'orange' },
        ];

        const appliedContracts = [
            { title: 'Steel Frame Fabrication', company: 'BuildTech Solutions', status: 'Pending', applied: '3 days ago' },
            { title: 'SS Piping Installation', company: 'PharmaTech Industries', status: 'Shortlisted', applied: '5 days ago' },
            { title: 'Welding Work', company: 'Metro Fabricators', status: 'Pending', applied: '1 week ago' },
        ];

        const profileCompletion = 75;

        const getColorClasses = (color) => {
            const colors = {
                blue: 'bg-blue-100 text-blue-600',
                green: 'bg-green-100 text-green-600',
                purple: 'bg-purple-100 text-purple-600',
                orange: 'bg-orange-100 text-orange-600',
            };
            return colors[color] || colors.blue;
        };

        return (
            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(stat.color)}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Profile Completion */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-md p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-xl font-bold mb-1">Complete Your Profile</h3>
                            <p className="text-blue-100">Boost your chances of getting hired</p>
                        </div>
                        <div className="text-4xl font-bold">{profileCompletion}%</div>
                    </div>
                    <div className="w-full bg-white/30 rounded-full h-3 mb-4">
                        <div
                            className="bg-white rounded-full h-3 transition-all duration-500"
                            style={{ width: `${profileCompletion}%` }}
                        />
                    </div>
                    <button
                        onClick={() => navigate('/profile')}
                        className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all"
                    >
                        Complete Profile
                    </button>
                </div>

                {/* Applied Contracts */}
                <div className="bg-white rounded-xl shadow-md">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Briefcase className="w-6 h-6" />
                            Applied Contracts
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {appliedContracts.map((contract, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-1">{contract.title}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span>{contract.company}</span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {contract.applied}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${contract.status === 'Shortlisted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {contract.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => navigate('/contracts')}
                            className="mt-6 w-full px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 font-medium transition-all"
                        >
                            Browse More Contracts
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {userRole === 'company' ? 'Company Dashboard' : 'Worker Dashboard'}
                    </h1>
                    <p className="text-gray-600">
                        Welcome back! Here's an overview of your activity.
                    </p>
                </div>

                {/* Render Role-Based Dashboard */}
                {userRole === 'company' ? <CompanyDashboard /> : <WorkerDashboard />}
            </div>
        </div>
    );
};

export default Dashboard;
