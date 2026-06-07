import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { Search, Plus, Filter } from 'lucide-react';
import BookingModal from '../Shared/BookingModal';

const BookingPortal = ({ user }) => {
    const { appointments, addAppointment, users, toggleTreatment } = useHealth();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterPriority, setFilterPriority] = useState('All');

    // Sort: Most recent first (Date + Time descending)
    const sortedAppointments = [...appointments].sort((a, b) => {
        const dateTimeA = `${a.date}T${a.time}`;
        const dateTimeB = `${b.date}T${b.time}`;
        return dateTimeB.localeCompare(dateTimeA);
    });

    const filteredAppointments = sortedAppointments.filter(appt => {
        const matchesSearch = appt.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appt.symptom.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPriority = filterPriority === 'All' || appt.priority === filterPriority;
        return matchesSearch && matchesPriority;
    });

    const handleAddAppointment = (newAppt) => {
        addAppointment(newAppt);
        setIsModalOpen(false);
    };

    const getRowClass = (appt) => {
        if (appt.status !== 'Completed') return 'glow-row-red';
        return '';
    };

    return (
        <div style={{ padding: '0 2rem', height: '100%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Appointments</h1>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: '#666' }} />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                background: '#333', border: 'none', padding: '10px 10px 10px 40px', borderRadius: '6px', color: '#fff', outline: 'none', width: '250px'
                            }}
                        />
                    </div>

                    <select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                        style={{ padding: '0.8rem', borderRadius: '8px', background: '#333', color: '#fff', border: '1px solid #444' }}
                    >
                        <option value="All">All Priorities</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            background: 'var(--primary-color)', color: '#000', border: 'none',
                            padding: '0.8rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'
                        }}
                    >
                        <Plus size={20} /> Add
                    </button>
                </div>
            </div>

            <div style={{ background: '#1E1E1E', borderRadius: '16px', overflow: 'hidden', border: '1px solid #333' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#252525', textAlign: 'left', color: '#888' }}>
                            <th style={{ padding: '1.2rem', borderBottom: '1px solid #333' }}>Patient</th>
                            <th style={{ padding: '1.2rem', borderBottom: '1px solid #333' }}>Date</th>
                            <th style={{ padding: '1.2rem', borderBottom: '1px solid #333' }}>Time</th>
                            <th style={{ padding: '1.2rem', borderBottom: '1px solid #333' }}>Symptom</th>
                            <th style={{ padding: '1.2rem', borderBottom: '1px solid #333' }}>Priority</th>
                            <th style={{ padding: '1.2rem', borderBottom: '1px solid #333' }}>Status</th>
                            {user?.role === 'faculty' && <th style={{ padding: '1.2rem', borderBottom: '1px solid #333' }}>Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAppointments.map((appt) => (
                            <tr key={appt.id} className={getRowClass(appt)} style={{ borderBottom: '1px solid #2a2a2a' }}>
                                <td style={{ padding: '1.2rem' }}>
                                    <div style={{ fontWeight: '600', color: '#fff' }}>{appt.email.split('@')[0]}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>{appt.email}</div>
                                </td>
                                <td style={{ padding: '1.2rem', color: '#ccc' }}>{appt.date}</td>
                                <td style={{ padding: '1.2rem', color: '#ccc' }}>{appt.time}</td>
                                <td style={{ padding: '1.2rem' }}>{appt.symptom}</td>
                                <td style={{ padding: '1.2rem' }}>
                                    <span style={{
                                        padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500',
                                        background: appt.priority === 'High' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                        color: appt.priority === 'High' ? '#EF4444' : '#10B981'
                                    }}>
                                        {appt.priority}
                                    </span>
                                </td>
                                <td style={{ padding: '1.2rem', color: '#888' }}>{appt.status}</td>
                                {user?.role === 'faculty' && (
                                    <td style={{ padding: '1.2rem' }}>
                                        {appt.status === 'Completed' ? (
                                            <button
                                                onClick={() => toggleTreatment(appt.id, 1)}
                                                style={{
                                                    padding: '6px 12px', borderRadius: '6px', border: '1px solid #EF4444',
                                                    background: 'transparent', color: '#EF4444', cursor: 'pointer',
                                                    fontSize: '0.85rem', fontWeight: 'bold', transition: 'all 0.2s'
                                                }}
                                                onMouseOver={e => { e.target.style.background = '#EF4444'; e.target.style.color = '#fff'; }}
                                                onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = '#EF4444'; }}
                                            >
                                                Revert
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => toggleTreatment(appt.id, 1)}
                                                style={{
                                                    padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--primary-color)',
                                                    background: 'transparent', color: 'var(--primary-color)', cursor: 'pointer',
                                                    fontSize: '0.85rem', fontWeight: 'bold', transition: 'all 0.2s'
                                                }}
                                                onMouseOver={e => { e.target.style.background = 'var(--primary-color)'; e.target.style.color = '#000'; }}
                                                onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--primary-color)'; }}
                                            >
                                                Treat
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleAddAppointment} />
        </div>
    );
};

export default BookingPortal;
