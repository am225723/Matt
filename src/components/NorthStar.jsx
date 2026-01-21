import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Star, Target, Sparkles, Check, AlertTriangle, 
  Calendar, Loader2, Plus, Trash2, ChevronRight, Compass,
  Mountain, Flag, Milestone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase, saveNorthStarGoal, getNorthStarGoals, updateNorthStarGoal, deleteNorthStarGoal } from '@/lib/supabase';

const TIMEFRAMES = [
  { id: '3-month', label: '3 Months', icon: '🎯' },
  { id: '6-month', label: '6 Months', icon: '📈' },
  { id: '1-year', label: '1 Year', icon: '🌟' },
  { id: '3-year', label: '3 Years', icon: '🏔️' }
];

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const NorthStar = ({ onBack }) => {
  const { toast } = useToast();
  const [selectedTimeframe, setSelectedTimeframe] = useState('1-year');
  const [rawGoal, setRawGoal] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [goals, setGoals] = useState([]);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    setIsLoading(true);
    try {
      const data = await getNorthStarGoals();
      setGoals(data);
      const activeGoal = data.find(g => g.timeframe === selectedTimeframe && g.status === 'in-progress');
      setCurrentGoal(activeGoal || null);
    } catch (error) {
      console.error('Error loading goals:', error);
      setGoals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
    const activeGoal = goals.find(g => g.timeframe === timeframe && g.status === 'in-progress');
    setCurrentGoal(activeGoal || null);
    setShowInput(false);
  };

  const refineGoal = async () => {
    if (!rawGoal.trim()) {
      toast({
        title: "Please enter your vision",
        description: "Tell us what you want to achieve",
        variant: "destructive"
      });
      return;
    }

    setIsRefining(true);

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/refine-north-star`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          raw_goal: rawGoal,
          timeframe: selectedTimeframe
        })
      });

      if (!response.ok) {
        throw new Error('Failed to refine goal');
      }

      const refinedData = await response.json();

      const savedGoal = await saveNorthStarGoal({
        timeframe: selectedTimeframe,
        raw_goal: rawGoal,
        smart_goal: refinedData.smart_goal,
        milestones: refinedData.milestones,
        reality_check: refinedData.reality_check,
        status: 'in-progress'
      });

      setCurrentGoal(savedGoal);
      setGoals(prev => [...prev.filter(g => g.id !== savedGoal.id), savedGoal]);
      setRawGoal('');
      setShowInput(false);

      toast({
        title: "Vision Refined! ✨",
        description: "Your North Star goal has been set"
      });

    } catch (error) {
      console.error('Error refining goal:', error);
      toast({
        title: "Failed to refine vision",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsRefining(false);
    }
  };

  const toggleMilestone = async (index) => {
    if (!currentGoal) return;

    const updatedMilestones = [...currentGoal.milestones];
    updatedMilestones[index] = {
      ...updatedMilestones[index],
      completed: !updatedMilestones[index].completed
    };

    const allCompleted = updatedMilestones.every(m => m.completed);
    const updatedGoal = {
      ...currentGoal,
      milestones: updatedMilestones,
      status: allCompleted ? 'completed' : 'in-progress'
    };

    try {
      await updateNorthStarGoal(currentGoal.id, {
        milestones: updatedMilestones,
        status: updatedGoal.status
      });

      setCurrentGoal(updatedGoal);
      setGoals(prev => prev.map(g => g.id === currentGoal.id ? updatedGoal : g));

      if (allCompleted) {
        toast({
          title: "Congratulations! 🎉",
          description: "You've completed your North Star goal!"
        });
      }
    } catch (error) {
      console.error('Error updating milestone:', error);
    }
  };

  const handleDeleteGoal = async () => {
    if (!currentGoal) return;

    try {
      await deleteNorthStarGoal(currentGoal.id);
      setGoals(prev => prev.filter(g => g.id !== currentGoal.id));
      setCurrentGoal(null);
      toast({
        title: "Goal removed",
        description: "Your North Star goal has been deleted"
      });
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const hasWarning = currentGoal?.reality_check?.toLowerCase().includes('warning') ||
                     currentGoal?.reality_check?.toLowerCase().includes('note:') ||
                     currentGoal?.reality_check?.toLowerCase().includes('caution') ||
                     currentGoal?.reality_check?.toLowerCase().includes('unrealistic') ||
                     currentGoal?.reality_check?.toLowerCase().includes('challenging');

  const completedMilestones = currentGoal?.milestones?.filter(m => m.completed).length || 0;
  const totalMilestones = currentGoal?.milestones?.length || 0;
  const progressPercent = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-indigo-500/20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-indigo-300 hover:text-indigo-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <h1 className="flex items-center gap-2 text-xl font-bold text-white">
            <Compass className="w-5 h-5 text-indigo-400" />
            North Star Goals
          </h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mountain className="w-8 h-8 text-indigo-400" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              North Star Goals & Visions
            </h2>
          </div>
          <p className="text-slate-400 max-w-lg mx-auto">
            Define your ultimate vision and let AI help you create a SMART roadmap to achieve it
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.id}
              onClick={() => handleTimeframeChange(tf.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                selectedTimeframe === tf.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
              }`}
            >
              <span>{tf.icon}</span>
              <span>{tf.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-16"
            >
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            </motion.div>
          ) : currentGoal && !showInput ? (
            <motion.div
              key="current-goal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-indigo-500/20 p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                      <Target className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Your SMART Goal</h3>
                      <p className="text-sm text-slate-400">
                        {TIMEFRAMES.find(t => t.id === currentGoal.timeframe)?.label} Vision
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDeleteGoal}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-white/90 leading-relaxed text-lg">
                  {currentGoal.smart_goal}
                </p>

                <div className="pt-2">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-indigo-300 font-medium">
                      {completedMilestones}/{totalMilestones} milestones
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>

              {hasWarning && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3"
                >
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-300 mb-1">Reality Check</h4>
                    <p className="text-amber-200/80 text-sm">{currentGoal.reality_check}</p>
                  </div>
                </motion.div>
              )}

              {!hasWarning && currentGoal.reality_check && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-emerald-300 mb-1">Coach's Insight</h4>
                    <p className="text-emerald-200/80 text-sm">{currentGoal.reality_check}</p>
                  </div>
                </div>
              )}

              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-indigo-500/20 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Flag className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Milestone Roadmap</h3>
                </div>

                <div className="space-y-4">
                  {currentGoal.milestones?.map((milestone, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      {index < currentGoal.milestones.length - 1 && (
                        <div className={`absolute left-5 top-12 w-0.5 h-8 ${
                          milestone.completed ? 'bg-indigo-500' : 'bg-slate-700'
                        }`} />
                      )}
                      
                      <div
                        onClick={() => toggleMilestone(index)}
                        className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                          milestone.completed
                            ? 'bg-indigo-500/10 border border-indigo-500/30'
                            : 'bg-slate-700/30 border border-slate-600/30 hover:border-slate-500/50'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          milestone.completed
                            ? 'bg-indigo-500 text-white'
                            : 'bg-slate-700 text-slate-400'
                        }`}>
                          {milestone.completed ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <span className="text-sm font-bold">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-medium mb-1 ${
                            milestone.completed ? 'text-indigo-300' : 'text-white'
                          }`}>
                            {milestone.label}
                          </h4>
                          <p className={`text-sm ${
                            milestone.completed ? 'text-indigo-200/70' : 'text-slate-400'
                          }`}>
                            {milestone.description}
                          </p>
                        </div>
                        <ChevronRight className={`w-5 h-5 flex-shrink-0 ${
                          milestone.completed ? 'text-indigo-400' : 'text-slate-500'
                        }`} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => {
                  setShowInput(true);
                  setCurrentGoal(null);
                }}
                variant="outline"
                className="w-full border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Set New Goal for This Timeframe
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-indigo-500/20 p-6 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <Star className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Define Your Vision</h3>
                </div>

                <p className="text-slate-400 text-sm">
                  What do you want to achieve in {TIMEFRAMES.find(t => t.id === selectedTimeframe)?.label.toLowerCase()}? 
                  Be bold - our AI coach will help make it actionable.
                </p>

                <textarea
                  value={rawGoal}
                  onChange={(e) => setRawGoal(e.target.value)}
                  placeholder="I want to..."
                  rows={4}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={refineGoal}
                    disabled={isRefining || !rawGoal.trim()}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                  >
                    {isRefining ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Refining with AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Refine Vision with AI
                      </>
                    )}
                  </Button>
                  
                  {showInput && (
                    <Button
                      onClick={() => {
                        setShowInput(false);
                        const activeGoal = goals.find(g => g.timeframe === selectedTimeframe && g.status === 'in-progress');
                        setCurrentGoal(activeGoal || null);
                      }}
                      variant="outline"
                      className="border-slate-600 text-slate-300"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
                <h4 className="text-sm font-medium text-slate-300 mb-3">Example Visions:</h4>
                <div className="space-y-2">
                  {[
                    "Lose 30 pounds and run a 5K",
                    "Launch my own consulting business",
                    "Learn Spanish to conversational fluency",
                    "Save $50,000 for a house down payment"
                  ].map((example, i) => (
                    <button
                      key={i}
                      onClick={() => setRawGoal(example)}
                      className="block w-full text-left px-3 py-2 text-sm text-slate-400 hover:text-indigo-300 hover:bg-slate-700/30 rounded-lg transition-colors"
                    >
                      "{example}"
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {goals.filter(g => g.status === 'completed').length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Completed Goals
            </h3>
            <div className="space-y-3">
              {goals.filter(g => g.status === 'completed').map((goal) => (
                <div
                  key={goal.id}
                  className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-emerald-400 font-medium">
                        {TIMEFRAMES.find(t => t.id === goal.timeframe)?.label}
                      </span>
                      <p className="text-white/80 text-sm mt-1">{goal.smart_goal}</p>
                    </div>
                    <Check className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

const Trophy = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

export default NorthStar;
