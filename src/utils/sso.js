const TARGET_URL = import.meta.env.VITE_TARGET_URL || 'https://ifs.aleix.help/sso/callback';

function base64UrlEncode(str) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function signJWT(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  const encodedSignature = base64UrlEncode(
    String.fromCharCode(...new Uint8Array(signature))
  );

  return `${data}.${encodedSignature}`;
}

export async function generateSSOToken(userInfo, additionalData = {}) {
  const secret = import.meta.env.VITE_JWT_SECRET;
  if (!secret) {
    throw new Error('VITE_JWT_SECRET environment variable is not set');
  }
  const payload = {
    sub: userInfo.id || 'matthew',
    email: userInfo.email || 'matthew@integrativepsychiatry.xyz',
    name: userInfo.name || 'Matthew Callahan',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (15 * 60),
    origin: window.location.origin,
    clientSite: 'matthew.integrativepsychiatry.xyz',
    ...additionalData
  };

  return await signJWT(payload, secret);
}

export async function redirectToTargetSite(userInfo, additionalData = {}) {
  try {
    const token = await generateSSOToken(userInfo, additionalData);
    const ssoUrl = `${TARGET_URL}/sso/callback?sso_token=${encodeURIComponent(token)}`;
    window.location.href = ssoUrl;
  } catch (error) {
    console.error('SSO redirect failed:', error);
    window.location.href = TARGET_URL;
  }
}

export function getCurrentUserInfo() {
  return {
    id: 'matthew-callahan',
    email: 'matthew@integrativepsychiatry.xyz',
    name: 'Matthew Callahan'
  };
}
