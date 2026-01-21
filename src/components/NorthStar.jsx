import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Star, Target, Sparkles, Check, AlertTriangle, 
  Loader2, Trash2, ChevronRight, Compass, Mountain, Flag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { saveNorthStarGoal, getNorthStarGoals, updateNorthStarGoal, deleteNorthStarGoal } from '@/lib/supabase';

const TIMEFRAMES = [
  { id: '3-month', label: '3 Months', icon: '🎯' },
  { id: '6-month', label: '6 Months', icon: '📈' },
  { id: '1-year', label: '1 Year', icon: '🌟' },
  { id: '3-year', label: '3 Years', icon: '🏔️' }
];

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const STORAGE_KEY = 'north_star_goals';

const loadFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveToLocalStorage = (goals) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }
};

const NorthStar = ({ onBack }) => {
  const { toast } = useToast();
  const [selectedTimeframe, setSelectedTimeframe] = useState('1-year');
  const [rawGoal, setRawGoal] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGoals();
  }, []);

  useEffect(() => {
    if (goals.length > 0) {
      saveToLocalStorage(goals);
    }
  }, [goals]);

  const loadGoals = async () => {
    setIsLoading(true);
    try {
      const dbData = await getNorthStarGoals();
      if (dbData && dbData.length > 0) {
        setGoals(dbData);
      } else {
        const localData = loadFromLocalStorage();
        setGoals(localData);
      }
    } catch (error) {
      console.error('Error loading from database, using localStorage:', error);
      const localData = loadFromLocalStorage();
      setGoals(localData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
    setSelectedGoal(null);
  };

  const getGoalsForTimeframe = () => {
    return goals.filter(g => g.timeframe === selectedTimeframe);
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

      if (refinedData.error) {
        throw new Error(refinedData.error);
      }

      const goalData = {
        id: crypto.randomUUID(),
        timeframe: selectedTimeframe,
        raw_goal: rawGoal,
        smart_goal: refinedData.smart_goal,
        milestones: refinedData.milestones || [],
        reality_check: refinedData.reality_check,
        status: 'in-progress',
        created_at: new Date().toISOString()
      };

      try {
        const savedGoal = await saveNorthStarGoal({
          timeframe: selectedTimeframe,
          raw_goal: rawGoal,
          smart_goal: refinedData.smart_goal,
          milestones: refinedData.milestones,
          reality_check: refinedData.reality_check,
          status: 'in-progress'
        });
        setGoals(prev => [...prev, savedGoal]);
        setSelectedGoal(savedGoal);
      } catch (dbError) {
        console.warn('Could not save to database, using local state:', dbError);
        setGoals(prev => [...prev, goalData]);
        setSelectedGoal(goalData);
      }

      setRawGoal('');

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

  const toggleMilestone = async (goalId, index) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const updatedMilestones = [...goal.milestones];
    updatedMilestones[index] = {
      ...updatedMilestones[index],
      completed: !updatedMilestones[index].completed
    };

    const allCompleted = updatedMilestones.every(m => m.completed);
    const updatedGoal = {
      ...goal,
      milestones: updatedMilestones,
      status: allCompleted ? 'completed' : 'in-progress'
    };

    setGoals(prev => prev.map(g => g.id === goalId ? updatedGoal : g));
    if (selectedGoal?.id === goalId) {
      setSelectedGoal(updatedGoal);
    }

    try {
      await updateNorthStarGoal(goalId, {
        milestones: updatedMilestones,
        status: updatedGoal.status
      });
    } catch (error) {
      console.warn('Could not update in database:', error);
    }

    if (allCompleted) {
      toast({
        title: "Congratulations! 🎉",
        description: "You've completed your North Star goal!"
      });
    }
  };

  const handleDeleteGoal = async (goalId) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
    if (selectedGoal?.id === goalId) {
      setSelectedGoal(null);
    }

    try {
      await deleteNorthStarGoal(goalId);
    } catch (error) {
      console.warn('Could not delete from database:', error);
    }

    toast({
      title: "Goal removed",
      description: "Your North Star goal has been deleted"
    });
  };

  const getProgressInfo = (goal) => {
    const completedMilestones = goal?.milestones?.filter(m => m.completed).length || 0;
    const totalMilestones = goal?.milestones?.length || 0;
    const progressPercent = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;
    return { completedMilestones, totalMilestones, progressPercent };
  };

  const hasWarning = (goal) => {
    return goal?.reality_check?.toLowerCase().includes('warning') ||
           goal?.reality_check?.toLowerCase().includes('note:') ||
           goal?.reality_check?.toLowerCase().includes('caution') ||
           goal?.reality_check?.toLowerCase().includes('unrealistic') ||
           goal?.reality_check?.toLowerCase().includes('challenging');
  };

  const timeframeGoals = getGoalsForTimeframe();

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

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-indigo-500/20 p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Star className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Add New Vision</h3>
              </div>

              <p className="text-slate-400 text-sm">
                What do you want to achieve in {TIMEFRAMES.find(t => t.id === selectedTimeframe)?.label.toLowerCase()}? 
                Be bold - our AI coach will help make it actionable.
              </p>

              <textarea
                value={rawGoal}
                onChange={(e) => setRawGoal(e.target.value)}
                placeholder="I want to..."
                rows={3}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
              />

              <Button
                onClick={refineGoal}
                disabled={isRefining || !rawGoal.trim()}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
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

              <div className="pt-2 border-t border-slate-700/50">
                <p className="text-xs text-slate-500 mb-2">Try an example:</p>
                <div className="flex flex-wrap gap-2">
                  {["Lose 30 pounds", "Start a business", "Learn Spanish", "Save $50K"].map((example, i) => (
                    <button
                      key={i}
                      onClick={() => setRawGoal(example)}
                      className="px-3 py-1 text-xs text-slate-400 bg-slate-700/30 hover:bg-slate-700/50 rounded-full transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {timeframeGoals.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-400" />
                  Your {TIMEFRAMES.find(t => t.id === selectedTimeframe)?.label} Goals ({timeframeGoals.length})
                </h3>

                {timeframeGoals.map((goal) => {
                  const { completedMilestones, totalMilestones, progressPercent } = getProgressInfo(goal);
                  const isSelected = selectedGoal?.id === goal.id;

                  return (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-indigo-500/20 overflow-hidden"
                    >
                      <div
                        onClick={() => setSelectedGoal(isSelected ? null : goal)}
                        className="p-4 cursor-pointer hover:bg-slate-700/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-white/90 font-medium line-clamp-2">
                              {goal.smart_goal || goal.raw_goal}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-400">
                                {completedMilestones}/{totalMilestones}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteGoal(goal.id);
                              }}
                              className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                          </div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-indigo-500/20"
                          >
                            <div className="p-4 space-y-4">
                              {hasWarning(goal) ? (
                                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-start gap-3">
                                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                  <p className="text-amber-200/80 text-sm">{goal.reality_check}</p>
                                </div>
                              ) : goal.reality_check && (
                                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-start gap-3">
                                  <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                  <p className="text-emerald-200/80 text-sm">{goal.reality_check}</p>
                                </div>
                              )}

                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                  <Flag className="w-4 h-4 text-purple-400" />
                                  Milestones
                                </h4>
                                {goal.milestones?.map((milestone, index) => (
                                  <div
                                    key={index}
                                    onClick={() => toggleMilestone(goal.id, index)}
                                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                                      milestone.completed
                                        ? 'bg-indigo-500/10 border border-indigo-500/30'
                                        : 'bg-slate-700/30 border border-slate-600/30 hover:border-slate-500/50'
                                    }`}
                                  >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                      milestone.completed
                                        ? 'bg-indigo-500 text-white'
                                        : 'bg-slate-700 text-slate-400'
                                    }`}>
                                      {milestone.completed ? (
                                        <Check className="w-3 h-3" />
                                      ) : (
                                        <span className="text-xs font-bold">{index + 1}</span>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className={`text-sm font-medium ${
                                        milestone.completed ? 'text-indigo-300' : 'text-white'
                                      }`}>
                                        {milestone.label}
                                      </p>
                                      <p className={`text-xs ${
                                        milestone.completed ? 'text-indigo-200/70' : 'text-slate-400'
                                      }`}>
                                        {milestone.description}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default NorthStar;
