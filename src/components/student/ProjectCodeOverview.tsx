import React, { useState } from 'react';
import {
  ArrowLeft,
  GitBranch,
  Layers,
  Code,
  Globe,
  Database,
  AlertTriangle,
  Play,
  FileCode,
  Shield,
  HelpCircle,
  FileText,
  Network,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, StudentPage } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { PageTransition } from '../common/Motion';

interface ProjectCodeOverviewProps {
  project: Project;
  onBack: () => void;
  onNavigate: (page: StudentPage) => void;
}

export const ProjectCodeOverview: React.FC<ProjectCodeOverviewProps> = ({
  project,
  onBack,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'architecture' | 'modules' | 'functions' | 'routes' | 'database' | 'interview-topics'
  >('overview');

  return (
    <PageTransition keyId="project-overview-page">
      <div className="space-y-6">
        {/* Top Bar with Back Link and Start CTA */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B] hover:text-[#172033] mb-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to repositories
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-[#172033]">{project.title}</h1>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-xs text-[#64748B] mt-1 flex flex-wrap items-center gap-3">
              <span className="font-mono text-[#172033] font-medium">{project.language}</span>
              <span>·</span>
              <span className="flex items-center gap-1 font-mono">
                <GitBranch className="w-3.5 h-3.5 text-[#3B82F6]" />
                {project.branch}
              </span>
              <span>·</span>
              <span>Last analyzed: {project.lastAnalyzed}</span>
            </p>
          </div>

          <button
            onClick={() => onNavigate('practice')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#234A70] hover:bg-[#183653] text-white text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer shadow-xs active:scale-98"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Interview</span>
          </button>
        </div>

        {/* Navigation Tabs with Smooth Animated Pill */}
        <div className="flex items-center gap-1.5 border-b border-[#E2E8F0] pb-2 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'architecture', label: 'Project Architecture' },
            { id: 'modules', label: `Key Modules (${project.modules.length})` },
            { id: 'functions', label: `Functions (${project.keyFunctions.length})` },
            { id: 'routes', label: `API Routes (${project.apiRoutes.length})` },
            { id: 'database', label: `Database Overview (${project.databaseAndAuth.length})` },
            { id: 'interview-topics', label: `Interview Topics (${project.potentialTopics.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-[#64748B] hover:text-[#172033] hover:bg-[#F5F8FC]'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="project-tab-pill"
                  className="absolute inset-0 bg-[#234A70] rounded-lg -z-10 shadow-xs"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                />
              )}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#172033] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#3B82F6]" />
                Project Mission &amp; Problem Solved
              </h3>
              <p className="text-xs text-[#172033] leading-relaxed">
                {project.description}
              </p>

              <div>
                <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block mb-2">
                  Indexed Technology Stack
                </span>
                <div className="flex flex-wrap gap-2">
                  {(
                    project.techStack || [
                      'React',
                      'TypeScript',
                      'Tailwind CSS',
                      'Node.js',
                      'PostgreSQL',
                      'Redis',
                    ]
                  ).map((tech: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-[#EAF4FF] text-[#234A70] rounded-md font-mono text-xs border border-[#BFDBFE]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs">
                <span className="text-xs text-[#64748B] block mb-1">Architecture Pattern</span>
                <span className="text-xs font-bold text-[#172033]">Micro-monolith with Edge API</span>
                <p className="text-[11px] text-[#64748B] mt-1">Decoupled UI &amp; Worker queues</p>
              </div>
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs">
                <span className="text-xs text-[#64748B] block mb-1">State &amp; Persistence</span>
                <span className="text-xs font-bold text-[#14B8A6]">PostgreSQL + Redis Cache</span>
                <p className="text-[11px] text-[#64748B] mt-1">Optimistic locking enabled</p>
              </div>
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs">
                <span className="text-xs text-[#64748B] block mb-1">Indexed Viva Questions</span>
                <span className="text-xs font-bold text-[#3B82F6]">12 Technical Viva Prompts</span>
                <p className="text-[11px] text-[#64748B] mt-1">Prepared across 3 mock modes</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Architecture */}
        {activeTab === 'architecture' && (
          <div className="space-y-4">
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
              <h3 className="text-sm font-bold text-[#172033] mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#3B82F6]" />
                System Architecture &amp; Component Flow
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                {project.architectureOverview}
              </p>

              <div className="mt-4 p-4 bg-[#F5F8FC] border border-[#E2E8F0] rounded-lg font-mono text-xs text-[#172033]">
                <div className="text-[11px] text-[#64748B] mb-2 font-sans font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>Logical Component &amp; Data Storage Flow</span>
                </div>
                <div className="space-y-1.5 text-xs text-[#172033]">
                  <div>[Client UI: React / Next.js SPA] ──&gt; (HTTPS / Bearer JWT Auth)</div>
                  <div className="pl-6 text-[#3B82F6]">│</div>
                  <div className="pl-4 text-[#3B82F6]">▼</div>
                  <div>[API Gateway / Router] ──&gt; [RBAC Guard &amp; Session Validator]</div>
                  <div className="pl-6 text-[#3B82F6]">│</div>
                  <div className="pl-4 text-[#3B82F6]">▼</div>
                  <div>[Analytics / Worker Queue] ──&gt; [Redis In-Memory Cache] (TTL: 15m)</div>
                  <div className="pl-6 text-[#14B8A6]">│</div>
                  <div className="pl-4 text-[#14B8A6]">▼</div>
                  <div>[Relational Storage: PostgreSQL] (Optimistic Lock `version` + Composite Indexes)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Modules */}
        {activeTab === 'modules' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.modules.map((mod, idx) => (
              <div key={idx} className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#E2E8F0]">
                    <h3 className="text-sm font-bold text-[#172033]">{mod.name}</h3>
                    <span className="text-[11px] text-[#64748B] font-mono font-medium">{mod.fileCount} source files</span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-2 leading-relaxed">{mod.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
                  <span className="text-[10px] uppercase tracking-wider text-[#64748B] font-semibold block mb-1">
                    Primary Files
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {mod.keyFiles.map((f, fIdx) => (
                      <span
                        key={fIdx}
                        className="px-2 py-0.5 bg-[#F5F8FC] border border-[#E2E8F0] rounded text-[11px] font-mono text-[#172033]"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Functions */}
        {activeTab === 'functions' && (
          <div className="space-y-3">
            {project.keyFunctions.map((fn, idx) => (
              <div key={idx} className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-[#3B82F6]" />
                    <span className="font-mono text-xs font-bold text-[#172033]">{fn.name}</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#234A70] bg-[#EAF4FF] px-2 py-0.5 rounded font-semibold border border-[#CBD5E1]/40">
                    {fn.complexity}
                  </span>
                </div>
                <div className="mt-2.5 text-xs grid grid-cols-1 md:grid-cols-4 gap-2">
                  <div className="md:col-span-1 text-[#64748B] font-mono text-[11px] flex items-center gap-1">
                    <FileCode className="w-3.5 h-3.5 text-[#3B82F6]" />
                    {fn.file}
                  </div>
                  <div className="md:col-span-3 text-[#172033] leading-relaxed">{fn.purpose}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: API Routes */}
        {activeTab === 'routes' && (
          <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F5F8FC] border-b border-[#E2E8F0] text-[#64748B]">
                  <th className="py-3 px-4 font-semibold w-24">Method</th>
                  <th className="py-3 px-4 font-semibold">Endpoint</th>
                  <th className="py-3 px-4 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {project.apiRoutes.map((route, idx) => (
                  <tr key={idx} className="hover:bg-[#F5F8FC]/60 transition-colors">
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          route.method === 'GET'
                            ? 'bg-[#EAF4FF] text-[#2563EB]'
                            : route.method === 'POST'
                            ? 'bg-[#F0FDF4] text-[#16A34A]'
                            : route.method === 'PATCH' || route.method === 'PUT'
                            ? 'bg-[#FFFBEB] text-[#D97706]'
                            : 'bg-[#FEF2F2] text-[#DC2626]'
                        }`}
                      >
                        {route.method}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-[#172033]">{route.endpoint}</td>
                    <td className="py-3 px-4 text-[#64748B]">{route.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 6: Database */}
        {activeTab === 'database' && (
          <div className="space-y-4">
            {project.databaseAndAuth.map((item, idx) => (
              <div key={idx} className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
                <div className="flex items-center gap-2 pb-2.5 border-b border-[#E2E8F0]">
                  <Database className="w-4 h-4 text-[#3B82F6]" />
                  <h3 className="text-xs font-bold text-[#172033]">{item.concept}</h3>
                </div>
                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="text-[#64748B] font-semibold block text-[11px]">Implementation:</span>
                    <p className="text-[#172033] mt-0.5 leading-relaxed">{item.implementation}</p>
                  </div>
                  <div>
                    <span className="text-[#64748B] font-semibold block text-[11px]">Engineering Rationale:</span>
                    <p className="text-[#64748B] mt-0.5 leading-relaxed">{item.rationale}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 7: Interview Topics */}
        {activeTab === 'interview-topics' && (
          <div className="space-y-3">
            {project.potentialTopics.map((topic, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-hover"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className={`w-4 h-4 ${
                        topic.riskLevel === 'High'
                          ? 'text-[#DC2626]'
                          : topic.riskLevel === 'Medium'
                          ? 'text-[#D97706]'
                          : 'text-[#3B82F6]'
                      }`}
                    />
                    <h3 className="text-xs font-bold text-[#172033]">{topic.topic}</h3>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">{topic.reason}</p>
                </div>

                <div className="shrink-0">
                  <StatusBadge status={`${topic.riskLevel} Defense Risk`} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
};
