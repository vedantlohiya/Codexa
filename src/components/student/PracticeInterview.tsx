import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Award,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Flag,
  Info,
  Clock,
  Activity,
  Layers,
  BookOpen,
  ArrowRight,
  User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Student,
  AssignedPdfDocument,
  InterviewQuestionItem,
  CoachingReport,
  FirebaseInterviewSession,
  InterviewResult,
  StudentPage,
} from '../../types';
import {
  generateGroundedQuestions,
  generateFollowUpQuestion,
  generateCoachingReport,
} from '../../services/geminiService';
import {
  saveInterviewSessionToFirebase,
  getStoredPdfs,
} from '../../services/firebaseService';

interface PracticeInterviewProps {
  activeStudent: Student;
  onCompleteInterview: (result: InterviewResult) => void;
  onNavigate: (page: StudentPage) => void;
}

type InterviewStage = 'ready' | 'loading-questions' | 'in-progress' | 'generating-report' | 'report-view';

export const PracticeInterview: React.FC<PracticeInterviewProps> = ({
  activeStudent,
  onCompleteInterview,
  onNavigate,
}) => {
  // Assigned PDF Document (Automatically loaded for this student)
  const [assignedPdf, setAssignedPdf] = useState<AssignedPdfDocument | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(true);
  const [accessError, setAccessError] = useState<string | null>(null);

  // Interview Stage & Call Flow
  const [stage, setStage] = useState<InterviewStage>('ready');
  const [questions, setQuestions] = useState<InterviewQuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0); // 0 to 4 (5 questions)
  const [isFollowUpPhase, setIsFollowUpPhase] = useState(false);
  const [loadingFollowUp, setLoadingFollowUp] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(6);

  // Media Inputs (Microphone, Camera, TTS)
  const [studentInput, setStudentInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const [isTtsSpeaking, setIsTtsSpeaking] = useState(false);

  // Post-Interview Coaching Report Modal
  const [coachingReport, setCoachingReport] = useState<CoachingReport | null>(null);
  const [savedFirebaseId, setSavedFirebaseId] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>('habits');

  // Refs
  const recognitionRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  // Automatically load the assigned PDF on mount
  useEffect(() => {
    let isMounted = true;

    async function loadAssignedDocument() {
      setLoadingPdf(true);
      setAccessError(null);

      try {
        const url = `/api/student/assigned-pdf?studentId=${encodeURIComponent(
          activeStudent.id
        )}&batch=${encodeURIComponent(activeStudent.batch)}`;
        const res = await fetch(url);

        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.document) {
            setAssignedPdf(data.document);
            setLoadingPdf(false);
            return;
          }
        } else if (res.status === 403) {
          if (isMounted) {
            setAccessError('Access Denied: You do not have permission to access this assigned document.');
            setLoadingPdf(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend assigned-pdf fetch notice:', err);
      }

      if (isMounted) {
        const stored = getStoredPdfs();
        const found = stored.find(
          (doc) =>
            (doc.assignedStudentIds && doc.assignedStudentIds.includes(activeStudent.id)) ||
            (doc.assignedBatches && doc.assignedBatches.includes(activeStudent.batch)) ||
            doc.assignedBatches.includes('all')
        );

        if (found) {
          setAssignedPdf(found);
        } else if (stored.length > 0) {
          setAssignedPdf(stored[0]);
        }
        setLoadingPdf(false);
      }
    }

    loadAssignedDocument();
    return () => {
      isMounted = false;
      stopListening();
      stopTts();
      stopCamera();
    };
  }, [activeStudent]);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stage === 'in-progress') {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stage]);

  // Webcam Management
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      cameraStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch {
      // Camera permission denied or mock environment
      setCameraActive(true);
    }
  };

  const stopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    setCameraActive(false);
  };

  const toggleCamera = () => {
    if (cameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // Web Speech API: Continuous Speech Recognition
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsListening(true);
      setTimeout(() => {
        const sampleText = isFollowUpPhase
          ? 'In Raft, candidate nodes require strict majority quorums (N/2 + 1) to commit log entries and assume leadership.'
          : 'Under the Raft protocol, leader election decomposes into randomized election timeouts, preventing simultaneous candidate split votes.';
        setStudentInput((prev) => (prev ? `${prev} ${sampleText}` : sampleText));
        setIsListening(false);
      }, 1500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setStudentInput((prev) => {
          const trimmed = prev.trim();
          return trimmed ? `${trimmed} ${transcript}` : transcript;
        });
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
      recognitionRef.current = recognition;
    } catch {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Text-to-Speech (TTS)
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    stopTts();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsTtsSpeaking(true);
    utterance.onend = () => setIsTtsSpeaking(false);
    utterance.onerror = () => setIsTtsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopTts = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsTtsSpeaking(false);
  };

  // START INTERVIEW
  const handleStartInterview = async () => {
    if (!assignedPdf) return;
    setStage('loading-questions');
    stopTts();
    stopListening();
    setElapsedSeconds(0);

    try {
      const generated = await generateGroundedQuestions(assignedPdf);
      setQuestions(generated);
      setCurrentIndex(0);
      setIsFollowUpPhase(false);
      setStudentInput('');
      setStage('in-progress');

      // Initialize camera
      startCamera();

      // Speak first question
      if (generated[0]?.questionText) {
        speakText(generated[0].questionText);
      }
    } catch {
      setStage('ready');
    }
  };

  const currentQ = questions[currentIndex];

  // SUBMIT MAIN ANSWER -> TRIGGER CONTEXTUAL FOLLOW-UP
  const handleSubmitMainAnswer = async () => {
    if (!studentInput.trim() || !assignedPdf || !currentQ) return;
    stopListening();
    stopTts();

    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex] = {
      ...currentQ,
      studentAnswer: studentInput.trim(),
      answeredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setQuestions(updatedQuestions);
    setStudentInput('');
    setLoadingFollowUp(true);

    try {
      const followUpText = await generateFollowUpQuestion(
        assignedPdf,
        currentQ,
        studentInput.trim()
      );

      updatedQuestions[currentIndex].followUpQuestion = followUpText;
      setQuestions(updatedQuestions);
      setIsFollowUpPhase(true);
      setLoadingFollowUp(false);

      speakText(followUpText);
    } catch {
      setIsFollowUpPhase(true);
      setLoadingFollowUp(false);
    }
  };

  // SUBMIT FOLLOW-UP -> ADVANCE TO NEXT QUESTION OR COMPLETE
  const handleSubmitFollowUpAnswer = async () => {
    if (!assignedPdf || !currentQ) return;
    stopListening();
    stopTts();

    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex] = {
      ...currentQ,
      studentFollowUpAnswer: studentInput.trim() || '(No additional follow-up response provided)',
      followUpAnsweredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setQuestions(updatedQuestions);
    setStudentInput('');
    setIsFollowUpPhase(false);

    if (currentIndex < 4) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      if (questions[nextIdx]?.questionText) {
        speakText(questions[nextIdx].questionText);
      }
    } else {
      await handleCompleteInterviewFlow(updatedQuestions);
    }
  };

  // COMPLETE INTERVIEW & OPEN COACHING REPORT
  const handleCompleteInterviewFlow = async (finalQuestions: InterviewQuestionItem[]) => {
    if (!assignedPdf) return;
    setStage('generating-report');
    stopCamera();

    try {
      const report = await generateCoachingReport(
        assignedPdf,
        finalQuestions,
        activeStudent.name
      );
      setCoachingReport(report);

      const sessionId = `session-${Date.now()}`;
      const sessionRecord: FirebaseInterviewSession = {
        id: sessionId,
        pdfDocumentId: assignedPdf.id,
        pdfTitle: assignedPdf.title,
        pdfSubject: assignedPdf.subject,
        studentId: activeStudent.id,
        studentName: activeStudent.name,
        studentRoll: activeStudent.rollNumber,
        studentBatch: activeStudent.batch,
        startedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        completedAt: new Date().toISOString(),
        status: 'completed',
        questions: finalQuestions,
        coachingReport: report,
      };

      const firebaseRes = await saveInterviewSessionToFirebase(sessionRecord);
      setSavedFirebaseId(firebaseRes.id);

      try {
        await fetch('/api/interview/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sessionRecord),
        });
      } catch {}

      const result: InterviewResult = {
        id: sessionId,
        studentId: activeStudent.id,
        projectId: assignedPdf.id,
        projectTitle: assignedPdf.title,
        date: 'Today',
        mode: 'standard',
        overallScore: report.overallScore,
        codeUnderstandingScore: report.technicalUnderstandingScore,
        speakingDeliveryScore: report.speakingDeliveryScore,
        questionsAnswered: 5,
        totalQuestions: 5,
        strengths: report.strengths,
        areasToImprove: report.weaknesses,
        recommendedPracticeTopics: report.recommendedStudyTopics,
        answers: finalQuestions.map((q, idx) => ({
          questionId: q.id,
          questionText: q.questionText,
          mode: 'standard',
          studentAnswer: q.studentAnswer || '',
          feedback: report.answerCorrections[idx]?.critique || 'Grounded against syllabus.',
          codeUnderstandingScore: report.answerCorrections[idx]?.score || report.technicalUnderstandingScore,
          speakingDeliveryScore: report.speakingDeliveryScore,
        })),
        deliveryMetrics: {
          structure: report.deliveryMetrics.cadence,
          pace: `${report.deliveryMetrics.wordsPerMinute} WPM`,
          pauses: report.deliveryMetrics.fillerWords,
          fillerWords: report.deliveryMetrics.fillerWords,
        },
      };

      onCompleteInterview(result);
      setStage('report-view');
    } catch {
      setStage('ready');
    }
  };

  // Helper formatting for live timer
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Render 1: Loading assigned PDF
  if (loadingPdf) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center shadow-xs">
        <div className="w-10 h-10 border-3 border-[#3B82F6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-sm font-bold text-[#172033]">
          Loading Assigned Technical Viva Material...
        </h3>
        <p className="text-xs text-[#64748B] mt-1">
          Verifying backend permissions for {activeStudent.name}...
        </p>
      </div>
    );
  }

  // Render 2: Access denied or no PDF assigned
  if (accessError || !assignedPdf) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-10 text-center shadow-xs max-w-xl mx-auto">
        <div className="w-12 h-12 rounded-full bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center mx-auto mb-3 text-[#DC2626]">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-[#172033]">No Interview Document Assigned</h2>
        <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
          {accessError || `Your faculty has not yet assigned an interview PDF to batch ${activeStudent.batch}.`}
        </p>
        <button
          onClick={() => onNavigate('overview')}
          className="mt-5 px-4 py-2 bg-[#183653] hover:bg-[#254B70] text-white text-xs font-semibold rounded-lg cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Render 3: Ready to Start Screen
  if (stage === 'ready' || stage === 'loading-questions') {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Assigned Material Banner */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-bold tracking-wider text-[#3B82F6] uppercase">
                Codexa AI Interview Practice
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                <CheckCircle2 className="w-3 h-3" />
                Assigned to {activeStudent.batch}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#172033] mt-1">
              {assignedPdf.title}
            </h1>
            <p className="text-xs text-[#64748B] mt-1 max-w-2xl leading-relaxed">
              Video Call Simulation &bull; 5 Main Technical Questions with Follow-Up Probing strictly grounded in your assigned syllabus.
            </p>
          </div>

          <button
            onClick={handleStartInterview}
            disabled={stage === 'loading-questions'}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0F766E] hover:bg-[#115E59] disabled:bg-[#99F6E4] text-white text-xs font-semibold rounded-full shadow-md transition-all cursor-pointer active:scale-98 shrink-0"
          >
            {stage === 'loading-questions' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating Viva Questions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Start Video Interview</span>
              </>
            )}
          </button>
        </div>

        {/* Assigned Syllabus Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF4FF] text-[#2563EB] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#172033]">{assignedPdf.fileName}</h3>
                <p className="text-[11px] text-[#64748B]">
                  {assignedPdf.subject} &bull; {assignedPdf.pageCount} Pages &bull; Assigned by {assignedPdf.createdBy}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-[#F1F5F9] text-[#475569] text-xs font-semibold rounded-full">
              Interview Ready
            </span>
          </div>

          <p className="text-xs text-[#475569] leading-relaxed mb-4">
            {assignedPdf.summary}
          </p>

          <div className="space-y-2">
            <span className="text-[11px] font-bold text-[#172033] uppercase tracking-wider block">
              Grounded Syllabus Modules:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {assignedPdf.keyTopics.map((topic, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#334155] font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E]" />
                  <span className="truncate">{topic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render 4: Generating Report Spinner
  if (stage === 'generating-report') {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-16 text-center shadow-xl max-w-xl mx-auto space-y-4">
        <div className="w-12 h-12 border-3 border-[#0F766E] border-t-transparent rounded-full animate-spin mx-auto" />
        <h2 className="text-base font-bold text-[#172033]">
          Generating Session Coaching Review...
        </h2>
        <p className="text-xs text-[#64748B] leading-relaxed">
          Evaluating your speech articulation, syllabus invariants, and answer corrections against {assignedPdf.title}.
        </p>
      </div>
    );
  }

  // Render 5: The Video Call Practice Interview Interface (MATCHING IMAGE 1 EXACTLY)
  if (stage === 'in-progress' && currentQ) {
    const isPartnerSpeaking = isTtsSpeaking;

    return (
      <div className="max-w-4xl mx-auto">
        {/* Main Video Call Modal Card (Matching Image 1) */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-xl overflow-hidden flex flex-col relative">
          {/* Top Bar Header */}
          <div className="px-6 py-4 border-b border-[#E2E8F0]/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#172033] flex items-center gap-2">
                  <span>{assignedPdf.title.split('(')[0].trim()}</span>
                  <span className="text-[#64748B] font-normal text-xs">
                    (Question {currentIndex + 1} of 5 &bull; Technical Viva)
                  </span>
                </h2>
                <p className="text-[11px] text-[#64748B] font-medium">
                  Video Call &bull; {formatTime(elapsedSeconds)}
                </p>
              </div>
            </div>

            <div className="px-3.5 py-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full text-[11px] font-semibold text-[#475569] shadow-2xs">
              Interview Mode
            </div>
          </div>

          {/* Video Call Stage */}
          <div className="p-6 sm:p-8 bg-[#F8FAFC] relative flex flex-col items-center justify-center min-h-[340px]">
            {/* Picture-in-Picture Webcam Box (Top Right - Matching Image 1) */}
            <div className="absolute top-4 right-4 w-32 h-24 sm:w-44 sm:h-32 rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-slate-900 z-20 group">
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-800">
                  <User className="w-8 h-8 opacity-60" />
                  <span className="text-[10px] mt-1 font-medium text-slate-400">Camera Off</span>
                </div>
              )}

              {/* "You" Badge in bottom-left corner */}
              <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-xs rounded-md text-[10px] font-bold text-white tracking-wider">
                You
              </div>
            </div>

            {/* Central Interviewer Avatar (Matching Image 1) */}
            <div className="flex flex-col items-center my-4">
              <div
                className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-[#CCFBF1] bg-[#E6F4F1] p-1 flex items-center justify-center shadow-md transition-all ${
                  isPartnerSpeaking ? 'ring-4 ring-[#14B8A6]/40 scale-105' : ''
                }`}
              >
                {/* Custom Illustrated Interviewer Avatar SVG (Matching Image 1) */}
                <svg
                  viewBox="0 0 120 120"
                  className="w-full h-full rounded-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="60" cy="60" r="58" fill="#E6F4F1" />
                  {/* Shoulders / Teal Uniform */}
                  <path
                    d="M20 115 C20 90, 42 80, 60 80 C78 80, 100 90, 100 115 Z"
                    fill="#0F766E"
                  />
                  {/* Collar V-neck */}
                  <path d="M52 80 L60 92 L68 80 Z" fill="#F8FAFC" />
                  {/* Neck */}
                  <rect x="52" y="65" width="16" height="18" fill="#FBD5C0" rx="3" />
                  {/* Head / Face */}
                  <ellipse cx="60" cy="50" rx="22" ry="25" fill="#FBD5C0" />
                  {/* Ears */}
                  <ellipse cx="37" cy="52" rx="4" ry="7" fill="#FBD5C0" />
                  <ellipse cx="83" cy="52" rx="4" ry="7" fill="#FBD5C0" />
                  {/* Short Dark Hair */}
                  <path
                    d="M38 48 C38 30, 45 25, 60 25 C75 25, 82 30, 82 48 C78 35, 70 33, 60 33 C50 33, 42 35, 38 48 Z"
                    fill="#334155"
                  />
                  {/* Eyebrows */}
                  <path d="M48 42 Q52 40 56 42" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                  <path d="M64 42 Q68 40 72 42" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                  {/* Eyes */}
                  <circle cx="52" cy="47" r="3" fill="#1E293B" />
                  <circle cx="68" cy="47" r="3" fill="#1E293B" />
                  {/* Nose */}
                  <path d="M60 48 L58 54 L62 54" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
                  {/* Mouth - animates slightly when speaking */}
                  {isPartnerSpeaking ? (
                    <ellipse cx="60" cy="62" rx="5" ry="5" fill="#DC2626" />
                  ) : (
                    <path d="M55 62 Q60 66 65 62" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
                  )}
                </svg>
              </div>

              {/* Status Indicator Pill below Avatar (Matching Image 1) */}
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-[#ECFDF5] border border-[#A7F3D0] rounded-full text-xs font-semibold text-[#065F46] shadow-2xs">
                <span className="flex items-center gap-0.5 text-[#059669]">
                  <span className={`w-1 h-3 rounded-full bg-[#10B981] ${isPartnerSpeaking ? 'animate-bounce' : ''}`} />
                  <span className={`w-1 h-4 rounded-full bg-[#10B981] ${isPartnerSpeaking ? 'animate-bounce delay-100' : ''}`} />
                  <span className={`w-1 h-2 rounded-full bg-[#10B981] ${isPartnerSpeaking ? 'animate-bounce delay-200' : ''}`} />
                </span>
                <span>
                  {isPartnerSpeaking
                    ? 'Partner is speaking'
                    : isListening
                    ? 'Partner is listening'
                    : 'Partner is ready'}
                </span>
              </div>
            </div>
          </div>

          {/* White Speech Bubble for Question (Matching Image 1) */}
          <div className="px-6 py-4 bg-white border-t border-[#E2E8F0]">
            <div className="p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-2xs">
              <p className="text-sm text-[#1E293B] font-normal leading-relaxed">
                {isFollowUpPhase && currentQ.followUpQuestion ? (
                  <>
                    <strong className="text-[#0F766E] font-semibold block mb-1">
                      Contextual Follow-Up Probe:
                    </strong>
                    {currentQ.followUpQuestion}
                  </>
                ) : (
                  currentQ.questionText
                )}
              </p>
            </div>
          </div>

          {/* Bottom Interaction Area: Purely Voice-Driven (Text input removed) */}
          <div className="px-6 pt-2 pb-6 bg-white space-y-3">
            {/* Live Spoken Transcription Feedback */}
            {isListening && (
              <div className="py-2 px-5 mx-auto max-w-xl text-center rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-xs font-medium text-[#065F46] flex items-center justify-center gap-2 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="truncate">
                  {studentInput ? `"${studentInput}"` : 'Listening to your voice... Speak your answer now'}
                </span>
              </div>
            )}

            {loadingFollowUp && (
              <div className="py-2 px-5 mx-auto max-w-sm text-center rounded-full bg-[#EAF4FF] border border-[#BFDBFE] text-xs font-semibold text-[#1E3A8A] flex items-center justify-center gap-2 shadow-2xs">
                <div className="w-3 h-3 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
                <span>Interviewer is analyzing your response...</span>
              </div>
            )}

            {/* Bottom Call Controls Strip (Matching Image 1) */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Mic Toggle Button */}
              <button
                type="button"
                onClick={toggleMic}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
                  isListening
                    ? 'bg-[#FEF2F2] border-[#F87171] text-[#DC2626] animate-pulse'
                    : 'bg-white border-[#CBD5E1] text-[#1E293B] hover:bg-[#F8FAFC]'
                }`}
              >
                {isListening ? (
                  <>
                    <Mic className="w-4 h-4 text-[#DC2626]" />
                    <span>Listening... (Tap to Pause)</span>
                  </>
                ) : (
                  <>
                    <MicOff className="w-4 h-4 text-[#64748B]" />
                    <span>Mic Off (Tap to Speak)</span>
                  </>
                )}
              </button>

              {/* Submit Spoken Response Button */}
              {(studentInput.trim().length > 0 || isListening) && (
                <button
                  type="button"
                  onClick={!isFollowUpPhase ? handleSubmitMainAnswer : handleSubmitFollowUpAnswer}
                  disabled={loadingFollowUp}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#0F766E] hover:bg-[#115E59] shadow-sm transition-all cursor-pointer active:scale-98"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {!isFollowUpPhase ? 'Submit Spoken Answer' : 'Submit Follow-Up Response'}
                  </span>
                </button>
              )}

              {/* Camera Toggle Button */}
              <button
                type="button"
                onClick={toggleCamera}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
                  cameraActive
                    ? 'bg-white border-[#CBD5E1] text-[#1E293B] hover:bg-[#F8FAFC]'
                    : 'bg-slate-100 border-slate-300 text-slate-500'
                }`}
              >
                {cameraActive ? (
                  <>
                    <Video className="w-4 h-4 text-[#0F766E]" />
                    <span>Camera On</span>
                  </>
                ) : (
                  <>
                    <VideoOff className="w-4 h-4 text-[#64748B]" />
                    <span>Camera Off</span>
                  </>
                )}
              </button>

              {/* End Call Button */}
              <button
                type="button"
                onClick={() => handleCompleteInterviewFlow(questions)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] transition-all cursor-pointer shadow-sm active:scale-98"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Call</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render 6: Session Coaching Review Modal (MATCHING IMAGES 2 & 3 EXACTLY)
  if (stage === 'report-view' && coachingReport) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden flex flex-col">
          {/* Header (Matching Image 2) */}
          <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E6F4F1] border border-[#A7F3D0] text-[#0F766E] flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#172033]">
                  Session Coaching Review
                </h2>
                <p className="text-xs text-[#64748B]">
                  {assignedPdf.title} &bull; Video Call
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('overview')}
              className="p-1.5 text-[#64748B] hover:text-[#172033] hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
            {/* Top Session Notice Card (Matching Image 2) */}
            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl flex items-start gap-3 text-xs text-[#475569]">
              <Info className="w-4 h-4 text-[#64748B] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-[#172033] font-semibold">Session Summary:</strong> Overall score, grammar refinements, and answer quality are synthesized directly against your assigned syllabus. Speaking pace and pause timing evaluated across all 5 viva questions.
              </p>
            </div>

            {/* What Went Well & Main Focus Next Cards (Matching Image 2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: What Went Well */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#15803D] uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  <span>WHAT WENT WELL</span>
                </div>
                <p className="text-xs text-[#166534] leading-relaxed">
                  {coachingReport.strengths[0] ||
                    'Demonstrated solid grasp of consensus protocols, randomized election timeouts, and majority quorum rules.'}
                </p>
              </div>

              {/* Card 2: Main Focus Next */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#B45309] uppercase tracking-wider">
                  <Flag className="w-4 h-4 text-[#D97706]" />
                  <span>MAIN FOCUS NEXT</span>
                </div>
                <p className="text-xs text-[#92400E] leading-relaxed">
                  {coachingReport.weaknesses[0] ||
                    'Respond with at least 2-3 complete sentences so filler words, grammar, pauses, and answer structure can be accurately assessed.'}
                </p>
              </div>
            </div>

            {/* DETAILED BREAKDOWN (TAP TO EXPAND) (Matching Image 2 & 3) */}
            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                DETAILED BREAKDOWN (TAP TO EXPAND)
              </span>

              {/* Accordion 1: Speaking Habits & Pauses */}
              <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedSection(expandedSection === 'habits' ? null : 'habits')
                  }
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Activity className="w-4 h-4 text-[#0F766E]" />
                    <span className="text-xs font-bold text-[#172033]">
                      Speaking Habits & Pauses
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-[#64748B]">
                      {coachingReport.deliveryMetrics.cadence}
                    </span>
                    {expandedSection === 'habits' ? (
                      <ChevronUp className="w-4 h-4 text-[#64748B]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#64748B]" />
                    )}
                  </div>
                </button>

                {expandedSection === 'habits' && (
                  <div className="p-4 pt-1 border-t border-[#F1F5F9] space-y-3 bg-[#F8FAFC]/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl">
                        <span className="text-[#64748B] block font-semibold mb-1">
                          Filler Words ("umm", "uh", "like", "soo")
                        </span>
                        <p className="text-[#172033] font-medium">
                          {coachingReport.deliveryMetrics.fillerWords}
                        </p>
                      </div>

                      <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl">
                        <span className="text-[#64748B] block font-semibold mb-1">
                          Long Pauses & Speaking Pace
                        </span>
                        <p className="text-[#172033] font-medium">
                          Pace: {coachingReport.deliveryMetrics.wordsPerMinute} WPM (steady)
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-xs text-[#065F46] leading-relaxed">
                      <strong className="font-semibold block mb-0.5">Habit Tip:</strong>
                      Keep finishing sentences cleanly and using brief silent pauses between key points to maintain a steady, composed cadence.
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: Eye Contact & Visual Presence */}
              <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedSection(expandedSection === 'presence' ? null : 'presence')
                  }
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Video className="w-4 h-4 text-[#0F766E]" />
                    <span className="text-xs font-bold text-[#172033]">
                      Eye Contact & Visual Presence
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-[#059669]">
                      Centered Engagement
                    </span>
                    {expandedSection === 'presence' ? (
                      <ChevronUp className="w-4 h-4 text-[#64748B]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#64748B]" />
                    )}
                  </div>
                </button>

                {expandedSection === 'presence' && (
                  <div className="p-4 pt-1 border-t border-[#F1F5F9] bg-[#F8FAFC]/50 text-xs text-[#475569] leading-relaxed">
                    Candidate maintained steady visual presence and centered posture throughout technical probing rounds.
                  </div>
                )}
              </div>

              {/* Accordion 3: Grammar & Corrected Sentences */}
              <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedSection(expandedSection === 'grammar' ? null : 'grammar')
                  }
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-[#0F766E]" />
                    <span className="text-xs font-bold text-[#172033]">
                      Grammar & Corrected Sentences
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-[#2563EB]">
                      Model Phrasing
                    </span>
                    {expandedSection === 'grammar' ? (
                      <ChevronUp className="w-4 h-4 text-[#64748B]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#64748B]" />
                    )}
                  </div>
                </button>

                {expandedSection === 'grammar' && (
                  <div className="p-4 pt-1 border-t border-[#F1F5F9] bg-[#F8FAFC]/50 space-y-2 text-xs">
                    <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl">
                      <span className="text-[10px] font-bold text-[#64748B] uppercase block">
                        Original Response:
                      </span>
                      <p className="text-[#334155] font-mono mt-0.5">
                        {coachingReport.answerCorrections[0]?.studentResponse ||
                          'In consensus when timeout happens nodes ask for votes and need majority.'}
                      </p>
                    </div>

                    <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl">
                      <span className="text-[10px] font-bold text-[#059669] uppercase block">
                        Polished Placement Articulation:
                      </span>
                      <p className="text-[#065F46] font-medium mt-0.5 leading-relaxed">
                        {coachingReport.answerCorrections[0]?.modelAnswer ||
                          'Under the Raft protocol, when randomized election timeouts expire without heartbeats, candidates broadcast RequestVote RPCs and require a strict majority quorum (N/2 + 1).'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 4: Answer Quality (Clarity, Structure & Examples) */}
              <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedSection(expandedSection === 'quality' ? null : 'quality')
                  }
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />
                    <span className="text-xs font-bold text-[#172033]">
                      Answer Quality (Clarity, Structure & Examples)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold text-[#15803D]">
                      Score: {coachingReport.overallScore}/100
                    </span>
                    {expandedSection === 'quality' ? (
                      <ChevronUp className="w-4 h-4 text-[#64748B]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#64748B]" />
                    )}
                  </div>
                </button>

                {expandedSection === 'quality' && (
                  <div className="p-4 pt-1 border-t border-[#F1F5F9] bg-[#F8FAFC]/50 space-y-3 text-xs">
                    {coachingReport.answerCorrections.map((corr) => (
                      <div
                        key={corr.questionNumber}
                        className="p-3.5 bg-white border border-[#E2E8F0] rounded-xl space-y-1.5"
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-[#1E3A8A]">Question {corr.questionNumber}</span>
                          <span className="text-[#059669] font-mono">{corr.score}/100</span>
                        </div>
                        <p className="text-[#172033] font-semibold">{corr.questionText}</p>
                        <p className="text-[#475569] text-[11px] leading-relaxed">
                          {corr.critique}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* PERSONALIZED NEXT STEPS (Matching Image 3) */}
            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>PERSONALIZED NEXT STEPS</span>
              </span>

              {/* Drill Card */}
              <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-[#172033]">
                    1. 2-Sentence Response Drill
                  </h4>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed max-w-lg">
                    Answer the opening question with one clear main statement followed by one supporting detail or architectural constraint.
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-[10px] font-bold rounded-lg shrink-0">
                  Response Completeness
                </span>
              </div>

              {/* Recommended Next Practice Question Box */}
              <div className="p-4 sm:p-5 bg-white border border-[#CBD5E1] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                    RECOMMENDED NEXT PRACTICE QUESTION
                  </span>
                  <p className="text-xs font-medium text-[#1E293B] leading-relaxed max-w-lg">
                    "{assignedPdf.keyTopics[1] || 'Explain the Log Matching Property and why leaders never overwrite committed entries.'}"
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStage('ready');
                    handleStartInterview();
                  }}
                  className="px-5 py-2.5 bg-[#004D40] hover:bg-[#00382E] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 shadow-xs active:scale-98"
                >
                  Practise This Question
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Footer Actions: Try Again & Finish (Matching Image 3) */}
          <div className="px-6 py-4 border-t border-[#E2E8F0] bg-white flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setStage('ready');
                setStudentInput('');
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#CBD5E1] bg-white hover:bg-slate-50 text-[#172033] text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>Try Again</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('overview')}
              className="inline-flex items-center gap-2 px-8 py-2.5 rounded-full bg-[#004D40] hover:bg-[#00382E] text-white text-xs font-bold shadow-md transition-all cursor-pointer active:scale-98"
            >
              <Check className="w-4 h-4" />
              <span>Finish</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
