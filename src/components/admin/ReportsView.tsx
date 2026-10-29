import React, { useState } from 'react';
import {
  FileBarChart,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  ArrowUpRight,
  TrendingUp,
  BrainCircuit,
  MessageSquare,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Student, Assessment, Batch } from '../../types';
import { PageTransition, AnimatedCounter } from '../common/Motion';

interface ReportsViewProps {
  students: Student[];
  assessments: Assessment[];
  batches: Batch[];
  showToast: (title: string, message?: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  students,
  assessments,
  batches,
  showToast,
}) => {
  const [selectedBatch, setSelectedBatch] = useState('all');

  const filteredAssessments = assessments.filter(
    (a) => selectedBatch === 'all' || a.batch === selectedBatch
  );

  const filteredStudents = students.filter(
    (s) => selectedBatch === 'all' || s.batch === selectedBatch
  );

  const avgTechnical = filteredAssessments.length
    ? Math.round(
        filteredAssessments.reduce((sum, a) => sum + a.codeUnderstanding, 0) /
          filteredAssessments.length
      )
    : 81;

  const avgSpeaking = filteredAssessments.length
    ? Math.round(
        filteredAssessments.reduce((sum, a) => sum + a.speakingDelivery, 0) /
          filteredAssessments.length
      )
    : 79;

  const readyCount = filteredStudents.filter((s) => s.readinessStatus === 'Ready').length;
  const improvingCount = filteredStudents.filter((s) => s.readinessStatus === 'Marginal').length;
  const urgentCount = filteredStudents.filter((s) => s.readinessStatus === 'Needs Practice').length;
  const totalCount = filteredStudents.length || 1;

  const readyPct = Math.round((readyCount / totalCount) * 100);
  const improvingPct = Math.round((improvingCount / totalCount) * 100);
  const urgentPct = 100 - readyPct - improvingPct;

  const handleExportCSV = () => {
    const headers = [
      'Candidate Name',
      'Roll Number',
      'Department',
      'Batch',
      'Project Title',
      'Assessment Type',
      'Completion Date',
      'Score',
      'Code Understanding %',
      'Speaking Delivery %',
      'Review Status',
      'Faculty Reviewer',
    ];

    const rows = filteredAssessments.map((a) => [
      `"${a.studentName.replace(/"/g, '""')}"`,
      `"${a.rollNumber}"`,
      `"${a.department}"`,
      `"${a.batch}"`,
      `"${a.projectTitle.replace(/"/g, '""')}"`,
      `"${a.type}"`,
      `"${a.completionDate}"`,
      a.score,
      a.codeUnderstanding,
      a.speakingDelivery,
      `"${a.reviewStatus}"`,
      `"${(a.reviewedBy || 'Pending').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `prove_you_built_it_report_${selectedBatch.replace(/\s+/g, '_')}_${Date.now()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('CSV Report Exported', `Downloaded viva records for ${rows.length} candidates.`);
  };

  const skillGaps = [
    {
      skill: 'Optimistic Locking vs Database Deadlocks',
      studentsAffected: 14,
      department: 'Computer Science',
      severity: 'High',
    },
    {
      skill: 'Webhook Idempotency & Replay Protection',
      studentsAffected: 11,
      department: 'Information Technology',
      severity: 'High',
    },
    {
      skill: 'Redis Cache Invalidation Patterns (Cache-Aside vs Write-Through)',
      studentsAffected: 9,
      department: 'Computer Science & IT',
      severity: 'Medium',
    },
    {
      skill: 'Speaking Pacing Consistency Under Trap Questions',
      studentsAffected: 16,
      department: 'All Departments',
      severity: 'Medium',
    },
  ];

  return (
    <PageTransition keyId="reports-view-page">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#172033]">Placement &amp; Pre-Viva Reports</h1>
            <p className="text-xs text-[#64748B] mt-1">
              Institutional readiness statistics, cohort skill gaps, and downloadable accreditation records.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#234A70] hover:bg-[#183653] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 shadow-xs active:scale-98"
          >
            <Download className="w-4 h-4 text-[#14B8A6]" />
            <span>Export Report</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#64748B]" />
            <span className="font-semibold text-[#172033]">Filter by Cohort:</span>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-[#E2E8F0] rounded-lg text-[#172033] font-medium focus:outline-none focus:border-[#3B82F6]"
            >
              <option value="all">All Batches (142 Total Candidates)</option>
              {batches.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name} ({b.totalStudents} Candidates)
                </option>
              ))}
            </select>
          </div>

          <span className="text-[#64748B] font-mono font-medium">
            Showing {filteredAssessments.length} assessment records
          </span>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
              <span>Assessments Evaluated</span>
              <FileBarChart className="w-4 h-4 text-[#3B82F6]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#172033]">
              <AnimatedCounter value={filteredAssessments.length} />
            </div>
            <span className="text-[11px] text-[#14B8A6] font-medium mt-1 inline-block">
              100% verified defense records
            </span>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
              <span>Avg Code Understanding</span>
              <BrainCircuit className="w-4 h-4 text-[#14B8A6]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#172033]">
              <AnimatedCounter value={avgTechnical} suffix="%" />
            </div>
            <span className="text-[11px] text-[#64748B] font-medium mt-1 inline-block">
              Project architecture depth
            </span>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
              <span>Avg Speaking Delivery</span>
              <MessageSquare className="w-4 h-4 text-[#3B82F6]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#172033]">
              <AnimatedCounter value={avgSpeaking} suffix="%" />
            </div>
            <span className="text-[11px] text-[#64748B] font-medium mt-1 inline-block">
              Verbal clarity &amp; defense pace
            </span>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
              <span>Placement Ready</span>
              <Award className="w-4 h-4 text-[#16A34A]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#16A34A]">
              <AnimatedCounter value={readyPct} suffix="%" />
            </div>
            <span className="text-[11px] text-[#64748B] font-medium mt-1 inline-block">
              {readyCount} of {totalCount} verified candidates
            </span>
          </div>
        </div>

        {/* Readiness Distribution Bar */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-sm font-bold text-[#172033]">Institutional Readiness Distribution</h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Categorization based on code defense, trap resistance, and speaking delivery.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-[#16A34A]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                Placement-Ready ({readyPct}%)
              </span>
              <span className="flex items-center gap-1.5 text-[#F59E0B]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                Needs Practice ({improvingPct}%)
              </span>
              <span className="flex items-center gap-1.5 text-[#EF4444]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                At Risk ({urgentPct}%)
              </span>
            </div>
          </div>

          <div className="h-3 w-full bg-[#E2E8F0] rounded-full overflow-hidden flex">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${readyPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="bg-[#16A34A] h-full"
              title={`Placement Ready: ${readyPct}%`}
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${improvingPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
              className="bg-[#F59E0B] h-full"
              title={`Needs Practice: ${improvingPct}%`}
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${urgentPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="bg-[#EF4444] h-full"
              title={`At Risk: ${urgentPct}%`}
            />
          </div>
        </div>

        {/* 2-Column: Batch Summary + Skill Gaps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Batch Performance Summary */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3.5 border-b border-[#E2E8F0]">
              <Layers className="w-4 h-4 text-[#3B82F6]" />
              <h2 className="text-sm font-bold text-[#172033]">Batch Readiness Breakdown</h2>
            </div>

            <div className="space-y-3.5 text-xs">
              {batches.map((batch) => (
                <div key={batch.id} className="p-3.5 bg-[#F5F8FC] rounded-xl border border-[#E2E8F0] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#172033]">{batch.name}</span>
                    <span className="font-mono text-[#14B8A6] font-bold">{batch.averageReadiness}% Avg</span>
                  </div>
                  <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      className="bg-[#234A70] h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${batch.averageReadiness}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1 font-medium">
                    <span>{batch.totalStudents} Candidates</span>
                    <span>{batch.completedAssessments} Vivas Done</span>
                    <span className="text-[#DC2626]">{batch.needsPracticeCount} Need Remedial</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Skill Gaps */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3.5 border-b border-[#E2E8F0]">
              <AlertTriangle className="w-4 h-4 text-[#D97706]" />
              <h2 className="text-sm font-bold text-[#172033]">Identified Cohort Skill Gaps</h2>
            </div>

            <div className="space-y-3 text-xs">
              {skillGaps.map((gap, idx) => (
                <div key={idx} className="p-3.5 bg-[#F5F8FC] rounded-xl border border-[#E2E8F0] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#172033]">{gap.skill}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        gap.severity === 'High'
                          ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
                          : 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]'
                      }`}
                    >
                      {gap.severity} Priority
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1">
                    <span>{gap.department}</span>
                    <span className="font-mono font-medium">{gap.studentsAffected} students flagged</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
