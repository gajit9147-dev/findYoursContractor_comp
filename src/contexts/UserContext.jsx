import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState('worker'); // 'worker' or 'company'

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('fabricontract_user');
        const storedRole = localStorage.getItem('fabricontract_role');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
        if (storedRole) {
            setUserRole(storedRole);
        }
    }, []);

    // Save to localStorage whenever user changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('fabricontract_user', JSON.stringify(user));
            localStorage.setItem('fabricontract_role', userRole);
        }
    }, [user, userRole]);

    const login = (userData, role = 'worker') => {
        setUser(userData);
        setUserRole(role);
        setIsAuthenticated(true);
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('fabricontract_user');
        localStorage.removeItem('fabricontract_role');
    };

    const toggleRole = () => {
        const newRole = userRole === 'worker' ? 'company' : 'worker';
        setUserRole(newRole);
        localStorage.setItem('fabricontract_role', newRole);
    };

    const updateProfile = (profileData) => {
        setUser(prev => ({ ...prev, ...profileData }));
    };

    const value = {
        user,
        isAuthenticated,
        userRole,
        login,
        logout,
        toggleRole,
        updateProfile,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
