import { NavPage } from '../types';

export interface AssistantFaqItem {
  id: string;
  categoryId: string;
  question: string;
  shortSummary: string;
  answer: string;
  actionText?: string;
  actionPage?: NavPage;
  relatedFaqIds: string[];
  tags: string[];
}

export interface AssistantFaqCategory {
  id: string;
  title: string;
  description: string;
  iconName: string;
  color: string;
}

export const FAQ_CATEGORIES: AssistantFaqCategory[] = [
  {
    id: 'how-to-use',
    title: 'How to use NEXORA',
    description: 'Master platform navigation, diagnostic metrics, and simulator tools',
    iconName: 'Compass',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'study-planning',
    title: 'Study Planning',
    description: 'Daily schedules, sprint timetables, and personalized revision plans',
    iconName: 'CalendarCheck',
    color: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'technical-concepts',
    title: 'Technical Concepts',
    description: 'Operating Systems, DBMS, Networks, OOP, and Architecture fundamentals',
    iconName: 'Cpu',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'aptitude-prep',
    title: 'Aptitude Preparation',
    description: 'Quantitative aptitude, logical reasoning, verbal ability, and data interpretation',
    iconName: 'Calculator',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'coding-help',
    title: 'Coding Help',
    description: 'Algorithms, time complexities, problem solving patterns, and code runner tips',
    iconName: 'Code2',
    color: 'from-rose-500 to-pink-600',
  },
  {
    id: 'interview-prep',
    title: 'Interview Preparation',
    description: 'STAR framework, HR behavioral scenarios, technical defense, and voice delivery',
    iconName: 'MessageSquareCode',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'resume-prep',
    title: 'Resume Preparation',
    description: 'ATS formatting, metric-driven impact bullets, skill grouping, and A4 print',
    iconName: 'FileText',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'career-skills',
    title: 'Career & Skill Development',
    description: 'Role roadmaps, core branch options, portfolio projects, and recruiter expectations',
    iconName: 'Award',
    color: 'from-fuchsia-500 to-rose-600',
  },
];

export const FAQ_ITEMS: AssistantFaqItem[] = [
  // 1. HOW TO USE NEXORA
  {
    id: 'faq-use-1',
    categoryId: 'how-to-use',
    question: 'How do I navigate NEXORA for campus placement preparation?',
    shortSummary: 'Overview of the six dedicated preparation studios in NEXORA.',
    answer: `NEXORA is divided into six purpose-built studios designed to take you from foundational understanding to final interview offers:

• **Overview Dashboard**: Your mission control. Monitor your real diagnostic readiness score, daily streak, branch-tailored daily study tasks, and comprehensive practice tracks.
• **Learning Studio**: Deep, multi-section theoretical modules across CSE, ECE, EEE, Mech, Chem, and Civil engineering. Each module contains concept introductions, formulas, worked numerical examples, and knowledge checks.
• **Practice Lab**: Over 3,500 verified questions spanning Quantitative Aptitude, Logical Reasoning, Verbal Ability, Technical MCQs, and an isolated Python 3 / Node.js live coding sandbox.
• **Placement Simulator**: Full 4-round recruitment simulation (Aptitude Screening, Technical Core, System Architecture, and HR Behavioral) with 10 questions per round and a 70% cutoff barrier.
• **Mock Interview Studio**: Multi-question voice-enabled interview sessions with automated voice synthesis, microphone transcription, and structured STAR feedback.
• **Resume Builder**: Professional ATS-optimized single-page A4 resume generator with instant live preview and clean PDF printing.`,
    actionText: 'Explore Practice Lab',
    actionPage: 'practice',
    relatedFaqIds: ['faq-use-2', 'faq-use-3', 'faq-plan-1'],
    tags: ['overview', 'navigation', 'studios', 'tools', 'getting started'],
  },
  {
    id: 'faq-use-2',
    categoryId: 'how-to-use',
    question: 'How is my placement readiness score calculated?',
    shortSummary: 'Exact formula based on real quiz accuracy, coding submissions, and interviews.',
    answer: `Your Readiness Score in NEXORA is strictly calculated from genuine stored performance data in your local MongoDB database:

• **Technical & Aptitude Accuracy (45% weight)**: Calculated as (total correct quiz answers / total questions attempted) * 45.
• **Coding Problem Mastery (25% weight)**: Evaluated from distinct coding challenges solved in the live isolated sandbox runner.
• **Simulation & Interview Performance (20% weight)**: Average score achieved across completed 4-round placement simulations and mock interview evaluations.
• **Consistency & Task Completion (10% weight)**: Derived from your active daily study streak and completed daily checklist items.

Unlike decorative dashboards, NEXORA never invents random percentages. Every point on your score dial reflects verifiable progress.`,
    actionText: 'View Dashboard Metrics',
    actionPage: 'overview',
    relatedFaqIds: ['faq-use-1', 'faq-plan-1'],
    tags: ['readiness', 'score', 'calculation', 'accuracy', 'metrics'],
  },
  {
    id: 'faq-use-3',
    categoryId: 'how-to-use',
    question: 'Where can I take the full 4-round placement simulation?',
    shortSummary: 'Take the Placement Simulator simulating Tier-1 corporate recruitment drives.',
    answer: `You can access the full simulation directly by clicking **Simulator** in the sidebar or from the quick navigation orb.

The simulation accurately mirrors on-campus recruitment tests conducted by companies like TCS Digital, Infosys, Cisco, and SAP:
• **Round 1**: Aptitude & Logical Reasoning (10 questions, 15 minutes)
• **Round 2**: Core Technical Computer Science (10 questions, 15 minutes)
• **Round 3**: System Architecture & Coding Concepts (10 questions, 15 minutes)
• **Round 4**: HR Behavioral & Situational Judgment (10 questions, 15 minutes)

A minimum score of **70%** is required to clear each round and receive your final placement readiness certification report.`,
    actionText: 'Launch Placement Simulator',
    actionPage: 'practice',
    relatedFaqIds: ['faq-use-1', 'faq-use-2', 'faq-interview-1'],
    tags: ['simulation', 'placement drive', '4 rounds', 'test', 'cutoff'],
  },

  // 2. STUDY PLANNING
  {
    id: 'faq-plan-1',
    categoryId: 'study-planning',
    question: 'What should my daily study routine look like during placement season?',
    shortSummary: 'Recommended 3 to 4 hour structured daily preparation split.',
    answer: `A proven daily routine for final and pre-final year campus candidates consists of a balanced 4-part split:

1. **Aptitude Sprint (45 mins)**: Solve 15-20 mixed questions across Quant and Logical reasoning. Focus on speed drills without a calculator.
2. **Core CSE Revision (60 mins)**: Read one detailed module in the Learning Studio (e.g. Operating Systems Paging, DBMS Normalization, or TCP Flow Control) and review notes.
3. **Algorithmic Coding (60-75 mins)**: Implement 2 coding problems in the Practice Lab (e.g. one Two-Pointer array problem and one Binary Search or Tree traversal).
4. **Communication & Review (30 mins)**: Practice 1-2 spoken interview answers using the Mock Interview voice studio, followed by reviewing mistakes from earlier quizzes.

Completing the daily checklist on your NEXORA home dashboard ensures you stay consistent and maintain your learning streak.`,
    actionText: 'View Daily Tasks',
    actionPage: 'overview',
    relatedFaqIds: ['faq-plan-2', 'faq-code-1', 'faq-tech-1'],
    tags: ['routine', 'daily plan', 'schedule', 'time management', 'streak'],
  },
  {
    id: 'faq-plan-2',
    categoryId: 'study-planning',
    question: 'What is the recommended 6-week placement preparation sprint?',
    shortSummary: 'A phased weekly roadmap from fundamentals to final mock rounds.',
    answer: `Here is the structured 6-week sprint followed by successful campus candidates:

• **Weeks 1-2 (Aptitude & Foundations)**: Quantitative math formulas (Percentages, Profit/Loss, Time & Work, Speed/Distance), basic Data Structures (Arrays, Strings, Linked Lists), and Object-Oriented concepts.
• **Weeks 3-4 (Core Systems & Intermediate DSA)**: Operating Systems (Virtual Memory, Semaphores, Deadlocks), DBMS (SQL joins, Indexing, BCNF), Trees, Graphs, and HashMaps. Complete your single-page resume draft in NEXORA.
• **Week 5 (System Architecture & Coding Drills)**: High-level system design patterns (Microservices, Caching, Load Balancing), Dynamic Programming basics, and timed coding challenges.
• **Week 6 (Mock Drives & Polish)**: Take at least 3 full Placement Simulations, run vocal mock interview sessions, practice your self-introduction, and refine company-specific question sets.`,
    actionText: 'Open Learning Studio',
    actionPage: 'learning-studio',
    relatedFaqIds: ['faq-plan-1', 'faq-tech-1', 'faq-resume-1'],
    tags: ['6 weeks', 'sprint', 'roadmap', 'timeline', 'preparation strategy'],
  },

  // 3. TECHNICAL CONCEPTS
  {
    id: 'faq-tech-1',
    categoryId: 'technical-concepts',
    question: 'What are the most asked Operating System concepts in campus interviews?',
    shortSummary: 'Critical topics: Virtual Memory, Paging, Deadlocks, Threads, and CPU Scheduling.',
    answer: `Interviewers at top campus recruiters focus heavily on these foundational OS mechanisms:

1. **Virtual Memory & Multi-Level Paging**:
   • How the MMU translates Virtual Page Numbers (VPN) to Physical Frame Numbers (PFN) using the TLB and Page Tables.
   • What happens during a **Page Fault** exception and how thrashing occurs.
2. **Process vs Thread**:
   • Processes have separate virtual address spaces; threads within a process share code, data, and heap, but maintain private stacks and registers.
3. **Synchronization & Deadlocks**:
   • Critical sections, Mutex vs Counting Semaphore.
   • Coffman's 4 conditions for Deadlock: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.
4. **CPU Scheduling**:
   • Preemptive vs Non-preemptive, Round Robin time quanta tuning, and Priority Inversion with priority inheritance.

You can study the complete **Virtual Memory and Paging** module with interactive diagrams in NEXORA's Learning Studio.`,
    actionText: 'Study Operating Systems Module',
    actionPage: 'learning-studio',
    relatedFaqIds: ['faq-tech-2', 'faq-tech-3', 'faq-code-3'],
    tags: ['operating systems', 'os', 'paging', 'virtual memory', 'deadlock', 'threads'],
  },
  {
    id: 'faq-tech-2',
    categoryId: 'technical-concepts',
    question: 'Explain Database Normalization (1NF, 2NF, 3NF, BCNF) simply.',
    shortSummary: 'Progressive elimination of redundancy and update anomalies.',
    answer: `Normalization organizes relational tables to eliminate data redundancy and prevent Insert, Update, and Delete anomalies:

• **1NF (First Normal Form)**: Every table cell contains single, atomic values (no repeating groups, CSV lists, or arrays).
• **2NF (Second Normal Form)**: Meets 1NF AND removes **partial dependency**—every non-prime attribute must depend on the *entire* candidate key, not just a subset.
• **3NF (Third Normal Form)**: Meets 2NF AND removes **transitive dependency**—no non-prime attribute should depend on another non-prime attribute ($A \\rightarrow B \\rightarrow C$).
• **BCNF (Boyce-Codd Normal Form)**: A stricter version of 3NF where for every functional dependency $X \\rightarrow Y$, $X$ must be a super key.

NEXORA provides a complete step-by-step module on Normalization and Lossless Join Decompositions in the Learning Studio.`,
    actionText: 'Study DBMS Module',
    actionPage: 'learning-studio',
    relatedFaqIds: ['faq-tech-1', 'faq-tech-3'],
    tags: ['dbms', 'normalization', '1nf', '2nf', '3nf', 'bcnf', 'sql'],
  },
  {
    id: 'faq-tech-3',
    categoryId: 'technical-concepts',
    question: 'How does the TCP 3-way handshake work and why is a 2-way handshake insufficient?',
    shortSummary: 'SYN, SYN-ACK, ACK sequence and duplicate packet handling.',
    answer: `The TCP 3-way handshake establishes a reliable, bidirectional transport stream between client and server:

1. **Step 1 (SYN)**: Client sends \`SYN=1, seq=x\` to initialize its sequence number.
2. **Step 2 (SYN-ACK)**: Server replies with \`SYN=1, ACK=1, seq=y, ack=x+1\`, acknowledging client sequence and providing its own sequence number.
3. **Step 3 (ACK)**: Client sends \`ACK=1, ack=y+1\`, acknowledging the server's sequence number. Connection is now \`ESTABLISHED\`.

**Why isn't a 2-way handshake enough?**
In an unreliable IP network, delayed duplicate SYN packets can wander through the internet and arrive at the server long after an old connection has terminated. With a 2-way handshake, the server would immediately allocate memory and open a half-open ghost connection. The 3rd ACK packet ensures the client actually originated the request and confirms bidirectional reachability.`,
    actionText: 'Study Networks Module',
    actionPage: 'learning-studio',
    relatedFaqIds: ['faq-tech-1', 'faq-tech-4'],
    tags: ['networks', 'tcp', 'handshake', 'syn', 'ack', 'osi'],
  },
  {
    id: 'faq-tech-4',
    categoryId: 'technical-concepts',
    question: 'Explain the SOLID principles in Object-Oriented Design.',
    shortSummary: 'Five architectural rules for modular, extensible, and clean code.',
    answer: `SOLID represents five design principles that prevent software rot and tight coupling:

• **S — Single Responsibility Principle (SRP)**: A class should have one, and only one, reason to change (e.g. separate data persistence from report generation).
• **O — Open/Closed Principle (OCP)**: Software entities should be open for extension, but closed for modification (achieved via interfaces and abstract base classes).
• **L — Liskov Substitution Principle (LSP)**: Subtypes must be substitutable for their base types without altering program correctness (e.g., a Square inheriting from Rectangle violates LSP if width/height vary independently).
• **I — Interface Segregation Principle (ISP)**: Clients should never be forced to depend on interfaces they do not use (prefer many small, cohesive interfaces over one fat interface).
• **D — Dependency Inversion Principle (DIP)**: High-level modules should not depend on low-level modules; both should depend on abstractions (Dependency Injection).`,
    actionText: 'Study OOP Module',
    actionPage: 'learning-studio',
    relatedFaqIds: ['faq-tech-1', 'faq-code-1'],
    tags: ['solid', 'oop', 'design patterns', 'software architecture', 'clean code'],
  },

  // 4. APTITUDE PREPARATION
  {
    id: 'faq-apt-1',
    categoryId: 'aptitude-prep',
    question: 'What are the highest-weightage Quantitative Aptitude topics in campus screening?',
    shortSummary: 'Mastering Percentages, Time & Work, Speed/Distance, and Probability.',
    answer: `Over 80% of screening math questions across TCS NQT, Wipro, Infosys, Cognizant, and Capgemini come from these six core areas:

1. **Percentages, Profit & Loss, and Ratios**: Forms the foundation of arithmetic and data interpretation charts.
2. **Time and Work / Pipes & Cisterns**: Unit work method ($1/A + 1/B = 1/T$) and efficiency ratios.
3. **Time, Speed, and Distance**: Relative speed, trains crossing platforms, boats and streams against/with current.
4. **Permutations, Combinations & Probability**: Selection vs arrangement, independent events, Bayes theorem basics.
5. **Averages, Mixtures & Alligations**: Alligation rule for weighted mixtures.
6. **Number Systems & Divisibility Rules**: Unit digit calculation, remainders theorem, LCM/HCF word problems.

Practice these topics under timed test mode in NEXORA's **Practice Lab** to build rapid calculation reflexes without relying on a calculator.`,
    actionText: 'Practice Quantitative Aptitude',
    actionPage: 'practice',
    relatedFaqIds: ['faq-apt-2', 'faq-apt-3', 'faq-plan-1'],
    tags: ['quantitative', 'math', 'aptitude', 'percentages', 'speed distance', 'screening'],
  },
  {
    id: 'faq-apt-2',
    categoryId: 'aptitude-prep',
    question: 'How can I improve speed and accuracy in Logical Reasoning?',
    shortSummary: 'Techniques for Seating Arrangements, Syllogisms, and Blood Relations.',
    answer: `Logical reasoning rewards structured deduction over brute-force trial and error:

• **Linear & Circular Seating Arrangements**: Draw a circle or line immediately. Place definite clues first (e.g. "A sits 3rd to the left of B"). Then test 2 parallel branch diagrams for ambiguous clues until one branch reaches a contradiction.
• **Syllogisms (Some / All / No)**: Use standard Venn diagrams or Euler circles. Never assume real-world facts—strictly adhere to the given statements. Remember that "Some A are B" does NOT automatically imply "Some A are not B".
• **Blood Relations**: Use family tree diagrams with standard notation (+ for male, - for female, = for married couples, vertical lines for generational descent).
• **Coding-Decoding**: Write the A-Z alphabet indices (A=1, Z=26) and reverse indices (A=26, Z=1) at the start of your scratch sheet for instant offset spotting.`,
    actionText: 'Practice Logical Reasoning',
    actionPage: 'practice',
    relatedFaqIds: ['faq-apt-1', 'faq-apt-3'],
    tags: ['logical reasoning', 'syllogisms', 'seating arrangement', 'blood relations', 'puzzles'],
  },
  {
    id: 'faq-apt-3',
    categoryId: 'aptitude-prep',
    question: 'How do Data Interpretation sets differ across IT Service vs Product companies?',
    shortSummary: 'Volume/calculation-heavy vs multi-step deduction and logic.',
    answer: `Understanding the difference in DI testing styles allows you to tailor your strategy:

• **IT Service Companies (TCS, Infosys, Accenture)**:
  - Focus on **calculation stamina**: Bar graphs, Pie charts, and Multi-column tabular data.
  - Questions require calculating compound percentage growth, average ratios across years, and cumulative sales.
  - Tip: Practice rounding approximations (e.g., $498 / 1503 \\approx 500 / 1500 = 33.3\\%$) to eliminate 3 out of 4 multiple-choice options without computing long division.

• **Product & Tier-1 Companies (Goldman Sachs, Cisco, Amazon)**:
  - Focus on **logical data sufficiency and caselets**: Incomplete tables where missing values must be deduced before solving.
  - Multi-variable Venn diagrams and radar/spider graphs.
  - Tip: Focus on verifying whether Statement 1 alone, Statement 2 alone, or both combined are sufficient to arrive at a unique mathematical answer.`,
    actionText: 'Take Practice Quiz',
    actionPage: 'practice',
    relatedFaqIds: ['faq-apt-1', 'faq-apt-2'],
    tags: ['data interpretation', 'pie chart', 'bar graph', 'tcs', 'infosys', 'product'],
  },

  // 5. CODING HELP
  {
    id: 'faq-code-1',
    categoryId: 'coding-help',
    question: 'Which Data Structures should I prioritize first before campus drives?',
    shortSummary: 'High-frequency DS roadmap: Arrays, HashMaps, Two-Pointers, Trees, and DP.',
    answer: `Campus coding rounds follow an 80/20 rule. Focusing on these high-yield structures yields the highest return:

1. **Arrays & HashMaps (Priority 1)**:
   • Prefix sums, sliding window, two-pointer technique ($O(n)$ time).
   • Frequency counting and collision handling in HashMaps ($O(1)$ average lookup).
2. **Strings & Two Pointers (Priority 1)**:
   • Palindrome checks, anagram grouping, string reversal in-place.
3. **Stacks & Queues (Priority 2)**:
   • Monotonic stack (Next Greater Element), valid parentheses matching, BFS level-order traversal with Queues.
4. **Binary Search & Trees (Priority 2)**:
   • Binary Search on sorted ranges and search-space reduction ($O(\\log n)$).
   • Tree traversals (In-order, Pre-order, Post-order), Maximum Depth, LCA (Lowest Common Ancestor).
5. **Dynamic Programming Basics (Priority 3)**:
   • 1D arrays: Climbing Stairs, House Robber, Coin Change. Understand the transition recurrence relation and memoization.`,
    actionText: 'Solve Coding Challenges',
    actionPage: 'practice',
    relatedFaqIds: ['faq-code-2', 'faq-code-3', 'faq-plan-1'],
    tags: ['dsa', 'arrays', 'hashmap', 'trees', 'strings', 'dynamic programming'],
  },
  {
    id: 'faq-code-2',
    categoryId: 'coding-help',
    question: 'How do I approach a coding problem under 25-minute test pressure?',
    shortSummary: 'The 4-stage systematic problem solving framework.',
    answer: `Rushing into code without a clear strategy leads to bugs and panic. Follow this proven 4-stage execution model:

• **Minutes 0-5 (Clarify & Edge Cases)**:
  - Read input constraints: If $N \\le 10^5$, an $O(n^2)$ nested loop will Time Out ($> 10^8$ operations/sec). You need an $O(n)$ or $O(n \\log n)$ solution.
  - Identify edge cases: Empty input array, single element, all duplicates, negative numbers, overflow limits.

• **Minutes 5-10 (Design & Trace)**:
  - Formulate your approach on scratch paper.
  - Trace with the sample input and one custom corner case step-by-step before touching the keyboard.

• **Minutes 10-18 (Implement with Clean Variables)**:
  - Write modular code in Python 3 or Node.js in the NEXORA live code editor.
  - Name variables descriptively (\`left\`, \`right\`, \`currSum\`, not \`x\`, \`y\`, \`temp\`).

• **Minutes 18-25 (Dry Run & Submit)**:
  - Run the test suite in the isolated sandbox runner.
  - Verify edge cases before final submission.`,
    actionText: 'Open Live Code Editor',
    actionPage: 'practice',
    relatedFaqIds: ['faq-code-1', 'faq-code-3'],
    tags: ['coding pressure', 'problem solving', 'time limit', 'edge cases', 'interview strategy'],
  },
  {
    id: 'faq-code-3',
    categoryId: 'coding-help',
    question: 'How does the NEXORA code runner evaluate test cases?',
    shortSummary: 'Real isolated child-process execution in Python 3 and Node.js.',
    answer: `Unlike superficial mock platforms that merely compare string output against hardcoded answers, NEXORA executes your real code inside a sandboxed environment:

• **Real Runtime Execution**: When you click **Run Code** or **Submit Solution**, your code is written to an isolated temporary script and executed by your local machine's native Python 3 or Node.js runtime.
• **Security & Resource Guards**: Execution is enforced with a strict **3.0-second timeout** and a **64MB memory limit** to prevent infinite loops or memory exhaustion.
• **Comprehensive Test Suite**: The runner checks your code against multiple structured input vectors:
  - Public sample cases (displayed in the console for instant debugging).
  - Hidden edge cases (empty inputs, maximum bound values, negative integers).
• **Real Verdict Feedback**: Outputs standard competitive programming verdicts:
  - \`Accepted (AC)\`: All test cases passed with execution time in milliseconds.
  - \`Wrong Answer (WA)\`: Shows expected vs actual output for the first failing case.
  - \`Time Limit Exceeded (TLE)\`: Solution exceeded the 3.0-second algorithmic threshold.
  - \`Compilation / Runtime Error\`: Full stack trace and syntax error line numbers.`,
    actionText: 'Try Code Runner',
    actionPage: 'practice',
    relatedFaqIds: ['faq-code-1', 'faq-code-2'],
    tags: ['code runner', 'sandbox', 'python', 'nodejs', 'verdict', 'test cases'],
  },

  // 6. INTERVIEW PREPARATION
  {
    id: 'faq-interview-1',
    categoryId: 'interview-prep',
    question: 'How should I structure my answer to "Tell me about yourself"?',
    shortSummary: 'The Present-Past-Future 90-second formula.',
    answer: `Your self-introduction sets the tone for the entire interview. Avoid repeating your entire high school marksheet or listing hobbies. Use the **90-second Present-Past-Future formula**:

1. **Present (30 seconds)**:
   • Your name, current degree and branch at RV College of Engineering, and your core technical focus (e.g., "I'm a final-year Computer Science student specializing in scalable backend systems and distributed algorithms").
2. **Past & Key Achievements (30 seconds)**:
   • Highlight 1 standout academic/hackathon project and your specific contribution with measurable impact (e.g., "Recently, I architected a distributed task processing engine using Node.js and Redis that handled 10,000 asynchronous tasks with automated failover").
   • Mention your algorithmic fluency (e.g. "I have solved 250+ DSA problems focusing on tree traversals and graph algorithms").
3. **Future & Company Alignment (30 seconds)**:
   • Connect your skills to the specific role and company (e.g., "I am eager to contribute to [Company Name]'s cloud infrastructure team where I can apply my systems programming and low-latency API experience").

Practice speaking this into NEXORA's Mock Interview voice recorder to assess your vocal cadence and duration.`,
    actionText: 'Practice Spoken Intro',
    actionPage: 'interview',
    relatedFaqIds: ['faq-interview-2', 'faq-interview-3', 'faq-resume-1'],
    tags: ['tell me about yourself', 'self introduction', 'hr round', 'first impression'],
  },
  {
    id: 'faq-interview-2',
    categoryId: 'interview-prep',
    question: 'How do I use the STAR framework for behavioral interview questions?',
    shortSummary: 'Situation, Task, Action, and Result structured storytelling.',
    answer: `Recruiters ask behavioral questions ("Tell me about a time you handled a conflict", "Describe a technical obstacle you overcame") to assess team culture and maturity. Structure your answer using **STAR**:

• **S — Situation (20% of time)**: Set the context briefly. Where were you, who was on the team, and what was the initial setup?
• **T — Task (10% of time)**: State the specific challenge or deadline your team had to resolve.
• **A — Action (50% of time — MOST IMPORTANT)**: Explain *what YOU personally did*. Use active verbs: "I profiled the database queries using EXPLAIN", "I initiated a daily standup to align conflicting requirements", "I implemented automated unit tests to isolate the bug". Avoid saying only "we did this".
• **R — Result (20% of time)**: Conclude with quantified outcomes and personal lessons: "As a result, we reduced query latency by 45% and delivered the module 2 days ahead of the hackathon deadline".

NEXORA's Mock Interview Studio provides guided STAR evaluation for behavioral questions.`,
    actionText: 'Launch Mock Interview',
    actionPage: 'interview',
    relatedFaqIds: ['faq-interview-1', 'faq-interview-3'],
    tags: ['star method', 'behavioral', 'hr interview', 'situation task action result'],
  },
  {
    id: 'faq-interview-3',
    categoryId: 'interview-prep',
    question: 'What should I do if I do not know the answer to a technical question?',
    shortSummary: 'Honesty, analytical reasoning, and transparent problem-solving.',
    answer: `Never attempt to guess randomly, bluff, or recite inaccurate buzzwords. Technical interviewers evaluate your analytical thought process under uncertainty:

1. **Acknowledge honestly**: Say, "I haven't worked with that specific protocol/technology directly, but based on my understanding of [related fundamental concept], here is how I would reason about it."
2. **Think aloud**: Explain your assumptions: "If the goal is to optimize for read-heavy throughput over write consistency, I would look at adding a Redis caching layer or read-replicas."
3. **Ask clarifying questions**: Ask if certain parameters are bounded (e.g. memory constraints, network latency).
4. **Demonstrate curiosity**: If the interviewer provides a hint or explains the concept, actively listen, synthesize what they said, and thank them for the insight.

Interviewers frequently hire candidates who admit gaps with intellectual honesty over candidates who attempt to fake knowledge.`,
    actionText: 'Start Voice Interview',
    actionPage: 'interview',
    relatedFaqIds: ['faq-interview-1', 'faq-interview-2'],
    tags: ['unknown question', 'technical interview', 'honesty', 'thought process', 'hints'],
  },

  // 7. RESUME PREPARATION
  {
    id: 'faq-resume-1',
    categoryId: 'resume-prep',
    question: 'What is the ideal layout for a single-page technical fresher resume?',
    shortSummary: 'Clean single-column A4 layout passing modern ATS scanners.',
    answer: `Campus ATS (Applicant Tracking Systems) and engineering recruiters review resumes in an average of 6 to 10 seconds. Your document must follow strict formatting standards:

1. **Header (Single Row)**: Full Name, Clean Email, Phone Number, LinkedIn URL, and GitHub Portfolio link. (No photo, no physical street address, no marital status).
2. **Education (Top for Freshers)**: RV College of Engineering, Degree, Branch, CGPA, and Graduation Year (2026).
3. **Technical Skills (Categorized)**:
   • Programming Languages: C++, Java, Python, TypeScript, SQL.
   • Frameworks & Tools: React, Node.js, Express, Docker, Git.
   • Core Foundations: DSA, Operating Systems, DBMS, Computer Networks.
4. **Projects (2-3 High-Impact Projects)**: 3-4 bullet points per project detailing Problem, Stack, Action, and Quantified Result.
5. **Achievements & Certifications**: Competitive programming ranks, hackathon wins, academic honors.

NEXORA includes a built-in **ATS-Compliant Resume Builder** with automatic A4 page constraint enforcement and clean PDF printing.`,
    actionText: 'Open Resume Builder',
    actionPage: 'resume',
    relatedFaqIds: ['faq-resume-2', 'faq-resume-3'],
    tags: ['resume layout', 'ats', 'fresher cv', 'single page', 'rvce'],
  },
  {
    id: 'faq-resume-2',
    categoryId: 'resume-prep',
    question: 'How do I write impactful project bullet points using action verbs and metrics?',
    shortSummary: 'The Google XYZ formula: Accomplished [X], as measured by [Y], by doing [Z].',
    answer: `Vague bullets like *"Worked on an e-commerce website"* fail to impress recruiters. Transform every bullet point using the **Google XYZ Formula**:

• **Weak**: "Created a chat application using Node.js and Socket.io."
• **Impactful (XYZ)**: "Architected a real-time collaborative chat service supporting 500+ concurrent WebSocket connections with sub-50ms message latency using Node.js and Redis pub/sub."

• **Weak**: "Did database indexing for faster queries."
• **Impactful (XYZ)**: "Optimized relational MySQL schema with composite B+ Tree indexing, reducing average API response latency by 38% under high load simulations."

Key Action Verbs to use: **Architected, Engineered, Optimized, Implemented, Benchmarked, Automated, Refactored, Spearheaded**.`,
    actionText: 'Edit Resume Bullets',
    actionPage: 'resume',
    relatedFaqIds: ['faq-resume-1', 'faq-resume-3'],
    tags: ['action verbs', 'xyz formula', 'metrics', 'bullet points', 'impact'],
  },
  {
    id: 'faq-resume-3',
    categoryId: 'resume-prep',
    question: 'How do I export my NEXORA resume to a clean A4 PDF without UI buttons?',
    shortSummary: 'Built-in print stylesheet hiding sidebars and floating controls.',
    answer: `NEXORA features a dedicated CSS print engine configured specifically for standard **A4 portrait dimensions (210mm x 297mm)**:

1. Go to the **Resume Builder** studio in NEXORA.
2. Fill out or customize your contact details, education, technical skills, projects, and work experience.
3. Click the **Print / Export PDF** button at the top right of the resume preview.
4. In your browser's Print dialog:
   • Destination: Choose **Save as PDF**.
   • Layout: **Portrait**.
   • Paper size: **A4**.
   • Margins: **Default** or **None** (NEXORA's stylesheet automatically applies precise 12mm print margins).
   • Options: Check **Background graphics** so subtle accent borders and badge badges render cleanly.

The print engine automatically strips the sidebar, navigation orb, and assistant window, generating an unblemished corporate-ready document.`,
    actionText: 'Export Resume PDF',
    actionPage: 'resume',
    relatedFaqIds: ['faq-resume-1', 'faq-resume-2'],
    tags: ['pdf export', 'print', 'a4', 'resume print', 'clean document'],
  },

  // 8. CAREER & SKILL DEVELOPMENT
  {
    id: 'faq-career-1',
    categoryId: 'career-skills',
    question: 'What is the difference between Software Developer, Backend, and DevOps roles?',
    shortSummary: 'Skill matrices, daily responsibilities, and interview expectations.',
    answer: `Understanding role specializations helps you target the right companies and interview rounds:

• **Software Developer / Full Stack**: Builds end-to-end features spanning React frontend and Node/Python backend. Evaluated heavily on algorithmic problem-solving (DSA), Clean OOP code, and RESTful API integration.
• **Backend / Systems Engineer**: Specializes in database indexing, caching strategies (Redis), concurrency, transaction isolation, and high-throughput microservices. Evaluated on OS fundamentals, SQL/NoSQL trade-offs, and system architecture.
• **DevOps / Cloud Infrastructure**: Manages automated CI/CD pipelines, Docker containerization, Kubernetes orchestration, infrastructure as code (Terraform), and system observability (Prometheus/Grafana). Evaluated on Linux shell scripting, networking, and deployment reliability.

Check NEXORA's **Role Catalogue** for complete 3-phase roadmaps and required skill profiles for over 26 engineering roles.`,
    actionText: 'View Career Roles',
    actionPage: 'overview',
    relatedFaqIds: ['faq-career-2', 'faq-career-3'],
    tags: ['career paths', 'software developer', 'backend', 'devops', 'roles'],
  },
  {
    id: 'faq-career-2',
    categoryId: 'career-skills',
    question: 'How do core branch students (ECE, EEE, Mech, Civil) prepare for tech placements?',
    shortSummary: 'Bridging the curriculum gap with essential CSE core foundations.',
    answer: `Core engineering students have strong mathematical and analytical foundations. To successfully clear software placement drives, focus on bridging three key areas:

1. **Pick ONE Language Thoroughly**: Master C++ (with STL) or Java (with Collections Framework) or Python. Know how standard library structures (vectors, hash maps, queues, sort algorithms) work under the hood.
2. **Master the Big 3 CSE Core Subjects**:
   • **Data Structures & Algorithms**: Focus on Arrays, HashMaps, Strings, Two-Pointers, and Recursion.
   • **DBMS & SQL**: Write clean queries with \`JOIN\`, \`GROUP BY\`, \`HAVING\`, and understand 1NF-3NF.
   • **Operating Systems / OOP**: Learn Process vs Thread, memory models, and SOLID principles.
3. **Showcase 1 End-to-End Software Project**: Build a project that demonstrates real problem-solving rather than just classroom assignments (e.g., an IoT sensor analytics dashboard, or an automated numerical simulation tool).

NEXORA provides domain modules for ECE, EEE, Mechanical, Chemical, and Civil alongside CSE core tracks.`,
    actionText: 'View Branch Modules',
    actionPage: 'learning-studio',
    relatedFaqIds: ['faq-career-1', 'faq-tech-1', 'faq-code-1'],
    tags: ['core branches', 'ece', 'eee', 'mechanical', 'civil', 'non-cs placements'],
  },
  {
    id: 'faq-career-3',
    categoryId: 'career-skills',
    question: 'What kind of projects make a resume stand out to Tier-1 recruiters in 2026?',
    shortSummary: 'Original problem solving over tutorial clones.',
    answer: `Recruiters reject generic tutorial clones (like basic to-do lists, simple calculators, or boilerplate ecommerce clones). Standout projects demonstrate real engineering constraints:

• **Idea 1: Distributed Task Queue / Scheduler**:
  - Build an asynchronous worker system in Node.js or Go using Redis queues with retry logic, rate limiting, and failure dead-letter queues.
• **Idea 2: Real-Time Collaborative Canvas / Document**:
  - Implement Operational Transformation or CRDT algorithms over WebSockets with live cursor tracking and conflict resolution.
• **Idea 3: Custom Storage Engine or Key-Value Store**:
  - Implement an in-memory or disk-backed Log-Structured Merge (LSM) tree or B+ Tree with Write-Ahead Logging (WAL) in C++ or Python.
• **Idea 4: Domain-Specific AI / Systems Tool**:
  - Build a campus placement diagnostic engine (like NEXORA!) with local database persistence, process-isolated sandboxed code execution, and structured analytics.

Highlight system throughput, latency reductions, test coverage, and architecture diagrams in your GitHub repository README.`,
    actionText: 'Update Project in Resume',
    actionPage: 'resume',
    relatedFaqIds: ['faq-resume-2', 'faq-career-1'],
    tags: ['projects', 'tier-1', 'portfolio', 'github', 'standout resume'],
  },
];

