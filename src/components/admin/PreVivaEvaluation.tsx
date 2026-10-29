import React, { useState } from 'react';
import {
  GraduationCap,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  User,
  GitBranch,
} from 'lucide-react';
import { Student, Project, Assessment } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { PageTransition } from '../common/Motion';

interface PreVivaEvaluationProps {
  students: Student[];
  projects: Project[];
  assessments: Assessment[];
  onUpdateAssessment: (updated: Assessment) => void;
  showToast: (title: string, message?: string) => void;
}

export const PreVivaEvaluation: React.FC<PreVivaEvaluationProps> = ({
  students,
  projects,
  assessments,
  onUpdateAssessment,
  showToast,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'std-104');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>(assessments[0]?.id || 'asm-101');
  const [facultyNotesText, setFacultyNotesText] = useState<string>(
    assessments[0]?.facultyNotes || 'Verified candidate code understanding. Ready for final placement rounds.'
  );

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const activeAssessment = assessments.find((a) => a.id === selectedAssessmentId) || assessments[0];

  const handleStudentChange = (stdId: string) => {
    setSelectedStudentId(stdId);
    const candidateAsm = assessments.find((a) => a.studentId === stdId);
    if (candidateAsm) {
      setSelectedAssessmentId(candidateAsm.id);
      setFacultyNotesText(candidateAsm.facultyNotes || '');
    }
  };

  const handleSaveAndReview = () => {
    if (!activeAssessment) return;
    const updated: Assessment = {
      ...activeAssessment,
      reviewStatus: 'Faculty Reviewed',
      facultyNotes: facultyNotesText,
      reviewedBy: 'Dr. Marcus Vance (Placement Chair)',
    };
    onUpdateAssessment(updated);
    showToast('Pre-Viva Reviewed & Approved', `Assessment for ${activeAssessment.studentName} marked as Faculty Reviewed.`);
  };

  return (
    <PageTransition keyId="previva-evaluation-page">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#172033]">Faculty Pre-Viva Evaluation</h1>
            <p className="text-xs text-[#64748B] mt-1">
              Conduct formal faculty verification of mock interview recordings, code defense, and delivery readiness.
            </p>
          </div>

          <div className="text-xs text-[#64748B]">
            Status: <StatusBadge status={activeAssessment.reviewStatus} />
          </div>
        </div>

        {/* Selector Toolbar */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1">
              Select Engineering Candidate:
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => handleStudentChange(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#E2E8F0] rounded-lg text-[#172033] font-medium focus:outline-none focus:border-[#3B82F6]"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.rollNumber}) — {s.department}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1">
              Select Mock Viva Assessment:
            </label>
            <select
              value={selectedAssessmentId}
              onChange={(e) => {
                setSelectedAssessmentId(e.target.value);
                const found = assessments.find((a) => a.id === e.target.value);
                if (found) setFacultyNotesText(found.facultyNotes || '');
              }}
              className="w-full px-3 py-2 text-xs bg-white border border-[#E2E8F0] rounded-lg text-[#172033] font-medium focus:outline-none focus:border-[#3B82F6]"
            >
              {assessments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.projectTitle} · {a.type} ({a.completionDate})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Workbench: Split 2-Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Candidate & AI Evaluation Summary */}
          <div className="space-y-4">
            {/* Candidate Profile summary */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
              <h2 className="text-sm font-bold text-[#172033] pb-3 border-b border-[#E2E8F0] flex items-center justify-between">
                <span>Candidate &amp; Project Background</span>
                <StatusBadge status={currentStudent.readinessStatus} />
              </h2>
              <div className="mt-3.5 text-xs space-y-1.5">
                <p className="text-[#172033] font-bold">{currentStudent.name} ({currentStudent.rollNumber})</p>
                <p className="text-[#64748B]">{currentStudent.department} · Batch {currentStudent.batch}</p>
                <p className="text-[#172033] pt-1">
                  <strong>Project Evaluated:</strong> {activeAssessment.projectTitle}
                </p>
              </div>
            </div>

            {/* Questions Evaluated */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
                Sample Viva Defense Questions
              </h3>
              <div className="p-3.5 bg-[#F5F8FC] rounded-xl border border-[#E2E8F0] text-xs leading-relaxed text-[#172033]">
                {activeAssessment.questionSummary}
              </div>

              <div className="p-3.5 bg-[#F5F8FC] rounded-xl border border-[#E2E8F0] text-xs space-y-1">
                <span className="text-[11px] font-semibold text-[#64748B] block">
                  Candidate Verbal Defense Transcription:
                </span>
                <p className="text-[#172033] italic leading-relaxed">
                  "{activeAssessment.studentResponseSnippet}"
                </p>
              </div>
            </div>

            {/* AI Diagnostic vs Faculty Confirmation Banner */}
            <div className="bg-[#EAF4FF] border border-[#BFDBFE] rounded-xl p-4 text-xs space-y-2 text-[#234A70]">
              <div className="flex items-center gap-1.5 font-bold">
                <HelpCircle className="w-4 h-4 text-[#3B82F6]" />
                <span>Simulated AI Pre-Viva Observation (Advisory Only)</span>
              </div>
              <p className="text-[#172033] leading-relaxed">
                {activeAssessment.aiEvaluationSummary}
              </p>
              <p className="text-[11px] text-[#64748B] italic">
                Notice: AI diagnostics do not constitute official college viva clearance until confirmed by faculty review.
              </p>
            </div>
          </div>

          {/* Right Column: Faculty Scoring & Appraisal Workbench */}
          <div className="space-y-4">
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-[#172033] pb-3.5 border-b border-[#E2E8F0]">
                Faculty Viva Assessment Panel
              </h2>

              {/* Score Grid */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-[#F5F8FC] rounded-xl border border-[#E2E8F0] text-center">
                  <span className="text-[#64748B] block text-[11px] font-medium">Code Defense</span>
                  <span className="text-xl font-bold text-[#14B8A6] font-mono mt-1 block tabular-nums">
                    {activeAssessment.codeUnderstanding}%
                  </span>
                </div>
                <div className="p-3.5 bg-[#F5F8FC] rounded-xl border border-[#E2E8F0] text-center">
                  <span className="text-[#64748B] block text-[11px] font-medium">Speaking Pacing</span>
                  <span className="text-xl font-bold text-[#3B82F6] font-mono mt-1 block tabular-nums">
                    {activeAssessment.speakingDelivery}%
                  </span>
                </div>
                <div className="p-3.5 bg-[#F5F8FC] rounded-xl border border-[#E2E8F0] text-center">
                  <span className="text-[#64748B] block text-[11px] font-medium">Overall Viva</span>
                  <span className="text-xl font-bold text-[#172033] font-mono mt-1 block tabular-nums">
                    {activeAssessment.score}%
                  </span>
                </div>
              </div>

              {/* Faculty Notes Textarea */}
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">
                  Official Faculty Pre-Viva Evaluation Notes:
                </label>
                <textarea
                  rows={6}
                  value={facultyNotesText}
                  onChange={(e) => setFacultyNotesText(e.target.value)}
                  placeholder="Record candidate strengths, code defense vulnerabilities, and placement recommendations..."
                  className="w-full p-3.5 text-xs bg-white border border-[#E2E8F0] rounded-xl text-[#172033] focus:outline-none focus:border-[#3B82F6] leading-relaxed transition-colors"
                />
              </div>

              {/* Official Reviewer Indicator */}
              {activeAssessment.reviewedBy && (
                <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-xs text-[#16A34A] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    Officially approved by <strong>{activeAssessment.reviewedBy}</strong>
                  </span>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveAndReview}
                  className="w-full py-3 px-4 bg-[#234A70] hover:bg-[#183653] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs active:scale-98"
                >
                  <Save className="w-4 h-4 text-[#14B8A6]" />
                  <span>Save Notes and Mark as Reviewed</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
