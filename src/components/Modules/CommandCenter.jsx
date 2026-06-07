import React, { useMemo, useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { Users, Activity, AlertTriangle, PlusCircle, Search, TrendingUp, Package } from 'lucide-react';
import SIRSimulation from './SIRSimulation';
import BookingModal from '../Shared/BookingModal';

const CommandCenter = ({ user }) => {
    const [showModal, setShowModal] = useState(false);

    // --- AI INSIGHTS LOGIC ---
    const {
        users, inventory, appointments, sirHistory, notifications,
        totalStudents, activeInfections, r0 // Autonomy Metrics
    } = useHealth();

    // AI Prediction Logic (Viral)
    const outbreakAlert = useMemo(() => {
        if (!appointments || !users) return [];

        const counts = {};
        appointments.forEach(appt => {
            if (appt.status !== 'Completed') {
                const student = users.find(u => u.email === appt.email);
                if (student) {
                    const key = `${student.hostel}|${appt.symptom}`; // "H1|Fever"
                    counts[key] = (counts[key] || 0) + 1;
                }
            }
        });

        const leaks = [];
        const viralSymptoms = ['Viral Flu', 'Common Cold', 'Fever', 'Cough', 'Sore Throat'];

        Object.entries(counts).forEach(([key, count]) => {
            const [hostel, symptom] = key.split('|');
            // Filter: Must be Viral + Count >= 20
            if (count >= 20 && viralSymptoms.includes(symptom)) {
                leaks.push({ hostel, symptom, count });
            }
        });
        return leaks;
    }, [appointments, users]);

    const getR0Color = () => {
        if (r0 < 1.0) return '#10B981';
        if (r0 < 2.0) return '#F59E0B';
        return '#EF4444';
    };

    const getPulseClass = () => {
        if (r0 >= 2.0) return 'pulse-card-red'; // Fast pulse
        if (r0 >= 1.0) return 'pulse-card-green'; // Slow pulse
        return '';
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto', height: '100%', overflowY: 'auto' }}>

            {/* AI Alert Banner */}
            {outbreakAlert.map((alert, idx) => (
                <div key={idx} style={{
                    background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #EF4444',
                    color: '#EF4444', padding: '1rem', borderRadius: '12px', marginBottom: '2rem',
                    display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 'bold'
                }}>
                    <AlertTriangle />
                    POTENTIAL OUTBREAK WARNING: Cluster of {alert.count} cases of {alert.symptom} detected in {alert.hostel}.
                </div>
            ))}

            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #F59E0B, #ff0055)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Command Center
                </h1>
                <p style={{ color: '#888' }}>Real-time Campus Health Monitoring</p>
            </header>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Metric Cards */}
                <div style={{ background: '#1E1E1E', padding: '1.5rem', borderRadius: '16px', border: '1px solid #333' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ color: '#888', fontSize: '0.9rem' }}>Total Students</p>
                            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{totalStudents}</h2>
                        </div>
                        <Users color="var(--primary-color)" />
                    </div>
                </div>

                <div style={{ background: '#1E1E1E', padding: '1.5rem', borderRadius: '16px', border: '1px solid #333' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ color: '#888', fontSize: '0.9rem' }}>Active Infections</p>
                            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0', color: '#EF4444' }}>{activeInfections}</h2>
                        </div>
                        <Activity color="#EF4444" />
                    </div>
                </div>

                {/* Dynamic R0 Card with Pulse */}
                <div className={getPulseClass()} style={{
                    background: '#1E1E1E', padding: '1.5rem', borderRadius: '16px', border: '1px solid #333',
                    borderBottom: `4px solid ${getR0Color()}`, transition: 'all 0.3s'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ color: '#888', fontSize: '0.9rem' }}>R₀ (Transmission)</p>
                            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0', color: getR0Color() }}>{r0}</h2>
                            <p style={{ fontSize: '0.7rem', color: '#666', margin: 0 }}>Basic Reproduction Number: Cases per infection</p>
                        </div>
                        <TrendingUp color={getR0Color()} />
                    </div>
                </div>

            </div>

            {/* Book Appointment Button */}
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <button
                    onClick={() => setShowModal(true)}
                    style={{
                        background: 'var(--primary-color)',
                        color: '#000',
                        border: 'none',
                        padding: '1rem 2rem',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        boxShadow: '0 4px 15px rgba(245, 158, 11, 0.2)',
                        cursor: 'pointer',
                        margin: '0 auto',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.4)';
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.2)';
                    }}>
                    <PlusCircle size={20} />
                    Book Appointment
                </button>
            </div>

            {/* 4. Incoming Patients */}
            <div style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Incoming Patients</h2>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#666' }} />
                        <input type="text" placeholder="Search" style={{
                            background: '#333', border: 'none', padding: '10px 10px 10px 35px', borderRadius: '6px', color: '#fff', outline: 'none'
                        }} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {['Headache', 'Skin Allergy', 'Eye Infection', 'Migraine', 'Stomach Ache', 'Sprain'].map((symptom, i) => (
                        <div key={i} style={{ background: '#1E1E1E', padding: '1.5rem', borderRadius: '12px' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'uppercase', color: i < 3 ? '#888' : '#F59E0B' }}>
                                {i < 3 ? 'LOW' : 'MEDIUM'}
                            </div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{symptom}</div>
                            <div style={{ color: '#666', fontSize: '0.9rem' }}>{i < 3 ? 'Low' : 'Medium'}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 5. Viral Peak Prediction */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Viral Peak Prediction</h2>
                <SIRSimulation />
            </div>

            <BookingModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
};

export default CommandCenter;
