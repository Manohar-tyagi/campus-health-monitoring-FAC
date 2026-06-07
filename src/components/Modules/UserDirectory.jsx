import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { Search, Filter } from 'lucide-react';
import UserDetailModal from '../Shared/UserDetailModal';

const UserDirectory = () => {
    const { users } = useHealth();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null); // Modal State

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '0 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Users</h1>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: '#666' }} />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                background: '#27272A', border: 'none', padding: '10px 10px 10px 40px', borderRadius: '6px', color: '#fff', outline: 'none', width: '300px'
                            }}
                        />
                    </div>

                    <button style={{
                        background: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)',
                        padding: '0.5rem 1rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}>
                        <Filter size={18} /> Filters
                    </button>
                </div>
            </div>

            <div style={{ border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#1E1E1E', color: '#888', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                            <th style={{ padding: '1rem' }}>Name</th>
                            <th style={{ padding: '1rem' }}>Email</th>
                            <th style={{ padding: '1rem' }}>Role</th>
                            <th style={{ padding: '1rem' }}>Hostel</th>
                            <th style={{ padding: '1rem' }}>Room</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, idx) => (
                            <tr
                                key={user.id}
                                onClick={() => setSelectedUser(user)} // Open Modal
                                style={{
                                    borderBottom: '1px solid #222',
                                    background: idx % 2 === 0 ? 'transparent' : '#181818',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#222'}
                                onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : '#181818'}
                            >
                                <td style={{ padding: '1rem', fontWeight: '600' }}>{user.name}</td>
                                <td style={{ padding: '1rem', color: '#aaa' }}>{user.email}</td>
                                <td style={{ padding: '1rem' }}>{user.role}</td>
                                <td style={{ padding: '1rem' }}>{user.hostel}</td>
                                <td style={{ padding: '1rem' }}>{user.room}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        color: user.status === 'Healthy' ? 'var(--primary-color)' : (user.status === 'Infected' ? '#EF4444' : '#3B82F6'),
                                        fontWeight: 'bold',
                                        background: user.status === 'Healthy' ? 'rgba(245, 158, 11, 0.1)' : (user.status === 'Infected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'),
                                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem'
                                    }}>
                                        {user.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Profile Modal */}
            <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
        </div>
    );
};

export default UserDirectory;
