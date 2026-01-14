import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Edit2, Save, X, MapPin, Mail, Phone, Award, Star, Plus, Trash2 } from 'lucide-react';

const Profile = () => {
    const { user, userRole, updateProfile } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || 'John Doe',
        email: user?.email || 'john@example.com',
        phone: user?.phone || '+91 98765 43210',
        location: user?.location || 'Mumbai, Maharashtra',
        bio: user?.bio || 'Experienced professional in fabrication industry',
        // Worker specific
        skills: user?.skills || ['Welding', 'Structural Steel', 'Blueprint Reading'],
        experience: user?.experience || '10 years',
        hourlyRate: user?.hourlyRate || 800,
        certifications: user?.certifications || ['AWS D1.1', 'NCCER Welding'],
        // Company specific
        companyName: user?.companyName || 'BuildTech Solutions',
        gstNumber: user?.gstNumber || 'GST1234567890',
        established: user?.established || '2010',
    });

    const [newSkill, setNewSkill] = useState('');
    const [newCertification, setNewCertification] = useState('');

    const handleSave = () => {
        updateProfile(formData);
        setIsEditing(false);
        alert('Profile updated successfully!');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addSkill = () => {
        if (newSkill.trim()) {
            setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
            setNewSkill('');
        }
    };

    const removeSkill = (index) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index)
        }));
    };

    const addCertification = () => {
        if (newCertification.trim()) {
            setFormData(prev => ({ ...prev, certifications: [...prev.certifications, newCertification.trim()] }));
            setNewCertification('');
        }
    };

    const removeCertification = (index) => {
        setFormData(prev => ({
            ...prev,
            certifications: prev.certifications.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                    <div className="px-8 pb-8">
                        <div className="flex items-end justify-between -mt-16">
                            <div className="flex items-end gap-6">
                                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
                                    {formData.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="mb-4">
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {formData.name}
                                    </h1>
                                    <p className="text-gray-600">{userRole === 'company' ? 'Company' : 'Worker'}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                                className="mb-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                            >
                                {isEditing ? (
                                    <><X className="w-4 h-4" /> Cancel</>
                                ) : (
                                    <><Edit2 className="w-4 h-4" /> Edit Profile</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Worker Profile */}
                {userRole === 'worker' && (
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing && 'bg-gray-50'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing && 'bg-gray-50'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing && 'bg-gray-50'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Experience
                                    </label>
                                    <input
                                        type="text"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing && 'bg-gray-50'}`}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Bio
                                    </label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        rows={3}
                                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${!isEditing && 'bg-gray-50'}`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {formData.skills.map((skill, index) => (
                                    <div key={index} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg font-medium flex items-center gap-2">
                                        {skill}
                                        {isEditing && (
                                            <button onClick={() => removeSkill(index)} className="hover:text-red-600">
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {isEditing && (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                                        placeholder="Add a skill"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <button
                                        onClick={addSkill}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" /> Add
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Certifications */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Award className="w-6 h-6" />
                                Certifications
                            </h2>
                            <div className="space-y-2 mb-4">
                                {formData.certifications.map((cert, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Award className="w-4 h-4 text-blue-600" />
                                            <span className="font-medium text-gray-700">{cert}</span>
                                        </div>
                                        {isEditing && (
                                            <button onClick={() => removeCertification(index)} className="text-red-600 hover:text-red-700">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {isEditing && (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newCertification}
                                        onChange={(e) => setNewCertification(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                                        placeholder="Add a certification"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <button
                                        onClick={addCertification}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" /> Add
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Company Profile */}
                {userRole === 'company' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Company Information</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing && 'bg-gray-50'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        GST Number
                                    </label>
                                    <input
                                        type="text"
                                        name="gstNumber"
                                        value={formData.gstNumber}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing && 'bg-gray-50'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Established
                                    </label>
                                    <input
                                        type="text"
                                        name="established"
                                        value={formData.established}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing && 'bg-gray-50'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing && 'bg-gray-50'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing && 'bg-gray-50'}`}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Address
                                    </label>
                                    <textarea
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        rows={2}
                                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${!isEditing && 'bg-gray-50'}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Save Button */}
                {isEditing && (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <button
                            onClick={handleSave}
                            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md flex items-center justify-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            Save Changes
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
