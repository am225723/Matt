# SSO Integration for IFS Healing Dashboard

## What Was Added

This repository now includes SSO (Single Sign-On) functionality that allows seamless login to the IFS Healing dashboard (ifs.aleix.help) with a single click.

## Changes Made

### New Files
1. **`src/utils/sso.js`** - SSO utility functions for generating JWT tokens and handling redirects
2. **`src/components/SSOButton.tsx`** - Reusable SSO button component (optional, can be used elsewhere)

### Modified Files
1. **`src/App.jsx`** - Updated to use SSO for the IFS Healing tile:
   - Changed from direct link (`href="https://ifs.aleix.help"`) to internal route (`to="/ifs-sso"`)
   - Added `IFSSSOWrapper` component to handle SSO redirect
   - Added new route `/ifs-sso` for the SSO flow

2. **`.env.example`** - Added SSO configuration variables:
   ```bash
   VITE_TARGET_URL=https://ifs.aleix.help
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
   ```

## How It Works

1. User clicks "IFS Healing" tile on dashboard
2. React Router navigates to `/ifs-sso` route
3. `IFSSSOWrapper` generates a secure JWT token with user info
4. Browser redirects to `https://ifs.aleix.help/sso/callback?token=...`
5. IFS dashboard verifies token and creates session
6. User is automatically logged in!

## Setup Instructions

### 1. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env

# Edit .env and set these values:
VITE_TARGET_URL=https://ifs.aleix.help
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
```

**IMPORTANT**: The `JWT_SECRET` must:
- Be at least 32 characters long
- Be the same as configured on the IFS dashboard
- Never be committed to git

**Generate a secure secret**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. Install Dependencies

The `jsonwebtoken` package should already be installed. If not:

```bash
npm install jsonwebtoken
```

### 3. Test Locally

```bash
# Start the development server
npm run dev

# Visit http://localhost:5173
# Click the "IFS Healing" tile
# You should be redirected to ifs.aleix.help and logged in
```

### 4. Deploy

```bash
# Build for production
npm run build

# Deploy to your hosting provider
# Make sure to set VITE_TARGET_URL and JWT_SECRET environment variables
```

## User Information

By default, the SSO will authenticate as:

- **Name**: Matthew Callahan
- **Email**: matthew@integrativepsychiatry.xyz
- **User ID**: matthew-callahan

To change this, edit the `getCurrentUserInfo()` function in `src/utils/sso.js`:

```javascript
export function getCurrentUserInfo() {
  return {
    id: 'your-user-id',
    email: 'your-email@example.com',
    name: 'Your Name'
  };
}
```

## Security Features

- ✅ JWT tokens with 15-minute expiration
- ✅ Secure signature verification
- ✅ Client site validation
- ✅ HttpOnly cookies on target site
- ✅ HTTPS-only in production

## Troubleshooting

### "Connecting to IFS Healing..." stays on screen

**Cause**: Redirect failing
**Solution**: 
- Check `VITE_TARGET_URL` is correct
- Check browser console for errors
- Verify target site is accessible

### "invalid_token" error on target site

**Cause**: JWT_SECRET mismatch
**Solution**: 
- Ensure JWT_SECRET is identical on both sites
- Regenerate secret and update both `.env` files

### "unauthorized_client" error

**Cause**: Client site not in allowlist
**Solution**: 
- Contact IFS dashboard admin
- Add your site URL to `ALLOWED_CLIENT_SITES` on target site

## Technical Details

### JWT Token Payload

```javascript
{
  sub: "matthew-callahan",
  email: "matthew@integrativepsychiatry.xyz",
  name: "Matthew Callahan",
  iat: 1234567890,  // Issued at timestamp
  exp: 1234568790,  // Expiration timestamp (15 min)
  origin: "https://matthew.integrativepsychiatry.xyz",
  clientSite: "matthew.integrativepsychiatry.xyz"
}
```

### API Endpoints

**Target Site**: `https://ifs.aleix.help/sso/callback`
- Method: GET
- Query Params: `token={jwt_token}`
- Response: Redirect to dashboard with session cookie

## Support

For detailed implementation documentation, see `SSO_IMPLEMENTATION_GUIDE.md` in the allinone repository.

## Credits

This SSO implementation was created to provide seamless authentication between Matthew's personal dashboard and the IFS Healing dashboard.