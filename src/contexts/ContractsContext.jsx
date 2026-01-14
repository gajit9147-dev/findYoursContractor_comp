import React, { createContext, useContext, useState, useEffect } from 'react';

const ContractsContext = createContext();

export const useContracts = () => {
    const context = useContext(ContractsContext);
    if (!context) {
        throw new Error('useContracts must be used within a ContractsProvider');
    }
    return context;
};

// Mock contracts data
const mockContracts = [
    {
        id: 1,
        title: 'Steel Frame Fabrication for Commercial Building',
        description: 'Need experienced structural steel fabricators for a 5-story commercial building project. Must have experience with large-scale projects.',
        category: 'structural',
        budget: 50000,
        deadline: '2026-03-15',
        location: 'Mumbai, Maharashtra',
        company: 'BuildTech Solutions',
        postedDate: '2026-01-10',
        applicants: 12,
        status: 'open',
        drawings: [],
    },
    {
        id: 2,
        title: 'Stainless Steel Piping Installation',
        description: 'Looking for SS piping specialists for pharmaceutical plant. Food-grade SS304 piping work.',
        category: 'piping',
        budget: 35000,
        deadline: '2026-02-28',
        location: 'Pune, Maharashtra',
        company: 'PharmaTech Industries',
        postedDate: '2026-01-12',
        applicants: 8,
        status: 'open',
        drawings: [],
    },
    {
        id: 3,
        title: 'Welding Work for MS Structures',
        description: 'Certified welders needed for mild steel structure fabrication. TIG and MIG welding required.',
        category: 'welding',
        budget: 25000,
        deadline: '2026-02-20',
        location: 'Bangalore, Karnataka',
        company: 'Metro Fabricators',
        postedDate: '2026-01-08',
        applicants: 15,
        status: 'open',
        drawings: [],
    },
    {
        id: 4,
        title: 'Industrial Equipment Maintenance Contract',
        description: 'Long-term maintenance contract for industrial fabrication equipment. Quarterly servicing required.',
        category: 'maintenance',
        budget: 80000,
        deadline: '2026-12-31',
        location: 'Chennai, Tamil Nadu',
        company: 'Industrial Solutions Ltd',
        postedDate: '2026-01-05',
        applicants: 5,
        status: 'open',
        drawings: [],
    },
    {
        id: 5,
        title: 'MS Gate and Railing Fabrication',
        description: 'Residential project requiring decorative MS gates and railings. Design skills preferred.',
        category: 'ms',
        budget: 15000,
        deadline: '2026-02-10',
        location: 'Delhi NCR',
        company: 'Home Designs Co',
        postedDate: '2026-01-13',
        applicants: 20,
        status: 'open',
        drawings: [],
    },
    {
        id: 6,
        title: 'SS Kitchen Equipment Fabrication',
        description: 'Commercial kitchen setup requiring stainless steel tables, shelves, and custom equipment.',
        category: 'ss',
        budget: 40000,
        deadline: '2026-03-01',
        location: 'Hyderabad, Telangana',
        company: 'Hotel Supplies Inc',
        postedDate: '2026-01-11',
        applicants: 10,
        status: 'open',
        drawings: [],
    },
];

export const ContractsProvider = ({ children }) => {
    const [contracts, setContracts] = useState(mockContracts);
    const [filters, setFilters] = useState({
        category: 'all',
        location: '',
        budgetMin: 0,
        budgetMax: 100000,
        deadline: null,
        searchKeyword: '',
    });

    const addContract = (contractData) => {
        const newContract = {
            ...contractData,
            id: contracts.length + 1,
            postedDate: new Date().toISOString().split('T')[0],
            applicants: 0,
            status: 'open',
        };
        setContracts(prev => [newContract, ...prev]);
        return newContract;
    };

    const updateContract = (id, updates) => {
        setContracts(prev =>
            prev.map(contract =>
                contract.id === id ? { ...contract, ...updates } : contract
            )
        );
    };

    const deleteContract = (id) => {
        setContracts(prev => prev.filter(contract => contract.id !== id));
    };

    const applyToContract = (contractId) => {
        updateContract(contractId, {
            applicants: contracts.find(c => c.id === contractId).applicants + 1
        });
    };

    const getFilteredContracts = () => {
        return contracts.filter(contract => {
            // Category filter
            if (filters.category !== 'all' && contract.category !== filters.category) {
                return false;
            }

            // Location filter
            if (filters.location && !contract.location.toLowerCase().includes(filters.location.toLowerCase())) {
                return false;
            }

            // Budget filter
            if (contract.budget < filters.budgetMin || contract.budget > filters.budgetMax) {
                return false;
            }

            // Search keyword
            if (filters.searchKeyword) {
                const keyword = filters.searchKeyword.toLowerCase();
                const searchableText = `${contract.title} ${contract.description} ${contract.company}`.toLowerCase();
                if (!searchableText.includes(keyword)) {
                    return false;
                }
            }

            return true;
        });
    };

    const value = {
        contracts,
        filters,
        setFilters,
        addContract,
        updateContract,
        deleteContract,
        applyToContract,
        getFilteredContracts,
    };

    return <ContractsContext.Provider value={value}>{children}</ContractsContext.Provider>;
};
