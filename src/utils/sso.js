// SSO Utility for Matthew's Dashboard
// This utility generates JWT tokens for seamless authentication to ifs.aleix.help

import jwt from 'jsonwebtoken';

// Configuration
const TARGET_URL = import.meta.env.VITE_TARGET_URL || 'https://ifs.aleix.help';
const JWT_SECRET = import.meta.env.JWT_SECRET || 'change-this-in-production-use-32-char-min';

/**
 * Generate a JWT token for SSO
 * @param {Object} userInfo - User information to include in the token
 * @param {string} userInfo.email - User's email
 * @param {string} userInfo.name - User's name
 * @param {string} userInfo.id - User's unique identifier
 * @param {Object} additionalData - Additional data to include
 * @returns {string} JWT token
 */
export function generateSSOToken(userInfo, additionalData = {}) {
  const payload = {
    // User information
    sub: userInfo.id || 'matthew',
    email: userInfo.email || 'matthew@integrativepsychiatry.xyz',
    name: userInfo.name || 'Matthew Callahan',
    
    // Timestamps
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (15 * 60), // 15 minutes expiration
    
    // Additional metadata
    origin: window.location.origin,
    clientSite: 'matthew.integrativepsychiatry.xyz',
    ...additionalData
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    algorithm: 'HS256'
  });

  return token;
}

/**
 * Redirect to target site with SSO token
 * @param {Object} userInfo - User information
 * @param {Object} additionalData - Additional data to include
 */
export function redirectToTargetSite(userInfo, additionalData = {}) {
  try {
    const token = generateSSOToken(userInfo, additionalData);
    const ssoUrl = `${TARGET_URL}/sso/callback?token=${encodeURIComponent(token)}`;
    
    // Redirect to the target site
    window.location.href = ssoUrl;
  } catch (error) {
    console.error('SSO redirect failed:', error);
    // Fallback to direct link if SSO fails
    window.location.href = TARGET_URL;
  }
}

/**
 * Get the current user info for SSO
 * Customize this based on your user authentication system
 */
export function getCurrentUserInfo() {
  // For Matthew's dashboard, we know who the user is
  // In a real app, this would come from your auth state
  return {
    id: 'matthew-callahan',
    email: 'matthew@integrativepsychiatry.xyz',
    name: 'Matthew Callahan'
  };
}