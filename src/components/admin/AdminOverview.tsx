import React, { useState } from 'react';
import {
  Users,
  FileCheck2,
  Award,
  AlertTriangle,
  Search,
  ArrowRight,
  Plus,
  FileCode2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Student, Assessment, Batch, AdminPage } from '../../types';
import { AnimatedCounter, StaggerContainer, AnimatedCard } from '../common/Motion';

interface AdminOverviewProps {
  students: Student[];
  assessments: Assessment[];
  batches: Batch[];
  onSelectStudent: (student: Student) => void;
  onNavigate: (page: AdminPage) => void;
  onViewAssessment?: (assessment: Assessment) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  students,
  assessments,
  onSelectStudent,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('all');

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBatch = selectedBatch === 'all' || s.batch === selectedBatch;
    return matchesSearch && matchesBatch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172033]">
            Placement Readiness
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Track student placement competencies, schedule coding examinations, and evaluate viva readiness.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('papers')}
            className="btn-interactive group inline-flex items-center gap-2 px-4 py-3 bg-[#EAF4FF] hover:bg-[#DBEAFE] text-[#183653] text-xs font-semibold rounded-lg shrink-0 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4 text-[#2563EB]" />
            <span>Add Paper</span>
          </button>

          <button
            onClick={() => onNavigate('previva')}
            className="btn-interactive group inline-flex items-center gap-2 px-5 py-3 bg-[#183653] hover:bg-[#254B70] text-white text-xs font-semibold rounded-lg shrink-0 cursor-pointer shadow-xs hover:shadow-md"
          >
            <span>Review Assessment</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* 4 Metric Cards with Staggered Entrance & Counters */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Students */}
        <AnimatedCard className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs card-hover">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-medium">Students</span>
            <div className="w-7 h-7 rounded-lg bg-[#EAF4FF] flex items-center justify-center text-[#3B82F6] transition-transform hover:scale-105">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#172033] font-mono tabular-nums">
              <AnimatedCounter value={142} />
            </span>
            <span className="text-[11px] text-[#64748B]">enrolled</span>
          </div>
        </AnimatedCard>

        {/* Card 2: Assessments */}
        <AnimatedCard className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs card-hover">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-medium">Assessments</span>
            <div className="w-7 h-7 rounded-lg bg-[#F0FDF4] flex items-center justify-center text-[#16A34A] transition-transform hover:scale-105">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#172033] font-mono tabular-nums">
              <AnimatedCounter value={384} />
            </span>
            <span className="text-[11px] text-[#16A34A] font-semibold">
              +28 this week
            </span>
          </div>
        </AnimatedCard>

        {/* Card 3: Avg. Readiness */}
        <AnimatedCard className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs card-hover">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-medium">Avg. Readiness</span>
            <div className="w-7 h-7 rounded-lg bg-[#F0FDFA] flex items-center justify-center text-[#14B8A6] transition-transform hover:scale-105">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#172033] font-mono tabular-nums">
              <AnimatedCounter value={79} suffix="%" />
            </span>
            <span className="text-[11px] text-[#14B8A6] font-semibold">
              +3.4%
            </span>
          </div>
        </AnimatedCard>

        {/* Card 4: Need Practice */}
        <AnimatedCard className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs card-hover">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-medium">Need Practice</span>
            <div className="w-7 h-7 rounded-lg bg-[#FEF2F2] flex items-center justify-center text-[#DC2626] transition-transform hover:scale-105">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#DC2626] font-mono tabular-nums">
              <AnimatedCounter value={18} />
            </span>
            <span className="text-[11px] text-[#64748B]">students</span>
          </div>
        </AnimatedCard>
      </StaggerContainer>

      {/* Cohort Readiness Distribution Bar with Smooth Animation */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs card-hover">
        <div className="flex items-center justify-between mb-3 text-xs">
          <h2 className="font-bold text-[#172033] uppercase tracking-wide">
            READINESS DISTRIBUTION
          </h2>
          <span className="text-[#64748B] font-mono">142 students</span>
        </div>

        {/* Segmented multi-color progress bar */}
        <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden flex">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '68%' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#16A34A] h-full"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '19%' }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#F59E0B] h-full"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '13%' }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#EF4444] h-full"
          />
        </div>

        {/* Legend with hover micro-feedback */}
        <div className="mt-4 flex flex-wrap items-center gap-6 text-xs">
          <div className="flex items-center gap-2 transition-transform hover:scale-[1.02]">
            <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
            <span className="font-medium text-[#172033]">
              Placement Ready: 96 (68%)
            </span>
          </div>
          <div className="flex items-center gap-2 transition-transform hover:scale-[1.02]">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <span className="font-medium text-[#172033]">
              Marginal / Refining: 28 (19%)
            </span>
          </div>
          <div className="flex items-center gap-2 transition-transform hover:scale-[1.02]">
            <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
            <span className="font-medium text-[#172033]">
              Needs Urgent Practice: 18 (13%)
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Student Performance + Recent Assessments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Table: Student Performance */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden flex flex-col justify-between card-hover">
          <div>
            <div className="p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-sm font-bold text-[#172033]">
                Student Performance
              </h2>

              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-xs font-medium text-[#172033] outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/15 transition-all"
              >
                <option value="all">All Batches</option>
                <option value="2026 CS-A">2026 CS-A</option>
                <option value="2026 CS-B">2026 CS-B</option>
                <option value="2026 IT-A">2026 IT-A</option>
              </select>
            </div>

            {/* Search Input with smooth focus transition */}
            <div className="p-4 border-b border-[#E2E8F0] bg-[#FAFAFA]">
              <div className="relative">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 transition-colors" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search candidate by name or roll number..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-[#CBD5E1] rounded-lg text-xs text-[#172033] placeholder:text-[#94A3B8] outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/15 transition-all"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-[#64748B] border-b border-[#E2E8F0]">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Candidate</th>
                    <th className="px-5 py-3 font-semibold">Batch</th>
                    <th className="px-5 py-3 font-semibold">Code Score</th>
                    <th className="px-5 py-3 font-semibold">Delivery</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredStudents.slice(0, 5).map((student, idx) => {
                    const isVedant = student.rollNumber === '2026CS104';
                    const codeDisplay = isVedant ? 86 : student.codeUnderstandingScore;
                    const deliveryDisplay = isVedant ? 79 : student.speakingDeliveryScore;

                    return (
                      <motion.tr
                        key={student.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: idx * 0.03 }}
                        className="hover:bg-[#F8FAFC] transition-colors group"
                      >
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-[#172033] group-hover:text-[#2563EB] transition-colors">
                            {student.name}
                          </p>
                          <p className="text-[11px] font-mono text-[#64748B]">
                            {student.rollNumber}
                          </p>
                        </td>

                        <td className="px-5 py-3.5 text-[#64748B] font-medium">
                          {student.batch}
                        </td>

                        <td className="px-5 py-3.5 font-bold font-mono text-[#14B8A6]">
                          {codeDisplay}%
                        </td>

                        <td className="px-5 py-3.5 font-bold font-mono text-[#3B82F6]">
                          {deliveryDisplay}%
                        </td>

                        <td className="px-5 py-3.5">
                          {student.readinessStatus === 'Ready' && (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#16A34A] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0] transition-transform hover:scale-105">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                              Ready
                            </span>
                          )}
                          {student.readinessStatus === 'Needs Practice' && (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#DC2626] bg-[#FEF2F2] px-2.5 py-0.5 rounded-full border border-[#FECACA] transition-transform hover:scale-105">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                              Needs Practice
                            </span>
                          )}
                          {student.readinessStatus === 'Marginal' && (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#D97706] bg-[#FFFBEB] px-2.5 py-0.5 rounded-full border border-[#FDE68A] transition-transform hover:scale-105">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                              Marginal
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => onSelectStudent(student)}
                            className="text-[#3B82F6] hover:text-[#1D4ED8] hover:underline font-semibold cursor-pointer inline-flex items-center gap-1 transition-all group-hover:translate-x-0.5"
                          >
                            <span>Inspect</span>
                            <span>&rarr;</span>
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Card: Recent Assessments */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs flex flex-col justify-between card-hover">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8F0]">
              <h3 className="text-sm font-bold text-[#172033]">Recent Assessments</h3>
              <span className="text-[11px] text-[#64748B] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-ping" />
                Live Activity
              </span>
            </div>

            <div className="divide-y divide-[#E2E8F0] mt-1">
              {assessments.slice(0, 4).map((a, idx) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.04 }}
                  className="py-3.5 space-y-1.5 text-xs transition-colors hover:bg-[#F8FAFC]/60 rounded-lg px-2 -mx-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#172033]">{a.studentName}</span>
                    <span className="font-mono font-bold text-[#14B8A6]">{a.score}%</span>
                  </div>

                  <p className="text-[11px] text-[#64748B] truncate">
                    {a.projectTitle} &bull; {a.type}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[#94A3B8] font-mono">
                      {a.completionDate}
                    </span>
                    {a.reviewStatus === 'Pending Review' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#D97706] bg-[#FFFBEB] px-2 py-0.5 rounded border border-[#FDE68A] transition-transform hover:scale-105">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
                        Pending Review
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#16A34A] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0] transition-transform hover:scale-105">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                        Faculty Reviewed
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
