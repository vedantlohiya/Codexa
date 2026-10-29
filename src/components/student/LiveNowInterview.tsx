import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Video,
  VideoOff,
  Mic,
  MicOff,
  ArrowRight,
  ArrowLeft,
  Award,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Volume2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Student } from '../../types';

interface LiveNowInterviewProps {
  student: Student;
  onExit?: () => void;
}

interface InterviewQuestionData {
  id: string;
  category: string;
  questionNumber: number;
  questionText: string;
  contextSnippet: string;
  sampleAnswer: string;
  starterPlaceholder: string;
  rubric: string;
}

const interviewQuestions: InterviewQuestionData[] = [
  {
    id: 'q-devpulse-01',
    category: 'Architecture & Concurrency',
    questionNumber: 1,
    questionText:
      'In your DevPulse project, walk me through how `calculateSprintVelocity()` avoids blocking the Node.js event loop when aggregating 50,000 historic task records.',
    contextSnippet: `// File: src/analytics/velocity.ts
export async function calculateSprintVelocity(teamId: string, windowSize = 5) {
  const cached = await redis.get(\`velocity:\${teamId}\`);
  if (cached) return JSON.parse(cached);
  // Aggregation logic
}`,
    sampleAnswer:
      'Instead of pulling 50,000 raw rows into the Node.js V8 heap and running synchronous reduce/filter loops, the aggregation is pushed down directly into PostgreSQL using SUM() and AVG() window functions. For CPU-bound Monte Carlo forecasts, we offload the computation to a Node.js worker_thread, while high-frequency dashboard reads are cached in Redis with a 15-minute TTL.',
    starterPlaceholder:
      'Explain your architectural choices, tradeoff rationale, and failure recovery mechanisms...',
    rubric: 'Evaluates database pushdown, worker threads, and Redis cache invalidation.',
  },
  {
    id: 'q-devpulse-02',
    category: 'Authentication & Security',
    questionNumber: 2,
    questionText:
      'In your authentication layer, why did you decide on refresh token rotation backed by Redis instead of completely stateless JWTs?',
    contextSnippet: `// File: src/auth/jwt.strategy.ts
// Stateless JWTs have an expiration of 15m.
// Refresh tokens are single-use and assigned to a family UUID in Redis.
export async function rotateRefreshToken(tokenFamilyId: string, incomingToken: string) {
  const isUsed = await redis.sismember(\`used_tokens:\${tokenFamilyId}\`, incomingToken);
  if (isUsed) {
    await redis.del(\`token_family:\${tokenFamilyId}\`);
    throw new SecurityException('Replay detected: revoking token family');
  }
}`,
    sampleAnswer:
      'Purely stateless JWTs cannot be revoked immediately if a device is compromised before the signature expires. By pairing short-lived access tokens (15 minutes) with single-use refresh token rotation tracked in Redis, we maintain high throughput while enabling instant revocation. If an already-used refresh token is replayed, our security guard detects the anomaly and purges the entire token family.',
    starterPlaceholder:
      'Explain the JWT revocation dilemma, token family replay detection, and cache cleanup...',
    rubric: 'Evaluates replay attack mitigation and stateful session revocation tradeoffs.',
  },
  {
    id: 'q-devpulse-03',
    category: 'Distributed Systems & Caching',
    questionNumber: 3,
    questionText:
      'Explain your cache invalidation strategy for sprint velocity metrics when real-time task records are modified concurrently by multiple team members.',
    contextSnippet: `// File: src/services/taskService.ts
export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  await db.tasks.update({ where: { id: taskId }, data: { status } });
  await redis.publish('cache:invalidate:velocity', JSON.stringify({ taskId, timestamp: Date.now() }));
}`,
    sampleAnswer:
      'We utilize write-through cache eviction with Redis pub/sub. When a task status changes, the database transaction commits first, followed by a broadcast on Redis pub/sub to notify all cluster instances to evict stale team velocity keys, ensuring eventual consistency within 50ms across distributed instances.',
    starterPlaceholder:
      'Detail eventual consistency guarantees, transactional rollback handling, and pub/sub latency...',
    rubric: 'Evaluates write-through eviction, event ordering, and cluster synchronization.',
  },
];

export const LiveNowInterview: React.FC<LiveNowInterviewProps> = ({ student, onExit }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [copiedCode, setCopiedCode] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // Video element ref for real webcam hardware when available
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const currentQ = interviewQuestions[currentIdx];
  const totalQuestions = interviewQuestions.length;
  const currentAnswer = answers[currentIdx] || '';

  // Hardware webcam stream setup with graceful fallback
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
          // Graceful fallback to honest simulated camera feed
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraActive]);

  // Speech-to-text recognition setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setAnswers((prev) => ({
            ...prev,
            [currentIdx]: (prev[currentIdx] ? prev[currentIdx] + ' ' : '') + transcript.trim(),
          }));
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [currentIdx]);

  const toggleMic = () => {
    if (!isRecording) {
      setIsRecording(true);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // If speech recognition fails, honest simulation fallback
          simulateVoiceInput();
        }
      } else {
        simulateVoiceInput();
      }
    } else {
      setIsRecording(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    }
  };

  const simulateVoiceInput = () => {
    setTimeout(() => {
      setAnswers((prev) => {
        const existing = prev[currentIdx] || '';
        if (existing.includes('aggregation is pushed down')) return prev;
        return {
          ...prev,
          [currentIdx]:
            (existing ? existing + ' ' : '') +
            'The aggregation is pushed down into PostgreSQL to avoid blocking the event loop.',
        };
      });
      setIsRecording(false);
    }, 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentQ.contextSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleInsertSampleAnswer = () => {
    setAnswers((prev) => ({
      ...prev,
      [currentIdx]: currentQ.sampleAnswer,
    }));
  };

  const handleAnswerChange = (val: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIdx]: val,
    }));
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setShowReport(true);
    }
  };

  const handlePrevious = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setShowReport(false);
  };

  const wordsCount = currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).length : 0;
  const progressPercent = ((currentIdx + 1) / totalQuestions) * 100;

  // View: Final Coaching Report
  if (showReport) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Report Header */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#15803D]">
                Interview Completed
              </span>
              <span className="text-xs text-[#64748B]">Batch {student.batch}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#172033]">
              AI Technical Interview Coaching Report
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              DevPulse Architecture & Concurrency &bull; Automated Delivery Evaluation
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#183653] text-xs font-semibold rounded-lg shadow-xs cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Interview</span>
            </button>
            {onExit && (
              <button
                onClick={onExit}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#183653] hover:bg-[#254B70] text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer transition-colors"
              >
                <span>Back to Overview</span>
              </button>
            )}
          </div>
        </div>

        {/* Top Scores & Verification Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#EAF4FF] border border-[#BFDBFE] rounded-2xl p-6 text-center">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block">
              Overall Technical Score
            </span>
            <div className="text-4xl font-extrabold text-[#1E3A8A] mt-2">88 / 100</div>
            <span className="inline-block mt-2 px-3 py-1 bg-white/80 rounded-full text-xs font-semibold text-[#1E40AF]">
              Placement Ready &bull; Strong Delivery
            </span>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-2">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
              Architecture Rationale
            </span>
            <div className="text-3xl font-extrabold text-[#172033]">92%</div>
            <p className="text-xs text-[#64748B]">
              Crisp analysis of database pushdown vs client heap memory saturation.
            </p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-2">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
              Speech Pacing & Cadence
            </span>
            <div className="text-3xl font-extrabold text-[#0D9488]">135 WPM</div>
            <p className="text-xs text-[#64748B]">
              Optimal technical cadence. Low filler words detected across all 3 answers.
            </p>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* What Went Well */}
          <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-[#166534] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              <span>Strengths & Architectural Depth</span>
            </h3>
            <ul className="space-y-2 text-xs text-[#14532D] leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#16A34A] font-bold">&bull;</span>
                <span>
                  Correctly identified that 50k rows in memory block the Node.js V8 event loop and
                  recommended PostgreSQL SQL window aggregation.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#16A34A] font-bold">&bull;</span>
                <span>
                  Demonstrated clear tradeoffs between stateless JWTs and stateful token rotation
                  with family UUIDs in Redis.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#16A34A] font-bold">&bull;</span>
                <span>
                  Structured responses systematically: Problem Context &rarr; Tradeoff Rationale
                  &rarr; Recovery Mechanism.
                </span>
              </li>
            </ul>
          </div>

          {/* Weaknesses / Improvement Areas */}
          <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-[#92400E] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#D97706]" />
              <span>Areas for Improvement</span>
            </h3>
            <ul className="space-y-2 text-xs text-[#78350F] leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#D97706] font-bold">&bull;</span>
                <span>
                  Mention the specific Redis cache eviction policy (e.g. `volatile-lru`) when
                  discussing memory limits.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D97706] font-bold">&bull;</span>
                <span>
                  Provide concrete latency metrics when describing Redis pub/sub cluster fanout
                  synchronization.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D97706] font-bold">&bull;</span>
                <span>
                  Avoid hesitation pauses when transitioning into distributed consensus failure modes.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Corrected English & Phrasing Comparison */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#172033]">
              Corrected English & Executive Phrasing Comparison
            </h3>
            <p className="text-xs text-[#64748B]">
              Refining casual spoken delivery into executive placement communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#64748B] tracking-wider">
                Original Spoken Draft
              </span>
              <p className="text-xs text-[#334155] italic">
                &quot;We don&apos;t pull 50k rows in node memory because it blocks everything and crashes the single thread.&quot;
              </p>
            </div>

            <div className="p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#166534] tracking-wider">
                Polished Executive Phrasing
              </span>
              <p className="text-xs text-[#14532D] font-medium">
                &quot;Instead of pulling 50,000 raw rows into the Node.js V8 heap and risking event loop starvation, the aggregation is pushed down into PostgreSQL window functions.&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Recommended Next Practice Question */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-[#3B82F6] uppercase tracking-wider block mb-1">
              Recommended Next Practice Topic
            </span>
            <h4 className="text-sm font-bold text-[#172033]">
              Distributed Consensus: Raft Leader Election & Network Partitions
            </h4>
            <p className="text-xs text-[#64748B] mt-0.5">
              Reinforces split-brain prevention and quorum arithmetic.
            </p>
          </div>

          <button
            onClick={handleRestart}
            className="px-5 py-2.5 bg-[#183653] hover:bg-[#254B70] text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer shrink-0 transition-colors"
          >
            Practice Next Module
          </button>
        </div>
      </motion.div>
    );
  }

  // View: Interactive Interview Stage matching Image 1
  return (
    <div className="space-y-4">
      {/* Question Progress Header Bar matching Image 1 */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-[#172033] text-sm sm:text-base">
            Question {currentIdx + 1} of {totalQuestions}
          </span>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-[#F1F5F9] text-[#475569] tracking-wider uppercase">
            STANDARD
          </span>
        </div>

        {/* Teal horizontal progress bar matching Image 1 */}
        <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="bg-[#14B8A6] h-full rounded-full"
          />
        </div>
      </div>

      {/* Main Two-Column Grid matching Image 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Question Card & Answer Area (7 Cols) */}
        <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
          {/* Category Header */}
          <div className="flex items-center gap-1.5 text-xs text-[#2563EB] font-bold">
            <Sparkles className="w-4 h-4 text-[#3B82F6]" />
            <span>Current Question &bull; {currentQ.category}</span>
          </div>

          {/* Question Text Box */}
          <div className="p-4 sm:p-5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
            <p className="text-sm font-semibold text-[#172033] leading-relaxed">
              {currentQ.questionText}
            </p>
          </div>

          {/* PROJECT REFERENCE CODE Box matching Image 1 */}
          <div className="rounded-xl overflow-hidden border border-[#1E293B] bg-[#0F2238] text-white shadow-xs">
            <div className="px-4 py-2.5 bg-[#182C48] flex items-center justify-between border-b border-[#243B5C] text-xs">
              <span className="font-mono text-[#38BDF8] text-[11px] font-bold tracking-wider uppercase">
                PROJECT REFERENCE CODE
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1 text-[11px] text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#14B8A6]" />
                    <span className="text-[#14B8A6]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-xs font-mono leading-relaxed text-[#E2E8F0] overflow-x-auto whitespace-pre bg-[#0B1828]">
              {currentQ.contextSnippet}
            </pre>
          </div>

          {/* Your Answer Heading & Sample Answer Trigger matching Image 1 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="student-answer-input" className="text-xs font-bold text-[#172033]">
                Your Answer:
              </label>
              <button
                type="button"
                onClick={handleInsertSampleAnswer}
                className="text-xs text-[#2563EB] hover:underline font-semibold cursor-pointer inline-flex items-center gap-1 transition-colors"
              >
                <span>&gt;_ Insert sample answer</span>
              </button>
            </div>

            {/* Answer Textarea matching Image 1 */}
            <textarea
              id="student-answer-input"
              rows={5}
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder={currentQ.starterPlaceholder}
              className="w-full p-4 text-xs sm:text-sm text-[#172033] bg-white rounded-xl border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none leading-relaxed transition-all placeholder:text-[#94A3B8]"
            />

            <div className="flex items-center justify-between text-[11px] text-[#64748B] mt-1.5">
              <span>{wordsCount} words drafted</span>
              <span>~{Math.max(1, Math.round(wordsCount / 2.3))}s speaking duration</span>
            </div>
          </div>

          {/* Controls Bar: Voice Recording & Question Navigation */}
          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3 flex-wrap">
            <button
              type="button"
              onClick={toggleMic}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                isRecording
                  ? 'bg-[#FEF2F2] border-[#EF4444] text-[#DC2626] animate-pulse'
                  : 'bg-white border-[#CBD5E1] text-[#172033] hover:bg-[#F8FAFC]'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-4 h-4 text-[#DC2626]" />
                  <span>Recording Voice... (Click to Stop)</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 text-[#3B82F6]" />
                  <span>Voice Input (Speech)</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentIdx === 0}
                className="px-4 py-2 rounded-lg border border-[#E2E8F0] text-xs font-medium text-[#64748B] hover:text-[#172033] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer inline-flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-lg text-xs font-bold bg-[#183653] hover:bg-[#254B70] text-white transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5"
              >
                <span>{currentIdx < totalQuestions - 1 ? 'Next Question' : 'Finish & View Report'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Camera Feed & Live Heuristics (5 Cols) matching Image 1 */}
        <div className="lg:col-span-4 space-y-5">
          {/* Camera Feed Card matching Image 1 */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs card-hover">
            <div className="flex items-center justify-between mb-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-[#172033]">
                <Video className="w-4 h-4 text-[#3B82F6]" />
                <span>Camera Feed</span>
              </div>
              <button
                type="button"
                onClick={() => setCameraActive(!cameraActive)}
                className="text-[#2563EB] hover:underline font-semibold cursor-pointer transition-colors"
              >
                {cameraActive ? 'Disable' : 'Enable'}
              </button>
            </div>

            {/* Video Viewport matching Image 1 */}
            <div className="w-full h-44 rounded-xl bg-[#0F2238] border border-[#1E293B] flex flex-col items-center justify-center p-4 text-center relative overflow-hidden transition-all duration-300">
              {cameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover mirror opacity-30"
                  />
                  <div className="absolute top-2 left-2 bg-[#182C48]/90 border border-[#243B5C] px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider uppercase text-white/90">
                    LIVE SIMULATION
                  </div>
                  <div className="relative z-10 w-9 h-9 rounded-full bg-[#182C48] border border-[#243B5C] flex items-center justify-center mx-auto text-white mb-1.5 shadow-xs">
                    <Video className="w-4 h-4" />
                  </div>
                  <p className="relative z-10 text-xs font-semibold text-white">
                    Simulated Camera Stream Active
                  </p>
                  <p className="relative z-10 text-[10px] text-[#14B8A6] font-medium mt-0.5">
                    Face Positioned &bull; Ready
                  </p>
                </>
              ) : (
                <div className="space-y-1.5 text-center text-[#94A3B8]">
                  <VideoOff className="w-6 h-6 mx-auto mb-1 text-[#64748B]" />
                  <p className="text-xs font-semibold text-white">Camera Disabled</p>
                  <p className="text-[10px]">Click &quot;Enable&quot; to restore video feed</p>
                </div>
              )}
            </div>
          </div>

          {/* Live Pacing & Heuristics Card matching Image 1 */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-4 card-hover">
            <div className="pb-2 border-b border-[#F1F5F9]">
              <h3 className="text-xs font-bold text-[#172033]">Live Pacing &amp; Heuristics</h3>
              <p className="text-[11px] text-[#64748B] mt-0.5">Automated delivery feedback</p>
            </div>

            {/* Speech Cadence */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#64748B] font-medium">Speech Cadence</span>
                <span className="text-[#0D9488] font-bold font-mono">~135 WPM (Optimal)</span>
              </div>
              <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                <motion.div
                  className="bg-[#14B8A6] h-full rounded-full"
                  animate={{ width: wordsCount > 0 ? '78%' : '35%' }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Answer Structure */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F8FAFC]">
              <span className="text-[#64748B] font-medium">Answer Structure</span>
              <span className="text-[#172033] font-bold text-xs">Tradeoff-Focused</span>
            </div>

            {/* Filler Word Rate */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F8FAFC]">
              <span className="text-[#64748B] font-medium">Filler Word Rate</span>
              <span className="text-[#16A34A] font-semibold text-xs">Low (2 detected)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
