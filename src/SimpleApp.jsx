import React, { useState } from 'react';

const SimpleApp = () => {
  const [view, setView] = useState('dashboard');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', marginBottom: '1rem' }}>Matthew's Playbook</h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>Dashboard Loading Test - Fixed!</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <button 
            style={{ backgroundColor: '#3b82f6', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
            onClick={() => setView('test1')}
          >
            Test Button 1
          </button>
          <button 
            style={{ backgroundColor: '#10b981', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
            onClick={() => setView('test2')}
          >
            Test Button 2
          </button>
        </div>
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#888' }}>Current view: {view}</p>
      </div>
    </div>
  );
};

export default SimpleApp;