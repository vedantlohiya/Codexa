/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, Code2, ShieldCheck, ArrowLeftRight, LogOut, ChevronRight } from 'lucide-react';
import {
  PortalRole,
  StudentPage,
  AdminPage,
  Student,
  Project,
  InterviewResult,
  Assessment,
  Batch,
  ToastMessage,
  InterviewMode,
  ExamPaper,
  ExamSubmission,
  AssignedPdfDocument,
} from './types';
import {
  initialStudents,
  initialProjects,
  initialAssessments,
  initialBatches,
  initialHistory,
  initialExamPapers,
  initialExamSubmissions,
} from './data/mockData';
import { getStoredPdfs } from './services/firebaseService';

import { AnimatePresence, motion } from 'motion/react';

// Common Components
import { Toast } from './components/common/Toast';
import { DemoBanner } from './components/common/DemoBanner';
import { CodexaLogo } from './components/common/CodexaLogo';

// Auth & Portal Selection Screens
import { PortalSelect } from './components/auth/PortalSelect';
import { StudentLogin } from './components/auth/StudentLogin';
import { AdminLogin } from './components/auth/AdminLogin';

// Student Portal Screens
import { StudentSidebar } from './components/student/StudentSidebar';
import { StudentOverview } from './components/student/StudentOverview';
import { MyProjects } from './components/student/MyProjects';
import { ProjectCodeOverview } from './components/student/ProjectCodeOverview';
import { PracticeInterview } from './components/student/PracticeInterview';
import { InterviewResults } from './components/student/InterviewResults';
import { InterviewHistory } from './components/student/InterviewHistory';
import { StudentPerformance } from './components/student/StudentPerformance';
import { StudentSettings } from './components/student/StudentSettings';
import { StudentExams } from './components/student/StudentExams';
import { LiveExamSession } from './components/student/LiveExamSession';

// Admin Portal Screens
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminOverview } from './components/admin/AdminOverview';
import { PdfManagement } from './components/admin/PdfManagement';
import { StudentManagement } from './components/admin/StudentManagement';
import { StudentDetail } from './components/admin/StudentDetail';
import { BatchesManagement } from './components/admin/BatchesManagement';
import { AssessmentsList } from './components/admin/AssessmentsList';
import { PreVivaEvaluation } from './components/admin/PreVivaEvaluation';
import { ReportsView } from './components/admin/ReportsView';
import { AdminSettings } from './components/admin/AdminSettings';
import { PaperManagement } from './components/admin/PaperManagement';
import { ExamSubmissionsReview } from './components/admin/ExamSubmissionsReview';

export default function App() {
  // Global Navigation & Role State
  const [currentRole, setCurrentRole] = useState<PortalRole>('portal-select');
  const [studentPage, setStudentPage] = useState<StudentPage>('overview');
  const [adminPage, setAdminPage] = useState<AdminPage>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Application Data Stores (Local React State)
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [assessments, setAssessments] = useState<Assessment[]>(initialAssessments);
  const [batches, setBatches] = useState<Batch[]>(initialBatches);
  const [history, setHistory] = useState<InterviewResult[]>(initialHistory);
  const [pdfDocuments, setPdfDocuments] = useState<AssignedPdfDocument[]>(getStoredPdfs);

  // Examination Stores
  const [papers, setPapers] = useState<ExamPaper[]>(initialExamPapers);
  const [examSubmissions, setExamSubmissions] = useState<ExamSubmission[]>(initialExamSubmissions);
  const [activeExamPaper, setActiveExamPaper] = useState<ExamPaper>(initialExamPapers[0]);
  const [selectedReviewPaper, setSelectedReviewPaper] = useState<ExamPaper>(initialExamPapers[0]);

  // Selected Entities
  const [activeStudent, setActiveStudent] = useState<Student>(initialStudents[0]);
  const [selectedProject, setSelectedProject] = useState<Project>(initialProjects[0]);
  const [activeResult, setActiveResult] = useState<InterviewResult>(initialHistory[0]);
  const [selectedAdminStudent, setSelectedAdminStudent] = useState<Student>(initialStudents[0]);
  const [practiceMode, setPracticeMode] = useState<InterviewMode>('standard');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, message?: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Student Actions
  const handleAddProject = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
    setSelectedProject(newProject);
    showToast('Repository Connected', `${newProject.title} is now indexed for mock interviews.`);
  };

  const handleCompleteInterview = (result: InterviewResult) => {
    setHistory((prev) => [result, ...prev]);
    setActiveResult(result);
    // Update active student score in local state
    setActiveStudent((prev) => ({
      ...prev,
      completedSessions: prev.completedSessions + 1,
      codeUnderstandingScore: result.codeUnderstandingScore,
      speakingDeliveryScore: result.speakingDeliveryScore,
      lastActivity: 'Just now',
    }));
    // Also record assessment in admin assessments list
    const newAsm: Assessment = {
      id: `asm-${Date.now()}`,
      studentId: activeStudent.id,
      studentName: activeStudent.name,
      rollNumber: activeStudent.rollNumber,
      department: activeStudent.department,
      batch: activeStudent.batch,
      projectTitle: result.projectTitle,
      type: `${result.mode.replace('-', ' ').toUpperCase()} Viva`,
      completionDate: 'Today',
      score: result.overallScore,
      codeUnderstanding: result.codeUnderstandingScore,
      speakingDelivery: result.speakingDeliveryScore,
      reviewStatus: 'Pending Review',
      questionSummary: result.answers.map((a) => a.questionText).join(' | '),
      studentResponseSnippet: result.answers[0]?.studentAnswer || 'Demonstrated code mechanisms',
      aiEvaluationSummary: `Candidate achieved ${result.codeUnderstandingScore}% on technical comprehension and ${result.speakingDeliveryScore}% on speaking delivery.`,
    };
    setAssessments((prev) => [newAsm, ...prev]);
    showToast('Interview Session Recorded', `Scored ${result.overallScore}/100. Detailed breakdown generated.`);
  };

  // Admin Actions
  const handleUpdateAssessment = (updated: Assessment) => {
    setAssessments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  const handleSaveFacultyNotes = (studentId: string, notes: string) => {
    setAssessments((prev) =>
      prev.map((a) => (a.studentId === studentId ? { ...a, facultyNotes: notes } : a))
    );
  };

  // Exam Paper Handlers
  const handleSavePaper = (paper: ExamPaper) => {
    setPapers((prev) => {
      const exists = prev.some((p) => p.id === paper.id);
      return exists ? prev.map((p) => (p.id === paper.id ? paper : p)) : [paper, ...prev];
    });
    showToast('Question Paper Saved', `${paper.name} has been ${paper.status}.`);
  };

  const handleDeletePaper = (paperId: string) => {
    setPapers((prev) => prev.filter((p) => p.id !== paperId));
    showToast('Paper Removed', 'Question paper archived.');
  };

  const handleToggleReleaseResults = (paperId: string) => {
    setPapers((prev) =>
      prev.map((p) => (p.id === paperId ? { ...p, resultsReleased: !p.resultsReleased } : p))
    );
    showToast('Official Results Updated', 'Examination score visibility updated for batch students.');
  };

  // PDF Document Handlers
  const handleSavePdfDocument = (doc: AssignedPdfDocument) => {
    setPdfDocuments((prev) => {
      const exists = prev.some((p) => p.id === doc.id);
      return exists ? prev.map((p) => (p.id === doc.id ? doc : p)) : [doc, ...prev];
    });
    showToast('Interview PDF Assigned', `${doc.title} published for batch.`);
  };

  const handleDeletePdfDocument = async (docId: string) => {
    setPdfDocuments((prev) => prev.filter((p) => p.id !== docId));
    try {
      await fetch(`/api/admin/pdfs/${docId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Backend delete warning:', e);
    }
    showToast('Document Archived', 'Assigned PDF removed from student viva hub.');
  };

  const handleStartExam = (paper: ExamPaper) => {
    setActiveExamPaper(paper);
    setStudentPage('take-exam');
  };

  const handleSubmitExam = (submission: ExamSubmission) => {
    setExamSubmissions((prev) => [submission, ...prev]);
    setStudentPage('exams');
    showToast(
      'Examination Submitted',
      `Auto-score recorded: ${submission.autoScore}/${submission.totalMarks}. Proctor transcript generated.`
    );
  };

  const handleUpdateExamSubmission = (submission: ExamSubmission) => {
    setExamSubmissions((prev) =>
      prev.map((s) => (s.id === submission.id ? submission : s))
    );
    showToast('Candidate Evaluated', `Final marks recorded for ${submission.studentName}.`);
  };

  const handleOpenSubmissionsReview = (paper: ExamPaper) => {
    setSelectedReviewPaper(paper);
    setAdminPage('review-submission');
  };

  // Render Authentication & Portal Selector Screens
  if (currentRole === 'portal-select') {
    return (
      <>
        <DemoBanner />
        <PortalSelect
          onSelectStudent={() => setCurrentRole('student-login')}
          onSelectAdmin={() => setCurrentRole('admin-login')}
        />
        <Toast toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  if (currentRole === 'student-login') {
    return (
      <>
        <DemoBanner />
        <StudentLogin
          onLogin={() => {
            setCurrentRole('student');
            setStudentPage('overview');
            showToast('Welcome, Vedant Lohiya', 'Logged in to Student Workspace.');
          }}
          onBack={() => setCurrentRole('portal-select')}
        />
        <Toast toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  if (currentRole === 'admin-login') {
    return (
      <>
        <DemoBanner />
        <AdminLogin
          onLogin={() => {
            setCurrentRole('admin');
            setAdminPage('overview');
            showToast('Welcome, Dr. Marcus Vance', 'Logged in to Placement Console.');
          }}
          onBack={() => setCurrentRole('portal-select')}
        />
        <Toast toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  // Render Student Portal Layout
  if (currentRole === 'student') {
    if (studentPage === 'take-exam') {
      return (
        <LiveExamSession
          paper={activeExamPaper}
          studentName={activeStudent.name}
          studentRoll={activeStudent.rollNumber}
          studentBatch={activeStudent.batch}
          studentId={activeStudent.id}
          onSubmitExam={handleSubmitExam}
          onExit={() => setStudentPage('exams')}
        />
      );
    }

    return (
      <div className="min-h-screen bg-[#F5F8FC] flex flex-col">
        <DemoBanner />

        {/* Unified Top Navigation */}
        <header className="bg-white border-b border-[#E2E8F0] px-4 sm:px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 text-[#64748B] hover:text-[#172033] cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <CodexaLogo size="sm" />
              <ChevronRight className="w-3.5 h-3.5 text-[#CBD5E1] hidden sm:inline" />
              <span className="text-xs text-[#3B82F6] font-semibold hidden sm:inline capitalize">
                Student &bull; {studentPage.replace('-', ' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCurrentRole('portal-select');
                showToast('Switched to Portal Selection', 'Returned to role picker.');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#183653] hover:text-[#3B82F6] hover:bg-[#EAF4FF] rounded-lg border border-[#E2E8F0] transition-colors cursor-pointer shadow-2xs"
              title="Switch between Student and Admin portals"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span className="hidden sm:inline">Switch portal</span>
            </button>

            <button
              onClick={() => {
                setCurrentRole('portal-select');
                showToast('Signed Out', 'You have been returned to portal selection.');
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </header>

        {/* Body Layout: Sidebar + Main Content */}
        <div className="flex flex-1 overflow-hidden">
          <StudentSidebar
            currentPage={studentPage}
            onNavigate={(page) => setStudentPage(page)}
            onLogout={() => setCurrentRole('portal-select')}
            mobileOpen={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
            studentName={activeStudent.name}
            studentRoll={activeStudent.rollNumber}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={studentPage}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                {studentPage === 'overview' && (
                  <StudentOverview
                    student={activeStudent}
                    primaryProject={selectedProject}
                    latestResult={activeResult}
                    onNavigate={(page) => setStudentPage(page)}
                    onSelectProject={(proj) => setSelectedProject(proj)}
                    onStartInterviewWithMode={(mode) => {
                      setPracticeMode(mode);
                      setStudentPage('practice');
                    }}
                  />
                )}

                {studentPage === 'exams' && (
                  <StudentExams
                    student={activeStudent}
                    papers={papers}
                    submissions={examSubmissions}
                    onStartExam={handleStartExam}
                    onNavigate={(page) => setStudentPage(page)}
                  />
                )}

                {studentPage === 'projects' && (
                  <MyProjects
                    projects={projects}
                    onSelectProject={(proj) => setSelectedProject(proj)}
                    onNavigate={(page) => setStudentPage(page)}
                    onAddProject={handleAddProject}
                  />
                )}

                {studentPage === 'project-detail' && (
                  <ProjectCodeOverview
                    project={selectedProject}
                    onBack={() => setStudentPage('projects')}
                    onNavigate={(page) => setStudentPage(page)}
                  />
                )}

                {studentPage === 'practice' && (
                  <PracticeInterview
                    activeStudent={activeStudent}
                    onCompleteInterview={handleCompleteInterview}
                    onNavigate={(page) => setStudentPage(page)}
                  />
                )}

                {studentPage === 'results' && (
                  <InterviewResults
                    result={activeResult}
                    onNavigate={(page) => setStudentPage(page)}
                    onPracticeAgain={() => setStudentPage('practice')}
                  />
                )}

                {studentPage === 'history' && (
                  <InterviewHistory
                    history={history}
                    onViewResult={(res) => setActiveResult(res)}
                    onNavigate={(page) => setStudentPage(page)}
                  />
                )}

                {studentPage === 'performance' && (
                  <StudentPerformance onNavigate={(page) => setStudentPage(page)} />
                )}

                {studentPage === 'settings' && (
                  <StudentSettings
                    student={activeStudent}
                    onUpdateStudent={(updated) => setActiveStudent((prev) => ({ ...prev, ...updated }))}
                    onLogout={() => setCurrentRole('portal-select')}
                    showToast={showToast}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        <Toast toasts={toasts} onDismiss={handleDismissToast} />
      </div>
    );
  }

  // Render Admin Portal Layout
  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col">
      <DemoBanner label="Admin Portal Demo: Student rosters, pre-viva evaluations, and mock scores are simulated local records." />

      {/* Top Header */}
      <header className="bg-white border-b border-[#E2E8F0] px-4 sm:px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-1.5 text-[#64748B] hover:text-[#172033] cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <CodexaLogo size="sm" />
            <ChevronRight className="w-3.5 h-3.5 text-[#CBD5E1] hidden sm:inline" />
            <span className="text-xs text-[#14B8A6] font-semibold hidden sm:inline capitalize">
              Admin &bull; {adminPage.replace('-', ' ')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setCurrentRole('portal-select');
              showToast('Switched to Portal Selection', 'Returned to role picker.');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#183653] hover:text-[#3B82F6] hover:bg-[#EAF4FF] rounded-lg border border-[#E2E8F0] transition-colors cursor-pointer shadow-2xs"
            title="Switch between Student and Admin portals"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span className="hidden sm:inline">Switch portal</span>
          </button>

          <button
            onClick={() => {
              setCurrentRole('portal-select');
              showToast('Signed Out', 'You have been returned to portal selection.');
            }}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      {/* Body: Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar
          currentPage={adminPage}
          onNavigate={(page) => setAdminPage(page)}
          onLogout={() => setCurrentRole('portal-select')}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={adminPage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {adminPage === 'overview' && (
                <AdminOverview
                  students={students}
                  assessments={assessments}
                  batches={batches}
                  onSelectStudent={(std) => {
                    setSelectedAdminStudent(std);
                    setAdminPage('student-detail');
                  }}
                  onNavigate={(page) => setAdminPage(page)}
                />
              )}

              {adminPage === 'pdf-materials' && (
                <PdfManagement
                  documents={pdfDocuments}
                  batches={batches}
                  students={students}
                  onSaveDocument={handleSavePdfDocument}
                  onDeleteDocument={handleDeletePdfDocument}
                  showToast={showToast}
                />
              )}

              {adminPage === 'papers' && (
                <PaperManagement
                  papers={papers}
                  submissions={examSubmissions}
                  batches={batches}
                  students={students}
                  onSavePaper={handleSavePaper}
                  onDeletePaper={handleDeletePaper}
                  onOpenSubmissions={handleOpenSubmissionsReview}
                  onToggleReleaseResults={handleToggleReleaseResults}
                  onNavigate={(page) => setAdminPage(page)}
                />
              )}

              {adminPage === 'review-submission' && (
                <ExamSubmissionsReview
                  paper={selectedReviewPaper}
                  submissions={examSubmissions.filter((s) => s.paperId === selectedReviewPaper.id)}
                  onBack={() => setAdminPage('papers')}
                  onUpdateSubmission={handleUpdateExamSubmission}
                  onToggleReleaseResults={handleToggleReleaseResults}
                />
              )}

              {adminPage === 'students' && (
                <StudentManagement
                  students={students}
                  batches={batches}
                  onSelectStudent={(std) => {
                    setSelectedAdminStudent(std);
                    setAdminPage('student-detail');
                  }}
                  onNavigate={(page) => setAdminPage(page)}
                />
              )}

              {adminPage === 'student-detail' && (
                <StudentDetail
                  student={selectedAdminStudent}
                  projects={projects}
                  assessments={assessments}
                  history={history}
                  onBack={() => setAdminPage('students')}
                  onNavigate={(page) => setAdminPage(page)}
                  onSaveFacultyNotes={handleSaveFacultyNotes}
                  showToast={showToast}
                />
              )}

              {adminPage === 'batches' && <BatchesManagement batches={batches} />}

              {adminPage === 'assessments' && (
                <AssessmentsList
                  assessments={assessments}
                  onUpdateAssessment={handleUpdateAssessment}
                  showToast={showToast}
                />
              )}

              {adminPage === 'previva' && (
                <PreVivaEvaluation
                  students={students}
                  projects={projects}
                  assessments={assessments}
                  onUpdateAssessment={handleUpdateAssessment}
                  showToast={showToast}
                />
              )}

              {adminPage === 'reports' && (
                <ReportsView
                  students={students}
                  assessments={assessments}
                  batches={batches}
                  showToast={showToast}
                />
              )}

              {adminPage === 'settings' && (
                <AdminSettings
                  onLogout={() => setCurrentRole('portal-select')}
                  showToast={showToast}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Toast toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
