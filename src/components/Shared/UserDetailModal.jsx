import React from 'react';
import { X, User, Home, Mail, Activity, Calendar } from 'lucide-react';
import { useHealth } from '../../context/HealthContext';

const UserDetailModal = ({ user, onClose }) => {
    const { appointments } = useHealth();

    if (!user) return null;

    // Filter appointments for this user
    const history = appointments.filter(a => a.email === user.email);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }} onClick={onClose}>
            <div style={{
                background: '#1E1E1E', width: '90%', maxWidth: '700px',
                borderRadius: '16px', padding: '0', overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid #333'
            }} onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #333, #1E1E1E)', display: 'flex', gap: '1.5rem', alignItems: 'center', position: 'relative' }}>
                    {/* Avatar */}
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%', background: '#000',
                        border: '2px solid var(--primary-color)', overflow: 'hidden'
                    }}>
                        <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="Avatar" style={{ width: '100%', height: '100%' }} />
                    </div>

                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#fff' }}>{user.name}</h2>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Mail size={14} /> {user.email}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Home size={14} /> {user.hostel} - {user.room}</span>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                {/* Content Content - Grid Layout */}
                <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>

                    {/* Sidebar: Medical Profile */}
                    <div style={{ fontSize: '0.9rem' }}>
                        <h4 style={{ color: 'var(--primary-color)', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Personal Info</h4>
                        <div style={{ marginBottom: '0.5rem', color: '#888' }}>Branch: <span style={{ color: '#fff' }}>{user.branch || 'CSE'}</span></div>
                        <div style={{ marginBottom: '0.5rem', color: '#888' }}>Batch: <span style={{ color: '#fff' }}>{user.batch || '2024'}</span></div>
                        <div style={{ marginBottom: '0.5rem', color: '#888' }}>Age: <span style={{ color: '#fff' }}>{user.age || '--'}</span></div>
                        <div style={{ marginBottom: '0.5rem', color: '#888' }}>Blood: <span style={{ color: '#fff' }}>{user.bloodGroup || '--'}</span></div>

                        <h4 style={{ color: '#EF4444', marginBottom: '1rem', marginTop: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Medical Profile</h4>
                        <div style={{ marginBottom: '0.5rem', color: '#888' }}>Status:
                            <span style={{ marginLeft: '5px', color: user.status === 'Healthy' ? '#10B981' : '#EF4444' }}>{user.status}</span>
                        </div>
                        <div style={{ marginBottom: '0.5rem', color: '#888' }}>Allergies:
                            <span style={{ marginLeft: '5px', color: '#fff' }}>{user.allergies}</span>
                        </div>
                        <div style={{ marginBottom: '0.5rem', color: '#888' }}>History:
                            <span style={{ marginLeft: '5px', color: '#fff' }}>{user.medicalHistory}</span>
                        </div>

                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #333' }}>
                            <div style={{ color: '#EF4444', fontSize: '0.8rem', fontWeight: 'bold' }}>Emergency Contact</div>
                            <div style={{ color: '#fff' }}>{user.emergencyContact?.name}</div>
                            <div style={{ color: '#888', fontSize: '0.8rem' }}>{user.emergencyContact?.phone}</div>
                        </div>
                    </div>

                    {/* Main: History Table */}
                    <div>
                        <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Activity size={18} color="var(--primary-color)" /> Appointment History
                        </h3>

                        {history.length === 0 ? (
                            <div style={{ color: '#666', fontStyle: 'italic' }}>No medical records found.</div>
                        ) : (
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                    <thead style={{ color: '#888', textAlign: 'left' }}>
                                        <tr>
                                            <th style={{ padding: '0.5rem' }}>Date</th>
                                            <th style={{ padding: '0.5rem' }}>Symptom</th>
                                            <th style={{ padding: '0.5rem' }}>Priority</th>
                                            <th style={{ padding: '0.5rem' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map(appt => (
                                            <tr key={appt.id} style={{ borderBottom: '1px solid #333' }}>
                                                <td style={{ padding: '0.8rem 0.5rem', color: '#ccc' }}>{appt.date}</td>
                                                <td style={{ padding: '0.8rem 0.5rem', fontWeight: 'bold' }}>{appt.symptom}</td>
                                                <td style={{ padding: '0.8rem 0.5rem' }}>
                                                    <span style={{
                                                        padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem',
                                                        background: appt.priority === 'High' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                                        color: appt.priority === 'High' ? '#EF4444' : '#10B981'
                                                    }}>
                                                        {appt.priority}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '0.8rem 0.5rem', color: '#aaa' }}>{appt.status || 'Pending'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailModal;
