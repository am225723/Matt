import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Mic, MicOff, Play, Pause, Save, Download, Trash2, Edit3, CheckCircle2,
  BrainCircuit, Sparkles, MessageSquare, FileText, Calendar, Clock,
  Heart, Smile, Meh, Frown, ChevronRight, ChevronLeft, X, Plus,
  Volume2, VolumeX, RotateCcw, Send, Loader2, ArrowRight, ArrowLeft, StopCircle, List
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import AudioService from '@/services/audioService';
import AIService from '@/services/aiService';
import { getAllTopics, getTopicById } from '@/data/questionBank';

const KetamineJournalAdvanced = ({ onBack }) => {
  const { toast } = useToast();
  
  // Question bank state
  const [sessionMode, setSessionMode] = useState('topic-select'); // 'topic-select', 'question-flow', 'free-form'
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionResponses, setQuestionResponses] = useState([]);
  const [currentResponse, setCurrentResponse] = useState('');
  
  // Session state
  const [activeTab, setActiveTab] = useState('record');
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioSegments, setAudioSegments] = useState([]);
  const [currentAudioBlob, setCurrentAudioBlob] = useState(null);
  
  // Transcription & AI state
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGeneratingFollowUp, setIsGeneratingFollowUp] = useState(false);
  const [paragraphs, setParagraphs] = useState([]);
  const [currentParagraphText, setCurrentParagraphText] = useState('');
  const [aiFollowUpQuestion, setAiFollowUpQuestion] = useState('');
  const [showFollowUpPrompt, setShowFollowUpPrompt] = useState(false);
  
  // Mood tracking
  const [sessionMood, setSessionMood] = useState(50);
  const [emotionalState, setEmotionalState] = useState('');
  
  // UI state
  const [editingParagraphIndex, setEditingParagraphIndex] = useState(null);
  const [editText, setEditText] = useState('');
  
  // Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  // Load sessions from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('ketamineJournalSessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  // Save sessions to localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('ketamineJournalSessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  // Recording timer
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start new session
  const startNewSession = () => {
    const newSession = {
      id: Date.now(),
      startTime: new Date().toISOString(),
      paragraphs: [],
      mood: 50,
      emotionalState: '',
      duration: 0
    };
    setCurrentSession(newSession);
    setSessionStartTime(new Date());
    setParagraphs([]);
    setAudioSegments([]);
    setRecordingTime(0);
    setActiveTab('record');
  };

  // Start recording audio segment
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setCurrentAudioBlob(audioBlob);
        await handleTranscription(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      toast({
        title: 'Recording Started',
        description: 'Speak freely. Your words will be transcribed.',
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Recording Error',
        description: 'Could not access microphone. Please check permissions.',
        variant: 'destructive',
      });
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  // Pause/Resume recording
  const togglePause = () => {
    if (!mediaRecorderRef.current) return;
    
    if (isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    } else {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  // Handle transcription
  const handleTranscription = async (audioBlob) => {
    setIsTranscribing(true);
    
    try {
      const audioService = new AudioService();
      const transcriptionText = await audioService.transcribeAudio(audioBlob);
      
      if (transcriptionText) {
        setCurrentParagraphText(transcriptionText);
        
        // Add to paragraphs
        const newParagraph = {
          id: Date.now(),
          text: transcriptionText,
          timestamp: new Date().toISOString(),
          audioBlob: audioBlob,
          duration: recordingTime
        };
        
        setParagraphs(prev => [...prev, newParagraph]);
        setAudioSegments(prev => [...prev, audioBlob]);
        
        // Generate AI follow-up question
        await generateFollowUpQuestion(transcriptionText);
        
        toast({
          title: 'Transcription Complete',
          description: 'Your words have been captured.',
        });
      } else {
        toast({
          title: 'Transcription Issue',
          description: 'Could not transcribe audio. You can add text manually.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        title: 'Transcription Failed',
        description: 'An error occurred. You can add text manually.',
        variant: 'destructive',
      });
    } finally {
      setIsTranscribing(false);
      setCurrentParagraphText('');
    }
  };

  // Generate AI follow-up question
  const generateFollowUpQuestion = async (transcribedText) => {
    setIsGeneratingFollowUp(true);
    
    try {
      const aiService = new AIService();
      const followUp = await aiService.generateFollowUpQuestion(transcribedText);
      
      if (followUp) {
        setAiFollowUpQuestion(followUp);
        setShowFollowUpPrompt(true);
      }
    } catch (error) {
      console.error('Error generating follow-up:', error);
    } finally {
      setIsGeneratingFollowUp(false);
    }
  };

  // Save session
  const saveSession = () => {
    if (!currentSession) return;
    
    const updatedSession = {
      ...currentSession,
      paragraphs: paragraphs,
      mood: sessionMood,
      emotionalState: emotionalState,
      duration: Math.floor((new Date() - sessionStartTime) / 1000),
      endTime: new Date().toISOString()
    };
    
    setSessions(prev => {
      const existing = prev.find(s => s.id === currentSession.id);
      if (existing) {
        return prev.map(s => s.id === currentSession.id ? updatedSession : s);
      } else {
        return [...prev, updatedSession];
      }
    });
    
    toast({
      title: 'Session Saved',
      description: 'Your journal entry has been saved.',
    });
    
    setCurrentSession(null);
    setActiveTab('history');
  };

  // Export session
  const exportSession = (session) => {
    const exportData = {
      date: new Date(session.startTime).toLocaleString(),
      mood: session.mood,
      emotionalState: session.emotionalState,
      duration: formatTime(session.duration),
      content: session.paragraphs.map((p, i) => 
        `[${new Date(p.timestamp).toLocaleTimeString()}]\n${p.text}`
      ).join('\n\n---\n\n')
    };
    
    const text = `Ketamine Journal Entry\n\nDate: ${exportData.date}\nMood: ${exportData.mood}/100\nEmotional State: ${exportData.emotionalState}\nDuration: ${exportData.duration}\n\n---\n\n${exportData.content}`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ketamine-journal-${new Date(session.startTime).toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Session Exported',
      description: 'Your journal has been downloaded.',
    });
  };

  // Delete session
  const deleteSession = (sessionId) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    toast({
      title: 'Session Deleted',
      description: 'Journal entry has been removed.',
    });
  };

  // Edit paragraph
  const startEditingParagraph = (index, text) => {
    setEditingParagraphIndex(index);
    setEditText(text);
  };

  const saveEditedParagraph = () => {
    if (editingParagraphIndex !== null) {
      setParagraphs(prev => prev.map((p, i) => 
        i === editingParagraphIndex ? { ...p, text: editText } : p
      ));
      setEditingParagraphIndex(null);
      setEditText('');
    }
  };

  const moodEmojis = [
    { value: 0, icon: <Frown className="w-6 h-6" />, label: 'Very Low', color: 'text-red-500' },
    { value: 25, icon: <Meh className="w-6 h-6" />, label: 'Low', color: 'text-orange-500' },
    { value: 50, icon: <Smile className="w-6 h-6" />, label: 'Neutral', color: 'text-yellow-500' },
    { value: 75, icon: <Smile className="w-6 h-6" />, label: 'Good', color: 'text-green-500' },
    { value: 100, icon: <Heart className="w-6 h-6" />, label: 'Excellent', color: 'text-pink-500' }
  ];

  const getMoodEmoji = (value) => {
    if (value <= 20) return moodEmojis[0];
    if (value <= 40) return moodEmojis[1];
    if (value <= 60) return moodEmojis[2];
    if (value <= 80) return moodEmojis[3];
    return moodEmojis[4];
  };

  // Question bank functions
  const selectTopic = (topicId) => {
    const topic = getTopicById(topicId);
    setSelectedTopic(topic);
    setCurrentQuestionIndex(0);
    setQuestionResponses([]);
    setCurrentResponse('');
    setSessionMode('question-flow');
    startNewSession();
  };

  const handleNextQuestion = () => {
    if (!selectedTopic) return;
    
    // Save current response
    if (currentResponse.trim()) {
      const newResponse = {
        question: selectedTopic.questions[currentQuestionIndex],
        answer: currentResponse,
        timestamp: new Date().toISOString()
      };
      setQuestionResponses(prev => [...prev, newResponse]);
      
      // Add to paragraphs
      const newParagraph = {
        id: Date.now(),
        text: `Q: ${selectedTopic.questions[currentQuestionIndex]}\n\nA: ${currentResponse}`,
        timestamp: new Date().toISOString()
      };
      setParagraphs(prev => [...prev, newParagraph]);
    }
    
    // Move to next question or end
    if (currentQuestionIndex < selectedTopic.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentResponse('');
    } else {
      toast({
        title: 'Topic Complete',
        description: 'You have answered all questions in this topic.',
      });
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      // Load previous response if it exists
      const previousResponse = questionResponses[currentQuestionIndex - 1];
      if (previousResponse) {
        setCurrentResponse(previousResponse.answer);
      }
    }
  };

  const endQuestionSession = () => {
    if (questionResponses.length > 0 || currentResponse.trim()) {
      saveSession();
    }
    setSessionMode('topic-select');
    setSelectedTopic(null);
    setCurrentQuestionIndex(0);
    setQuestionResponses([]);
    setCurrentResponse('');
    setCurrentSession(null);
    toast({
      title: 'Session Ended',
      description: 'Your responses have been saved.',
    });
  };

  const startFreeFormSession = () => {
    setSessionMode('free-form');
    startNewSession();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="bg-white"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Ketamine Journal
              </h1>
              <p className="text-gray-600 mt-1">A space for reflection and guided self-exploration</p>
            </div>
          </div>
          {!currentSession && sessionMode === 'topic-select' && (
            <div className="flex gap-3">
              <Button
                onClick={startFreeFormSession}
                size="lg"
                variant="outline"
                className="bg-white shadow-lg hover:shadow-xl transition-all"
              >
                <Edit3 className="w-5 h-5 mr-2" />
                Free Form Journal
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white shadow-md">
            <TabsTrigger value="record" className="text-lg">
              <BrainCircuit className="w-5 h-5 mr-2" />
              Journal Session
            </TabsTrigger>
            <TabsTrigger value="history" className="text-lg">
              <FileText className="w-5 h-5 mr-2" />
              Past Sessions
            </TabsTrigger>
          </TabsList>

          {/* Recording Tab */}
          <TabsContent value="record" className="space-y-6">
            {currentSession ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Recording Area */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Recording Controls */}
                  <Card className="bg-white shadow-xl border-2 border-indigo-100">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mic className="w-6 h-6 text-indigo-600" />
                        Audio Recording
                      </CardTitle>
                      <CardDescription>
                        Record your thoughts in segments. Each segment will be transcribed automatically.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Recording Timer */}
                        <div className="text-center">
                          <div className="text-6xl font-bold text-indigo-600 mb-2 font-mono">
                            {formatTime(recordingTime)}
                          </div>
                          {isRecording && (
                            <Badge variant={isPaused ? "secondary" : "default"} className="text-sm">
                              {isPaused ? 'Paused' : 'Recording...'}
                            </Badge>
                          )}
                        </div>

                        {/* Recording Buttons */}
                        <div className="flex justify-center gap-4">
                          {!isRecording ? (
                            <Button
                              onClick={startRecording}
                              size="lg"
                              className="bg-red-500 hover:bg-red-600 text-white rounded-full w-20 h-20 shadow-lg"
                              disabled={isTranscribing}
                            >
                              <Mic className="w-8 h-8" />
                            </Button>
                          ) : (
                            <>
                              <Button
                                onClick={togglePause}
                                size="lg"
                                variant="outline"
                                className="rounded-full w-16 h-16"
                              >
                                {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
                              </Button>
                              <Button
                                onClick={stopRecording}
                                size="lg"
                                className="bg-gray-900 hover:bg-gray-800 text-white rounded-full w-20 h-20 shadow-lg"
                              >
                                <MicOff className="w-8 h-8" />
                              </Button>
                            </>
                          )}
                        </div>

                        {/* Transcription Status */}
                        {isTranscribing && (
                          <div className="flex items-center justify-center gap-3 text-indigo-600">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Transcribing your words...</span>
                          </div>
                        )}

                        {isGeneratingFollowUp && (
                          <div className="flex items-center justify-center gap-3 text-purple-600">
                            <Sparkles className="w-5 h-5 animate-pulse" />
                            <span>Generating follow-up question...</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Paragraphs Display */}
                  <Card className="bg-white shadow-xl border-2 border-purple-100">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-6 h-6 text-purple-600" />
                        Your Journal Entry
                      </CardTitle>
                      <CardDescription>
                        {paragraphs.length} paragraph{paragraphs.length !== 1 ? 's' : ''} recorded
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {paragraphs.length === 0 ? (
                          <div className="text-center text-gray-400 py-8">
                            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No paragraphs yet. Start recording to begin.</p>
                          </div>
                        ) : (
                          paragraphs.map((paragraph, index) => (
                            <motion.div
                              key={paragraph.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Clock className="w-4 h-4" />
                                  {new Date(paragraph.timestamp).toLocaleTimeString()}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => startEditingParagraph(index, paragraph.text)}
                                    size="sm"
                                    variant="ghost"
                                    className="h-8"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              {editingParagraphIndex === index ? (
                                <div className="space-y-2">
                                  <Textarea
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="min-h-24 bg-white"
                                  />
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={saveEditedParagraph}
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle2 className="w-4 h-4 mr-2" />
                                      Save
                                    </Button>
                                    <Button
                                      onClick={() => setEditingParagraphIndex(null)}
                                      size="sm"
                                      variant="outline"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-gray-800 leading-relaxed">{paragraph.text}</p>
                              )}
                            </motion.div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Mood Tracker */}
                  <Card className="bg-white shadow-xl border-2 border-pink-100">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="w-6 h-6 text-pink-600" />
                        Mood Check
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className={`text-6xl mb-2 ${getMoodEmoji(sessionMood).color}`}>
                          {getMoodEmoji(sessionMood).icon}
                        </div>
                        <div className="text-2xl font-bold text-gray-800">
                          {getMoodEmoji(sessionMood).label}
                        </div>
                      </div>
                      <Slider
                        value={[sessionMood]}
                        onValueChange={(value) => setSessionMood(value[0])}
                        max={100}
                        step={5}
                        className="my-4"
                      />
                      <div className="text-center text-sm text-gray-600">
                        {sessionMood}/100
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Follow-up */}
                  <AnimatePresence>
                    {showFollowUpPrompt && aiFollowUpQuestion && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        <Card className="bg-gradient-to-br from-purple-100 to-pink-100 shadow-xl border-2 border-purple-300">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-purple-700">
                              <Sparkles className="w-6 h-6" />
                              AI Follow-up
                            </CardTitle>
                            <Button
                              onClick={() => setShowFollowUpPrompt(false)}
                              size="sm"
                              variant="ghost"
                              className="absolute top-4 right-4"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </CardHeader>
                          <CardContent>
                            <div className="bg-white/80 p-4 rounded-lg">
                              <p className="text-gray-800 italic">{aiFollowUpQuestion}</p>
                            </div>
                            <Button
                              onClick={startRecording}
                              className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                              disabled={isRecording}
                            >
                              <Mic className="w-4 h-4 mr-2" />
                              Respond
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Session Actions */}
                  <Card className="bg-white shadow-xl border-2 border-gray-100">
                    <CardHeader>
                      <CardTitle>Session Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        onClick={saveSession}
                        className="w-full bg-green-600 hover:bg-green-700"
                        disabled={paragraphs.length === 0}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Session
                      </Button>
                      <Button
                        onClick={() => {
                          setCurrentSession(null);
                          setParagraphs([]);
                          setAudioSegments([]);
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Clear & Restart
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : sessionMode === 'topic-select' ? (
              <div className="space-y-6">
                <Card className="bg-white shadow-xl border-2 border-indigo-100">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <List className="w-7 h-7 text-indigo-600" />
                      Choose a Topic to Explore
                    </CardTitle>
                    <CardDescription className="text-base">
                      Select a guided topic or start a free-form journal session
                    </CardDescription>
                  </CardHeader>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getAllTopics().map((topic) => (
                    <motion.div
                      key={topic.id}
                      whileHover={{ scale: 1.03, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        onClick={() => selectTopic(topic.id)}
                        className="bg-white shadow-lg hover:shadow-2xl transition-all cursor-pointer border-2 hover:border-indigo-400 h-full"
                      >
                        <CardHeader>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-4xl">{topic.icon}</div>
                            <CardTitle className="text-lg">{topic.title}</CardTitle>
                          </div>
                          <CardDescription className="text-sm">
                            {topic.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-gray-600">
                            <Badge variant="secondary" className="text-xs">
                              {topic.questions.length} questions
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : sessionMode === 'question-flow' && selectedTopic ? (
              <div className="space-y-6">
                {/* Question Progress */}
                <Card className="bg-white shadow-xl border-2 border-indigo-100">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{selectedTopic.icon}</div>
                        <div>
                          <CardTitle>{selectedTopic.title}</CardTitle>
                          <CardDescription>
                            Question {currentQuestionIndex + 1} of {selectedTopic.questions.length}
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        onClick={endQuestionSession}
                        variant="destructive"
                        size="sm"
                      >
                        <StopCircle className="w-4 h-4 mr-2" />
                        End Session
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress
                      value={((currentQuestionIndex + 1) / selectedTopic.questions.length) * 100}
                      className="h-2"
                    />
                  </CardContent>
                </Card>

                {/* Current Question */}
                <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 shadow-2xl border-2 border-indigo-200">
                  <CardHeader>
                    <CardTitle className="text-2xl text-indigo-900">
                      {selectedTopic.questions[currentQuestionIndex]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="response" className="text-lg text-gray-700 mb-2 block">
                        Your Response
                      </Label>
                      <Textarea
                        id="response"
                        value={currentResponse}
                        onChange={(e) => setCurrentResponse(e.target.value)}
                        placeholder="Take your time to reflect and respond..."
                        className="min-h-[200px] text-base bg-white border-2 border-indigo-200 focus:border-indigo-400"
                      />
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between gap-4">
                      <Button
                        onClick={handlePreviousQuestion}
                        variant="outline"
                        disabled={currentQuestionIndex === 0}
                        size="lg"
                      >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Previous
                      </Button>
                      <Button
                        onClick={handleNextQuestion}
                        disabled={!currentResponse.trim()}
                        size="lg"
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        {currentQuestionIndex < selectedTopic.questions.length - 1 ? (
                          <>
                            Next Question
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </>
                        ) : (
                          <>
                            Complete Topic
                            <CheckCircle2 className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Previous Responses */}
                {questionResponses.length > 0 && (
                  <Card className="bg-white shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        Your Responses ({questionResponses.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {questionResponses.map((resp, idx) => (
                          <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-sm font-semibold text-indigo-600 mb-2">Q: {resp.question}</p>
                            <p className="text-gray-700">{resp.answer}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : null}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            {sessions.length === 0 ? (
              <Card className="bg-white shadow-xl">
                <CardContent className="py-16">
                  <div className="text-center">
                    <FileText className="w-20 h-20 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No Sessions Yet</h2>
                    <p className="text-gray-600">Your journal sessions will appear here</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              sessions.sort((a, b) => new Date(b.startTime) - new Date(a.startTime)).map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-l-4 border-indigo-500">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-indigo-600" />
                            {new Date(session.startTime).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatTime(session.duration)}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {session.paragraphs?.length || 0} paragraphs
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              Mood: {session.mood}/100
                            </span>
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => exportSession(session)}
                            size="sm"
                            variant="outline"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => deleteSession(session.id)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {session.paragraphs?.slice(0, 2).map((paragraph, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <p className="text-gray-700 line-clamp-3">{paragraph.text}</p>
                          </div>
                        ))}
                        {session.paragraphs?.length > 2 && (
                          <p className="text-sm text-gray-500 text-center">
                            + {session.paragraphs.length - 2} more paragraph{session.paragraphs.length - 2 !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default KetamineJournalAdvanced;
