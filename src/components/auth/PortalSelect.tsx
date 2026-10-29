import React from 'react';
import { GraduationCap, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { CodexaLogo } from '../common/CodexaLogo';

interface PortalSelectProps {
  onSelectStudent: () => void;
  onSelectAdmin: () => void;
}

export const PortalSelect: React.FC<PortalSelectProps> = ({
  onSelectStudent,
  onSelectAdmin,
}) => {
  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col justify-center items-center px-4 py-12 select-none">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-sm flex flex-col items-center"
      >
        {/* Codexa Logo Stacked */}
        <CodexaLogo size="xl" layout="stacked" className="mb-7" />

        {/* Welcome Heading */}
        <h1 className="text-2xl font-bold text-[#172033] tracking-tight mb-7">
          Welcome
        </h1>

        {/* Portal Cards */}
        <div className="w-full space-y-3.5">
          {/* Student Portal Card */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={onSelectStudent}
            className="w-full bg-white border border-[#E2E8F0] hover:border-[#3B82F6] p-4 rounded-xl flex items-center justify-between group cursor-pointer shadow-xs transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#EAF4FF] flex items-center justify-center text-[#3B82F6] shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-[#172033]">
                Student Portal
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#3B82F6] group-hover:translate-x-0.5 transition-all" />
          </motion.button>

          {/* Admin Portal Card */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={onSelectAdmin}
            className="w-full bg-white border border-[#E2E8F0] hover:border-[#3B82F6] p-4 rounded-xl flex items-center justify-between group cursor-pointer shadow-xs transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#EAF4FF] flex items-center justify-center text-[#3B82F6] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-[#172033]">
                Admin Portal
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#3B82F6] group-hover:translate-x-0.5 transition-all" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
