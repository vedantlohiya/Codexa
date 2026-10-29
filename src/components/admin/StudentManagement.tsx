import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Users,
  Download,
  AlertCircle,
} from 'lucide-react';
import { Student, Batch, AdminPage } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { PageTransition } from '../common/Motion';

interface StudentManagementProps {
  students: Student[];
  batches: Batch[];
  onSelectStudent: (student: Student) => void;
  onNavigate: (page: AdminPage) => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({
  students,
  batches,
  onSelectStudent,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [batchFilter, setBatchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'sessions'>('score');

  const filteredStudents = students
    .filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDept = deptFilter === 'all' || s.department === deptFilter;
      const matchBatch = batchFilter === 'all' || s.batch === batchFilter;
      const matchStatus = statusFilter === 'all' || s.readinessStatus === statusFilter;
      return matchSearch && matchDept && matchBatch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.codeUnderstandingScore - a.codeUnderstandingScore;
      if (sortBy === 'sessions') return b.completedSessions - a.completedSessions;
      return a.name.localeCompare(b.name);
    });

  return (
    <PageTransition keyId="student-management-page">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#172033]">Candidate Management</h1>
            <p className="text-xs text-[#64748B] mt-1">
              Complete roster of engineering candidates preparing their projects for placement viva defense.
            </p>
          </div>

          <div className="text-xs text-[#64748B] font-mono font-medium">
            Total: <strong className="text-[#172033]">{students.length} Records</strong>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search candidate by name, roll number, or institutional email..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E2E8F0] rounded-lg text-[#172033] focus:outline-none focus:border-[#3B82F6] transition-colors"
              />
            </div>

            {/* Department Filter */}
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

            {/* Batch Filter */}
            <select
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-[#E2E8F0] rounded-lg text-[#172033] font-medium focus:outline-none focus:border-[#3B82F6]"
            >
              <option value="all">All Batches</option>
              {batches.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>

            {/* Readiness Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-[#E2E8F0] rounded-lg text-[#172033] font-medium focus:outline-none focus:border-[#3B82F6]"
            >
              <option value="all">All Readiness Tiers</option>
              <option value="Ready">Placement Ready</option>
              <option value="Marginal">Marginal</option>
              <option value="Needs Practice">Needs Practice</option>
            </select>

            {/* Sort Control */}
            <div className="flex items-center gap-1.5 px-3 py-2 bg-[#F5F8FC] border border-[#E2E8F0] rounded-lg text-xs text-[#64748B]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#3B82F6]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-[#172033] font-semibold focus:outline-none"
              >
                <option value="score">Sort by Code Score</option>
                <option value="sessions">Sort by Sessions</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-xs">
          {filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F5F8FC] border-b border-[#E2E8F0] text-[#64748B]">
                    <th className="py-3 px-4 font-semibold">Candidate Name</th>
                    <th className="py-3 px-4 font-semibold">Roll Number</th>
                    <th className="py-3 px-4 font-semibold">Department</th>
                    <th className="py-3 px-4 font-semibold">Batch</th>
                    <th className="py-3 px-4 font-semibold text-center">Sessions</th>
                    <th className="py-3 px-4 font-semibold">Code Understanding</th>
                    <th className="py-3 px-4 font-semibold">Speaking Delivery</th>
                    <th className="py-3 px-4 font-semibold">Readiness</th>
                    <th className="py-3 px-4 font-semibold">Last Active</th>
                    <th className="py-3 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-[#F5F8FC]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#172033]">{student.name}</div>
                        <div className="text-[11px] text-[#64748B]">{student.email}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#172033] font-semibold">
                        {student.rollNumber}
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B] font-medium">{student.department}</td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#172033] font-medium">
                        {student.batch}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-center text-[#172033] font-bold tabular-nums">
                        {student.completedSessions}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#14B8A6] tabular-nums">
                        {student.codeUnderstandingScore}%
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#3B82F6] tabular-nums">
                        {student.speakingDeliveryScore}%
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={student.readinessStatus} />
                      </td>
                      <td className="py-3.5 px-4 text-[11px] text-[#64748B] font-medium">{student.lastActivity}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            onSelectStudent(student);
                            onNavigate('student-detail');
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-[#234A70] hover:bg-[#EAF4FF] rounded-lg border border-[#CBD5E1] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#3B82F6]" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-[#64748B] space-y-2">
              <AlertCircle className="w-6 h-6 text-[#64748B] mx-auto" />
              <p className="font-bold text-[#172033]">No candidates found matching filters.</p>
              <p className="text-[11px]">Try adjusting your search query, department, or batch selection.</p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};
