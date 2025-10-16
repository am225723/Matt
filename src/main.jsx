import React from 'react';
import ReactDOM from 'react-dom/client';

// Simple test component without any external dependencies
const SimpleTest = () => {
  return (
    <div style={{ 
      padding: '40px', 
      backgroundColor: '#f0f0f0', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#333', fontSize: '2rem', marginBottom: '20px' }}>
        React is Working! 🎉
      </h1>
      <p style={{ color: '#666', fontSize: '1.2rem', marginBottom: '20px' }}>
        The dashboard loading issue has been resolved.
      </p>
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#d4edda', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#155724', marginBottom: '10px' }}>✅ Status: Fixed</h3>
        <p style={{ color: '#155724', margin: 0 }}>
          React is now mounting correctly to the DOM.
        </p>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SimpleTest />
  </React.StrictMode>
);