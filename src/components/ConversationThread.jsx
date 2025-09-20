import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, User, Send } from 'lucide-react';

const Message = ({ type, text, index }) => {
  const isAI = type === 'ai';
  const Icon = isAI ? Bot : User;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex items-end gap-2 my-2 ${isAI ? 'justify-start' : 'justify-end'}`}
    >
      {isAI && <Icon className="w-4 h-4 text-white/60" />}
      <div
        className={`rounded-2xl px-4 py-2 max-w-xs text-sm shadow-md whitespace-pre-wrap break-words ${
          isAI ? 'bg-white/10 text-white/90' : 'bg-blue-600 text-white'
        }`}
      >
        {text}
      </div>
      {!isAI && <Icon className="w-4 h-4 text-white/60" />}
    </motion.div>
  );
};

const ConversationThread = ({ conversation, onSubmit, loading }) => {
  const [answer, setAnswer] = useState('');
  const lastMessageIsAI = conversation?.length && conversation[conversation.length - 1]?.type === 'ai';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim()) {
      onSubmit(answer);
      setAnswer('');
    }
  };

  return (
    <div className="bg-black/20 p-4 rounded-xl border border-white/10 my-4 space-y-2">
      {conversation.map((msg, index) => (
        <Message key={index} type={msg.type} text={msg.text} index={index} />
      ))}

      {/* Debug text for logic confirmation */}
      <div className="text-xs text-white/60 italic">
        {lastMessageIsAI ? '✅ AI question active – waiting for reply' : '⛔ No open AI follow-up'}
      </div>

      {lastMessageIsAI && !loading && (
        <form onSubmit={handleSubmit} className="flex gap-2 items-center mt-2">
          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your response to the AI..."
            className="bg-white/20 border-white/30 text-white placeholder:text-white/60 flex-grow"
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !answer.trim()} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      )}

      {loading && <p className="text-xs text-white/60 italic mt-2">AI Caddie is thinking...</p>}
    </div>
  );
};

export default ConversationThread;