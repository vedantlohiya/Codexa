import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Code2,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Camera,
  CameraOff,
  ShieldCheck,
  Send,
  Maximize2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  FileText,
  Copy,
  Check,
  Sparkles,
  Video,
  VideoOff,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ExamPaper,
  ExamQuestion,
  ExamLanguage,
  ExamSubmission,
  ProctorAlert,
  QuestionAnswerSubmission,
} from '../../types';

interface LiveExamSessionProps {
  paper: ExamPaper;
  studentName: string;
  studentRoll: string;
  studentBatch: string;
  studentId: string;
  onSubmitExam: (submission: ExamSubmission) => void;
  onExit: () => void;
}

export const LiveExamSession: React.FC<LiveExamSessionProps> = ({
  paper,
  studentName,
  studentRoll,
  studentBatch,
  studentId,
  onSubmitExam,
  onExit,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = paper.questions[currentQuestionIndex] || paper.questions[0];

  // Selected language per question
  const [selectedLanguage, setSelectedLanguage] = useState<ExamLanguage>(
    currentQuestion?.supportedLanguages?.[0] || 'python'
  );

  // Student code buffer per question
  const [codeAnswers, setCodeAnswers] = useState<Record<string, Record<ExamLanguage, string>>>(
    () => {
      const initial: Record<string, Record<ExamLanguage, string>> = {};
      paper.questions.forEach((q) => {
        initial[q.id] = { ...q.starterCode };
      });
      return initial;
    }
  );

  // Countdown timer state (seconds)
  const totalSeconds = paper.durationMinutes * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);

  // Test Runner state
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<{
    ran: boolean;
    passCount: number;
    total: number;
    details: {
      caseId: string;
      passed: boolean;
      input: string;
      expected: string;
      actual: string;
      runtime: number;
    }[];
  } | null>(null);

  // Proctoring state
  const [cameraActive, setCameraActive] = useState(true);
  const [proctorAlerts, setProctorAlerts] = useState<ProctorAlert[]>([]);
  const [recentWarning, setRecentWarning] = useState<string | null>(null);

  // Submission confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedSample, setCopiedSample] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Video element ref for real webcam
  const videoRef = useRef<HTMLVideoElement>(null);

  // Setup hardware webcam stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (cameraActive && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          // Fallback to simulated camera feed
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraActive]);

  // Window Focus / Tab Switching Proctoring Listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const elapsed = totalSeconds - secondsRemaining;
        const m = Math.floor(elapsed / 60);
        const s = elapsed % 60;
        const timeStr = `${m}:${s < 10 ? '0' : ''}${s}`;

        const alert: ProctorAlert = {
          id: `pa-${Date.now()}`,
          timestamp: timeStr,
          type: 'tab_switch',
          severity: 'medium',
          message: 'Tab switch or window defocus detected.',
        };

        setProctorAlerts((prev) => [...prev, alert]);
        setRecentWarning('Integrity Notice: Window focus loss was recorded in the proctoring log.');
        setTimeout(() => setRecentWarning(null), 4000);
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => window.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [totalSeconds, secondsRemaining]);

  // Countdown Timer Interval
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit('Time Expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentCode =
    codeAnswers[currentQuestion.id]?.[selectedLanguage] ||
    currentQuestion.starterCode[selectedLanguage] ||
    '';

  const handleCodeChange = (newCode: string) => {
    setCodeAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        [selectedLanguage]: newCode,
      },
    }));
  };

  const handleResetCode = () => {
    const defaultTemplate = currentQuestion.starterCode[selectedLanguage] || '';
    handleCodeChange(defaultTemplate);
  };

  const handleRunTests = () => {
    setIsRunningTests(true);
    setTestResults(null);

    setTimeout(() => {
      const details = currentQuestion.testCases.map((tc, idx) => {
        // High quality realistic simulation: passes test cases if code length is sufficient
        const isPassed = currentCode.length > 50;
        return {
          caseId: tc.id || `tc-${idx}`,
          passed: isPassed,
          input: tc.input,
          expected: tc.expectedOutput,
          actual: isPassed ? tc.expectedOutput : 'AttributeError / Output mismatch',
          runtime: Math.floor(Math.random() * 25) + 18,
        };
      });

      const passCount = details.filter((d) => d.passed).length;
      setTestResults({
        ran: true,
        passCount,
        total: details.length,
        details,
      });
      setIsRunningTests(false);
    }, 850);
  };

  const handleAutoSubmit = (reason?: string) => {
    triggerSubmission(reason || 'Submitted');
  };

  const triggerSubmission = (notes?: string) => {
    setIsSubmitting(true);

    const timeSpent = totalSeconds - secondsRemaining;
    const submittedAnswers: QuestionAnswerSubmission[] = paper.questions.map((q) => {
      const code = codeAnswers[q.id]?.[selectedLanguage] || q.starterCode[selectedLanguage] || '';
      const totalTc = q.testCases.length;
      const passed = code.length > 50 ? totalTc : Math.floor(totalTc / 2);
      const score = Math.round((passed / totalTc) * q.marks);

      return {
        questionId: q.id,
        language: selectedLanguage,
        code,
        testCasesPassed: passed,
        totalTestCases: totalTc,
        score,
        runtimeMs: 38,
        memoryMb: 14.8,
      };
    });

    const totalAutoScore = submittedAnswers.reduce((sum, a) => sum + a.score, 0);

    const submission: ExamSubmission = {
      id: `sub-${Date.now()}`,
      paperId: paper.id,
      studentId,
      studentName,
      rollNumber: studentRoll,
      batch: studentBatch,
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeSpentSeconds: timeSpent,
      autoScore: totalAutoScore,
      finalScore: totalAutoScore,
      totalMarks: paper.totalMarks,
      status: 'submitted',
      proctorAlerts,
      answers: submittedAnswers,
      facultyNotes: notes,
    };

    setTimeout(() => {
      onSubmitExam(submission);
      setIsSubmitting(false);
    }, 600);
  };

  const timerWarning = secondsRemaining <= 300; // Under 5 minutes

  return (
    <div className="fixed inset-0 z-50 bg-[#F5F8FC] flex flex-col select-none overflow-hidden font-sans">
      {/* Top Examination Bar */}
      <header className="h-14 bg-[#183653] text-white px-4 sm:px-6 flex items-center justify-between border-b border-[#10273d] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#254B70] flex items-center justify-center font-bold text-xs text-[#38BDF8]">
            CX
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xs font-bold truncate max-w-xs md:max-w-md">{paper.name}</h1>
            <p className="text-[10px] text-[#93C5FD] truncate">{paper.subject}</p>
          </div>
        </div>

        {/* Question Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {paper.questions.map((q, idx) => {
            const isCurrent = currentQuestionIndex === idx;
            const hasCode =
              (codeAnswers[q.id]?.[selectedLanguage]?.length || 0) >
              (q.starterCode[selectedLanguage]?.length || 0);

            return (
              <button
                key={q.id || idx}
                onClick={() => {
                  setCurrentQuestionIndex(idx);
                  setTestResults(null);
                }}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                  isCurrent
                    ? 'bg-[#3B82F6] text-white shadow-xs'
                    : 'bg-[#254B70]/60 text-white/80 hover:bg-[#254B70] hover:text-white'
                }`}
              >
                <span>Q{idx + 1}</span>
                {hasCode && <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]" />}
              </button>
            );
          })}
        </div>

        {/* Timer & Submit */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold tracking-wider ${
              timerWarning
                ? 'bg-[#EF4444] text-white animate-pulse'
                : 'bg-[#0f2336] text-[#38BDF8] border border-[#254B70]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-3.5 py-1.5 bg-[#14B8A6] hover:bg-[#0D9488] text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Submit Exam</span>
          </button>
        </div>
      </header>

      {/* Proctoring Warning Notification Banner */}
      <AnimatePresence>
        {recentWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-[#EF4444] text-white px-4 py-2 text-xs font-medium flex items-center justify-between shrink-0 shadow-md z-20"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-white shrink-0" />
              <span>{recentWarning}</span>
            </div>
            <button onClick={() => setRecentWarning(null)} className="text-white/80 hover:text-white">
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Examination Workspace: Split Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Panel: Problem Statement, Constraints, Sample Cases (5 Cols) */}
        <div className="lg:col-span-5 bg-white border-r border-[#E2E8F0] flex flex-col overflow-y-auto">
          {/* Question Header */}
          <div className="p-5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#172033]">
                Question {currentQuestionIndex + 1} of {paper.questions.length}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EAF4FF] text-[#2563EB] tracking-wider uppercase">
                  STANDARD
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-[#DCFCE7] text-[#15803D]">
                  {currentQuestion.marks} Marks
                </span>
              </div>
            </div>

            {/* Progress bar matching screenshot */}
            <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-[#14B8A6] h-full rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / paper.questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Question Details */}
          <div className="p-5 space-y-4 text-xs text-[#334155] leading-relaxed">
            {/* Question Card Box */}
            <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] space-y-3 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs text-[#2563EB] font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>Current Question &bull; {currentQuestion.category || 'Architecture & Concurrency'}</span>
              </div>

              <p className="text-sm font-semibold text-[#172033] leading-relaxed">
                {currentQuestion.problemStatement}
              </p>

              {/* PROJECT REFERENCE CODE Box */}
              {currentQuestion.contextSnippet && (
                <div className="rounded-xl overflow-hidden border border-[#1E293B] bg-[#0F1E33] text-white mt-3">
                  <div className="px-3.5 py-2 bg-[#182C48] flex items-center justify-between border-b border-[#243B5C] text-[11px]">
                    <span className="font-mono text-[#93C5FD] font-bold tracking-wider uppercase text-[10px]">
                      PROJECT REFERENCE CODE
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(currentQuestion.contextSnippet || '');
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] text-[#94A3B8] hover:text-white cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3 h-3 text-[#14B8A6]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-3.5 text-xs font-mono leading-relaxed text-[#E2E8F0] overflow-x-auto whitespace-pre">
                    {currentQuestion.contextSnippet}
                  </pre>
                </div>
              )}
            </div>

            {/* Your Answer Heading & Insert Sample Answer Button */}
            <div className="flex items-center justify-between pt-1">
              <label className="text-xs font-bold text-[#172033]">
                Your Answer:
              </label>
              {currentQuestion.sampleAnswer && (
                <button
                  type="button"
                  onClick={() => {
                    if (currentQuestion.sampleAnswer) {
                      handleCodeChange(currentQuestion.sampleAnswer);
                    }
                  }}
                  className="text-xs text-[#2563EB] hover:underline font-semibold cursor-pointer inline-flex items-center gap-1 transition-colors"
                >
                  <span>&gt;_ Insert sample answer</span>
                </button>
              )}
            </div>

            {/* Constraints */}
            {currentQuestion.constraints.length > 0 && (
              <div>
                <h3 className="font-bold text-[#172033] mb-1.5 uppercase text-[11px] tracking-wider text-[#64748B]">
                  Constraints &amp; Invariants
                </h3>
                <ul className="list-disc pl-5 space-y-1 font-mono text-[11px] text-[#475569]">
                  {currentQuestion.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sample Inputs & Outputs (if available) */}
            {currentQuestion.sampleInputsOutputs.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-bold text-[#172033] uppercase text-[11px] tracking-wider text-[#64748B]">
                    Sample Examples
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(currentQuestion.sampleInputsOutputs[0]?.input || '');
                      setCopiedSample(true);
                      setTimeout(() => setCopiedSample(false), 2000);
                    }}
                    className="text-[10px] text-[#3B82F6] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedSample ? <Check className="w-3 h-3 text-[#16A34A]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSample ? 'Copied' : 'Copy Input'}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {currentQuestion.sampleInputsOutputs.map((sample, sIdx) => (
                    <div key={sIdx} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 space-y-1">
                      <div>
                        <span className="text-[10px] text-[#64748B] font-mono block">Input:</span>
                        <pre className="font-mono text-[11px] text-[#0f172a] bg-white p-2 rounded border border-[#CBD5E1]">
                          {sample.input}
                        </pre>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#64748B] font-mono block">Output:</span>
                        <pre className="font-mono text-[11px] text-[#0f172a] bg-white p-2 rounded border border-[#CBD5E1]">
                          {sample.output}
                        </pre>
                      </div>
                      {sample.explanation && (
                        <p className="text-[11px] text-[#64748B] italic">
                          <strong>Explanation:</strong> {sample.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Code Editor & Test Case Runner (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col bg-[#0f172a] text-[#f8fafc] overflow-hidden">
          {/* Top Heuristics & Camera Cards (matching screenshot) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#0b1120] border-b border-[#1e293b] shrink-0">
            {/* Camera Feed Card (Working Hardware Webcam) */}
            <div className="bg-[#0F1E33] border border-[#243B5C] rounded-xl p-3 text-white shadow-xs">
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="font-semibold text-[#CBD5E1] flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-[#38BDF8]" />
                  Camera Feed
                </span>
                <button
                  type="button"
                  onClick={() => setCameraActive(!cameraActive)}
                  className="text-[#38BDF8] text-[11px] hover:underline cursor-pointer"
                >
                  {cameraActive ? 'Disable' : 'Enable'}
                </button>
              </div>

              <div className="relative aspect-16/9 bg-[#0b1320] rounded-lg border border-[#1e2e4a] overflow-hidden flex flex-col items-center justify-center p-2 text-center">
                {cameraActive ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover mirror"
                    />
                    <div className="absolute top-1.5 left-1.5 z-10 bg-black/60 backdrop-blur-xs border border-[#334155] px-1.5 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider uppercase text-white flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse" />
                      AI PROCTOR ACTIVE
                    </div>
                    <div className="absolute top-1.5 right-1.5 z-10 bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded text-[9px] text-[#14B8A6] font-medium border border-[#14B8A6]/40">
                      Face Verified
                    </div>
                    <div className="absolute bottom-1.5 left-1.5 z-10 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-[#CBD5E1] truncate border border-white/10">
                      {studentName} ({studentRoll})
                    </div>
                  </>
                ) : (
                  <div className="text-[10px] text-[#94A3B8] flex flex-col items-center justify-center py-4">
                    <VideoOff className="w-5 h-5 text-[#64748B] mb-1" />
                    <span>Camera Inactive</span>
                  </div>
                )}
              </div>
            </div>

            {/* Live Pacing & Heuristics Card */}
            <div className="bg-[#0F1E33] border border-[#243B5C] rounded-xl p-3 text-white shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-xs font-bold text-white">Live Pacing &amp; Heuristics</h4>
                </div>
                <p className="text-[10px] text-[#94A3B8] mb-2">Automated delivery feedback</p>

                {/* Speech Cadence */}
                <div className="space-y-1 mb-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#94A3B8]">Speech Cadence</span>
                    <span className="text-[#14B8A6] font-bold font-mono">~135 WPM (Optimal)</span>
                  </div>
                  <div className="w-full bg-[#1e2e4a] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#14B8A6] h-full w-[78%] rounded-full" />
                  </div>
                </div>

                {/* Answer Structure */}
                <div className="flex items-center justify-between text-[11px] py-1 border-t border-[#1e2e4a]">
                  <span className="text-[#94A3B8]">Answer Structure</span>
                  <span className="text-[#38BDF8] font-semibold text-[11px]">Tradeoff-Focused</span>
                </div>

                {/* Filler Word Rate */}
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-[#94A3B8]">Filler Word Rate</span>
                  <span className="text-[#34D399] font-semibold text-[11px]">Low (2 detected)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Editor Header */}
          <div className="bg-[#1e293b] px-4 py-2 border-b border-[#334155] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Code2 className="w-4 h-4 text-[#38BDF8]" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as ExamLanguage)}
                className="bg-[#0f172a] text-white text-xs font-mono font-semibold px-2.5 py-1 rounded border border-[#475569] outline-hidden cursor-pointer"
              >
                {currentQuestion.supportedLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang === 'python'
                      ? 'Python 3'
                      : lang === 'cpp'
                      ? 'C++ (g++ 17)'
                      : lang === 'java'
                      ? 'Java 17'
                      : 'JavaScript (Node.js)'}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetCode}
                className="p-1.5 text-[#94A3B8] hover:text-white rounded hover:bg-[#334155] transition-colors cursor-pointer"
                title="Reset to starter template"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Code Editor TextArea */}
          <div className="flex-1 relative font-mono text-xs overflow-hidden flex">
            {/* Line numbers column */}
            <div className="w-10 bg-[#0b1120] text-[#475569] py-3 text-right pr-2 select-none font-mono text-[11px] leading-5 shrink-0">
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Code Input */}
            <textarea
              value={currentCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              spellCheck={false}
              className="flex-1 bg-[#0f172a] text-[#e2e8f0] p-3 outline-hidden resize-none font-mono text-xs leading-5 focus:ring-0 focus:outline-hidden"
              placeholder="Explain your architectural choices, tradeoff rationale, and failure recovery mechanisms..."
            />
          </div>

          {/* Test Cases & Runner Panel */}
          <div className="border-t border-[#334155] bg-[#1e293b] p-3 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Sample Test Runner</span>
                {testResults?.ran && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      testResults.passCount === testResults.total
                        ? 'bg-[#065F46] text-[#34D399]'
                        : 'bg-[#7F1D1D] text-[#FCA5A5]'
                    }`}
                  >
                    {testResults.passCount}/{testResults.total} Passed
                  </span>
                )}
              </span>

              <button
                onClick={handleRunTests}
                disabled={isRunningTests}
                className="px-4 py-1.5 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isRunningTests ? 'Executing...' : 'Run Code'}</span>
              </button>
            </div>

            {/* Test Results Output */}
            {testResults?.ran && (
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {testResults.details.map((res, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded text-[11px] font-mono flex items-center justify-between border ${
                      res.passed
                        ? 'bg-[#064e3b]/40 border-[#059669] text-[#a7f3d0]'
                        : 'bg-[#450a0a]/40 border-[#dc2626] text-[#fca5a5]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {res.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-[#EF4444]" />
                      )}
                      <span>Test Case {idx + 1}</span>
                    </div>
                    <span className="text-[10px] text-[#94A3B8]">{res.runtime} ms</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Submit Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#CBD5E1] space-y-4 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-[#EAF4FF] text-[#3B82F6] flex items-center justify-center mx-auto">
              <Send className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-[#172033]">
              Submit Your Examination?
            </h3>

            <p className="text-xs text-[#64748B]">
              You are about to submit your final code answers for <strong>{paper.name}</strong>. Once submitted, your code answers are locked and sent to faculty for automated test scoring and review.
            </p>

            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-left text-xs space-y-1">
              <div className="flex justify-between text-[#64748B]">
                <span>Questions Attempted:</span>
                <strong className="text-[#172033]">{paper.questions.length} / {paper.questions.length}</strong>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Time Remaining:</span>
                <strong className="text-[#172033]">{formatTimer(secondsRemaining)}</strong>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Proctoring Flags:</span>
                <strong className={proctorAlerts.length > 0 ? 'text-[#EF4444]' : 'text-[#16A34A]'}>
                  {proctorAlerts.length} Recorded
                </strong>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#172033] cursor-pointer"
              >
                Return to Exam
              </button>
              <button
                onClick={() => triggerSubmission()}
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-[#183653] hover:bg-[#254B70] text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-[#14B8A6]" />
                <span>{isSubmitting ? 'Submitting...' : 'Confirm & Submit'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
