import React, { createContext, useContext, useState } from 'react';

const WorkersContext = createContext();

export const useWorkers = () => {
    const context = useContext(WorkersContext);
    if (!context) {
        throw new Error('useWorkers must be used within a WorkersContext');
    }
    return context;
};

// Mock workers data
const mockWorkers = [
    {
        id: 1,
        name: 'Rajesh Kumar',
        skills: ['Welding', 'Structural Steel', 'Blueprint Reading'],
        experience: 'expert',
        yearsOfExperience: 12,
        location: 'Mumbai, Maharashtra',
        availability: 'available',
        expertiseArea: 'structural',
        rating: 4.8,
        completedProjects: 45,
        hourlyRate: 800,
        bio: 'Certified structural steel fabricator with extensive experience in commercial projects.',
        certifications: ['AWS D1.1', 'NCCER Welding'],
        portfolio: [],
    },
    {
        id: 2,
        name: 'Amit Patel',
        skills: ['Piping', 'SS Welding', 'Installation'],
        experience: 'intermediate',
        yearsOfExperience: 6,
        location: 'Pune, Maharashtra',
        availability: 'available',
        expertiseArea: 'piping',
        rating: 4.5,
        completedProjects: 28,
        hourlyRate: 600,
        bio: 'Specialized in stainless steel piping for pharmaceutical and food industries.',
        certifications: ['ASME Section IX'],
        portfolio: [],
    },
    {
        id: 3,
        name: 'Suresh Menon',
        skills: ['TIG Welding', 'MIG Welding', 'Quality Inspection'],
        experience: 'expert',
        yearsOfExperience: 15,
        location: 'Bangalore, Karnataka',
        availability: 'busy',
        expertiseArea: 'welding',
        rating: 4.9,
        completedProjects: 67,
        hourlyRate: 900,
        bio: 'Master welder with expertise in precision welding for critical applications.',
        certifications: ['AWS CWI', 'ISO 9606'],
        portfolio: [],
    },
    {
        id: 4,
        name: 'Vikram Singh',
        skills: ['Maintenance', 'Repair', 'Troubleshooting'],
        experience: 'intermediate',
        yearsOfExperience: 8,
        location: 'Chennai, Tamil Nadu',
        availability: 'available',
        expertiseArea: 'maintenance',
        rating: 4.6,
        completedProjects: 35,
        hourlyRate: 650,
        bio: 'Industrial equipment maintenance specialist with preventive maintenance expertise.',
        certifications: ['Industrial Maintenance Technician'],
        portfolio: [],
    },
    {
        id: 5,
        name: 'Deepak Sharma',
        skills: ['MS Fabrication', 'Design', 'Cutting'],
        experience: 'beginner',
        yearsOfExperience: 3,
        location: 'Delhi NCR',
        availability: 'available',
        expertiseArea: 'ms',
        rating: 4.2,
        completedProjects: 15,
        hourlyRate: 450,
        bio: 'Young and enthusiastic MS fabricator with creative design skills.',
        certifications: [],
        portfolio: [],
    },
    {
        id: 6,
        name: 'Mohammed Ali',
        skills: ['SS Fabrication', 'Polishing', 'Installation'],
        experience: 'expert',
        yearsOfExperience: 10,
        location: 'Hyderabad, Telangana',
        availability: 'available',
        expertiseArea: 'ss',
        rating: 4.7,
        completedProjects: 52,
        hourlyRate: 750,
        bio: 'Expert in stainless steel fabrication for commercial kitchens and medical facilities.',
        certifications: ['SS Fabrication Specialist'],
        portfolio: [],
    },
    {
        id: 7,
        name: 'Karthik Reddy',
        skills: ['Structural Analysis', 'Welding', 'Project Management'],
        experience: 'expert',
        yearsOfExperience: 14,
        location: 'Mumbai, Maharashtra',
        availability: 'available',
        expertiseArea: 'structural',
        rating: 4.9,
        completedProjects: 58,
        hourlyRate: 950,
        bio: 'Senior structural fabricator with project management experience.',
        certifications: ['PMP', 'AWS D1.1'],
        portfolio: [],
    },
    {
        id: 8,
        name: 'Ravi Joshi',
        skills: ['Piping Design', 'Installation', 'Testing'],
        experience: 'intermediate',
        yearsOfExperience: 7,
        location: 'Ahmedabad, Gujarat',
        availability: 'busy',
        expertiseArea: 'piping',
        rating: 4.4,
        completedProjects: 30,
        hourlyRate: 620,
        bio: 'Piping specialist with experience in industrial and commercial installations.',
        certifications: ['Piping Designer'],
        portfolio: [],
    },
];

export const WorkersProvider = ({ children }) => {
    const [workers, setWorkers] = useState(mockWorkers);
    const [filters, setFilters] = useState({
        skills: [],
        experience: 'all',
        location: '',
        availability: false,
        expertiseArea: 'all',
        searchKeyword: '',
    });

    const getFilteredWorkers = () => {
        return workers.filter(worker => {
            // Skills filter
            if (filters.skills.length > 0) {
                const hasMatchingSkill = filters.skills.some(skill =>
                    worker.skills.some(ws => ws.toLowerCase().includes(skill.toLowerCase()))
                );
                if (!hasMatchingSkill) return false;
            }

            // Experience filter
            if (filters.experience !== 'all' && worker.experience !== filters.experience) {
                return false;
            }

            // Location filter
            if (filters.location && !worker.location.toLowerCase().includes(filters.location.toLowerCase())) {
                return false;
            }

            // Availability filter
            if (filters.availability && worker.availability !== 'available') {
                return false;
            }

            // Expertise area filter
            if (filters.expertiseArea !== 'all' && worker.expertiseArea !== filters.expertiseArea) {
                return false;
            }

            // Search keyword
            if (filters.searchKeyword) {
                const keyword = filters.searchKeyword.toLowerCase();
                const searchableText = `${worker.name} ${worker.skills.join(' ')} ${worker.bio}`.toLowerCase();
                if (!searchableText.includes(keyword)) {
                    return false;
                }
            }

            return true;
        });
    };

    const updateWorkerProfile = (id, updates) => {
        setWorkers(prev =>
            prev.map(worker =>
                worker.id === id ? { ...worker, ...updates } : worker
            )
        );
    };

    const value = {
        workers,
        filters,
        setFilters,
        getFilteredWorkers,
        updateWorkerProfile,
    };

    return <WorkersContext.Provider value={value}>{children}</WorkersContext.Provider>;
};
