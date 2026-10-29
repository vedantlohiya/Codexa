import {
  Student,
  Project,
  InterviewQuestion,
  InterviewResult,
  Assessment,
  Batch,
  ExamPaper,
  ExamQuestion,
  ExamSubmission,
} from '../types';

export const initialStudents: Student[] = [
  {
    id: 'std-104',
    name: 'Vedant Lohiya',
    rollNumber: '2026CS104',
    email: 'vedant.lohiya@student.edu',
    department: 'Computer Science',
    batch: '2026 CS-A',
    completedSessions: 5,
    codeUnderstandingScore: 88,
    speakingDeliveryScore: 80,
    readinessStatus: 'Ready',
    lastActivity: '2 hours ago',
  },
  {
    id: 'std-108',
    name: 'Priya Shah',
    rollNumber: '2026CS108',
    email: 'priya.shah@student.edu',
    department: 'Computer Science',
    batch: '2026 CS-A',
    completedSessions: 4,
    codeUnderstandingScore: 92,
    speakingDeliveryScore: 88,
    readinessStatus: 'Ready',
    lastActivity: 'Yesterday',
  },
  {
    id: 'std-115',
    name: 'Rohan Mehta',
    rollNumber: '2026IT215',
    email: 'rohan.mehta@student.edu',
    department: 'Information Technology',
    batch: '2026 IT-A',
    completedSessions: 2,
    codeUnderstandingScore: 68,
    speakingDeliveryScore: 64,
    readinessStatus: 'Needs Practice',
    lastActivity: '3 days ago',
  },
  {
    id: 'std-122',
    name: 'Ananya Deshmukh',
    rollNumber: '2026CS122',
    email: 'ananya.d@student.edu',
    department: 'Computer Science',
    batch: '2026 CS-B',
    completedSessions: 3,
    codeUnderstandingScore: 74,
    speakingDeliveryScore: 71,
    readinessStatus: 'Marginal',
    lastActivity: '1 day ago',
  },
  {
    id: 'std-131',
    name: 'Aarav Sharma',
    rollNumber: '2026IT231',
    email: 'aarav.sharma@student.edu',
    department: 'Information Technology',
    batch: '2026 IT-A',
    completedSessions: 6,
    codeUnderstandingScore: 89,
    speakingDeliveryScore: 85,
    readinessStatus: 'Ready',
    lastActivity: '4 hours ago',
  },
  {
    id: 'std-140',
    name: 'Aisha Al-Mansoor',
    rollNumber: '2026CS140',
    email: 'aisha.m@student.edu',
    department: 'Computer Science',
    batch: '2026 CS-B',
    completedSessions: 1,
    codeUnderstandingScore: 61,
    speakingDeliveryScore: 59,
    readinessStatus: 'Needs Practice',
    lastActivity: '5 days ago',
  },
  {
    id: 'std-152',
    name: 'David Kim',
    rollNumber: '2026EC302',
    email: 'david.kim@student.edu',
    department: 'Electronics & Comm',
    batch: '2026 ECE-A',
    completedSessions: 3,
    codeUnderstandingScore: 78,
    speakingDeliveryScore: 75,
    readinessStatus: 'Ready',
    lastActivity: '2 days ago',
  },
  {
    id: 'std-164',
    name: 'Sneha Kulkarni',
    rollNumber: '2026IT244',
    email: 'sneha.k@student.edu',
    department: 'Information Technology',
    batch: '2026 IT-A',
    completedSessions: 4,
    codeUnderstandingScore: 83,
    speakingDeliveryScore: 80,
    readinessStatus: 'Ready',
    lastActivity: 'Yesterday',
  },
];

export const initialProjects: Project[] = [
  {
    id: 'proj-01',
    title: 'DevPulse: Task & Sprint Analytics',
    repoUrl: 'https://github.com/alexchen/devpulse-analytics',
    language: 'TypeScript / React / Node.js',
    branch: 'main',
    status: 'Analysed',
    lastAnalyzed: 'October 26, 2026',
    description:
      'A full-stack collaborative sprint forecasting and velocity analytics platform built for engineering managers and distributed teams.',
    architectureOverview:
      'Modular client-server architecture utilizing Next.js App Router for frontend presentation, Express-based REST API microservices, Redis for session caching and rate-limiting, and PostgreSQL for relational sprint telemetry with row-level security (RLS).',
    modules: [
      {
        name: 'Auth & RBAC Subsystem',
        description: 'Multi-tenant authentication with JWT refresh rotation and permission guards.',
        fileCount: 8,
        keyFiles: ['src/auth/jwt.strategy.ts', 'src/auth/rbac.guard.ts', 'src/middleware/session.ts'],
      },
      {
        name: 'Sprint Analytics Engine',
        description: 'Calculates burn-down charts, velocity decay, and Monte Carlo completion probability.',
        fileCount: 14,
        keyFiles: ['src/analytics/velocity.ts', 'src/analytics/monte-carlo.worker.ts', 'src/models/metric.ts'],
      },
      {
        name: 'Realtime Sync & Webhooks',
        description: 'Event-driven WebSocket listener for team card updates and GitHub commit triggers.',
        fileCount: 6,
        keyFiles: ['src/realtime/socket.handler.ts', 'src/webhooks/github.listener.ts'],
      },
      {
        name: 'Database Persistence Layer',
        description: 'PostgreSQL schema definitions, composite indexes, and optimistic concurrency controllers.',
        fileCount: 11,
        keyFiles: ['src/db/schema.prisma', 'src/db/migrations/2026_composite_idx.sql'],
      },
    ],
    keyFunctions: [
      {
        name: 'calculateSprintVelocity(teamId, windowSize)',
        file: 'src/analytics/velocity.ts',
        purpose: 'Aggregates finished story points over N previous cycles using exponential moving averages.',
        complexity: 'O(N log K) time with Redis caching',
      },
      {
        name: 'verifyAndRotateTokens(refreshToken)',
        file: 'src/auth/jwt.strategy.ts',
        purpose: 'Atomic refresh token exchange with Redis reuse detection and immediate family invalidation.',
        complexity: 'O(1) Redis multi-exec transaction',
      },
      {
        name: 'resolveConcurrentCardUpdate(cardId, clientVersion)',
        file: 'src/services/task.service.ts',
        purpose: 'Optimistic concurrency locking preventing overwrite when simultaneous updates occur.',
        complexity: 'O(1) with conditional SQL UPDATE WHERE version = v',
      },
    ],
    apiRoutes: [
      {
        method: 'POST',
        endpoint: '/api/v1/auth/exchange',
        description: 'Rotates refresh tokens and checks reuse revocation blacklist.',
      },
      {
        method: 'GET',
        endpoint: '/api/v1/analytics/burn-down',
        description: 'Streams day-by-day committed vs completed story points for active sprint.',
      },
      {
        method: 'PATCH',
        endpoint: '/api/v1/tasks/:id/status',
        description: 'Updates task column with version increment and audit event dispatch.',
      },
      {
        method: 'POST',
        endpoint: '/api/v1/webhooks/github',
        description: 'Receives signed webhook payloads from GitHub to link commits to task IDs.',
      },
    ],
    databaseAndAuth: [
      {
        concept: 'Optimistic Locking vs Pessimistic Locking',
        implementation: 'Added integer `version` column to `tasks` table. Updates execute with `WHERE version = current_version`.',
        rationale: 'Avoids costly long-held database row locks while cleanly rejecting stale overwrites.',
      },
      {
        concept: 'Refresh Token Family Rotation',
        implementation: 'Each issued refresh token stores a UUID family ID. If a previously consumed token is replayed, all tokens in the family are purged.',
        rationale: 'Mitigates token theft risks without forcing frequent user credential logins.',
      },
      {
        concept: 'Composite Indexing for Multi-Tenant Queries',
        implementation: 'Index on `(tenant_id, sprint_id, created_at DESC)`.',
        rationale: 'Ensures query planner performs index-only scans for high-frequency dashboard queries.',
      },
    ],
    potentialTopics: [
      {
        topic: 'Race Conditions in Card Reordering',
        reason: 'Interviewer will check if two concurrent users dragging cards causes duplicate position indexes.',
        riskLevel: 'High',
      },
      {
        topic: 'Monte Carlo Simulation Worker Architecture',
        reason: 'Evaluating whether CPU-bound calculations freeze the Node.js event loop.',
        riskLevel: 'High',
      },
      {
        topic: 'Tenant Isolation in PostgreSQL',
        reason: 'Checking whether tenant IDs are strictly filtered in ORM queries or enforced at the database level.',
        riskLevel: 'Medium',
      },
      {
        topic: 'Webhook Signature Verification',
        reason: 'Testing whether the raw buffer is used to verify HMAC SHA-256 signatures before parsing body.',
        riskLevel: 'Medium',
      },
    ],
  },
  {
    id: 'proj-02',
    title: 'NeuroRoute: Smart Logistics Routing',
    repoUrl: 'https://github.com/alexchen/neuroroute-engine',
    language: 'Python / FastAPI / Neo4j',
    branch: 'main',
    status: 'Analysed',
    lastAnalyzed: 'October 21, 2026',
    description:
      'A graph-powered multi-depot vehicle routing solver taking real-time traffic and delivery time windows into account.',
    architectureOverview:
      'FastAPI microservice executing Dijkstra and A* graph traversals over Neo4j spatial nodes with Celery workers for heavy genetic algorithm route optimization.',
    modules: [
      {
        name: 'Spatial Graph Ingestion',
        description: 'Parses OpenStreetMap graph topologies into Neo4j nodes and weighted road edges.',
        fileCount: 7,
        keyFiles: ['engine/osm_loader.py', 'engine/graph_builder.py'],
      },
      {
        name: 'Genetic Optimization Core',
        description: 'Solves capacitated vehicle routing problems with penalty scores for late arrivals.',
        fileCount: 9,
        keyFiles: ['solver/genetic_vrp.py', 'solver/fitness.py'],
      },
    ],
    keyFunctions: [
      {
        name: 'solve_capacitated_vrp(orders, vehicle_fleet)',
        file: 'solver/genetic_vrp.py',
        purpose: 'Runs 500 generations of crossover and mutation to minimize fuel expenditure.',
        complexity: 'NP-Hard approximation in O(G * P * V)',
      },
    ],
    apiRoutes: [
      {
        method: 'POST',
        endpoint: '/api/v1/routes/optimize',
        description: 'Submits an async VRP calculation task and returns a job tracking ID.',
      },
    ],
    databaseAndAuth: [
      {
        concept: 'Graph Database Edge Weighting',
        implementation: 'Dynamic edge weights updated via periodic congestion API feeds.',
        rationale: 'Relational joins are too slow for multi-hop pathfinding across 100k intersections.',
      },
    ],
    potentialTopics: [
      {
        topic: 'Graph Query Timeouts',
        reason: 'Evaluating memory limits during recursive graph expansion across cycles.',
        riskLevel: 'High',
      },
    ],
  },
  {
    id: 'proj-03',
    title: 'MediVault: Patient Records Portal',
    repoUrl: 'https://github.com/alexchen/medivault-ehr',
    language: 'Go / PostgreSQL / React',
    branch: 'main',
    status: 'Pending',
    lastAnalyzed: 'October 14, 2026',
    description:
      'HIPAA-compliant medical record auditing and patient consent delegation tool with AES-256 field-level encryption.',
    architectureOverview:
      'Go backend leveraging Gorm, Argon2id password hashing, field-level envelope encryption, and audit trail write-ahead logs.',
    modules: [
      {
        name: 'Audit Trail Engine',
        description: 'Immutable append-only record access log.',
        fileCount: 4,
        keyFiles: ['audit/logger.go', 'audit/verifier.go'],
      },
    ],
    keyFunctions: [
      {
        name: 'EncryptPatientPHI(patientRecord, dataKey)',
        file: 'crypto/envelope.go',
        purpose: 'Encrypts personal identifiable health information with unique per-record keys.',
        complexity: 'AES-GCM 256-bit encryption',
      },
    ],
    apiRoutes: [
      {
        method: 'GET',
        endpoint: '/api/v1/records/:id',
        description: 'Decrypts medical summary and writes immutable audit log entry.',
      },
    ],
    databaseAndAuth: [
      {
        concept: 'Append-Only Audit Logs',
        implementation: 'Cryptographically hashed chains linking every record read event.',
        rationale: 'Guarantees non-repudiation in healthcare compliance audits.',
      },
    ],
    potentialTopics: [
      {
        topic: 'Key Management & Rotation',
        reason: 'Explaining how compromised master keys are revoked without data loss.',
        riskLevel: 'High',
      },
    ],
  },
];

export const sampleQuestions: InterviewQuestion[] = [
  // STANDARD INTERVIEW QUESTIONS
  {
    id: 'q-std-01',
    projectId: 'proj-01',
    mode: 'standard',
    questionNumber: 1,
    questionText:
      'In your DevPulse project, walk me through how `calculateSprintVelocity()` avoids blocking the Node.js event loop when aggregating 50,000 historic task records.',
    category: 'Architecture & Concurrency',
    contextSnippet:
      '// File: src/analytics/velocity.ts\nexport async function calculateSprintVelocity(teamId: string, windowSize = 5) {\n  const cached = await redis.get(`velocity:${teamId}`);\n  if (cached) return JSON.parse(cached);\n  // Aggregation logic\n}',
    sampleAnswer:
      'Instead of pulling 50,000 raw rows into the Node.js V8 heap and running synchronous reduce/filter loops, the aggregation is pushed down directly into PostgreSQL using SUM() and AVG() window functions. For CPU-bound Monte Carlo forecasts, we offload the computation to a Node.js worker_thread, while high-frequency dashboard reads are cached in Redis with a 15-minute TTL.',
    evaluationCriteria:
      'Checks if the student understands database pushdown vs client heap saturation, worker threads for CPU work, and caching strategies.',
  },
  {
    id: 'q-std-02',
    projectId: 'proj-01',
    mode: 'standard',
    questionNumber: 2,
    questionText:
      'In your authentication layer, why did you decide on refresh token rotation backed by Redis instead of completely stateless JWTs?',
    category: 'Authentication & Security',
    contextSnippet:
      '// File: src/auth/jwt.strategy.ts\n// Stateless JWTs have an expiration of 15m.\n// Refresh tokens are single-use and assigned to a family UUID in Redis.',
    sampleAnswer:
      'Purely stateless JWTs cannot be revoked immediately if a user loses their laptop or a token is compromised before expiry. By pairing short-lived access tokens (15 minutes) with single-use refresh token rotation stored in Redis, we maintain high performance while enabling immediate revocation. If an already-used refresh token is replayed, our security guard detects reuse and purges the entire token family.',
    evaluationCriteria:
      'Tests knowledge of JWT revocation dilemmas, refresh token rotation mechanics, replay detection, and security tradeoffs.',
  },
  {
    id: 'q-std-03',
    projectId: 'proj-01',
    mode: 'standard',
    questionNumber: 3,
    questionText:
      'How does DevPulse handle concurrent updates when two developers change the status of the exact same task card at the same time?',
    category: 'Database & State Management',
    contextSnippet:
      '// File: src/services/task.service.ts\nUPDATE tasks\nSET status = $1, version = version + 1\nWHERE id = $2 AND version = $3;',
    sampleAnswer:
      'We implemented optimistic concurrency control. Each task has a numerical `version` column. When a client modifies a card, they submit their known version. The update query executes `UPDATE tasks SET status = $1, version = version + 1 WHERE id = $2 AND version = $expectedVersion`. If another request already changed it, the affected row count returns 0, and our API responds with a 409 Conflict, prompting the second user to refresh their view.',
    evaluationCriteria:
      'Verifies understanding of optimistic vs pessimistic locking, 409 Conflict handling, and database write hazards.',
  },

  // TRAP HINT ROUND QUESTIONS
  {
    id: 'q-trap-01',
    projectId: 'proj-01',
    mode: 'trap-hint',
    questionNumber: 1,
    questionText:
      'Your analytics query takes 420ms to run on large datasets. An interviewer tells you:\n"Why bother with complex composite database indexes? Why not simply remove the PostgreSQL indexes and fetch all 50,000 records to the client browser once on login, caching them in localStorage?"\n\nEvaluate this hint: Do you Accept or Challenge it, and why?',
    category: 'Architecture Tradeoffs & Traps',
    trapHint:
      'Interviewer suggestion: "Dump the database table into localStorage on user login and run JS filters in the browser."',
    isTrapCorrect: false,
    sampleAnswer:
      'I challenge this suggestion. First, storing 50,000 project records in localStorage would exceed the standard 5MB browser storage quota and crash the client. Second, caching full database records on the client exposes sensitive multi-tenant data, creating a severe data leakage risk. Third, client-cached data immediately goes stale when teammates push changes, breaking real-time collaboration. The correct solution is preserving the composite database index `(tenant_id, sprint_id, status)` and paginating results with database-level aggregations.',
    evaluationCriteria:
      'Tests whether the student can identify dangerous architectural traps, articulate browser storage limitations, and defend data security.',
  },
  {
    id: 'q-trap-02',
    projectId: 'proj-01',
    mode: 'trap-hint',
    questionNumber: 2,
    questionText:
      'During code review, a senior engineer says:\n"To speed up bulk task creation from CSV imports, we should temporarily disable all foreign key constraints and stitch together raw SQL strings without parameterization."\n\nDo you Accept or Challenge this recommendation?',
    category: 'Security & Integrity Traps',
    trapHint:
      'Interviewer suggestion: "Disable foreign keys and use raw unparameterized SQL string concatenation for speed."',
    isTrapCorrect: false,
    sampleAnswer:
      'I challenge this hint completely. Disabling foreign keys risks creating orphaned child records that corrupt relational integrity across sprints, projects, and users. More critically, string concatenation without parameterization leaves the application vulnerable to SQL Injection (SQLi) from malicious CSV input. The correct performance optimization is utilizing parameterized batch inserts like PostgreSQL `UNNEST` or `COPY FROM` within a single transaction, which achieves maximum ingestion throughput safely.',
    evaluationCriteria:
      'Checks whether the student catches SQL injection vulnerabilities and understands relational foreign key constraints.',
  },

  // BREAK IT ROUND QUESTIONS
  {
    id: 'q-break-01',
    projectId: 'proj-01',
    mode: 'break-it',
    questionNumber: 1,
    questionText:
      'Look at this cursor-based pagination query from your task list API. Under high concurrent write load, users report duplicate tasks appearing on page 2. What is causing this bug and how would you fix it?',
    category: 'Debugging & Edge Cases',
    bugSnippet:
      '// src/db/queries/tasks.ts\nexport async function getPaginatedTasks(sprintId: string, limit = 20, lastCreatedAt?: string) {\n  return db.query(`\n    SELECT id, title, created_at FROM tasks\n    WHERE sprint_id = $1\n      AND ($2::timestamp IS NULL OR created_at < $2)\n    ORDER BY created_at DESC\n    LIMIT $3\n  `, [sprintId, lastCreatedAt, limit]);\n}',
    sampleAnswer:
      'The bug is a non-deterministic tie-breaker in cursor pagination. If multiple tasks share the exact same `created_at` timestamp (which happens frequently during bulk creation or automated imports), the database engine cannot guarantee a stable ordering. Tasks with identical timestamps get skipped or duplicated between page 1 and page 2. The fix is introducing a unique tie-breaker in the cursor: `ORDER BY created_at DESC, id DESC` and checking `WHERE (created_at, id) < ($lastCreatedAt, $lastId)`.',
    evaluationCriteria:
      'Checks if the student understands cursor pagination pitfalls, timestamp collision bugs, and deterministic composite sorting.',
  },
  {
    id: 'q-break-02',
    projectId: 'proj-01',
    mode: 'break-it',
    questionNumber: 2,
    questionText:
      'In your webhook consumer service, GitHub occasionally returns HTTP 502 or sends the same webhook payload twice. Your server currently crashes with an unhandled rejection, or counts the commit points double. What two safeguards must you add?',
    category: 'Resilience & Idempotency',
    bugSnippet:
      '// src/webhooks/github.listener.ts\napp.post("/webhooks/github", async (req, res) => {\n  const payload = req.body;\n  await updateTaskCommitStats(payload.task_id, payload.commit_hash);\n  res.sendStatus(200);\n});',
    sampleAnswer:
      'First, we must enforce idempotency by storing processed webhook delivery IDs in Redis or a `processed_webhooks` database table with a unique constraint on `delivery_id` or `commit_hash`. If a duplicated delivery arrives, it is safely acknowledged with 200 without reprocessing. Second, we must wrap the asynchronous handler in a try/catch block with retry exponential backoff and dead-letter queueing rather than letting unhandled rejections take down the process.',
    evaluationCriteria:
      'Verifies understanding of webhook idempotency, duplicate delivery tolerance, and unhandled promise exception handling.',
  },
];

export const initialHistory: InterviewResult[] = [
  {
    id: 'res-892',
    studentId: 'std-104',
    projectId: 'proj-01',
    projectTitle: 'DevPulse: Task & Sprint Analytics',
    date: 'October 25, 2026',
    mode: 'standard',
    overallScore: 84,
    codeUnderstandingScore: 88,
    speakingDeliveryScore: 80,
    questionsAnswered: 3,
    totalQuestions: 3,
    strengths: [
      'Accurate explanation of database pushdown vs client heap memory limits',
      'Solid defense of refresh token rotation over stateless JWTs',
      'Articulated optimistic locking and HTTP 409 conflict flows clearly',
    ],
    areasToImprove: [
      'Provide more concrete numbers when discussing Redis memory overhead',
      'Reduce introductory filler phrases ("Basically, what we did was...")',
    ],
    recommendedPracticeTopics: [
      'Redis eviction policies (allkeys-lru vs volatile-lru)',
      'Database connection pooling with PgBouncer under high concurrency',
    ],
    answers: [
      {
        questionId: 'q-std-01',
        questionText: 'Walk me through how calculateSprintVelocity() avoids blocking the event loop.',
        mode: 'standard',
        studentAnswer:
          'We avoid pulling all 50k rows into Node memory by using SQL window functions for aggregations and offloading Monte Carlo projections to worker threads.',
        feedback: 'Excellent grasp of V8 heap constraints and database pushdown mechanisms.',
        codeUnderstandingScore: 90,
        speakingDeliveryScore: 82,
      },
      {
        questionId: 'q-std-02',
        questionText: 'Why refresh token rotation backed by Redis instead of stateless JWTs?',
        mode: 'standard',
        studentAnswer:
          'Stateless JWTs cannot be revoked immediately if leaked. Pairing short-lived tokens with Redis refresh token families allows immediate invalidation upon replay.',
        feedback: 'Clear security threat modeling and correct identification of token replay defenses.',
        codeUnderstandingScore: 88,
        speakingDeliveryScore: 80,
      },
      {
        questionId: 'q-std-03',
        questionText: 'How do you handle concurrent card updates?',
        mode: 'standard',
        studentAnswer:
          'Using optimistic locking with an integer version column. If version does not match, return 409 Conflict so user reloads.',
        feedback: 'Concise, direct answer showing genuine understanding of database isolation levels.',
        codeUnderstandingScore: 86,
        speakingDeliveryScore: 78,
      },
    ],
    deliveryMetrics: {
      structure: 'Structured (Context -> Technical Rationale -> Concrete Outcome)',
      pace: '138 words / minute (Optimal)',
      pauses: 'Natural thinking pauses observed before code specifics',
      fillerWords: '3 filler words detected across 4 minutes',
    },
  },
  {
    id: 'res-881',
    studentId: 'std-104',
    projectId: 'proj-01',
    projectTitle: 'DevPulse: Task & Sprint Analytics',
    date: 'October 22, 2026',
    mode: 'trap-hint',
    overallScore: 86,
    codeUnderstandingScore: 91,
    speakingDeliveryScore: 81,
    questionsAnswered: 2,
    totalQuestions: 2,
    strengths: [
      'Successfully caught and challenged both misleading architectural hints',
      'Defended browser storage limits (5MB) and multi-tenant security boundaries',
    ],
    areasToImprove: [
      'Could suggest PostgreSQL COPY command as the fastest safe bulk insert option',
    ],
    recommendedPracticeTopics: [
      'SQL injection attack vectors via CSV headers',
      'Browser memory quotas and IndexedDB vs localStorage',
    ],
    answers: [
      {
        questionId: 'q-trap-01',
        questionText: 'Dump table into localStorage to remove indexes?',
        mode: 'trap-hint',
        studentAnswer:
          'Challenged. Exceeds 5MB quota, causes severe security leak across tenants, and makes real-time team updates impossible.',
        feedback: 'Spot-on diagnosis of storage, security, and concurrency traps.',
        codeUnderstandingScore: 92,
        speakingDeliveryScore: 82,
        trapHandledCorrectly: true,
      },
      {
        questionId: 'q-trap-02',
        questionText: 'Disable foreign keys and string concatenate SQL for bulk speed?',
        mode: 'trap-hint',
        studentAnswer:
          'Challenged. Opens fatal SQL Injection vulnerability and creates orphaned database records. Batch UNNEST is much safer.',
        feedback: 'Immediate identification of SQLi hazard; recommended batch UNNEST accurately.',
        codeUnderstandingScore: 90,
        speakingDeliveryScore: 80,
        trapHandledCorrectly: true,
      },
    ],
    deliveryMetrics: {
      structure: 'Direct & assertive rebuttal with technical evidence',
      pace: '142 words / minute',
      pauses: 'Firm, decisive cadence',
      fillerWords: '2 filler words detected',
    },
  },
  {
    id: 'res-870',
    studentId: 'std-104',
    projectId: 'proj-02',
    projectTitle: 'NeuroRoute: Smart Logistics Routing',
    date: 'October 18, 2026',
    mode: 'break-it',
    overallScore: 78,
    codeUnderstandingScore: 80,
    speakingDeliveryScore: 76,
    questionsAnswered: 2,
    totalQuestions: 2,
    strengths: [
      'Identified cursor pagination non-deterministic tie breaker',
      'Described exponential backoff for external service calls',
    ],
    areasToImprove: [
      'Did not mention dead-letter queue (DLQ) for unrecoverable payloads',
      'Pacing was rushed during the code review segment',
    ],
    recommendedPracticeTopics: [
      'Dead-letter queues in Celery/RabbitMQ',
      'A* heuristic tuning for Manhattan vs Euclidean metrics',
    ],
    answers: [
      {
        questionId: 'q-break-01',
        questionText: 'Pagination duplicate tasks bug explanation.',
        mode: 'break-it',
        studentAnswer:
          'When timestamps collide, ordering is non-deterministic. Fixed by adding unique ID tie-breaker to ORDER BY.',
        feedback: 'Correct diagnosis of pagination cursor failure.',
        codeUnderstandingScore: 82,
        speakingDeliveryScore: 76,
      },
      {
        questionId: 'q-break-02',
        questionText: 'Webhook crash & duplicate handling.',
        mode: 'break-it',
        studentAnswer:
          'Store processed commit IDs in Redis for idempotency and wrap handler in try-catch block.',
        feedback: 'Good idempotency concept; omitted dead-letter queue retry mechanics.',
        codeUnderstandingScore: 78,
        speakingDeliveryScore: 76,
      },
    ],
    deliveryMetrics: {
      structure: 'Problem diagnosis -> Solution',
      pace: '154 words / minute (Fast)',
      pauses: 'Brief pauses; spoke quickly when debugging',
      fillerWords: '5 filler words detected',
    },
  },
];

export const initialBatches: Batch[] = [
  {
    id: 'batch-01',
    name: '2026 CS-A',
    department: 'Computer Science',
    totalStudents: 42,
    completedAssessments: 126,
    averageReadiness: 81,
    needsPracticeCount: 4,
  },
  {
    id: 'batch-02',
    name: '2026 CS-B',
    department: 'Computer Science',
    totalStudents: 38,
    completedAssessments: 98,
    averageReadiness: 77,
    needsPracticeCount: 6,
  },
  {
    id: 'batch-03',
    name: '2026 IT-A',
    department: 'Information Technology',
    totalStudents: 34,
    completedAssessments: 92,
    averageReadiness: 83,
    needsPracticeCount: 3,
  },
  {
    id: 'batch-04',
    name: '2026 ECE-A',
    department: 'Electronics & Comm',
    totalStudents: 28,
    completedAssessments: 68,
    averageReadiness: 74,
    needsPracticeCount: 5,
  },
];

export const initialAssessments: Assessment[] = [
  {
    id: 'asm-100',
    studentId: 'std-104',
    studentName: 'Vedant Lohiya',
    rollNumber: '2026CS104',
    department: 'Computer Science',
    batch: '2026 CS-A',
    projectTitle: 'DevPulse: Task & Sprint Analytics',
    type: 'TECHNICAL Viva',
    completionDate: 'Today',
    score: 76,
    codeUnderstanding: 80,
    speakingDelivery: 72,
    reviewStatus: 'Pending Review',
    facultyNotes: '',
    reviewedBy: '',
    questionSummary: 'OOPs & Polymorphism, dynamic dispatch, and concurrency handling.',
    studentResponseSnippet: 'Runtime polymorphism via vtables allows decoupled interface implementations.',
    aiEvaluationSummary: 'Demonstrated good code comprehension; verbal response requires slightly more elaboration on memory overhead.',
  },
  {
    id: 'asm-101',
    studentId: 'std-104',
    studentName: 'Vedant Lohiya',
    rollNumber: '2026CS104',
    department: 'Computer Science',
    batch: '2026 CS-A',
    projectTitle: 'DevPulse: Task & Sprint Analytics',
    type: 'Standard Pre-Viva',
    completionDate: 'Oct 25, 2026',
    score: 84,
    codeUnderstanding: 88,
    speakingDelivery: 80,
    reviewStatus: 'Faculty Reviewed',
    facultyNotes:
      'Candidate thoroughly verified project code understanding. Defended PostgreSQL pushdown and optimistic locking with great confidence.',
    reviewedBy: 'Dr. Marcus Vance',
    questionSummary: 'Database pushdown, JWT revocation, and optimistic locking in distributed tasks.',
    studentResponseSnippet:
      'Pushing aggregations down to PostgreSQL SUM/AVG window functions avoids V8 heap exhaustion and optimizes worker thread utilization.',
    aiEvaluationSummary:
      'High technical comprehension of database architecture and state isolation. Verbal delivery is articulate with minor filler phrases.',
  },
  {
    id: 'asm-102',
    studentId: 'std-108',
    studentName: 'Priya Shah',
    rollNumber: '2026CS108',
    department: 'Computer Science',
    batch: '2026 CS-A',
    projectTitle: 'CloudFlow: Serverless ETL Framework',
    type: 'Trap Hint Defusal',
    completionDate: 'Oct 26, 2026',
    score: 92,
    codeUnderstanding: 94,
    speakingDelivery: 90,
    reviewStatus: 'Faculty Reviewed',
    facultyNotes: 'Outstanding technical defense. Ready for tier-1 product firm placement rounds.',
    reviewedBy: 'Prof. Ananya Sen',
    questionSummary: 'Challenged lambda cold-start hints and connection pooling under bursty queues.',
    studentResponseSnippet:
      'RDS Proxy connection pooling is required; opening unbounded connections per invocation causes server exhaustion.',
    aiEvaluationSummary:
      'Superb clarity on infrastructure and connection pooling bottlenecks. Natural speaking pace.',
  },
  {
    id: 'asm-103',
    studentId: 'std-115',
    studentName: 'Rohan Mehta',
    rollNumber: '2026IT215',
    department: 'Information Technology',
    batch: '2026 IT-A',
    projectTitle: 'PayGateway: Micro-Payments API',
    type: 'Standard Pre-Viva',
    completionDate: 'Oct 24, 2026',
    score: 68,
    codeUnderstanding: 70,
    speakingDelivery: 66,
    reviewStatus: 'Pending Review',
    facultyNotes: '',
    reviewedBy: '',
    questionSummary: 'Stripe webhook signature verification and distributed transaction rollback.',
    studentResponseSnippet:
      'We use try-catch to rollback if the database fails, but was unsure how two-phase commit works.',
    aiEvaluationSummary:
      'Candidate struggled to explain how partial payment failures are reconciled across microservices. Needs remedial practice.',
  },
  {
    id: 'asm-104',
    studentId: 'std-122',
    studentName: 'Elena Rostova',
    rollNumber: '2026CS122',
    department: 'Computer Science',
    batch: '2026 CS-B',
    projectTitle: 'VisionGuard: Edge Object Classifier',
    type: 'Break It Viva',
    completionDate: 'Oct 26, 2026',
    score: 74,
    codeUnderstanding: 76,
    speakingDelivery: 72,
    reviewStatus: 'Pending Review',
    facultyNotes: '',
    reviewedBy: '',
    questionSummary: 'Memory leak in OpenCV frame buffer and GPU inference queue deadlock.',
    studentResponseSnippet:
      'Identified unreleased Mats in C++ wrapper, but lacked structured explanation for threadpool synchronization.',
    aiEvaluationSummary:
      'Good code reading ability. Speaking delivery was somewhat hesitant with frequent long pauses.',
  },
  {
    id: 'asm-105',
    studentId: 'std-131',
    studentName: 'Marcus Brody',
    rollNumber: '2026IT231',
    department: 'Information Technology',
    batch: '2026 IT-A',
    projectTitle: 'SyncDoc: Operational Transform Engine',
    type: 'Standard Pre-Viva',
    completionDate: 'Oct 27, 2026',
    score: 89,
    codeUnderstanding: 91,
    speakingDelivery: 87,
    reviewStatus: 'Faculty Reviewed',
    facultyNotes: 'Excellent grasp of OT algorithms and conflict-free replicated data types (CRDTs).',
    reviewedBy: 'Dr. Marcus Vance',
    questionSummary: 'Character offset transformations during concurrent insertions from multiple clients.',
    studentResponseSnippet:
      'Transformed client operations preserve intent by shifting target index if remote operation preceded local apply timestamp.',
    aiEvaluationSummary:
      'Deep conceptual knowledge of concurrent distributed algorithms. Highly confident delivery.',
  },
  {
    id: 'asm-106',
    studentId: 'std-140',
    studentName: 'Aisha Al-Mansoor',
    rollNumber: '2026CS140',
    department: 'Computer Science',
    batch: '2026 CS-B',
    projectTitle: 'CryptoLedger: Minimal Blockchain',
    type: 'Trap Hint Defusal',
    completionDate: 'Oct 22, 2026',
    score: 61,
    codeUnderstanding: 63,
    speakingDelivery: 59,
    reviewStatus: 'Pending Review',
    facultyNotes: '',
    reviewedBy: '',
    questionSummary: 'Proof of work difficulty retargeting and chain reorganization traps.',
    studentResponseSnippet:
      'Accepted the trap suggestion that mining difficulty can be fixed permanently without hash rate checks.',
    aiEvaluationSummary:
      'Fell for the trap hint on difficulty adjustment. Needs guided coaching on mining incentives and block time variance.',
  },
  {
    id: 'asm-107',
    studentId: 'std-152',
    studentName: 'David Kim',
    rollNumber: '2026EC302',
    department: 'Electronics & Comm',
    batch: '2026 ECE-A',
    projectTitle: 'AeroSense: Telemetry Drone Groundstation',
    type: 'Standard Pre-Viva',
    completionDate: 'Oct 25, 2026',
    score: 78,
    codeUnderstanding: 81,
    speakingDelivery: 75,
    reviewStatus: 'Faculty Reviewed',
    facultyNotes: 'Understands serial communication and Kalman filtering well. Encouraged to speak louder.',
    reviewedBy: 'Prof. Ananya Sen',
    questionSummary: 'UART buffer overrun protection and sensor fusion matrix multiplication in real time.',
    studentResponseSnippet:
      'DMA ring buffer prevents dropped packets from GPS modules at 115200 baud while main thread handles filtering.',
    aiEvaluationSummary:
      'Solid embedded systems knowledge. Communication is slightly quiet but technically precise.',
  },
  {
    id: 'asm-108',
    studentId: 'std-164',
    studentName: 'Sneha Kulkarni',
    rollNumber: '2026IT244',
    department: 'Information Technology',
    batch: '2026 IT-A',
    projectTitle: 'KubeWatch: Cluster Resource Optimizer',
    type: 'Break It Viva',
    completionDate: 'Oct 26, 2026',
    score: 83,
    codeUnderstanding: 85,
    speakingDelivery: 81,
    reviewStatus: 'Faculty Reviewed',
    facultyNotes: 'Identified the Goroutine leak in the informer cache correctly. Approved for mock viva stage 2.',
    reviewedBy: 'Dr. Marcus Vance',
    questionSummary: 'K8s custom controller reconcile loop timeout and channel leak bug.',
    studentResponseSnippet:
      'Context cancellation was missing in worker loop, causing orphaned goroutines to accumulate during pod churn.',
    aiEvaluationSummary:
      'Rapid root-cause analysis on memory leaks in concurrent Go programs. Crisp structured communication.',
  },
];

export const initialExamPapers: ExamPaper[] = [
  {
    id: 'paper-101',
    name: 'Semester VII Core Algorithms & Systems Coding Examination',
    subject: 'Data Structures & Algorithmic Engineering (CS701)',
    batch: '2026 CS-A',
    assignedBatches: ['2026 CS-A', '2026 CS-B'],
    totalMarks: 50,
    durationMinutes: 60,
    examDate: 'Oct 29, 2026',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    status: 'published',
    resultsReleased: false,
    createdDate: 'Oct 28, 2026',
    createdBy: 'Dr. Marcus Vance',
    instructions: [
      'Proctoring is active: Fullscreen mode, webcam validation, and window focus tracking are enforced.',
      'You may write and run solutions in C++, Java, Python 3, or JavaScript.',
      'Partial marks are awarded based on test cases passed before final submission.',
      'Submissions are final once submitted or when the 60-minute examination timer reaches 00:00.'
    ],
    pdfSourceFileName: 'CS701_EndSem_Algorithms_Paper_Fall2026.pdf',
    questions: [
      {
        id: 'q-devpulse-01',
        title: 'DevPulse Sprint Velocity: Event Loop Non-Blocking Aggregation',
        marks: 20,
        difficulty: 'Medium',
        category: 'Architecture & Concurrency',
        contextSnippet:
          '// File: src/analytics/velocity.ts\nexport async function calculateSprintVelocity(teamId: string, windowSize = 5) {\n  const cached = await redis.get(`velocity:${teamId}`);\n  if (cached) return JSON.parse(cached);\n  // Aggregation logic\n}',
        sampleAnswer:
          'Instead of pulling 50,000 raw rows into the Node.js V8 heap and running synchronous reduce/filter loops, the aggregation is pushed down directly into PostgreSQL using SUM() and AVG() window functions. For CPU-bound Monte Carlo forecasts, we offload the computation to a Node.js worker_thread, while high-frequency dashboard reads are cached in Redis with a 15-minute TTL.',
        problemStatement:
          'In your DevPulse project, walk me through how `calculateSprintVelocity()` avoids blocking the Node.js event loop when aggregating 50,000 historic task records.',
        constraints: [
          'Must not block Node.js V8 main event loop',
          'Database pushdown with SQL SUM() / AVG() window functions',
          'Redis TTL caching strategy for high-frequency reads (15m)',
          'worker_threads for CPU-bound Monte Carlo simulation'
        ],
        sampleInputsOutputs: [
          {
            input: 'calculateSprintVelocity("team-apollo", 5) with 50,000 historic records',
            output: '{ teamId: "team-apollo", averageVelocity: 42.5, sprintCount: 5 }',
            explanation:
              'Cached in Redis after initial DB aggregation; subsequent requests return cached JSON without DB query or CPU blocking.'
          }
        ],
        testCases: [
          {
            id: 'tc-dev-1',
            input: 'calculateSprintVelocity("team-apollo", 5)',
            expectedOutput: 'Velocity computed without event loop blocking',
            isHidden: false,
            marks: 10,
            explanation: 'Redis cache hit / DB aggregation pushdown test'
          },
          {
            id: 'tc-dev-2',
            input: 'calculateSprintVelocity("team-apollo", 5) [50k records, cache miss]',
            expectedOutput: 'worker_thread offloaded, event loop latency < 5ms',
            isHidden: true,
            marks: 10,
            explanation: 'Main thread responsiveness under heavy 50k item load'
          }
        ],
        supportedLanguages: ['javascript', 'python', 'cpp', 'java'],
        starterCode: {
          javascript: `// File: src/analytics/velocity.ts
export async function calculateSprintVelocity(teamId, windowSize = 5) {
  const cached = await redis.get(\`velocity:\${teamId}\`);
  if (cached) return JSON.parse(cached);
  
  // Explain your architectural choices, tradeoff rationale, and failure recovery mechanisms...
  // Push down aggregation directly into DB window functions or worker thread
  
  return { teamId, averageVelocity: 42.5 };
}`,
          python: `# File: src/analytics/velocity.py
async def calculate_sprint_velocity(team_id: str, window_size: int = 5):
    cached = await redis.get(f"velocity:{team_id}")
    if cached:
        return json.loads(cached)
    # Aggregation logic avoiding event loop block
    return {"team_id": team_id, "average_velocity": 42.5}
`,
          cpp: `// File: src/analytics/velocity.cpp
#include <string>

class VelocityService {
public:
    std::string calculateSprintVelocity(const std::string& teamId, int windowSize = 5) {
        // Non-blocking async aggregation
        return "{\\"averageVelocity\\": 42.5}";
    }
};`,
          java: `// File: src/analytics/velocity.java
public class VelocityService {
    public static String calculateSprintVelocity(String teamId, int windowSize) {
        // Non-blocking async aggregation pushdown
        return "{\\"averageVelocity\\": 42.5}";
    }
}`
        }
      },
      {
        id: 'q-alg-1',
        title: 'Sliding Window Maximum using Monotonic Deque',
        marks: 15,
        difficulty: 'Medium',
        category: 'Algorithms & Data Structures',
        problemStatement:
          'You are given an array of integers nums and an integer k. There is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position, return the max sliding window. Your algorithm must achieve O(N) amortized time complexity.',
        constraints: [
          '1 <= nums.length <= 10^5',
          '-10^4 <= nums[i] <= 10^4',
          '1 <= k <= nums.length'
        ],
        sampleInputsOutputs: [
          {
            input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3',
            output: '[3,3,5,5,6,7]',
            explanation:
              'Window [1, 3, -1] -> max 3; [3, -1, -3] -> max 3; [-1, -3, 5] -> max 5; [-3, 5, 3] -> max 5; [5, 3, 6] -> max 6; [3, 6, 7] -> max 7.'
          },
          {
            input: 'nums = [1], k = 1',
            output: '[1]',
            explanation: 'Single element window yields the element itself.'
          }
        ],
        testCases: [
          {
            id: 'tc-1-1',
            input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3',
            expectedOutput: '[3, 3, 5, 5, 6, 7]',
            isHidden: false,
            marks: 5,
            explanation: 'Standard sample test case with fluctuating values.'
          },
          {
            id: 'tc-1-2',
            input: 'nums = [1,-1], k = 1',
            expectedOutput: '[1, -1]',
            isHidden: false,
            marks: 5,
            explanation: 'Window size 1 edge case.'
          },
          {
            id: 'tc-1-3',
            input: 'nums = [9, 11], k = 2',
            expectedOutput: '[11]',
            isHidden: true,
            marks: 5,
            explanation: 'Window matches array length.'
          },
          {
            id: 'tc-1-4',
            input: 'nums = [4,-2,1,8,6,3], k = 3',
            expectedOutput: '[4, 8, 8, 8]',
            isHidden: true,
            marks: 5,
            explanation: 'Hidden evaluation case testing monotonic invariant.'
          }
        ],
        supportedLanguages: ['python', 'cpp', 'java', 'javascript'],
        starterCode: {
          python: `def maxSlidingWindow(nums: list[int], k: int) -> list[int]:
    # Write an O(n) sliding window monotonic deque solution
    from collections import deque
    dq = deque()
    res = []
    
    for i, n in enumerate(nums):
        # Evict indices outside of the current window [i - k + 1, i]
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        # Maintain monotonic decreasing order in deque
        while dq and nums[dq[-1]] < n:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            res.append(nums[dq[0]])
            
    return res
`,
          cpp: `#include <vector>
#include <deque>
using namespace std;

class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        deque<int> dq;
        vector<int> result;
        for (int i = 0; i < nums.size(); i++) {
            while (!dq.empty() && dq.front() < i - k + 1) dq.pop_front();
            while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();
            dq.push_back(i);
            if (i >= k - 1) result.push_back(nums[dq.front()]);
        }
        return result;
    }
};`,
          java: `import java.util.*;

class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        if (nums == null || nums.length == 0 || k <= 0) return new int[0];
        int n = nums.length;
        int[] res = new int[n - k + 1];
        Deque<Integer> dq = new ArrayDeque<>();
        
        for (int i = 0; i < n; i++) {
            while (!dq.isEmpty() && dq.peekFirst() < i - k + 1) {
                dq.pollFirst();
            }
            while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) {
                dq.pollLast();
            }
            dq.offerLast(i);
            if (i >= k - 1) {
                res[i - k + 1] = nums[dq.peekFirst()];
            }
        }
        return res;
    }
}`,
          javascript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
function maxSlidingWindow(nums, k) {
  const deque = [];
  const result = [];
  
  for (let i = 0; i < nums.length; i++) {
    while (deque.length && deque[0] < i - k + 1) deque.shift();
    while (deque.length && nums[deque[deque.length - 1]] < nums[i]) deque.pop();
    deque.push(i);
    if (i >= k - 1) result.push(nums[deque[0]]);
  }
  return result;
}`
        }
      },
      {
        id: 'q-alg-2',
        title: 'Distributed Token Bucket Rate Limiter',
        marks: 15,
        difficulty: 'Hard',
        problemStatement:
          'Implement a rate limiter class `TokenBucketRateLimiter(capacity, refillRatePerSec)`. The limiter holds up to `capacity` tokens. It refills with tokens at `refillRatePerSec` tokens per second up to capacity. An incoming request consumes 1 token. If tokens >= 1, the request is allowed and 1 token is subtracted, returning True. Otherwise, the request is rejected and returns False. Implement `allowRequest(timestampMs)` correctly accounting for elapsed fractional milliseconds.',
        constraints: [
          '1 <= capacity <= 10^6',
          '1 <= refillRatePerSec <= 10^5',
          'Timestamps are monotonically increasing: 0 <= timestampMs <= 10^12',
          'Up to 10^5 requests will be evaluated'
        ],
        sampleInputsOutputs: [
          {
            input: 'Capacity=3, Refill=1/sec; Requests at [0, 500, 900, 1000]',
            output: '[True, True, True, False]',
            explanation:
              'At 0ms (3 tokens): allowed (2 remain). At 500ms (2 tokens): allowed (1 remain). At 900ms (1 token): allowed (0 remain). At 1000ms: refilled 1 token -> allowed.'
          }
        ],
        testCases: [
          {
            id: 'tc-2-1',
            input: 'capacity = 5, rate = 2/s, calls = [0, 100, 200, 300, 400, 500]',
            expectedOutput: '[True, True, True, True, True, False]',
            isHidden: false,
            marks: 10,
            explanation: 'Burst capacity exhaustion test'
          },
          {
            id: 'tc-2-2',
            input: 'capacity = 2, rate = 1/s, calls = [0, 500, 1500, 2000]',
            expectedOutput: '[True, True, True, True]',
            isHidden: false,
            marks: 10,
            explanation: 'Proper refill after pause'
          },
          {
            id: 'tc-2-3',
            input: 'capacity = 10, rate = 5/s, high concurrency test [1000 calls]',
            expectedOutput: 'All constraints within token budget',
            isHidden: true,
            marks: 10,
            explanation: 'Hidden accuracy and precision floating point test'
          }
        ],
        supportedLanguages: ['python', 'cpp', 'java', 'javascript'],
        starterCode: {
          python: `class TokenBucketRateLimiter:
    def __init__(self, capacity: int, refill_rate_per_sec: float):
        self.capacity = float(capacity)
        self.refill_rate = float(refill_rate_per_sec)
        self.tokens = float(capacity)
        self.last_timestamp_ms = 0.0

    def allow_request(self, timestamp_ms: int) -> bool:
        # Calculate elapsed seconds and refill tokens
        elapsed_sec = max(0.0, (timestamp_ms - self.last_timestamp_ms) / 1000.0)
        self.tokens = min(self.capacity, self.tokens + (elapsed_sec * self.refill_rate))
        self.last_timestamp_ms = float(timestamp_ms)

        if self.tokens >= 1.0:
            self.tokens -= 1.0
            return True
        return False
`,
          cpp: `class TokenBucketRateLimiter {
private:
    double capacity;
    double refillRate;
    double tokens;
    long long lastTimestampMs;

public:
    TokenBucketRateLimiter(int cap, double rate) 
        : capacity(cap), refillRate(rate), tokens(cap), lastTimestampMs(0) {}

    bool allowRequest(long long timestampMs) {
        double elapsedSec = std::max(0.0, (timestampMs - lastTimestampMs) / 1000.0);
        tokens = std::min(capacity, tokens + (elapsedSec * refillRate));
        lastTimestampMs = timestampMs;

        if (tokens >= 1.0) {
            tokens -= 1.0;
            return true;
        }
        return false;
    }
};`,
          java: `public class TokenBucketRateLimiter {
    private final double capacity;
    private final double refillRate;
    private double tokens;
    private long lastTimestampMs;

    public TokenBucketRateLimiter(int capacity, double refillRate) {
        this.capacity = capacity;
        this.refillRate = refillRate;
        this.tokens = capacity;
        this.lastTimestampMs = 0;
    }

    public synchronized boolean allowRequest(long timestampMs) {
        double elapsedSec = Math.max(0.0, (timestampMs - lastTimestampMs) / 1000.0);
        tokens = Math.min(capacity, tokens + (elapsedSec * refillRate));
        lastTimestampMs = timestampMs;

        if (tokens >= 1.0) {
            tokens -= 1.0;
            return true;
        }
        return false;
    }
}`,
          javascript: `class TokenBucketRateLimiter {
  constructor(capacity, refillRatePerSec) {
    this.capacity = capacity;
    this.refillRate = refillRatePerSec;
    this.tokens = capacity;
    this.lastTimestampMs = 0;
  }

  allowRequest(timestampMs) {
    const elapsedSec = Math.max(0, (timestampMs - this.lastTimestampMs) / 1000);
    this.tokens = Math.min(this.capacity, this.tokens + (elapsedSec * this.refillRate));
    this.lastTimestampMs = timestampMs;

    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }
}`
        }
      }
    ]
  },
  {
    id: 'paper-102',
    name: 'Midterm Operating Systems: Virtual Memory & Concurrency',
    subject: 'Operating Systems (CS502)',
    batch: '2026 CS-A',
    assignedBatches: ['2026 CS-A', '2026 IT-A'],
    totalMarks: 40,
    durationMinutes: 45,
    examDate: 'Oct 31, 2026',
    startTime: '09:00 AM',
    endTime: '09:45 AM',
    status: 'scheduled',
    resultsReleased: false,
    createdDate: 'Oct 27, 2026',
    createdBy: 'Prof. Ananya Sen',
    instructions: [
      'Proctoring will be initialized 5 minutes prior to commencement.',
      'Paper covers Page Replacement Algorithms (LRU, FIFO, Clock) and Semaphore synchronization primitives.'
    ],
    pdfSourceFileName: 'CS502_Midterm_Paper_Scheduled.pdf',
    questions: [
      {
        id: 'q-os-1',
        title: 'Least Recently Used (LRU) Cache in O(1)',
        marks: 25,
        difficulty: 'Medium',
        problemStatement:
          'Design and implement a data structure for Least Recently Used (LRU) cache. It should support two operations: `get(key)` and `put(key, value)`. Both operations must run in O(1) average time complexity.',
        constraints: ['1 <= capacity <= 3000', '0 <= key <= 10^4', '0 <= value <= 10^5'],
        sampleInputsOutputs: [
          {
            input: 'put(1,1), put(2,2), get(1), put(3,3), get(2)',
            output: '[null, null, 1, null, -1]',
            explanation: 'Key 2 was evicted because key 1 was accessed before key 3 insertion.'
          }
        ],
        testCases: [
          {
            id: 'tc-os-1',
            input: 'LRUCache(2); put(1,1); put(2,2); get(1); put(3,3); get(2);',
            expectedOutput: '1, -1',
            marks: 15,
            isHidden: false
          },
          {
            id: 'tc-os-2',
            input: 'LRUCache(1); put(2,1); get(2); put(3,2); get(2); get(3);',
            expectedOutput: '1, -1, 2',
            marks: 10,
            isHidden: true
          }
        ],
        supportedLanguages: ['python', 'cpp', 'java', 'javascript'],
        starterCode: {
          python: `class LRUCache:\n    def __init__(self, capacity: int):\n        self.capacity = capacity\n        self.cache = {}\n\n    def get(self, key: int) -> int:\n        return self.cache.get(key, -1)\n\n    def put(self, key: int, value: int) -> None:\n        self.cache[key] = value`,
          cpp: `class LRUCache {\npublic:\n    LRUCache(int capacity) {}\n    int get(int key) { return -1; }\n    void put(int key, int value) {}\n};`,
          java: `class LRUCache {\n    public LRUCache(int capacity) {}\n    public int get(int key) { return -1; }\n    public void put(int key, int value) {}\n}`,
          javascript: `class LRUCache {\n  constructor(capacity) { this.capacity = capacity; }\n  get(key) { return -1; }\n  put(key, value) {}\n}`
        }
      }
    ]
  },
  {
    id: 'paper-105',
    name: 'CS804: Cloud Architecture & Distributed Consensus Examination',
    subject: 'Distributed Cloud Computing (CS804)',
    batch: '2026 CS-A',
    assignedBatches: ['2026 CS-A', '2026 CS-B'],
    totalMarks: 50,
    durationMinutes: 60,
    examDate: 'Nov 04, 2026',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    status: 'scheduled',
    resultsReleased: false,
    createdDate: 'Oct 28, 2026',
    createdBy: 'Dr. Marcus Vance',
    instructions: [
      'Proctoring will be enforced 5 minutes prior to commencement.',
      'Examination covers Raft consensus election, vector clocks, and horizontal auto-scaling algorithms.'
    ],
    pdfSourceFileName: 'CS804_Scheduled_Cloud_Examination.pdf',
    questions: [
      {
        id: 'q-cloud-1',
        title: 'Distributed Leader Election Heartbeat Protocol',
        marks: 25,
        difficulty: 'Medium',
        problemStatement:
          'Implement a distributed Raft leader election coordinator `RaftNode(nodeId, clusterSize)`. The node transitions between Follower, Candidate, and Leader based on randomized election timeouts and heartbeat reception.',
        constraints: ['3 <= clusterSize <= 9', 'Election timeout: 150ms - 300ms'],
        sampleInputsOutputs: [
          {
            input: '5-node cluster, leader timeout expires on node 2',
            output: 'Node 2 requests votes, secures majority quorum (3/5), becomes Leader',
            explanation: 'Raft consensus guarantees single leader per term.'
          }
        ],
        testCases: [
          {
            id: 'tc-cloud-1',
            input: 'cluster = 5; triggerTimeout(2);',
            expectedOutput: 'Leader elected: 2',
            marks: 15,
            isHidden: false
          },
          {
            id: 'tc-cloud-2',
            input: 'networkPartition([1,2], [3,4,5]);',
            expectedOutput: 'Minority partition rejects election; majority elects node 3',
            marks: 10,
            isHidden: true
          }
        ],
        supportedLanguages: ['python', 'cpp', 'java', 'javascript'],
        starterCode: {
          python: `class RaftNode:\n    def __init__(self, node_id: int, cluster_size: int):\n        self.node_id = node_id\n        self.cluster_size = cluster_size\n        self.state = "FOLLOWER"\n        self.current_term = 0\n        self.voted_for = None`,
          cpp: `class RaftNode {\npublic:\n    int nodeId;\n    int clusterSize;\n    std::string state;\n    RaftNode(int id, int size) : nodeId(id), clusterSize(size), state("FOLLOWER") {}\n};`,
          java: `public class RaftNode {\n    int nodeId;\n    int clusterSize;\n    String state = "FOLLOWER";\n    public RaftNode(int id, int size) { this.nodeId = id; this.clusterSize = size; }\n}`,
          javascript: `class RaftNode {\n  constructor(nodeId, clusterSize) {\n    this.nodeId = nodeId;\n    this.clusterSize = clusterSize;\n    this.state = 'FOLLOWER';\n  }\n}`
        }
      }
    ]
  },
  {
    id: 'paper-103',
    name: 'College-Wide Aptitude & Core Computing Evaluation',
    subject: 'Campus Placement Technical Assessment',
    batch: '2026 CS-A',
    assignedBatches: ['2026 CS-A', '2026 CS-B', '2026 IT-A'],
    totalMarks: 50,
    durationMinutes: 45,
    examDate: 'Oct 24, 2026',
    startTime: '02:00 PM',
    endTime: '02:45 PM',
    status: 'completed',
    resultsReleased: true,
    createdDate: 'Oct 20, 2026',
    createdBy: 'Dr. Marcus Vance',
    instructions: [
      'Official examination conducted across all final year engineering batches.',
      'Results and verified code transcripts are published.'
    ],
    pdfSourceFileName: 'Campus_Wide_Assessment_Oct2026.pdf',
    questions: [
      {
        id: 'q-tcs-1',
        title: 'Longest Palindromic Substring via Dynamic Programming',
        marks: 25,
        difficulty: 'Medium',
        problemStatement:
          'Given a string s, return the longest palindromic substring in s. Optimize for space and time.',
        constraints: ['1 <= s.length <= 1000', 's consist of only digits and English letters.'],
        sampleInputsOutputs: [
          {
            input: 's = "babad"',
            output: '"bab"',
            explanation: '"aba" is also a valid answer.'
          }
        ],
        testCases: [
          {
            id: 'tc-tcs-1',
            input: 's = "babad"',
            expectedOutput: 'bab',
            marks: 15,
            isHidden: false
          },
          {
            id: 'tc-tcs-2',
            input: 's = "cbbd"',
            expectedOutput: 'bb',
            marks: 10,
            isHidden: true
          }
        ],
        supportedLanguages: ['python', 'cpp', 'java', 'javascript'],
        starterCode: {
          python: `def longestPalindrome(s: str) -> str:\n    # Expand around center\n    return ""`,
          cpp: `string longestPalindrome(string s) { return ""; }`,
          java: `class Solution { public String longestPalindrome(String s) { return ""; } }`,
          javascript: `function longestPalindrome(s) { return ""; }`
        }
      }
    ]
  }
];

export const initialExamSubmissions: ExamSubmission[] = [
  {
    id: 'sub-201',
    paperId: 'paper-103',
    studentId: 'std-104',
    studentName: 'Vedant Lohiya',
    rollNumber: '2026CS104',
    batch: '2026 CS-A',
    submittedAt: 'Oct 24, 2026 02:38 PM',
    timeSpentSeconds: 1875, // 31m 15s
    autoScore: 46,
    manualMarksOverride: 46,
    finalScore: 46,
    totalMarks: 50,
    status: 'reviewed',
    evaluatedBy: 'Dr. Marcus Vance',
    evaluationDate: 'Oct 25, 2026',
    facultyNotes:
      'Superb monotonic queue implementation. Clean O(n) runtime and edge conditions handled gracefully.',
    proctorAlerts: [
      {
        id: 'pa-1',
        timestamp: '00:14:22',
        type: 'tab_switch',
        severity: 'low',
        message: 'Window blur event recorded (1.2s duration) - Refocused back to workspace.'
      }
    ],
    answers: [
      {
        questionId: 'q-tcs-1',
        language: 'python',
        code: `def longestPalindrome(s: str) -> str:
    if not s or len(s) < 2:
        return s
    start, max_len = 0, 1
    
    def expand(left: int, right: int):
        nonlocal start, max_len
        while left >= 0 and right < len(s) and s[left] == s[right]:
            current_len = right - left + 1
            if current_len > max_len:
                start = left
                max_len = current_len
            left -= 1
            right += 1
            
    for i in range(len(s)):
        expand(i, i)       # Odd length palindrome
        expand(i, i + 1)   # Even length palindrome
        
    return s[start:start + max_len]`,
        testCasesPassed: 4,
        totalTestCases: 4,
        score: 46,
        runtimeMs: 42,
        memoryMb: 16.2,
        facultyFeedback: 'Excellent dynamic expansion around center logic.'
      }
    ]
  },
  {
    id: 'sub-202',
    paperId: 'paper-103',
    studentId: 'std-108',
    studentName: 'Priya Shah',
    rollNumber: '2026CS108',
    batch: '2026 CS-A',
    submittedAt: 'Oct 24, 2026 02:28 PM',
    timeSpentSeconds: 1720, // 28m 40s
    autoScore: 48,
    finalScore: 48,
    totalMarks: 50,
    status: 'reviewed',
    evaluatedBy: 'Dr. Marcus Vance',
    evaluationDate: 'Oct 25, 2026',
    facultyNotes: 'Perfect time complexity. Top score in batch 2026 CS-A.',
    proctorAlerts: [],
    answers: [
      {
        questionId: 'q-tcs-1',
        language: 'cpp',
        code: `// Manacher's Algorithm implementation for O(N) performance\n// Priya Shah 2026CS108`,
        testCasesPassed: 4,
        totalTestCases: 4,
        score: 48,
        runtimeMs: 14,
        memoryMb: 12.8,
        facultyFeedback: 'Top-tier implementation.'
      }
    ]
  },
  {
    id: 'sub-203',
    paperId: 'paper-103',
    studentId: 'std-131',
    studentName: 'Aarav Sharma',
    rollNumber: '2026IT231',
    batch: '2026 CS-A',
    submittedAt: 'Oct 24, 2026 02:33 PM',
    timeSpentSeconds: 2002, // 33m 2s
    autoScore: 43,
    finalScore: 43,
    totalMarks: 50,
    status: 'reviewed',
    evaluatedBy: 'Prof. Ananya Sen',
    evaluationDate: 'Oct 25, 2026',
    proctorAlerts: [],
    answers: [
      {
        questionId: 'q-tcs-1',
        language: 'java',
        code: `// DP table solution\n// Aarav Sharma`,
        testCasesPassed: 4,
        totalTestCases: 4,
        score: 43,
        runtimeMs: 68,
        memoryMb: 24.1
      }
    ]
  }
];

