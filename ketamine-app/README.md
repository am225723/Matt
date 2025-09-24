# Ketamine Question Bank Application

A web application designed to facilitate reflection during ketamine therapy sessions by providing thoughtful questions, recording responses, and generating follow-up questions.

## Features

### 1. Question Bank
- Randomized selection from a curated list of reflection questions
- Questions designed to explore anxiety, emotions, and self-awareness
- Simple interface for cycling through different questions

### 2. Audio Recording
- Record your spoken responses to questions
- Visual recording indicator and timer
- Audio playback for review

### 3. Transcription
- Convert your spoken responses to text
- Edit transcriptions manually if needed
- Save transcriptions for future reference

### 4. AI Follow-up Questions
- Generate thoughtful follow-up questions based on the original question
- Helps explore deeper aspects of your reflections
- Encourages further introspection

### 5. PDF Export
- Export your questions, responses, and follow-up questions as a PDF
- Clean, organized format for easy reading
- Shareable document for personal use or with therapists

### 6. Session Management
- Save sessions for future reference
- Load previous sessions to continue your reflections
- Export and import session data

## Technical Details

### Browser Compatibility
- Works best in modern browsers (Chrome, Firefox, Edge)
- Requires microphone access for recording
- Speech recognition works best in Chrome

### Data Privacy
- All data is stored locally in your browser
- No data is sent to external servers (except for audio transcription if enabled)
- You maintain complete control over your information

## Usage Instructions

1. **Getting Started**
   - Click "New Question" to display a random reflection question
   - Read the question and take a moment to reflect

2. **Recording Your Response**
   - Click "Start Recording" to begin capturing your spoken response
   - Speak clearly into your microphone
   - Click "Stop Recording" when finished

3. **Reviewing Your Response**
   - Listen to your recording using the audio player
   - Review the transcribed text
   - Edit the transcription if needed using the "Edit Transcription" button

4. **Generating Follow-up**
   - Click "Generate AI Follow-up" to create a follow-up question
   - The follow-up will help you explore your thoughts more deeply
   - You can record additional responses to follow-up questions

5. **Saving Your Work**
   - Click "Save Session" to store your current question and response
   - Access saved sessions through the "Session History" button
   - Export to PDF to create a shareable document

## Installation

This is a web application that runs directly in your browser. No installation is required.

1. Open the application in a modern web browser
2. Grant microphone permissions when prompted
3. Begin using the application

## Development

This application is built using vanilla JavaScript, HTML, and CSS. It uses the following browser APIs:

- Web Audio API for recording
- Web Speech API for transcription (when available)
- LocalStorage for session management

To modify or extend the application:

1. Clone the repository
2. Make changes to the source files
3. Test in a local web server
4. Deploy the updated files to your hosting provider

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Designed for supporting ketamine therapy sessions
- Questions developed with therapeutic principles in mind
- Built with privacy and ease-of-use as primary considerations