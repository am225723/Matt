// SSO Button Component for Matthew's Dashboard
// This component provides a styled button for SSO login to ifs.aleix.help

import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, ArrowRight } from 'lucide-react';
import { redirectToTargetSite, getCurrentUserInfo } from '@/utils/sso';

interface SSOButtonProps {
  /**
   * Custom user info (optional, will use defaults if not provided)
   */
  userInfo?: {
    id?: string;
    email?: string;
    name?: string;
  };
  /**
   * Additional data to include in the token
   */
  additionalData?: Record<string, any>;
  /**
   * Custom class names for styling
   */
  className?: string;
  /**
   * Custom onClick handler (optional)
   */
  onClick?: () => void;
}

/**
 * SSOButton - A styled button that redirects to ifs.aleix.help with SSO authentication
 * 
 * Usage example:
 * ```tsx
 * <SSOButton />
 * 
 * Or with custom user info:
 * <SSOButton 
 *   userInfo={{
 *     id: 'user-123',
 *     email: 'user@example.com',
 *     name: 'John Doe'
 *   }}
 * />
 * ```
 */
const SSOButton: React.FC<SSOButtonProps> = ({
  userInfo,
  additionalData = {},
  className = '',
  onClick
}) => {
  
  const handleClick = () => {
    // Get user info (either custom or default)
    const finalUserInfo = userInfo || getCurrentUserInfo();
    
    // Call custom onClick if provided
    if (onClick) {
      onClick();
    }
    
    // Redirect with SSO
    redirectToTargetSite(finalUserInfo, additionalData);
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative overflow-hidden rounded-2xl 
        bg-gradient-to-br from-emerald-500 to-teal-600
        text-white font-semibold
        shadow-lg hover:shadow-xl
        transition-all duration-300
        ${className}
      `}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '208px', // h-52
      }}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600" />
      
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
      
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
        }}
      />
      
      {/* Content */}
      <div className="relative h-full p-4 flex items-stretch gap-3">
        {/* Icon */}
        <div className="relative flex-shrink-0 w-32 sm:w-36 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Leaf className="w-20 h-20 sm:w-24 sm:h-24 text-white/90 drop-shadow-2xl" />
          </motion.div>
        </div>
        
        {/* Text Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-center py-2">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight leading-tight">
            IFS Healing
          </h3>
          <p className="text-white/90 text-sm sm:text-base line-clamp-3 leading-relaxed">
            Internal Family Systems therapy for healing and self-discovery
          </p>
        </div>
        
        {/* Arrow */}
        <div className="flex-shrink-0 self-center text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all">
          <ArrowRight className="w-6 h-6" />
        </div>
      </div>
      
      {/* Bottom border highlight */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </motion.button>
  );
};

export default SSOButton;