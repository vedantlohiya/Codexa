import React from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  Mic,
  History,
  TrendingUp,
  Settings,
  LogOut,
  X,
  Code2,
  FileCode2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { StudentPage } from '../../types';
import { CodexaLogo } from '../common/CodexaLogo';

interface StudentSidebarProps {
  currentPage: StudentPage;
  onNavigate: (page: StudentPage) => void;
  onLogout: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  studentName: string;
  studentRoll: string;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({
  currentPage,
  onNavigate,
  onLogout,
  mobileOpen,
  onCloseMobile,
  studentName,
  studentRoll,
}) => {
  const navItems: { id: StudentPage; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Student Overview', icon: LayoutDashboard },
    { id: 'exams', label: 'Assigned Exams', icon: FileCode2 },
    { id: 'projects', label: 'My Projects', icon: FolderGit2 },
    { id: 'practice', label: 'Practice Interview', icon: Mic },
    { id: 'history', label: 'Interview History', icon: History },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleItemClick = (id: StudentPage) => {
    onNavigate(id);
    onCloseMobile();
  };

  const content = (
    <div className="h-full flex flex-col justify-between bg-[#183653] text-white w-64 select-none border-r border-[#10273d]">
      <div>
        {/* Brand Header */}
        <div className="px-5 py-5 border-b border-[#254B70]/60 flex items-center justify-between">
          <div>
            <CodexaLogo size="sm" lightText />
            <p className="text-[10px] text-[#93C5FD] mt-1.5 uppercase font-semibold tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]" />
              Student Workspace
            </p>
          </div>
          {mobileOpen && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden text-white/70 hover:text-white p-1 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              currentPage === item.id ||
              (item.id === 'exams' && currentPage === 'take-exam') ||
              (item.id === 'projects' && currentPage === 'project-detail') ||
              (item.id === 'practice' && currentPage === 'results');

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-lg transition-all cursor-pointer relative group ${
                  active
                    ? 'text-white font-semibold'
                    : 'text-white/75 hover:text-white hover:bg-[#254B70]/30'
                }`}
              >
                {/* Smooth Animated Active Pill Background */}
                {active && (
                  <motion.div
                    layoutId="active-student-nav-pill"
                    className="absolute inset-0 bg-[#254B70] rounded-lg shadow-xs"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {/* Active Indicator Bar */}
                {active && (
                  <motion.span
                    layoutId="active-student-nav-indicator"
                    className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#3B82F6] rounded-r-md z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon
                  className={`w-4 h-4 z-10 transition-transform duration-200 group-hover:scale-105 ${
                    active ? 'text-[#3B82F6]' : 'text-white/70 group-hover:text-white'
                  }`}
                />
                <span className="z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer & User Profile */}
      <div className="p-3 border-t border-[#254B70]/60 space-y-2">
        <div className="px-3 py-2.5 bg-[#122A42] rounded-lg border border-[#254B70]/40">
          <p className="text-xs font-semibold text-white truncate">{studentName}</p>
          <p className="text-[11px] text-[#93C5FD] font-mono mt-0.5">{studentRoll}</p>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-white/70 hover:text-[#EF4444] hover:bg-[#254B70]/40 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block shrink-0">{content}</aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 transform lg:hidden transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </div>
    </>
  );
};
