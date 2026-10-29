import React, { useState } from 'react';
import { History, Eye, ArrowUpDown, Filter } from 'lucide-react';
import { InterviewResult, StudentPage } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { PageTransition } from '../common/Motion';

interface InterviewHistoryProps {
  history: InterviewResult[];
  onViewResult: (result: InterviewResult) => void;
  onNavigate: (page: StudentPage) => void;
}

export const InterviewHistory: React.FC<InterviewHistoryProps> = ({
  history,
  onViewResult,
  onNavigate,
}) => {
  const [modeFilter, setModeFilter] = useState<string>('all');
  const [sortDescending, setSortDescending] = useState(true);

  const filteredHistory = history
    .filter((item) => (modeFilter === 'all' ? true : item.mode === modeFilter))
    .sort((a, b) => (sortDescending ? b.overallScore - a.overallScore : a.overallScore - b.overallScore));

  return (
    <PageTransition keyId="interview-history-page">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#172033]">Interview History</h1>
            <p className="text-xs text-[#64748B] mt-1">
              Archived records of mock interview sessions, trap defusal rounds, and viva evaluations.
            </p>
          </div>

          <button
            onClick={() => onNavigate('practice')}
            className="px-4 py-2.5 bg-[#234A70] hover:bg-[#183653] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 shadow-xs active:scale-98"
          >
            New Practice Session
          </button>
        </div>

        {/* Filter and Sort Toolbar */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#64748B]" />
            <span className="text-xs font-semibold text-[#172033]">Filter Mode:</span>
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-[#E2E8F0] rounded-lg text-[#172033] font-medium focus:outline-none focus:border-[#3B82F6]"
            >
              <option value="all">All Modes ({history.length})</option>
              <option value="standard">Standard Interview</option>
              <option value="trap-hint">Trap Hint Round</option>
              <option value="break-it">Break It Round</option>
            </select>
          </div>

          <button
            onClick={() => setSortDescending(!sortDescending)}
            className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#172033] font-medium cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort by Score: {sortDescending ? 'Highest first' : 'Lowest first'}</span>
          </button>
        </div>

        {/* History Table */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-xs">
          {filteredHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F5F8FC] border-b border-[#E2E8F0] text-[#64748B]">
                    <th className="py-3 px-4 font-semibold">Date</th>
                    <th className="py-3 px-4 font-semibold">Assigned PDF / Project</th>
                    <th className="py-3 px-4 font-semibold">Interview Format</th>
                    <th className="py-3 px-4 font-semibold">Storage</th>
                    <th className="py-3 px-4 font-semibold">Technical Score</th>
                    <th className="py-3 px-4 font-semibold">Delivery Score</th>
                    <th className="py-3 px-4 font-semibold">Overall Score</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F5F8FC]/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[#172033] font-medium whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#172033] max-w-xs truncate">
                        {item.projectTitle}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="uppercase text-[10px] font-mono text-[#234A70] bg-[#EAF4FF] px-2.5 py-0.5 rounded-md font-semibold">
                          5-Q Viva
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                          Firebase
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#14B8A6] font-bold tabular-nums">
                        {item.codeUnderstandingScore}%
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#3B82F6] font-bold tabular-nums">
                        {item.speakingDeliveryScore}%
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#172033] tabular-nums">
                        {item.overallScore} / 100
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status="Completed" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            onViewResult(item);
                            onNavigate('results');
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-[#234A70] hover:bg-[#EAF4FF] rounded-lg border border-[#CBD5E1] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#3B82F6]" />
                          <span>View Results</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-[#64748B]">
              No interview records found matching your filter.
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};
