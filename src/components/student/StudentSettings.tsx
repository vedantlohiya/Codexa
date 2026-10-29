import React, { useState } from 'react';
import { User, Shield, Video, Mic, LogOut, Check } from 'lucide-react';
import { Student } from '../../types';
import { PageTransition } from '../common/Motion';

interface StudentSettingsProps {
  student: Student;
  onUpdateStudent: (updated: Partial<Student>) => void;
  onLogout: () => void;
  showToast: (title: string, message?: string) => void;
}

export const StudentSettings: React.FC<StudentSettingsProps> = ({
  student,
  onUpdateStudent,
  onLogout,
  showToast,
}) => {
  const [name, setName] = useState(student.name);
  const [email, setEmail] = useState(student.email);
  const [preferredPace, setPreferredPace] = useState('Standard (130-150 WPM)');
  const [feedbackVerbosity, setFeedbackVerbosity] = useState('Comprehensive Viva Evaluation');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStudent({ name, email });
    showToast('Settings Saved', 'Profile and simulation preferences updated in local state.');
  };

  return (
    <PageTransition keyId="student-settings-page">
      <div className="space-y-6 max-w-4xl">
        {/* Top Header */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
          <h1 className="text-xl font-bold text-[#172033]">Student Settings</h1>
          <p className="text-xs text-[#64748B] mt-1">
            Manage your candidate profile, speech pacing targets, and interview simulation preferences.
          </p>
        </div>

        {/* Profile Form */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
          <h2 className="text-sm font-bold text-[#172033] pb-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
            <User className="w-4 h-4 text-[#3B82F6]" />
            <span>Candidate Information</span>
          </h2>

          <form onSubmit={handleSave} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E2E8F0] rounded-lg text-[#172033] focus:outline-none focus:border-[#3B82F6] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Student Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E2E8F0] rounded-lg text-[#172033] focus:outline-none focus:border-[#3B82F6] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Roll Number / ID
                </label>
                <input
                  type="text"
                  disabled
                  value={student.rollNumber}
                  className="w-full px-3 py-2 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-lg text-[#64748B] font-mono cursor-not-allowed font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Department &amp; Batch
                </label>
                <input
                  type="text"
                  disabled
                  value={`${student.department} (${student.batch})`}
                  className="w-full px-3 py-2 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-lg text-[#64748B] cursor-not-allowed font-medium"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-[#234A70] hover:bg-[#183653] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>

        {/* Interview Preferences */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
          <h2 className="text-sm font-bold text-[#172033] pb-3.5 border-b border-[#E2E8F0]">
            Interview Simulation Preferences
          </h2>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#172033] mb-1">Pacing Target</label>
              <select
                value={preferredPace}
                onChange={(e) => setPreferredPace(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[#172033] focus:outline-none focus:border-[#3B82F6]"
              >
                <option value="Measured (110-130 WPM)">Measured (110-130 WPM)</option>
                <option value="Standard (130-150 WPM)">Standard (130-150 WPM)</option>
                <option value="Brisk (150-170 WPM)">Brisk (150-170 WPM)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#172033] mb-1">Feedback Verbosity</label>
              <select
                value={feedbackVerbosity}
                onChange={(e) => setFeedbackVerbosity(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[#172033] focus:outline-none focus:border-[#3B82F6]"
              >
                <option value="Quick bullet points">Quick bullet points</option>
                <option value="Comprehensive Viva Evaluation">Comprehensive Viva Evaluation</option>
                <option value="Code-only focus">Code-only focus</option>
              </select>
            </div>
          </div>
        </div>

        {/* Permissions & Privacy Transparency */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#172033] pb-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#3B82F6]" />
            <span>Device Permissions &amp; Data Privacy</span>
          </h2>

          <div className="space-y-3 text-xs text-[#64748B]">
            <div className="flex items-start gap-3 p-3.5 bg-[#F5F8FC] rounded-lg border border-[#E2E8F0]">
              <Mic className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#172033]">Microphone Simulation</p>
                <p className="mt-0.5 leading-relaxed">
                  The microphone button triggers simulated browser speech recognition. No raw voice audio is uploaded to remote servers or third-party storage.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-[#F5F8FC] rounded-lg border border-[#E2E8F0]">
              <Video className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#172033]">Camera Stream Placeholder</p>
                <p className="mt-0.5 leading-relaxed">
                  The video preview area acts as a local visual posture mirror for mock interview discipline. No webcam feeds are recorded, streamed, or persisted.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Action */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#172033]">Sign Out</h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Return to the portal selection screen.
            </p>
          </div>

          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FEF2F2] border border-[#FECACA] hover:bg-[#FEE2E2] text-[#DC2626] text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </PageTransition>
  );
};
