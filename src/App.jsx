import React, { useState } from 'react';

function App() {
  const [role, setRole] = useState('STUDENT'); // Role-Based state

  return (
    <div style={{ backgroundColor: '#0b0f19', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ borderBottom: '1px solid #1e293b', paddingBottom: '25px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ color: '#38bdf8', margin: 0 }}>AEgis Health Dashboard</h1>
          <p style={{ color: '#94a3b8', margin: '5px 0 0 0' }}>The Digital Synapse for Campus Wellness</p>
        </div>
        <div>
          <label style={{ marginRight: '10px', color: '#94a3b8' }}>Switch View: </label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            style={{ padding: '8px', borderRadius: '5px', background: '#1e293b', color: '#fff', border: '1px solid #38bdf8' }}
          >
            <option value="STUDENT">Student View</option>
            <option value="ADMIN">Faculty / Admin View</option>
          </select>
        </div>
      </header>

      <main style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {/* Core Block: Accessible to Everyone */}
        <div style={{ background: '#111827', padding: '20px', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <h3 style={{ color: '#38bdf8' }}>1: Foundations</h3>
          <p>Chronological Student Medical Records (Linked List Storage)</p>
        </div>

        {/* Core Block: Accessible to Everyone */}
        <div style={{ background: '#111827', padding: '20px', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <h3 style={{ color: '#38bdf8' }}>2: Appointment Flow</h3>
          <p>Active Clinic Booking Status (Circular Queue Logic)</p>
        </div>

        {/* Admin-Only Conditional Rendering Block */}
        {role === 'ADMIN' ? (
          <>
            <div style={{ background: '#111827', padding: '20px', borderRadius: '8px', border: '1px solid #f43f5e', boxShadow: '0 0 10px rgba(244, 63, 94, 0.2)' }}>
              <h3 style={{ color: '#f43f5e' }}>3: Operational Logic (Admin)</h3>
              <p>Pharmacy Inventory Alerts (Priority Queues & Stacks)</p>
            </div>
            
            <div style={{ background: '#111827', padding: '20px', borderRadius: '8px', border: '1px solid #f43f5e', boxShadow: '0 0 10px rgba(244, 63, 94, 0.2)' }}>
              <h3 style={{ color: '#f43f5e' }}>4: Predictive Analytics (Admin)</h3>
              <p>Epidemic SIR Forecasting Model & Contact Tracing Graphs</p>
            </div>
          </>
        ) : (
          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', border: '1px dashed #475569' }}>
            <p>🔒 Admin modules hidden. Elevate role to view inventory & SIR models.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
