import React, { useState } from 'react';
import {
  Trophy,
  Medal,
  Calendar,
  History,
} from 'lucide-react';
import { motion } from 'motion/react';
import { StudentPage } from '../../types';
import { AnimatedCounter, StaggerContainer, AnimatedCard } from '../common/Motion';

interface StudentPerformanceProps {
  onNavigate: (page: StudentPage) => void;
}

interface RosterEntry {
  rank: number;
  name: string;
  isCurrentUser?: boolean;
  rollNumber: string;
  batch: string;
  timeTaken: string;
  totalMarks: number;
  marksObtained: number;
  percentage: number;
  standing: 'Distinction' | 'Passed' | 'Absent';
}

export const StudentPerformance: React.FC<StudentPerformanceProps> = () => {
  const [activeTab, setActiveTab] = useState<'tests' | 'history'>('history');
  const [selectedAssessment, setSelectedAssessment] = useState(
    'College-Wide Aptitude & Core Computing Assessment'
  );
  const [selectedBatch, setSelectedBatch] = useState('2026 CS-A (Current Class)');

  const roster: RosterEntry[] = [
    {
      rank: 1,
      name: 'Priya Shah',
      rollNumber: '2026CS108',
      batch: '2026 CS-A',
      timeTaken: '28m 40s',
      totalMarks: 50,
      marksObtained: 48,
      percentage: 96,
      standing: 'Distinction',
    },
    {
      rank: 2,
      name: 'Vedant Lohiya',
      isCurrentUser: true,
      rollNumber: '2026CS104',
      batch: '2026 CS-A',
      timeTaken: '31m 15s',
      totalMarks: 50,
      marksObtained: 46,
      percentage: 92,
      standing: 'Distinction',
    },
    {
      rank: 3,
      name: 'Aarav Sharma',
      rollNumber: '2026CS102',
      batch: '2026 CS-A',
      timeTaken: '33m 2s',
      totalMarks: 50,
      marksObtained: 43,
      percentage: 86,
      standing: 'Distinction',
    },
    {
      rank: 4,
      name: 'Ananya Deshmukh',
      rollNumber: '2026CS122',
      batch: '2026 CS-A',
      timeTaken: '35m 45s',
      totalMarks: 50,
      marksObtained: 38,
      percentage: 76,
      standing: 'Passed',
    },
    {
      rank: 5,
      name: 'Aditya Kulkarni',
      rollNumber: '2026CS110',
      batch: '2026 CS-A',
      timeTaken: '37m 10s',
      totalMarks: 50,
      marksObtained: 35,
      percentage: 70,
      standing: 'Passed',
    },
    {
      rank: 6,
      name: 'Rahul Verma',
      rollNumber: '2026CS114',
      batch: '2026 CS-A',
      timeTaken: '39m 50s',
      totalMarks: 50,
      marksObtained: 27,
      percentage: 54,
      standing: 'Passed',
    },
    {
      rank: 7,
      name: 'Rohan Mehta',
      rollNumber: '2026CS115',
      batch: '2026 CS-A',
      timeTaken: '—',
      totalMarks: 50,
      marksObtained: 0,
      percentage: 0,
      standing: 'Absent',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Trophy className="w-5 h-5 text-[#F59E0B]" />
          <h1 className="text-lg font-bold text-[#172033]">Class Leaderboard</h1>
        </div>

        <div className="flex items-center gap-2 bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0]">
          <button
            onClick={() => setActiveTab('tests')}
            className={`relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'tests'
                ? 'text-white'
                : 'text-[#64748B] hover:text-[#172033]'
            }`}
          >
            {activeTab === 'tests' && (
              <motion.div
                layoutId="leaderboard-tab"
                className="absolute inset-0 bg-[#183653] rounded-lg -z-10 shadow-xs"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <Calendar className="w-3.5 h-3.5" />
            <span>Tests</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'text-white'
                : 'text-[#64748B] hover:text-[#172033]'
            }`}
          >
            {activeTab === 'history' && (
              <motion.div
                layoutId="leaderboard-tab"
                className="absolute inset-0 bg-[#183653] rounded-lg -z-10 shadow-xs"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <History className="w-3.5 h-3.5" />
            <span>History</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[#64748B] font-medium shrink-0">Assessment:</span>
            <select
              value={selectedAssessment}
              onChange={(e) => setSelectedAssessment(e.target.value)}
              className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-1.5 font-medium text-[#172033] outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/15 transition-all"
            >
              <option value="College-Wide Aptitude & Core Computing Assessment">
                College-Wide Aptitude &amp; Core Computing Assessment
              </option>
              <option value="TCS Ninja Technical Round">TCS Ninja Technical Round</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#64748B] font-medium shrink-0">Batch:</span>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-1.5 font-medium text-[#172033] outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/15 transition-all"
            >
              <option value="2026 CS-A (Current Class)">2026 CS-A (Current Class)</option>
              <option value="2026 CS-B">2026 CS-B</option>
              <option value="2026 IT-A">2026 IT-A</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-[#64748B] font-medium">Status:</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#ECFDF5] text-[#16A34A] border border-[#A7F3D0] font-semibold text-[11px] transition-all hover:scale-[1.02]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
            Official Results Released
          </span>
        </div>
      </div>

      {/* Top 3 Podium Cards with Staggered Entrance */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Rank #2 (Vedant Lohiya) */}
        <AnimatedCard className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col justify-between card-hover">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3B82F6] bg-[#EAF4FF] px-2 py-0.5 rounded">
                RANK #2
              </span>
              <Medal className="w-5 h-5 text-[#94A3B8]" />
            </div>

            <h2 className="text-base font-bold text-[#172033]">Vedant Lohiya</h2>
            <p className="text-xs text-[#64748B] font-mono mt-0.5">2026CS104</p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#172033] font-mono">
                <AnimatedCounter value={46} />
              </span>
              <span className="text-xs text-[#64748B]">/ 50</span>
            </div>
            <span className="text-xs font-bold text-[#14B8A6]">92% (31m 15s)</span>
          </div>
        </AnimatedCard>

        {/* Card 2: Rank #1 Topper (Priya Shah) */}
        <AnimatedCard className="bg-white border-2 border-[#F59E0B] rounded-xl p-6 shadow-xs flex flex-col justify-between relative overflow-hidden card-hover">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B45309] bg-[#FEF3C7] px-2.5 py-0.5 rounded border border-[#FDE68A]">
                RANK #1 &bull; TOPPER
              </span>
              <Trophy className="w-5 h-5 text-[#F59E0B]" />
            </div>

            <h2 className="text-base font-bold text-[#172033]">Priya Shah</h2>
            <p className="text-xs text-[#64748B] font-mono mt-0.5">2026CS108</p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#FDE68A] flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#172033] font-mono">
                <AnimatedCounter value={48} />
              </span>
              <span className="text-xs text-[#64748B]">/ 50</span>
            </div>
            <span className="text-xs font-bold text-[#14B8A6]">96% (28m 40s)</span>
          </div>
        </AnimatedCard>

        {/* Card 3: Rank #3 Bronze Medal (Aarav Sharma) */}
        <AnimatedCard className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col justify-between card-hover">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C2410C] bg-[#FFEDD5] px-2 py-0.5 rounded">
                RANK #3 &bull; BRONZE MEDAL
              </span>
              <Medal className="w-5 h-5 text-[#F97316]" />
            </div>

            <h2 className="text-base font-bold text-[#172033]">Aarav Sharma</h2>
            <p className="text-xs text-[#64748B] font-mono mt-0.5">2026CS102</p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#172033] font-mono">
                <AnimatedCounter value={43} />
              </span>
              <span className="text-xs text-[#64748B]">/ 50</span>
            </div>
            <span className="text-xs font-bold text-[#14B8A6]">86% (33m 2s)</span>
          </div>
        </AnimatedCard>
      </StaggerContainer>

      {/* Full Class Roster Rankings Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#172033] uppercase tracking-wide">
            FULL CLASS ROSTER RANKINGS (7 STUDENTS)
          </h2>
          <span className="text-xs text-[#64748B]">Batch: 2026 CS A</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] border-b border-[#E2E8F0]">
              <tr>
                <th className="px-5 py-3 font-semibold w-16">Rank</th>
                <th className="px-5 py-3 font-semibold">Student Name</th>
                <th className="px-5 py-3 font-semibold font-mono">Roll Number</th>
                <th className="px-5 py-3 font-semibold">Batch</th>
                <th className="px-5 py-3 font-semibold">Time Taken</th>
                <th className="px-5 py-3 font-semibold text-center">Total Marks</th>
                <th className="px-5 py-3 font-semibold text-center">Marks Obtained</th>
                <th className="px-5 py-3 font-semibold text-center">Percentage</th>
                <th className="px-5 py-3 font-semibold text-center">Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {roster.map((row, idx) => {
                const isTopThree = row.rank <= 3;
                return (
                  <motion.tr
                    key={row.rollNumber}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    className={`transition-colors ${
                      row.isCurrentUser
                        ? 'bg-[#F0F7FF] hover:bg-[#E4F0FF]'
                        : 'hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      {isTopThree ? (
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] transition-transform hover:scale-105 ${
                            row.rank === 1
                              ? 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]'
                              : row.rank === 2
                              ? 'bg-[#E2E8F0] text-[#334155] border border-[#CBD5E1]'
                              : 'bg-[#FFEDD5] text-[#C2410C] border border-[#FED7AA]'
                          }`}
                        >
                          {row.rank}
                        </span>
                      ) : (
                        <span className="text-[#64748B] font-medium pl-2">{row.rank}</span>
                      )}
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#172033]">{row.name}</span>
                        {row.isCurrentUser && (
                          <span className="text-[9px] font-bold text-white bg-[#183653] px-1.5 py-0.5 rounded tracking-wide shadow-2xs">
                            YOU
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-3.5 font-mono text-[#64748B]">
                      {row.rollNumber}
                    </td>

                    <td className="px-5 py-3.5 text-[#64748B]">{row.batch}</td>

                    <td className="px-5 py-3.5 text-[#64748B]">{row.timeTaken}</td>

                    <td className="px-5 py-3.5 text-center text-[#64748B] font-mono">
                      {row.totalMarks}
                    </td>

                    <td className="px-5 py-3.5 text-center font-bold text-[#172033] font-mono">
                      {row.marksObtained}
                    </td>

                    <td className="px-5 py-3.5 text-center font-bold text-[#14B8A6] font-mono">
                      <div className="flex items-center justify-center gap-2">
                        <span>{row.percentage}%</span>
                        {row.percentage > 0 && (
                          <div className="w-12 bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden hidden sm:block">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${row.percentage}%` }}
                              transition={{ duration: 0.5, delay: 0.1 + idx * 0.04 }}
                              className="bg-[#14B8A6] h-full rounded-full"
                            />
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-center">
                      {row.standing === 'Distinction' && (
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ECFDF5] text-[#16A34A] border border-[#A7F3D0] transition-transform hover:scale-105">
                          Distinction
                        </span>
                      )}
                      {row.standing === 'Passed' && (
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EAF4FF] text-[#2563EB] border border-[#BFDBFE] transition-transform hover:scale-105">
                          Passed
                        </span>
                      )}
                      {row.standing === 'Absent' && (
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] transition-transform hover:scale-105">
                          Absent
                        </span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
