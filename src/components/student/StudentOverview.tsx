import React from 'react';
import {
  ArrowRight,
  GitBranch,
  ShieldCheck,
  Award,
  Flame,
  CheckCircle,
  FileCode2,
} from 'lucide-react';
import { Student, Project, InterviewResult, StudentPage } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { StaggerContainer, AnimatedCard, AnimatedCounter, ScoreRing } from '../common/Motion';

interface StudentOverviewProps {
  student: Student;
  primaryProject: Project;
  latestResult?: InterviewResult;
  onNavigate: (page: StudentPage) => void;
  onSelectProject: (project: Project) => void;
  onStartInterviewWithMode?: (mode: 'standard' | 'trap-hint' | 'break-it') => void;
}

export const StudentOverview: React.FC<StudentOverviewProps> = ({
  student,
  primaryProject,
  latestResult,
  onNavigate,
}) => {
  const codeScore = 88;
  const speechScore = 80;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172033]">
            Welcome back, {student.name}
          </h1>
          <p className="text-xs text-[#64748B] mt-1 font-mono">
            {student.rollNumber} &bull; Batch {student.batch}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('exams')}
            className="btn-interactive group inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#EAF4FF] hover:bg-[#DBEAFE] text-[#183653] text-xs font-semibold rounded-lg shrink-0 cursor-pointer shadow-xs"
          >
            <FileCode2 className="w-4 h-4 text-[#2563EB]" />
            <span>Assigned Exams</span>
          </button>

          <button
            onClick={() => onNavigate('practice')}
            className="btn-interactive group inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#183653] hover:bg-[#254B70] text-white text-xs font-semibold rounded-lg shrink-0 cursor-pointer shadow-xs hover:shadow-md"
          >
            <span>Start Interview</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Code Understanding */}
        <AnimatedCard className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#64748B]">Code Understanding</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#172033] font-mono tabular-nums">
                <AnimatedCounter value={codeScore} suffix="%" />
              </span>
              <span className="text-[11px] text-[#16A34A] font-semibold">+4%</span>
            </div>
            <p className="text-[11px] text-[#64748B] mt-1">Strong project comprehension</p>
          </div>
          <ScoreRing percentage={codeScore} color="#14B8A6" size={54} />
        </AnimatedCard>

        {/* Card 2: Speaking Delivery */}
        <AnimatedCard className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#64748B]">Speaking Delivery</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#172033] font-mono tabular-nums">
                <AnimatedCounter value={speechScore} suffix="%" />
              </span>
              <span className="text-[11px] text-[#3B82F6] font-semibold">136 WPM</span>
            </div>
            <p className="text-[11px] text-[#64748B] mt-1">Clear pacing and structure</p>
          </div>
          <ScoreRing percentage={speechScore} color="#3B82F6" size={54} />
        </AnimatedCard>

        {/* Card 3: Interview Readiness */}
        <AnimatedCard className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-medium">Interview Readiness</span>
            <ShieldCheck className="w-4 h-4 text-[#14B8A6]" />
          </div>
          <div className="mt-3">
            <StatusBadge status="Ready" />
          </div>
          <p className="text-[11px] text-[#64748B] mt-2 leading-relaxed">
            Approved for campus technical interviews
          </p>
        </AnimatedCard>

        {/* Card 4: Completed Interviews */}
        <AnimatedCard className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-medium">Completed Interviews</span>
            <Flame className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#172033] font-mono tabular-nums">
              <AnimatedCounter value={5} />
            </span>
            <span className="text-[11px] text-[#64748B]">completed sessions</span>
          </div>
          <p className="text-[11px] text-[#64748B] mt-1">
            Standard, Trap Hint &amp; Break It
          </p>
        </AnimatedCard>
      </StaggerContainer>

      {/* 2-Column Split: Connected Project + Latest Interview Result */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connected Project */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col justify-between card-hover">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#3B82F6]" />
                <h2 className="text-sm font-semibold text-[#172033]">Connected Project</h2>
              </div>
              <StatusBadge status="Analysed" />
            </div>

            <div className="mt-4">
              <h3 className="text-base font-bold text-[#172033]">
                {primaryProject.title}
              </h3>
              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                {primaryProject.description}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#F5F8FC] p-3 rounded-lg border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[11px] font-medium">Tech Stack</span>
                  <span className="font-semibold text-[#172033] mt-0.5 block truncate">
                    {primaryProject.language}
                  </span>
                </div>
                <div className="bg-[#F5F8FC] p-3 rounded-lg border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[11px] font-medium">Last Analyzed</span>
                  <span className="font-semibold text-[#172033] mt-0.5 block truncate">
                    {primaryProject.lastAnalyzed}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-[#64748B]">
                <span className="bg-[#EAF4FF] text-[#234A70] px-2 py-0.5 rounded font-medium text-[11px]">
                  {primaryProject.modules.length} Modules
                </span>
                <span>&bull;</span>
                <span className="text-[#64748B] text-[11px] font-medium">
                  {primaryProject.keyFunctions.length} Functions
                </span>
                <span>&bull;</span>
                <span className="text-[#234A70] text-[11px] font-semibold">
                  {primaryProject.potentialTopics.length} Topics
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Interview Result */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col justify-between card-hover">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#14B8A6]" />
                <h2 className="text-sm font-semibold text-[#172033]">Latest Interview Result</h2>
              </div>
              <span className="text-xs text-[#64748B] font-mono">October 25, 2026</span>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[11px] font-bold text-[#3B82F6] uppercase tracking-wider">
                    STANDARD
                  </span>
                  <h3 className="text-base font-bold text-[#172033] mt-0.5">
                    Overall Score: 84 / 100
                  </h3>
                </div>
                <ScoreRing
                  percentage={84}
                  color="#14B8A6"
                  size={60}
                  strokeWidth={5}
                />
              </div>

              <div className="space-y-2 mt-4 text-xs">
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <p className="text-[#172033] leading-relaxed">
                    <strong className="font-semibold">Strengths:</strong> Accurate explanation of database pushdown vs client heap memory limits
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#D97706] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    !
                  </span>
                  <p className="text-[#64748B] leading-relaxed">
                    <strong className="text-[#172033] font-semibold">Areas for Improvement:</strong>{' '}
                    Provide more concrete numbers when discussing Redis memory overhead
                  </p>
                </div>
              </div>

              <div className="mt-4 bg-[#F5F8FC] p-3 rounded-lg border border-[#E2E8F0] text-xs">
                <span className="text-[#64748B] block text-[11px] font-medium mb-0.5">
                  Speaking Delivery
                </span>
                <p className="text-[#172033] font-medium">Structured (Context -&gt; Technical Rationale -&gt; Concrete Outcome)</p>
                <p className="text-[#64748B] text-[11px] mt-0.5">
                  Pace: 138 words / minute (Optimal)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
