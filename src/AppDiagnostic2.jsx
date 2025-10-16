import React, { useState } from 'react';

const AppDiagnostic2 = () => {
  const [view, setView] = useState('test');

  console.log('AppDiagnostic2 rendering, view:', view);

  if (view === 'dashboard') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#1a1a2e',
        color: 'white',
        padding: '40px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Matthew's Playbook</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '40px' }}>Dashboard is rendering!</p>
        <button 
          onClick={() => setView('test')}
          style={{ 
            padding: '15px 30px', 
            fontSize: '1rem',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Back to Test
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Diagnostic Test 2</h1>
      <p>Current view: {view}</p>
      <button 
        onClick={() => setView('dashboard')}
        style={{ 
          padding: '15px 30px', 
          fontSize: '1rem',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Show Dashboard
      </button>
    </div>
  );
};

export default AppDiagnostic2;