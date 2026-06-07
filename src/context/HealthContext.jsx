import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateMockData } from '../utils/mockData';

const HealthContext = createContext();

export const useHealth = () => useContext(HealthContext);

export const HealthProvider = ({ children }) => {
    const [data, setData] = useState({
        users: [],
        inventory: [],
        appointments: [],
        sirHistory: []
    });

    const [loading, setLoading] = useState(true);

    // Load from LocalStorage or Init Mock
    useEffect(() => {
        const savedData = localStorage.getItem('healthSystemData');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                const mock = generateMockData();

                // DATA PATCH: Ensure inventory items have thresholds from mock if missing or generic
                const patchedInventory = parsed.inventory.map(item => {
                    const mockItem = mock.inventory.find(m => m.id === item.id);
                    // If item is missing threshold or we want to force a sync for this version
                    if (mockItem && (item.threshold === undefined || item.threshold === 20 || item.threshold === 30)) {
                        return { ...item, threshold: mockItem.threshold };
                    }
                    return item;
                });

                setData({ ...parsed, inventory: patchedInventory });
            } catch (e) {
                console.error("Failed to parse saved data", e);
                const mock = generateMockData();
                setData(mock);
            }
        } else {
            const mock = generateMockData();
            setData(mock);
            localStorage.setItem('healthSystemData', JSON.stringify(mock));
        }
        setLoading(false);
    }, []);

    // Sync to LocalStorage whenever data changes
    useEffect(() => {
        if (!loading) {
            localStorage.setItem('healthSystemData', JSON.stringify(data));
        }
    }, [data, loading]);

    const setUsers = (val) => setData(prev => ({ ...prev, users: typeof val === 'function' ? val(prev.users) : val }));
    const setInventory = (val) => setData(prev => ({ ...prev, inventory: typeof val === 'function' ? val(prev.inventory) : val }));
    const setAppointments = (val) => setData(prev => ({ ...prev, appointments: typeof val === 'function' ? val(prev.appointments) : val }));

    const users = data.users;
    const inventory = data.inventory;
    const appointments = data.appointments;
    const sirHistory = data.sirHistory;

    const addAppointment = (appt) => {
        setData(prev => ({ ...prev, appointments: [appt, ...prev.appointments] }));
    };

    const restockItem = (id) => {
        setData(prev => ({
            ...prev,
            inventory: prev.inventory.map(item =>
                item.id === id ? { ...item, stock: item.stock + 10, status: (item.stock + 10) > item.threshold ? 'OK' : 'LOW' } : item
            )
        }));
    };

    const updateStock = (id, newStock) => {
        setData(prev => ({
            ...prev,
            inventory: prev.inventory.map(item =>
                item.id === id ? { ...item, stock: newStock, status: newStock > item.threshold ? 'OK' : 'LOW' } : item
            )
        }));
    };

    const updateThreshold = (id, newThreshold) => {
        setData(prev => ({
            ...prev,
            inventory: prev.inventory.map(item =>
                item.id === id ? {
                    ...item,
                    threshold: newThreshold,
                    status: item.stock > newThreshold ? 'OK' : 'LOW'
                } : item
            )
        }));
    };

    const updateUserStatus = (id, newStatus) => {
        setData(prev => ({
            ...prev,
            users: prev.users.map(user =>
                user.id === id ? { ...user, status: newStatus } : user
            )
        }));
    };

    const resetData = () => {
        localStorage.removeItem('healthSystemData');
        const mock = generateMockData();
        setData(mock);
        window.location.reload();
    }

    // --- NOTIFICATIONS SYSTEM ---
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (loading) return;

        const newNotifs = [];

        // 1. Inventory Low Stock (Faculty Only)
        if (inventory && Array.isArray(inventory)) {
            inventory.forEach(item => {
                if (item.status === 'LOW') {
                    const name = item.name || 'Unknown Item';
                    const stock = item.stock !== undefined ? item.stock : '?';
                    const threshold = item.threshold !== undefined ? item.threshold : '20';

                    newNotifs.push({
                        id: `inv-${item.id}`,
                        type: 'alert',
                        message: `Low Stock: ${name} (${stock}/${threshold})`,
                        module: 'inventory',
                        role: 'faculty'
                    });
                }
            });
        }

        // 2. High Priority Appointments (Faculty Only)
        if (appointments && Array.isArray(appointments)) {
            appointments
                .filter(a => a.priority === 'High' && a.status !== 'Completed')
                .slice(0, 5)
                .forEach(appt => {
                    const symptom = appt.symptom || 'Unknown Symptom';
                    const date = appt.date || 'No Date';

                    newNotifs.push({
                        id: `appt-${appt.id}`,
                        type: 'warning',
                        message: `High Priority: ${symptom} (${date})`,
                        module: 'appointments',
                        role: 'faculty'
                    });
                });
        }

        setNotifications(newNotifs);
    }, [inventory, appointments, loading]);

    // --- AUTONOMY METRICS (SIR DERIVATION) ---
    const totalStudents = users.length || 1;
    const activeInfections = users.filter(u => u.status === 'Infected').length;

    const { beta, gamma } = React.useMemo(() => {
        if (!appointments || appointments.length === 0) return { beta: 0.33, gamma: 0.14 };

        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

        const recentAppointments = appointments.filter(a => new Date(a.date) >= fourteenDaysAgo);

        // Beta (Transmission) Estimation
        const viralCases = recentAppointments.filter(a =>
            ['Viral Flu', 'Common Cold', 'Fever', 'Cough'].includes(a.symptom)
        ).length;
        const estBeta = Math.min(2.0, Math.max(0.1, (viralCases / (totalStudents || 100)) * 5));

        // Gamma (Recovery) Estimation
        const infected = users.filter(u => u.status === 'Infected').length;
        const recovered = users.filter(u => u.status === 'Recovered').length;
        const estGamma = Math.min(1.0, Math.max(0.01, (recovered / (infected || 1)) * 0.05));

        return { beta: estBeta, gamma: estGamma };
    }, [appointments, totalStudents, users]);

    // R0 = Beta / Gamma (Mathematical definition)
    const r0 = (beta / gamma).toFixed(2);

    const toggleTreatment = (appointmentId, medicineId) => {
        setData(prev => {
            const appt = prev.appointments.find(a => a.id === appointmentId);
            if (!appt) return prev;

            const isCompleting = appt.status !== 'Completed';
            const newStatus = isCompleting ? 'Completed' : 'Pending';
            const userStatus = isCompleting ? 'Recovered' : 'Infected';
            const stockChange = isCompleting ? -1 : 1;

            return {
                ...prev,
                // 1. Update Appointment Status
                appointments: prev.appointments.map(a =>
                    a.id === appointmentId ? { ...a, status: newStatus, priority: isCompleting ? 'Low' : a.priority } : a
                ),
                // 2. Update User Health Status
                users: prev.users.map(u => {
                    if (u.email === appt.email) {
                        return { ...u, status: userStatus };
                    }
                    return u;
                }),
                // 3. Update Inventory Stock
                inventory: prev.inventory.map(item => {
                    const medicine = prev.inventory.find(i => i.id === medicineId) || { name: 'Antiviral Pack' };
                    if (item.id === medicineId || item.name === medicine.name) {
                        const newStock = Math.max(0, item.stock + stockChange);
                        return {
                            ...item,
                            stock: newStock,
                            status: newStock > item.threshold ? 'OK' : 'LOW'
                        };
                    }
                    return item;
                })
            };
        });
    };

    const value = {
        users,
        sirHistory,
        inventory,
        appointments,
        notifications,
        activeInfections, // Global Metric
        totalStudents,    // Global Metric
        r0,               // Global Metric
        beta,             // Global Metric (Derived)
        gamma,            // Global Metric (Derived)
        toggleTreatment,  // Action
        addAppointment,
        restockItem,
        updateStock,
        updateThreshold,
        updateUserStatus,
        resetData,
        loading
    };

    if (loading) return <div style={{ color: '#fff', padding: '2rem' }}>Loading System Data...</div>;

    return (
        <HealthContext.Provider value={value}>
            {children}
        </HealthContext.Provider>
    );
};
