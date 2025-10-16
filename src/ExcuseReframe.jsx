import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { reframeExcuse } from '@/prompts/excuseReframe';
import { initializePerplexity } from '@/utils/perplexity';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExcuseReframe = ({ onNext }) => {
  const [excuse, setExcuse] = useState('');
  const [reframe, setReframe] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;
    if (apiKey) {
      initializePerplexity(apiKey);
      setIsInitialized(true);
    } else {
      toast({ title: "API Key Missing", description: "Perplexity API key is not configured.", variant: "destructive" });
    }
  }, []);

  const handleReframe = async () => {
    if (!isInitialized) {
      toast({ title: "AI Not Ready", description: "The AI model is not initialized.", variant: "destructive" });
      return;
    }

    if (!excuse.trim()) {
      toast({ title: "Excuse is empty!", description: "Please enter something to reframe." });
      return;
    }
    
    setIsLoading(true);
    setReframe('');
    try {
      const result = await reframeExcuse(excuse);
      setReframe(result);
      toast({ title: "Success!", description: "Your excuse has been reframed." });
    } catch (error) {
      toast({ title: "AI Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1887&auto=format&fit=crop)" }}>
      <Helmet>
        <title>Excuse Reframing - Matthew's Playbook</title>
        <meta name="description" content="Use AI to reframe your excuses into empowering perspectives." />
        <meta property="og:title" content="Excuse Reframing - Matthew's Playbook" />
        <meta property="og:description" content="Use AI to reframe your excuses into empowering perspectives." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl mx-auto p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/50"
      >
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Excuse Reframe</h2>
        <p className="text-center text-black/70 mb-6">
          Turn limiting beliefs into empowering perspectives.
        </p>
        <div className="space-y-4">
          <Textarea
            value={excuse}
            onChange={(e) => setExcuse(e.target.value)}
            placeholder="e.g., I'm too tired to exercise..."
            rows={3}
            className="bg-white/70 border-gray-300 text-black backdrop-blur-sm"
          />
          <Button onClick={handleReframe} disabled={isLoading} className="w-full bg-[#006E6D] text-white hover:bg-[#005a59]">
            {isLoading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                <Sparkles className="mr-2 h-4 w-4" />
              </motion.div>
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Reframing..." : "Reframe with AI"}
          </Button>
        </div>

        <AnimatePresence>
          {reframe && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-[#006E6D]/10 rounded-lg border border-[#006E6D]/20"
            >
              <h3 className="font-semibold text-lg text-[#004D4C] mb-2">Empowered Perspective:</h3>
              <p className="text-[#004D4C] whitespace-pre-wrap">{reframe}</p>
            </motion.div>
          )}
        </AnimatePresence>
         <Button onClick={onNext} variant="outline" className="w-full mt-6">Back to Dashboard</Button>
      </motion.div>
    </div>
  );
};

export default ExcuseReframe;