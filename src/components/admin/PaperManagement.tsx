import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  FileText,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  FileCheck,
  Send,
  Sparkles,
  Award,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ExamPaper, ExamSubmission, Batch, Student, AdminPage } from '../../types';
import { AddPaperModal } from './AddPaperModal';

interface PaperManagementProps {
  papers: ExamPaper[];
  submissions: ExamSubmission[];
  batches: Batch[];
  students: Student[];
  onSavePaper: (paper: ExamPaper) => void;
  onDeletePaper: (paperId: string) => void;
  onOpenSubmissions: (paper: ExamPaper) => void;
  onToggleReleaseResults: (paperId: string) => void;
  onNavigate: (page: AdminPage) => void;
}

export const PaperManagement: React.FC<PaperManagementProps> = ({
  papers,
  submissions,
  batches,
  students,
  onSavePaper,
  onDeletePaper,
  onOpenSubmissions,
  onToggleReleaseResults,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'scheduled' | 'draft' | 'completed'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState<ExamPaper | null>(null);

  // Assignment Modal
  const [assigningPaper, setAssigningPaper] = useState<ExamPaper | null>(null);
  const [selectedBatchesForAssign, setSelectedBatchesForAssign] = useState<string[]>([]);

  // Paper Preview Modal
  const [previewPaper, setPreviewPaper] = useState<ExamPaper | null>(null);

  const availableBatchNames = batches.map((b) => b.name);

  const filteredPapers = papers.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const liveCount = papers.filter((p) => p.status === 'published').length;
  const scheduledCount = papers.filter((p) => p.status === 'scheduled').length;
  const completedCount = papers.filter((p) => p.status === 'completed').length;
  const pendingEvaluationCount = submissions.filter((s) => s.status !== 'reviewed').length;

  const handleOpenAssignModal = (paper: ExamPaper) => {
    setAssigningPaper(paper);
    setSelectedBatchesForAssign(paper.assignedBatches || [paper.batch]);
  };

  const handleSaveAssignment = () => {
    if (!assigningPaper) return;
    const updated: ExamPaper = {
      ...assigningPaper,
      assignedBatches: selectedBatchesForAssign,
      batch: selectedBatchesForAssign[0] || assigningPaper.batch,
    };
    onSavePaper(updated);
    setAssigningPaper(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#172033]">
              Examination Question Papers
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EAF4FF] text-[#2563EB]">
              College Coding System
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Author and assign coding papers, ingest PDF syllabi with OCR, and audit proctored test results.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingPaper(null);
            setIsAddModalOpen(true);
          }}
          className="btn-interactive group inline-flex items-center gap-2 px-5 py-3 bg-[#183653] hover:bg-[#254B70] text-white text-xs font-semibold rounded-lg shrink-0 cursor-pointer shadow-xs hover:shadow-md"
        >
          <Plus className="w-4 h-4 text-[#38BDF8]" />
          <span>Add Paper</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Total Question Papers</span>
            <FileText className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#172033]">{papers.length}</span>
            <span className="text-[11px] text-[#64748B]">papers archived</span>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Live / Active Exams</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14B8A6] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14B8A6]"></span>
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#172033]">{liveCount}</span>
            <span className="text-[11px] text-[#14B8A6] font-medium">Accepting student entries</span>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Scheduled Upcoming</span>
            <Calendar className="w-4 h-4 text-[#0284C7]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#172033]">{scheduledCount}</span>
            <span className="text-[11px] text-[#64748B]">Locked until window</span>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Pending Evaluations</span>
            <Award className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#172033]">{pendingEvaluationCount}</span>
            <span className="text-[11px] text-[#F59E0B] font-medium">Awaiting faculty review</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search papers by title, subject, or code..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-hidden bg-[#F8FAFC]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'published', 'scheduled', 'draft', 'completed'] as const).map((filterKey) => (
            <button
              key={filterKey}
              onClick={() => setStatusFilter(filterKey)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors cursor-pointer shrink-0 ${
                statusFilter === filterKey
                  ? 'bg-[#183653] text-white font-semibold'
                  : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#172033]'
              }`}
            >
              {filterKey === 'all' ? 'All Papers' : filterKey}
            </button>
          ))}
        </div>
      </div>

      {/* Papers Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPapers.map((paper) => {
          const paperSubmissions = submissions.filter((s) => s.paperId === paper.id);

          return (
            <motion.div
              key={paper.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs hover:border-[#BFDBFE] transition-all card-hover"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Paper Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {paper.status === 'published' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#CCFBF1] text-[#0D9488]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse" />
                        Live Examination
                      </span>
                    )}
                    {paper.status === 'scheduled' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E0F2FE] text-[#0369A1]">
                        <Clock className="w-3 h-3" />
                        Scheduled: {paper.examDate}
                      </span>
                    )}
                    {paper.status === 'draft' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F1F5F9] text-[#64748B]">
                        Draft (Unpublished)
                      </span>
                    )}
                    {paper.status === 'completed' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#DCFCE7] text-[#15803D]">
                        ✓ Completed
                      </span>
                    )}

                    {paper.pdfSourceFileName && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#DBEAFE]">
                        <FileText className="w-3 h-3" />
                        PDF Ingested
                      </span>
                    )}

                    {paper.resultsReleased ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-[#DCFCE7] text-[#166534] rounded">
                        Results Released
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-medium bg-[#FEF3C7] text-[#92400E] rounded">
                        Results Withheld
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#172033] hover:text-[#254B70] transition-colors">
                      {paper.name}
                    </h3>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      Subject: <strong className="text-[#334155]">{paper.subject}</strong> &bull; Total Marks:{' '}
                      <strong className="text-[#334155]">{paper.totalMarks}</strong> ({paper.questions.length} questions) &bull; Duration:{' '}
                      <strong className="text-[#334155]">{paper.durationMinutes} mins</strong>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-[#64748B]">
                    <span className="flex items-center gap-1 text-[#334155]">
                      <Calendar className="w-3.5 h-3.5 text-[#3B82F6]" />
                      {paper.examDate} ({paper.startTime} - {paper.endTime})
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#64748B]" />
                      Assigned:{' '}
                      <strong className="text-[#183653]">
                        {paper.assignedBatches?.join(', ') || paper.batch}
                      </strong>
                    </span>
                    <span className="text-[#14B8A6] font-medium">
                      Submissions: {paperSubmissions.length} candidates
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#F1F5F9]">
                  <button
                    onClick={() => onOpenSubmissions(paper)}
                    className="px-3.5 py-2 text-xs font-semibold text-[#183653] bg-[#EAF4FF] hover:bg-[#DBEAFE] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Review Submissions ({paperSubmissions.length})</span>
                  </button>

                  <button
                    onClick={() => handleOpenAssignModal(paper)}
                    className="px-3 py-2 text-xs font-semibold text-[#475569] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Assign to specific classes or batches"
                  >
                    <Users className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Assign</span>
                  </button>

                  <button
                    onClick={() => setPreviewPaper(paper)}
                    className="px-3 py-2 text-xs font-semibold text-[#475569] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-lg transition-colors cursor-pointer"
                    title="Preview paper layout"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#3B82F6]" />
                  </button>

                  <button
                    onClick={() => {
                      setEditingPaper(paper);
                      setIsAddModalOpen(true);
                    }}
                    className="px-3 py-2 text-xs font-semibold text-[#475569] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-lg transition-colors cursor-pointer"
                    title="Edit questions and settings"
                  >
                    <Edit className="w-3.5 h-3.5 text-[#64748B]" />
                  </button>

                  <button
                    onClick={() => onToggleReleaseResults(paper.id)}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      paper.resultsReleased
                        ? 'bg-[#DCFCE7] text-[#15803D] hover:bg-[#BBF7D0]'
                        : 'bg-[#183653] text-white hover:bg-[#254B70]'
                    }`}
                  >
                    {paper.resultsReleased ? 'Results Released' : 'Release Results'}
                  </button>

                  {papers.length > 1 && (
                    <button
                      onClick={() => onDeletePaper(paper.id)}
                      className="p-2 text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg transition-colors cursor-pointer"
                      title="Delete paper"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredPapers.length === 0 && (
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-12 text-center">
            <FileText className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
            <h3 className="text-sm font-bold text-[#172033]">No question papers found</h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
              No examination papers match your current search or filter criteria. Create a new paper or reset filters.
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Paper Modal */}
      {isAddModalOpen && (
        <AddPaperModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingPaper(null);
          }}
          onSavePaper={onSavePaper}
          existingPaper={editingPaper}
          availableBatches={availableBatchNames}
        />
      )}

      {/* Assignment Modal */}
      {assigningPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[#CBD5E1] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#172033]">Assign Paper to Students</h3>
                <p className="text-xs text-[#64748B] truncate">{assigningPaper.name}</p>
              </div>
              <button
                onClick={() => setAssigningPaper(null)}
                className="text-[#64748B] hover:text-[#172033]"
              >
                &times;
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-2">
                Select Classes / Batches:
              </label>
              <div className="space-y-2">
                {availableBatchNames.map((batch) => {
                  const isChecked = selectedBatchesForAssign.includes(batch);
                  return (
                    <label
                      key={batch}
                      className={`flex items-center justify-between p-3 rounded-lg border text-xs cursor-pointer ${
                        isChecked ? 'bg-[#EAF4FF] border-[#3B82F6]' : 'bg-[#F8FAFC] border-[#E2E8F0]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBatchesForAssign([...selectedBatchesForAssign, batch]);
                            } else {
                              setSelectedBatchesForAssign(
                                selectedBatchesForAssign.filter((b) => b !== batch)
                              );
                            }
                          }}
                          className="accent-[#3B82F6]"
                        />
                        <span className="font-semibold text-[#172033]">{batch}</span>
                      </div>
                      <span className="text-[11px] text-[#64748B]">All registered students</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
              <button
                onClick={() => setAssigningPaper(null)}
                className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#172033]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAssignment}
                className="px-4 py-2 bg-[#183653] hover:bg-[#254B70] text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Save & Update Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white w-full max-w-3xl rounded-xl p-6 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl border border-[#CBD5E1]">
            <div className="border-b-2 border-[#183653] pb-4 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-[#254B70]">
                APEX INSTITUTE OF TECHNOLOGY &bull; FACULTY OF ENGINEERING
              </p>
              <h3 className="text-base font-bold text-[#172033] mt-1">{previewPaper.name}</h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Subject: {previewPaper.subject} &bull; Time: {previewPaper.durationMinutes} Minutes &bull; Max Marks:{' '}
                {previewPaper.totalMarks}
              </p>
            </div>

            <div className="space-y-4">
              {previewPaper.questions.map((q, idx) => (
                <div key={q.id || idx} className="p-4 border border-[#E2E8F0] rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-[#172033]">
                      Question {idx + 1}: {q.title}
                    </h4>
                    <span className="text-xs font-bold text-[#2563EB]">[{q.marks} Marks]</span>
                  </div>
                  <p className="text-xs text-[#334155] leading-relaxed">{q.problemStatement}</p>
                  <div className="text-[11px] bg-[#F8FAFC] p-2.5 rounded font-mono text-[#334155]">
                    <strong>Sample Input:</strong> {q.sampleInputsOutputs[0]?.input}
                    <br />
                    <strong>Sample Output:</strong> {q.sampleInputsOutputs[0]?.output}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E2E8F0]">
              <button
                onClick={() => setPreviewPaper(null)}
                className="px-4 py-2 bg-[#183653] text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
