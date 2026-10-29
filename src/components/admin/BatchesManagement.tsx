import React, { useState } from 'react';
import { Layers, Search, Filter, Users, FileCheck2, Award, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { Batch } from '../../types';
import { PageTransition } from '../common/Motion';

interface BatchesManagementProps {
  batches: Batch[];
}

export const BatchesManagement: React.FC<BatchesManagementProps> = ({ batches }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  const filteredBatches = batches.filter((b) => {
    const matchSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = deptFilter === 'all' || b.department === deptFilter;
    return matchSearch && matchDept;
  });

  return (
    <PageTransition keyId="batches-management-page">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#172033]">Engineering Batches</h1>
            <p className="text-xs text-[#64748B] mt-1">
              Cohort-level performance benchmarks, completed viva evaluations, and readiness monitoring.
            </p>
          </div>

          <div className="text-xs text-[#64748B] font-mono font-medium">
            <span>{batches.length} Registered Batches</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search batch by name or department..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E2E8F0] rounded-lg text-[#172033] focus:outline-none focus:border-[#3B82F6] transition-colors"
            />
          </div>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-[#E2E8F0] rounded-lg text-[#172033] font-medium focus:outline-none focus:border-[#3B82F6]"
          >
            <option value="all">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics & Comm">Electronics & Comm</option>
          </select>
        </div>

        {/* Batch Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBatches.map((batch) => (
            <div
              key={batch.id}
              className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-4 hover:border-[#3B82F6]/50 transition-colors card-hover"
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8F0]">
                <div>
                  <h2 className="text-base font-bold text-[#172033]">{batch.name}</h2>
                  <span className="text-xs text-[#64748B] font-medium">{batch.department}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-[#64748B] block font-semibold">Avg Readiness</span>
                  <span className="text-lg font-bold text-[#14B8A6] font-mono tabular-nums">
                    {batch.averageReadiness}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-[#F5F8FC] rounded-lg border border-[#E2E8F0]">
                  <span className="text-[#64748B] text-[11px] block font-medium">Students</span>
                  <span className="font-bold text-[#172033] mt-0.5 block font-mono text-sm">
                    {batch.totalStudents}
                  </span>
                </div>
                <div className="p-3 bg-[#F5F8FC] rounded-lg border border-[#E2E8F0]">
                  <span className="text-[#64748B] text-[11px] block font-medium">Completed Vivas</span>
                  <span className="font-bold text-[#172033] mt-0.5 block font-mono text-sm">
                    {batch.completedAssessments}
                  </span>
                </div>
                <div className="p-3 bg-[#FEF2F2] rounded-lg border border-[#FECACA]">
                  <span className="text-[#DC2626] text-[11px] block font-semibold">Needs Practice</span>
                  <span className="font-bold text-[#DC2626] mt-0.5 block font-mono text-sm">
                    {batch.needsPracticeCount}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-[#64748B] font-medium">
                <span>Sample Batch Progress</span>
                <span className="font-mono text-[#172033] font-semibold">
                  {Math.round((batch.completedAssessments / (batch.totalStudents * 3)) * 100)}% verified
                </span>
              </div>
              <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                <motion.div
                  className="bg-[#234A70] h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(100, Math.round((batch.completedAssessments / (batch.totalStudents * 3)) * 100))}%`,
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};
