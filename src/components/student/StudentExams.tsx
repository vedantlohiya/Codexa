import React, { useState } from 'react';
import {
  FileCode2,
  Calendar,
  Clock,
  Lock,
  Play,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Award,
  ChevronRight,
  Eye,
  FileCheck,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ExamPaper, ExamSubmission, Student, StudentPage } from '../../types';
import { LiveNowInterview } from './LiveNowInterview';

interface StudentExamsProps {
  student: Student;
  papers: ExamPaper[];
  submissions: ExamSubmission[];
  onStartExam: (paper: ExamPaper) => void;
  onNavigate: (page: StudentPage) => void;
}

export const StudentExams: React.FC<StudentExamsProps> = ({
  student,
  papers,
  submissions,
  onStartExam,
  onNavigate,
}) => {
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming' | 'completed'>('live');
  const [selectedSubmissionReceipt, setSelectedSubmissionReceipt] = useState<{
    paper: ExamPaper;
    submission: ExamSubmission;
  } | null>(null);

  // Filter papers assigned to student's batch
  const studentAssignedPapers = papers.filter((p) => {
    return (
      p.assignedBatches?.includes(student.batch) ||
      p.batch === student.batch ||
      p.assignedStudentIds?.includes(student.id)
    );
  });

  const getSubmissionForPaper = (paperId: string) => {
    return submissions.find((s) => s.paperId === paperId && s.studentId === student.id);
  };

  const filteredPapers = studentAssignedPapers.filter((p) => {
    const hasSubmitted = !!getSubmissionForPaper(p.id);

    if (filter === 'completed') return hasSubmitted || p.status === 'completed';
    if (filter === 'live') return p.status === 'published' && !hasSubmitted;
    if (filter === 'upcoming') return p.status === 'scheduled';
    return true;
  });

  const liveExamsCount = Math.max(
    1,
    studentAssignedPapers.filter(
      (p) => p.status === 'published' && !getSubmissionForPaper(p.id)
    ).length
  );

  const scheduledExamsCount = studentAssignedPapers.filter(
    (p) => p.status === 'scheduled'
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#172033]">
              Assigned Coding Examinations
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EAF4FF] text-[#2563EB]">
              Batch {student.batch}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Access proctored coding assessments scheduled by faculty. Test windows unlock automatically.
          </p>
        </div>

        <button
          onClick={() => onNavigate('performance')}
          className="btn-interactive group inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#183653] text-xs font-semibold rounded-lg shrink-0 cursor-pointer shadow-xs"
        >
          <Award className="w-4 h-4 text-[#3B82F6]" />
          <span>View Class Leaderboard</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
        </button>
      </div>

      {/* Live Exam Alert Banner (Shown on other tabs to direct students to Live Now) */}
      {liveExamsCount > 0 && filter !== 'live' && (
        <div className="bg-[#EAF4FF] border border-[#BFDBFE] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1E40AF] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-ping" />
                Examination Window Active
              </p>
              <h2 className="text-sm font-bold text-[#1E3A8A]">
                {studentAssignedPapers.find((p) => p.status === 'published')?.name}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              const livePaper = studentAssignedPapers.find((p) => p.status === 'published');
              if (livePaper) onStartExam(livePaper);
            }}
            className="px-5 py-2.5 bg-[#183653] hover:bg-[#254B70] text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer flex items-center justify-center gap-2 transition-transform duration-200 hover:scale-[1.02]"
          >
            <span>Enter Examination Hall</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2 overflow-x-auto">
        {(['all', 'live', 'upcoming', 'completed'] as const).map((tabKey) => {
          const active = filter === tabKey;
          return (
            <button
              key={tabKey}
              onClick={() => setFilter(tabKey)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg capitalize transition-colors cursor-pointer shrink-0 ${active
                  ? 'bg-[#183653] text-white'
                  : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#172033]'
                }`}
            >
              {tabKey === 'all'
                ? `All Papers (${studentAssignedPapers.length})`
                : tabKey === 'live'
                  ? `Live Now (${liveExamsCount})`
                  : tabKey === 'upcoming'
                    ? `Scheduled (${scheduledExamsCount})`
                    : 'Completed & Graded'}
            </button>
          );
        })}
      </div>

      {/* Papers List or Live Now AI Interview */}
      <div className="space-y-4">
        {filter === 'live' ? (
          <LiveNowInterview student={student} onExit={() => setFilter('all')} />
        ) : (
          filteredPapers.map((paper) => {
          const submission = getSubmissionForPaper(paper.id);
          const isLive = paper.status === 'published' && !submission;
          const isScheduled = paper.status === 'scheduled';
          const isCompleted = !!submission || paper.status === 'completed';

          return (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white border rounded-xl p-5 shadow-xs transition-all card-hover ${isLive
                  ? 'border-[#3B82F6] ring-1 ring-[#3B82F6]/30'
                  : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {isLive && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#CCFBF1] text-[#0D9488]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse" />
                        Live & Open Now
                      </span>
                    )}

                    {isScheduled && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E0F2FE] text-[#0369A1]">
                        <Lock className="w-3 h-3" />
                        Scheduled &bull; Locked
                      </span>
                    )}

                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#DCFCE7] text-[#15803D]">
                        <CheckCircle2 className="w-3 h-3" />
                        Submitted &bull; Graded
                      </span>
                    )}

                    <span className="text-[11px] text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded font-mono">
                      {paper.subject}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#172033]">{paper.name}</h3>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      Duration: <strong className="text-[#334155]">{paper.durationMinutes} Minutes</strong> &bull; Max Marks:{' '}
                      <strong className="text-[#334155]">{paper.totalMarks}</strong> ({paper.questions.length} Coding Problems)
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-[#64748B]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#3B82F6]" />
                      {paper.examDate} ({paper.startTime} - {paper.endTime})
                    </span>
                    <span className="flex items-center gap-1 text-[#0D9488]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Proctored Environment
                    </span>
                  </div>
                </div>

                {/* Right Action Area */}
                <div className="flex items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-[#F1F5F9]">
                  {isLive && (
                    <button
                      onClick={() => onStartExam(paper)}
                      className="px-5 py-2.5 bg-[#183653] hover:bg-[#254B70] text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Exam</span>
                    </button>
                  )}

                  {isScheduled && (
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs font-medium text-[#64748B]">
                        <Lock className="w-3.5 h-3.5 text-[#94A3B8]" />
                        <span>Opens at {paper.startTime}</span>
                      </span>
                    </div>
                  )}

                  {isCompleted && (
                    <div className="flex items-center gap-3">
                      {submission && (
                        <div className="text-right">
                          <span className="text-[10px] text-[#64748B] block uppercase">
                            Official Score
                          </span>
                          <span className="text-base font-bold text-[#183653]">
                            {submission.finalScore ?? submission.autoScore} / {submission.totalMarks}
                          </span>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          if (submission) {
                            setSelectedSubmissionReceipt({ paper, submission });
                          }
                        }}
                        className="px-3.5 py-2 bg-[#EAF4FF] hover:bg-[#DBEAFE] text-[#183653] text-xs font-semibold rounded-lg cursor-pointer flex items-center gap-1.5"
                      >
                        <FileCheck className="w-4 h-4 text-[#2563EB]" />
                        <span>View Report Card</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })
      )}

      {filter !== 'live' && filteredPapers.length === 0 && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-12 text-center">
          <FileCode2 className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#172033]">No examinations in this view</h3>
          <p className="text-xs text-[#64748B] mt-1">
            There are no examinations matching this category for your batch at this time.
          </p>
        </div>
      )}
    </div>

      {/* Official Report Card Modal */}
      {selectedSubmissionReceipt && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl border border-[#CBD5E1] space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="border-b-2 border-[#183653] pb-3 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#254B70]">
                APEX INSTITUTE OF TECHNOLOGY &bull; OFFICIAL CODING TRANSCRIPT
              </p>
              <h3 className="text-base font-bold text-[#172033] mt-1">
                {selectedSubmissionReceipt.paper.name}
              </h3>
              <p className="text-xs text-[#64748B]">
                Candidate: {student.name} ({student.rollNumber}) &bull; Batch: {student.batch}
              </p>
            </div>

            {/* Score Summary Box */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#64748B]">Final Verified Marks</span>
                <div className="text-2xl font-bold text-[#183653] mt-0.5">
                  {selectedSubmissionReceipt.submission.finalScore} / {selectedSubmissionReceipt.submission.totalMarks}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-[#64748B]">Proctoring Integrity</span>
                <div className="flex items-center gap-1 text-xs font-bold text-[#16A34A] mt-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Clean Session</span>
                </div>
              </div>
            </div>

            {/* Faculty Remarks */}
            {selectedSubmissionReceipt.submission.facultyNotes && (
              <div className="bg-[#EAF4FF] border border-[#BFDBFE] rounded-lg p-3 text-xs text-[#1E3A8A]">
                <strong>Faculty Feedback:</strong> {selectedSubmissionReceipt.submission.facultyNotes}
              </div>
            )}

            {/* Submitted Answers Summary */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#172033]">Question-by-Question Breakdown:</h4>
              {selectedSubmissionReceipt.submission.answers.map((ans, idx) => (
                <div key={idx} className="p-3 border border-[#E2E8F0] rounded-lg bg-white space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#172033]">Question {idx + 1}</span>
                    <span className="font-mono text-[#16A34A] font-bold">
                      {ans.testCasesPassed} / {ans.totalTestCases} Tests Passed ({ans.score} Marks)
                    </span>
                  </div>
                  <pre className="bg-[#0f172a] text-[#e2e8f0] p-2.5 rounded font-mono text-[11px] overflow-x-auto max-h-36">
                    {ans.code}
                  </pre>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
              <button
                onClick={() => setSelectedSubmissionReceipt(null)}
                className="px-4 py-2 bg-[#183653] text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Close Transcript
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
