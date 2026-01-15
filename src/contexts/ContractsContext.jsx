import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const ContractsContext = createContext();

export const useContracts = () => {
    const context = useContext(ContractsContext);
    if (!context) {
        throw new Error('useContracts must be used within a ContractsProvider');
    }
    return context;
};

export const ContractsProvider = ({ children }) => {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        category: 'all',
        location: '',
        budgetMin: 0,
        budgetMax: 1000000,
        deadline: null,
        searchKeyword: '',
    });

    const fetchContracts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Build query params
            const params = new URLSearchParams();
            if (filters.category !== 'all') params.append('category', filters.category);
            if (filters.location) params.append('city', filters.location);
            if (filters.budgetMin > 0) params.append('budgetMin', filters.budgetMin);
            if (filters.budgetMax < 1000000) params.append('budgetMax', filters.budgetMax);
            if (filters.searchKeyword) params.append('keyword', filters.searchKeyword);

            const response = await api.get(`/contracts?${params.toString()}`);

            // Map backend data to frontend component expectations
            const mappedContracts = response.data.data.contracts.map(c => ({
                id: c._id,
                title: c.title,
                description: c.description,
                category: c.category,
                budget: c.budgetMax, // Using max budget for display
                budgetMin: c.budgetMin,
                budgetMax: c.budgetMax,
                deadline: new Date(c.deadlineDate).toLocaleDateString(),
                location: `${c.locationCity}, ${c.locationState}`,
                company: c.company?.name || 'Unknown Company',
                postedDate: new Date(c.createdAt).toLocaleDateString(),
                applicants: c.applicantCount || 0,
                status: c.status,
                raw: c // Keep original for details if needed
            }));

            setContracts(mappedContracts);
        } catch (err) {
            console.error('Error fetching contracts:', err);
            setError(err.response?.data?.message || 'Failed to fetch contracts');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchContracts();
    }, [fetchContracts]);

    const addContract = async (contractData) => {
        try {
            const response = await api.post('/contracts', contractData);
            await fetchContracts(); // Refresh list
            return { success: true, data: response.data.data };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || 'Failed to create contract'
            };
        }
    };

    const updateContract = async (id, updates) => {
        try {
            await api.patch(`/contracts/${id}`, updates);
            await fetchContracts();
            return { success: true };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || 'Failed to update contract'
            };
        }
    };

    const deleteContract = async (id) => {
        try {
            await api.delete(`/contracts/${id}`);
            await fetchContracts();
            return { success: true };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || 'Failed to delete contract'
            };
        }
    };

    const applyToContract = async (contractId, applicationData) => {
        try {
            await api.post(`/contracts/${contractId}/apply`, applicationData);
            await fetchContracts(); // Refresh to update applicant count
            return { success: true };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || 'Failed to apply'
            };
        }
    };

    const getFilteredContracts = () => {
        // Since the backend handles filtering now via query params in fetchContracts,
        // we just return the contracts we have.
        return contracts;
    };

    const value = {
        contracts,
        loading,
        error,
        filters,
        setFilters,
        addContract,
        updateContract,
        deleteContract,
        applyToContract,
        getFilteredContracts,
        refreshContracts: fetchContracts
    };

    return <ContractsContext.Provider value={value}>{children}</ContractsContext.Provider>;
};
