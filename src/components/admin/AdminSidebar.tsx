import {
  LayoutDashboard,
  Users,
  Layers,
  FileCheck2,
  FileCode2,
  GraduationCap,
  FileBarChart,
  Settings,
  LogOut,
  X,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { motion } from 'motion/react';
import { AdminPage } from '../../types';
import { CodexaLogo } from '../common/CodexaLogo';

interface AdminSidebarProps {
  currentPage: AdminPage;
  onNavigate: (page: AdminPage) => void;
  onLogout: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  adminName?: string;
  institutionName?: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentPage,
  onNavigate,
  onLogout,
  mobileOpen,
  onCloseMobile,
  adminName = 'Dr. Marcus Vance',
  institutionName = 'Apex Institute of Technology',
}) => {
  const navItems: { id: AdminPage; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'pdf-materials', label: 'PDF Interview Hub', icon: FileText },
    { id: 'papers', label: 'Coding Papers', icon: FileCode2 },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'batches', label: 'Batches', icon: Layers },
    { id: 'assessments', label: 'Assessments', icon: FileCheck2 },
    { id: 'previva', label: 'Pre-Viva', icon: GraduationCap },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleItemClick = (id: AdminPage) => {
    onNavigate(id);
    onCloseMobile();
  };

  const content = (
    <div className="h-full flex flex-col justify-between bg-[#183653] text-white w-64 select-none border-r border-[#10273d]">
      <div>
        {/* Brand & Institution Lockup */}
        <div className="px-5 py-5 border-b border-[#254B70]/60 flex items-center justify-between">
          <div>
            <CodexaLogo size="sm" lightText />
            <p className="text-[10px] text-[#2DD4BF] mt-1.5 uppercase font-bold tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]" />
              ADMIN PORTAL
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

        {/* Nav Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              currentPage === item.id ||
              (item.id === 'students' && currentPage === 'student-detail');

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
                    layoutId="active-admin-nav-pill"
                    className="absolute inset-0 bg-[#254B70] rounded-lg shadow-xs"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {/* Active Indicator Bar */}
                {active && (
                  <motion.span
                    layoutId="active-admin-nav-indicator"
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

      {/* User profile & Logout */}
      <div className="p-3 border-t border-[#254B70]/60 space-y-2">
        <div className="px-3 py-2.5 bg-[#122A42] rounded-lg border border-[#254B70]/40">
          <p className="text-xs font-semibold text-white truncate">{adminName}</p>
          <p className="text-[11px] text-[#93C5FD] mt-0.5 truncate">Director of Placements</p>
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
