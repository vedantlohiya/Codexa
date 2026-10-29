import React, { useState } from 'react';
import {
  FolderGit2,
  ExternalLink,
  Plus,
  GitBranch,
  Clock,
  ArrowRight,
  Info,
  CheckCircle2,
  Loader2,
  X,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, StudentPage } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { PageTransition } from '../common/Motion';

interface MyProjectsProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onNavigate: (page: StudentPage) => void;
  onAddProject: (newProject: Project) => void;
}

export const MyProjects: React.FC<MyProjectsProps> = ({
  projects,
  onSelectProject,
  onNavigate,
  onAddProject,
}) => {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const [repoName, setRepoName] = useState('');
  const [language, setLanguage] = useState('TypeScript / React');
  const [branch, setBranch] = useState('main');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressStage, setProgressStage] = useState('');

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    setIsSubmitting(true);
    setProgressStage('Cloning simulated repository AST...');

    setTimeout(() => {
      setProgressStage('Extracting architectural components & route handlers...');
    }, 800);

    setTimeout(() => {
      setProgressStage('Synthesizing viva defense topics & failure modes...');
    }, 1600);

    setTimeout(() => {
      const generatedTitle = repoName.trim() || 'Custom Repo: ' + repoUrl.split('/').pop()?.replace('.git', '');
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        title: generatedTitle,
        repoUrl: repoUrl.trim(),
        language: language,
        branch: branch || 'main',
        status: 'Analysed',
        lastAnalyzed: 'Just now',
        description:
          'Simulated repository codebase imported for interview question synthesis and architectural vulnerability probing.',
        architectureOverview:
          'Standard multi-tier web application architecture with API controller bindings, middleware validation pipelines, and transactional database models.',
        modules: [
          {
            name: 'Core Application Logic',
            description: 'Main service domain rules and business workflows.',
            fileCount: 12,
            keyFiles: ['src/services/app.ts', 'src/controllers/index.ts'],
          },
          {
            name: 'API Controller Layer',
            description: 'HTTP request deserialization and schema validation guards.',
            fileCount: 6,
            keyFiles: ['src/routes/api.ts'],
          },
        ],
        keyFunctions: [
          {
            name: 'processPayload(data)',
            file: 'src/services/app.ts',
            purpose: 'Transforms incoming request data and triggers database persistence.',
            complexity: 'O(N) with input validation',
          },
        ],
        apiRoutes: [
          {
            method: 'POST',
            endpoint: '/api/v1/resource',
            description: 'Validates and records state mutations.',
          },
        ],
        databaseAndAuth: [
          {
            concept: 'State Mutation Pipeline',
            implementation: 'Guarded with validation schema and database transaction.',
            rationale: 'Guarantees consistent data states without orphan records.',
          },
        ],
        potentialTopics: [
          {
            topic: 'Error Handling in Asynchronous Pipelines',
            reason: 'Interviewer will check if unhandled promise rejections take down server process.',
            riskLevel: 'High',
          },
        ],
      };

      onAddProject(newProj);
      setIsSubmitting(false);
      setShowConnectModal(false);
      setRepoUrl('');
      setRepoName('');
    }, 2400);
  };

  return (
    <PageTransition keyId="my-projects-page">
      <div className="space-y-6">
        {/* Header with Title and Connect Button */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#172033]">My Projects</h1>
            <p className="text-xs text-[#64748B] mt-1">
              Projects indexed for mock technical interviews, code defense, and viva preparation.
            </p>
          </div>

          <button
            onClick={() => setShowConnectModal(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#234A70] hover:bg-[#183653] text-white text-xs font-semibold rounded-lg transition-all cursor-pointer shrink-0 shadow-xs active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Connect Repository (Demo)</span>
          </button>
        </div>

        {/* Demo Notice Banner */}
        <div className="p-3.5 bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-xs text-[#64748B] flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-[#172033] font-semibold">Demo Simulation Notice:</strong> Connecting a repository simulates code analysis, AST parsing, and vulnerability indexing. No live GitHub credentials are required or transmitted.
          </p>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ y: -2, boxShadow: '0 8px 20px -4px rgba(24, 54, 83, 0.08)' }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-[#E2E8F0] hover:border-[#3B82F6]/50 rounded-xl p-5 sm:p-6 transition-colors shadow-2xs"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#EAF4FF] flex items-center justify-center text-[#234A70]">
                      <FolderGit2 className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-[#172033]">
                      {project.title}
                    </h3>
                    <StatusBadge status={project.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B] pt-0.5">
                    <span className="font-mono text-[#172033] font-medium">{project.language}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 font-mono">
                      <GitBranch className="w-3.5 h-3.5 text-[#3B82F6]" />
                      {project.branch}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Last analysed: {project.lastAnalyzed}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onSelectProject(project);
                      onNavigate('project-detail');
                    }}
                    className="px-4 py-2 bg-[#234A70] hover:bg-[#183653] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Project Architecture</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <p className="text-[#64748B] max-w-2xl leading-relaxed">
                  {project.description}
                </p>

                <div className="flex items-center gap-3 text-[#64748B] shrink-0 font-medium">
                  <span className="bg-[#EAF4FF] text-[#234A70] px-2 py-0.5 rounded text-[11px] font-semibold">
                    {project.modules.length} Modules
                  </span>
                  <span>·</span>
                  <span>{project.keyFunctions.length} Functions</span>
                  <span>·</span>
                  <span className="text-[#14B8A6] font-semibold">
                    {project.potentialTopics.length} Viva Topics
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Simulated GitHub Connection Modal */}
        <AnimatePresence>
          {showConnectModal && (
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
                className="bg-white rounded-xl border border-[#E2E8F0] max-w-lg w-full p-6 shadow-xl"
              >
                <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-[#3B82F6]" />
                    <h3 className="text-sm font-bold text-[#172033]">
                      Connect Repository (Simulated Demo)
                    </h3>
                  </div>
                  {!isSubmitting && (
                    <button
                      onClick={() => setShowConnectModal(false)}
                      className="text-[#64748B] hover:text-[#172033] p-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {isSubmitting ? (
                  <div className="py-8 text-center space-y-4">
                    <Loader2 className="w-8 h-8 text-[#3B82F6] animate-spin mx-auto" />
                    <div>
                      <p className="text-xs font-bold text-[#172033]">Analysing Repository Codebase</p>
                      <p className="text-[11px] text-[#64748B] mt-1 font-mono">{progressStage}</p>
                    </div>
                    <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden max-w-xs mx-auto">
                      <div className="bg-[#3B82F6] h-full w-3/4 animate-pulse" />
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleConnect} className="mt-4 space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-[#172033] mb-1">
                        Repository URL
                      </label>
                      <input
                        type="text"
                        required
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        placeholder="https://github.com/username/project-name"
                        className="w-full px-3 py-2 text-xs bg-white border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#3B82F6] text-[#172033] transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-[#172033] mb-1">
                          Project Display Name
                        </label>
                        <input
                          type="text"
                          value={repoName}
                          onChange={(e) => setRepoName(e.target.value)}
                          placeholder="e.g. My Capstone App"
                          className="w-full px-3 py-2 text-xs bg-white border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#3B82F6] text-[#172033] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#172033] mb-1">
                          Default Branch
                        </label>
                        <input
                          type="text"
                          value={branch}
                          onChange={(e) => setBranch(e.target.value)}
                          placeholder="main"
                          className="w-full px-3 py-2 text-xs bg-white border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#3B82F6] text-[#172033] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#172033] mb-1">
                        Primary Tech Stack
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#3B82F6] text-[#172033]"
                      >
                        <option value="TypeScript / React / Node.js">TypeScript / React / Node.js</option>
                        <option value="Python / FastAPI / PyTorch">Python / FastAPI / PyTorch</option>
                        <option value="Go / PostgreSQL / React">Go / PostgreSQL / React</option>
                        <option value="Java / Spring Boot / MySQL">Java / Spring Boot / MySQL</option>
                      </select>
                    </div>

                    <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowConnectModal(false)}
                        className="px-3.5 py-2 text-xs font-medium text-[#64748B] hover:text-[#172033] rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#234A70] hover:bg-[#183653] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                      >
                        Connect &amp; Run Analysis
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};
