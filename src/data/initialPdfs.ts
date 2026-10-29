import { AssignedPdfDocument } from '../types';

export const initialPdfDocuments: AssignedPdfDocument[] = [
  {
    id: 'pdf-dist-sys-804',
    title: 'Distributed Systems & Cloud Fault Tolerance (CS804)',
    subject: 'Distributed Computing',
    fileName: 'CS804_Distributed_Systems_Viva_Syllabus.pdf',
    fileSize: '3.4 MB',
    pageCount: 18,
    uploadedAt: 'Oct 26, 2026',
    status: 'Ready',
    targetType: 'batch',
    assignedBatches: ['2026 CS-A'],
    assignedClass: 'Computer Science',
    assignedStudentIds: ['std-104', 'std-108'],
    createdBy: 'Dr. Marcus Vance (Placement Chair)',
    summary:
      'Covers fundamental consensus algorithms (Raft, Paxos), causal ordering via vector clocks, two-phase commit protocols, CAP theorem limitations, and Byzantine fault tolerance in high-throughput microservices.',
    keyTopics: [
      'Raft Consensus & Leader Election Heartbeats',
      'Log Replication & Safety Invariants',
      'Vector Clocks & Lamport Timestamps Causal Consistency',
      'Two-Phase Commit (2PC) vs Three-Phase Commit (3PC)',
      'CAP Theorem & PACELC Trade-offs in Dynamo-style Stores',
      'Byzantine Fault Tolerance (BFT) & Quorum Slicing',
    ],
    extractedText: `COURSE SYLLABUS: CS804 - DISTRIBUTED SYSTEMS & CLOUD ARCHITECTURE
APEX INSTITUTE OF TECHNOLOGY - DEPARTMENT OF COMPUTER SCIENCE

MODULE 1: CONSENSUS PROTOCOLS & REPLICATED STATE MACHINES
1.1 The Raft Consensus Algorithm:
Raft decomposes consensus into three independent subproblems: Leader Election, Log Replication, and Safety.
- Leader Election: Nodes exist in Follower, Candidate, or Leader states. Followers transition to Candidates when election timeouts (typically 150-300ms randomized) expire without heartbeats (AppendEntries RPCs with empty entries). Candidates request votes via RequestVote RPCs. A candidate must receive votes from a strict majority (N/2 + 1) of nodes to assume leadership.
- Log Matching Property: If two entries in different logs have the same index and term, they store the same command, and logs are identical in all preceding entries.
- Leader Completeness Property: If a log entry is committed in a given term, that entry will be present in the logs of leaders for all higher terms. A leader never overwrites or truncates its own log entries; it only appends.
- Follower Log Overwrite: If a follower's log conflicts with the leader, the leader forces the follower to duplicate its log by decrementing nextIndex until finding the consensus match point.

MODULE 2: LOGICAL TIME & CAUSAL ORDERING
2.1 Lamport Logical Clocks:
Assigns a monotonically increasing scalar counter L(e) to every event. For events within the same process: L(b) = L(a) + 1. For message send m and receive: L(recv) = max(L(send), L(local)) + 1. Provides partial order; cannot determine whether two events are causally concurrent.
2.2 Vector Clocks:
Each process maintains vector V of length N where V[i] is process i's local clock.
Update rule: Local event increments V[i]. On message transmission, attach vector V. On receipt of message with vector W, process i sets V[k] = max(V[k], W[k]) for all k, then increments V[i].
Concurrency condition: Event a and b are concurrent (a || b) if neither V(a) <= V(b) nor V(b) <= V(a). This guarantees detection of causality violations and concurrent conflicting writes in decentralized storage systems.

MODULE 3: DISTRIBUTED TRANSACTIONS & ATOMIC COMMIT
3.1 Two-Phase Commit (2PC):
- Phase 1 (Prepare): Coordinator writes 'Prepare' to WAL and broadcasts PREPARE message to all participants. Participants execute local transactions up to commit point, lock resources, write intentions to WAL, and reply 'VOTE_COMMIT' or 'VOTE_ABORT'.
- Phase 2 (Commit/Abort): If all participants vote VOTE_COMMIT, coordinator logs 'Commit' and sends GLOBAL_COMMIT. If any votes VOTE_ABORT or timeouts occur, coordinator logs 'Abort' and sends GLOBAL_ABORT.
- Vulnerability: 2PC is a blocking protocol. If coordinator crashes after participants have voted VOTE_COMMIT and are awaiting decision, participants remain blocked holding locks indefinitely until coordinator recovers.
3.2 Three-Phase Commit (3PC):
Introduces 'Pre-Commit' state between Prepare and Commit with timeouts to eliminate indefinite blocking under single fail-stop coordinator crashes, assuming no network partitions.

MODULE 4: CONSISTENCY MODELS & CAP/PACELC THEOREM
4.1 CAP Theorem:
In an asynchronous network subject to partitions (P), a distributed data store can guarantee either Consistency (linearizability: every read receives the most recent write or an error) or Availability (every non-failing node returns a non-error response), but not both simultaneously.
4.2 PACELC Extension:
If there is a Partition (P), how does system trade off Availability (A) vs Consistency (C); Else (E), how does system trade off Latency (L) vs Consistency (C)? Example: DynamoDB/Cassandra chooses PA/EL, whereas Spanner/CockroachDB chooses PC/EC.

MODULE 5: FAULT TOLERANCE & BYZANTINE FAULT TOLERANCE
In a system of N nodes with f faulty nodes:
- Crash-fault tolerant consensus (e.g. Raft, Paxos) requires N >= 2f + 1 nodes to survive f crash failures.
- Byzantine fault tolerance (where nodes may lie, forge messages, or exhibit arbitrary malicious behavior) requires N >= 3f + 1 nodes with at least 2f + 1 quorum overlap to guarantee safety and liveness.`,
  },
  {
    id: 'pdf-os-kernel-601',
    title: 'Advanced Operating Systems & Kernel Internals (CS601)',
    subject: 'Operating Systems',
    fileName: 'CS601_Kernel_Memory_Syllabus.pdf',
    fileSize: '4.1 MB',
    pageCount: 22,
    uploadedAt: 'Oct 24, 2026',
    status: 'Ready',
    targetType: 'batch',
    assignedBatches: ['2026 CS-B'],
    assignedClass: 'Computer Science',
    assignedStudentIds: ['std-122'],
    createdBy: 'Prof. Sarah Jenkins',
    summary:
      'Detailed study of Linux kernel virtual memory paging, Copy-on-Write (CoW), lock-free atomic primitives, epoll I/O multiplexing, and CPU cache coherency.',
    keyTopics: [
      'Virtual Memory & Multi-Level Paging Architecture',
      'Translation Lookaside Buffer (TLB) Shootdowns',
      'Copy-on-Write (CoW) Fork Semantics',
      'Lock-Free Synchronization & Compare-and-Swap (CAS)',
      'epoll vs select/poll Event Multiplexing',
      'Completely Fair Scheduler (CFS) Red-Black Trees',
    ],
    extractedText: `COURSE SYLLABUS: CS601 - ADVANCED OPERATING SYSTEMS
APEX INSTITUTE OF TECHNOLOGY - DEPARTMENT OF COMPUTER SCIENCE

MODULE 1: VIRTUAL MEMORY SUBSYSTEM & HARDWARE PAGING
1.1 Four-Level Paging on x86-64:
Virtual addresses (48-bit canonical) are partitioned into PGDIR (9 bits), PUD (9 bits), PMD (9 bits), PTE (9 bits), and page offset (12 bits for standard 4KB pages).
1.2 Translation Lookaside Buffer (TLB):
Hardware cache for virtual-to-physical address translations. In multi-core SMP systems, modifying a page table entry requires a 'TLB Shootdown'—initiating an Inter-Processor Interrupt (IPI) to force all cores to invalidate the stale TLB entry, introducing synchronization stalls.
1.3 Copy-on-Write (CoW) Semantics:
During fork(), kernel creates duplicate page table entries referencing parent's physical frames, clearing write permissions on both PTEs. When either process attempts a write, a Page Fault exception (CR2 register holds faulting address) triggers do_wp_page(), which allocates a new physical frame, copies the 4KB data, updates the faulting process's PTE with write permissions, and flushes local TLB.

MODULE 2: CONCURRENCY & LOCK-FREE DATA STRUCTURES
2.1 Hardware Atomics:
Compare-and-Swap (CAS): atomic primitive cmpchg on x86 comparing memory location with expected value; replaces if equal.
The ABA Problem: Thread 1 reads value A; Thread 2 changes A to B and back to A; Thread 1 CAS succeeds despite intervening mutations. Resolved using tagged pointers or double-width CAS (CMPXCHG16B) with monotonic version counters.
2.2 Read-Copy-Update (RCU):
Allows concurrent readers zero lock contention while writers create modified replicas and reclaim stale memory only after all existing readers pass through a quiescent state (grace period).

MODULE 3: HIGH-PERFORMANCE I/O MULTIPLEXING
3.1 Evolution from select/poll to epoll:
- select/poll: O(N) complexity per event loop iteration; copies entire file descriptor set between user space and kernel space on every syscall invocation.
- epoll (epoll_create, epoll_ctl, epoll_wait): Uses a kernel-resident Red-Black tree for monitored FDs (O(log N) registration) and an internal ready-list doubly linked list. When hardware device interrupts trigger network socket readiness, the kernel callback puts the ready event into the ready list. epoll_wait() returns in O(K) time where K is the number of active ready events, eliminating linear polling overhead.
- Edge-Triggered (EPOLLET) vs Level-Triggered (EPOLLLT): Edge-triggered notifies only when state changes, requiring non-blocking sockets and reading until EAGAIN/EWOULDBLOCK.`,
  },
  {
    id: 'pdf-db-internals-702',
    title: 'Modern Database Storage Engines & Query Optimization (IT702)',
    subject: 'Database Systems',
    fileName: 'IT702_Database_Internals_Viva.pdf',
    fileSize: '2.8 MB',
    pageCount: 16,
    uploadedAt: 'Oct 22, 2026',
    status: 'Ready',
    targetType: 'batch',
    assignedBatches: ['2026 IT-A'],
    assignedClass: 'Information Technology',
    assignedStudentIds: ['std-115'],
    createdBy: 'Dr. Marcus Vance (Placement Chair)',
    summary:
      'In-depth examination of B+ Tree vs LSM Tree storage engines, Write-Ahead Logging (WAL) crash recovery via ARIES, Multi-Version Concurrency Control (MVCC), and Serializable Snapshot Isolation.',
    keyTopics: [
      'B+ Tree Fanout & Disk Page Alignment',
      'LSM-Tree (Log-Structured Merge-Tree) & SSTables',
      'Write-Ahead Logging (WAL) & ARIES Recovery Algorithm',
      'Multi-Version Concurrency Control (MVCC) & Vacuuming',
      'Transaction Isolation Levels (Read Committed to SSI)',
      'Cost-Based Query Optimization & Join Algorithms',
    ],
    extractedText: `COURSE SYLLABUS: IT702 - ADVANCED DATABASE ARCHITECTURE
APEX INSTITUTE OF TECHNOLOGY - DEPARTMENT OF INFORMATION TECHNOLOGY

MODULE 1: STORAGE ENGINES: B+ TREES VS LSM TREES
1.1 B+ Tree Engines (InnoDB, Postgres Heap):
- Internal nodes hold routing keys; leaf nodes contain actual data/pointers and are doubly-linked for efficient range scans.
- Optimized for read-intensive workloads with high fanout (typically 100-500 keys per 16KB page), requiring at most 3-4 random disk I/O seeks for billion-row tables.
- Disadvantage: Write amplification and random disk I/O when updating dirty pages in buffer pool.
1.2 Log-Structured Merge-Trees (RocksDB, Cassandra):
- All writes are sequentially appended to a Write-Ahead Log (WAL) and inserted into an in-memory sorted skip-list (MemTable).
- When MemTable reaches threshold size (typically 32-64MB), it is flushed sequentially to disk as an immutable Sorted String Table (SSTable) at Level 0.
- Compaction: Background threads merge sorted SSTables from Level L into Level L+1, deduplicating keys and discarding tombstoned deleted records.
- Bloom Filters: Probabilistic data structures with bit arrays and k hash functions checked before disk reads to determine with zero false negatives if key does not exist.

MODULE 2: TRANSACTION PROCESSING & ARIES RECOVERY
2.1 Write-Ahead Logging (WAL):
The fundamental invariant of WAL states that no dirty data page may be written to non-volatile disk until the corresponding log records describing the modification have been written and flushed to durable storage (fsync).
2.2 ARIES Algorithm (Algorithms for Recovery and Isolation Exploiting Semantics):
- Analysis Pass: Scans WAL forward from the latest checkpoint to reconstruct the Dirty Page Table (DPT) and Transaction Table. Identifies active loser transactions at crash time.
- Redo Pass: Scans forward from the oldest recLSN in the DPT, repeating history by applying all logged modifications (including those of loser transactions) to return database to exact crash state.
- Undo Pass: Scans backwards from the crash point, rolling back modifications made by active loser transactions and writing Compensation Log Records (CLRs) to ensure idempotency during repeated crashes.

MODULE 3: MULTI-VERSION CONCURRENCY CONTROL (MVCC)
In MVCC, writers do not block readers and readers do not block writers. Each row mutation creates a new version tagged with transaction ID (xmin for creation, xmax for deletion/superseding).
Snapshots: A transaction sees rows where xmin was committed prior to transaction start and xmax is either empty or greater than transaction timestamp.
Vacuuming: Background workers reclaim old row versions (dead tuples) once all transactions that could view that snapshot have completed.`,
  },
];
