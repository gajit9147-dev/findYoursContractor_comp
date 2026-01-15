import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { ContractsProvider } from './contexts/ContractsContext';
import { WorkersProvider } from './contexts/WorkersContext';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Page Components
import Home from './pages/Home';
import Contracts from './pages/Contracts';
import Workers from './pages/Workers';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import PostContract from './pages/PostContract';
import CreateProfile from './pages/CreateProfile';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Help from './pages/Help';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './pages/AuthCallback';

// Component to conditionally show Navbar
const Layout = ({ children }) => {
    const location = useLocation();
    const hideNavbarPaths = ['/login', '/register'];
    const showNavbar = !hideNavbarPaths.includes(location.pathname);

    return (
        <div className="min-h-screen bg-gray-50">
            {showNavbar && <Navbar />}
            <main className="w-full">
                {children}
            </main>
        </div>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <UserProvider>
                    <ContractsProvider>
                        <WorkersProvider>
                            <Layout>
                                <Routes>
                                    {/* Public Routes */}
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/auth/callback" element={<AuthCallback />} />
                                    <Route path="/" element={<Home />} />

                                    {/* Protected Routes */}
                                    <Route path="/contracts" element={
                                        <ProtectedRoute>
                                            <Contracts />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/workers" element={
                                        <ProtectedRoute>
                                            <Workers />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/dashboard" element={
                                        <ProtectedRoute>
                                            <Dashboard />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/profile" element={
                                        <ProtectedRoute>
                                            <Profile />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/settings" element={
                                        <ProtectedRoute>
                                            <Settings />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/post-contract" element={
                                        <ProtectedRoute>
                                            <PostContract />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/create-profile" element={
                                        <ProtectedRoute>
                                            <CreateProfile />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/messages" element={
                                        <ProtectedRoute>
                                            <Messages />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/notifications" element={
                                        <ProtectedRoute>
                                            <Notifications />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/help" element={
                                        <ProtectedRoute>
                                            <Help />
                                        </ProtectedRoute>
                                    } />
                                </Routes>
                            </Layout>
                        </WorkersProvider>
                    </ContractsProvider>
                </UserProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;

