import React, { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { useHealth } from '../../context/HealthContext';

const BookingModal = ({ isOpen, onClose }) => {
    const { addAppointment } = useHealth();
    const [formData, setFormData] = useState({
        email: '',
        date: '',
        time: '',
        symptom: '',
        priority: '',
        status: ''
    });
    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const today = new Date().toISOString().split('T')[0];

    // Generate 15 min slots from 10:00 to 22:00
    const timeSlots = [];
    for (let h = 10; h <= 22; h++) {
        timeSlots.push(`${h}:00`);
        if (h < 22) {
            timeSlots.push(`${h}:15`);
            timeSlots.push(`${h}:30`);
            timeSlots.push(`${h}:45`);
        }
    }

    const validate = () => {
        const newErrors = {};
        if (!formData.email.endsWith('@st.niituniversity.in')) {
            newErrors.email = 'Must be a valid student email (@st.niituniversity.in)';
        }
        if (formData.symptom.length < 3) {
            newErrors.symptom = 'Symptom description too short (min 3 chars)';
        }
        if (formData.symptom.length > 50) {
            newErrors.symptom = 'Symptom description too long (max 50 chars)';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        addAppointment({
            id: Date.now(),
            ...formData,
            status: 'Scheduled'
        });
        onClose();
        setFormData({ email: '', date: '', time: '', symptom: '', priority: '', status: '' });
        setErrors({});
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div style={{
                background: '#1E1E1E', width: '90%', maxWidth: '500px',
                borderRadius: '12px', padding: '2rem', position: 'relative',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>Book Appointment</h2>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Student Email</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            placeholder="student@st.niituniversity.in"
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: errors.email ? '1px solid #EF4444' : 'none', background: '#333', color: '#fff', outline: 'none' }}
                        />
                        {errors.email && <div style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.email}</div>}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Date</label>
                            <div style={{ position: 'relative' }}>
                                <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#aaa' }} />
                                <input
                                    type="date"
                                    required
                                    min={today}
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: 'none', background: '#333', color: '#fff', outline: 'none' }}
                                />
                            </div>
                        </div>

                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Time</label>
                            <div style={{ position: 'relative' }}>
                                <Clock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#aaa' }} />
                                <select
                                    required
                                    value={formData.time}
                                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                                    style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: 'none', background: '#333', color: '#fff', outline: 'none', appearance: 'none' }}
                                >
                                    <option value="">Select Slot</option>
                                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Symptom</label>
                        <input
                            type="text"
                            required
                            value={formData.symptom}
                            onChange={e => setFormData({ ...formData, symptom: e.target.value })}
                            placeholder="e.g. Mild Fever"
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: errors.symptom ? '1px solid #EF4444' : 'none', background: '#333', color: '#fff', outline: 'none' }}
                        />
                        {errors.symptom && <div style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.symptom}</div>}
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Priority</label>
                        <select
                            required
                            value={formData.priority}
                            onChange={e => setFormData({ ...formData, priority: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#333', color: '#fff', outline: 'none' }}
                        >
                            <option value="">Select Priority</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>
                            Submit
                        </button>
                        <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #555', background: 'transparent', color: '#fff', cursor: 'pointer' }}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
