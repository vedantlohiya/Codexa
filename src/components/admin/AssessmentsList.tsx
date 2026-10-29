import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  X,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Save,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Assessment } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { PageTransition } from '../common/Motion';

interface AssessmentsListProps {
  assessments: Assessment[];
  onUpdateAssessment: (updated: Assessment) => void;
  showToast: (title: string, message?: string) => void;
}

export const AssessmentsList: React.FC<AssessmentsListProps> = ({
  assessments,
  onUpdateAssessment,
  showToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [activeNotes, setActiveNotes] = useState('');

  const filteredAssessments = assessments.filter((a) => {
    const matchSearch =
      a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.projectTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.reviewStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleOpenDetail = (asm: Assessment) => {
    setSelectedAssessment(asm);
    setActiveNotes(asm.facultyNotes || '');
  };

  const handleMarkReviewed = () => {
    if (!selectedAssessment) return;
    const updated: Assessment = {
      ...selectedAssessment,
      reviewStatus: 'Faculty Reviewed',
      facultyNotes: activeNotes,
      reviewedBy: 'Dr. Marcus Vance',
    };
    onUpdateAssessment(updated);
    setSelectedAssessment(updated);
    showToast('Assessment Marked Reviewed', 'Official faculty approval and notes saved.');
  };

  return (
    <PageTransition keyId="assessments-list-page">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#172033]">Pre-Viva Assessments Log</h1>
            <p className="text-xs text-[#64748B] mt-1">
              Searchable audit trail of mock viva interviews, AI diagnostics, and faculty reviews.
            </p>
          </div>

          <div className="text-xs text-[#64748B] font-mono font-medium">
            <span>{assessments.length} Total Assessments</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by candidate name, roll number, or project..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E2E8F0] rounded-lg text-[#172033] focus:outline-none focus:border-[#3B82F6] transition-colors"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-[#E2E8F0] rounded-lg text-[#172033] font-medium focus:outline-none focus:border-[#3B82F6]"
          >
            <option value="all">All Review Statuses</option>
            <option value="Pending Review">Pending Faculty Review</option>
            <option value="Faculty Reviewed">Faculty Reviewed</option>
          </select>
        </div>

        {/* Assessments Table */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F5F8FC] border-b border-[#E2E8F0] text-[#64748B]">
                  <th className="py-3 px-4 font-semibold">Candidate</th>
                  <th className="py-3 px-4 font-semibold">Project Title</th>
                  <th className="py-3 px-4 font-semibold">Assessment Type</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Understanding</th>
                  <th className="py-3 px-4 font-semibold">Delivery</th>
                  <th className="py-3 px-4 font-semibold">Score</th>
                  <th className="py-3 px-4 font-semibold">Review Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredAssessments.map((asm) => (
                  <tr key={asm.id} className="hover:bg-[#F5F8FC]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#172033]">{asm.studentName}</div>
                      <div className="text-[11px] font-mono text-[#64748B]">{asm.rollNumber}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#172033]">{asm.projectTitle}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-mono text-[#234A70] bg-[#EAF4FF] px-2.5 py-0.5 rounded-md font-semibold">
                        {asm.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B] font-mono text-[11px] font-medium">
                      {asm.completionDate}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#14B8A6] tabular-nums">
                      {asm.codeUnderstanding}%
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#3B82F6] tabular-nums">
                      {asm.speakingDelivery}%
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#172033] tabular-nums">
                      {asm.score} / 100
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={asm.reviewStatus} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(asm)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-[#234A70] hover:bg-[#EAF4FF] rounded-lg border border-[#CBD5E1] transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#3B82F6]" />
                        <span>Review</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal / Drawer with Motion */}
        <AnimatePresence>
          {selectedAssessment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl border border-[#E2E8F0] max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl"
              >
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#64748B] uppercase font-bold tracking-wider">
                      Assessment Audit
                    </span>
                    <h3 className="text-base font-bold text-[#172033]">
                      {selectedAssessment.studentName} ({selectedAssessment.rollNumber})
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedAssessment(null)}
                    className="text-[#64748B] hover:text-[#172033] p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8F0]">
                    <div>
                      <span className="text-[#64748B] block text-[11px] font-medium">Project:</span>
                      <span className="font-bold text-sm text-[#172033]">
                        {selectedAssessment.projectTitle}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#64748B] font-mono font-medium">{selectedAssessment.type}</span>
                      <StatusBadge status={selectedAssessment.reviewStatus} />
                    </div>
                  </div>

                  {/* Question Summary */}
                  <div className="bg-[#F5F8FC] p-3.5 rounded-xl border border-[#E2E8F0] space-y-1">
                    <span className="font-bold text-[#172033]">Questions Evaluated:</span>
                    <p className="text-[#64748B] leading-relaxed">{selectedAssessment.questionSummary}</p>
                  </div>

                  {/* Student Response */}
                  <div className="bg-[#F5F8FC] p-3.5 rounded-xl border border-[#E2E8F0] space-y-1">
                    <span className="font-bold text-[#172033]">Candidate Submitted Defense:</span>
                    <p className="text-[#172033] italic leading-relaxed">
                      "{selectedAssessment.studentResponseSnippet}"
                    </p>
                  </div>

                  {/* Simulated AI Diagnostic */}
                  <div className="p-3.5 bg-[#EAF4FF] rounded-xl border border-[#BFDBFE] space-y-1 text-[#234A70]">
                    <div className="flex items-center gap-1.5 font-bold">
                      <HelpCircle className="w-3.5 h-3.5 text-[#3B82F6]" />
                      <span>AI Pre-Evaluation Diagnostic (Sample Model)</span>
                    </div>
                    <p className="text-xs leading-relaxed text-[#172033]">
                      {selectedAssessment.aiEvaluationSummary}
                    </p>
                  </div>

                  {/* Faculty Notes Field */}
                  <div className="space-y-1.5 pt-2">
                    <label className="block font-bold text-[#172033]">
                      Faculty Review Remarks &amp; Feedback:
                    </label>
                    <textarea
                      rows={4}
                      value={activeNotes}
                      onChange={(e) => setActiveNotes(e.target.value)}
                      placeholder="Enter official faculty pre-viva observations..."
                      className="w-full p-3 bg-white border border-[#E2E8F0] rounded-xl text-[#172033] focus:outline-none focus:border-[#3B82F6] leading-relaxed text-xs transition-colors"
                    />
                    {selectedAssessment.reviewedBy && (
                      <p className="text-[11px] text-[#64748B]">
                        Reviewed by: <strong className="text-[#172033]">{selectedAssessment.reviewedBy}</strong>
                      </p>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-3.5 border-t border-[#E2E8F0] flex items-center justify-between">
                  <button
                    onClick={() => setSelectedAssessment(null)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-[#64748B] hover:text-[#172033] rounded-lg cursor-pointer"
                  >
                    Close
                  </button>

                  <button
                    onClick={handleMarkReviewed}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#234A70] hover:bg-[#183653] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs active:scale-98"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#14B8A6]" />
                    <span>Save &amp; Mark Officially Reviewed</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};
