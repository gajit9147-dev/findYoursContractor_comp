import React, { useState } from 'react';
import { ChevronDown, Search, HelpCircle, Mail, Phone } from 'lucide-react';

const Help = () => {
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const faqs = [
        {
            category: 'Getting Started',
            questions: [
                {
                    q: 'How do I create an account?',
                    a: 'Click on "Register" in the navigation bar, select your role (Company or Worker), and fill in the required information.',
                },
                {
                    q: 'What is the difference between Company and Worker roles?',
                    a: 'Companies can post contracts and hire workers. Workers can browse contracts, apply, and showcase their skills.',
                },
            ],
        },
        {
            category: 'Posting Contracts',
            questions: [
                {
                    q: 'How do I post a contract?',
                    a: 'After logging in as a Company, click "Post Contract" in the navigation bar and fill in the project details.',
                },
                {
                    q: 'Can I edit a contract after posting?',
                    a: 'Yes, you can edit contract details from your dashboard before applications are received.',
                },
            ],
        },
        {
            category: 'Applying to Contracts',
            questions: [
                {
                    q: 'How do I apply to a contract?',
                    a: 'Browse contracts, click on one that interests you, and click "Apply Now". Make sure your profile is complete.',
                },
                {
                    q: 'Can I track my applications?',
                    a: 'Yes, all your applications are visible in your Worker Dashboard with status updates.',
                },
            ],
        },
        {
            category: 'Account Management',
            questions: [
                {
                    q: 'How do I update my profile?',
                    a: 'Go to "My Profile" from the user menu and click "Edit Profile" to make changes.',
                },
                {
                    q: 'Can I switch between Company and Worker roles?',
                    a: 'Yes, use the "Switch Role" option in your profile dropdown for demo purposes.',
                },
            ],
        },
    ];

    const filteredFaqs = faqs.map(category => ({
        ...category,
        questions: category.questions.filter(
            item =>
                searchQuery === '' ||
                item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.a.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    })).filter(category => category.questions.length > 0);

    const toggleFaq = (categoryIndex, questionIndex) => {
        const key = `${categoryIndex}-${questionIndex}`;
        setExpandedFaq(expandedFaq === key ? null : key);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <HelpCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        How Can We Help You?
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Search our FAQ or contact support
                    </p>
                </div>

                {/* Search */}
                <div className="mb-12">
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for answers..."
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-md"
                        />
                    </div>
                </div>

                {/* FAQs */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {filteredFaqs.map((category, categoryIndex) => (
                            <div key={categoryIndex}>
                                <h3 className="text-lg font-semibold text-blue-600 mb-4">{category.category}</h3>
                                <div className="space-y-3">
                                    {category.questions.map((item, questionIndex) => {
                                        const key = `${categoryIndex}-${questionIndex}`;
                                        const isExpanded = expandedFaq === key;

                                        return (
                                            <div
                                                key={questionIndex}
                                                className="border border-gray-200 rounded-lg overflow-hidden"
                                            >
                                                <button
                                                    onClick={() => toggleFaq(categoryIndex, questionIndex)}
                                                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-all text-left"
                                                >
                                                    <span className="font-semibold text-gray-900">{item.q}</span>
                                                    <ChevronDown
                                                        className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''
                                                            }`}
                                                    />
                                                </button>
                                                {isExpanded && (
                                                    <div className="p-4 bg-white border-t border-gray-200">
                                                        <p className="text-gray-700 leading-relaxed">{item.a}</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredFaqs.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-600">No FAQs found matching your search.</p>
                        </div>
                    )}
                </div>

                {/* Contact Support */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Still Need Help?</h2>
                    <p className="text-gray-600 mb-6">Contact our support team and we'll get back to you as soon as possible.</p>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                            <Mail className="w-8 h-8 text-blue-600" />
                            <div>
                                <p className="font-semibold text-gray-900">Email</p>
                                <p className="text-gray-600">support@fabricontract.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
                            <Phone className="w-8 h-8 text-purple-600" />
                            <div>
                                <p className="font-semibold text-gray-900">Phone</p>
                                <p className="text-gray-600">+91 1800-123-4567</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Your Name"
                                required
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Your Email"
                                required
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <input
                            type="text"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            placeholder="Subject"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Your Message"
                            required
                            rows={5}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                        <button
                            type="submit"
                            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Help;
