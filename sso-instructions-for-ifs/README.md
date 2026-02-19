# SSO Setup Instructions for IFS Site

## Overview
These instructions enable Single Sign-On (SSO) from Matthew's Playbook to the IFS site.
When the user clicks "IFS Healing" on the Playbook, they will be automatically logged into the IFS site.

## Step 1: Set Environment Variable
Add this environment variable to the IFS Replit project (in Secrets/Environment Variables):

```
VITE_JWT_SECRET = 9698089f8ceb66b04367a86a60804d564e2a60fa40379ae500f6ceab6ce903f3
```

This MUST match the secret used by the Playbook app.

## Step 2: Add the SSO Callback Component
Copy `SSOCallback.jsx` into the IFS project's `src/components/` directory.

## Step 3: Add the Route
In the IFS app's router (likely `App.jsx` or wherever routes are defined), find where
`ClientPINLogin` is used and add the SSO callback route.

The SSO callback needs the same `onLogin` prop that `ClientPINLogin` receives.
After JWT verification, it calls `onLogin('051189')` to log in automatically.

Example (adjust to match the IFS app's actual router structure):

```jsx
import SSOCallback from './components/SSOCallback';

// Inside your Routes, next to where ClientPINLogin is rendered:
// Make sure this is OUTSIDE any auth-protected wrapper
<Route path="/sso/callback" element={<SSOCallback onLogin={handleLogin} />} />
```

Where `handleLogin` is the same function passed to `ClientPINLogin` as `onLogin`.

## How It Works
1. User clicks "IFS Healing" tile on Matthew's Playbook
2. Playbook generates a signed JWT token with user info
3. User is redirected to `https://ifs.aleix.help/sso/callback?token=<JWT>`
4. IFS site verifies the token signature matches the shared secret
5. If valid and not expired, it calls onLogin('051189') to log in automatically
6. User is redirected to the IFS app's main page
