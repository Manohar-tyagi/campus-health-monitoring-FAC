import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Activity, Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { useHealth } from '../../context/HealthContext'; // Assuming HealthContext is in a separate file

const SIRSimulation = () => {
    const { activeInfections, totalStudents, appointments, users, beta, gamma, r0 } = useHealth(); // Auto-Link from Context

    const [data, setData] = useState([]);

    // Auto-Link: Use Real Data
    const N = totalStudents || 1000;
    const initialI = activeInfections || 10;
    const initialR = users.filter(u => u.status === 'Recovered').length; // Link to real recovered
    const initialS = N - initialI - initialR;

    // 2. Math Engine: R0 Calculation (Synced with Context)
    const R0 = r0;

    // Determine Status Color based on R0
    const getStatusColor = () => {
        if (R0 < 1.0) return '#10B981'; // Green
        if (R0 < 2.0) return '#F59E0B'; // Yellow
        return '#EF4444'; // Red
    };

    // 3. Math Engine: Final Size Calculation (Transcendental Equation)
    // ln(S_inf/S0) = R0 * (S_inf/N - 1)
    // We solve for s = S_inf/N using iteration: s = exp(R0 * (s - 1))
    const finalSize = useMemo(() => {
        if (r0 <= 1) return initialI + initialR;

        const R0_num = parseFloat(r0);
        let s = 0.5; // Initial guess
        for (let i = 0; i < 100; i++) {
            const nextS = Math.exp(R0_num * (s - 1));
            if (Math.abs(nextS - s) < 0.0001) {
                s = nextS;
                break;
            }
            s = nextS;
        }

        const S_inf = s * N;
        const totalInfected = N - S_inf;
        return Math.round(totalInfected);
    }, [r0, N, initialI, initialR]);

    const showWarning = r0 > 1.1;

    // 4. Math Engine: Euler's Method Simulation (30 Days) + Ghost Line
    useEffect(() => {
        let S = initialS;
        let I = initialI;
        let R = initialR;

        // Calculate initial derivative for Ghost Line (dI/dt at t=0)
        const dIdt_initial = ((beta * initialS * initialI) / N - (gamma * initialI));

        const simulationData = [];

        for (let t = 0; t <= 30; t++) {
            // Ghost Line: Linear Projection for first 7 days
            let projectedI = null;
            if (t <= 7) {
                projectedI = initialI + (dIdt_initial * t);
                if (projectedI < 0) projectedI = 0;
                if (projectedI > N) projectedI = N;
            }

            simulationData.push({
                day: t,
                Susceptible: Math.round(S),
                Infected: Math.round(I),
                Recovered: Math.round(R),
                Predicted: projectedI !== null ? Math.round(projectedI) : null // Ghost Line
            });

            // Differential Equations
            // dS/dt = - (beta * S * I) / N
            const dS = - (beta * S * I) / N;
            // dI/dt = (beta * S * I) / N - (gamma * I)
            const dI = (beta * S * I) / N - (gamma * I);
            // dR/dt = gamma * I
            const dR = gamma * I;

            // Euler Integration
            S += dS;
            I += dI;
            R += dR;
        }
        setData(simulationData);
    }, [beta, gamma, initialI, initialS, N, initialR]); // Re-run when real data changes!

    // 5. Growth Velocity (First Derivative dI/dt at t=0)
    const velocity = ((beta * initialS * initialI) / N - (gamma * initialI)).toFixed(2);
    const isAccelerating = velocity > 0;

    return (
        <div style={{
            background: '#1E1E1E', borderRadius: '16px', padding: '2rem',
            border: '1px solid #333', color: '#fff'
        }}>
            {/* High Risk Prediction Banner */}
            {showWarning && (
                <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid #EF4444',
                    borderRadius: '12px',
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    animation: r0 > 1.5 ? 'pulse-red 2s infinite' : 'none'
                }}>
                    <Zap color="#EF4444" size={24} />
                    <div>
                        <div style={{ color: '#EF4444', fontWeight: 'bold', fontSize: '1rem' }}>
                            CRITICAL PREDICTION: High Outbreak Risk
                        </div>
                        <div style={{ color: '#ccc', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                            Based on current transmission ({beta.toFixed(2)}) and recovery rates ({gamma.toFixed(2)}),
                            approximately <span style={{ color: '#fff', fontWeight: 'bold' }}>{finalSize} students</span> are estimated to be infected if no remedial action is taken.
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity color="#F59E0B" /> Outbreak Simulation
                </h2>
                <div style={{ fontSize: '0.9rem', color: '#888' }}>
                    Mathematical Prediction (30 Days)
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>

                {/* Control Panel (Now Read-Only Derived Metrics) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    <div style={{ background: '#252525', padding: '1rem', borderRadius: '12px', border: '1px solid #333' }}>
                        <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>Transmission (β)</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#F59E0B' }}>
                            {beta.toFixed(3)}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.3rem' }}>Derived from viral trends</div>
                    </div>

                    <div style={{ background: '#252525', padding: '1rem', borderRadius: '12px', border: '1px solid #333' }}>
                        <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>Recovery (γ)</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10B981' }}>
                            {gamma.toFixed(3)}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.3rem' }}>Derived from system stats</div>
                    </div>

                    {/* KPIs */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>

                        {/* R0 Meter */}
                        <div style={{
                            background: '#252525', padding: '1rem', borderRadius: '12px', border: '1px solid #333',
                            textAlign: 'center', boxShadow: `0 0 20px ${getStatusColor()}20`,
                            borderBottom: `4px solid ${getStatusColor()}`
                        }}>
                            <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>R₀ Value</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: getStatusColor() }}>{R0}</div>
                            <div style={{ fontSize: '0.65rem', color: '#666', marginTop: '0.5rem', lineHeight: '1.2' }}>
                                Average secondary infections. R₀ &gt; 1 indicates growth.
                            </div>
                        </div>

                        {/* Velocity Dial */}
                        <div style={{
                            background: '#252525', padding: '1rem', borderRadius: '12px', border: '1px solid #333',
                            textAlign: 'center', position: 'relative'
                        }}>
                            <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>Velocity</div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                {isAccelerating ? <TrendingUp color="#EF4444" size={24} /> : <TrendingDown color="#10B981" size={24} />}
                                <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: isAccelerating ? '#EF4444' : '#10B981' }}>{velocity}</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Chart */}
                <div style={{ height: '350px', background: '#121212', borderRadius: '12px', padding: '1rem', border: '1px solid #333' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="day" stroke="#666" tick={{ fill: '#666' }} />
                            <YAxis stroke="#666" tick={{ fill: '#666' }} />
                            <Tooltip
                                contentStyle={{ background: '#1E1E1E', border: '1px solid #333', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '10px' }} />

                            {/* Susceptible - GOLD (Theme) */}
                            <Line
                                type="monotone" dataKey="Susceptible"
                                stroke="#F59E0B" strokeWidth={2} dot={false}
                                name="Susceptible"
                                style={{ filter: 'drop-shadow(0 0 4px #F59E0B)' }}
                            />

                            {/* Infected - RED (Danger) */}
                            <Line
                                type="monotone" dataKey="Infected"
                                stroke="#EF4444" strokeWidth={3} dot={false}
                                name="Infected"
                                style={{ filter: 'drop-shadow(0 0 8px #EF4444)' }}
                            />

                            {/* Ghost Line (Prediction) - Dashed White */}
                            <Line
                                type="monotone" dataKey="Predicted"
                                stroke="#fff" strokeWidth={2} dot={false} strokeDasharray="5 5"
                                name="7-Day Projection"
                                style={{ opacity: 0.5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default SIRSimulation;
