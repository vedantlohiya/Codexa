import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ShieldCheck,
  Award,
  FileCode2,
  Save,
  Send,
  UserCheck,
  AlertTriangle,
  Eye,
  Check,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ExamPaper, ExamSubmission, QuestionAnswerSubmission } from '../../types';

interface ExamSubmissionsReviewProps {
  paper: ExamPaper;
  submissions: ExamSubmission[];
  onBack: () => void;
  onUpdateSubmission: (submission: ExamSubmission) => void;
  onToggleReleaseResults: (paperId: string) => void;
}

export const ExamSubmissionsReview: React.FC<ExamSubmissionsReviewProps> = ({
  paper,
  submissions,
  onBack,
  onUpdateSubmission,
  onToggleReleaseResults,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>(
    submissions[0]?.id || ''
  );
  const [manualMarks, setManualMarks] = useState<number>(0);
  const [facultyNotes, setFacultyNotes] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const filteredSubmissions = submissions.filter((s) => {
    return (
      s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const activeSubmission =
    submissions.find((s) => s.id === selectedSubmissionId) || submissions[0];

  React.useEffect(() => {
    if (activeSubmission) {
      setManualMarks(activeSubmission.finalScore || activeSubmission.autoScore);
      setFacultyNotes(activeSubmission.facultyNotes || '');
      setSaveSuccess(false);
    }
  }, [selectedSubmissionId, activeSubmission?.id]);

  const handleSaveEvaluation = () => {
    if (!activeSubmission) return;

    const updated: ExamSubmission = {
      ...activeSubmission,
      manualMarksOverride: manualMarks,
      finalScore: manualMarks,
      facultyNotes,
      status: 'reviewed',
      evaluatedBy: 'Dr. Marcus Vance',
      evaluationDate: 'Today',
    };

    onUpdateSubmission(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Navigation */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-[#64748B] hover:text-[#172033] hover:bg-[#F1F5F9] rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-[#172033]">
                {paper.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#EAF4FF] text-[#2563EB]">
                {paper.subject}
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Assigned Batches: {paper.assignedBatches?.join(', ') || paper.batch} &bull; Max Marks: {paper.totalMarks} &bull; {submissions.length} Submissions Received
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleReleaseResults(paper.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${
              paper.resultsReleased
                ? 'bg-[#DCFCE7] text-[#15803D] hover:bg-[#BBF7D0]'
                : 'bg-[#183653] hover:bg-[#254B70] text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-[#14B8A6]" />
            <span>{paper.resultsReleased ? 'Results Released to Students' : 'Release Official Results'}</span>
          </button>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-12 text-center">
          <FileCode2 className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#172033]">No Submissions Recorded Yet</h3>
          <p className="text-xs text-[#64748B] mt-1">
            Assigned students have not submitted code for this examination yet. Check back when the exam window concludes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Submissions List (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-3 shadow-xs">
              <div className="relative">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter candidate submissions..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#CBD5E1] rounded-lg outline-hidden bg-[#F8FAFC]"
                />
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xl p-2 shadow-xs space-y-1.5 max-h-[680px] overflow-y-auto">
              {filteredSubmissions.map((sub) => {
                const isSelected = sub.id === (activeSubmission?.id || '');
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubmissionId(sub.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#EAF4FF] border-[#3B82F6] shadow-xs'
                        : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-[#172033]">{sub.studentName}</p>
                      <span className="text-xs font-bold text-[#254B70]">
                        {sub.finalScore ?? sub.autoScore} / {sub.totalMarks}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1 text-[11px] text-[#64748B]">
                      <span>{sub.rollNumber} &bull; {sub.batch}</span>
                      <span>{formatSeconds(sub.timeSpentSeconds)}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E2E8F0]/60 text-[10px]">
                      <span
                        className={`font-semibold ${
                          sub.status === 'reviewed' ? 'text-[#16A34A]' : 'text-[#D97706]'
                        }`}
                      >
                        {sub.status === 'reviewed' ? '✓ Faculty Reviewed' : 'Pending Review'}
                      </span>

                      {sub.proctorAlerts.length > 0 ? (
                        <span className="text-[#EF4444] font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {sub.proctorAlerts.length} proctor flag(s)
                        </span>
                      ) : (
                        <span className="text-[#10B981] flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          Clean session
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Code Inspection & Grading Workspace (8 Cols) */}
          {activeSubmission && (
            <div className="lg:col-span-8 space-y-4">
              {/* Candidate Quick Overview */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-[#172033]">
                      {activeSubmission.studentName}
                    </h2>
                    <span className="text-xs font-mono bg-[#F1F5F9] px-2 py-0.5 rounded text-[#475569]">
                      {activeSubmission.rollNumber}
                    </span>
                    <span className="text-xs text-[#64748B]">({activeSubmission.batch})</span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Submitted at {activeSubmission.submittedAt} &bull; Time spent: {formatSeconds(activeSubmission.timeSpentSeconds)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-[#64748B] block uppercase tracking-wider">
                      Current Score
                    </span>
                    <span className="text-xl font-bold text-[#183653]">
                      {manualMarks} / {activeSubmission.totalMarks}
                    </span>
                  </div>
                </div>
              </div>

              {/* Proctoring Log Card */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs">
                <h3 className="text-xs font-bold text-[#172033] flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-[#14B8A6]" />
                  <span>Proctoring Audit & Incident Feed</span>
                </h3>

                {activeSubmission.proctorAlerts.length === 0 ? (
                  <div className="p-3 bg-[#F0FDF4] border border-[#DCFCE7] rounded-lg text-xs text-[#166534] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span>
                      Zero integrity violations detected. Web camera feed, focus lock, and full-screen constraints remained continuously compliant.
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {activeSubmission.proctorAlerts.map((pa) => (
                      <div
                        key={pa.id}
                        className="p-2.5 bg-[#FEF2F2] border border-[#FEE2E2] rounded-lg text-xs flex items-center justify-between text-[#991B1B]"
                      >
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0" />
                          <span>{pa.message}</span>
                        </div>
                        <span className="font-mono text-[11px] text-[#B91C1C]">
                          T+{pa.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Answers & Submitted Code */}
              <div className="space-y-4">
                {activeSubmission.answers.map((ans, idx) => {
                  const correspondingQ = paper.questions.find((q) => q.id === ans.questionId);
                  return (
                    <div
                      key={ans.questionId || idx}
                      className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-xs"
                    >
                      <div className="bg-[#183653] text-white px-4 py-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <FileCode2 className="w-4 h-4 text-[#38BDF8]" />
                          <span className="font-bold">
                            Question {idx + 1}: {correspondingQ?.title || 'Coding Problem'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono uppercase bg-[#254B70] px-2 py-0.5 rounded text-[11px] text-[#93C5FD]">
                            {ans.language}
                          </span>
                          <span className="text-[#34D399] font-bold">
                            {ans.testCasesPassed} / {ans.totalTestCases} Tests Passed
                          </span>
                        </div>
                      </div>

                      {/* Code Block */}
                      <div className="bg-[#0f172a] text-[#f8fafc] p-4 font-mono text-xs overflow-x-auto leading-relaxed border-b border-[#334155]">
                        <pre>{ans.code}</pre>
                      </div>

                      {/* Execution Heuristics */}
                      <div className="p-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2 text-xs text-[#64748B]">
                        <span>
                          Execution Time: <strong className="text-[#172033]">{ans.runtimeMs} ms</strong>
                        </span>
                        <span>
                          Memory Overhead: <strong className="text-[#172033]">{ans.memoryMb} MB</strong>
                        </span>
                        <span className="text-[#16A34A] font-semibold">
                          All sample constraints passed
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Faculty Marking Controls */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-[#183653] uppercase tracking-wider flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#3B82F6]" />
                  <span>Faculty Evaluation & Feedback</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#172033] mb-1">
                      Final Marks Awarded
                    </label>
                    <input
                      type="number"
                      value={manualMarks}
                      onChange={(e) => setManualMarks(Number(e.target.value))}
                      max={activeSubmission.totalMarks}
                      min={0}
                      className="w-full px-3 py-2 text-xs font-bold border border-[#CBD5E1] rounded-lg outline-hidden"
                    />
                    <span className="text-[10px] text-[#64748B]">
                      Auto-test score was {activeSubmission.autoScore} / {activeSubmission.totalMarks}
                    </span>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#172033] mb-1">
                      Faculty Feedback & Notes
                    </label>
                    <textarea
                      rows={2}
                      value={facultyNotes}
                      onChange={(e) => setFacultyNotes(e.target.value)}
                      placeholder="Add specific comments on algorithmic efficiency, memory complexity, or proctor notes..."
                      className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
                  {saveSuccess ? (
                    <span className="text-xs font-semibold text-[#16A34A] flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> Evaluation saved successfully!
                    </span>
                  ) : (
                    <span className="text-xs text-[#64748B]">
                      Status: {activeSubmission.status === 'reviewed' ? 'Reviewed' : 'Awaiting Faculty Sign-Off'}
                    </span>
                  )}

                  <button
                    onClick={handleSaveEvaluation}
                    className="px-5 py-2.5 bg-[#183653] hover:bg-[#254B70] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Evaluation</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
