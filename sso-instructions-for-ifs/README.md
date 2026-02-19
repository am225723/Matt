# SSO Setup for IFS Site

## Step 1: Add Environment Variable
In the IFS Replit project, add this secret:
- Key: `VITE_JWT_SECRET`
- Value: `9698089f8ceb66b04367a86a60804d564e2a60fa40379ae500f6ceab6ce903f3`

## Step 2: Copy SSOCallback.jsx
Copy `SSOCallback.jsx` into `src/components/SSOCallback.jsx` in the IFS project.

## Step 3: Update App.jsx
In the IFS project's `src/App.jsx`, make these two changes:

### 3a. Add the import at the top (with the other imports):
```jsx
import SSOCallback from './components/SSOCallback';
```

### 3b. Add the SSO route in the unauthenticated Routes block:
Find this section in AppContent:
```jsx
{!isAuthenticated ? (
  <Routes>
    <Route path="/" element={<ClientPINLogin onLogin={handleLogin} />} />
    <Route path="/test-client" element={<TestClientCreator />} />
    <Route path="/diagnostic" element={<PINAuthDiagnostic />} />
    <Route path="/auth-debug" element={<AuthDebug />} />
    <Route path="*" element={<ClientPINLogin onLogin={handleLogin} />} />
  </Routes>
```

Add the SSO callback route BEFORE the catch-all `*` route:
```jsx
{!isAuthenticated ? (
  <Routes>
    <Route path="/" element={<ClientPINLogin onLogin={handleLogin} />} />
    <Route path="/sso/callback" element={<SSOCallback onLogin={handleLogin} />} />
    <Route path="/test-client" element={<TestClientCreator />} />
    <Route path="/diagnostic" element={<PINAuthDiagnostic />} />
    <Route path="/auth-debug" element={<AuthDebug />} />
    <Route path="*" element={<ClientPINLogin onLogin={handleLogin} />} />
  </Routes>
```

That's it! The SSO callback uses the same `handleLogin` function as the PIN login.
