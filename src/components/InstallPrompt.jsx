import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share, PlusSquare, Download } from 'lucide-react';

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        return true;
      }
      if (window.navigator.standalone === true) {
        return true;
      }
      return false;
    };

    if (checkInstalled()) {
      setIsInstalled(true);
      return;
    }

    const isIOSDevice = /iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroidDevice = /Android/.test(navigator.userAgent);
    
    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);

    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    
    if (Date.now() - dismissedTime < oneWeek) {
      return;
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowPrompt(true), 3000);
    });

    if (isIOSDevice) {
      setTimeout(() => setShowPrompt(true), 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', () => {});
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
      >
        <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-slate-700/50">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <img 
                src="/icon-192.png" 
                alt="App Icon" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-sm">Install Matthew's Playbook</h3>
              <p className="text-slate-400 text-xs mt-0.5">
                Add to your home screen for quick access
              </p>
            </div>
          </div>

          {isIOS ? (
            <div className="mt-3 bg-slate-700/30 rounded-xl p-3">
              <p className="text-slate-300 text-xs mb-2">To install on iPhone/iPad:</p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="text-blue-400">1.</span> Tap
                  <Share size={14} className="text-blue-400" />
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-blue-400">2.</span> Select
                  <span className="flex items-center gap-0.5">
                    <PlusSquare size={14} className="text-blue-400" />
                    Add to Home Screen
                  </span>
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleInstall}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Download size={16} />
                Install App
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2.5 text-slate-400 text-sm hover:text-white transition-colors"
              >
                Later
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
