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
Copy `SSOCallback.jsx` into the IFS project's `src/components/` directory (or wherever components are stored).

## Step 3: Add the Route
In the IFS app's router (likely `App.jsx` or a routes file), add:

```jsx
import SSOCallback from './components/SSOCallback';

// Inside your Routes:
<Route path="/sso/callback" element={<SSOCallback />} />
```

Make sure this route is OUTSIDE any authentication wrapper so it can be accessed without being logged in.

## Step 4: Adjust the SSOCallback Component
The `SSOCallback.jsx` component needs to match how the IFS app stores login state.
Look at how the pin login (`051189`) sets the user as authenticated and replicate that in the callback.

Common patterns:
- localStorage.setItem('isAuthenticated', 'true')
- localStorage.setItem('userPin', '051189')
- Setting a context/state variable
- Setting a session token

## How It Works
1. User clicks "IFS Healing" tile on Matthew's Playbook
2. Playbook generates a signed JWT token with user info
3. User is redirected to `https://ifs.aleix.help/sso/callback?token=<JWT>`
4. IFS site verifies the token signature matches the shared secret
5. If valid and not expired, the user is automatically logged in
6. User is redirected to the IFS app's main page
