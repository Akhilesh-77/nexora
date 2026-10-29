export interface GeneratedQuestion {
  branch: string;
  subject: string;
  topic: string;
  role: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hints: string[];
  tags: string[];
}

// Subject definitions and mapping to branches
export const SUBJECT_DEFINITIONS: {
  name: string;
  branch: string;
  role: string;
  topics: string[];
}[] = [
  {
    name: 'Data Structures & Algorithms',
    branch: 'Computer Science and Engineering',
    role: 'Software Developer',
    topics: ['Arrays & Strings', 'Linked Lists', 'Stacks & Queues', 'Trees & BST', 'Graphs', 'Dynamic Programming', 'Searching & Sorting'],
  },
  {
    name: 'Operating Systems',
    branch: 'Computer Science and Engineering',
    role: 'Software Developer',
    topics: ['Processes & Threads', 'CPU Scheduling', 'Process Synchronization', 'Deadlocks', 'Memory Management & Paging', 'File Systems & Storage'],
  },
  {
    name: 'Database Management Systems',
    branch: 'Computer Science and Engineering',
    role: 'Backend Developer',
    topics: ['Relational Model & SQL', 'Normalization & Schema Design', 'Transactions & ACID', 'Concurrency Control', 'Indexing & B-Trees', 'NoSQL & Storage'],
  },
  {
    name: 'Computer Networks',
    branch: 'Information Science and Engineering',
    role: 'Cloud Engineer',
    topics: ['OSI & TCP/IP Models', 'Data Link Layer & Framing', 'IPv4/IPv6 & Subnetting', 'Routing Protocols', 'TCP & Congestion Control', 'Application Layer Protocols'],
  },
  {
    name: 'Digital Electronics & Embedded Systems',
    branch: 'Electronics and Communication Engineering',
    role: 'Embedded Systems Engineer',
    topics: ['Boolean Algebra & Logic Gates', 'Combinational Circuits', 'Sequential Circuits & Flip-Flops', 'Microcontroller Architecture', 'UART, SPI & I2C Protocols', 'Timers & Interrupts'],
  },
  {
    name: 'Signals, Systems & Communication',
    branch: 'Electronics and Communication Engineering',
    role: 'Electronics Engineer',
    topics: ['LTI Systems & Convolution', 'Fourier Series & Transform', 'Laplace & Z-Transform', 'Sampling & Nyquist Theorem', 'Analog & Digital Modulation', 'Noise & Filtering'],
  },
  {
    name: 'Electrical Machines & Power Systems',
    branch: 'Electrical and Electronics Engineering',
    role: 'Power Systems Engineer',
    topics: ['DC Machines & Transformers', 'Induction & Synchronous Motors', 'Transmission Line Modeling', 'Fault Analysis & Symmetrical Components', 'Power System Protection', 'Load Flow Studies'],
  },
  {
    name: 'Control Systems & Instrumentation',
    branch: 'Electrical and Electronics Engineering',
    role: 'Electrical Design Engineer',
    topics: ['Transfer Functions & Block Diagrams', 'Time Response Analysis', 'Routh-Hurwitz Stability', 'Root Locus Techniques', 'Bode Plots & Frequency Response', 'State Space Representation'],
  },
  {
    name: 'Thermodynamics & Thermal Engineering',
    branch: 'Mechanical Engineering',
    role: 'Mechanical Design Engineer',
    topics: ['First Law of Thermodynamics', 'Second Law & Entropy', 'Carnot & Rankine Cycles', 'IC Engines (Otto & Diesel)', 'Steam Properties & Turbines', 'Refrigeration Cycles'],
  },
  {
    name: 'Fluid Mechanics & Heat Transfer',
    branch: 'Mechanical Engineering',
    role: 'Manufacturing Engineer',
    topics: ['Fluid Statics & Buoyancy', 'Bernoulli Equation & Pipe Flow', 'Laminar vs Turbulent Flow', 'Conduction & Fourier Law', 'Convection & Nusselt Number', 'Heat Exchangers & LMTD'],
  },
  {
    name: 'Chemical Reaction Engineering & Plant Design',
    branch: 'Chemical Engineering',
    role: 'Chemical Plant Engineer',
    topics: ['Kinetics & Rate Laws', 'Ideal Reactor Design (Batch, CSTR, PFR)', 'Yield & Selectivity', 'Catalysis & Mass Transfer', 'Distillation & McCabe-Thiele', 'Process Safety & Plant Layout'],
  },
  {
    name: 'Structural Analysis & Concrete Mechanics',
    branch: 'Civil Engineering',
    role: 'Structural Engineer',
    topics: ['Shear Force & Bending Moment', 'Truss & Frame Analysis', 'Stress-Strain & Hooke Law', 'Deflection of Beams', 'RCC Limit State Design', 'Prestressed Concrete Fundamentals'],
  },
  {
    name: 'Surveying & Geotechnical Engineering',
    branch: 'Civil Engineering',
    role: 'Construction/Project Engineer',
    topics: ['Levelling & Total Station', 'Soil Phase Relationships', 'Permeability & Darcy Law', 'Consolidation & Settlement', 'Shear Strength of Soil', 'Foundation Bearing Capacity'],
  },
  {
    name: 'Machine Learning & Artificial Intelligence',
    branch: 'Artificial Intelligence and Machine Learning',
    role: 'Machine Learning Engineer',
    topics: ['Supervised Learning Algorithms', 'Unsupervised Clustering & PCA', 'Neural Networks & Backpropagation', 'Loss Functions & Optimizers', 'Model Evaluation & Cross-Validation', 'Overfitting & Regularization'],
  },
  {
    name: 'Quantitative Aptitude',
    branch: 'All',
    role: 'All',
    topics: ['Percentages & Profit-Loss', 'Time, Speed & Distance', 'Time & Work', 'Ratios & Proportions', 'Permutations, Combinations & Probability', 'Simple & Compound Interest', 'Number Systems'],
  },
  {
    name: 'Logical Reasoning & Critical Thinking',
    branch: 'All',
    role: 'All',
    topics: ['Syllogisms & Deductions', 'Blood Relations', 'Coding-Decoding & Series', 'Seating Arrangements', 'Direction Sense', 'Data Sufficiency', 'Critical Assumptions'],
  },
  {
    name: 'Verbal Ability & Technical Communication',
    branch: 'All',
    role: 'All',
    topics: ['Sentence Correction & Grammar', 'Vocabulary & Synonyms/Antonyms', 'Idiomatic Expressions', 'Paragraph Jumbles', 'Reading Comprehension', 'Technical Writing Precision'],
  },
];

// Helper to shuffle options and maintain correct index
function buildQuestion(
  branch: string,
  subject: string,
  topic: string,
  role: string,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  question: string,
  correctAnswer: string,
  distractors: string[],
  explanation: string,
  hints: string[] = [],
  tags: string[] = []
): GeneratedQuestion {
  const options = [correctAnswer, ...distractors.slice(0, 3)];
  // Deterministic shuffle based on question string length
  const shift = (question.length + correctAnswer.length) % 4;
  const shiftedOptions = [...options];
  const temp = shiftedOptions[0];
  shiftedOptions[0] = shiftedOptions[shift];
  shiftedOptions[shift] = temp;

  const correctIndex = shiftedOptions.indexOf(correctAnswer);

  return {
    branch,
    subject,
    topic,
    role,
    difficulty,
    question,
    options: shiftedOptions,
    correctIndex,
    explanation,
    hints,
    tags,
  };
}

// Generate question sets dynamically using subject-specific knowledge bases
export function generateQuestionBank(): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  for (const subj of SUBJECT_DEFINITIONS) {
    for (const diff of ['Easy', 'Medium', 'Hard'] as const) {
      const targetCount = 70; // 70 Easy, 70 Medium, 70 Hard per subject!
      const generated = generateQuestionsForSubjectDifficulty(subj, diff, targetCount);
      questions.push(...generated);
    }
  }

  return questions;
}

// Internal generator mapping per subject and difficulty
function generateQuestionsForSubjectDifficulty(
  subj: typeof SUBJECT_DEFINITIONS[0],
  difficulty: 'Easy' | 'Medium' | 'Hard',
  count: number
): GeneratedQuestion[] {
  const list: GeneratedQuestion[] = [];
  const { name: subject, branch, role, topics } = subj;

  let topicIndex = 0;

  for (let i = 1; i <= count; i++) {
    const topic = topics[topicIndex % topics.length];
    topicIndex++;

    const item = createSubjectItem(subject, topic, difficulty, i, branch, role);
    list.push(item);
  }

  return list;
}

function createSubjectItem(
  subject: string,
  topic: string,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  index: number,
  branch: string,
  role: string
): GeneratedQuestion {
  // Domain specific question generators
  switch (subject) {
    case 'Data Structures & Algorithms':
      return createDSAQuestion(topic, difficulty, index, branch, role);
    case 'Operating Systems':
      return createOSQuestion(topic, difficulty, index, branch, role);
    case 'Database Management Systems':
      return createDBMSQuestion(topic, difficulty, index, branch, role);
    case 'Computer Networks':
      return createNetworksQuestion(topic, difficulty, index, branch, role);
    case 'Digital Electronics & Embedded Systems':
      return createEmbeddedQuestion(topic, difficulty, index, branch, role);
    case 'Signals, Systems & Communication':
      return createSignalsQuestion(topic, difficulty, index, branch, role);
    case 'Electrical Machines & Power Systems':
      return createPowerQuestion(topic, difficulty, index, branch, role);
    case 'Control Systems & Instrumentation':
      return createControlQuestion(topic, difficulty, index, branch, role);
    case 'Thermodynamics & Thermal Engineering':
      return createThermalQuestion(topic, difficulty, index, branch, role);
    case 'Fluid Mechanics & Heat Transfer':
      return createFluidsQuestion(topic, difficulty, index, branch, role);
    case 'Chemical Reaction Engineering & Plant Design':
      return createChemicalQuestion(topic, difficulty, index, branch, role);
    case 'Structural Analysis & Concrete Mechanics':
      return createCivilStructQuestion(topic, difficulty, index, branch, role);
    case 'Surveying & Geotechnical Engineering':
      return createCivilGeoQuestion(topic, difficulty, index, branch, role);
    case 'Machine Learning & Artificial Intelligence':
      return createMLQuestion(topic, difficulty, index, branch, role);
    case 'Quantitative Aptitude':
      return createAptitudeQuestion(topic, difficulty, index, branch, role);
    case 'Logical Reasoning & Critical Thinking':
      return createLogicQuestion(topic, difficulty, index, branch, role);
    case 'Verbal Ability & Technical Communication':
      return createVerbalQuestion(topic, difficulty, index, branch, role);
    default:
      return buildQuestion(
        branch,
        subject,
        topic,
        role,
        difficulty,
        `In ${subject} (${topic}), what is the primary consideration during analysis #${index}?`,
        'Optimal balance between computational efficiency and resource consumption',
        ['Maximizing arbitrary storage allocation', 'Bypassing protocol error detection', 'Avoiding mathematical constraints'],
        `In engineering analysis, efficiency and resource constraints are fundamental design metrics.`,
        ['Review standard engineering principles'],
        [topic, subject]
      );
  }
}

// 1. Data Structures & Algorithms
function createDSAQuestion(topic: string, diff: string, idx: number, branch: string, role: string): GeneratedQuestion {
  const diffPrefix = diff === 'Easy' ? 'Fundamental' : diff === 'Medium' ? 'Applied' : 'Advanced';
  
  const questionBanks: Record<string, { q: string; a: string; d: string[]; exp: string }[]> = {
    'Arrays & Strings': [
      {
        q: 'What is the worst-case time complexity of searching an element in an unsorted array of size N?',
        a: 'O(N)',
        d: ['O(1)', 'O(log N)', 'O(N^2)'],
        exp: 'In an unsorted array, linear search must examine every element in the worst case, requiring O(N) operations.',
      },
      {
        q: 'In the Two-Pointer technique for finding a pair with target sum in a sorted array, what is the time complexity?',
        a: 'O(N)',
        d: ['O(N log N)', 'O(N^2)', 'O(1)'],
        exp: 'Because the array is already sorted, the two pointers move towards each other at most N steps in total, giving O(N) time.',
      },
      {
        q: 'What is the auxiliary space complexity of finding the longest palindromic substring using Manacher’s algorithm?',
        a: 'O(N)',
        d: ['O(1)', 'O(N^2)', 'O(log N)'],
        exp: 'Manacher’s algorithm transforms the string with delimiters and maintains a radius array of size 2N + 1, using O(N) space.',
      },
      {
        q: 'When reversing an array of size N in-place, what is the minimum number of swap operations required?',
        a: 'floor(N / 2)',
        d: ['N', 'N - 1', '2N'],
        exp: 'An in-place reversal swaps the first and last elements, moving inward until meeting at the middle: floor(N / 2) swaps.',
      },
    ],
    'Linked Lists': [
      {
        q: 'What is the time complexity to insert a new node at the head of a singly linked list?',
        a: 'O(1)',
        d: ['O(N)', 'O(log N)', 'O(N log N)'],
        exp: 'Inserting at the head only requires updating the new node’s next pointer and head pointer, taking constant O(1) time.',
      },
      {
        q: 'Floyd’s Cycle-Finding algorithm (tortoise and hare) detects loops in a linked list using what space complexity?',
        a: 'O(1)',
        d: ['O(N)', 'O(log N)', 'O(N^2)'],
        exp: 'Floyd’s algorithm uses only two pointer variables (slow and fast), so its auxiliary space complexity is O(1).',
      },
      {
        q: 'To delete a node given only a pointer to that node in a singly linked list (not the tail), what is the standard trick?',
        a: 'Copy the data of the next node into the current node and delete the next node',
        d: ['Traverse backwards to find the previous node', 'Set the current node pointer to null', 'Free the memory directly'],
        exp: 'Since backward traversal is impossible in singly linked lists, copying the next node’s data and relinking next.next achieves O(1) deletion.',
      },
    ],
    'Stacks & Queues': [
      {
        q: 'Which data structure is primarily used to evaluate arithmetic expressions written in postfix notation (RPN)?',
        a: 'Stack',
        d: ['Queue', 'Priority Queue', 'Binary Search Tree'],
        exp: 'Operands are pushed onto a stack; upon encountering an operator, the top two operands are popped and the result is pushed back.',
      },
      {
        q: 'What is the amortized time complexity of enqueue and dequeue operations in a queue implemented using two stacks?',
        a: 'O(1)',
        d: ['O(N)', 'O(log N)', 'O(N^2)'],
        exp: 'Each element is pushed and popped at most twice throughout its lifecycle across the two stacks, yielding O(1) amortized time per operation.',
      },
      {
        q: 'In a circular queue implemented using an array of capacity C, how is the full condition typically verified?',
        a: '(rear + 1) % C == front',
        d: ['rear == front', 'rear == C', 'front == -1'],
        exp: 'In a circular queue with one empty slot reserved to differentiate full from empty, (rear + 1) % C == front indicates a full queue.',
      },
    ],
    'Trees & BST': [
      {
        q: 'What traversal of a Binary Search Tree (BST) produces keys in ascending sorted order?',
        a: 'Inorder Traversal (Left, Root, Right)',
        d: ['Preorder Traversal', 'Postorder Traversal', 'Level-order Traversal'],
        exp: 'For every node in a BST, Left < Root < Right. Therefore, Inorder traversal visits keys in monotonically increasing sorted order.',
      },
      {
        q: 'What is the maximum number of nodes in a binary tree of height H (root at height 0)?',
        a: '2^(H+1) - 1',
        d: ['2^H', '2^(H-1)', '2*H + 1'],
        exp: 'A full binary tree has 2^0 + 2^1 + ... + 2^H nodes, which sums to 2^(H+1) - 1 by geometric progression.',
      },
      {
        q: 'What is the balance factor condition for every node in an AVL tree?',
        a: 'Height(Left) - Height(Right) in {-1, 0, 1}',
        d: ['Height(Left) == Height(Right)', 'Balance factor <= 2', 'Height <= log N'],
        exp: 'An AVL tree strictly requires that the difference in heights of the left and right subtrees of any node is at most 1.',
      },
    ],
    'Graphs': [
      {
        q: 'What is the time complexity of Breadth-First Search (BFS) on a graph with V vertices and E edges using an adjacency list?',
        a: 'O(V + E)',
        d: ['O(V * E)', 'O(V^2)', 'O(E log V)'],
        exp: 'BFS visits every vertex once (V) and traverses each incident edge once in directed graphs (E), totaling O(V + E).',
      },
      {
        q: 'Which algorithm finds single-source shortest paths in a directed graph that may contain negative edge weights (detecting negative cycles)?',
        a: 'Bellman-Ford Algorithm',
        d: ['Dijkstra’s Algorithm', 'Kruskal’s Algorithm', 'Prim’s Algorithm'],
        exp: 'Dijkstra fails with negative weights because it greedily finalizes distances. Bellman-Ford relaxes all edges V-1 times, safely handling negative weights.',
      },
      {
        q: 'Topological sorting is strictly defined for which type of graph?',
        a: 'Directed Acyclic Graph (DAG)',
        d: ['Undirected Graph', 'Cyclic Graph', 'Complete Bipartite Graph'],
        exp: 'A topological sort orders vertices such that for every directed edge u -> v, u comes before v. If a cycle exists, no such valid linear ordering is possible.',
      },
    ],
    'Dynamic Programming': [
      {
        q: 'What are the two core prerequisites of an optimization problem that indicate dynamic programming is applicable?',
        a: 'Optimal Substructure and Overlapping Subproblems',
        d: ['Greedy Choice and Divide & Conquer', 'Linear Independence and Convexity', 'State Space Pruning and Tree Search'],
        exp: 'DP caches results of identical subproblems (overlapping subproblems) where optimal solutions to subproblems form optimal global solutions (optimal substructure).',
      },
      {
        q: 'What is the space complexity of solving the 0/1 Knapsack problem with N items and capacity W using a 1D state array?',
        a: 'O(W)',
        d: ['O(N * W)', 'O(N)', 'O(1)'],
        exp: 'By traversing the capacity backwards from W down to item weight w_i, a single row array of size W+1 suffices.',
      },
    ],
    'Searching & Sorting': [
      {
        q: 'Which comparison sorting algorithm guarantees O(N log N) time complexity in the worst case with O(1) auxiliary space?',
        a: 'Heapsort',
        d: ['Quicksort', 'Mergesort', 'Bubble Sort'],
        exp: 'Heapsort builds an in-place heap in O(N) and performs N extractions taking O(log N) each, guaranteeing O(N log N) worst-case time with O(1) space.',
      },
      {
        q: 'What is the average time complexity of Binary Search on a sorted array of N elements?',
        a: 'O(log N)',
        d: ['O(N)', 'O(1)', 'O(N log N)'],
        exp: 'Binary search halves the search space at each comparison step: N, N/2, N/4, ..., terminating in log2(N) steps.',
      },
    ],
  };

  const pool = questionBanks[topic] || questionBanks['Arrays & Strings'];
  const base = pool[(idx - 1) % pool.length];

  const qText = `[${diffPrefix} Problem ${idx}] ${base.q}`;
  return buildQuestion(branch, 'Data Structures & Algorithms', topic, role, diff as any, qText, base.a, base.d, base.exp, ['Recall time-space complexity and structural invariants.'], [topic, 'DSA', diff]);
}

// 2. Operating Systems
function createOSQuestion(topic: string, diff: string, idx: number, branch: string, role: string): GeneratedQuestion {
  const diffPrefix = diff === 'Easy' ? 'Concepts' : diff === 'Medium' ? 'Mechanics' : 'Architecture';

  const bank: Record<string, { q: string; a: string; d: string[]; exp: string }[]> = {
    'Processes & Threads': [
      {
        q: 'Which component is NOT shared between threads belonging to the same process?',
        a: 'CPU Register state and Stack',
        d: ['Address space', 'Global variables', 'Open file descriptors'],
        exp: 'Each thread has its own execution flow, requiring an independent program counter, registers, and stack frame, while sharing text, data, and heap.',
      },
      {
        q: 'What happens during a process context switch?',
        a: 'CPU registers and state of current process are saved to its PCB, and state of next process is loaded',
        d: ['Operating system kernel is reinstalled', 'All RAM memory pages are cleared to disk', 'Virtual memory mapping is permanently destroyed'],
        exp: 'Context switching preserves the execution context in the Process Control Block (PCB) and restores the target process context.',
      },
    ],
    'CPU Scheduling': [
      {
        q: 'Which CPU scheduling algorithm can suffer from the convoy effect?',
        a: 'First-Come, First-Served (FCFS)',
        d: ['Round Robin (RR)', 'Shortest Job First (SJF)', 'Multi-level Feedback Queue'],
        exp: 'In FCFS, when a long CPU-bound process occupies the CPU, short I/O-bound processes wait behind it, causing severe device underutilization.',
      },
      {
        q: 'In Round Robin scheduling, what happens if the time quantum is chosen to be extremely large?',
        a: 'It degenerates into First-Come, First-Served (FCFS)',
        d: ['It degenerates into Shortest Job First', 'Deadlock inevitably occurs', 'Context switch overhead becomes infinite'],
        exp: 'If the time quantum exceeds the longest burst time of any process, every process finishes before preemption, behaving identically to FCFS.',
      },
    ],
    'Process Synchronization': [
      {
        q: 'A binary semaphore initialized to 1 behaves identically to which synchronization primitive?',
        a: 'Mutex lock',
        d: ['Condition variable', 'Spinlock with barrier', 'Read-Write lock'],
        exp: 'A binary semaphore has values restricted to 0 and 1, providing mutual exclusion for critical section access just like a mutex.',
      },
      {
        q: 'What problem occurs when a high-priority process waits for a resource held by a low-priority process, while a medium process runs?',
        a: 'Priority Inversion',
        d: ['Deadlock', 'Starvation', 'Thrashing'],
        exp: 'Priority inversion occurs when a medium priority thread preempts a low priority thread holding a lock required by a high priority thread. Solution: Priority Inheritance.',
      },
    ],
    'Deadlocks': [
      {
        q: 'Which of the following is NOT one of the four Coffman conditions necessary for deadlock to occur?',
        a: 'Preemption of resources',
        d: ['Mutual Exclusion', 'Hold and Wait', 'Circular Wait'],
        exp: 'The Coffman condition is "No Preemption" (resources cannot be forcibly confiscated). If preemption is allowed, deadlock cannot occur.',
      },
      {
        q: 'Banker’s algorithm is used in operating systems for which primary purpose?',
        a: 'Deadlock Avoidance',
        d: ['Deadlock Prevention', 'Deadlock Recovery', 'Process Scheduling'],
        exp: 'Banker’s algorithm tests for safe states before granting resource requests, avoiding entering an unsafe state that could lead to deadlock.',
      },
    ],
    'Memory Management & Paging': [
      {
        q: 'What is the primary role of the Translation Lookaside Buffer (TLB)?',
        a: 'Cache virtual-to-physical page table translations in hardware to speed up memory access',
        d: ['Store disk blocks in RAM cache', 'Manage CPU register spilling', 'Prevent buffer overflow attacks'],
        exp: 'The TLB is an associative hardware cache inside the MMU that stores recent virtual-to-physical address mappings, avoiding costly multi-level page table lookups.',
      },
      {
        q: 'What phenomenon occurs when the system spends more time paging data between RAM and disk than executing user instructions?',
        a: 'Thrashing',
        d: ['Deadlock', 'Fragmentation', 'Paging fault saturation'],
        exp: 'Thrashing occurs when total working set sizes exceed physical memory, causing continuous page faults and near-zero CPU throughput.',
      },
    ],
  };

  const pool = bank[topic] || bank['Processes & Threads'];
  const base = pool[(idx - 1) % pool.length];
  const qText = `[${diffPrefix} OS Question ${idx}] ${base.q}`;
  return buildQuestion(branch, 'Operating Systems', topic, role, diff as any, qText, base.a, base.d, base.exp, ['Consider kernel data structures and memory boundaries.'], [topic, 'OS', diff]);
}

// 3. Database Management Systems (DBMS)
function createDBMSQuestion(topic: string, diff: string, idx: number, branch: string, role: string): GeneratedQuestion {
  const bank: Record<string, { q: string; a: string; d: string[]; exp: string }[]> = {
    'Relational Model & SQL': [
      {
        q: 'What is the result of an INNER JOIN between two tables where no rows satisfy the join condition?',
        a: 'An empty result set with 0 rows',
        d: ['A Cartesian product of all rows', 'A table with NULLs in all columns', 'A syntax runtime error'],
        exp: 'An INNER JOIN only emits matching tuples. If no rows satisfy the ON predicate, the result is completely empty.',
      },
      {
        q: 'Which SQL clause is used to filter aggregated group results produced by GROUP BY?',
        a: 'HAVING',
        d: ['WHERE', 'ORDER BY', 'FILTER'],
        exp: 'WHERE filters individual candidate rows before grouping; HAVING filters the aggregated groups after calculation.',
      },
    ],
    'Normalization & Schema Design': [
      {
        q: 'A relation is in Boyce-Codd Normal Form (BCNF) if and only if for every non-trivial functional dependency X -> Y:',
        a: 'X is a superkey',
        d: ['Y is a prime attribute', 'X is a foreign key', 'Y is functionally dependent on the primary key'],
        exp: 'BCNF eliminates all redundancy from functional dependencies by requiring the determinant X of every dependency X -> Y to be a superkey.',
      },
      {
        q: 'What type of dependency is strictly prohibited in Third Normal Form (3NF)?',
        a: 'Transitive dependency of non-prime attributes on candidate keys',
        d: ['Partial dependency on candidate keys', 'Multivalued dependency', 'Join dependency'],
        exp: '2NF removes partial dependencies; 3NF further removes transitive dependencies (where a non-prime attribute determines another non-prime attribute).',
      },
    ],
    'Transactions & ACID': [
      {
        q: 'Which ACID property guarantees that all operations of a transaction complete successfully or none are applied?',
        a: 'Atomicity',
        d: ['Consistency', 'Isolation', 'Durability'],
        exp: 'Atomicity ensures "all or nothing" execution: if any statement fails, the transaction is completely rolled back.',
      },
      {
        q: 'Which transaction isolation level prevents dirty reads, non-repeatable reads, and phantom reads?',
        a: 'Serializable',
        d: ['Read Committed', 'Repeatable Read', 'Read Uncommitted'],
        exp: 'Serializable is the highest ANSI SQL isolation level, executing concurrent transactions equivalent to some strict serial order.',
      },
    ],
    'Indexing & B-Trees': [
      {
        q: 'Why are B+ Trees preferred over B-Trees for database indexing on disk storage?',
        a: 'Leaf nodes are linked in a sequential linked list, allowing high-performance range scans and higher fan-out in internal nodes',
        d: ['B+ Trees require zero memory during insertion', 'B+ Trees have O(1) worst-case search time', 'B+ Trees cannot have duplicate keys'],
        exp: 'In B+ Trees, data pointers reside only in leaves. Internal nodes store only keys, maximizing branching factor, and leaves form a linked list for rapid range traversals.',
      },
    ],
  };

  const pool = bank[topic] || bank['Relational Model & SQL'];
  const base = pool[(idx - 1) % pool.length];
  return buildQuestion(branch, 'Database Management Systems', topic, role, diff as any, `[DBMS ${diff} #${idx}] ${base.q}`, base.a, base.d, base.exp, ['Think about ACID, relational algebra, and disk I/O.'], [topic, 'DBMS', diff]);
}

// 4. Computer Networks
function createNetworksQuestion(topic: string, diff: string, idx: number, branch: string, role: string): GeneratedQuestion {
  const bank: Record<string, { q: string; a: string; d: string[]; exp: string }[]> = {
    'OSI & TCP/IP Models': [
      {
        q: 'At which OSI layer do routers primarily operate to forward packets based on logical IP addresses?',
        a: 'Network Layer (Layer 3)',
        d: ['Data Link Layer (Layer 2)', 'Transport Layer (Layer 4)', 'Session Layer (Layer 5)'],
        exp: 'Routers examine Layer 3 headers containing source and destination IP addresses to make packet forwarding decisions.',
      },
      {
        q: 'What is the correct order of packet encapsulation from highest to lowest layer?',
        a: 'Data -> Segment -> Packet -> Frame -> Bits',
        d: ['Data -> Frame -> Segment -> Packet -> Bits', 'Bits -> Frame -> Packet -> Segment -> Data', 'Packet -> Segment -> Frame -> Bits'],
        exp: 'Application data is encapsulated into Transport segments, Network packets, Data Link frames, and Physical bits.',
      },
    ],
    'IPv4/IPv6 & Subnetting': [
      {
        q: 'How many usable host IP addresses are available in a /28 IPv4 subnet?',
        a: '14',
        d: ['16', '30', '12'],
        exp: 'A /28 subnet has 32 - 28 = 4 host bits. Total IPs = 2^4 = 16. Subtracting the network address and broadcast address leaves 14 usable host IPs.',
      },
      {
        q: 'What is the length in bits of an IPv6 address compared to an IPv4 address?',
        a: '128 bits for IPv6 vs 32 bits for IPv4',
        d: ['64 bits for IPv6 vs 32 bits for IPv4', '256 bits for IPv6 vs 64 bits for IPv4', '128 bits for IPv6 vs 64 bits for IPv4'],
        exp: 'IPv4 uses 32-bit addresses (~4.3 billion); IPv6 expands this to 128 bits (3.4 x 10^38 unique addresses).',
      },
    ],
    'TCP & Congestion Control': [
      {
        q: 'What are the three flags exchanged during the standard TCP 3-way handshake?',
        a: 'SYN -> SYN-ACK -> ACK',
        d: ['SYN -> ACK -> DATA', 'ACK -> SYN -> ACK', 'FIN -> ACK -> FIN-ACK'],
        exp: 'Client sends SYN; server responds with SYN-ACK; client confirms with ACK, establishing the bidirectional connection.',
      },
      {
        q: 'In TCP congestion control, what happens upon detecting packet loss via Triple Duplicate ACKs in TCP Reno?',
        a: 'Fast Recovery: Slow Start Threshold is set to half current cwnd, and cwnd is reduced to ssthresh + 3',
        d: ['cwnd is immediately reset to 1 MSS', 'Connection is terminated', 'Window size is doubled immediately'],
        exp: 'Triple duplicate ACKs indicate light packet loss (other packets arrived). Fast Retransmit / Fast Recovery avoids resetting cwnd to 1.',
      },
    ],
  };

  const pool = bank[topic] || bank['OSI & TCP/IP Models'];
  const base = pool[(idx - 1) % pool.length];
  return buildQuestion(branch, 'Computer Networks', topic, role, diff as any, `[Networks ${diff} #${idx}] ${base.q}`, base.a, base.d, base.exp, ['Think about headers, protocols, and layering.'], [topic, 'Networks', diff]);
}

// 5. Digital Electronics & Embedded Systems
function createEmbeddedQuestion(topic: string, diff: string, idx: number, branch: string, role: string): GeneratedQuestion {
  const bank: Record<string, { q: string; a: string; d: string[]; exp: string }[]> = {
    'UART, SPI & I2C Protocols': [
      {
        q: 'How many wires does standard SPI protocol require for bidirectional master-slave communication?',
        a: '4 (SCLK, MOSI, MISO, CS/SS)',
        d: ['2 (SDA, SCL)', '3 (TX, RX, GND)', '1 (1-Wire)'],
        exp: 'SPI requires Master Out Slave In (MOSI), Master In Slave Out (MISO), Serial Clock (SCLK), and Chip Select (CS).',
      },
      {
        q: 'Why do both SDA and SCL lines in I2C require external pull-up resistors?',
        a: 'Because the I2C output driver stages are open-drain (or open-collector)',
        d: ['To limit transmission bandwidth', 'To prevent current leakage into GND', 'Because voltage levels exceed 12V'],
        exp: 'I2C uses open-drain outputs to allow multiple devices on the bus without short circuits. Passive pull-up resistors pull lines HIGH when idle.',
      },
    ],
    'Microcontroller Architecture': [
      {
        q: 'What is the fundamental difference between Harvard architecture and von Neumann architecture?',
        a: 'Harvard uses separate physical memory buses for program code and data, while von Neumann shares one bus',
        d: ['Harvard microcontrollers have no ALU', 'von Neumann architecture cannot execute C programs', 'Harvard does not support interrupts'],
        exp: 'Harvard architecture allows simultaneous instruction fetching and data reading/writing, avoiding the von Neumann bottleneck.',
      },
    ],
  };

  const pool = bank[topic] || bank['UART, SPI & I2C Protocols'];
  const base = pool[(idx - 1) % pool.length];
  return buildQuestion(branch, 'Digital Electronics & Embedded Systems', topic, role, diff as any, `[Embedded ${diff} #${idx}] ${base.q}`, base.a, base.d, base.exp, ['Review hardware interfaces and timing diagrams.'], [topic, 'Embedded', diff]);
}

// 6. Signals, Systems & Communication
function createSignalsQuestion(topic: string, diff: string, idx: number, branch: string, role: string): GeneratedQuestion {
  return buildQuestion(
    branch,
    'Signals, Systems & Communication',
    topic,
    role,
    diff as any,
    `[Signals ${diff} #${idx}] According to the Nyquist-Shannon sampling theorem, what is the minimum sampling frequency fs required to reconstruct a signal with maximum frequency fm = 15 kHz without aliasing?`,
    '30 kHz (fs >= 2 * fm)',
    ['15 kHz', '7.5 kHz', '60 kHz'],
    `The Nyquist criterion states fs >= 2 * B. For a maximum frequency of 15 kHz, minimum sampling rate is 2 * 15 = 30 kHz.`,
    ['fs >= 2 * f_max'],
    ['Nyquist', 'Sampling', diff]
  );
}

// 7. Electrical Machines & Power Systems
function createPowerQuestion(topic: string, diff: string, idx: number, branch: string, role: string): GeneratedQuestion {
  return buildQuestion(
    branch,
    'Electrical Machines & Power Systems',
    topic,
    role,
    diff as any,
    `[Electrical ${diff} #${idx}] What is the synchronous speed Ns of a 4-pole, 50 Hz AC induction motor?`,
    '1500 RPM',
    ['3000 RPM', '1000 RPM', '750 RPM'],
    `Synchronous speed is calculated as Ns = (120 * f) / P = (120 * 50) / 4 = 6000 / 4 = 1500 RPM.`,
    ['Ns = 120 * f / P'],
    ['Machines', 'Induction', diff]
  );
}

// 8. Control Systems & Instrumentation
function createControlQuestion(topic: string, diff: string, idx: number, branch: string, role: string): GeneratedQuestion {
  return buildQuestion(
    branch,
    'Control Systems & Instrumentation',
    topic,
    role,
    diff as any,
    `[Control ${diff} #${idx}] What is the damping ratio zeta of a critically damped second-order closed-loop system?`,
    'zeta = 1.0',
    ['zeta = 0', '0 < zeta < 1', 'zeta > 1'],
    `A second-order system is underdamped when 0 < zeta < 1, undamped when zeta = 0, critically damped when zeta = 1, and overdamped when zeta > 1.`,
    ['Recall standard second-order response regimes.'],
    ['Control', 'Damping', diff]
  );
}

// 9. Thermodynamics & Thermal Engineering
function createThermalQuestion(topic: string, diff: string, idx: number, branch: string, role: string): GeneratedQuestion {
  return buildQuestion(
    branch,
    'Thermodynamics & Thermal Engineering',
    topic,
    role,
    diff as any,
    `[Thermal ${diff} #${idx}] What is the maximum theoretical efficiency of a Carnot heat engine operating between a source at 600 K and a sink at 300 K?`,
    '50%',
    ['100%', '33.3%', '75%'],
    `Carnot efficiency eta = 1 - (T_cold / T_hot) = 1 - (300 / 600) = 1 - 0.5 = 0.5 (50%).`,
    ['eta = 1 - Tc / Th in absolute Kelvin.'],
    ['Thermodynamics', 'Carnot', diff]
  );
}

// 10. Fluid Mechanics & Heat Transfer
function createFluidsQuestion(topic: string, diff: string, idx: number, branch: string, role: string): GeneratedQuestion {
  return buildQuestion(
    branch,
    'Fluid Mechanics & Heat Transfer',
    topic,
    role,
    diff as any,
    `[Fluids ${diff} #${idx}] In internal pipe flow, for what Reynolds number (Re) is flow considered strictly laminar?`,
    'Re < 2000',
    ['Re > 4000', '2000 < Re < 4000', 'Re > 10000'],
    `For flow through circular pipes, the critical Reynolds number is approximately 2000: laminar below 2000, transitional between 2000 and 4000, and turbulent above 4000.`,
    ['Re = rho * v * D / mu'],
    ['Fluids', 'Reynolds', diff]
  );
}

// 11. Chemical Reaction Engineering & Plant Design
function createChemicalQuestion(topic: string, diff: string, idx: number, branch: string, role: string): GeneratedQuestion {
  return buildQuestion(
    branch,
    'Chemical Reaction Engineering & Plant Design',
    topic,
    role,
    diff as any,
    `[Chemical ${diff} #${idx}] In an ideal Continuous Stirred-Tank Reactor (CSTR), how does the outlet concentration relate to the internal reactor fluid concentration?`,
    'The outlet stream has identical concentration and temperature to the fluid inside the reactor',
    ['The outlet stream has zero reactant concentration', 'The internal concentration is strictly higher than outlet', 'Concentration decreases exponentially along the length'],
    `Because an ideal CSTR operates under instantaneous, perfect mixing, the composition of any exit stream is identical to that inside the vessel.`,
    ['CSTR assumptions: perfect spatial homogeneity.'],
    ['CSTR', 'Reaction', diff]
  );
}

// 12. Structural Analysis & Concrete Mechanics
function createCivilStructQuestion(topic: string, diff: string, idx: number, branch: string, role: string): GeneratedQuestion {
  return buildQuestion(
    branch,
    'Structural Analysis & Concrete Mechanics',
    topic,
    role,
    diff as any,
    `[Civil Struct ${diff} #${idx}] What is the maximum bending moment in a simply supported beam of span L carrying a uniformly distributed load (UDL) of w per unit length?`,
    '(w * L^2) / 8 at midspan',
    ['(w * L^2) / 2', '(w * L) / 4', '(w * L^2) / 12'],
    `For a simply supported beam with uniform load w: Reaction R = w*L/2. Bending moment at x is M(x) = (w*L/2)*x - (w*x^2)/2. Max occurs at x = L/2 where M_max = w*L^2 / 8.`,
    ['Standard equilibrium moment equations.'],
    ['Structures', 'Beams', diff]
  );
}

// 13. Surveying & Geotechnical Engineering
function createCivilGeoQuestion(topic: string, diff: string, idx: number, branch: string, role: string): GeneratedQuestion {
  return buildQuestion(
    branch,
    'Surveying & Geotechnical Engineering',
    topic,
    role,
    diff as any,
    `[Geotechnical ${diff} #${idx}] According to Darcy’s law for laminar flow through saturated soil, the discharge velocity v is proportional to:`,
    'The hydraulic gradient (i = h / L)',
    ['The square of the hydraulic gradient', 'The depth of the bedrock', 'The inverse of soil porosity'],
    `Darcy’s law states v = k * i, where v is discharge velocity, k is the coefficient of permeability, and i is the hydraulic gradient.`,
    ['v = k * i'],
    ['Soil', 'Darcy', diff]
  );
}

// 14. Machine Learning & Artificial Intelligence
function createMLQuestion(topic: string, diff: string, idx: number, branch: string, role: string): GeneratedQuestion {
  const bank = [
    {
      q: 'Which regularization technique adds the sum of absolute values of weights (L1 penalty) to the loss function, inducing sparsity?',
      a: 'Lasso Regularization (L1)',
      d: ['Ridge Regularization (L2)', 'Dropout Regularization', 'Batch Normalization'],
      exp: 'L1 regularization shrinks less important feature weights exactly to zero, performing implicit feature selection.',
    },
    {
      q: 'When evaluating a classification model on an imbalanced dataset where false negatives are extremely costly (e.g. cancer detection), which metric should be prioritized?',
      a: 'Recall (Sensitivity)',
      d: ['Precision', 'Accuracy', 'Specificity'],
      exp: 'Recall = TP / (TP + FN). Minimizing false negatives maximizes recall, ensuring positive cases are not missed.',
    },
    {
      q: 'What is the vanishing gradient problem in deep neural networks and which activation function mitigates it?',
      a: 'Gradients shrink exponentially during backpropagation in deep layers; ReLU mitigates it by having a constant gradient of 1 for x > 0',
      d: ['Gradients grow to infinity; Sigmoid mitigates it', 'Weights become negative; Tanh mitigates it', 'Loss function oscillates; Softmax fixes it'],
      exp: 'Sigmoid and tanh saturate with derivatives < 0.25. Multiplying small gradients across many layers causes them to vanish. ReLU avoids saturation for positive activations.',
    },
  ];

  const item = bank[(idx - 1) % bank.length];
  return buildQuestion(branch, 'Machine Learning & Artificial Intelligence', topic, role, diff as any, `[ML ${diff} #${idx}] ${item.q}`, item.a, item.d, item.exp, ['Think about loss landscapes and statistical metrics.'], [topic, 'ML', diff]);
}

// 15. Quantitative Aptitude
function createAptitudeQuestion(topic: string, diff: string, idx: number, branch: string, role: string): GeneratedQuestion {
  const n = idx * 3;
  if (topic.includes('Percentages')) {
    const cost = 200 + n * 10;
    const profitPct = 20;
    const sp = Math.round(cost * (1 + profitPct / 100));
    return buildQuestion(
      branch,
      'Quantitative Aptitude',
      topic,
      role,
      diff as any,
      `[Aptitude #${idx}] An article with cost price $${cost} is sold at a profit of ${profitPct}%. What is its selling price?`,
      `$${sp}`,
      [`$${sp - 15}`, `$${sp + 20}`, `$${sp + 35}`],
      `Selling price = Cost Price * (1 + Profit% / 100) = ${cost} * 1.20 = $${sp}.`,
      ['SP = CP * (100 + P%) / 100'],
      ['Profit & Loss', diff]
    );
  }

  if (topic.includes('Time, Speed')) {
    const speed = 60;
    const timeHours = (idx % 4) + 2;
    const dist = speed * timeHours;
    return buildQuestion(
      branch,
      'Quantitative Aptitude',
      topic,
      role,
      diff as any,
      `[Aptitude #${idx}] A train travels at an average speed of ${speed} km/h for ${timeHours} hours. What total distance does it cover?`,
      `${dist} km`,
      [`${dist - 30} km`, `${dist + 40} km`, `${dist + 60} km`],
      `Distance = Speed * Time = ${speed} km/h * ${timeHours} h = ${dist} km.`,
      ['Distance = Speed * Time'],
      ['Time & Distance', diff]
    );
  }

  if (topic.includes('Time & Work')) {
    const daysA = 10;
    const daysB = 15;
    const combinedDays = 6; // 1/10 + 1/15 = 5/30 = 1/6
    return buildQuestion(
      branch,
      'Quantitative Aptitude',
      topic,
      role,
      diff as any,
      `[Aptitude #${idx}] Person A can complete a project in ${daysA} days and Person B can complete it in ${daysB} days. Working together, in how many days will they finish the project?`,
      `${combinedDays} days`,
      ['7.5 days', '5 days', '8 days'],
      `Combined rate per day = (1/${daysA}) + (1/${daysB}) = (3 + 2)/30 = 5/30 = 1/6. Days required = 6 days.`,
      ['Combined time = (A * B) / (A + B)'],
      ['Time & Work', diff]
    );
  }

  // Generic quantitative probability
  return buildQuestion(
    branch,
    'Quantitative Aptitude',
    topic,
    role,
    diff as any,
    `[Aptitude #${idx}] Two unbiased six-sided dice are rolled simultaneously. What is the probability that the sum of the numbers shown is equal to 7?`,
    '1/6 (or 6/36)',
    ['1/12', '1/4', '5/36'],
    `Total outcomes = 6 * 6 = 36. Favorable outcomes for sum 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 pairs. Probability = 6/36 = 1/6.`,
    ['Find favorable outcomes over total sample space.'],
    ['Probability', diff]
  );
}

// 16. Logical Reasoning
function createLogicQuestion(topic: string, diff: string, idx: number, branch: string, role: string): GeneratedQuestion {
  return buildQuestion(
    branch,
    'Logical Reasoning & Critical Thinking',
    topic,
    role,
    diff as any,
    `[Reasoning #${idx}] Statements: All engineers are problem solvers. Some problem solvers are inventors. Conclusion: (I) Some inventors are engineers. (II) Some engineers are inventors.`,
    'Neither Conclusion I nor II follows conclusively',
    ['Only Conclusion I follows', 'Only Conclusion II follows', 'Both Conclusions follow'],
    `Let E subset P. Some P are I. The intersection between E and I may be empty. Thus neither conclusion follows with certainty.`,
    ['Draw a Venn diagram showing set inclusion.'],
    ['Syllogism', diff]
  );
}

// 17. Verbal Ability
function createVerbalQuestion(topic: string, diff: string, idx: number, branch: string, role: string): GeneratedQuestion {
  return buildQuestion(
    branch,
    'Verbal Ability & Technical Communication',
    topic,
    role,
    diff as any,
    `[Verbal #${idx}] Identify the grammatically correct sentence adhering to standard subject-verb agreement:`,
    'Neither the software lead nor the junior developers were prepared for the abrupt server outage.',
    [
      'Neither the software lead nor the junior developers was prepared for the abrupt server outage.',
      'Either the engineers or the manager are attending the conference.',
      'A collection of algorithmic challenges are available on the repository.',
    ],
    `When compound subjects are connected by "neither... nor", the verb agrees in number with the subject closer to it ("junior developers" is plural -> "were").`,
    ['Proximity rule for neither/nor.'],
    ['Grammar', diff]
  );
}

