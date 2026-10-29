import React, { useState } from 'react';
import { User, Building2, Shield, LogOut } from 'lucide-react';
import { PageTransition } from '../common/Motion';

interface AdminSettingsProps {
  onLogout: () => void;
  showToast: (title: string, message?: string) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ onLogout, showToast }) => {
  const [adminName, setAdminName] = useState('Dr. Marcus Vance');
  const [adminEmail, setAdminEmail] = useState('marcus.vance@apex-tech.edu');
  const [institution, setInstitution] = useState('Apex Institute of Technology');
  const [campusCode, setCampusCode] = useState('AIT-PUNE-2026');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Administrator Settings Saved', 'Institution preferences updated locally.');
  };

  return (
    <PageTransition keyId="admin-settings-page">
      <div className="space-y-6 max-w-4xl">
        {/* Top Header */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
          <h1 className="text-xl font-bold text-[#172033]">Faculty &amp; Placement Console Settings</h1>
          <p className="text-xs text-[#64748B] mt-1">
            Configure institutional profile, appraisal authority, and placement report parameters.
          </p>
        </div>

        {/* Admin Profile Details */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
          <h2 className="text-sm font-bold text-[#172033] pb-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
            <User className="w-4 h-4 text-[#3B82F6]" />
            <span>Faculty Officer Profile</span>
          </h2>

          <form onSubmit={handleSave} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Officer Name &amp; Title
                </label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E2E8F0] rounded-lg text-[#172033] focus:outline-none focus:border-[#3B82F6] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Institutional Email
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E2E8F0] rounded-lg text-[#172033] focus:outline-none focus:border-[#3B82F6] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Institution Name (Fictional Demo)
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E2E8F0] rounded-lg text-[#172033] focus:outline-none focus:border-[#3B82F6] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Campus Code
                </label>
                <input
                  type="text"
                  disabled
                  value={campusCode}
                  className="w-full px-3 py-2 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-lg text-[#64748B] font-mono cursor-not-allowed font-medium"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-[#234A70] hover:bg-[#183653] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Save Institutional Details
              </button>
            </div>
          </form>
        </div>

        {/* Role & Access Transparency */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-[#172033] pb-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#3B82F6]" />
            <span>Access Control Notice (Demo Prototype)</span>
          </h2>
          <div className="p-3.5 bg-[#F5F8FC] rounded-xl border border-[#E2E8F0] text-xs text-[#64748B] space-y-2">
            <p className="leading-relaxed">
              This administrative dashboard is running in an isolated frontend demonstration session. All student rosters, scores, viva evaluations, and notes exist in local React state and do not query production institutional databases.
            </p>
            <p className="leading-relaxed text-[#172033] font-semibold">
              Pre-viva approvals logged here will persist across browser views for this session.
            </p>
          </div>
        </div>

        {/* Sign Out */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#172033]">Sign Out of Admin Console</h3>
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
