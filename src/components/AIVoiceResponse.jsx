import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AIVoiceResponse = ({ text }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (isSpeaking || !text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      setIsSpeaking(false);
    };
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeaking]);

  if (!text) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex flex-col items-center space-y-4 text-center pt-4"
    >
      <p className="text-lg text-teal-300">{text}</p>
      <Button
        onClick={handleSpeak}
        disabled={isSpeaking}
        className="bg-teal-600 hover:bg-teal-700"
      >
        {isSpeaking ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Volume2 className="w-4 h-4 mr-2" />
        )}
        Speak
      </Button>
    </motion.div>
  );
};

export default AIVoiceResponse;