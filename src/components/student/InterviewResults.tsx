import React from 'react';
import {
  Award,
  ShieldCheck,
  RotateCcw,
  LayoutDashboard,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { InterviewResult, StudentPage } from '../../types';
import { PageTransition, ScoreRing, AnimatedCounter } from '../common/Motion';

interface InterviewResultsProps {
  result: InterviewResult;
  onNavigate: (page: StudentPage) => void;
  onPracticeAgain: () => void;
}

export const InterviewResults: React.FC<InterviewResultsProps> = ({
  result,
  onNavigate,
  onPracticeAgain,
}) => {
  return (
    <PageTransition keyId="interview-results-page">
      <div className="space-y-6">
        {/* Top Banner with Actions */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-[#3B82F6] uppercase">
              Evaluation Complete &bull; Demo Simulation Data
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#172033] mt-1">
              Interview Results: {result.projectTitle}
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Completed round: <strong className="text-[#172033] font-semibold uppercase">{result.mode.replace('-', ' ')}</strong> on {result.date}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onPracticeAgain}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#F5F8FC] border border-[#E2E8F0] hover:bg-[#E2E8F0] text-[#172033] text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>Practice Again</span>
            </button>
            <button
              onClick={() => onNavigate('history')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#E2E8F0] hover:bg-[#F5F8FC] text-[#183653] text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              <Award className="w-3.5 h-3.5 text-[#14B8A6]" />
              <span>View Interview History</span>
            </button>
            <button
              onClick={() => onNavigate('overview')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#234A70] hover:bg-[#183653] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs active:scale-98"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Return to Dashboard</span>
            </button>
          </div>
        </div>

        {/* Primary Scores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Overall Score */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex items-center justify-between card-hover">
            <div>
              <span className="text-xs text-[#64748B] block font-medium">Overall Score</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#172033] font-mono tabular-nums">
                  <AnimatedCounter value={result.overallScore} />
                </span>
                <span className="text-xs text-[#64748B]">/ 100</span>
              </div>
              <p className="text-xs text-[#16A34A] font-semibold mt-1">
                Placement viva ready
              </p>
            </div>
            <ScoreRing percentage={result.overallScore} color="#14B8A6" size={68} strokeWidth={6} />
          </div>

          {/* Technical Understanding */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex items-center justify-between card-hover">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium">
                <ShieldCheck className="w-4 h-4 text-[#14B8A6]" />
                <span>Technical Understanding</span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#172033] font-mono tabular-nums">
                  <AnimatedCounter value={result.codeUnderstandingScore} suffix="%" />
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                Clear comprehension of state &amp; DB pushdown.
              </p>
            </div>
            <ScoreRing percentage={result.codeUnderstandingScore} color="#14B8A6" size={68} strokeWidth={6} />
          </div>

          {/* Speaking Delivery */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex items-center justify-between card-hover">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium">
                <Award className="w-4 h-4 text-[#3B82F6]" />
                <span>Speaking Delivery</span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#172033] font-mono tabular-nums">
                  <AnimatedCounter value={result.speakingDeliveryScore} suffix="%" />
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                Structured pacing with minimal filler words.
              </p>
            </div>
            <ScoreRing percentage={result.speakingDeliveryScore} color="#3B82F6" size={68} strokeWidth={6} />
          </div>
        </div>

        {/* Speaking Delivery Breakdown */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
          <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider mb-3.5">
            Speaking &amp; Delivery Metrics (Simulated Heuristics)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 bg-[#F5F8FC] rounded-lg border border-[#E2E8F0]">
              <span className="text-[#64748B] block text-[11px] font-medium">Answer Structure</span>
              <span className="font-bold text-[#172033] mt-1 block">{result.deliveryMetrics.structure}</span>
            </div>
            <div className="p-3.5 bg-[#F5F8FC] rounded-lg border border-[#E2E8F0]">
              <span className="text-[#64748B] block text-[11px] font-medium">Speech Cadence</span>
              <span className="font-bold text-[#172033] mt-1 block font-mono">{result.deliveryMetrics.pace}</span>
            </div>
            <div className="p-3.5 bg-[#F5F8FC] rounded-lg border border-[#E2E8F0]">
              <span className="text-[#64748B] block text-[11px] font-medium">Thinking Pauses</span>
              <span className="font-bold text-[#172033] mt-1 block">{result.deliveryMetrics.pauses}</span>
            </div>
            <div className="p-3.5 bg-[#F5F8FC] rounded-lg border border-[#E2E8F0]">
              <span className="text-[#64748B] block text-[11px] font-medium">Filler Word Count</span>
              <span className="font-bold text-[#172033] mt-1 block">{result.deliveryMetrics.fillerWords}</span>
            </div>
          </div>
        </div>

        {/* Strengths & Areas for Improvement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
            <div className="flex items-center gap-2 pb-3.5 border-b border-[#E2E8F0]">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              <h3 className="text-sm font-bold text-[#172033]">Strengths</h3>
            </div>
            <ul className="mt-4 space-y-3 text-xs text-[#172033]">
              {result.strengths.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                  <span className="text-[#16A34A] font-bold mt-0.5">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
            <div className="flex items-center gap-2 pb-3.5 border-b border-[#E2E8F0]">
              <AlertCircle className="w-4 h-4 text-[#D97706]" />
              <h3 className="text-sm font-bold text-[#172033]">Areas for Improvement</h3>
            </div>
            <ul className="mt-4 space-y-3 text-xs text-[#64748B]">
              {result.areasToImprove.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                  <span className="text-[#D97706] font-bold mt-0.5">!</span>
                  <span className="text-[#172033] font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Detailed Question Review */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
          <h3 className="text-sm font-bold text-[#172033] pb-3.5 border-b border-[#E2E8F0]">
            Question-by-Question Evaluation Breakdown
          </h3>

          <div className="mt-4 space-y-4">
            {result.answers.map((ans, idx) => (
              <div key={idx} className="p-4 bg-[#F5F8FC] rounded-xl border border-[#E2E8F0] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#234A70]">Question {idx + 1}</span>
                    <span className="text-[11px] font-mono text-[#64748B] uppercase">
                      [{ans.mode.replace('-', ' ')}]
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span>
                      Understanding: <strong className="text-[#14B8A6] font-mono font-semibold">{ans.codeUnderstandingScore}%</strong>
                    </span>
                    <span>·</span>
                    <span>
                      Delivery: <strong className="text-[#3B82F6] font-mono font-semibold">{ans.speakingDeliveryScore}%</strong>
                    </span>
                  </div>
                </div>

                <p className="text-xs font-semibold text-[#172033] leading-relaxed">
                  {ans.questionText}
                </p>

                <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] text-xs">
                  <span className="text-[11px] text-[#64748B] font-semibold block mb-1">Your Submitted Defense:</span>
                  <p className="text-[#172033] italic leading-relaxed">"{ans.studentAnswer}"</p>
                </div>

                <div className="text-xs text-[#64748B] flex items-start gap-2 pt-1">
                  <HelpCircle className="w-3.5 h-3.5 text-[#3B82F6] shrink-0 mt-0.5" />
                  <p className="leading-relaxed"><strong className="text-[#172033]">Coach Assessment:</strong> {ans.feedback}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Next Steps */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3.5">
            <BookOpen className="w-4 h-4 text-[#3B82F6]" />
            <h3 className="text-sm font-bold text-[#172033]">Suggested Next Steps</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {result.recommendedPracticeTopics.map((topic, idx) => (
              <div key={idx} className="p-3.5 bg-[#F5F8FC] rounded-lg border border-[#E2E8F0] flex items-center justify-between">
                <span className="text-[#172033] font-medium">{topic}</span>
                <button
                  onClick={onPracticeAgain}
                  className="text-[11px] text-[#3B82F6] hover:underline font-semibold cursor-pointer flex items-center gap-1"
                >
                  <span>Practice</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
