# Installation Guide for Ketamine Question Bank Application

This guide will help you set up and run the Ketamine Question Bank application on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- npm (comes with Node.js)

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ketamine-app
```

### 2. Install Dependencies

Run the following command to install all required dependencies:

```bash
npm install
```

### 3. Start the Application

Start the local development server:

```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Usage

1. Open your web browser and navigate to [http://localhost:3000](http://localhost:3000)
2. Allow microphone access when prompted
3. Click "New Question" to begin
4. Use the recording features to capture your responses
5. Export your responses to PDF or save your session for later

## Troubleshooting

### Microphone Access Issues

If you're having trouble with microphone access:

1. Ensure your browser has permission to access your microphone
2. Check that your microphone is properly connected and working
3. Try using a different browser (Chrome is recommended)

### Audio Recording Not Working

If audio recording isn't working:

1. Make sure you're using a modern browser (Chrome, Firefox, Edge)
2. Check that your microphone is selected in your browser settings
3. Try refreshing the page

### Server Issues

If the server won't start:

1. Make sure port 3000 is not in use by another application
2. Check that you have the correct Node.js version installed
3. Try running `npm install` again to ensure all dependencies are installed

## Advanced Configuration

### Changing the Port

To use a different port, set the PORT environment variable:

```bash
PORT=8080 npm start
```

### Persistent Storage

By default, session data is stored in the browser's localStorage. If you want server-side storage:

1. Create a `sessions` directory in the project root
2. The application will automatically use this for server-side storage

## Support

If you encounter any issues not covered in this guide, please:

1. Check the console for error messages (F12 in most browsers)
2. Refer to the README.md file for additional information
3. Contact the developer for support