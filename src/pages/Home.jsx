import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Briefcase, Users, Building2, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const { userRole } = useUser();

    const stats = [
        { label: 'Active Contracts', value: '500+', icon: Briefcase },
        { label: 'Skilled Workers', value: '2,000+', icon: Users },
        { label: 'Companies', value: '300+', icon: Building2 },
        { label: 'Success Rate', value: '95%', icon: TrendingUp },
    ];

    const categories = [
        { name: 'Structural Steel', icon: '🏗️', count: 120 },
        { name: 'Stainless Steel', icon: '✨', count: 85 },
        { name: 'Mild Steel', icon: '🔧', count: 95 },
        { name: 'Piping', icon: '🔩', count: 65 },
        { name: 'Welding', icon: '⚡', count: 150 },
        { name: 'Maintenance', icon: '🛠️', count: 75 },
    ];

    const howItWorks = [
        {
            step: 1,
            title: 'Create Account',
            description: 'Sign up as a Company or Worker in minutes',
        },
        {
            step: 2,
            title: userRole === 'company' ? 'Post Contract' : 'Browse Contracts',
            description: userRole === 'company'
                ? 'Post your fabrication requirements with details'
                : 'Find contracts matching your skills',
        },
        {
            step: 3,
            title: userRole === 'company' ? 'Hire Talent' : 'Get Hired',
            description: userRole === 'company'
                ? 'Review applications and hire the best workers'
                : 'Apply to contracts and showcase your expertise',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            Connect Companies with
                            <span className="text-gradient block mt-2">
                                Skilled Fabrication Contractors
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
                            India's premier platform for fabrication contracts. Find work or hire expert contractors for Structural, SS, MS, Piping, Welding, and Maintenance projects.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/post-contract')}
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <span className="flex items-center gap-2">
                                    <Building2 className="w-5 h-5" />
                                    Post Contract (Company)
                                </span>
                            </button>
                            <button
                                onClick={() => navigate('/contracts')}
                                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl border-2 border-blue-600 hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <span className="flex items-center gap-2">
                                    <Briefcase className="w-5 h-5" />
                                    Find Work (Worker)
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white/80 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                                    <stat.icon className="w-8 h-8 text-blue-600" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                        Browse by Category
                    </h2>
                    <p className="text-gray-600 text-center mb-12">
                        Find specialized contractors for your fabrication needs
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {categories.map((category, index) => (
                            <button
                                key={index}
                                onClick={() => navigate('/contracts')}
                                className="bg-white rounded-xl p-6 text-center hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100 group"
                            >
                                <div className="text-4xl mb-3">{category.icon}</div>
                                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-sm text-gray-500">{category.count} contracts</p>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                        How It Works
                    </h2>
                    <p className="text-gray-600 text-center mb-12">
                        Get started in three simple steps
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {howItWorks.map((item, index) => (
                            <div key={index} className="relative">
                                <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">
                                        {item.step}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {item.description}
                                    </p>
                                </div>
                                {index < howItWorks.length - 1 && (
                                    <ArrowRight className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-blue-600 w-8 h-8" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                        Why Choose FabriContract?
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            'Verified contractors and companies',
                            'Secure payment processing',
                            'Real-time messaging',
                            'Contract management tools',
                            'Rating and review system',
                            'Mobile-friendly platform',
                        ].map((feature, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                                <span className="text-gray-700 font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join thousands of companies and workers on FabriContract today
                    </p>
                    <button
                        onClick={() => navigate('/register')}
                        className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Create Free Account
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Home;
