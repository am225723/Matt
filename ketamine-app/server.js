/**
 * Express server for the Ketamine Question Bank Application
 * This allows users to run the application locally with more features
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();

// Port configuration
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));

// Parse JSON bodies
app.use(express.json());

// API endpoint for saving session data (optional server-side storage)
app.post('/api/save-session', (req, res) => {
  try {
    const sessionData = req.body;
    const sessionId = sessionData.metadata?.id || `session_${Date.now()}`;
    
    // Create sessions directory if it doesn't exist
    const sessionsDir = path.join(__dirname, 'sessions');
    if (!fs.existsSync(sessionsDir)) {
      fs.mkdirSync(sessionsDir, { recursive: true });
    }
    
    // Save session data to file
    const filePath = path.join(sessionsDir, `${sessionId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(sessionData, null, 2));
    
    res.status(200).json({ success: true, sessionId });
  } catch (error) {
    console.error('Error saving session:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint for loading session data
app.get('/api/load-session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const filePath = path.join(__dirname, 'sessions', `${sessionId}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    
    const sessionData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.status(200).json({ success: true, sessionData });
  } catch (error) {
    console.error('Error loading session:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint for listing all sessions
app.get('/api/list-sessions', (req, res) => {
  try {
    const sessionsDir = path.join(__dirname, 'sessions');
    
    if (!fs.existsSync(sessionsDir)) {
      fs.mkdirSync(sessionsDir, { recursive: true });
      return res.status(200).json({ success: true, sessions: [] });
    }
    
    const sessionFiles = fs.readdirSync(sessionsDir)
      .filter(file => file.endsWith('.json'));
    
    const sessions = sessionFiles.map(file => {
      try {
        const sessionData = JSON.parse(fs.readFileSync(path.join(sessionsDir, file), 'utf8'));
        return sessionData.metadata || { id: file.replace('.json', '') };
      } catch (error) {
        console.error(`Error reading session file ${file}:`, error);
        return { id: file.replace('.json', ''), error: 'Could not read session data' };
      }
    });
    
    res.status(200).json({ success: true, sessions });
  } catch (error) {
    console.error('Error listing sessions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint for deleting a session
app.delete('/api/delete-session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const filePath = path.join(__dirname, 'sessions', `${sessionId}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    
    fs.unlinkSync(filePath);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Press Ctrl+C to stop the server`);
});