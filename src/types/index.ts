export type PortalRole = 'portal-select' | 'student-login' | 'admin-login' | 'student' | 'admin';

export type StudentPage =
  | 'overview'
  | 'projects'
  | 'project-detail'
  | 'practice'
  | 'results'
  | 'history'
  | 'performance'
  | 'exams'
  | 'take-exam'
  | 'settings';

export type AdminPage =
  | 'overview'
  | 'pdf-materials'
  | 'students'
  | 'student-detail'
  | 'batches'
  | 'assessments'
  | 'papers'
  | 'review-submission'
  | 'previva'
  | 'reports'
  | 'settings';

export type ReadinessStatus = 'Ready' | 'Needs Practice' | 'Marginal';

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  department: string;
  batch: string;
  completedSessions: number;
  codeUnderstandingScore: number;
  speakingDeliveryScore: number;
  readinessStatus: ReadinessStatus;
  lastActivity: string;
}

export interface ProjectModule {
  name: string;
  description: string;
  fileCount: number;
  keyFiles: string[];
}

export interface KeyFunction {
  name: string;
  file: string;
  purpose: string;
  complexity: string;
}

export interface ApiRoute {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  description: string;
}

export interface DatabaseAuthConcept {
  concept: string;
  implementation: string;
  rationale: string;
}

export interface PotentialTopic {
  topic: string;
  reason: string;
  riskLevel: 'High' | 'Medium' | 'Low';
}

export interface Project {
  id: string;
  title: string;
  repoUrl: string;
  language: string;
  branch: string;
  status: 'Analysed' | 'Analysing' | 'Pending';
  lastAnalyzed: string;
  description: string;
  architectureOverview: string;
  techStack?: string[];
  modules: ProjectModule[];
  keyFunctions: KeyFunction[];
  apiRoutes: ApiRoute[];
  databaseAndAuth: DatabaseAuthConcept[];
  potentialTopics: PotentialTopic[];
}

export type InterviewMode = 'standard' | 'trap-hint' | 'break-it';

export interface InterviewQuestion {
  id: string;
  projectId: string;
  mode: InterviewMode;
  questionNumber: number;
  questionText: string;
  category: string;
  contextSnippet?: string;
  trapHint?: string;
  isTrapCorrect?: boolean;
  bugSnippet?: string;
  sampleAnswer: string;
  evaluationCriteria: string;
}

export interface SubmittedAnswer {
  questionId: string;
  questionText: string;
  mode: InterviewMode;
  studentAnswer: string;
  feedback: string;
  codeUnderstandingScore: number;
  speakingDeliveryScore: number;
  trapHandledCorrectly?: boolean;
}

export interface InterviewResult {
  id: string;
  studentId: string;
  projectId: string;
  projectTitle: string;
  date: string;
  mode: InterviewMode;
  overallScore: number;
  codeUnderstandingScore: number;
  speakingDeliveryScore: number;
  questionsAnswered: number;
  totalQuestions: number;
  strengths: string[];
  areasToImprove: string[];
  recommendedPracticeTopics: string[];
  answers: SubmittedAnswer[];
  deliveryMetrics: {
    structure: string;
    pace: string;
    pauses: string;
    fillerWords: string;
  };
}

export interface Assessment {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  batch: string;
  projectTitle: string;
  type: string;
  completionDate: string;
  score: number;
  codeUnderstanding: number;
  speakingDelivery: number;
  reviewStatus: 'Pending Review' | 'Faculty Reviewed';
  facultyNotes?: string;
  reviewedBy?: string;
  questionSummary: string;
  studentResponseSnippet: string;
  aiEvaluationSummary: string;
}

export interface Batch {
  id: string;
  name: string;
  department: string;
  totalStudents: number;
  completedAssessments: number;
  averageReadiness: number;
  needsPracticeCount: number;
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning';
}

export type ExamLanguage = 'cpp' | 'java' | 'python' | 'javascript';

export interface ExamTestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
  marks: number;
  explanation?: string;
}

export interface ExamQuestion {
  id: string;
  title: string;
  marks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category?: string;
  contextSnippet?: string;
  sampleAnswer?: string;
  problemStatement: string;
  constraints: string[];
  sampleInputsOutputs: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  testCases: ExamTestCase[];
  supportedLanguages: ExamLanguage[];
  starterCode: Record<ExamLanguage, string>;
}

export type PaperStatus = 'draft' | 'scheduled' | 'published' | 'completed';

export interface ExamPaper {
  id: string;
  name: string;
  subject: string;
  batch: string;
  assignedBatches: string[];
  assignedStudentIds?: string[];
  totalMarks: number;
  durationMinutes: number;
  examDate: string;
  startTime: string;
  endTime: string;
  status: PaperStatus;
  questions: ExamQuestion[];
  createdDate: string;
  createdBy: string;
  pdfSourceFileName?: string;
  resultsReleased: boolean;
  instructions?: string[];
}

export interface ProctorAlert {
  id: string;
  timestamp: string;
  type: 'tab_switch' | 'face_missing' | 'multiple_faces' | 'fullscreen_exit';
  severity: 'low' | 'medium' | 'high';
  message: string;
}

export interface QuestionAnswerSubmission {
  questionId: string;
  language: ExamLanguage;
  code: string;
  testCasesPassed: number;
  totalTestCases: number;
  score: number;
  runtimeMs: number;
  memoryMb: number;
  facultyFeedback?: string;
}

export interface ExamSubmission {
  id: string;
  paperId: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  batch: string;
  submittedAt: string;
  timeSpentSeconds: number;
  autoScore: number;
  manualMarksOverride?: number;
  finalScore: number;
  totalMarks: number;
  status: 'submitted' | 'evaluating' | 'reviewed';
  proctorAlerts: ProctorAlert[];
  answers: QuestionAnswerSubmission[];
  facultyNotes?: string;
  evaluatedBy?: string;
  evaluationDate?: string;
}

export type TargetAssignmentType = 'batch' | 'class' | 'student';

export interface AssignedPdfDocument {
  id: string;
  title: string;
  subject: string;
  fileName: string;
  fileSize: string;
  pageCount: number;
  uploadedAt: string;
  status: 'Processing' | 'Ready' | 'Failed';
  extractedText: string;
  summary: string;
  keyTopics: string[];
  targetType: TargetAssignmentType;
  assignedBatches: string[];
  assignedClass: string;
  assignedStudentIds: string[];
  createdBy: string;
}

export interface InterviewQuestionItem {
  id: string;
  questionNumber: number;
  questionText: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  contextSnippet?: string;
  studentAnswer?: string;
  answeredAt?: string;
  followUpQuestion?: string;
  studentFollowUpAnswer?: string;
  followUpAnsweredAt?: string;
  score?: number;
  feedback?: string;
  modelAnswer?: string;
}

export interface AnswerCorrection {
  questionNumber: number;
  questionText: string;
  studentResponse: string;
  studentFollowUpResponse?: string;
  critique: string;
  modelAnswer: string;
  groundedSourceTip: string;
  score: number;
}

export interface CoachingReport {
  overallScore: number;
  technicalUnderstandingScore: number;
  speakingDeliveryScore: number;
  documentGroundingScore: number;
  strengths: string[];
  weaknesses: string[];
  answerCorrections: AnswerCorrection[];
  improvementTips: string[];
  recommendedStudyTopics: string[];
  deliveryMetrics: {
    wordsPerMinute: number;
    cadence: string;
    fillerWords: string;
    articulationClarity: string;
  };
}

export interface FirebaseInterviewSession {
  id: string;
  pdfDocumentId: string;
  pdfTitle: string;
  pdfSubject: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  studentBatch: string;
  startedAt: string;
  completedAt: string;
  status: 'completed' | 'in-progress';
  questions: InterviewQuestionItem[];
  coachingReport: CoachingReport;
  savedToFirebase?: boolean;
}


