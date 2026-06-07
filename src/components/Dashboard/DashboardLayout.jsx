import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import CommandCenter from '../Modules/CommandCenter';
import SIRSimulation from '../Modules/SIRSimulation';
import BookingPortal from '../Modules/BookingPortal';
import Inventory from '../Modules/Inventory';
import UserDirectory from '../Modules/UserDirectory';
import MyProfile from '../Modules/MyProfile';
import '../Modules/Pulse.css';

const DashboardLayout = ({ user, onLogout }) => {
    const [currentModule, setCurrentModule] = useState('dashboard');

    // If a student tries to access inventory (e.g. from previous state), reset to dashboard
    useEffect(() => {
        if (user.role === 'student' && currentModule === 'inventory') {
            setCurrentModule('dashboard');
        }
    }, [user.role, currentModule]);

    const renderModule = () => {
        switch (currentModule) {
            case 'dashboard': return <CommandCenter user={user} />;
            case 'sir': return <SIRSimulation />;
            case 'appointments': return <BookingPortal user={user} />;
            // Only render Inventory if faculty
            case 'inventory': return user.role === 'faculty' ? <Inventory /> : <div style={{ padding: '2rem' }}>Access Denied</div>;
            case 'users': return <UserDirectory />;
            case 'profile': return <MyProfile user={user} />;
            default: return <CommandCenter />;
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
            <Sidebar
                currentModule={currentModule}
                setModule={setCurrentModule}
                onLogout={onLogout}
                userRole={user.role}
            />

            <main style={{
                marginLeft: '240px',
                flex: 1,
                padding: '0',
                width: 'calc(100% - 240px)',
                background: 'var(--bg-color)'
            }}>
                <div className="module-container" style={{ padding: '2rem' }}>
                    {renderModule()}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
