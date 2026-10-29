import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  GitBranch,
  ShieldCheck,
  Award,
  AlertTriangle,
  FileCheck2,
  Save,
  MessageSquare,
} from 'lucide-react';
import { Student, Project, InterviewResult, Assessment, AdminPage } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { PageTransition } from '../common/Motion';

interface StudentDetailProps {
  student: Student;
  projects: Project[];
  assessments: Assessment[];
  history: InterviewResult[];
  onBack: () => void;
  onNavigate: (page: AdminPage) => void;
  onSaveFacultyNotes: (studentId: string, notes: string) => void;
  showToast: (title: string, message?: string) => void;
}

export const StudentDetail: React.FC<StudentDetailProps> = ({
  student,
  projects,
  assessments,
  history,
  onBack,
  onNavigate,
  onSaveFacultyNotes,
  showToast,
}) => {
  const [facultyNotes, setFacultyNotes] = useState(
    'Candidate has demonstrated consistent understanding of Redis caching and optimistic concurrency. Advised to practice explaining database deadlocks under high write concurrency.'
  );

  const studentAssessments = assessments.filter((a) => a.studentId === student.id);

  const handleSaveNotes = () => {
    onSaveFacultyNotes(student.id, facultyNotes);
    showToast('Faculty Notes Saved', 'Appraisal notes recorded to local candidate file.');
  };

  return (
    <PageTransition keyId="student-detail-page">
      <div className="space-y-6">
        {/* Back button & Candidate Header */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#172033] mb-3 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to candidate directory
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#183653] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
                {student.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-[#172033]">{student.name}</h1>
                  <StatusBadge status={student.readinessStatus} />
                </div>
                <p className="text-xs text-[#64748B] mt-1 flex flex-wrap items-center gap-3">
                  <span className="font-mono text-[#172033] font-semibold">{student.rollNumber}</span>
                  <span>·</span>
                  <span>{student.email}</span>
                  <span>·</span>
                  <span>{student.department}</span>
                  <span>·</span>
                  <span className="font-mono">{student.batch}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0 bg-[#F5F8FC] p-3.5 rounded-xl border border-[#E2E8F0]">
              <div className="text-center px-2">
                <span className="text-[10px] uppercase text-[#64748B] font-semibold block">Code Defense</span>
                <span className="text-base font-bold text-[#14B8A6] font-mono tabular-nums">
                  {student.codeUnderstandingScore}%
                </span>
              </div>
              <div className="w-px h-8 bg-[#CBD5E1]" />
              <div className="text-center px-2">
                <span className="text-[10px] uppercase text-[#64748B] font-semibold block">Delivery</span>
                <span className="text-base font-bold text-[#3B82F6] font-mono tabular-nums">
                  {student.speakingDeliveryScore}%
                </span>
              </div>
              <div className="w-px h-8 bg-[#CBD5E1]" />
              <div className="text-center px-2">
                <span className="text-[10px] uppercase text-[#64748B] font-semibold block">Sessions</span>
                <span className="text-base font-bold text-[#172033] font-mono tabular-nums">
                  {student.completedSessions}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column: Connected Projects + Faculty Review Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Candidate Projects */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
            <div className="flex items-center gap-2 pb-3.5 border-b border-[#E2E8F0]">
              <GitBranch className="w-4 h-4 text-[#3B82F6]" />
              <h2 className="text-sm font-bold text-[#172033]">Connected Projects</h2>
            </div>

            <div className="mt-4 space-y-3">
              {projects.slice(0, 2).map((proj) => (
                <div key={proj.id} className="p-3.5 bg-[#F5F8FC] rounded-xl border border-[#E2E8F0] text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#172033]">{proj.title}</span>
                    <StatusBadge status={proj.status} />
                  </div>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">{proj.description}</p>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-[#64748B] pt-1">
                    <span className="text-[#172033] font-medium">{proj.language}</span>
                    <span>·</span>
                    <span>{proj.modules.length} modules</span>
                    <span>·</span>
                    <span className="text-[#14B8A6] font-semibold">{proj.potentialTopics.length} viva topics</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Faculty Review Notes (Editable in Local State) */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#3B82F6]" />
                  <h2 className="text-sm font-bold text-[#172033]">Faculty Pre-Viva Appraisal Notes</h2>
                </div>
                <span className="text-[11px] text-[#234A70] font-bold bg-[#EAF4FF] px-2.5 py-0.5 rounded border border-[#BFDBFE]">
                  Faculty-Confirmed
                </span>
              </div>

              <div className="mt-3.5">
                <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                  Confidential Faculty Assessment Remarks:
                </label>
                <textarea
                  rows={5}
                  value={facultyNotes}
                  onChange={(e) => setFacultyNotes(e.target.value)}
                  placeholder="Enter faculty review notes, viva defense feedback, and recommendations..."
                  className="w-full p-3.5 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#172033] focus:outline-none focus:border-[#3B82F6] leading-relaxed"
                />
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-[#E2E8F0] flex items-center justify-between">
              <span className="text-[11px] text-[#64748B]">Updates saved to local candidate record</span>
              <button
                onClick={handleSaveNotes}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#234A70] hover:bg-[#183653] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Faculty Notes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mock Viva History for this Candidate */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
          <h2 className="text-sm font-bold text-[#172033] pb-3.5 border-b border-[#E2E8F0]">
            Candidate Viva Session History
          </h2>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F5F8FC] border-b border-[#E2E8F0] text-[#64748B]">
                  <th className="py-3 px-3.5 font-semibold">Session Date</th>
                  <th className="py-3 px-3.5 font-semibold">Project</th>
                  <th className="py-3 px-3.5 font-semibold">Interview Mode</th>
                  <th className="py-3 px-3.5 font-semibold">Code Understanding</th>
                  <th className="py-3 px-3.5 font-semibold">Speaking Delivery</th>
                  <th className="py-3 px-3.5 font-semibold">Overall Score</th>
                  <th className="py-3 px-3.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {studentAssessments.map((asm) => (
                  <tr key={asm.id} className="hover:bg-[#F5F8FC]/60 transition-colors">
                    <td className="py-3 px-3.5 font-mono text-[#172033] font-medium">{asm.completionDate}</td>
                    <td className="py-3 px-3.5 font-bold text-[#172033]">{asm.projectTitle}</td>
                    <td className="py-3 px-3.5">
                      <span className="text-[11px] font-mono text-[#234A70] bg-[#EAF4FF] px-2.5 py-0.5 rounded-md font-semibold">
                        {asm.type}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 font-mono font-bold text-[#14B8A6] tabular-nums">
                      {asm.codeUnderstanding}%
                    </td>
                    <td className="py-3 px-3.5 font-mono font-bold text-[#3B82F6] tabular-nums">
                      {asm.speakingDelivery}%
                    </td>
                    <td className="py-3 px-3.5 font-mono font-bold text-[#172033] tabular-nums">
                      {asm.score} / 100
                    </td>
                    <td className="py-3 px-3.5">
                      <StatusBadge status={asm.reviewStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
