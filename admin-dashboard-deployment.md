# Admin Dashboard Deployment Guide

This guide provides instructions for deploying the Admin Dashboard component to your production environment.

## Prerequisites

Before deploying the Admin Dashboard, ensure you have the following:

1. Node.js (v16.0.0 or higher)
2. npm (v8.0.0 or higher) or yarn (v1.22.0 or higher)
3. Access to your production server or hosting environment
4. Git access to the repository

## Deployment Steps

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/am225723/Matt.git

# Navigate to the project directory
cd Matt

# Checkout the feature branch
git checkout feature/admin-dashboard
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```
# API Configuration
VITE_API_URL=https://your-api-url.com
VITE_API_KEY=your_api_key

# Authentication
VITE_AUTH_DOMAIN=your-auth-domain.com
VITE_AUTH_CLIENT_ID=your_client_id

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true

# Gemini API Key (if using AI features)
VITE_GEMINI_API_KEY=your_gemini_api_key
```

Adjust these values according to your production environment.

### 4. Build the Application

```bash
# Using npm
npm run build

# Or using yarn
yarn build
```

This will create a `dist` directory with the optimized production build.

### 5. Testing the Production Build Locally

Before deploying to production, you can test the production build locally:

```bash
# Using npm
npm run preview

# Or using yarn
yarn preview
```

This will serve the production build locally, typically at http://localhost:4173.

### 6. Deployment Options

#### Option A: Static Hosting (Recommended)

For static hosting services like Netlify, Vercel, or AWS S3:

1. Upload the contents of the `dist` directory to your hosting provider.
2. Configure your hosting provider to handle client-side routing (for SPA).

**Example for Netlify:**
Create a `netlify.toml` file in the root directory:

```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Example for Vercel:**
Create a `vercel.json` file in the root directory:

```json
{
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

#### Option B: Server Deployment

If deploying to a Node.js server:

1. Install a static file server:

```bash
npm install -g serve
```

2. Serve the production build:

```bash
serve -s dist
```

3. For production use, consider using PM2 for process management:

```bash
# Install PM2
npm install -g pm2

# Start the application
pm2 start "serve -s dist" --name "admin-dashboard"

# Ensure PM2 restarts on system reboot
pm2 startup
pm2 save
```

#### Option C: Docker Deployment

1. Create a `Dockerfile` in the root directory:

```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. Create an `nginx.conf` file:

```
server {
    listen 80;
    server_name _;
    
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

3. Build and run the Docker container:

```bash
# Build the Docker image
docker build -t admin-dashboard .

# Run the container
docker run -p 80:80 admin-dashboard
```

### 7. Post-Deployment Verification

After deploying, verify the following:

1. The Admin Dashboard loads correctly in the browser
2. Navigation between different sections works as expected
3. All API endpoints are correctly configured and working
4. Authentication and authorization are functioning properly
5. The application is responsive on different devices

### 8. Monitoring and Maintenance

1. Set up monitoring for your application using services like:
   - Google Analytics
   - Sentry for error tracking
   - LogRocket for session replay

2. Implement regular backups of your database and configuration

3. Establish a process for deploying updates:
   - Use feature branches for development
   - Test thoroughly before deploying to production
   - Consider implementing a CI/CD pipeline

## Troubleshooting Common Issues

### Issue: White screen after deployment

**Solution:**
- Check browser console for errors
- Verify that all environment variables are correctly set
- Ensure that client-side routing is properly configured on your hosting provider

### Issue: API requests failing

**Solution:**
- Verify API endpoint URLs in your environment configuration
- Check CORS settings on your API server
- Ensure authentication tokens are being properly passed

### Issue: Authentication not working

**Solution:**
- Verify authentication provider configuration
- Check token expiration and refresh logic
- Ensure proper redirect URLs are configured

### Issue: Styling or layout issues

**Solution:**
- Clear browser cache
- Verify that all CSS and asset files are properly loaded
- Test on different browsers to identify browser-specific issues

## Security Considerations

1. **Environment Variables**: Ensure sensitive information is stored in environment variables and not hardcoded.

2. **Authentication**: Implement proper authentication and authorization checks.

3. **API Security**: Use HTTPS for all API requests and implement proper rate limiting.

4. **Content Security Policy**: Consider implementing a Content Security Policy to prevent XSS attacks.

5. **Regular Updates**: Keep dependencies updated to patch security vulnerabilities.

## Support and Resources

If you encounter issues during deployment, refer to:

- Project documentation in the `docs` directory
- The project's GitHub repository issues section
- Contact the development team at support@example.com

---

For any questions or assistance with deployment, please contact the development team.