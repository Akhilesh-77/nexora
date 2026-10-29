export interface SeedStudyModule {
  moduleId: string;
  branch: string;
  subject: string;
  title: string;
  estimatedMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  order: number;
  learningObjectives: string[];
  prerequisites: string[];
  conceptIntroduction: string;
  simpleDefinition: string;
  detailedExplanation: string;
  importantTerminology: { term: string; definition: string }[];
  technicalArtifact?: {
    type: 'formula' | 'code' | 'diagram';
    title: string;
    content: string;
    explanation: string;
  };
  workedExamples: {
    title: string;
    scenario: string;
    stepByStep: string[];
    takeaway: string;
  }[];
  practicalApplications: string[];
  commonMistakes: { mistake: string; whyWrong: string; correctWay: string }[];
  practiceExercises: {
    title: string;
    problem: string;
    hint: string;
    solution: string;
  }[];
  knowledgeCheck: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  interviewPreparation?: {
    question: string;
    modelAnswer: string;
    recruiterTips: string;
  }[];
  revisionNotes: string[];
}

export const ADDITIONAL_STUDY_MODULES: SeedStudyModule[] = [
  // 1. CSE: Data Structures - Self-Balancing Trees (AVL & Red-Black)
  {
    moduleId: 'cse-mod-2',
    branch: 'Computer Science and Engineering',
    subject: 'Data Structures & Algorithms',
    title: 'Self-Balancing Binary Search Trees: AVL Rotations & Red-Black Invariants',
    estimatedMinutes: 30,
    difficulty: 'Medium',
    order: 2,
    learningObjectives: [
      'Analyze why standard Binary Search Trees degrade to O(n) linear chains on sorted inputs.',
      'Calculate Balance Factor BF = height(left) - height(right) and detect AVL imbalances.',
      'Execute Single (LL, RR) and Double (LR, RL) tree rotations in O(1) pointer updates.',
      'Contrast AVL trees (strictly balanced) with Red-Black trees (relaxed balance, fewer recoloring rotations).',
    ],
    prerequisites: ['Binary Search Tree properties (left < root < right)', 'Recursion and pointer manipulation'],
    conceptIntroduction:
      'A standard Binary Search Tree guarantees O(log n) search only when balanced. If elements are inserted in ascending order [1, 2, 3, 4, 5], the tree degenerates into a singly linked list with disastrous O(n) search time. Self-balancing trees automatically restore logarithmic depth after every insertion and deletion via constant-time subtree rotations.',
    simpleDefinition:
      'A self-balancing BST automatically maintains a tree height of O(log n) during insertions and deletions, ensuring guaranteed O(log n) worst-case search, insertion, and deletion times.',
    detailedExplanation:
      'In an AVL Tree, every node satisfies the invariant: |Balance Factor| <= 1, where BF(node) = height(left) - height(right). Whenever an insertion produces BF = +2 or BF = -2, an imbalance has occurred in one of four configurations:\n\n1. Left-Left (LL): Solved by a single Right Rotation at node.\n2. Right-Right (RR): Solved by a single Left Rotation at node.\n3. Left-Right (LR): Left child is right-heavy. Solved by Left Rotation on child, then Right Rotation on node.\n4. Right-Left (RL): Right child is left-heavy. Solved by Right Rotation on child, then Left Rotation on node.\n\nIn contrast, Red-Black Trees (used in C++ std::map and Java TreeMap) enforce color rules: the root is Black, no two consecutive Red nodes exist, and every path from root to null leaves contains the exact same number of Black nodes. This permits heights up to 2 * log2(n + 1), resulting in faster insertions with fewer rotations.',
    importantTerminology: [
      { term: 'Balance Factor', definition: 'The difference in height between a node\'s left subtree and right subtree: BF = height(left) - height(right).' },
      { term: 'Tree Rotation', definition: 'A local pointer transformation that alters tree height without violating the in-order binary search invariant.' },
      { term: 'Black Height', definition: 'In a Red-Black tree, the number of black nodes from any given node down to any leaf.' },
      { term: 'Strict vs Relaxed Balance', definition: 'AVL is strictly balanced (|BF| <= 1), optimal for read-heavy workloads. Red-Black is relaxed, optimal for write-heavy workloads.' },
    ],
    technicalArtifact: {
      type: 'code',
      title: 'AVL Right Rotation (LL Imbalance)',
      content: `def right_rotate(y):
    x = y.left
    T2 = x.right
    # Perform rotation
    x.right = y
    y.left = T2
    # Update heights
    y.height = 1 + max(get_height(y.left), get_height(y.right))
    x.height = 1 + max(get_height(x.left), get_height(x.right))
    return x  # New subtree root`,
      explanation: 'Only 3 pointer reassignments and height recalculations occur. Runtime is strictly O(1) time and space.',
    },
    workedExamples: [
      {
        title: 'Resolving a Left-Right (LR) Imbalance after Inserting 4',
        scenario: 'Initial AVL tree has Root=5, 5.left=3. We insert key 4 into the tree. 4 becomes 3.right.',
        stepByStep: [
          'Calculate Balance Factor of Root (5): Left height=2 (nodes 3, 4), Right height=0 -> BF = +2 (Imbalance).',
          'Inspect left child (3): Left height=0, Right height=1 -> BF = -1.',
          'Diagnosis: Left-Right (LR) case because BF(5) = +2 and BF(3) = -1.',
          'Step 1: Perform Left Rotation on child node 3. Node 4 becomes left child of 5, and 3 becomes left child of 4.',
          'Step 2: Perform Right Rotation on root node 5. Node 4 becomes the new subtree root, with 3 on left and 5 on right.',
          'Final State: Root=4, 4.left=3, 4.right=5. Heights are perfectly balanced with BF = 0.',
        ],
        takeaway: 'A Double Rotation (LR) converts the zig-zag path into a straight zig-zig path before applying the final counter-rotation.',
      },
    ],
    practicalApplications: [
      'Linux Kernel CPU CFS Scheduler (Red-Black tree orders runnable tasks by virtual runtime).',
      'Database Indexing and B+ Tree node splitting algorithms.',
      'C++ STL std::set and std::map implementation.',
      'In-memory IP routing lookup tables.',
    ],
    commonMistakes: [
      {
        mistake: 'Assuming a single rotation can fix a Left-Right (LR) imbalance.',
        whyWrong: 'A right rotation directly on node 5 without first straightening node 3 leaves node 4 misplaced, violating balance.',
        correctWay: 'Always identify whether the imbalance is zig-zag (Double rotation needed) or straight (Single rotation needed).',
      },
    ],
    practiceExercises: [
      {
        title: 'AVL Insertion Sequence',
        problem: 'Given an initially empty AVL tree, insert keys [10, 20, 30, 25, 28]. What is the root of the tree after all insertions?',
        hint: 'Inserting 30 causes an RR imbalance at 10. Inserting 25 causes an RL imbalance at 20.',
        solution: 'After inserting 10, 20, 30: Left rotation at 10 makes 20 the root (left=10, right=30). Inserting 25, then 28 causes an RL imbalance at 30. After rotations, 25 becomes root of the right subtree. Overall tree root remains 20.',
      },
    ],
    knowledgeCheck: [
      {
        question: 'What is the maximum allowed height of an AVL tree containing n nodes?',
        options: ['1.44 * log2(n)', '2 * n', 'n / 2', 'log10(n)'],
        correctIndex: 0,
        explanation: 'Due to the strict balance factor (|BF| <= 1), the maximum height of an AVL tree is bounded by ~1.44 * log2(n + 2) - 0.328, strictly O(log n).',
      },
      {
        question: 'Why does Java TreeMap use a Red-Black Tree instead of an AVL Tree?',
        options: [
          'Red-Black trees require fewer rotations during frequent insertions and deletions (at most 2 rotations for insert, 3 for delete).',
          'AVL trees cannot store comparable keys.',
          'Red-Black trees do not consume memory for pointers.',
          'Red-Black trees have lower search depth than AVL trees.',
        ],
        correctIndex: 0,
        explanation: 'Red-Black trees permit slightly less strict balancing, which dramatically reduces costly rebalancing rotations during insertions and deletions in write-heavy collections.',
      },
    ],
    revisionNotes: [
      'AVL Balance Factor: BF = height(L) - height(R). Valid range: {-1, 0, +1}.',
      'Rotations: LL -> Right Rotate; RR -> Left Rotate; LR -> Left Rotate child then Right Rotate root; RL -> Right Rotate child then Left Rotate root.',
      'Time complexity for AVL: Search O(log n), Insert O(log n), Delete O(log n). Space: O(n).',
    ],
  },

  // 2. CSE: DBMS - Relational Normalization
  {
    moduleId: 'cse-mod-3',
    branch: 'Computer Science and Engineering',
    subject: 'Database Management Systems',
    title: 'Relational Database Normalization: 1NF, 2NF, 3NF & Boyce-Codd Normal Form (BCNF)',
    estimatedMinutes: 25,
    difficulty: 'Medium',
    order: 3,
    learningObjectives: [
      'Identify update, insertion, and deletion anomalies in unnormalized database tables.',
      'Define functional dependencies X -> Y and compute attribute closures X+.',
      'Progressively decompose schemas through 1NF, 2NF, 3NF, and BCNF.',
      'Evaluate lossless-join decomposition and dependency preservation properties.',
    ],
    prerequisites: ['Relational Model concepts (Tuples, Attributes, Primary Keys, Foreign Keys)', 'Basic SQL SELECT and JOIN queries'],
    conceptIntroduction:
      'Poorly designed database schemas store duplicate data across rows. This redundancy causes update anomalies (modifying data in one row leaves copies inconsistent), insertion anomalies (unable to insert an entity without an unrelated key), and deletion anomalies (deleting one fact accidentally destroys another). Normalization is the mathematical decomposition of relations into clean, non-redundant forms.',
    simpleDefinition:
      'Normalization is the systematic process of organizing relational database tables to eliminate data redundancy and prevent insert, update, and delete anomalies by ensuring functional dependencies are properly keyed.',
    detailedExplanation:
      'A functional dependency X -> Y states that if two tuples agree on attribute X, they must also agree on attribute Y.\n\n1. First Normal Form (1NF): Every column must contain atomic (indivisible) values. No multi-valued sets or repeating groups.\n2. Second Normal Form (2NF): Must be in 1NF, and every non-prime attribute must be FULLY functionally dependent on the entire primary key (no partial dependencies on a subset of a composite candidate key).\n3. Third Normal Form (3NF): Must be in 2NF, and NO transitive dependencies can exist: for every non-trivial X -> Y, either X is a superkey OR Y is a prime attribute.\n4. Boyce-Codd Normal Form (BCNF): A stricter version of 3NF. For every non-trivial functional dependency X -> Y, X MUST be a superkey. BCNF guarantees zero redundancy from functional dependencies, but may occasionally sacrifice dependency preservation.',
    importantTerminology: [
      { term: 'Functional Dependency (FD)', definition: 'A constraint between two sets of attributes in a relation: X uniquely determines Y (written X -> Y).' },
      { term: 'Candidate Key', definition: 'A minimal superkey—a set of attributes that uniquely identifies every tuple with no extraneous attributes.' },
      { term: 'Prime Attribute', definition: 'An attribute that is a member of at least one candidate key of the relation.' },
      { term: 'Lossless-Join Decomposition', definition: 'A decomposition of relation R into R1 and R2 such that R1 NATURAL JOIN R2 is guaranteed to reproduce the exact original relation R without spurious tuples.' },
    ],
    technicalArtifact: {
      type: 'formula',
      title: 'Lossless-Join Condition & BCNF Test',
      content: `Lossless-Join Rule:
R1 ∩ R2 -> R1   OR   R1 ∩ R2 -> R2
(The common attributes between decomposed tables MUST form a superkey of at least one table).

BCNF Requirement:
For all FDs X -> Y:
X must be a Superkey of the relation.`,
      explanation: 'If common attributes are not a superkey in at least one table, joining them produces spurious false tuples.',
    },
    workedExamples: [
      {
        title: 'Decomposing a Table from 2NF into 3NF',
        scenario: 'Relation: Employee(EmpID, EmpName, DeptID, DeptName). Key: EmpID. FDs: EmpID -> EmpName, EmpID -> DeptID, DeptID -> DeptName.',
        stepByStep: [
          'Candidate Key is EmpID. Prime attributes: {EmpID}. Non-prime attributes: {EmpName, DeptID, DeptName}.',
          'Check 2NF: EmpID is a single attribute key, so no partial dependencies exist. The table is in 2NF.',
          'Check 3NF: Inspect FD DeptID -> DeptName. DeptID is NOT a superkey, and DeptName is NOT a prime attribute.',
          'Diagnosis: Transitive dependency exists: EmpID -> DeptID and DeptID -> DeptName. Violates 3NF.',
          'Decompose into two relations:',
          '  R1(EmpID, EmpName, DeptID) with Primary Key EmpID.',
          '  R2(DeptID, DeptName) with Primary Key DeptID.',
          'Verification: Common attribute is DeptID, which is the primary key of R2. Therefore, decomposition is lossless and preserves all dependencies.',
        ],
        takeaway: 'Removing transitive dependencies separates distinct real-world entities into their own focused tables linked by foreign keys.',
      },
    ],
    practicalApplications: [
      'OLTP banking and e-commerce database design ensuring transactional consistency.',
      'Preventing data corruption when updating vendor or customer addresses across thousands of orders.',
      'Sizing database tables for cache efficiency in PostgreSQL and MySQL.',
    ],
    commonMistakes: [
      {
        mistake: 'Assuming 3NF and BCNF are always identical.',
        whyWrong: '3NF permits non-superkey X -> Y if Y is a prime attribute. BCNF strictly forbids this, requiring X to be a superkey in all cases.',
        correctWay: 'If overlapping candidate keys exist, test every FD against the strict superkey requirement for BCNF.',
      },
    ],
    practiceExercises: [
      {
        title: 'Determine Highest Normal Form',
        problem: 'Relation R(A, B, C, D) with FDs { A -> B, B -> C, C -> D }. Candidate Key is A. What is the highest normal form of R?',
        hint: 'Check for transitive dependencies where non-keys determine other non-keys.',
        solution: 'Since A is the only key, prime attribute is {A}. B -> C and C -> D are transitive dependencies because neither B nor C is a superkey, and C and D are non-prime. Therefore, the relation is only in 2NF.',
      },
    ],
    knowledgeCheck: [
      {
        question: 'Under what condition does a decomposition of R into R1 and R2 guarantee a lossless join?',
        options: [
          'R1 ∩ R2 must functionally determine either R1 or R2 (i.e. the common attribute is a superkey of R1 or R2)',
          'R1 and R2 must have the exact same number of columns',
          'R1 must contain all non-prime attributes',
          'Neither R1 nor R2 may contain foreign keys',
        ],
        correctIndex: 0,
        explanation: 'According to relational theory, a decomposition is lossless if and only if the intersection of the decomposed schemas forms a superkey of at least one of the schemas.',
      },
      {
        question: 'Why are data warehouse (OLAP) databases often intentionally de-normalized into Star or Snowflake schemas?',
        options: [
          'To minimize expensive multi-table SQL JOIN operations during large-scale analytical reporting queries',
          'Because OLAP databases cannot store foreign keys',
          'To prevent insertion anomalies',
          'Because normalization requires internet connectivity',
        ],
        correctIndex: 0,
        explanation: 'In analytical databases (OLAP), data is read-only or batch-loaded. De-normalization pre-joins tables to eliminate runtime JOIN overhead for aggregation speed.',
      },
    ],
    revisionNotes: [
      '1NF: Atomic values only. No repeating groups.',
      '2NF: 1NF + No partial dependencies on composite keys.',
      '3NF: 2NF + No transitive dependencies (X -> Y: X is superkey OR Y is prime).',
      'BCNF: For every non-trivial FD X -> Y, X MUST be a superkey.',
    ],
  },

  // 3. CSE: Networks - TCP Congestion Control
  {
    moduleId: 'cse-mod-4',
    branch: 'Computer Science and Engineering',
    subject: 'Computer Networks',
    title: 'Transport Layer Mechanics: TCP 3-Way Handshake, Flow Control & Congestion Control',
    estimatedMinutes: 30,
    difficulty: 'Medium',
    order: 4,
    learningObjectives: [
      'Trace sequence and acknowledgement number exchanges during TCP connection setup and teardown.',
      'Distinguish Flow Control (Receiver Advertised Window rwnd) from Congestion Control (cwnd).',
      'Understand the four phases of TCP Congestion Control: Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery.',
      'Analyze why packet loss causes dramatic throughput drops on high-latency links.',
    ],
    prerequisites: ['OSI model layer responsibilities', 'IP packet framing and routing basics'],
    conceptIntroduction:
      'IP is a best-effort, packet-switched network that drops packets when network routers buffer-overflow. Transmission Control Protocol (TCP) sits above IP to provide an end-to-end reliable, in-order, duplicate-free byte stream. To achieve this without melting intermediate internet routers, TCP dynamically probes network capacity using self-clocking congestion feedback.',
    simpleDefinition:
      'TCP Congestion Control is a decentralized feedback algorithm where senders dynamically adjust their transmission rate (cwnd) based on packet loss and ACKs, balancing network throughput with router buffer stability.',
    detailedExplanation:
      'TCP flow is constrained by two independent windows:\nEffective Window = min(rwnd, cwnd)\n- rwnd (Advertised Window): Sent by receiver in header to prevent receiver buffer overflow.\n- cwnd (Congestion Window): Maintained by sender to prevent network router queue exhaustion.\n\nCongestion Control Lifecycle:\n1. Slow Start: Starts at cwnd = 1 MSS. On every received ACK, cwnd increases by 1 MSS (exponential growth doubling every Round Trip Time RTT) until reaching slow-start threshold (ssthresh).\n2. Congestion Avoidance (AIMD): Once cwnd >= ssthresh, growth switches to Additive Increase: cwnd increases by 1 MSS per full RTT.\n3. Loss Detection via 3 Duplicate ACKs: Indicates out-of-order segment received, but network is still forwarding packets. Triggers Fast Retransmit (resends missing packet immediately without waiting for RTO) and sets ssthresh = cwnd / 2, entering Fast Recovery.\n4. Loss Detection via Timeout (RTO): Indicates severe network collapse. Sender resets cwnd = 1 MSS, sets ssthresh = cwnd / 2, and drops back to Slow Start.',
    importantTerminology: [
      { term: 'MSS (Maximum Segment Size)', definition: 'The largest payload of data in bytes that TCP will send in a single packet (typically 1460 bytes for Ethernet MTU 1500).' },
      { term: 'RTT (Round Trip Time)', definition: 'The time taken for a packet to travel from sender to receiver and for the corresponding ACK to return.' },
      { term: 'AIMD', definition: 'Additive Increase Multiplicative Decrease: The mathematical backbone of TCP stability where throughput ramps up linearly but cuts in half upon packet loss.' },
      { term: 'Silly Window Syndrome', definition: 'A flow control bug where data is transmitted in tiny 1-byte fragments; prevented by Nagle\'s algorithm on sender and Clark\'s solution on receiver.' },
    ],
    technicalArtifact: {
      type: 'diagram',
      title: 'TCP 3-Way Handshake Connection Sequence',
      content: `Client                                              Server
  |                                                    |
  | -------- SYN (Seq=x) ----------------------------> | (Server allocates TCB buffer)
  |                                                    |
  | <------- SYN-ACK (Seq=y, Ack=x+1) ---------------- |
  |                                                    |
  | -------- ACK (Seq=x+1, Ack=y+1) -----------------> | (Connection Established)
  |                                                    |`,
      explanation: 'Both client and server verify bidirectional packet delivery and synchronize starting sequence numbers before transferring payload.',
    },
    workedExamples: [
      {
        title: 'Calculating cwnd Progression During Slow Start and Congestion Avoidance',
        scenario: 'Initial ssthresh = 16 MSS, MSS = 1 KB. Network has RTT = 50 ms. Trace cwnd for first 6 RTTs with no packet loss.',
        stepByStep: [
          'RTT 1 (Slow Start): cwnd = 1 MSS (1 KB). 1 packet sent, 1 ACK received.',
          'RTT 2: cwnd doubles to 2 MSS (2 KB). 2 packets sent, 2 ACKs received.',
          'RTT 3: cwnd doubles to 4 MSS (4 KB).',
          'RTT 4: cwnd doubles to 8 MSS (8 KB).',
          'RTT 5: cwnd doubles to 16 MSS (16 KB). cwnd has now reached ssthresh (16 MSS).',
          'RTT 6 (Congestion Avoidance): Growth switches to Additive Increase (+1 MSS per RTT). cwnd becomes 17 MSS (17 KB).',
        ],
        takeaway: 'Slow start is actually exponential growth, allowing TCP to rapidly discover available link bandwidth before shifting to cautious linear growth.',
      },
    ],
    practicalApplications: [
      'High-throughput video streaming (HLS / DASH over TCP).',
      'Database replication over wide-area networks.',
      'Tuning TCP BBR algorithm in distributed infrastructure (Google BBR replaces loss-based AIMD with model-based bottleneck bandwidth measurement).',
    ],
    commonMistakes: [
      {
        mistake: 'Confusing TCP Flow Control with Congestion Control.',
        whyWrong: 'Flow control protects the destination host from having its RAM buffer overwhelmed. Congestion control protects intermediate network routers from queue dropping.',
        correctWay: 'Remember: Flow Control uses rwnd (receiver-controlled); Congestion Control uses cwnd (network sender-controlled).',
      },
    ],
    practiceExercises: [
      {
        title: 'Throughput Calculation',
        problem: 'A TCP connection operates with cwnd = 40 KB over a connection with RTT = 20 ms. Assuming no packet loss, what is the maximum achievable throughput?',
        hint: 'Throughput = Window Size / RTT.',
        solution: 'Throughput = (40 KB) / (20 ms) = (40,000 bytes * 8 bits) / (0.020 seconds) = 320,000 / 0.02 = 16,000,000 bps = 16 Mbps.',
      },
    ],
    knowledgeCheck: [
      {
        question: 'What triggers TCP Fast Retransmit without waiting for the retransmission timeout timer to expire?',
        options: [
          'Receipt of 3 duplicate ACKs acknowledging the same sequence number',
          'A zero-window probe packet',
          'A corrupted checksum bit in the IP header',
          'A FIN packet from the client',
        ],
        correctIndex: 0,
        explanation: 'Three duplicate ACKs indicate that downstream packets are successfully reaching the receiver, but one specific intervening segment was lost. TCP resends that segment immediately.',
      },
      {
        question: 'Why does closing a TCP connection require a 4-way handshake (FIN, ACK, FIN, ACK) instead of 3 packets?',
        options: [
          'TCP connections are full-duplex; one side can finish sending data while still receiving data on the opposite direction (half-closed state)',
          'To give routers time to clear their ARP tables',
          'To prevent SYN flood denial of service',
          'Because the operating system must flush disk buffers',
        ],
        correctIndex: 0,
        explanation: 'Because TCP is full-duplex, each direction of data transfer must be independently shut down with a FIN and ACK.',
      },
    ],
    revisionNotes: [
      '3-Way Handshake: SYN -> SYN-ACK -> ACK. Establishes sequence numbers.',
      'Window constraint: Effective Window = min(rwnd, cwnd).',
      'Slow Start: cwnd doubles every RTT until ssthresh.',
      'Congestion Avoidance: cwnd grows by +1 MSS per RTT (Additive Increase).',
      '3 Duplicate ACKs: ssthresh = cwnd / 2, enters Fast Recovery.',
      'Timeout: ssthresh = cwnd / 2, cwnd resets to 1 MSS.',
    ],
  },

  // 4. CSE: OOP & Design Patterns
  {
    moduleId: 'cse-mod-5',
    branch: 'Computer Science and Engineering',
    subject: 'Object-Oriented Programming',
    title: 'SOLID Design Principles, Runtime Polymorphism & Virtual Method Tables (Vtables)',
    estimatedMinutes: 25,
    difficulty: 'Easy',
    order: 5,
    learningObjectives: [
      'Master the 5 SOLID engineering design principles with code examples.',
      'Understand how dynamic dispatch works under the hood via the vptr and vtable.',
      'Analyze the Diamond Problem in multiple inheritance and virtual base resolution.',
      'Compare Creational (Factory, Singleton) and Structural (Adapter, Observer) design patterns.',
    ],
    prerequisites: ['Class and object syntax in Java, C++, or Python', 'Basic understanding of inheritance and interfaces'],
    conceptIntroduction:
      'Object-Oriented Programming is not merely wrapping variables in classes. Enterprise software engineering requires decoupled, extensible, and maintainable architectures. SOLID design principles and polymorphism allow teams to introduce new features without modifying existing tested code (Open/Closed Principle).',
    simpleDefinition:
      'SOLID is a set of five object-oriented design principles that guide engineers in building modular, maintainable, and testable software architectures that gracefully accommodate change.',
    detailedExplanation:
      'The 5 SOLID Principles:\n1. Single Responsibility Principle (SRP): A class should have one, and only one, reason to change.\n2. Open/Closed Principle (OCP): Software entities should be open for extension, but closed for modification.\n3. Liskov Substitution Principle (LSP): Subtypes must be substitutable for their base types without altering program correctness.\n4. Interface Segregation Principle (ISP): Clients should not be forced to depend on interface methods they do not use.\n5. Dependency Inversion Principle (DIP): High-level modules should not depend on low-level modules; both should depend on abstractions (interfaces).\n\nUnder-the-Hood Polymorphism:\nIn C++ and Java, when a class declares a virtual function, the compiler inserts a hidden pointer called vptr into every object instance. The vptr points to a static class-level array called the vtable (Virtual Table) containing function pointers. When `basePtr->draw()` is invoked, the CPU dereferences `vptr[index]()`, executing dynamic dispatch in constant O(1) time with a tiny 1-pointer memory overhead.',
    importantTerminology: [
      { term: 'Dynamic Dispatch', definition: 'The runtime mechanism of selecting which polymorphic implementation of a method to execute.' },
      { term: 'Vtable (Virtual Table)', definition: 'A compiler-generated lookup table of function pointers used to resolve virtual method calls at runtime.' },
      { term: 'Liskov Substitution Principle', definition: 'If S is a subtype of T, objects of type T may be replaced with objects of type S without altering desired properties.' },
      { term: 'Dependency Injection', definition: 'A design pattern implementing DIP where dependencies are passed into objects rather than instantiated inside them.' },
    ],
    technicalArtifact: {
      type: 'code',
      title: 'Open/Closed Principle (OCP) Applied to Payment Processing',
      content: `from abc import ABC, abstractmethod

# Abstraction: Closed for modification, Open for extension
class PaymentProcessor(ABC):
    @abstractmethod
    def pay(self, amount: float) -> bool:
        pass

class CreditCardPayment(PaymentProcessor):
    def pay(self, amount: float) -> bool:
        print(f"Charging \${amount} via Credit Card API")
        return True

class CryptoPayment(PaymentProcessor):
    def pay(self, amount: float) -> bool:
        print(f"Broadcasting \${amount} transaction on blockchain")
        return True

# High-level checkout engine depends on abstraction
class CheckoutService:
    def __init__(self, processor: PaymentProcessor):
        self.processor = processor
    def complete_order(self, total: float):
        return self.processor.pay(total)`,
      explanation: 'Adding new payment methods (e.g. ApplePay, UPI) requires zero changes to CheckoutService, honoring OCP.',
    },
    workedExamples: [
      {
        title: 'Detecting and Fixing a Liskov Substitution Principle (LSP) Violation',
        scenario: 'A classic LSP violation: Class Rectangle with setWidth() and setHeight(). Square inherits from Rectangle and forces width == height.',
        stepByStep: [
          'Assume client function: def resize(rect: Rectangle): rect.setWidth(10); rect.setHeight(20); assert rect.getArea() == 200.',
          'If we pass a Square instance into resize(), setting width to 10 makes height 10, then setting height to 20 makes width 20.',
          'Area becomes 400 instead of 200! The assertion fails.',
          'Diagnosis: Square cannot substitute Rectangle without breaking invariants. Violates LSP.',
          'Fix: Decouple the hierarchy. Both Rectangle and Square should inherit from a common Shape interface with an abstract getArea() method, but separate dimension mutators.',
        ],
        takeaway: 'Inheritance must model behavioral subtyping, not just naive real-world taxonomic relationships.',
      },
    ],
    practicalApplications: [
      'Spring Framework and NestJS Dependency Injection containers.',
      'Plugin architectures in VS Code and web browsers.',
      'GUI widget frameworks (Button, Dropdown extending base Component).',
    ],
    commonMistakes: [
      {
        mistake: 'Making non-virtual base destructors in polymorphic C++ classes.',
        whyWrong: 'Deleting a derived instance through a base pointer with a non-virtual destructor executes only the base destructor, causing memory leaks.',
        correctWay: 'Always declare base class destructors virtual whenever any virtual function is present.',
      },
    ],
    practiceExercises: [
      {
        title: 'Interface Segregation Principle',
        problem: 'An interface Machine has print(), scan(), and fax(). A simple EcoPrinter cannot scan or fax. How do you refactor under ISP?',
        hint: 'Break large fat interfaces into focused role interfaces.',
        solution: 'Split Machine into three small interfaces: Printable (print), Scannable (scan), Faxable (fax). EcoPrinter implements only Printable, while MultiFunctionPrinter implements all three.',
      },
    ],
    knowledgeCheck: [
      {
        question: 'What is the role of the vptr in C++ objects with virtual methods?',
        options: [
          'It points to the vtable for the object\'s actual runtime class to resolve dynamic method calls',
          'It tracks the garbage collector generation of the object',
          'It synchronizes thread access to the object',
          'It encrypts object variables in memory',
        ],
        correctIndex: 0,
        explanation: 'Every instance of a polymorphic class contains a hidden vptr that directs method calls to the correct entry in the class vtable.',
      },
      {
        question: 'Which design pattern is best suited for notifying multiple independent services when a user profile updates?',
        options: ['Observer Pattern', 'Singleton Pattern', 'Factory Pattern', 'Flyweight Pattern'],
        correctIndex: 0,
        explanation: 'The Observer pattern defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified automatically.',
      },
    ],
    revisionNotes: [
      'S: Single Responsibility. O: Open for extension, Closed for modification.',
      'L: Liskov Substitution (subtypes must honor base contracts).',
      'I: Interface Segregation (small role interfaces).',
      'D: Dependency Inversion (depend on abstractions, not concretions).',
      'Vtable provides constant-time dynamic dispatch via vptr dereferencing.',
    ],
  },

  // 5. CSE: Computer Architecture - Pipelining
  {
    moduleId: 'cse-mod-6',
    branch: 'Computer Science and Engineering',
    subject: 'Computer Architecture & Organization',
    title: 'Instruction Pipelining: 5-Stage MIPS Pipeline, Data Hazards & Forwarding Units',
    estimatedMinutes: 30,
    difficulty: 'Hard',
    order: 6,
    learningObjectives: [
      'Deconstruct the classic 5-stage RISC processor pipeline: IF, ID, EX, MEM, WB.',
      'Calculate theoretical speedup $S = \\frac{k \\cdot n}{k + n - 1}$ and pipeline throughput.',
      'Classify pipeline hazards into Structural, Data (RAW, WAR, WAW), and Control hazards.',
      'Implement Hardware Forwarding (Bypassing) and understand pipeline stalls (bubbles).',
    ],
    prerequisites: ['Binary arithmetic and logic gates', 'Basic CPU registers and assembly instructions'],
    conceptIntroduction:
      'In a non-pipelined single-cycle CPU, an instruction must complete all stages before the next instruction can begin, forcing the clock cycle to be as slow as the slowest instruction (e.g. Load Word taking 800 ps). Instruction pipelining overlaps the execution of multiple instructions simultaneously—analogous to a modern automotive assembly line—dramatically increasing instruction throughput.',
    simpleDefinition:
      'Instruction pipelining is an implementation technique where multiple instructions are overlapped in execution across dedicated hardware stages, approaching an ideal throughput of 1 instruction per clock cycle.',
    detailedExplanation:
      'The Classic 5-Stage RISC Pipeline:\n1. IF (Instruction Fetch): Fetch 32-bit instruction from Instruction Memory using PC, increment PC by 4.\n2. ID (Instruction Decode & Register Read): Decode opcode, read source registers Rs and Rt from Register File, sign-extend immediate.\n3. EX (Execute / ALU): ALU performs arithmetic or computes effective memory address for loads/stores.\n4. MEM (Memory Access): Read data from or write data to Data Memory (active only for Load/Store).\n5. WB (Write Back): Write the resulting value back into destination register Rd or Rt.\n\nHazards & Solutions:\n- Structural Hazard: Hardware resource collision (e.g. single-port memory used for both instruction fetch and data access; solved by Harvard architecture separate L1 caches).\n- Data Hazard (Read-After-Write RAW): An instruction depends on the result of an earlier instruction that hasn\'t completed Write Back. Solved by Hardware Forwarding (routing ALU output from EX/MEM buffer directly back into ALU inputs for the next cycle) or inserting 1-cycle stall bubbles for Load-Use dependencies.\n- Control Hazard (Branch): Branch decision is determined in EX or ID stage, after subsequent instructions have already been fetched into the pipeline. Solved by dynamic 2-bit Branch Predictors or branch delay slots.',
    importantTerminology: [
      { term: 'RAW (Read-After-Write) Hazard', definition: 'A true data dependency where instruction J attempts to read a register before instruction I writes to it.' },
      { term: 'Forwarding (Bypassing)', definition: 'Hardware routing logic that passes computed results directly from pipeline register buffers to execution units without waiting for register write-back.' },
      { term: 'Pipeline Stall (Bubble)', definition: 'A wasted clock cycle where no productive work is done in a pipeline stage to allow a dependency to resolve.' },
      { term: 'Branch Misprediction Penalty', definition: 'The clock cycles wasted flushing erroneously fetched instructions from the pipeline when a branch prediction fails.' },
    ],
    technicalArtifact: {
      type: 'formula',
      title: 'Pipelining Speedup Equation',
      content: `Ideal Speedup Formula:
S = (k * n) / (k + n - 1)

As n (number of instructions) -> infinity:
Speedup S -> k (Number of pipeline stages)

Cycles Per Instruction (CPI):
Actual CPI = Ideal CPI (1) + Stall Cycles per Instruction`,
      explanation: 'A 5-stage pipeline can theoretically achieve up to a 5x throughput improvement over single-cycle execution.',
    },
    workedExamples: [
      {
        title: 'Detecting RAW Hazard and Forwarding Resolution',
        scenario: 'Instruction sequence:\nI1: ADD R1, R2, R3 (R1 = R2 + R3)\nI2: SUB R4, R1, R5 (R4 = R1 - R5)',
        stepByStep: [
          'Cycle 1: I1 is in IF stage.',
          'Cycle 2: I1 is in ID stage. I2 is in IF stage.',
          'Cycle 3: I1 is in EX stage (computes R2 + R3). I2 is in ID stage (reads R1, R5). But R1 in register file still has stale data!',
          'Cycle 4: I1 is in MEM stage (result R1 sits in EX/MEM pipeline register). I2 moves to EX stage.',
          'Hardware Forwarding Action: The forwarding unit detects EX/MEM.RegisterRd == ID/EX.RegisterRs (R1). It routes the ALU result from the EX/MEM register directly into the ALU input of I2.',
          'Result: I2 executes with 0 stall cycles! No bubble is required.',
        ],
        takeaway: 'Forwarding eliminates RAW stalls for arithmetic instructions because the result is computed at the end of the EX stage.',
      },
    ],
    practicalApplications: [
      'Modern x86-64 superscalar out-of-order processors (Intel Core i9, AMD Ryzen with 14-19 stage pipelines).',
      'ARM Cortex-A mobile processors and Apple Silicon M-series chips.',
      'Graphics Processing Units (GPUs) with thousands of concurrent SIMD pipeline lanes.',
    ],
    commonMistakes: [
      {
        mistake: 'Believing that pipelining reduces the latency of a single individual instruction.',
        whyWrong: 'Each individual instruction still takes all 5 stages (5 cycles) to complete. In fact, pipeline register overhead slightly increases individual latency.',
        correctWay: 'Pipelining improves overall instruction throughput (instructions completed per second), not single-instruction latency.',
      },
    ],
    practiceExercises: [
      {
        title: 'Load-Use Delay',
        problem: 'Can hardware forwarding eliminate all stalls for a Load Word (LW) immediately followed by an ADD that uses the loaded register?',
        hint: 'When does the loaded data become available from Data Memory?',
        solution: 'No. Data from LW only becomes available at the END of the MEM stage (cycle 4). The ADD needs the data at the START of its EX stage (cycle 4). Since data cannot travel backward in time, a mandatory 1-cycle stall bubble must be inserted even with forwarding.',
      },
    ],
    knowledgeCheck: [
      {
        question: 'Which type of hazard can NEVER be resolved purely by hardware forwarding without inserting at least one stall cycle?',
        options: [
          'Load-Use Data Hazard (an instruction immediately consumes the register loaded by an immediately preceding LW)',
          'ADD followed by SUB',
          'AND followed by OR',
          'Shift-left followed by XOR',
        ],
        correctIndex: 0,
        explanation: 'In Load-Use hazards, the loaded data is not read from memory until the end of the MEM stage, which is too late for the immediately following instruction\'s EX stage.',
      },
      {
        question: 'What is the primary function of a 2-bit branch predictor in modern CPU pipelines?',
        options: [
          'It requires two consecutive mispredictions before changing its prediction, avoiding thrashing on loop termination branches',
          'It predicts whether arithmetic operations will overflow',
          'It doubles the clock frequency',
          'It compresses 64-bit addresses to 32 bits',
        ],
        correctIndex: 0,
        explanation: 'A 2-bit saturating counter prevents premature state flips on the final iteration of loops, maintaining >90% prediction accuracy.',
      },
    ],
    revisionNotes: [
      '5 Stages: IF (Fetch), ID (Decode), EX (Execute), MEM (Memory), WB (Write-Back).',
      'Throughput approaches 1 instruction/cycle as n increases.',
      'Hazards: Structural (hardware resource collision), Data (RAW/WAR/WAW), Control (branches).',
      'Forwarding eliminates ALU-ALU RAW stalls.',
      'Load-Use hazard requires 1 mandatory stall cycle.',
    ],
  },
  // 7. CSE: Software Engineering - Architecture, Microservices & CI/CD
  {
    moduleId: 'cse-mod-7',
    branch: 'Computer Science and Engineering',
    subject: 'Software Engineering',
    title: 'Modern Architecture: Monolith vs Microservices, CI/CD Pipelines & TDD',
    estimatedMinutes: 25,
    difficulty: 'Medium',
    order: 7,
    learningObjectives: [
      'Compare monolithic and microservices architectures regarding deployment, scalability, and operational complexity.',
      'Understand CI/CD pipeline automation stages: linting, unit testing, container build, and canary deployment.',
      'Apply Test-Driven Development (TDD) red-green-refactor cycles.',
      'Analyze Circuit Breaker and API Gateway patterns for distributed fault tolerance.',
    ],
    prerequisites: ['Basic web architectures', 'Version control with Git'],
    conceptIntroduction:
      'Engineering enterprise software requires more than writing algorithms; it demands robust architectural patterns, continuous automated integration, and defensible testing strategies. Modern placement evaluations heavily focus on whether graduates understand service decoupling, deployment pipelines, and failure isolation.',
    simpleDefinition:
      'Software engineering encompasses systematic methodologies, architectural designs, automated testing, and CI/CD pipelines to build maintainable, resilient, and scalable software systems.',
    detailedExplanation:
      'A Monolith bundles UI, business logic, and data access into a single deployable unit. It offers simple development and testing early on, but suffers from deployment bottlenecks and blast-radius vulnerabilities as teams grow. Microservices decompose systems into independently deployable domain services communicating via REST, gRPC, or message queues (Kafka, RabbitMQ).\n\nTo prevent cascading failures across microservices, resilient systems implement the Circuit Breaker pattern (Closed, Open, Half-Open). In the testing arena, Test-Driven Development (TDD) enforces writing failing unit tests first (Red), implementing minimal working code (Green), and then improving structure (Refactor).',
    importantTerminology: [
      { term: 'Circuit Breaker', definition: 'A design pattern that detects distributed service failures and encapsulates the logic of preventing a failure from constantly recurring during maintenance or downtime.' },
      { term: 'CI/CD Pipeline', definition: 'Continuous Integration / Continuous Delivery: Automated pipeline building code, running test suites, containerizing with Docker, and deploying artifacts.' },
      { term: 'API Gateway', definition: 'A reverse proxy server acting as a single entry point for clients, handling authentication, routing, rate limiting, and telemetry.' },
      { term: 'Canary Deployment', definition: 'A progressive rollout strategy where new software versions are routed to a small percentage of users before full production release.' },
    ],
    technicalArtifact: {
      type: 'diagram',
      title: 'Microservices Circuit Breaker State Machine',
      content: `[Normal Operation: CLOSED]
       |
       | (Error Threshold Exceeded: 50% failures)
       v
[Failure Isolation: OPEN] ---> (Fast-fail requests immediately without hitting downstream)
       |
       | (Timeout Period Expires: 30 seconds)
       v
[Recovery Probe: HALF-OPEN]
       |
       +---> (Success) ---> [CLOSED: Normal Traffic Restored]
       +---> (Failure) ---> [OPEN: Fast-Fail Continued]`,
      explanation: 'The circuit breaker trips to OPEN state upon persistent downstream failures, sparing backend services from thrashing.',
    },
    workedExamples: [
      {
        title: 'Designing Resilient Payment Checkout Flow',
        scenario: 'An e-commerce order service calls an external Payment Gateway that is intermittently timing out (5-second latency).',
        stepByStep: [
          'Step 1: Wrap external payment HTTP calls in a Circuit Breaker with 3-second timeout and 50% failure rate trip condition.',
          'Step 2: When the payment gateway latency spikes, the breaker trips to OPEN.',
          'Step 3: Client requests immediately receive a structured fallback response: "Payment gateway busy, retrying queued order" rather than hanging client threads.',
          'Step 4: After 30 seconds, probe with a single trial request in HALF-OPEN state. If successful, reset to CLOSED.',
        ],
        takeaway: 'Resilience patterns prevent thread exhaustion and catastrophic cascading failures across distributed microservices.',
      },
    ],
    practicalApplications: [
      'Netflix, Amazon, and Uber high-availability microservice architectures.',
      'Fintech payment gateways and asynchronous settlement engines.',
      'Kubernetes ingress controllers and automated canary deployment pipelines.',
    ],
    commonMistakes: [
      {
        mistake: 'Migrating to microservices prematurely before understanding domain boundaries.',
        whyWrong: 'Distributed systems introduce network latency, distributed transactions (Sagas), and distributed tracing complexity.',
        correctWay: 'Start with a modular monolith and carve out microservices along clear bounded contexts as team and scale require.',
      },
    ],
    practiceExercises: [
      {
        title: 'TDD Red-Green-Refactor',
        problem: 'How does writing a failing test before writing implementation code improve software modularity and design?',
        hint: 'Consider how testing an API forces thinking about caller ergonomics before implementation.',
        solution: 'Writing the test first forces the developer to design from the caller perspective, producing decoupled, testable interfaces with high cohesion and zero redundant code.',
      },
    ],
    knowledgeCheck: [
      {
        question: 'Which state in the Circuit Breaker pattern permits a limited trial number of requests to test if the downstream service has recovered?',
        options: ['HALF-OPEN', 'CLOSED', 'OPEN', 'STANDBY'],
        correctIndex: 0,
        explanation: 'HALF-OPEN state allows trial requests through; if they succeed, it transitions back to CLOSED; if any fail, it trips back to OPEN.',
      },
      {
        question: 'What is the primary objective of Continuous Integration (CI)?',
        options: [
          'Automatically integrate code changes from multiple contributors into a shared repository, validated by automated builds and test suites',
          'Deploy code directly to production without testing',
          'Replace unit testing with manual regression QA',
          'Eliminate the need for version control branching',
        ],
        correctIndex: 0,
        explanation: 'CI automates code merge, build validation, and automated testing to catch integration bugs early.',
      },
    ],
    revisionNotes: [
      'Monolith: Simpler initial development, single deployment artifact.',
      'Microservices: Independent scaling, technology diversity, higher network and operational overhead.',
      'Circuit Breaker States: Closed (normal) -> Open (failing fast) -> Half-Open (trialing recovery).',
      'TDD Cycle: Red (fail) -> Green (pass) -> Refactor (clean).',
    ],
  },
  // 8. CSE: Programming Languages - Runtimes, Memory Models & Event Loop
  {
    moduleId: 'cse-mod-8',
    branch: 'Computer Science and Engineering',
    subject: 'Programming Languages',
    title: 'Language Runtimes: Memory Layout, Call Stack, Garbage Collection & Async Event Loops',
    estimatedMinutes: 30,
    difficulty: 'Medium',
    order: 8,
    learningObjectives: [
      'Differentiate process memory segments: Text, Data/BSS, Heap, and Call Stack.',
      'Analyze activation records (stack frames) and stack overflow conditions.',
      'Compare garbage collection strategies: Reference Counting vs Tracing Mark-and-Sweep.',
      'Trace the Node.js / JavaScript Asynchronous Event Loop (Call Stack, Macrotasks, Microtasks).',
    ],
    prerequisites: ['Basic C or C++ pointer knowledge', 'Basic asynchronous JavaScript / Python async-await'],
    conceptIntroduction:
      'Understanding high-level languages requires mastering how program runtimes execute code, manage memory, and handle concurrent I/O. Interviewers frequently probe candidate knowledge on heap vs stack allocation, pointer mechanics, garbage collection pauses, and non-blocking asynchronous event loops.',
    simpleDefinition:
      'A language runtime provides underlying execution services including memory allocation (stack and heap), automatic garbage collection, type checking, and concurrency scheduling (such as the event loop).',
    detailedExplanation:
      'Every running process is mapped into four distinct virtual memory regions:\n1. Text Segment: Read-only executable machine code instructions.\n2. Data & BSS Segments: Global and static variables (initialized vs uninitialized).\n3. Heap: Dynamically allocated memory at runtime (malloc, new), managed manually or by a garbage collector.\n4. Call Stack: LIFO frames storing function arguments, local variables, and return addresses.\n\nIn garbage-collected environments (Java, Python, JavaScript), the runtime prevents memory leaks through Mark-and-Sweep or Generational collection (allocating objects to Young/Old generations based on lifespan). In single-threaded asynchronous environments like Node.js, an Event Loop processes non-blocking I/O by coordinating between the Call Stack, Microtask Queue (Promises, process.nextTick), and Macrotask Queue (setTimeout, I/O callbacks).',
    importantTerminology: [
      { term: 'Stack Frame (Activation Record)', definition: 'A block of memory pushed onto the call stack for each function invocation, containing parameters, local variables, and saved register states.' },
      { term: 'Garbage Collection (GC)', definition: 'Automated memory management that identifies and reclaims memory occupied by objects no longer reachable from any root reference.' },
      { term: 'Event Loop', definition: 'A concurrency model that constantly checks if the call stack is empty, and if so, dequeues and executes pending callbacks from microtask and macrotask queues.' },
      { term: 'Memory Leak', definition: 'Occurs when dynamically allocated memory is no longer needed by application logic but remains reachable from GC roots, preventing reclamation.' },
    ],
    technicalArtifact: {
      type: 'code',
      title: 'JavaScript Event Loop Execution Order Demonstration',
      content: `console.log('1. Synchronous Script');

setTimeout(() => {
  console.log('4. Macrotask (setTimeout)');
}, 0);

Promise.resolve().then(() => {
  console.log('3. Microtask (Promise.then)');
});

console.log('2. Synchronous Script End');

// Expected Output Order:
// 1. Synchronous Script
// 2. Synchronous Script End
// 3. Microtask (Promise.then)
// 4. Macrotask (setTimeout)`,
      explanation: 'Synchronous code finishes first. Then the microtask queue drains completely before any macrotask callback is executed.',
    },
    workedExamples: [
      {
        title: 'Tracing Stack Allocation vs Heap Allocation',
        scenario: 'A function allocates a local integer `int x = 42;` and a dynamic array `int *arr = malloc(100 * sizeof(int));`.',
        stepByStep: [
          'Step 1: Inside the function activation record on the Call Stack, 4 bytes are reserved for variable `x`.',
          'Step 2: 8 bytes (on 64-bit OS) are allocated on the Call Stack for pointer variable `arr`.',
          'Step 3: The call to `malloc()` allocates 400 contiguous bytes on the Heap and returns the base physical address.',
          'Step 4: When the function returns, its stack frame is popped. Variable `x` and pointer `arr` vanish instantly.',
          'Step 5: CRITICAL: The 400 bytes on the Heap remain allocated! If `free(arr)` was not called, a heap memory leak occurs.',
        ],
        takeaway: 'Stack memory is automatically deallocated upon function exit; heap memory requires explicit release or reachable GC collection.',
      },
    ],
    practicalApplications: [
      'High-performance Node.js backend services serving 50k concurrent requests.',
      'Java JVM tuning (Garbage-First G1GC vs ZGC) for low-latency financial systems.',
      'Embedded systems C/C++ development with zero dynamic allocation to avoid heap fragmentation.',
    ],
    commonMistakes: [
      {
        mistake: 'Assuming `setTimeout(fn, 0)` executes immediately on the next CPU cycle.',
        whyWrong: 'It only queues the callback to the macrotask queue. It will not run until the call stack is completely empty AND all microtasks have drained.',
        correctWay: 'Recognize that `setTimeout(..., 0)` yields control to allow higher-priority tasks and rendering to execute.',
      },
    ],
    practiceExercises: [
      {
        title: 'Detecting Memory Leaks in JavaScript',
        problem: 'Why do forgotten event listeners or uncleaned global intervals cause memory leaks in single-page applications?',
        hint: 'What maintains a reference path back to the window or DOM node?',
        solution: 'Event listeners and setInterval hold references in their closure scope to DOM elements or outer state. Because the global window or timer registry references the callback, the GC cannot collect any objects in that closure.',
      },
    ],
    knowledgeCheck: [
      {
        question: 'In the JavaScript event loop, which queue has strict priority over the Macrotask (setTimeout/setInterval) queue?',
        options: [
          'Microtask Queue (Promises, queueMicrotask, process.nextTick)',
          'Disk I/O Queue',
          'Worker Thread Queue',
          'Network Socket Buffer',
        ],
        correctIndex: 0,
        explanation: 'The event loop completely empties the microtask queue after each task and before executing any pending macrotask.',
      },
      {
        question: 'Where are local primitive variables inside a function typically allocated in C and C++?',
        options: ['Call Stack', 'Heap', 'BSS Segment', 'Data Segment'],
        correctIndex: 0,
        explanation: 'Local variables inside functions are allocated on the thread\'s Call Stack inside that function\'s stack frame.',
      },
    ],
    revisionNotes: [
      'Memory Segments: Text (code), Data/BSS (globals), Heap (dynamic), Stack (function frames).',
      'Stack: LIFO, ultra-fast O(1), fixed limit (can StackOverflow).',
      'Heap: Dynamic size, requires manual free() or automatic GC (Mark-Sweep).',
      'Event Loop Order: Sync Call Stack -> Microtasks (Promises) -> Macrotasks (Timers/IO).',
    ],
  },
];
