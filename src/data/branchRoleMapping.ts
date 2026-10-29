import { RoadmapPhase, DailyTask, PlacementSimulation, InterviewRoundType } from '../types';

export const ALLOWED_DEGREES = [
  'Bachelor of Technology (B.Tech.)',
  'Bachelor of Engineering (B.E.)',
] as const;

export type AllowedDegree = (typeof ALLOWED_DEGREES)[number];

export interface CrossDomainRoleOption {
  role: string;
  track: string;
  transitionAdvice: string;
}

export interface BranchRoleConfig {
  branchName: string;
  standardBranches: string[];
  primaryRoles: string[];
  crossDomainRoles: CrossDomainRoleOption[];
  coreCompetencies: string[];
  recommendedLanguages: string[];
}

export const BRANCH_CONFIGS: Record<string, BranchRoleConfig> = {
  'Computer Science and Engineering': {
    branchName: 'Computer Science and Engineering',
    standardBranches: ['Computer Science and Engineering', 'CSE', 'Computer Science'],
    primaryRoles: [
      'Software Engineer',
      'Full-Stack Developer',
      'Backend Developer',
      'Frontend Developer',
      'Data Engineer',
      'AI/ML Engineer',
    ],
    crossDomainRoles: [],
    coreCompetencies: ['Data Structures & Algorithms', 'System Design', 'DBMS & SQL', 'Operating Systems', 'Computer Networks'],
    recommendedLanguages: ['Python', 'Java', 'C++', 'JavaScript / TypeScript', 'Go'],
  },
  'Information Science and Engineering': {
    branchName: 'Information Science and Engineering',
    standardBranches: ['Information Science and Engineering', 'ISE', 'Information Technology', 'IT'],
    primaryRoles: [
      'Software Engineer',
      'Full-Stack Developer',
      'Backend Developer',
      'Data Engineer',
      'Cloud Engineer',
      'DevOps Engineer',
    ],
    crossDomainRoles: [],
    coreCompetencies: ['Data Structures & Algorithms', 'Cloud Architecture', 'Web Technologies', 'Database Systems', 'Network Security'],
    recommendedLanguages: ['Python', 'JavaScript / TypeScript', 'Java', 'C++'],
  },
  'Artificial Intelligence and Machine Learning': {
    branchName: 'Artificial Intelligence and Machine Learning',
    standardBranches: ['Artificial Intelligence and Machine Learning', 'AIML', 'AI & DS', 'Data Science'],
    primaryRoles: [
      'AI/ML Engineer',
      'Data Scientist',
      'Data Engineer',
      'Machine Learning Operations (MLOps) Engineer',
      'Software Engineer',
    ],
    crossDomainRoles: [],
    coreCompetencies: ['Machine Learning Algorithms', 'Deep Learning & Neural Networks', 'Python Data Stack', 'Data Pipelines', 'Linear Algebra & Probability'],
    recommendedLanguages: ['Python', 'C++', 'R', 'SQL'],
  },
  'Electronics and Communication Engineering': {
    branchName: 'Electronics and Communication Engineering',
    standardBranches: ['Electronics and Communication Engineering', 'ECE', 'Electronics & Telecom'],
    primaryRoles: [
      'Embedded Systems Engineer',
      'VLSI Design Engineer',
      'Electronics Engineer',
      'Firmware Engineer',
      'Telecommunication Engineer',
    ],
    crossDomainRoles: [
      {
        role: 'Software Engineer (Cross-Domain IT Track)',
        track: 'Software Engineering',
        transitionAdvice: 'Focus on Data Structures, OOP, and Web APIs alongside your electronics logic foundations.',
      },
      {
        role: 'Data Analyst (Cross-Domain Analytics Track)',
        track: 'Data & Analytics',
        transitionAdvice: 'Leverage your signals and math background while building SQL and Python analytics skills.',
      },
    ],
    coreCompetencies: ['Digital Electronics & Verilog', 'Microcontrollers & ARM', 'Embedded C / C++', 'Signal Processing', 'Circuit Design'],
    recommendedLanguages: ['C', 'C++', 'Python', 'Verilog / VHDL'],
  },
  'Electrical and Electronics Engineering': {
    branchName: 'Electrical and Electronics Engineering',
    standardBranches: ['Electrical and Electronics Engineering', 'EEE', 'Electrical Engineering'],
    primaryRoles: [
      'Electrical Design Engineer',
      'Power Systems Engineer',
      'Control Systems Engineer',
      'Embedded Systems Engineer',
      'Instrumentation Engineer',
    ],
    crossDomainRoles: [
      {
        role: 'Software Engineer (Cross-Domain IT Track)',
        track: 'Software Engineering',
        transitionAdvice: 'Strengthen algorithm design, object-oriented programming, and backend architectures.',
      },
      {
        role: 'Data Analyst (Cross-Domain Analytics Track)',
        track: 'Data & Analytics',
        transitionAdvice: 'Combine power grid analysis with SQL and statistical visualization tools.',
      },
    ],
    coreCompetencies: ['Power Electronics', 'Electrical Machines', 'Control Systems & PLC', 'Power System Analysis', 'MATLAB & Simulink'],
    recommendedLanguages: ['C', 'Python', 'MATLAB', 'C++'],
  },
  'Mechanical Engineering': {
    branchName: 'Mechanical Engineering',
    standardBranches: ['Mechanical Engineering', 'MECH', 'Mechanical'],
    primaryRoles: [
      'Mechanical Design Engineer',
      'CAD/CAE Engineer',
      'Manufacturing Engineer',
      'Production Engineer',
      'Quality Engineer',
      'Automotive Engineer',
    ],
    crossDomainRoles: [
      {
        role: 'Software Engineer (Cross-Domain IT Track)',
        track: 'Software Engineering',
        transitionAdvice: 'Non-IT to IT placement track: Requires dedicated mastery of DSA, OOP, and full-stack projects.',
      },
      {
        role: 'Data Analyst (Cross-Domain Analytics Track)',
        track: 'Data & Analytics',
        transitionAdvice: 'Bridge mechanical industrial metrics with SQL, Python Pandas, and business intelligence dashboards.',
      },
    ],
    coreCompetencies: ['SolidWorks / CATIA / AutoCAD', 'Thermodynamics & Heat Transfer', 'Strength of Materials & FEA', 'Manufacturing Processes & GD&T', 'Fluid Mechanics'],
    recommendedLanguages: ['Python', 'MATLAB', 'C++'],
  },
  'Chemical Engineering': {
    branchName: 'Chemical Engineering',
    standardBranches: ['Chemical Engineering', 'CHEM', 'Chemical Technology'],
    primaryRoles: [
      'Process Engineer',
      'Chemical Plant Engineer',
      'Process Design Engineer',
      'Production Engineer',
      'Quality Control Engineer',
      'Environmental Engineer',
    ],
    crossDomainRoles: [
      {
        role: 'Software Engineer (Cross-Domain IT Track)',
        track: 'Software Engineering',
        transitionAdvice: 'Non-IT to IT placement track: Requires disciplined practice in Data Structures, SQL, and OOP.',
      },
      {
        role: 'Data Analyst (Cross-Domain Analytics Track)',
        track: 'Data & Analytics',
        transitionAdvice: 'Process data analysis: Learn Python, SQL, and statistical models for chemical yield optimization.',
      },
    ],
    coreCompetencies: ['Mass Transfer & Distillation', 'Chemical Reaction Engineering', 'Fluid Mechanics & Pumps', 'Heat Exchanger Design', 'P&ID & Process Safety (HAZOP)'],
    recommendedLanguages: ['Python', 'MATLAB', 'Aspen Plus'],
  },
  'Civil Engineering': {
    branchName: 'Civil Engineering',
    standardBranches: ['Civil Engineering', 'CIVIL'],
    primaryRoles: [
      'Structural Engineer',
      'Site Engineer',
      'Geotechnical Engineer',
      'Construction Project Engineer',
      'BIM Engineer',
    ],
    crossDomainRoles: [
      {
        role: 'Software Engineer (Cross-Domain IT Track)',
        track: 'Software Engineering',
        transitionAdvice: 'Non-IT to IT placement track: Learn programming fundamentals, basic DSA, and database queries.',
      },
      {
        role: 'Data Analyst (Cross-Domain Analytics Track)',
        track: 'Data & Analytics',
        transitionAdvice: 'Analyze construction timelines, cost estimation, and material forecasting with SQL & Python.',
      },
    ],
    coreCompetencies: ['Structural Analysis & STAAD.Pro', 'AutoCAD & Revit BIM', 'Concrete Technology & Mix Design', 'Surveying & Total Station', 'Soil Mechanics & Foundations'],
    recommendedLanguages: ['Python', 'MATLAB'],
  },
  'Other': {
    branchName: 'Other Engineering Branch',
    standardBranches: ['Other', 'Biotechnology', 'Aerospace', 'Metallurgy', 'Mining', 'Production'],
    primaryRoles: [
      'Graduate Engineering Trainee (GET)',
      'Operations Engineer',
      'Quality & Systems Engineer',
      'Technical Project Coordinator',
    ],
    crossDomainRoles: [
      {
        role: 'Software Engineer (Cross-Domain IT Track)',
        track: 'Software Engineering',
        transitionAdvice: 'Prepares you for mass-recruiter and tech product placement screening tests.',
      },
      {
        role: 'Data Analyst (Cross-Domain Analytics Track)',
        track: 'Data & Analytics',
        transitionAdvice: 'High-demand campus placement profile combining domain statistics with SQL and Python.',
      },
    ],
    coreCompetencies: ['Engineering Fundamentals', 'Quality Management', 'Analytical Reasoning', 'Project Operations'],
    recommendedLanguages: ['Python', 'C++', 'Java'],
  },
};

export const normalizeBranchName = (rawBranch: string): string => {
  if (!rawBranch) return 'Computer Science and Engineering';
  const cleaned = rawBranch.trim().toLowerCase();

  for (const [key, cfg] of Object.entries(BRANCH_CONFIGS)) {
    if (key.toLowerCase() === cleaned) return key;
    if (cfg.standardBranches.some((b) => b.toLowerCase() === cleaned)) return key;
  }

  if (cleaned.includes('mech')) return 'Mechanical Engineering';
  if (cleaned.includes('chem')) return 'Chemical Engineering';
  if (cleaned.includes('civil')) return 'Civil Engineering';
  if (cleaned.includes('electr') && cleaned.includes('comm')) return 'Electronics and Communication Engineering';
  if (cleaned.includes('electr')) return 'Electrical and Electronics Engineering';
  if (cleaned.includes('ai') || cleaned.includes('machine') || cleaned.includes('data')) return 'Artificial Intelligence and Machine Learning';
  if (cleaned.includes('info') || cleaned.includes('it')) return 'Information Science and Engineering';
  if (cleaned.includes('comp') || cleaned.includes('cse') || cleaned.includes('software')) return 'Computer Science and Engineering';

  return 'Other';
};

export const getRolesForBranch = (branch: string) => {
  const normalized = normalizeBranchName(branch);
  const cfg = BRANCH_CONFIGS[normalized] || BRANCH_CONFIGS['Other'];
  return {
    branchName: cfg.branchName,
    primaryRoles: cfg.primaryRoles,
    crossDomainRoles: cfg.crossDomainRoles,
    coreCompetencies: cfg.coreCompetencies,
    recommendedLanguages: cfg.recommendedLanguages,
  };
};

export const isCrossDomainRole = (branch: string, role: string): boolean => {
  const normalized = normalizeBranchName(branch);
  const cfg = BRANCH_CONFIGS[normalized] || BRANCH_CONFIGS['Other'];
  if (cfg.primaryRoles.includes(role)) return false;
  return cfg.crossDomainRoles.some((c) => c.role === role) || role.includes('Cross-Domain');
};

export const getCrossDomainAdvice = (branch: string, role: string): string | null => {
  const normalized = normalizeBranchName(branch);
  const cfg = BRANCH_CONFIGS[normalized] || BRANCH_CONFIGS['Other'];
  const match = cfg.crossDomainRoles.find((c) => c.role === role);
  if (match) return match.transitionAdvice;
  if (isCrossDomainRole(branch, role)) {
    return `Cross-domain transition: As a ${cfg.branchName} student targeting ${role}, you will focus on campus recruitment screening standards for tech tracks alongside foundational aptitude.`;
  }
  return null;
};

// Branch-Aware Roadmap Generator
export const getRoadmapForBranchAndRole = (branch: string, role: string): RoadmapPhase[] => {
  const normalized = normalizeBranchName(branch);
  const isSoftwareTrack =
    role.includes('Software') ||
    role.includes('Developer') ||
    role.includes('Frontend') ||
    role.includes('Backend') ||
    role.includes('Full-Stack') ||
    role.includes('Data Engineer');

  // Mechanical Engineering Core Track
  if (normalized === 'Mechanical Engineering' && !isCrossDomainRole(branch, role)) {
    return [
      {
        id: 'phase-1',
        title: 'Phase 1: Mechanical Fundamentals & Quantitative Speed',
        subtitle: 'Core mechanics, strength of materials, and placement arithmetic screening',
        duration: 'Weeks 1 - 3',
        learningObjectives: [
          'Solve stress, strain, Mohr’s circle, and shear force/bending moment calculations',
          'Master speed arithmetic and spatial reasoning for engineering campus tests',
          'Review first and second laws of Thermodynamics and basic heat engines',
        ],
        topics: [
          {
            id: 'm-1-1',
            title: 'Strength of Materials & Beam Deflection',
            description: 'Axial loading, torsion in shafts, SFD & BMD diagrams, and Euler column buckling.',
            duration: '6 hours',
            completed: false,
            keyConcepts: ['Young\'s Modulus', 'Principal Stresses', 'Bending Stress Formula', 'Factor of Safety'],
            practiceTask: 'Solve 10 numerical problems on cantilever and simply supported beam deflections.',
          },
          {
            id: 'm-1-2',
            title: 'Aptitude: Quantitative & Spatial Reasoning',
            description: 'Percentages, ratios, time-speed-distance, and 3D mechanical spatial orientation.',
            duration: '5 hours',
            completed: false,
            keyConcepts: ['Spatial Folding', 'Work & Efficiency', 'Speed Calculations'],
            practiceTask: 'Complete 20 timed aptitude questions in the practice lab.',
          },
        ],
      },
      {
        id: 'phase-2',
        title: 'Phase 2: CAD, Tolerancing (GD&T) & Materials',
        subtitle: 'Design standards, manufacturing tolerances, and engineering materials',
        duration: 'Weeks 4 - 6',
        learningObjectives: [
          'Understand Geometric Dimensioning and Tolerancing (GD&T) symbols and datum references',
          'Master Iron-Carbon equilibrium diagram and phase transformations',
          'Review casting, machining, welding, and additive manufacturing processes',
        ],
        topics: [
          {
            id: 'm-2-1',
            title: 'GD&T, Fits, Tolerances & Assembly Design',
            description: 'Hole basis and shaft basis systems, clearance vs interference fits, and datum targets.',
            duration: '6 hours',
            completed: false,
            keyConcepts: ['True Position', 'Concentricity & Runout', 'Max Material Condition (MMC)'],
            practiceTask: 'Review 5 technical mechanical design drawings and identify fit tolerances.',
          },
          {
            id: 'm-2-2',
            title: 'Material Science & Heat Treatment',
            description: 'Austenite, pearlite, martensite transformations, quenching, tempering, and annealing.',
            duration: '5 hours',
            completed: false,
            keyConcepts: ['Fe-C Phase Diagram', 'TTT Curves', 'Hardness & Tensile Testing'],
            practiceTask: 'Summarize case studies on fatigue failure in automotive crankshafts.',
          },
        ],
      },
      {
        id: 'phase-3',
        title: 'Phase 3: Thermal Systems, Fluid Dynamics & FEA',
        subtitle: 'Fluid power, heat exchangers, and simulation principles',
        duration: 'Weeks 7 - 9',
        learningObjectives: [
          'Analyze Bernoulli equation, head losses in pipes, and centrifugal pump characteristics',
          'Calculate LMTD and NTU for counter-flow and parallel-flow heat exchangers',
          'Understand Finite Element Analysis (FEA) mesh convergence and boundary conditions',
        ],
        topics: [
          {
            id: 'm-3-1',
            title: 'Fluid Mechanics, Pumps & Turbines',
            description: 'Navier-Stokes basics, laminar vs turbulent boundary layers, and pump cavitation.',
            duration: '6 hours',
            completed: false,
            keyConcepts: ['Reynolds Number', 'Bernoulli Equation', 'NPSH & Specific Speed'],
            practiceTask: 'Solve 5 pump sizing and pipe friction head loss problems.',
          },
        ],
      },
      {
        id: 'phase-4',
        title: 'Phase 4: Core Technical Interview & Project Defense',
        subtitle: 'Defending mechanical design choices, failure analysis, and behavioral readiness',
        duration: 'Weeks 10 - 11',
        learningObjectives: [
          'Articulate CAD/CAE project architecture using engineering metrics',
          'Practice answering failure mode & effects analysis (FMEA) questions',
          'Refine STAR behavioral responses for leading engineering companies (Tata, L&T, Bosch, Mahindra)',
        ],
        topics: [
          {
            id: 'm-4-1',
            title: 'Mechanical Design Project Deep-Dive',
            description: 'Structure a clear 3-minute executive defense of your major design project.',
            duration: '5 hours',
            completed: false,
            keyConcepts: ['Design Trade-offs', 'Cost vs Weight Optimization', 'DFM (Design for Manufacturing)'],
            practiceTask: 'Record your project walkthrough in the AI Mock Interview simulator.',
          },
        ],
      },
    ];
  }

  // Chemical Engineering Core Track
  if (normalized === 'Chemical Engineering' && !isCrossDomainRole(branch, role)) {
    return [
      {
        id: 'phase-1',
        title: 'Phase 1: Chemical Calculations, Fluid Flow & Screening Aptitude',
        subtitle: 'Mass balances, fluid statics, and placement arithmetic screening',
        duration: 'Weeks 1 - 3',
        learningObjectives: [
          'Solve steady-state mass balances with and without chemical reactions and recycle streams',
          'Calculate pressure drops across packed beds and pipe networks using Ergun and Fanning equations',
          'Master speed arithmetic and logical deductions for campus written tests',
        ],
        topics: [
          {
            id: 'c-1-1',
            title: 'Material & Energy Balances',
            description: 'Limiting reactants, yield, selectivity, purge streams, and enthalpy balances.',
            duration: '6 hours',
            completed: false,
            keyConcepts: ['Degrees of Freedom', 'Recycle & Bypass', 'Sensible & Latent Heat'],
            practiceTask: 'Solve 5 steady-state reactor mass balances with recycle streams.',
          },
          {
            id: 'c-1-2',
            title: 'Aptitude & Data Interpretation',
            description: 'Ratios, mixtures & alligations, and reading industrial process trend charts.',
            duration: '5 hours',
            completed: false,
            keyConcepts: ['Alligation Method', 'Percentage Yield Calculations', 'Process Graph Reading'],
            practiceTask: 'Complete 20 timed aptitude questions in the practice lab.',
          },
        ],
      },
      {
        id: 'phase-2',
        title: 'Phase 2: Heat Transfer & Unit Operations',
        subtitle: 'Shell-and-tube exchangers, conductive/convective resistance, and radiation',
        duration: 'Weeks 4 - 6',
        learningObjectives: [
          'Design shell-and-tube heat exchangers using LMTD and Kern\'s method',
          'Analyze boiling regimes and condensation heat transfer coefficients',
          'Review double pipe exchangers, fouling factors, and insulation critical radius',
        ],
        topics: [
          {
            id: 'c-2-1',
            title: 'Heat Exchanger Design & Operations',
            description: 'Overall heat transfer coefficient (U), baffle spacing, and pressure drop tradeoffs.',
            duration: '6 hours',
            completed: false,
            keyConcepts: ['LMTD Correction Factor', 'Fouling Resistance', 'Kern\'s Sizing Method'],
            practiceTask: 'Size a 1-2 shell-and-tube heat exchanger for a cooling water duty.',
          },
        ],
      },
      {
        id: 'phase-3',
        title: 'Phase 3: Mass Transfer, Distillation & Reaction Kinetics',
        subtitle: 'McCabe-Thiele method, absorption columns, and chemical reactor design',
        duration: 'Weeks 7 - 9',
        learningObjectives: [
          'Calculate theoretical plates in distillation columns using the McCabe-Thiele diagram',
          'Analyze CSTR vs PFR conversion and residence time behavior for multiple reactions',
          'Master process safety principles, HAZOP studies, and P&ID symbology',
        ],
        topics: [
          {
            id: 'c-3-1',
            title: 'Distillation Columns & McCabe-Thiele Method',
            description: 'Vapor-liquid equilibrium (VLE), q-line, minimum reflux ratio, and tray hydraulics.',
            duration: '6 hours',
            completed: false,
            keyConcepts: ['Relative Volatility', 'Reflux Ratio (R/Rmin)', 'Flooding & Weeping'],
            practiceTask: 'Graphically determine theoretical stages for a binary ethanol-water column.',
          },
          {
            id: 'c-3-2',
            title: 'Chemical Reaction Engineering (CRE) & Safety',
            description: 'Arrhenius kinetics, non-ideal reactor dispersion, and HAZOP safety methodologies.',
            duration: '5 hours',
            completed: false,
            keyConcepts: ['Space Time & Space Velocity', 'CSTR vs PFR Performance', 'HAZOP Guide Words'],
            practiceTask: 'Review a P&ID diagram and identify 3 potential safety relief hazards.',
          },
        ],
      },
      {
        id: 'phase-4',
        title: 'Phase 4: Plant Process Interview & Simulation Practice',
        subtitle: 'Plant operations defense, troubleshooting, and recruitment interviews',
        duration: 'Weeks 10 - 11',
        learningObjectives: [
          'Defend unit operations choices in plant design projects',
          'Solve plant troubleshooting scenarios (e.g. sudden column pressure surge or pump cavitation)',
          'Practice core chemical company interview rounds (Reliance, BASF, Shell, ITC, Dow)',
        ],
        topics: [
          {
            id: 'c-4-1',
            title: 'Process Plant Simulation & Interview Walkthrough',
            description: 'Present your unit design project with mass balances, sizing, and safety protocols.',
            duration: '5 hours',
            completed: false,
            keyConcepts: ['P&ID Walkthrough', 'Emergency Shutdown Protocols', 'Utility Optimization'],
            practiceTask: 'Complete the Chemical Process Technical Mock Interview round.',
          },
        ],
      },
    ];
  }

  // Electrical & Electronics Engineering Core Track
  if ((normalized === 'Electronics and Communication Engineering' || normalized === 'Electrical and Electronics Engineering') && !isCrossDomainRole(branch, role)) {
    return [
      {
        id: 'phase-1',
        title: 'Phase 1: Circuit Theory, Digital Logic & Screening Aptitude',
        subtitle: 'Ohm’s/Kirchhoff’s laws, Boolean algebra, and placement math drills',
        duration: 'Weeks 1 - 3',
        learningObjectives: [
          'Solve AC/DC circuit analysis, Thevenin/Norton equivalents, and RLC transient responses',
          'Design combinational and sequential logic (K-maps, state machines, flip-flops)',
          'Master speed arithmetic and logical reasoning for hardware company screening tests',
        ],
        topics: [
          {
            id: 'ee-1-1',
            title: 'Analog Circuit Analysis & Op-Amp Circuits',
            description: 'Inverting, non-inverting, differential amplifiers, filters, and frequency response.',
            duration: '6 hours',
            completed: false,
            keyConcepts: ['Thevenin Theorem', 'Virtual Ground Principle', 'Bode Plots & Bandwidth'],
            practiceTask: 'Solve 10 Op-Amp amplifier and active filter circuit problems.',
          },
          {
            id: 'ee-1-2',
            title: 'Aptitude: Quantitative & Pattern Logic',
            description: 'Percentages, logarithms, series, and binary arithmetic speed tests.',
            duration: '5 hours',
            completed: false,
            keyConcepts: ['Logic Gates Truth Tables', 'Time & Work', 'Modulo Arithmetic'],
            practiceTask: 'Complete 20 timed aptitude questions in the practice lab.',
          },
        ],
      },
      {
        id: 'phase-2',
        title: 'Phase 2: Microcontrollers, Embedded C & Architecture',
        subtitle: 'ARM/8051 architectures, timers, interrupts, and communication protocols',
        duration: 'Weeks 4 - 6',
        learningObjectives: [
          'Write bare-metal Embedded C drivers for GPIO, UART, I2C, and SPI peripherals',
          'Analyze interrupt service routines (ISRs) and latency tradeoffs',
          'Understand memory mapping, register configuration, and PWM motor control',
        ],
        topics: [
          {
            id: 'ee-2-1',
            title: 'Embedded C, Timers & Communication Protocols',
            description: 'I2C vs SPI vs UART, bit masking, volatile keywords, and hardware interrupts.',
            duration: '7 hours',
            completed: false,
            keyConcepts: ['Volatile Qualifier', 'Interrupt Priority & Nested Vectored Interrupts', 'I2C Clock Stretching'],
            practiceTask: 'Write C driver pseudocode to configure an ADC reading via I2C.',
          },
        ],
      },
      {
        id: 'phase-3',
        title: 'Phase 3: VLSI Design / Power Systems & Control',
        subtitle: 'CMOS logic, setup/hold times or power transmission and transformers',
        duration: 'Weeks 7 - 9',
        learningObjectives: [
          'Master CMOS inverter characteristics, propagation delay, and setup/hold timing margins',
          'Analyze state-space models, stability criteria (Nyquist, Routh-Hurwitz, Root Locus)',
          'Review power factor correction, three-phase power, and transformer testing (for EEE)',
        ],
        topics: [
          {
            id: 'ee-3-1',
            title: 'Timing Analysis, CMOS Logic & Control Systems',
            description: 'Clock jitter, skew, metastability, PID controllers, and feedback stability.',
            duration: '6 hours',
            completed: false,
            keyConcepts: ['Setup & Hold Violations', 'Metastability Resolution', 'PID Tuning'],
            practiceTask: 'Solve 5 setup/hold timing margin calculation problems.',
          },
        ],
      },
      {
        id: 'phase-4',
        title: 'Phase 4: Hardware Technical Interview & Design Defense',
        subtitle: 'Firmware design defense, schematic walkthroughs, and company interviews',
        duration: 'Weeks 10 - 11',
        learningObjectives: [
          'Defend major hardware/firmware project schematics and component selection',
          'Practice live hardware debugging and oscilloscope waveform interpretation',
          'Simulate interviews for top electronics recruiters (Texas Instruments, Qualcomm, Schneider, Intel)',
        ],
        topics: [
          {
            id: 'ee-4-1',
            title: 'Embedded & Hardware Project Walkthrough',
            description: 'Present your PCB design or embedded IoT system with power and latency analysis.',
            duration: '5 hours',
            completed: false,
            keyConcepts: ['BOM Optimization', 'Noise Immunity & Decoupling', 'Firmware State Machine'],
            practiceTask: 'Complete the Embedded & VLSI Technical Mock Interview round.',
          },
        ],
      },
    ];
  }

  // Computer Science & Cross-Domain Software Track (Default for CSE, ISE, AIML, or Non-IT transitioning to IT)
  return [
    {
      id: 'phase-1',
      title: 'Phase 1: Data Structures, Algorithms & Screening Aptitude',
      subtitle: 'Core programming foundations, algorithmic efficiency, and arithmetic speed',
      duration: 'Weeks 1 - 3',
      learningObjectives: [
        'Master arrays, strings, two-pointer techniques, and hash maps with O(n) solutions',
        'Achieve 80%+ accuracy on quantitative and logical reasoning campus tests',
        'Analyze asymptotic time and space complexity with Big-O notation',
      ],
      topics: [
        {
          id: 'cs-1-1',
          title: 'Arrays, Two Pointers & Hash Maps',
          description: 'Single-pass lookup, in-place array manipulation, and sliding window techniques.',
          duration: '6 hours',
          completed: false,
          keyConcepts: ['Two-Sum Hash Map', 'Dutch National Flag', 'Sliding Window Substring'],
          practiceTask: 'Solve Two Sum and Maximum Subarray in the Coding Sandbox.',
        },
        {
          id: 'cs-1-2',
          title: 'Aptitude: Quantitative & Reasoning Fundamentals',
          description: 'Percentages, profit & loss, number series, and logical syllogisms.',
          duration: '5 hours',
          completed: false,
          keyConcepts: ['Speed Arithmetic', 'Syllogisms Matrix', 'Clock & Calendar Formulas'],
          practiceTask: 'Complete 20 timed aptitude questions in the practice lab.',
        },
      ],
    },
    {
      id: 'phase-2',
      title: 'Phase 2: Trees, Graphs, DBMS & Operating Systems',
      subtitle: 'Non-linear data structures, SQL queries, and core CS screening foundations',
      duration: 'Weeks 4 - 6',
      learningObjectives: [
        'Implement BFS and DFS traversals on Binary Search Trees and directed graphs',
        'Write complex SQL queries utilizing GROUP BY, HAVING, and multi-table joins',
        'Understand processes, threads, virtual memory, and deadlock conditions',
      ],
      topics: [
        {
          id: 'cs-2-1',
          title: 'Binary Trees, BSTs & Graph Traversals',
          description: 'Level order traversal, BST search/insert invariants, and cycle detection.',
          duration: '7 hours',
          completed: false,
          keyConcepts: ['Invert Binary Tree', 'BFS Queue Traversal', 'DFS Call Stack'],
          practiceTask: 'Solve Invert Binary Tree and Search in Rotated Sorted Array.',
        },
        {
          id: 'cs-2-2',
          title: 'DBMS Normalization & SQL Queries',
          description: '1NF through BCNF, ACID transactions, and index mechanics (B+ Trees).',
          duration: '5 hours',
          completed: false,
          keyConcepts: ['INNER vs LEFT JOIN', 'ACID Properties', 'B+ Tree Indexing'],
          practiceTask: 'Study the DBMS Technical Concept module and complete the self-check quiz.',
        },
      ],
    },
    {
      id: 'phase-3',
      title: 'Phase 3: System Design, Web Architectures & Dynamic Programming',
      subtitle: 'Scalable system principles, REST APIs, and optimization patterns',
      duration: 'Weeks 7 - 9',
      learningObjectives: [
        'Solve dynamic programming problems with memoization and tabulation',
        'Design scalable client-server architectures with caching (Redis) and load balancing',
        'Master the STAR method for behavioral and leadership rounds',
      ],
      topics: [
        {
          id: 'cs-3-1',
          title: 'Dynamic Programming Patterns',
          description: 'Overlapping subproblems, state transitions, and knapsack problem formulations.',
          duration: '7 hours',
          completed: false,
          keyConcepts: ['Coin Change Formulation', 'Memoization Tables', 'Bottom-Up Tabulation'],
          practiceTask: 'Solve the Coin Change problem in the Coding Sandbox.',
        },
        {
          id: 'cs-3-2',
          title: 'System Design & RESTful Architecture',
          description: 'Horizontal vs vertical scaling, microservices, and HTTP status handling.',
          duration: '5 hours',
          completed: false,
          keyConcepts: ['Stateless APIs', 'Redis Caching', 'Database Sharding'],
          practiceTask: 'Review the System Design Technical Concept module in the practice hub.',
        },
      ],
    },
    {
      id: 'phase-4',
      title: 'Phase 4: Full Multi-Round Placement Simulations',
      subtitle: 'Live technical mock interviews, ATS resume optimization, and corporate screening',
      duration: 'Weeks 10 - 11',
      learningObjectives: [
        'Articulate technical choices clearly during live 1-on-1 mock interviews',
        'Format and verify an ATS-friendly single-page technical resume',
        'Clear full 4-round recruitment simulations within standard company cutoffs',
      ],
      topics: [
        {
          id: 'cs-4-1',
          title: 'Live AI Technical Mock Interview Sprint',
          description: 'Practice speaking out loud and verbalizing complexity trade-offs.',
          duration: '4 hours',
          completed: false,
          keyConcepts: ['STAR Behavioral Framework', 'Complexity Verbalization', 'Edge Case Defense'],
          practiceTask: 'Complete a full 5-question AI Mock Interview session.',
        },
      ],
    },
  ];
};

// Branch-Aware Daily Tasks Generator
export const getDailyTasksForBranchAndRole = (
  branch: string,
  role: string,
  assessmentResult: any | null
): DailyTask[] => {
  const normalized = normalizeBranchName(branch);
  const now = Date.now();

  // If Mechanical Engineering Core
  if (normalized === 'Mechanical Engineering' && !isCrossDomainRole(branch, role)) {
    return [
      {
        id: `task-${now}-1`,
        title: 'Review GD&T Symbols & Fits and Tolerances',
        description: 'Study true position, runout, and hole-shaft clearance standards for mechanical design.',
        category: 'Technical',
        estimatedTime: '25 mins',
        difficulty: 'Medium',
        whyRecommended: 'High-frequency question in mechanical CAD and core manufacturing campus drives.',
        completed: false,
        actionPage: 'technical',
      },
      {
        id: `task-${now}-2`,
        title: 'Practice 10 Mechanical Spatial & Quantitative MCQs',
        description: 'Solve gear rotation, pulley ratios, and speed arithmetic screening questions.',
        category: 'Aptitude',
        estimatedTime: '20 mins',
        difficulty: 'Medium',
        whyRecommended: 'Core engineering screening tests evaluate both arithmetic speed and spatial mechanics.',
        completed: false,
        actionPage: 'aptitude',
      },
      {
        id: `task-${now}-3`,
        title: 'Strength of Materials: Bending & Torsion Calculation',
        description: 'Revise flexure formula (M/I = σ/y = E/R) and polar moment of inertia for solid shafts.',
        category: 'Technical',
        estimatedTime: '20 mins',
        difficulty: 'Easy',
        whyRecommended: 'Fundamental checkpoint for machine design engineering interviews.',
        completed: false,
        actionPage: 'technical',
      },
      {
        id: `task-${now}-4`,
        title: 'Mechanical Mock Interview: Project & Thermodynamics',
        description: 'Practice answering 5 technical questions on manufacturing processes and thermodynamics out loud.',
        category: 'Interview Preparation',
        estimatedTime: '15 mins',
        difficulty: 'Medium',
        whyRecommended: 'Builds clarity and technical vocabulary for campus recruitment panels.',
        completed: false,
        actionPage: 'interview',
      },
    ];
  }

  // If Chemical Engineering Core
  if (normalized === 'Chemical Engineering' && !isCrossDomainRole(branch, role)) {
    return [
      {
        id: `task-${now}-1`,
        title: 'McCabe-Thiele Method & Distillation Review',
        description: 'Review q-line slopes, minimum reflux ratio, and theoretical stage determination.',
        category: 'Technical',
        estimatedTime: '25 mins',
        difficulty: 'Medium',
        whyRecommended: 'Critical core competency for process and plant engineering campus interviews.',
        completed: false,
        actionPage: 'technical',
      },
      {
        id: `task-${now}-2`,
        title: 'Practice 10 Quantitative & Chemical Mixtures MCQs',
        description: 'Solve concentration ratios, alligations, and fluid pressure drop numerical problems.',
        category: 'Aptitude',
        estimatedTime: '20 mins',
        difficulty: 'Medium',
        whyRecommended: 'Arithmetic screening tests determine shortlisting for technical rounds.',
        completed: false,
        actionPage: 'aptitude',
      },
      {
        id: `task-${now}-3`,
        title: 'Heat Exchanger Design: LMTD & Fouling Factors',
        description: 'Review counter-current vs co-current heat transfer calculations in shell-and-tube units.',
        category: 'Technical',
        estimatedTime: '20 mins',
        difficulty: 'Easy',
        whyRecommended: 'High-frequency question in chemical plant engineering interviews (Reliance, BASF, Shell).',
        completed: false,
        actionPage: 'technical',
      },
      {
        id: `task-${now}-4`,
        title: 'Chemical Mock Interview: Process Safety & HAZOP',
        description: 'Practice verbalizing emergency shutdown protocols and P&ID flowcharts.',
        category: 'Interview Preparation',
        estimatedTime: '15 mins',
        difficulty: 'Medium',
        whyRecommended: 'Recruiters evaluate safety-first operational mindset and technical clarity.',
        completed: false,
        actionPage: 'interview',
      },
    ];
  }

  // If ECE / EEE Core
  if ((normalized === 'Electronics and Communication Engineering' || normalized === 'Electrical and Electronics Engineering') && !isCrossDomainRole(branch, role)) {
    return [
      {
        id: `task-${now}-1`,
        title: 'Embedded C: Bitwise Operations & Volatile Keyword',
        description: 'Practice register manipulation, masking, and ISR safety considerations in firmware.',
        category: 'Technical',
        estimatedTime: '25 mins',
        difficulty: 'Medium',
        whyRecommended: 'Standard technical screening filter for embedded and firmware engineering roles.',
        completed: false,
        actionPage: 'technical',
      },
      {
        id: `task-${now}-2`,
        title: 'Practice 10 Electronics Logic & Quantitative MCQs',
        description: 'Solve circuit mesh analysis, logic gate truth tables, and speed arithmetic.',
        category: 'Aptitude',
        estimatedTime: '20 mins',
        difficulty: 'Medium',
        whyRecommended: 'Core screening rounds evaluate both circuit foundations and quick mental arithmetic.',
        completed: false,
        actionPage: 'aptitude',
      },
      {
        id: `task-${now}-3`,
        title: 'Review Communication Protocols: I2C vs SPI vs UART',
        description: 'Compare data lines, clock lines, master-slave addressing, and maximum baud rates.',
        category: 'Technical',
        estimatedTime: '20 mins',
        difficulty: 'Easy',
        whyRecommended: 'Essential interview topic for hardware recruiters (TI, Qualcomm, Schneider).',
        completed: false,
        actionPage: 'technical',
      },
      {
        id: `task-${now}-4`,
        title: 'Hardware Mock Interview: Microcontrollers & Circuit Design',
        description: 'Practice explaining your PCB or microcontroller project and design tradeoffs out loud.',
        category: 'Interview Preparation',
        estimatedTime: '15 mins',
        difficulty: 'Medium',
        whyRecommended: 'Builds confident articulation for technical hardware interviews.',
        completed: false,
        actionPage: 'interview',
      },
    ];
  }

  // Default: CSE, ISE, AIML or Cross-Domain IT
  return [
    {
      id: `task-${now}-1`,
      title: 'Practise 10 Quantitative Aptitude Questions',
      description: 'Focus on percentages, time-work, and speed calculations identified in screening rubrics.',
      category: 'Aptitude',
      estimatedTime: '25 mins',
      difficulty: 'Medium',
      whyRecommended: 'Speed in aptitude tests directly raises your Role Competency Coverage for placement screenings.',
      completed: false,
      actionPage: 'aptitude',
    },
    {
      id: `task-${now}-2`,
      title: 'Solve "Two Sum" and analyze O(n) vs O(n^2)',
      description: 'Implement the single-pass Hash Map solution and explain space-time tradeoffs.',
      category: 'Coding',
      estimatedTime: '20 mins',
      difficulty: 'Easy',
      whyRecommended: 'Core problem-solving foundation frequently tested in campus recruitment rounds.',
      completed: false,
      actionPage: 'coding',
    },
    {
      id: `task-${now}-3`,
      title: 'Review DBMS Normalization & SQL Joins',
      description: 'Study 1NF through BCNF and write 3 SQL queries utilizing INNER and LEFT JOIN.',
      category: 'Technical',
      estimatedTime: '30 mins',
      difficulty: 'Medium',
      whyRecommended: 'Essential technical checkpoint for software engineering placement interviews.',
      completed: false,
      actionPage: 'technical',
    },
    {
      id: `task-${now}-4`,
      title: 'AI Mock Interview: Practice 5 Technical Questions',
      description: 'Practice articulating data structures and runtime complexities with voice or text response.',
      category: 'Interview Preparation',
      estimatedTime: '20 mins',
      difficulty: 'Medium',
      whyRecommended: 'Builds verbal confidence and conceptual depth for technical screening rounds.',
      completed: false,
      actionPage: 'interview',
    },
  ];
};

// Branch-Aware Mock Interview Questions Generator
export const getInterviewQuestionsForBranchAndRole = (
  branch: string,
  role: string,
  round: InterviewRoundType
): string[] => {
  const normalized = normalizeBranchName(branch);

  // Common HR questions regardless of branch
  if (round === 'HR Interview' || round === 'HR') {
    return [
      `Tell me about yourself, your engineering journey in ${branch}, and why you are excited about this ${role} position.`,
      'Describe a situation during a team college project where team members had conflicting viewpoints. How did you facilitate a constructive resolution?',
      'Tell me about an engineering project or academic assignment that failed or did not meet expectations. What went wrong, and what did you learn?',
      `Where do you see yourself professionally in 3 years as a ${role}, and what specific technical skills are you most eager to master?`,
      'How do you manage deadlines and prioritize competing assignments when multiple exams, projects, and interview rounds happen simultaneously?',
      'Give an example of when you had to rapidly learn a completely new software tool, engineering code, or technical concept under a tight deadline.',
      'What kind of work environment and engineering team culture brings out your best performance and creative problem-solving?',
      'Why are you interested in joining our company specifically over other campus recruiters, and how do your career values align with our mission?',
      'Describe a situation where you received constructive critical feedback on your engineering work or presentation. How did you respond?',
      'Do you have any thoughtful questions for us regarding team engineering practices, mentorship programs, or early career growth opportunities?',
    ];
  }

  // Common Project Discussion questions
  if (round === 'Project Discussion') {
    return [
      `Give a 2-minute executive overview of your primary ${branch} capstone or academic project: what problem did it solve and what was your individual role?`,
      'Walk me through the engineering design methodology of your project: calculations, tools, simulation software, or hardware/software stack used.',
      'What was the most challenging technical roadblock or unexpected failure you encountered during this project, and how did you diagnose and resolve it?',
      'What materials, components, or architectural choices did you select for this project, and what alternatives did you reject and why?',
      'How did you validate your project results against theoretical benchmarks, simulation models, or experimental test data?',
      'If your project were to be scaled for commercial production or 100x higher operating loads tomorrow, what would be the first point of failure?',
      'What safety standards, industry codes, or regulatory considerations (e.g. ISO, ASME, IEEE, OSHA) apply to your project domain?',
      'What engineering trade-offs did you consciously make during development due to time, cost, or manufacturing constraints?',
      'If you had another semester and a dedicated budget to refine this project, what is the single most impactful feature or improvement you would engineer?',
      'How did you document your project findings, and how would you hand over your design schematics or codebase to a colleague?',
    ];
  }

  // Common Aptitude & Reasoning questions
  if (round === 'Aptitude & Reasoning' || round === 'Aptitude Discussion') {
    return [
      'How would you approach estimating the material or computational throughput needed to process 10,000 units per hour under 95% reliability?',
      'Explain how you calculate the probability of picking at least one defective component from a manufactured batch with a 4% historical defect rate.',
      'An engineering system’s operational efficiency improves by 12% after each maintenance overhaul. How do you estimate cumulative gain over 3 cycles?',
      'How do you approach solving multi-variable arrangement and constraint puzzles under strict 60-second time limits?',
      'Walk me through your mental strategy for rapidly solving time, speed, distance, or fluid flow rate word problems in aptitude rounds.',
      'Explain the logical difference between necessary conditions and sufficient conditions using an engineering system example.',
      'If two synchronized machines or background cycles run every 15 minutes and 25 minutes respectively, after how long do they trigger simultaneously?',
      'How do you interpret a multi-variable scatter plot or process trend line when looking for statistical outliers and variance anomalies?',
      'Explain how Bayes theorem applies to reasoning about diagnostic test accuracy, sensor calibration, and false alarm rates.',
      'What heuristic estimation methods do you use when faced with a screening question where calculating the exact analytical answer takes too long?',
    ];
  }

  // TECHNICAL ROUNDS: Branch-specific!

  // Mechanical Engineering Core
  if (normalized === 'Mechanical Engineering' && !isCrossDomainRole(branch, role)) {
    return [
      'Explain the significance of the Stress-Strain diagram for mild steel. Differentiate between yield strength, ultimate tensile strength, and breaking point.',
      'What is Geometric Dimensioning and Tolerancing (GD&T)? Explain the difference between runout and total runout, and how datum reference frames are selected.',
      'State the First and Second Laws of Thermodynamics. Explain why the Carnot cycle represents the theoretical maximum thermal efficiency.',
      'Compare casting, forging, and machining processes. When would you specify forging over casting for high-stress automotive or aerospace components?',
      'What is the difference between clearance fit, interference fit, and transition fit? Describe a real-world assembly where interference fit is mandatory.',
      'Explain the physical phenomena of cavitation in centrifugal pumps, its damaging consequences on impellers, and how to prevent it using NPSH.',
      'What is Mohr’s Circle, and how is it used to determine principal stresses and maximum shear stress in a structural beam under combined loading?',
      'Describe the Iron-Carbon phase diagram: define the eutectoid, eutectic, and peritectic points, and explain the mechanism of martensite formation during quenching.',
      'How does heat transfer occur through conduction, convection, and radiation? Explain Fourier’s Law and Newton’s Law of Cooling with industrial examples.',
      'What are the primary modes of mechanical failure (fatigue, creep, brittle fracture, yielding)? How does an S-N curve guide fatigue-resistant design?',
    ];
  }

  // Chemical Engineering Core
  if (normalized === 'Chemical Engineering' && !isCrossDomainRole(branch, role)) {
    return [
      'Explain the McCabe-Thiele method for binary distillation column design. How does the reflux ratio influence the number of theoretical stages and condenser duty?',
      'What is the difference between a Continuous Stirred-Tank Reactor (CSTR) and a Plug Flow Reactor (PFR)? Under what reaction kinetics is PFR superior to CSTR?',
      'Explain Bernoulli’s equation and how head losses due to friction in pipe networks and valves are quantified using the Darcy-Weisbach equation.',
      'Describe the operating mechanisms of Shell-and-Tube Heat Exchangers. How do you calculate the Log Mean Temperature Difference (LMTD) and correction factor F?',
      'What is the physical meaning of dimensionless numbers in transport phenomena: Reynolds number, Prandtl number, Nusselt number, and Schmidt number?',
      'Explain the concept of Cavitation and Net Positive Suction Head (NPSH) in industrial chemical slurry pumps. How do you ensure NPSH Available exceeds NPSH Required?',
      'What is a Piping and Instrumentation Diagram (P&ID)? Explain common symbology and safety interlock controls depicted on plant flowsheets.',
      'Describe the principles of a HAZOP (Hazard and Operability) study. What guide words (e.g., NO, MORE, LESS, REVERSE) are used to identify process risks?',
      'How does gas absorption in a packed column work? Explain the two-film theory of mass transfer and the significance of the Height of a Transfer Unit (HTU).',
      'Explain the difference between batch, semi-batch, and continuous chemical processes. When is batch processing preferred in specialty chemical manufacturing?',
    ];
  }

  // ECE / EEE Core
  if ((normalized === 'Electronics and Communication Engineering' || normalized === 'Electrical and Electronics Engineering') && !isCrossDomainRole(branch, role)) {
    return [
      'What is the difference between an inverting and non-inverting Op-Amp configuration? What is the concept of virtual ground and gain-bandwidth product?',
      'Explain the difference between I2C, SPI, and UART communication protocols in terms of bus lines, data rates, clock synchronization, and multi-master support.',
      'What are setup time and hold time in digital flip-flops? What happens when a setup or hold violation occurs, and how do you resolve metastability?',
      'Describe the internal operation of an Interrupt Service Routine (ISR) in a microcontroller. Why should delay functions and floating-point math never be inside an ISR?',
      'Explain the significance of the "volatile" keyword in C when writing bare-metal firmware interfacing with hardware registers and shared memory.',
      'Compare BJT and MOSFET operating characteristics. Why are power MOSFETs preferred over BJTs for high-speed switching power supplies (SMPS)?',
      'What is Power Factor, why does an inductive load cause lagging power factor, and how do capacitor banks provide power factor correction?',
      'Explain pulse-width modulation (PWM) and how duty cycle controls motor speed, LED brightness, or DC-DC converter output voltages.',
      'What is the difference between synchronous and asynchronous sequential circuits? Explain race conditions and how clock gating saves dynamic power in VLSI.',
      'How does an analog-to-digital converter (ADC) work? Contrast Successive Approximation (SAR) ADCs with Flash ADCs in terms of resolution, latency, and area.',
    ];
  }

  // Civil Engineering Core
  if (normalized === 'Civil Engineering' && !isCrossDomainRole(branch, role)) {
    return [
      'Explain the difference between Shear Force and Bending Moment. Sketch the SFD and BMD for a simply supported beam with a uniformly distributed load (UDL).',
      'What is the water-cement ratio in concrete mix design, and how does it directly govern compressive strength and workability (slump test)?',
      'Differentiate between shallow foundations (isolated footings, raft) and deep foundations (piles). When is a pile foundation mandatory based on soil bearing capacity?',
      'What are the primary modes of failure in structural concrete members: flexural failure, shear failure, and bond slip? How does shear reinforcement prevent diagonal tension?',
      'Explain the principles of soil compaction vs consolidation. What is the difference between Standard Proctor and Modified Proctor compaction tests?',
      'Describe the difference between Limit State Method (LSM) and Working Stress Method (WSM) in reinforced concrete design as per standard codes.',
      'How do you conduct a geotechnical Standard Penetration Test (SPT) and how is the N-value used to determine safe soil bearing pressure?',
      'What is Building Information Modeling (BIM)? How does 3D clash detection between structural, MEP, and architectural elements reduce construction site rework?',
      'Explain the fundamental assumptions in Euler’s column theory for buckling, and how effective length factors change based on end support boundary conditions.',
      'Describe surveying with a Total Station vs GPS/GNSS. What is closing error in a closed traverse and how is it distributed using Bowditch’s rule?',
    ];
  }

  // Default: Computer Science & IT (or Cross-Domain Software Track)
  return [
    'What is the difference between synchronous and asynchronous execution, and how does the event loop prioritize microtasks vs macrotasks?',
    'Explain the internal collision resolution strategies in hash tables: separate chaining vs open addressing, and their cache locality tradeoffs.',
    'Compare the time and space complexity of Quicksort and Mergesort. In what production scenarios would you prefer Mergesort over Quicksort?',
    'What is the difference between an Abstract Class and an Interface in object-oriented programming, and when should each be used?',
    'Explain database normalization from 1NF to 3NF, and describe a real-world scenario where deliberate denormalization is preferred for read speed.',
    'How does virtual memory work in modern operating systems, and what are page faults and thrashing?',
    'Explain the OSI 7-layer model and specifically contrast TCP (connection-oriented, reliable) with UDP (connectionless, low-latency).',
    'What is the difference between a process and a thread, and how do operating systems manage context switching and race conditions?',
    'Explain the principles of RESTful API design, idempotent HTTP methods, and common HTTP status code ranges (2xx, 4xx, 5xx).',
    'How does a Binary Search Tree maintain ordering, and what self-balancing mechanisms (e.g., AVL or Red-Black trees) ensure O(log n) height?',
  ];
};

// Branch-Aware Placement Simulation Generator
export const getPlacementSimulationForBranchAndRole = (
  branch: string,
  role: string
): PlacementSimulation => {
  const normalized = normalizeBranchName(branch);
  const isCrossDomain = isCrossDomainRole(branch, role);

  if (normalized === 'Mechanical Engineering' && !isCrossDomain) {
    return {
      id: 'sim-mech',
      companyName: 'Tata Motors Precision Engineering',
      role: role || 'Mechanical Design Engineer',
      packageLPA: '8.5 - 12.0 LPA',
      date: new Date().toLocaleDateString(),
      status: 'in_progress',
      rounds: [
        {
          id: 1,
          name: 'Round 1: Mechanical Aptitude & Spatial Reasoning',
          type: 'aptitude',
          title: 'Aptitude & Spatial Screening',
          description: 'Timed assessment covering arithmetic speed, gear ratios, spatial folding, and mechanical reasoning.',
          status: 'current',
          score: undefined,
          maxScore: 100,
          duration: '25 mins',
        },
        {
          id: 2,
          name: 'Round 2: Core Engineering MCQ & GD&T',
          type: 'technical_mcq',
          title: 'Mechanics, GD&T & Material Science',
          description: 'Technical screening on stress-strain, fits & tolerances, manufacturing processes, and thermodynamics.',
          status: 'locked',
          score: undefined,
          maxScore: 100,
          duration: '35 mins',
        },
        {
          id: 3,
          name: 'Round 3: Live Technical Interview & Design Defense',
          type: 'technical_interview',
          title: 'CAD/CAE & Failure Analysis Interview',
          description: 'Deep technical interview defending CAD choices, finite element boundary conditions, and mechanical failure modes.',
          status: 'locked',
          score: undefined,
          maxScore: 100,
          duration: '30 mins',
        },
        {
          id: 4,
          name: 'Round 4: Plant Operations & HR Discussion',
          type: 'hr_interview',
          title: 'Operational Readiness & Culture Fit',
          description: 'Behavioral scenarios, industrial safety mindset, teamwork, and long-term engineering career orientation.',
          status: 'locked',
          score: undefined,
          maxScore: 100,
          duration: '20 mins',
        },
      ],
    };
  }

  if (normalized === 'Chemical Engineering' && !isCrossDomain) {
    return {
      id: 'sim-chem',
      companyName: 'Reliance Petrochemicals & Refining',
      role: role || 'Process Engineer',
      packageLPA: '9.0 - 14.0 LPA',
      date: new Date().toLocaleDateString(),
      status: 'in_progress',
      rounds: [
        {
          id: 1,
          name: 'Round 1: Process Aptitude & Data Interpretation',
          type: 'aptitude',
          title: 'Quantitative & Trend Analysis',
          description: 'Timed assessment covering arithmetic speed, mixtures & alligations, and industrial trend charts.',
          status: 'current',
          score: undefined,
          maxScore: 100,
          duration: '25 mins',
        },
        {
          id: 2,
          name: 'Round 2: Chemical Unit Operations & CRE Screening',
          type: 'technical_mcq',
          title: 'Mass Transfer, Heat Transfer & Reaction Engineering',
          description: 'Technical questions covering McCabe-Thiele, shell-and-tube exchangers, and reactor kinetics.',
          status: 'locked',
          score: undefined,
          maxScore: 100,
          duration: '35 mins',
        },
        {
          id: 3,
          name: 'Round 3: Live Process Design & Plant Troubleshooting',
          type: 'technical_interview',
          title: 'P&ID, HAZOP & Process Interview',
          description: 'Simulated 1-on-1 interview on distillation column operations, emergency relief, and plant troubleshooting.',
          status: 'locked',
          score: undefined,
          maxScore: 100,
          duration: '30 mins',
        },
        {
          id: 4,
          name: 'Round 4: Plant Safety & Behavioral Interview',
          type: 'hr_interview',
          title: 'Industrial Safety Culture & HR',
          description: 'Behavioral scenarios, emergency composure, shift operations, and teamwork in manufacturing plants.',
          status: 'locked',
          score: undefined,
          maxScore: 100,
          duration: '20 mins',
        },
      ],
    };
  }

  if ((normalized === 'Electronics and Communication Engineering' || normalized === 'Electrical and Electronics Engineering') && !isCrossDomain) {
    return {
      id: 'sim-ece',
      companyName: 'Texas Instruments Embedded Solutions',
      role: role || 'Embedded Systems Engineer',
      packageLPA: '11.0 - 16.0 LPA',
      date: new Date().toLocaleDateString(),
      status: 'in_progress',
      rounds: [
        {
          id: 1,
          name: 'Round 1: Quantitative Aptitude & Circuit Logic',
          type: 'aptitude',
          title: 'Aptitude & Digital Logic Screening',
          description: 'Timed screening covering arithmetic speed, binary sequences, and logic gate minimization.',
          status: 'current',
          score: undefined,
          maxScore: 100,
          duration: '25 mins',
        },
        {
          id: 2,
          name: 'Round 2: Embedded C, VLSI & Circuit MCQ',
          type: 'technical_mcq',
          title: 'Microcontrollers, Analog & Digital Electronics',
          description: 'Technical screening covering Op-Amps, timing analysis (setup/hold), I2C/SPI, and C bit manipulation.',
          status: 'locked',
          score: undefined,
          maxScore: 100,
          duration: '35 mins',
        },
        {
          id: 3,
          name: 'Round 3: Live Hardware Architecture & Driver Walkthrough',
          type: 'technical_interview',
          title: 'Schematic & Firmware Architecture',
          description: 'Simulated interview defending microcontroller driver designs, interrupt safety, and oscilloscope debugging.',
          status: 'locked',
          score: undefined,
          maxScore: 100,
          duration: '30 mins',
        },
        {
          id: 4,
          name: 'Round 4: Engineering Team Fit & HR Discussion',
          type: 'hr_interview',
          title: 'Culture Fit & Engineering Composure',
          description: 'Behavioral scenarios, cross-functional collaboration, and long-term hardware engineering aspirations.',
          status: 'locked',
          score: undefined,
          maxScore: 100,
          duration: '20 mins',
        },
      ],
    };
  }

  // Default: Computer Science & IT or Cross-Domain Software Track
  return {
    id: 'sim-cs',
    companyName: isCrossDomain ? 'Global Enterprise Software (Tech Hiring Track)' : 'Apex Enterprise Systems',
    role: role || 'Software Development Engineer',
    packageLPA: isCrossDomain ? '7.5 - 11.0 LPA' : '12.0 - 18.0 LPA',
    date: new Date().toLocaleDateString(),
    status: 'in_progress',
    rounds: [
      {
        id: 1,
        name: 'Round 1: Online Aptitude & Logic Assessment',
        type: 'aptitude',
        title: 'Aptitude & Reasoning Screening',
        description: 'Timed multi-choice assessment covering Quantitative, Logical, and Verbal ability.',
        status: 'current',
        score: undefined,
        maxScore: 100,
        duration: '20 mins',
      },
      {
        id: 2,
        name: 'Round 2: Technical Coding & CS Fundamentals',
        type: 'technical_mcq',
        title: 'Data Structures & Core Engineering',
        description: 'Algorithmic problem solving and core CS concept screening (DBMS, OS, OOP, DSA).',
        status: 'locked',
        score: undefined,
        maxScore: 100,
        duration: '35 mins',
      },
      {
        id: 3,
        name: 'Round 3: Live Technical Interview',
        type: 'technical_interview',
        title: 'System Design & Code Walkthrough',
        description: 'Simulated 1-on-1 interview on project architecture, edge cases, and runtime tradeoffs.',
        status: 'locked',
        score: undefined,
        maxScore: 100,
        duration: '25 mins',
      },
      {
        id: 4,
        name: 'Round 4: HR & Behavioral Discussion',
        type: 'hr_interview',
        title: 'Culture Fit & Situational Interview',
        description: 'Behavioral scenarios, leadership, teamwork, and long-term career orientation.',
        status: 'locked',
        score: undefined,
        maxScore: 100,
        duration: '15 mins',
      },
    ],
  };
};
