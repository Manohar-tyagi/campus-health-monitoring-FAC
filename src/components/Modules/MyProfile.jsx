import React from 'react';
import { useHealth } from '../../context/HealthContext';
import { User, Mail, Home, Activity, Calendar } from 'lucide-react';

const MyProfile = ({ user }) => {
    const { appointments } = useHealth();

    if (!user) return <div style={{ padding: '2rem', color: '#fff' }}>User not found.</div>;

    // Filter history for currently logged in student
    const history = appointments.filter(a => a.email === user.email);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '2rem' }}>My Profile</h1>

            {/* User Info Card */}
            <div style={{
                background: 'linear-gradient(135deg, #1E1E1E 0%, #252525 100%)',
                borderRadius: '16px', padding: '2rem', marginBottom: '2rem',
                border: '1px solid #333', boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                display: 'flex', alignItems: 'center', gap: '2rem'
            }}>
                {/* Avatar */}
                <div style={{
                    width: '120px', height: '120px', borderRadius: '50%', background: '#333',
                    overflow: 'hidden', border: '4px solid var(--primary-color)'
                }}>
                    <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '2rem', color: '#fff' }}>{user.name}</h2>

                        {/* Academic Info */}
                        <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
                            <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                {user.branch || 'CSE'}
                            </span>
                            <span style={{ background: '#333', color: '#ccc', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                                Batch {user.batch || '2024'}
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#aaa' }}>
                                <Mail size={16} /> {user.email}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#aaa' }}>
                                <Home size={16} /> {user.hostel} - {user.room}
                            </div>

                            <div style={{ color: '#aaa' }}>Age: <span style={{ color: '#fff' }}>{user.age || '--'}</span></div>
                            <div style={{ color: '#aaa' }}>Blood Group: <span style={{ color: '#EF4444', fontWeight: 'bold' }}>{user.bloodGroup || '--'}</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>

                {/* Medical Profile Card */}
                <div style={{ background: '#1E1E1E', borderRadius: '16px', padding: '1.5rem', border: '1px solid #333', height: 'fit-content' }}>
                    <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Activity size={18} color="#EF4444" /> Medical Profile
                    </h3>

                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.2rem' }}>Status</div>
                        <span style={{
                            color: user.status === 'Healthy' ? '#10B981' : '#EF4444',
                            fontWeight: 'bold', background: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: '4px'
                        }}>
                            {user.status}
                        </span>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.2rem' }}>Allergies</div>
                        <div style={{ color: '#fff', fontWeight: '500' }}>
                            {user.allergies !== 'None' ? (
                                <span style={{ color: '#EF4444' }}>{user.allergies}</span>
                            ) : 'None'}
                        </div>
                    </div>

                    <div>
                        <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.2rem' }}>History</div>
                        <div style={{ color: '#fff' }}>{user.medicalHistory || 'None'}</div>
                    </div>

                    {/* Emergency Contact */}
                    <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #333' }}>
                        <div style={{ fontSize: '0.85rem', color: '#EF4444', marginBottom: '0.5rem', fontWeight: 'bold' }}>Emergency Contact</div>
                        <div style={{ fontWeight: '500', color: '#ddd' }}>{user.emergencyContact?.name || 'Parent'}</div>
                        <div style={{ color: '#888', fontSize: '0.9rem' }}>{user.emergencyContact?.phone || '--'}</div>
                    </div>
                </div>

                {/* Medical History Table */}
                <div style={{ background: '#1E1E1E', borderRadius: '16px', padding: '1.5rem', border: '1px solid #333' }}>
                    <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={20} color="var(--primary-color)" /> Appointment History
                    </h3>

                    {history.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#666', fontStyle: 'italic' }}>
                            No appointment records found.
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                                <thead>
                                    <tr style={{ background: '#121212', color: '#888', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                                        <th style={{ padding: '1rem', borderRadius: '8px 0 0 8px' }}>Date</th>
                                        <th style={{ padding: '1rem' }}>Time</th>
                                        <th style={{ padding: '1rem' }}>Symptom</th>
                                        <th style={{ padding: '1rem' }}>Priority</th>
                                        <th style={{ padding: '1rem', borderRadius: '0 8px 8px 0' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody style={{ marginTop: '0.5rem' }}>
                                    {history.map((appt, idx) => (
                                        <tr key={appt.id} style={{ borderBottom: '1px solid #2a2a2a' }}>
                                            <td style={{ padding: '1.2rem 1rem', color: '#ccc' }}>{appt.date}</td>
                                            <td style={{ padding: '1.2rem 1rem', color: '#888' }}>{appt.time || '-'}</td>
                                            <td style={{ padding: '1.2rem 1rem', fontWeight: '600' }}>{appt.symptom}</td>
                                            <td style={{ padding: '1.2rem 1rem' }}>
                                                <span style={{
                                                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem',
                                                    background: appt.priority === 'High' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                                    color: appt.priority === 'High' ? '#EF4444' : '#10B981'
                                                }}>
                                                    {appt.priority}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1.2rem 1rem', color: '#aaa' }}>{appt.status || 'Pending'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
