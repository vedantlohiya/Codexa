import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CodexaLogo } from '../common/CodexaLogo';

interface StudentLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({ onLogin, onBack }) => {
  const [emailOrId, setEmailOrId] = useState('vedant.lohiya@student.edu');
  const [password, setPassword] = useState('student2026');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrId.trim()) {
      setError('Please enter your student email or roll number.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 350);
  };

  const handleFillDemo = () => {
    setEmailOrId('vedant.lohiya@student.edu');
    setPassword('student2026');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-xl p-8 shadow-sm relative z-10"
      >
        {/* Header with Codexa logo & label */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <CodexaLogo size="sm" />
            <span className="text-[11px] font-bold text-[#3B82F6] bg-[#EAF4FF] px-2.5 py-0.5 rounded border border-[#BFDBFE]">
              STUDENT PORTAL
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#172033] mt-3">Welcome back</h1>
          <p className="text-xs text-[#64748B] mt-1">
            Sign in to continue your interview preparation.
          </p>
        </div>

        {/* Demo notice box */}
        <div className="mb-5 p-3.5 bg-[#F5F8FC] rounded-lg border border-[#E2E8F0] text-xs text-[#64748B] flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#172033]">Demo Student Account</p>
              <p className="text-[11px] mt-0.5">Use prefilled credentials to test the student interview workflow.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-[11px] font-semibold text-[#3B82F6] hover:underline shrink-0 cursor-pointer"
          >
            Auto-fill
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-2.5 text-xs text-[#EF4444] bg-[#FEF2F2] border border-[#FECACA] rounded-md"
            >
              {error}
            </motion.div>
          )}

          <div>
            <label
              htmlFor="student-email"
              className="block text-xs font-medium text-[#172033] mb-1"
            >
              Student Email or Roll Number
            </label>
            <input
              id="student-email"
              type="text"
              value={emailOrId}
              onChange={(e) => setEmailOrId(e.target.value)}
              placeholder="e.g. alex.chen@student.edu or 2026CS104"
              className="w-full px-3 py-2 text-xs bg-white border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#3B82F6] text-[#172033] placeholder:text-[#64748B]/60 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="student-password"
                className="block text-xs font-medium text-[#172033]"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs text-[#3B82F6] hover:underline cursor-pointer font-medium"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                id="student-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3 py-2 text-xs bg-white border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#3B82F6] text-[#172033] pr-10 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#172033] cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                defaultChecked
                className="w-3.5 h-3.5 rounded border-[#CBD5E1] text-[#3B82F6] focus:ring-[#3B82F6]"
              />
              <span>Remember me on this browser</span>
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-[#234A70] hover:bg-[#183653] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer mt-2 shadow-xs flex items-center justify-center gap-2 disabled:opacity-75"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating Session...</span>
              </>
            ) : (
              <span>Sign In to Student Portal</span>
            )}
          </motion.button>
        </form>

        {/* Back Link */}
        <div className="mt-6 pt-5 border-t border-[#E2E8F0] text-center">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#172033] cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to portal selection
          </button>
        </div>
      </motion.div>

      {/* Simulated Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl border border-[#E2E8F0] max-w-sm w-full p-6 shadow-xl"
            >
              <h3 className="text-base font-semibold text-[#172033]">Simulated Password Recovery</h3>
              <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                This is a frontend demonstration. In the simulated environment, your default demo password is{' '}
                <span className="font-mono bg-[#EAF4FF] px-1.5 py-0.5 rounded text-[#234A70] font-semibold">student2026</span>.
              </p>
              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-1.5 text-xs font-semibold bg-[#234A70] text-white rounded-lg hover:bg-[#183653] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
