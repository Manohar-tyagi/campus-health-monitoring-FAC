import React, { useState } from 'react';
import { LayoutDashboard, Activity, Calendar, Package, Users, LogOut, Bell, X, User } from 'lucide-react';
import { useHealth } from '../../context/HealthContext';

const Sidebar = ({ currentModule, setModule, onLogout, userRole }) => {
    const { notifications } = useHealth();
    const [showNotifs, setShowNotifs] = useState(false);

    const myNotifications = notifications.filter(n => {
        if (userRole === 'faculty') return true;
        return n.role !== 'faculty';
    });

    const unreadCount = myNotifications.length;

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['student', 'faculty'] },
        { id: 'appointments', label: 'Appointments', icon: Calendar, roles: ['student', 'faculty'] },
        { id: 'inventory', label: 'Inventory', icon: Package, roles: ['faculty'] },
        { id: 'users', label: 'Users', icon: Users, roles: ['faculty'] }, // Faculty Only
        { id: 'profile', label: 'My Profile', icon: User, roles: ['student'] }, // Student Only
    ];

    const visibleItems = menuItems.filter(item => item.roles.includes(userRole));

    return (
        <div style={{
            position: 'fixed', left: 0, top: 0, height: '100%', width: '240px',
            background: 'var(--card-bg)', borderRight: '1px solid var(--glass-border)',
            display: 'flex', flexDirection: 'column', padding: '2rem 1rem', zIndex: 100
        }}>
            <div style={{ marginBottom: '2rem', paddingLeft: '1rem', color: '#fff', fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Manohar's App</span>

                {/* Notification Bell */}
                <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowNotifs(!showNotifs)}>
                    <Bell size={20} color="#fff" />
                    {unreadCount > 0 && (
                        <span style={{
                            position: 'absolute', top: -5, right: -5, background: 'red', color: '#fff',
                            fontSize: '0.7rem', width: '16px', height: '16px', borderRadius: '50%',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold'
                        }}>
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}

                    {/* Notification Dropdown */}
                    {showNotifs && (
                        <div style={{
                            position: 'absolute', top: '30px', left: '0', width: '280px',
                            background: '#222', border: '1px solid #444', borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)', zIndex: 200, padding: '0.5rem',
                            maxHeight: '300px', overflowY: 'auto'
                        }} onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid #333' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Notifications</span>
                                <X size={16} onClick={() => setShowNotifs(false)} style={{ cursor: 'pointer' }} />
                            </div>

                            {myNotifications.length === 0 ? (
                                <div style={{ padding: '1rem', color: '#888', textAlign: 'center', fontSize: '0.9rem' }}>No new alerts</div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    {myNotifications.map(n => (
                                        <div key={n.id} onClick={() => { setModule(n.module); setShowNotifs(false); }}
                                            style={{
                                                padding: '0.8rem', borderRadius: '6px', background: '#333', cursor: 'pointer',
                                                borderLeft: `3px solid ${n.type === 'alert' ? '#EF4444' : '#F59E0B'}`
                                            }}>
                                            <div style={{ fontSize: '0.85rem', color: '#fff' }}>{n.message}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentModule === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setModule(item.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '1rem',
                                background: isActive ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                                border: 'none', color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                                padding: '12px 1rem', borderRadius: '8px', transition: 'all 0.2s',
                                textAlign: 'left', fontWeight: isActive ? '600' : '400', fontSize: '0.95rem'
                            }}
                        >
                            <Icon size={20} />
                            {item.label}
                        </button>
                    );
                })}
            </div>

            <div style={{ paddingTop: '1rem', borderTop: '1px solid #333' }}>
                <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'transparent', border: 'none', color: '#666', padding: '12px 1rem', width: '100%' }}>
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
