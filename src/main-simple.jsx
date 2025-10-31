import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  return React.createElement('div', {
    style: { 
      padding: '40px', 
      backgroundColor: '#f0f0f0', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }
  }, [
    React.createElement('h1', { 
      key: 'title',
      style: { color: '#333', fontSize: '2rem', marginBottom: '20px' } 
    }, 'Dashboard Fixed!'),
    React.createElement('p', { 
      key: 'desc',
      style: { color: '#666', fontSize: '1.2rem' } 
    }, 'React is now working without JSX compilation issues.'),
    React.createElement('button', {
      key: 'btn',
      style: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '20px'
      },
      onClick: () => alert('Button works!')
    }, 'Test Button')
  ]);
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(React.createElement(App));
} else {
  document.body.innerHTML = '<h1>Error: Root element not found</h1>';
}