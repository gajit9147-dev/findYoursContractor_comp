import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { ContractsProvider } from './contexts/ContractsContext';
import { WorkersProvider } from './contexts/WorkersContext';
import Navbar from './components/Navbar';

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

function App() {
    return (
        <Router>
            <UserProvider>
                <ContractsProvider>
                    <WorkersProvider>
                        <div className="min-h-screen bg-gray-50">
                            <Navbar />
                            <main className="w-full">
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/contracts" element={<Contracts />} />
                                    <Route path="/workers" element={<Workers />} />
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/profile" element={<Profile />} />
                                    <Route path="/settings" element={<Settings />} />
                                    <Route path="/post-contract" element={<PostContract />} />
                                    <Route path="/create-profile" element={<CreateProfile />} />
                                    <Route path="/messages" element={<Messages />} />
                                    <Route path="/notifications" element={<Notifications />} />
                                    <Route path="/help" element={<Help />} />
                                </Routes>
                            </main>
                        </div>
                    </WorkersProvider>
                </ContractsProvider>
            </UserProvider>
        </Router>
    );
}

export default App;
