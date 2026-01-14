import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import {
    Menu, X, Search, MapPin, ChevronDown, Bell,
    MessageSquare, User, Settings, LogOut, Briefcase
} from 'lucide-react';

/**
 * Main Navbar Component
 * Features:
 * - Responsive design with mobile hamburger menu
 * - Role-based CTA buttons (Company/Worker)
 * - Search functionality with keyword, location, and category filters
 * - User avatar dropdown with profile options
 * - Notification badge
 * - Sticky header with glassmorphism effect
 */
const Navbar = () => {
    const { userRole, toggleRole } = useUser();

    // State management
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
    const [searchData, setSearchData] = useState({
        keyword: '',
        location: '',
        category: 'all'
    });
    const [unreadNotifications] = useState(3); // Mock notification count

    // Refs for click outside detection
    const categoryDropdownRef = useRef(null);
    const avatarDropdownRef = useRef(null);

    // Categories for dropdown
    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'structural', label: 'Structural' },
        { value: 'ss', label: 'Stainless Steel (SS)' },
        { value: 'ms', label: 'Mild Steel (MS)' },
        { value: 'piping', label: 'Piping' },
        { value: 'welding', label: 'Welding' },
        { value: 'maintenance', label: 'Maintenance' }
    ];

    // Handle search submission
    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Search Data:', searchData);
        // You can add navigation or API call here
    };

    // Toggle role for demo purposes
    const handleToggleRole = () => {
        toggleRole();
        setIsAvatarDropdownOpen(false);
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
                setIsCategoryDropdownOpen(false);
            }
            if (avatarDropdownRef.current && !avatarDropdownRef.current.contains(event.target)) {
                setIsAvatarDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close dropdowns on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                setIsCategoryDropdownOpen(false);
                setIsAvatarDropdownOpen(false);
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* LEFT SECTION - Logo & Navigation Links */}
                    <div className="flex items-center space-x-8">
                        {/* Logo */}
                        <NavLink to="/" className="flex items-center space-x-2">
                            <Briefcase className="w-8 h-8 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900">FabriContract</span>
                        </NavLink>

                        {/* Desktop Navigation Links */}
                        <div className="hidden lg:flex items-center space-x-6">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                                    }`
                                }
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/contracts"
                                className={({ isActive }) =>
                                    `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                                    }`
                                }
                            >
                                Contracts
                            </NavLink>
                            <NavLink
                                to="/workers"
                                className={({ isActive }) =>
                                    `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                                    }`
                                }
                            >
                                Workers/Contractors
                            </NavLink>
                        </div>
                    </div>

                    {/* CENTER SECTION - Search Bar (Desktop Only) */}
                    <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
                        <form onSubmit={handleSearch} className="w-full flex items-center gap-2">
                            {/* Keyword Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search contracts..."
                                    value={searchData.keyword}
                                    onChange={(e) => setSearchData({ ...searchData, keyword: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    aria-label="Search contracts by keyword"
                                />
                            </div>

                            {/* Location Input */}
                            <div className="relative w-48">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Location"
                                    value={searchData.location}
                                    onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    aria-label="Search by location"
                                />
                            </div>

                            {/* Category Dropdown */}
                            <div className="relative" ref={categoryDropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    aria-label="Select category"
                                    aria-expanded={isCategoryDropdownOpen}
                                >
                                    {categories.find(cat => cat.value === searchData.category)?.label || 'Category'}
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Category Dropdown Menu */}
                                {isCategoryDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                                        {categories.map((category) => (
                                            <button
                                                key={category.value}
                                                type="button"
                                                onClick={() => {
                                                    setSearchData({ ...searchData, category: category.value });
                                                    setIsCategoryDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${searchData.category === category.value
                                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {category.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Search Button */}
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                                aria-label="Submit search"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {/* RIGHT SECTION - CTA, Icons, User Avatar */}
                    <div className="hidden lg:flex items-center space-x-4">
                        {/* Role Badge */}
                        <span className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full">
                            {userRole === 'company' ? 'Company' : 'Worker'}
                        </span>

                        {/* Primary CTA Button */}
                        <NavLink
                            to={userRole === 'company' ? '/post-contract' : '/create-profile'}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                        >
                            {userRole === 'company' ? 'Post Contract' : 'Create Profile'}
                        </NavLink>

                        {/* Messages Icon */}
                        <NavLink
                            to="/messages"
                            className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Messages"
                        >
                            <MessageSquare className="w-5 h-5" />
                        </NavLink>

                        {/* Notifications Icon */}
                        <NavLink
                            to="/notifications"
                            className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Notifications"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadNotifications > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {unreadNotifications}
                                </span>
                            )}
                        </NavLink>

                        {/* User Avatar & Dropdown */}
                        <div className="relative" ref={avatarDropdownRef}>
                            <button
                                onClick={() => setIsAvatarDropdownOpen(!isAvatarDropdownOpen)}
                                className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="User menu"
                                aria-expanded={isAvatarDropdownOpen}
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    <User className="w-5 h-5" />
                                </div>
                                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isAvatarDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Avatar Dropdown Menu */}
                            {isAvatarDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                                    <NavLink
                                        to="/dashboard"
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        onClick={() => setIsAvatarDropdownOpen(false)}
                                    >
                                        <Briefcase className="w-4 h-4" />
                                        Dashboard
                                    </NavLink>
                                    <NavLink
                                        to="/profile"
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        onClick={() => setIsAvatarDropdownOpen(false)}
                                    >
                                        <User className="w-4 h-4" />
                                        My Profile
                                    </NavLink>
                                    <NavLink
                                        to="/settings"
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        onClick={() => setIsAvatarDropdownOpen(false)}
                                    >
                                        <Settings className="w-4 h-4" />
                                        Settings
                                    </NavLink>
                                    <hr className="my-1 border-gray-200" />
                                    <button
                                        onClick={handleToggleRole}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                                    >
                                        Switch to {userRole === 'company' ? 'Worker' : 'Company'}
                                    </button>
                                    <hr className="my-1 border-gray-200" />
                                    <button
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        onClick={() => console.log('Logout clicked')}
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* MOBILE MENU BUTTON */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Toggle mobile menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* MOBILE MENU */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
                    <div className="px-4 py-6 space-y-4">
                        {/* Mobile Search Form */}
                        <form onSubmit={handleSearch} className="space-y-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search contracts..."
                                    value={searchData.keyword}
                                    onChange={(e) => setSearchData({ ...searchData, keyword: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label="Search contracts by keyword"
                                />
                            </div>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Location"
                                    value={searchData.location}
                                    onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label="Search by location"
                                />
                            </div>
                            <select
                                value={searchData.category}
                                onChange={(e) => setSearchData({ ...searchData, category: e.target.value })}
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="Select category"
                            >
                                {categories.map((category) => (
                                    <option key={category.value} value={category.value}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            >
                                Search
                            </button>
                        </form>

                        {/* Mobile Navigation Links */}
                        <div className="space-y-1 pt-4 border-t border-gray-200">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                                    }`
                                }
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/contracts"
                                className={({ isActive }) =>
                                    `block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                                    }`
                                }
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Contracts
                            </NavLink>
                            <NavLink
                                to="/workers"
                                className={({ isActive }) =>
                                    `block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                                    }`
                                }
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Workers/Contractors
                            </NavLink>
                        </div>

                        {/* Mobile User Section */}
                        <div className="space-y-2 pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between px-4 py-2">
                                <span className="text-sm font-medium text-gray-700">Current Role:</span>
                                <span className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full">
                                    {userRole === 'company' ? 'Company' : 'Worker'}
                                </span>
                            </div>

                            <NavLink
                                to={userRole === 'company' ? '/post-contract' : '/create-profile'}
                                className="block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 text-center transition-all"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {userRole === 'company' ? 'Post Contract' : 'Create Profile'}
                            </NavLink>

                            <NavLink
                                to="/dashboard"
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Briefcase className="w-4 h-4" />
                                Dashboard
                            </NavLink>
                            <NavLink
                                to="/profile"
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <User className="w-4 h-4" />
                                My Profile
                            </NavLink>
                            <NavLink
                                to="/settings"
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Settings className="w-4 h-4" />
                                Settings
                            </NavLink>

                            <button
                                onClick={() => {
                                    handleToggleRole();
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-left"
                            >
                                Switch to {userRole === 'company' ? 'Worker' : 'Company'}
                            </button>

                            <button
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                onClick={() => console.log('Logout clicked')}
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
