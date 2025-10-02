import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Mic, Square, BrainCircuit, Download, Save, History, Edit, RotateCcw, Loader2, X, Trash2, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast"
import questionBank from '@/data/ketamineQuestionBank.js';
import AudioService from '@/services/audioService.js';
import PDFService from '@/services/pdfService.js';
import AIService from '@/services/aiService.js';
import { getSessions, saveSession, deleteSession } from '@/utils/ketamineSessionStorage.js';
import AIVoiceResponse from './AIVoiceResponse';

const KetamineTherapy = ({ onBack }) => {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState('Click "New Question" to begin.');
  const [isRecording, setIsRecording] = useState(false);
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

  const audioService = useRef(new AudioService());

  useEffect(() => {
    setSessionHistory(getSessions());
  }, []);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const resetState = () => {
    setAudioURL('');
    setTranscription('');
    setFollowUpQuestion('');
    setRecordingTime(0);
    setIsRecording(false);
  };

  const handleNewQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questionBank.length);
    setCurrentQuestion(questionBank[randomIndex]);
    resetState();
  };

  const handleToggleRecording = async () => {
    if (isRecording) {
      const audioBlob = await audioService.current.stopRecording();
      setAudioURL(URL.createObjectURL(audioBlob));
      setIsRecording(false);
      setIsTranscribing(true);
      if (!audioService.current.isTranscriptionSupported()) {
        try {
          const transcript = await audioService.current.transcribeAudio(audioBlob);
          setTranscription(transcript);
        } catch (error) {
          console.error("Transcription error:", error);
          setTranscription("Transcription failed. Please edit manually.");
          toast({
            variant: "destructive",
            title: "Transcription Failed",
            description: error.message,
          })
        } finally {
          setIsTranscribing(false);
        }
      }
    } else {
      try {
        await audioService.current.startRecording();
        setIsRecording(true);
        setRecordingTime(0);
        setTranscription('');
        if (audioService.current.isTranscriptionSupported()) {
          setIsTranscribing(true);
          audioService.current.setupTranscription(
            (final, interim) => {
              setTranscription(final + interim);
            },
            () => {
              setIsTranscribing(false);
            }
          );
        }
      } catch (error) {
        console.error("Could not start recording:", error);
        toast({
          variant: "destructive",
          title: "Recording Error",
          description: "Could not access the microphone. Please ensure you have granted permission.",
        })
      }
    }
  };

  const handleGenerateFollowUp = async () => {
    if (!transcription) return alert("Please provide a response before generating a follow-up.");
    setIsGeneratingFollowUp(true);
    try {
      const followup = await AIService.generateFollowUp(currentQuestion, transcription);
      setFollowUpQuestion(followup);
    } catch (error) {
      console.error("Failed to generate AI follow-up:", error);
      setFollowUpQuestion("Sorry, I couldn't generate a follow-up question at the moment.");
      toast({
        variant: "destructive",
        title: "AI Follow-up Failed",
        description: error.message,
      })
    } finally {
      setIsGeneratingFollowUp(false);
    }
  };

  const handleExport = async () => {
    if (!currentQuestion || !transcription) return alert("Please record a response before exporting.");
    setIsExporting(true);
    try {
      const sessionData = { questions: [currentQuestion], responses: [transcription], followups: [followUpQuestion] };
      const pdfBlob = await PDFService.generatePDF(sessionData);
      PDFService.savePDF(pdfBlob, `ketamine-reflection-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error("Failed to export PDF:", error);
      toast({
        variant: "destructive",
        title: "PDF Export Failed",
        description: "There was an error generating the PDF.",
      })
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveSession = () => {
    if (!transcription) return alert("Please record a response before saving.");
    const sessionData = { question: currentQuestion, response: transcription, followup: followUpQuestion };
    const newSession = saveSession(sessionData);
    if (newSession) {
      setSessionHistory(prev => [newSession, ...prev]);
      toast({ title: "Session Saved", description: "Your reflection has been saved." })
    }
  };

  const handleLoadSession = (session) => {
    setCurrentQuestion(session.question);
    setTranscription(session.response);
    setFollowUpQuestion(session.followup);
    setAudioURL('');
    setRecordingTime(0);
    setIsRecording(false);
    setShowHistoryPanel(false);
  };

  const handleDeleteSession = (sessionId) => {
    const updatedSessions = deleteSession(sessionId);
    if (updatedSessions) {
      setSessionHistory(updatedSessions);
    }
  };

  const cardVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } } };

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <Button onClick={onBack} variant="ghost" className="mb-8 self-start">
            <ChevronLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Ketamine Journal</h1>
            <p className="text-lg text-gray-400 mt-2">A space for reflection and guided self-exploration.</p>
          </header>
          <motion.div className="space-y-8" variants={cardVariants} initial="hidden" animate="visible">
            {/* Main content cards */}
            <motion.div variants={cardVariants}>
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader><CardTitle className="text-2xl text-gray-200">Reflection Question</CardTitle></CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center">
                  <p className="text-xl md:text-2xl font-medium text-white min-h-[6rem] flex items-center">{currentQuestion}</p>
                  <Button onClick={handleNewQuestion} className="mt-6 bg-purple-600 hover:bg-purple-700"><RotateCcw className="w-4 h-4 mr-2" /> New Question</Button>
                </CardContent>
              </Card>
            </motion.div>
            {/* Other cards go here */}
            <motion.div variants={cardVariants}>
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-200">Record Your Answer</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-6">
                <Button onClick={handleToggleRecording} size="lg" className={`w-48 ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>
                  {isRecording ? <Square className="w-5 h-5 mr-2" /> : <Mic className="w-5 h-5 mr-2" />}
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </Button>
                <AnimatePresence>
                  {isRecording && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-lg font-mono text-cyan-400">
                      {formatTime(recordingTime)}
                    </motion.div>
                  )}
                </AnimatePresence>
                {audioURL && (<div className="w-full pt-4"><audio src={audioURL} controls className="w-full" /></div>)}
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants}>
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl text-gray-200">Your Response</CardTitle>
                <Button onClick={() => setIsEditing(!isEditing)} variant="ghost" size="sm"><Edit className="w-4 h-4 mr-2" />{isEditing ? 'Save' : 'Edit'}</Button>
              </CardHeader>
              <CardContent>
                <Textarea value={transcription} onChange={(e) => setTranscription(e.target.value)} readOnly={!isEditing} placeholder={isTranscribing ? "Transcribing..." : "Your transcribed response will appear here..."} className="min-h-[150px] bg-gray-900/50 border-gray-600 text-gray-200 focus:ring-purple-500" />
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants}>
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader><CardTitle className="text-2xl text-gray-200">AI Follow-up</CardTitle></CardHeader>
              <CardContent className="flex flex-col items-center space-y-4 text-center">
                <Button onClick={handleGenerateFollowUp} disabled={!transcription || isGeneratingFollowUp} className="bg-blue-600 hover:bg-blue-700">
                  {isGeneratingFollowUp ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BrainCircuit className="w-4 h-4 mr-2" />}
                  Generate Follow-up
                </Button>
                {isGeneratingFollowUp && !followUpQuestion && <Loader2 className="w-6 h-6 text-teal-300 animate-spin mt-4" />}
                <AIVoiceResponse text={followUpQuestion} />
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants}>
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader><CardTitle className="text-2xl text-gray-200">Session Tools</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap items-center justify-center gap-4">
                <Button onClick={handleSaveSession} variant="outline"><Save className="w-4 h-4 mr-2" />Save Session</Button>
                <Button onClick={handleExport} variant="outline" disabled={isExporting}>
                  {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                  {isExporting ? 'Exporting...' : 'Export to PDF'}
                </Button>
                <Button onClick={() => setShowHistoryPanel(true)} variant="outline"><History className="w-4 h-4 mr-2" />View History</Button>
              </CardContent>
            </Card>
          </motion.div>
          </motion.div>
        </div>
      </div>

      {/* History Panel */}
      <AnimatePresence>
        {showHistoryPanel && (
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-gray-800 shadow-lg z-50 flex flex-col"
          >
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Session History</h2>
              <Button onClick={() => setShowHistoryPanel(false)} variant="ghost" size="icon"><X className="w-6 h-6" /></Button>
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {sessionHistory.length > 0 ? (
                sessionHistory.map(session => (
                  <Card key={session.id} className="bg-gray-700/50">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-bold">{session.question.substring(0, 40)}...</p>
                        <p className="text-sm text-gray-400">{session.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button onClick={() => handleLoadSession(session)} size="sm" variant="outline"><BookOpen className="w-4 h-4 mr-2" /> Load</Button>
                        <Button onClick={() => handleDeleteSession(session.id)} size="sm" variant="destructive"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-gray-400 mt-8">No saved sessions yet.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default KetamineTherapy;
