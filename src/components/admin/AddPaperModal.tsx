import React, { useState } from 'react';
import {
  X,
  Upload,
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Clock,
  Code2,
  Sparkles,
  Eye,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { ExamPaper, ExamQuestion, ExamTestCase, ExamLanguage } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface AddPaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePaper: (paper: ExamPaper) => void;
  existingPaper?: ExamPaper | null;
  availableBatches: string[];
}

export const AddPaperModal: React.FC<AddPaperModalProps> = ({
  isOpen,
  onClose,
  onSavePaper,
  existingPaper,
  availableBatches,
}) => {
  const [tab, setTab] = useState<'manual' | 'pdf'>('pdf');
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [pdfFileName, setPdfFileName] = useState(existingPaper?.pdfSourceFileName || '');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Form State
  const [name, setName] = useState(existingPaper?.name || '');
  const [subject, setSubject] = useState(existingPaper?.subject || '');
  const [assignedBatches, setAssignedBatches] = useState<string[]>(
    existingPaper?.assignedBatches || ['2026 CS-A']
  );
  const [durationMinutes, setDurationMinutes] = useState(existingPaper?.durationMinutes || 60);
  const [examDate, setExamDate] = useState(existingPaper?.examDate || 'Oct 30, 2026');
  const [startTime, setStartTime] = useState(existingPaper?.startTime || '10:00 AM');
  const [endTime, setEndTime] = useState(existingPaper?.endTime || '11:00 AM');
  const [instructions, setInstructions] = useState<string[]>(
    existingPaper?.instructions || [
      'Proctoring is active: Fullscreen mode, webcam validation, and window focus tracking are enforced.',
      'You may write and run solutions in C++, Java, Python 3, or JavaScript.',
      'Partial marks are awarded based on automated test cases passed.',
      'Submissions are final once submitted or when the examination timer reaches 00:00.',
    ]
  );

  // Questions State
  const [questions, setQuestions] = useState<ExamQuestion[]>(
    existingPaper?.questions || [
      {
        id: `q-${Date.now()}-1`,
        title: 'Two Sum with Frequency Inversion',
        marks: 25,
        difficulty: 'Medium',
        problemStatement:
          'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may not use the same element twice. Optimize for O(N) runtime and handle duplicate values safely.',
        constraints: [
          '2 <= nums.length <= 10^4',
          '-10^9 <= nums[i] <= 10^9',
          '-10^9 <= target <= 10^9',
          'Exactly one valid answer exists.',
        ],
        sampleInputsOutputs: [
          {
            input: 'nums = [2,7,11,15], target = 9',
            output: '[0, 1]',
            explanation: 'nums[0] + nums[1] == 9, return [0, 1].',
          },
          {
            input: 'nums = [3,2,4], target = 6',
            output: '[1, 2]',
            explanation: 'nums[1] + nums[2] == 6, return [1, 2].',
          },
        ],
        testCases: [
          {
            id: 'tc-1',
            input: 'nums = [2,7,11,15], target = 9',
            expectedOutput: '[0, 1]',
            isHidden: false,
            marks: 10,
            explanation: 'Basic positive pair',
          },
          {
            id: 'tc-2',
            input: 'nums = [3,3], target = 6',
            expectedOutput: '[0, 1]',
            isHidden: true,
            marks: 15,
            explanation: 'Duplicate numbers check',
          },
        ],
        supportedLanguages: ['python', 'cpp', 'java', 'javascript'],
        starterCode: {
          python: 'def twoSum(nums: list[int], target: int) -> list[int]:\n    # Implement O(N) hash map solution\n    return []\n',
          cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        return {};\n    }\n};',
          java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[0];\n    }\n}',
          javascript: 'function twoSum(nums, target) {\n    return [];\n}',
        },
      },
    ]
  );

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  if (!isOpen) return null;

  const totalCalculatedMarks = questions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);

  const handleSimulatePdfUpload = (presetName: string) => {
    setIsParsingPdf(true);
    setPdfFileName(presetName);

    setTimeout(() => {
      setName('Semester VII Data Structures & Advanced Graph Algorithms Examination');
      setSubject('Data Structures & Algorithms (CS701)');
      setAssignedBatches(['2026 CS-A', '2026 CS-B']);
      setDurationMinutes(60);
      setExamDate('Oct 30, 2026');
      setStartTime('10:00 AM');
      setEndTime('11:00 AM');

      setQuestions([
        {
          id: `q-ext-1`,
          title: 'Shortest Path in Directed Acyclic Graph with Topological Sort',
          marks: 25,
          difficulty: 'Medium',
          problemStatement:
            'Given a Directed Acyclic Graph (DAG) with N vertices and M weighted edges, find the shortest path from a given source vertex S to all other vertices. If a vertex is unreachable, output -1. Implement an O(V + E) time complexity solution utilizing topological ordering.',
          constraints: [
            '1 <= V <= 10^4',
            '0 <= E <= 5 * 10^4',
            'Edge weights: -100 <= weight <= 100',
            'The input graph is guaranteed to be a Directed Acyclic Graph (DAG).',
          ],
          sampleInputsOutputs: [
            {
              input: 'V = 6, E = 7, S = 0, edges = [[0,1,2], [0,4,1], [1,2,3], [4,2,2], [4,5,4], [2,3,6], [5,3,1]]',
              output: '[0, 2, 3, 6, 1, 5]',
              explanation:
                'Shortest distances from vertex 0 to [0,1,2,3,4,5] are respectively 0, 2, 3, 6, 1, 5.',
            },
          ],
          testCases: [
            {
              id: 'tc-dag-1',
              input: 'V=6, E=7, S=0, standard DAG',
              expectedOutput: '[0, 2, 3, 6, 1, 5]',
              isHidden: false,
              marks: 10,
              explanation: 'Sample evaluation testcase',
            },
            {
              id: 'tc-dag-2',
              input: 'V=4, E=2, Disconnected nodes test',
              expectedOutput: '[0, -1, 4, -1]',
              isHidden: true,
              marks: 15,
              explanation: 'Unreachable nodes must return -1',
            },
          ],
          supportedLanguages: ['python', 'cpp', 'java', 'javascript'],
          starterCode: {
            python:
              'def shortestPathDAG(V: int, edges: list[list[int]], src: int) -> list[int]:\n    # Topological sort & relaxation\n    dist = [float("inf")] * V\n    dist[src] = 0\n    return dist\n',
            cpp:
              '#include <vector>\nusing namespace std;\n\nvector<int> shortestPathDAG(int V, vector<vector<int>>& edges, int src) {\n    return vector<int>(V, -1);\n}',
            java:
              'import java.util.*;\n\nclass Solution {\n    public int[] shortestPathDAG(int V, int[][] edges, int src) {\n        return new int[V];\n    }\n}',
            javascript:
              'function shortestPathDAG(V, edges, src) {\n    return new Array(V).fill(-1);\n}',
          },
        },
        {
          id: `q-ext-2`,
          title: 'Minimum Cost Network Connectivity (MST Kruskal or Prim)',
          marks: 25,
          difficulty: 'Hard',
          problemStatement:
            'You are building a high-speed fiber network connecting N servers labeled 0 to N-1. You are given a list of possible bidirectional fiber connections where edges[i] = [u, v, cost]. Determine the minimum total cost to make all servers mutually reachable, or return -1 if impossible.',
          constraints: [
            '1 <= N <= 1000',
            '1 <= edges.length <= 10^4',
            '1 <= cost <= 10^6',
          ],
          sampleInputsOutputs: [
            {
              input: 'N = 4, edges = [[0,1,1], [1,2,2], [2,3,3], [0,3,4], [1,3,5]]',
              output: '6',
              explanation: 'Optimal spanning tree uses edges (0,1), (1,2), and (2,3) with sum 1 + 2 + 3 = 6.',
            },
          ],
          testCases: [
            {
              id: 'tc-mst-1',
              input: 'N = 4, 5 connected edges',
              expectedOutput: '6',
              isHidden: false,
              marks: 10,
              explanation: 'Basic MST testcase',
            },
            {
              id: 'tc-mst-2',
              input: 'N = 5, isolated node',
              expectedOutput: '-1',
              isHidden: true,
              marks: 15,
              explanation: 'Disconnected graph must return -1',
            },
          ],
          supportedLanguages: ['python', 'cpp', 'java', 'javascript'],
          starterCode: {
            python:
              'def minNetworkCost(N: int, edges: list[list[int]]) -> int:\n    # Use Kruskal Disjoint Set or Prim Heap\n    return 0\n',
            cpp:
              '#include <vector>\nusing namespace std;\n\nint minNetworkCost(int N, vector<vector<int>>& edges) {\n    return 0;\n}',
            java:
              'class Solution {\n    public int minNetworkCost(int N, int[][] edges) {\n        return 0;\n    }\n}',
            javascript:
              'function minNetworkCost(N, edges) {\n    return 0;\n}',
          },
        },
      ]);
      setIsParsingPdf(false);
      setTab('manual'); // switch to review mode so faculty can inspect
    }, 1200);
  };

  const handleAddQuestion = () => {
    const newQ: ExamQuestion = {
      id: `q-${Date.now()}`,
      title: `Coding Question ${questions.length + 1}`,
      marks: 20,
      difficulty: 'Medium',
      problemStatement: 'Enter question problem description here...',
      constraints: ['1 <= N <= 10^5'],
      sampleInputsOutputs: [{ input: 'sample_input', output: 'sample_output' }],
      testCases: [
        {
          id: `tc-${Date.now()}-1`,
          input: 'sample_input',
          expectedOutput: 'sample_output',
          isHidden: false,
          marks: 10,
        },
        {
          id: `tc-${Date.now()}-2`,
          input: 'edge_input',
          expectedOutput: 'edge_output',
          isHidden: true,
          marks: 10,
        },
      ],
      supportedLanguages: ['python', 'cpp', 'java', 'javascript'],
      starterCode: {
        python: 'def solve():\n    pass\n',
        cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    return 0;\n}',
        java: 'class Solution {\n    public void solve() {}\n}',
        javascript: 'function solve() {}\n',
      },
    };
    setQuestions((prev) => [...prev, newQ]);
    setActiveQuestionIndex(questions.length);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 1) return;
    const nextQ = questions.filter((_, i) => i !== idx);
    setQuestions(nextQ);
    setActiveQuestionIndex(Math.max(0, idx - 1));
  };

  const handleSave = (status: 'draft' | 'scheduled' | 'published') => {
    if (!name.trim()) {
      alert('Please provide an Examination Name');
      return;
    }
    if (!subject.trim()) {
      alert('Please provide a Subject Name & Code');
      return;
    }
    if (assignedBatches.length === 0) {
      alert('Please select at least one assigned Class or Batch');
      return;
    }
    if (questions.length === 0) {
      alert('Please include at least one coding question in the paper');
      return;
    }

    const newPaper: ExamPaper = {
      id: existingPaper?.id || `paper-${Date.now()}`,
      name,
      subject,
      batch: assignedBatches[0],
      assignedBatches,
      totalMarks: totalCalculatedMarks,
      durationMinutes,
      examDate,
      startTime,
      endTime,
      status,
      questions,
      createdDate: existingPaper?.createdDate || 'Oct 29, 2026',
      createdBy: existingPaper?.createdBy || 'Dr. Marcus Vance (Admin)',
      pdfSourceFileName: pdfFileName || undefined,
      resultsReleased: existingPaper?.resultsReleased || false,
      instructions,
    };

    onSavePaper(newPaper);
    onClose();
  };

  const currentQ = questions[activeQuestionIndex] || questions[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#0f2336]/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Main Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25 }}
        className="relative bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] w-full max-w-5xl max-h-[92vh] flex flex-col z-10 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F5F8FC] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#183653] text-white flex items-center justify-center shadow-xs">
              <Code2 className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#172033]">
                {existingPaper ? 'Edit Coding Examination Paper' : 'Add New Coding Examination Paper'}
              </h2>
              <p className="text-xs text-[#64748B]">
                Configure official questions, automated testcases, proctoring, and batch allocation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreviewModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#183653] bg-white border border-[#CBD5E1] rounded-lg hover:bg-[#F1F5F9] cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>Preview Paper</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#64748B] hover:text-[#172033] hover:bg-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#E2E8F0] px-6 bg-white shrink-0">
          <button
            onClick={() => setTab('pdf')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              tab === 'pdf'
                ? 'border-[#3B82F6] text-[#183653]'
                : 'border-transparent text-[#64748B] hover:text-[#172033]'
            }`}
          >
            <Upload className="w-4 h-4 text-[#3B82F6]" />
            <span>Upload Question Paper (PDF / AI OCR)</span>
          </button>
          <button
            onClick={() => setTab('manual')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              tab === 'manual'
                ? 'border-[#3B82F6] text-[#183653]'
                : 'border-transparent text-[#64748B] hover:text-[#172033]'
            }`}
          >
            <FileText className="w-4 h-4 text-[#14B8A6]" />
            <span>Questions & Test Cases Editor ({questions.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {tab === 'pdf' ? (
            <div className="space-y-6">
              {/* PDF Dropzone */}
              <div className="border-2 border-dashed border-[#CBD5E1] hover:border-[#3B82F6] bg-[#F8FAFC] rounded-2xl p-8 text-center transition-colors">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#EAF4FF] text-[#3B82F6] flex items-center justify-center mb-3">
                  <Upload className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-[#172033]">
                  Upload University Question Paper (PDF)
                </h3>
                <p className="text-xs text-[#64748B] max-w-md mx-auto mt-1 mb-4">
                  Codexa parses question statements, constraints, sample I/O, and marks structure directly into live coding test suites.
                </p>

                {isParsingPdf ? (
                  <div className="max-w-xs mx-auto py-3">
                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#254B70] mb-2">
                      <Sparkles className="w-4 h-4 text-[#14B8A6] animate-spin" />
                      <span>Parsing questions, constraints, and test suites...</span>
                    </div>
                    <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-linear-to-r from-[#3B82F6] to-[#14B8A6]"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.1 }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => handleSimulatePdfUpload('CS701_Algorithms_Midterm_Paper_2026.pdf')}
                      className="px-4 py-2.5 bg-[#183653] hover:bg-[#254B70] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                      <span>Simulate Upload: CS701_Algorithms_Paper.pdf</span>
                    </button>
                    <label className="px-4 py-2.5 bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#172033] text-xs font-semibold rounded-lg shadow-xs cursor-pointer inline-flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#64748B]" />
                      <span>Browse Local PDF</span>
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleSimulatePdfUpload(file.name);
                        }}
                      />
                    </label>
                  </div>
                )}
              </div>

              {pdfFileName && (
                <div className="bg-[#EAF4FF] border border-[#BFDBFE] rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#2563EB]" />
                    <div>
                      <p className="text-xs font-bold text-[#1E3A8A]">{pdfFileName}</p>
                      <p className="text-[11px] text-[#3B82F6]">Parsed into {questions.length} coding questions with 4 automated testcases</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setTab('manual')}
                    className="text-xs font-semibold text-[#1E40AF] hover:underline cursor-pointer"
                  >
                    Inspect & Edit Questions &rarr;
                  </button>
                </div>
              )}
            </div>
          ) : null}

          {/* Paper Metadata Form */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#183653] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#3B82F6]" />
              <span>Examination Schedule & Target Batches</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Examination Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Semester VII Core Algorithms Coding Examination"
                  className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Subject Name & Code *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Data Structures & Algorithms (CS701)"
                  className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Assigned Classes / Batches *
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {availableBatches.map((batch) => {
                    const isSelected = assignedBatches.includes(batch);
                    return (
                      <button
                        key={batch}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            if (assignedBatches.length > 1) {
                              setAssignedBatches(assignedBatches.filter((b) => b !== batch));
                            }
                          } else {
                            setAssignedBatches([...assignedBatches, batch]);
                          }
                        }}
                        className={`px-2.5 py-1 text-xs rounded-md border font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#183653] text-white border-[#183653]'
                            : 'bg-[#F8FAFC] text-[#64748B] border-[#CBD5E1] hover:border-[#94A3B8]'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {batch}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1">
                    Duration (Min)
                  </label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    min={15}
                    max={240}
                    className="w-full px-2.5 py-2 text-xs border border-[#CBD5E1] rounded-lg outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1">
                    Exam Date
                  </label>
                  <input
                    type="text"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-[#CBD5E1] rounded-lg outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1">
                    Window Time
                  </label>
                  <input
                    type="text"
                    value={`${startTime} - ${endTime}`}
                    onChange={(e) => {
                      const parts = e.target.value.split('-');
                      if (parts[0]) setStartTime(parts[0].trim());
                      if (parts[1]) setEndTime(parts[1].trim());
                    }}
                    className="w-full px-2.5 py-2 text-xs border border-[#CBD5E1] rounded-lg outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] text-xs">
              <span className="text-[#64748B]">
                Total Paper Marks:{' '}
                <strong className="text-[#172033]">{totalCalculatedMarks} Marks</strong> across {questions.length} questions
              </span>
              <span className="text-[#14B8A6] font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Auto-timed examination lock enabled
              </span>
            </div>
          </div>

          {/* Question Builder Workspace */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
              <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-[70%]">
                {questions.map((q, idx) => (
                  <button
                    key={q.id || idx}
                    onClick={() => setActiveQuestionIndex(idx)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors shrink-0 cursor-pointer ${
                      activeQuestionIndex === idx
                        ? 'bg-[#183653] text-white'
                        : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                    }`}
                  >
                    Q{idx + 1} ({q.marks}M)
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="px-3 py-1.5 bg-[#EAF4FF] text-[#2563EB] hover:bg-[#DBEAFE] text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Question</span>
                </button>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(activeQuestionIndex)}
                    className="p-1.5 text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg cursor-pointer"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Active Question Fields */}
            {currentQ && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#172033] mb-1">
                      Question Title *
                    </label>
                    <input
                      type="text"
                      value={currentQ.title}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[activeQuestionIndex].title = e.target.value;
                        setQuestions(updated);
                      }}
                      className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg outline-hidden"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#172033] mb-1">
                        Marks
                      </label>
                      <input
                        type="number"
                        value={currentQ.marks}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[activeQuestionIndex].marks = Number(e.target.value);
                          setQuestions(updated);
                        }}
                        className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#172033] mb-1">
                        Difficulty
                      </label>
                      <select
                        value={currentQ.difficulty}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[activeQuestionIndex].difficulty = e.target.value as any;
                          setQuestions(updated);
                        }}
                        className="w-full px-2 py-2 text-xs border border-[#CBD5E1] rounded-lg outline-hidden bg-white"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1">
                    Problem Statement
                  </label>
                  <textarea
                    rows={4}
                    value={currentQ.problemStatement}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[activeQuestionIndex].problemStatement = e.target.value;
                      setQuestions(updated);
                    }}
                    className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg outline-hidden font-sans"
                  />
                </div>

                {/* Constraints & Supported Languages */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#172033] mb-1">
                      Constraints (one per line)
                    </label>
                    <textarea
                      rows={3}
                      value={currentQ.constraints.join('\n')}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[activeQuestionIndex].constraints = e.target.value
                          .split('\n')
                          .filter((c) => c.trim().length > 0);
                        setQuestions(updated);
                      }}
                      className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg outline-hidden font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#172033] mb-1">
                      Supported Programming Languages
                    </label>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {(['python', 'cpp', 'java', 'javascript'] as ExamLanguage[]).map((lang) => {
                        const isSupported = currentQ.supportedLanguages.includes(lang);
                        return (
                          <label
                            key={lang}
                            className={`flex items-center gap-2 px-3 py-2 text-xs rounded-lg border cursor-pointer ${
                              isSupported ? 'bg-[#EAF4FF] border-[#3B82F6]' : 'border-[#CBD5E1] bg-white'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSupported}
                              onChange={(e) => {
                                const updated = [...questions];
                                const currentLangs = updated[activeQuestionIndex].supportedLanguages;
                                if (e.target.checked) {
                                  updated[activeQuestionIndex].supportedLanguages = [
                                    ...currentLangs,
                                    lang,
                                  ];
                                } else if (currentLangs.length > 1) {
                                  updated[activeQuestionIndex].supportedLanguages = currentLangs.filter(
                                    (l) => l !== lang
                                  );
                                }
                                setQuestions(updated);
                              }}
                              className="accent-[#3B82F6]"
                            />
                            <span className="font-mono uppercase font-bold text-[11px]">{lang}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Test Cases List */}
                <div className="border border-[#E2E8F0] rounded-xl p-4 bg-[#F8FAFC] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#172033]">
                      Evaluation Test Cases ({currentQ.testCases.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...questions];
                        updated[activeQuestionIndex].testCases.push({
                          id: `tc-${Date.now()}`,
                          input: 'input',
                          expectedOutput: 'output',
                          isHidden: false,
                          marks: 5,
                        });
                        setQuestions(updated);
                      }}
                      className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
                    >
                      + Add Test Case
                    </button>
                  </div>

                  <div className="space-y-2">
                    {currentQ.testCases.map((tc, tcIdx) => (
                      <div
                        key={tc.id || tcIdx}
                        className="bg-white p-3 rounded-lg border border-[#CBD5E1] grid grid-cols-1 sm:grid-cols-12 gap-2 items-center text-xs"
                      >
                        <div className="sm:col-span-4">
                          <span className="text-[10px] text-[#64748B] block">Input</span>
                          <input
                            type="text"
                            value={tc.input}
                            onChange={(e) => {
                              const updated = [...questions];
                              updated[activeQuestionIndex].testCases[tcIdx].input = e.target.value;
                              setQuestions(updated);
                            }}
                            className="w-full px-2 py-1 font-mono text-[11px] border border-[#CBD5E1] rounded"
                          />
                        </div>
                        <div className="sm:col-span-4">
                          <span className="text-[10px] text-[#64748B] block">Expected Output</span>
                          <input
                            type="text"
                            value={tc.expectedOutput}
                            onChange={(e) => {
                              const updated = [...questions];
                              updated[activeQuestionIndex].testCases[tcIdx].expectedOutput =
                                e.target.value;
                              setQuestions(updated);
                            }}
                            className="w-full px-2 py-1 font-mono text-[11px] border border-[#CBD5E1] rounded"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-[10px] text-[#64748B] block">Marks</span>
                          <input
                            type="number"
                            value={tc.marks}
                            onChange={(e) => {
                              const updated = [...questions];
                              updated[activeQuestionIndex].testCases[tcIdx].marks = Number(
                                e.target.value
                              );
                              setQuestions(updated);
                            }}
                            className="w-full px-2 py-1 text-xs border border-[#CBD5E1] rounded"
                          />
                        </div>
                        <div className="sm:col-span-2 flex items-center justify-between pt-3 sm:pt-0">
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={tc.isHidden}
                              onChange={(e) => {
                                const updated = [...questions];
                                updated[activeQuestionIndex].testCases[tcIdx].isHidden =
                                  e.target.checked;
                                setQuestions(updated);
                              }}
                              className="accent-[#3B82F6]"
                            />
                            <span className="text-[10px] text-[#64748B]">Hidden</span>
                          </label>
                          {currentQ.testCases.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...questions];
                                updated[activeQuestionIndex].testCases = updated[
                                  activeQuestionIndex
                                ].testCases.filter((_, i) => i !== tcIdx);
                                setQuestions(updated);
                              }}
                              className="text-[#EF4444] hover:text-[#DC2626] p-1"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#F5F8FC] border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-[#64748B]">
            Assigned to: <strong className="text-[#172033]">{assignedBatches.join(', ')}</strong> ({durationMinutes} mins)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave('draft')}
              className="px-4 py-2.5 text-xs font-semibold text-[#183653] bg-white border border-[#CBD5E1] rounded-lg hover:bg-[#F1F5F9] cursor-pointer"
            >
              Save as Draft
            </button>
            <button
              onClick={() => handleSave('scheduled')}
              className="px-4 py-2.5 text-xs font-semibold text-[#0284C7] bg-[#E0F2FE] hover:bg-[#BAE6FD] rounded-lg cursor-pointer"
            >
              Schedule Paper
            </button>
            <button
              onClick={() => handleSave('published')}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#183653] hover:bg-[#254B70] rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-[#14B8A6]" />
              <span>Publish Examination</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white w-full max-w-3xl rounded-xl p-6 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl border border-[#CBD5E1]">
            <div className="border-b-2 border-[#183653] pb-4 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-[#254B70]">
                APEX INSTITUTE OF TECHNOLOGY &bull; DEPARTMENT OF COMPUTER ENGINEERING
              </p>
              <h3 className="text-base font-bold text-[#172033] mt-1">{name || 'Examination Paper'}</h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Subject: {subject} | Duration: {durationMinutes} Mins | Max Marks: {totalCalculatedMarks}
              </p>
            </div>

            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div key={q.id || idx} className="p-4 border border-[#E2E8F0] rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-[#172033]">
                      Q{idx + 1}. {q.title}
                    </h4>
                    <span className="text-xs font-semibold bg-[#EAF4FF] text-[#2563EB] px-2 py-0.5 rounded">
                      [{q.marks} Marks]
                    </span>
                  </div>
                  <p className="text-xs text-[#475569] leading-relaxed">{q.problemStatement}</p>
                  <div className="text-[11px] bg-[#F8FAFC] p-2.5 rounded font-mono text-[#334155]">
                    <strong>Sample Input:</strong> {q.sampleInputsOutputs[0]?.input}
                    <br />
                    <strong>Sample Output:</strong> {q.sampleInputsOutputs[0]?.output}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E2E8F0]">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 bg-[#183653] text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
