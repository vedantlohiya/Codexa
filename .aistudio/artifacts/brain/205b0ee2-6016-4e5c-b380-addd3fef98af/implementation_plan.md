# Maya AI Interview & PDF Knowledge Hub Integration

Comprehensive plan for integrating the **PDF Knowledge Hub** into Codexa Admin and the **Maya PDF-Based AI Interview** into Codexa Student, powered by server-side Gemini 3.8 Flash, dynamic 5-question technical viva, dual speech/text input, and the Maya Session Coaching Review.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were confirmed by the user during Phase 1:
>
> - **Brand Architecture**: **Codexa Admin** for the administrative management portal, **Codexa Student** for the student learning workspace, **Maya** as the autonomous AI technical interviewer, **PDF Knowledge Hub** as the administrative source repository, and **Maya Session Coaching Review** as the post-interview diagnostic report.
> - **Interview Structure**: Structured **5-question technical viva** with live, dynamic follow-up probing strictly grounded in the assigned PDF document (never generic or hallucinated questions).
> - **Input Modalities**: **Dual input** supporting both continuous speech-to-text microphone capture and an editable written response editor.
> - **Backend & AI Architecture**: Express server (`server.ts`) with server-side `@google/genai` using `gemini-3.8-flash` (`MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`) for PDF grounded interviewing and scoring, with local-first persistent storage so all documents, assignments, and sessions survive browser refreshes.

---

## 1. Overview & Core Concept

- **What It Does**:
  - **Admin — PDF Knowledge Hub**: Faculty can upload question papers, lecture modules, reference books, and technical project specifications (PDF format). The system extracts and indexes full-text content with clear processing states (*Processing*, *Ready*, *Failed*), and assigns documents to cohorts (e.g., `2026 CS-A`, `2026 IT-A`) or individual students.
  - **Student — Maya PDF-Based AI Interview**: Students access documents assigned exclusively to their batch. Selecting an assigned document launches Maya, an AI interviewer that conducts a 5-round spoken and written viva strictly grounded in the document's concepts, code patterns, and theoretical principles.
  - **Maya Session Coaching Review**: A comprehensive diagnostic summary evaluating the overall score (0–100), *What Went Well*, *Main Focus Next*, question-by-question critique, PDF-grounded model answers, grammar/delivery guidance, and recommended practice drills.
- **Target Persona**: Final-year engineering and computer science students preparing for campus placement technical rounds and faculty viva voce examinations, mentored by university placement coordinators.
- **Key Value**: Replaces subjective or surface-level project viva with verifiable, rigorous AI probing grounded directly in the student's actual documentation and course syllabus.

---

## 2. User Experience & Visual Design

- **Visual Direction & Palette**:
  - Dominant Main Background: `#FFFFFF`
  - Secondary Elevated Surface: `#F5F8FC`
  - Sidebar & Primary Identity: Deep Navy `#183653`, hover `#254B70`
  - Primary Action / Interactive Blue: `#3B82F6` (Light accent `#EAF4FF`)
  - Accent / Verification Teal: `#14B8A6` (Muted accent `#CCFBF1`)
  - Text: Primary `#172033`, Secondary `#64748B`, Subtle Borders `#E2E8F0`
- **Zero-Pill Discipline & Typography**:
  - Clean unboxed metadata with subtle typographical bullets (`·`) for document sizes, upload timestamps, and question counts.
  - Interactive filter controls (e.g., All Documents, Assigned, Ready) styled with clean segmented button controls.
  - Font hierarchy: High-legibility Inter display paired with monospace tabular figures (`font-mono tabular-nums`) for scores, timers, and extracted token counters.
- **Key User Flows**:
  1. *Admin Hub Flow*: Admin navigates to **PDF Knowledge Hub** &rarr; Uploads syllabus or question paper PDF (with simulated or live text extraction) &rarr; Assigns to `2026 CS-A` &rarr; Document badge switches to `Ready (Assigned)`.
  2. *Student Launch Flow*: Student logs in (e.g., Vedant Lohiya) &rarr; Clicks **PDF AI Interview** &rarr; Sees assigned documents with key concepts &rarr; Clicks **Start AI Interview with Maya**.
  3. *Maya Viva Room Flow*: Question 1 of 5 appears based on PDF text &rarr; Maya speaks question / prompt &rarr; Student speaks via microphone or types response &rarr; Maya generates contextual follow-up probing &rarr; Real-time speech cadence heuristics displayed &rarr; Advance through 5 questions &rarr; Click **Submit & Complete Viva**.
  4. *Coaching Report Flow*: Displays **Maya Session Coaching Review** modal and dedicated screen featuring radial score ring, actionable strengths, priority growth areas, grammar polish, and **Try Again** or **Finish & Save** actions.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Server-Side Gemini API Proxy**:
  - *Chosen Approach*: Route interview generation, answer evaluation, and coaching report generation through `/api/interview/*` endpoints in `server.ts` utilizing `gemini-3.8-flash` via `@google/genai` with `User-Agent: 'aistudio-build'`.
  - *Why*: Conforms strictly to AI Studio security rules (never expose API keys to the browser bundle) and enables server-side prompt engineering with strict ground-truth constraints on the extracted PDF text.
- **Decision 2: Document Ingestion & Text Extraction Pipeline**:
  - *Chosen Approach*: Support both direct PDF binary file upload with text extraction and curated sample departmental documents (e.g., Operating Systems, Distributed Systems, Algorithm Engineering).
  - *Why*: Guarantees instant, zero-friction demonstration during review while providing genuine file reading and parsing capability.
- **Decision 3: Dual Speech & Written Modality**:
  - *Chosen Approach*: Provide browser Web Speech API (`webkitSpeechRecognition` / `SpeechRecognition`) with visual waveform and live transcription directly into an editable response textarea.
  - *Why*: Accommodates candidates practicing spoken articulation for viva, while allowing keyboard edits for technical accuracy and code snippets.
- **Decision 4: Resilient Local Persistence**:
  - *Chosen Approach*: Maintain an integrated state layer synced with browser `localStorage`, ensuring uploaded PDFs, assigned cohorts, completed interviews, and coaching reports persist across reloads.
  - *Why*: Delivers immediate testability and offline resilience while maintaining multi-user cohort partitioning between Admin and Student logins.

---

## 4. Technical Architecture & Data Strategy

### System Component Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Codexa Platform                               │
│                                                                        │
│   ┌───────────────────────────┐      ┌─────────────────────────────┐   │
│   │   Admin Portal (Codexa)   │      │   Student Portal (Codexa)   │   │
│   │  - PDF Knowledge Hub      │      │  - Assigned PDF Hub         │   │
│   │  - Assign Cohorts         │      │  - Maya Viva Launcher       │   │
│   │  - OCR Text Inspector     │      │  - Performance Transcripts  │   │
│   └─────────────┬─────────────┘      └──────────────┬──────────────┘   │
│                 │                                   │                  │
│                 ▼                                   ▼                  │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │              Maya AI Interview Engine (Client)                 │   │
│   │  - Dynamic 5-Question Stepper & Live Follow-Up Manager         │   │
│   │  - Dual Input: Web Speech Recognition + Code/Text Editor       │   │
│   │  - Audio Heuristics (Cadence, Filler Words, Response Length)   │   │
│   │  - Maya Session Coaching Review Component                      │   │
│   └─────────────────────────────┬──────────────────────────────────┘   │
└─────────────────────────────────┼──────────────────────────────────────┘
                                  │ HTTPS Fetch
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  Express Full-Stack Server (server.ts)                 │
│                                                                        │
│   ┌───────────────────────┐             ┌──────────────────────────┐   │
│   │  /api/pdf/extract     │             │  /api/interview/generate │   │
│   │  - Text extraction    │             │  /api/interview/evaluate │   │
│   │  - Chunk indexing     │             │  /api/interview/report   │   │
│   └───────────────────────┘             └────────────┬─────────────┘   │
│                                                      │                 │
│                                                      ▼                 │
│                                         ┌──────────────────────────┐   │
│                                         │  Google GenAI SDK        │   │
│                                         │  Model: gemini-3.8-flash │   │
│                                         │  Strict PDF Grounding    │   │
│                                         └──────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Entities & Schema Extension

1. **`PdfDocument`**:
   - `id`: string
   - `title`: string
   - `subject`: string
   - `fileName`: string
   - `fileSize`: string
   - `uploadedAt`: string
   - `status`: `'Processing' | 'Ready' | 'Failed'`
   - `extractedText`: string
   - `summary`: string
   - `keyTopics`: string[]
   - `assignedBatches`: string[]
   - `assignedStudentIds`: string[]

2. **`MayaInterviewSession`**:
   - `id`: string
   - `pdfDocumentId`: string
   - `pdfTitle`: string
   - `studentId`: string
   - `studentName`: string
   - `startedAt`: string
   - `completedAt`: string
   - `status`: `'in-progress' | 'completed'`
   - `currentQuestionIndex`: number
   - `questions`: Array<{
     id: string;
     questionText: string;
     topic: string;
     difficulty: 'Easy' | 'Medium' | 'Hard';
     followUpPrompt?: string;
     studentAnswer?: string;
     score?: number;
     feedback?: string;
     correctExplanation?: string;
   }>
   - `coachingReport`: {
     overallScore: number;
     whatWentWell: string[];
     mainFocusNext: string[];
     grammarCorrections: Array<{ original: string; corrected: string; explanation: string }>;
     personalizedSteps: string[];
     recommendedPracticeQuestion: string;
   }

### Verification Plan

1. **Compilation & Linting**: Run `compile_applet` and `lint_applet` to verify zero TypeScript errors.
2. **Admin PDF Workflow**:
   - Upload new PDF / click sample document.
   - Verify *Processing* &rarr; *Ready* state transition.
   - Inspect extracted text and assign to batch `2026 CS-A`.
3. **Student AI Interview Workflow**:
   - Switch to Student Portal (Vedant Lohiya).
   - Verify assigned document appears in **PDF-Based AI Interview**.
   - Launch Maya AI Interview session.
   - Test speech mic toggle and text typing.
   - Advance through questions with dynamic follow-ups strictly grounded in the document.
4. **Coaching Review Verification**:
   - Complete 5-question interview.
   - Confirm Maya Session Coaching Review renders with overall score, *What Went Well*, *Main Focus Next*, corrections, and *Try Again*/*Finish* handlers.
