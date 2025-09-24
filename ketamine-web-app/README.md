# Ketamine Question Bank - Web Version

A simple, browser-based application for ketamine therapy reflection that requires no installation. Just open the HTML file and start using it immediately.

## Features

- **Instant Access**: No installation required - just open the HTML file in any modern browser
- **Randomized Questions**: Select from a curated list of reflection questions designed for ketamine therapy
- **Audio Recording**: Record your spoken responses (if your browser supports it)
- **Manual Response Entry**: Type your responses directly if you prefer not to record
- **AI Follow-up Questions**: Generate thoughtful follow-up questions to explore deeper aspects of your reflections
- **PDF Export**: Save your questions, responses, and follow-up questions as a PDF
- **Session Management**: Save sessions locally in your browser and reload them later
- **Data Privacy**: All data stays on your device - nothing is sent to any server

## How to Use

1. **Open the Application**: 
   - Simply open the `index.html` file in any modern web browser (Chrome, Firefox, Edge recommended)
   - No server or installation needed

2. **Get Started**:
   - Click "New Question" to display a random reflection question
   - Record your response or type it directly in the text area
   - Generate an AI follow-up question to explore deeper
   - Save your session or export to PDF

3. **Session Management**:
   - Click "Save Session" to store your current session in your browser's local storage
   - Access saved sessions through the "Session History" button
   - Export all sessions as a JSON file for backup
   - Import previously exported sessions

## Browser Compatibility

- Works in all modern browsers (Chrome, Firefox, Edge, Safari)
- Audio recording requires microphone permission
- PDF export works best in Chrome and Firefox

## Privacy

- All data is stored locally in your browser using localStorage
- No data is sent to any external servers
- You can clear all data by clearing your browser's localStorage

## Offline Use

This application works completely offline after the initial page load. You can:
- Save the HTML file and use it without an internet connection
- Take it with you on a USB drive or other portable storage
- Use it in environments with limited or no internet access

## Customization

You can easily customize the question bank by editing the `questionBank` array in the HTML file.