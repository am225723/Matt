import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return atob(str);
}

async function verifyJWT(token, secret) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token format');

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const data = `${encodedHeader}.${encodedPayload}`;

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
  );

  const signatureStr = base64UrlDecode(encodedSignature);
  const signatureBytes = new Uint8Array(signatureStr.length);
  for (let i = 0; i < signatureStr.length; i++) {
    signatureBytes[i] = signatureStr.charCodeAt(i);
  }

  const valid = await crypto.subtle.verify('HMAC', key, signatureBytes, encoder.encode(data));
  if (!valid) throw new Error('Invalid token signature');

  const payload = JSON.parse(base64UrlDecode(encodedPayload));

  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token has expired');
  }

  return payload;
}

export default function SSOCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verifying your login...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleSSO = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setError('No SSO token provided');
        return;
      }

      try {
        const secret = import.meta.env.VITE_JWT_SECRET;
        if (!secret) {
          throw new Error('JWT secret not configured on this site');
        }

        const payload = await verifyJWT(token, secret);

        setStatus('Login verified! Redirecting...');

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userPin', '051189');
        localStorage.setItem('ssoUser', JSON.stringify({
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          loginMethod: 'sso',
          loginTime: new Date().toISOString()
        }));

        setTimeout(() => {
          navigate('/', { replace: true });
          window.location.reload();
        }, 500);
      } catch (err) {
        console.error('SSO verification failed:', err);
        setError(err.message || 'SSO verification failed');
      }
    };

    handleSSO();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Login Failed</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>{error}</p>
          <button
            onClick={() => navigate('/login', { replace: true })}
            style={{
              padding: '0.75rem 2rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      color: 'white',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          border: '3px solid rgba(255,255,255,0.3)',
          borderTopColor: '#10b981',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1.5rem'
        }} />
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{status}</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)' }}>Please wait...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
