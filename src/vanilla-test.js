// Pure vanilla JavaScript test
console.log('Vanilla JS script loaded');

const root = document.getElementById('root');
console.log('Root element found:', root);

if (root) {
  root.innerHTML = `
    <div style="padding: 40px; background-color: #f0f0f0; min-height: 100vh; font-family: Arial, sans-serif;">
      <h1 style="color: #333; font-size: 2rem; margin-bottom: 20px;">Vanilla JS Works!</h1>
      <p style="color: #666; font-size: 1.2rem; margin-bottom: 20px;">This proves JavaScript execution is working.</p>
      <button onclick="alert('Button clicked!')" style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Test Button
      </button>
      <div style="margin-top: 20px; padding: 20px; background-color: #e9ecef; border-radius: 4px;">
        <h3>Diagnostic Info:</h3>
        <p>Current time: ${new Date().toLocaleString()}</p>
        <p>User agent: ${navigator.userAgent}</p>
      </div>
    </div>
  `;
  console.log('Content injected successfully');
} else {
  console.error('Root element not found!');
  document.body.innerHTML = '<h1 style="color: red;">ERROR: Root element not found!</h1>';
}