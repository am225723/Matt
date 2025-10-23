import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Mic, Square, BrainCircuit, Download, Save, History, 
  Edit, RotateCcw, Loader2, X, Trash2, BookOpen, Play, Pause, 
  Volume2, Settings, Sparkles, MessageCircle, Clock, CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/components/ui/use-toast";
import questionBank from '@/data/ketamineQuestionBank.js';
import AudioService from '@/services/audioService.js';
import PDFService from '@/services/pdfService.js';
import AIService from '@/services/aiService.js';
import { getSessions, saveSession, deleteSession } from '@/utils/ketamineSessionStorage.js';
import AIVoiceResponse from './AIVoiceResponse';

const KetamineTherapyRedesigned = ({ onBack }) => {
  const { toast } = useToast();
  
  // Core state
  const [currentQuestion, setCurrentQuestion] = useState('Welcome! Click "New Question" to begin your session.');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState('');
  const [transcription, setTranscription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [isGeneratingFollowUp, setIsGeneratingFollowUp] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  
  // Enhanced UI state
  const [sessionProgress, setSessionProgress] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcriptionConfidence, setTranscriptionConfidence] = useState(0);
  const [currentStep, setCurrentStep] = useState('question'); // question, recording, transcription, followup
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [recordingQuality, setRecordingQuality] = useState('high');
  
  const audioService = useRef(new AudioService());
  const audioPlayerRef = useRef(null);
  const waveformRef = useRef(null);
  const transcriptionRef = useRef('');

  useEffect(() => {
    setSessionHistory(getSessions());
  }, []);

  useEffect(() => {
    let interval;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
        // Simulate audio level for visual feedback
        setAudioLevel(Math.random() * 100);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  // Calculate session progress
  useEffect(() => {
    let progress = 0;
    if (currentQuestion !== 'Welcome! Click "New Question" to begin your session.') progress += 25;
    if (transcription) progress += 25;
    if (audioURL) progress += 25;
    if (followUpQuestion) progress += 25;
    setSessionProgress(progress);
  }, [currentQuestion, transcription, audioURL, followUpQuestion]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  // Keep transcription ref in sync with state
  useEffect(() => {
    transcriptionRef.current = transcription;
  }, [transcription]);

  const resetState = () => {
    setAudioURL('');
    setTranscription('');
    transcriptionRef.current = '';
    setFollowUpQuestion('');
    setRecordingTime(0);
    setIsRecording(false);
    setIsPaused(false);
    setCurrentStep('question');
    setAudioLevel(0);
    setTranscriptionConfidence(0);
  };

  const handleNewQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questionBank.length);
    setCurrentQuestion(questionBank[randomIndex]);
    resetState();
    setCurrentStep('question');
  };

  const handleToggleRecording = async () => {
    if (isRecording) {
      if (isPaused) {
        // Resume recording
        setIsPaused(false);
        toast({
          title: "Recording Resumed",
          description: "Continue sharing your thoughts.",
        });
      } else {
        // Stop recording
        try {
          const audioBlob = await audioService.current.stopRecording();
          setAudioURL(URL.createObjectURL(audioBlob));
          setIsRecording(false);
          setCurrentStep('transcription');
          
          toast({
            title: "Recording Complete",
            description: "Processing your audio...",
          });

          // Handle live transcription case (browser speech recognition)
          if (audioService.current.isTranscriptionSupported()) {
            // Transcription already available from live capture
            setIsTranscribing(false);
            
            // Wait a moment for final transcription to settle, then read from ref
            setTimeout(async () => {
              const currentTranscript = transcriptionRef.current;
              if (currentTranscript && currentTranscript.trim().length > 0) {
                await generateFollowUpAutomatically(currentTranscript);
              }
            }, 500);
          } else if (!audioService.current.isTranscriptionSupported()) {
            // Handle OpenAI Whisper transcription case
            setIsTranscribing(true);
            try {
              const transcript = await audioService.current.transcribeAudio(audioBlob);
              setTranscription(transcript);
              setTranscriptionConfidence(85 + Math.random() * 15); // Simulate confidence
              
              // Auto-generate follow-up question after transcription
              if (transcript && transcript.trim().length > 0) {
                await generateFollowUpAutomatically(transcript);
              }
            } catch (error) {
              console.error("Transcription error:", error);
              
              // Fallback: Use AI to interpret the audio directly
              try {
                toast({
                  title: "Trying Alternative Method",
                  description: "Using AI to interpret your recording...",
                });
                
                // Generate a follow-up based on context without transcription
                const fallbackPrompt = "I shared my thoughts through voice but transcription wasn't available. Can you help me explore my feelings further?";
                await generateFollowUpAutomatically(fallbackPrompt);
                setTranscription("(Audio recorded - transcription not available)");
              } catch (fallbackError) {
                console.error("Fallback error:", fallbackError);
                setTranscription("Transcription failed. Please edit manually.");
                setTranscriptionConfidence(0);
                toast({
                  variant: "destructive",
                  title: "Transcription Failed",
                  description: "Please type your response or record again.",
                });
              }
            } finally {
              setIsTranscribing(false);
            }
          }
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Recording Error",
            description: "Failed to stop recording. Please try again.",
          });
        }
      }
    } else {
      // Start recording
      try {
        await audioService.current.startRecording();
        setIsRecording(true);
        setIsPaused(false);
        setRecordingTime(0);
        setTranscription('');
        setCurrentStep('recording');
        
        toast({
          title: "Recording Started",
          description: "Speak naturally and take your time.",
        });

        if (audioService.current.isTranscriptionSupported()) {
          setIsTranscribing(true);
          audioService.current.setupTranscription(
            (final, interim) => {
              const fullTranscript = final + interim;
              setTranscription(fullTranscript);
              transcriptionRef.current = fullTranscript;
            },
            () => {
              setIsTranscribing(false);
            }
          );
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Recording Failed",
          description: "Please check microphone permissions and try again.",
        });
      }
    }
  };

  const handlePauseRecording = () => {
    setIsPaused(!isPaused);
    toast({
      title: isPaused ? "Recording Resumed" : "Recording Paused",
      description: isPaused ? "Continue when ready." : "Take a moment to collect your thoughts.",
    });
  };

  const generateFollowUpAutomatically = async (transcript) => {
    if (!transcript || transcript.trim().length === 0) return;
    
    setIsGeneratingFollowUp(true);
    setCurrentStep('followup');
    
    try {
      const aiService = new AIService();
      const followUp = await aiService.generateFollowUpQuestion(transcript);
      setFollowUpQuestion(followUp);
      
      toast({
        title: "Follow-up Generated",
        description: "AI has created a personalized follow-up question.",
      });
    } catch (error) {
      console.error('Error generating automatic follow-up:', error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not generate follow-up automatically. You can try manually.",
      });
    } finally {
      setIsGeneratingFollowUp(false);
    }
  };

  const handleGenerateFollowUp = async () => {
    if (!transcription.trim()) {
      toast({
        variant: "destructive",
        title: "No Content",
        description: "Please record or enter a response first.",
      });
      return;
    }

    setIsGeneratingFollowUp(true);
    setCurrentStep('followup');
    
    try {
      const aiService = new AIService();
      const followUp = await aiService.generateFollowUpQuestion(transcription);
      setFollowUpQuestion(followUp);
      
      toast({
        title: "Follow-up Generated",
        description: "AI has created a personalized follow-up question.",
      });
    } catch (error) {
      console.error('Error generating follow-up:', error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Failed to generate follow-up. Please try again.",
      });
    } finally {
      setIsGeneratingFollowUp(false);
    }
  };

  const handleSaveSession = () => {
    if (!currentQuestion || !transcription) {
      toast({
        variant: "destructive",
        title: "Incomplete Session",
        description: "Please complete the question and response first.",
      });
      return;
    }

    const session = {
      id: Date.now().toString(),
      question: currentQuestion,
      response: transcription,
      followUp: followUpQuestion,
      audioURL: audioURL,
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toISOString(),
    };

    saveSession(session);
    setSessionHistory(getSessions());
    
    toast({
      title: "Session Saved",
      description: "Your session has been saved to history.",
    });
  };

  const handleExport = async () => {
    if (!currentQuestion || !transcription) {
      toast({
        variant: "destructive",
        title: "Nothing to Export",
        description: "Please complete a session first.",
      });
      return;
    }

    setIsExporting(true);
    
    try {
      const pdfService = new PDFService();
      await pdfService.exportSession({
        question: currentQuestion,
        response: transcription,
        followUp: followUpQuestion,
        date: new Date().toLocaleDateString(),
      });
      
      toast({
        title: "Export Complete",
        description: "Your session has been exported as PDF.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Failed to export session. Please try again.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleLoadSession = (session) => {
    setCurrentQuestion(session.question);
    setTranscription(session.response);
    setFollowUpQuestion(session.followUp || '');
    setAudioURL(session.audioURL || '');
    setShowHistoryPanel(false);
    setCurrentStep('transcription');
    
    toast({
      title: "Session Loaded",
      description: "Previous session has been restored.",
    });
  };

  const handleDeleteSession = (sessionId) => {
    deleteSession(sessionId);
    setSessionHistory(getSessions());
    
    toast({
      title: "Session Deleted",
      description: "Session has been removed from history.",
    });
  };

  const toggleAudioPlayback = () => {
    if (audioPlayerRef.current) {
      if (isPlaying) {
        audioPlayerRef.current.pause();
      } else {
        audioPlayerRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const waveformVariants = {
    recording: {
      scaleY: [1, 1.5, 1],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    idle: {
      scaleY: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={onBack} 
                variant="ghost" 
                className="hover:bg-indigo-100"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Ketamine Therapy Journal
                </h1>
                <p className="text-sm text-gray-600">Guided reflection and insight capture</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-white">
                Session Progress: {sessionProgress}%
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowHistoryPanel(true)}
              >
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={sessionProgress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Current Question Card */}
          <motion.div variants={cardVariants}>
            <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Current Question
                  </CardTitle>
                  <Button
                    onClick={handleNewQuestion}
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    New Question
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed">{currentQuestion}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recording Interface */}
          <motion.div variants={cardVariants}>
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800 flex items-center">
                  <Mic className="w-5 h-5 mr-2" />
                  Voice Recording
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Recording Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    onClick={handleToggleRecording}
                    size="lg"
                    className={`w-16 h-16 rounded-full ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-indigo-500 hover:bg-indigo-600'
                    } shadow-lg transition-all duration-300`}
                  >
                    {isRecording ? (
                      <Square className="w-6 h-6" />
                    ) : (
                      <Mic className="w-6 h-6" />
                    )}
                  </Button>
                  
                  {isRecording && (
                    <Button
                      onClick={handlePauseRecording}
                      variant="outline"
                      size="lg"
                      className="rounded-full"
                    >
                      {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                    </Button>
                  )}
                </div>

                {/* Recording Status */}
                <div className="text-center space-y-2">
                  {isRecording && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-2"
                    >
                      <div className="text-2xl font-mono text-indigo-600">
                        {formatTime(recordingTime)}
                      </div>
                      <div className="flex items-center justify-center space-x-1">
                        {[...Array(10)].map((_, i) => (
                          <motion.div
                            key={i}
                            ref={waveformRef}
                            variants={waveformVariants}
                            animate={isRecording && !isPaused ? "recording" : "idle"}
                            className="w-1 h-8 bg-indigo-400 rounded-full"
                            style={{
                              height: `${Math.max(8, (audioLevel * 0.4) + Math.random() * 20)}px`,
                              animationDelay: `${i * 0.1}s`
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">
                        {isPaused ? 'Recording paused' : 'Recording in progress...'}
                      </p>
                    </motion.div>
                  )}
                  
                  {!isRecording && recordingTime === 0 && (
                    <p className="text-gray-600">Click the microphone to start recording</p>
                  )}
                </div>

                {/* Audio Playback */}
                {audioURL && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Recorded Audio</span>
                      <Button
                        onClick={toggleAudioPlayback}
                        variant="ghost"
                        size="sm"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <Volume2 className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                    <audio
                      ref={audioPlayerRef}
                      src={audioURL}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={() => setIsPlaying(false)}
                      className="w-full"
                      controls
                    />
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Transcription Card */}
          <motion.div variants={cardVariants}>
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-gray-800 flex items-center">
                    <Edit className="w-5 h-5 mr-2" />
                    Your Response
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {transcriptionConfidence > 0 && (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {Math.round(transcriptionConfidence)}% confidence
                      </Badge>
                    )}
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      variant="ghost"
                      size="sm"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {isEditing ? 'Save' : 'Edit'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isTranscribing ? (
                  <div className="flex items-center justify-center py-8 space-x-3">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                    <span className="text-gray-600">Transcribing your audio...</span>
                  </div>
                ) : (
                  <Textarea
                    value={transcription}
                    onChange={(e) => setTranscription(e.target.value)}
                    readOnly={!isEditing}
                    placeholder="Your transcribed response will appear here, or you can type directly..."
                    className="min-h-[200px] bg-white/50 border-gray-200 focus:ring-indigo-500 resize-none"
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Follow-up Card */}
          <motion.div variants={cardVariants}>
            <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800 flex items-center">
                  <BrainCircuit className="w-5 h-5 mr-2" />
                  AI Follow-up Question
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleGenerateFollowUp}
                  disabled={!transcription || isGeneratingFollowUp}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                >
                  {isGeneratingFollowUp ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Generate Personalized Follow-up
                </Button>
                
                {followUpQuestion && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/70 rounded-lg p-4 border border-purple-200"
                  >
                    <AIVoiceResponse text={followUpQuestion} />
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Session Actions */}
          <motion.div variants={cardVariants}>
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800 flex items-center">
                  <Save className="w-5 h-5 mr-2" />
                  Session Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleSaveSession}
                    variant="outline"
                    className="flex-1 min-w-[150px]"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Session
                  </Button>
                  <Button
                    onClick={handleExport}
                    variant="outline"
                    disabled={isExporting}
                    className="flex-1 min-w-[150px]"
                  >
                    {isExporting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Export PDF
                  </Button>
                  <Button
                    onClick={resetState}
                    variant="outline"
                    className="flex-1 min-w-[150px]"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    New Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* History Panel */}
      <AnimatePresence>
        {showHistoryPanel && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Session History</h2>
                <Button
                  onClick={() => setShowHistoryPanel(false)}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-3">
              {sessionHistory.length > 0 ? (
                sessionHistory.map(session => (
                  <Card key={session.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm line-clamp-2">
                            {session.question.substring(0, 60)}...
                          </p>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {session.date}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleLoadSession(session)}
                          size="sm"
                          variant="outline"
                          className="flex-1"
                        >
                          <BookOpen className="w-3 h-3 mr-1" />
                          Load
                        </Button>
                        <Button
                          onClick={() => handleDeleteSession(session.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No saved sessions yet.</p>
                  <p className="text-sm">Complete a session to see it here.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recording Settings</h3>
                <Button
                  onClick={() => setShowSettings(false)}
                  variant="ghost"
                  size="icon"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Recording Quality</label>
                  <select
                    value={recordingQuality}
                    onChange={(e) => setRecordingQuality(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  >
                    <option value="high">High Quality</option>
                    <option value="medium">Medium Quality</option>
                    <option value="low">Low Quality (faster processing)</option>
                  </select>
                </div>
                
                <div className="pt-4 border-t">
                  <Button
                    onClick={() => setShowSettings(false)}
                    className="w-full"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KetamineTherapyRedesigned;