import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Code2,
  BookOpen,
  MessageCircle,
  Target,
  Map,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  HelpCircle,
  Play,
  RotateCcw,
  Check,
  X,
  Layers,
  Cpu,
  Database,
  Network,
  Code,
  Compass,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AptitudePracticeView } from './AptitudePracticeView';
import { CodingPracticeView } from './CodingPracticeView';
import { SkillAnalysisView } from './SkillAnalysisView';
import { RoadmapView } from './RoadmapView';
import { CinematicBackground } from '../components/CinematicBackground';
import { DynamicQuizRunner } from '../components/DynamicQuizRunner';

export type PracticeCategory =
  | 'grid'
  | 'quiz'
  | 'aptitude'
  | 'coding'
  | 'technical'
  | 'communication'
  | 'skills'
  | 'roadmap';

interface TechnicalTopic {
  id: string;
  title: string;
  desc: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  iconName: 'os' | 'db' | 'network' | 'arch' | 'oop';
  keyConcept: string;
  deepDive: string[];
  interviewQuestions: string[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const PracticeView: React.FC<{ initialCategory?: PracticeCategory }> = ({
  initialCategory = 'grid',
}) => {
  const { profile, assessmentResult, setCurrentPage, currentPage } = useApp();
  const [activeCategory, setActiveCategory] = useState<PracticeCategory>(initialCategory);
  const [techDifficulty, setTechDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [commDifficulty, setCommDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');

  // Selected topic for detailed study & quiz modal
  const [selectedTopic, setSelectedTopic] = useState<TechnicalTopic | null>(null);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizSubject, setQuizSubject] = useState<string | undefined>(undefined);
  const [quizDifficulty, setQuizDifficulty] = useState<string | undefined>(undefined);

  // Expanded communication drill
  const [expandedCommId, setExpandedCommId] = useState<string | null>(null);

  // Sync with initialCategory when prop changes
  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  const handleBackToGrid = () => {
    setActiveCategory('grid');
    setSelectedTopic(null);
    if (currentPage !== 'practice') {
      setCurrentPage('practice');
    }
  };

  // Dynamic technical topics generator based on student branch
  const getTechnicalTopicsForBranch = (branch?: string): TechnicalTopic[] => {
    const b = branch?.toLowerCase() || '';

    if (b.includes('mechanical')) {
      return [
        {
          id: 'mech-1',
          title: 'Thermodynamics: Second Law, Carnot Cycle & Entropy',
          desc: 'Reversible heat engines, Clausius inequality, entropy generation, and cycle efficiency limits.',
          difficulty: 'Easy',
          category: 'Thermal Engineering',
          iconName: 'arch',
          keyConcept: 'Carnot efficiency eta = 1 - (TL / TH) sets the theoretical upper ceiling for any heat engine operating between two temperatures.',
          deepDive: [
            'First law addresses energy quantity; Second law governs direction and degradation of energy quality.',
            'Clausius statement: Heat cannot spontaneously flow from cold reservoir to hot reservoir without external work.',
            'Isentropic efficiency compares real turbine or compressor output with idealized reversible adiabatic expansion.',
          ],
          interviewQuestions: [
            'Why is 100% thermal efficiency impossible for a continuous heat engine?',
            'What is the physical significance of entropy in an isolated system?',
            'Explain the 4 reversible processes of the Carnot cycle on a T-s diagram.',
          ],
          quiz: {
            question: 'What is the theoretical maximum thermal efficiency of a Carnot heat engine operating between 600 K and 300 K?',
            options: ['25%', '50%', '75%', '100%'],
            correctIndex: 1,
            explanation: 'Efficiency = 1 - (TL / TH) = 1 - (300 / 600) = 0.50 or 50%.',
          },
        },
        {
          id: 'mech-2',
          title: 'Solid Mechanics: Mohr\'s Circle & Principal Stresses',
          desc: 'Coordinate transformation of planar stress states, maximum in-plane shear, and orientation of principal planes.',
          difficulty: 'Medium',
          category: 'Strength of Materials',
          iconName: 'arch',
          keyConcept: 'Principal planes are planes where shear stress tau is zero, experiencing maximum and minimum normal stresses sigma_1 and sigma_2.',
          deepDive: [
            'Mohr\'s circle center is at ((sigma_x + sigma_y) / 2, 0) and radius R = sqrt(((sigma_x - sigma_y)/2)^2 + tau_xy^2).',
            'Maximum in-plane shear stress equals the radius of Mohr\'s circle.',
            'Failure theories: Von Mises is preferred for ductile metals, while Maximum Normal Stress (Rankine) is used for brittle materials.',
          ],
          interviewQuestions: [
            'Why is Von Mises distortion energy theory preferred over Tresca for ductile materials?',
            'What angle separates the principal stress planes from the planes of maximum shear stress?',
            'How do you construct Mohr\'s circle for pure shear loading?',
          ],
          quiz: {
            question: 'On principal planes, what is the value of the shear stress?',
            options: ['Maximum', 'Zero', 'Equal to sigma_1', 'Half of sigma_2'],
            correctIndex: 1,
            explanation: 'By definition, principal planes carry zero shear stress, only normal stresses.',
          },
        },
        {
          id: 'mech-3',
          title: 'Fluid Machinery: Cavitation & NPSH in Centrifugal Pumps',
          desc: 'Vapor pressure thresholds, cavitation erosion at impeller eye, and calculating Net Positive Suction Head.',
          difficulty: 'Medium',
          category: 'Fluid Mechanics & Pumps',
          iconName: 'os',
          keyConcept: 'Cavitation occurs when local static pressure drops below fluid vapor pressure, causing bubbles that implode destructively against impeller vanes.',
          deepDive: [
            'NPSH Available must exceed NPSH Required (provided by manufacturer) by at least 0.5 to 1.0 m safety margin.',
            'Cavitation leads to head drop, severe acoustic noise, vibration, and pitting pitting damage on impeller blades.',
            'Mitigation: Increase suction pipe diameter, lower pump elevation relative to sump, or reduce fluid operating temperature.',
          ],
          interviewQuestions: [
            'What is the formula for NPSH Available at pump suction?',
            'How can you detect cavitation before severe impeller damage occurs?',
            'Explain the affinity laws for centrifugal pumps with changing impeller diameter.',
          ],
          quiz: {
            question: 'To prevent cavitation in a centrifugal pump installation, which condition MUST be satisfied?',
            options: ['NPSH_Available < NPSH_Required', 'NPSH_Available >= NPSH_Required + Safety Margin', 'Flow velocity must exceed speed of sound', 'Pump must run above critical speed'],
            correctIndex: 1,
            explanation: 'NPSH available must always exceed the manufacturer required NPSH with a safety buffer to ensure static pressure never falls below vapor pressure.',
          },
        },
        {
          id: 'mech-4',
          title: 'Design & Metrology: GD&T (Geometric Dimensioning and Tolerancing)',
          desc: 'Datum reference frames, Maximum Material Condition (MMC), true position, flatness, and runout.',
          difficulty: 'Easy',
          category: 'Manufacturing & CAD',
          iconName: 'oop',
          keyConcept: 'GD&T specifies exact geometric tolerances using Feature Control Frames, replacing ambiguous plus/minus coordinate dimensioning.',
          deepDive: [
            'A datum is a theoretically exact reference plane, point, or axis (Datum A, B, C).',
            'True position defines the permissible cylindrical zone where a hole or pin axis can vary.',
            'MMC (Maximum Material Condition - Circle M symbol) provides bonus tolerance as a produced hole grows larger than minimum spec.',
          ],
          interviewQuestions: [
            'What is bonus tolerance and how does MMC affect inspection gauges?',
            'Differentiate between runout and total runout in cylindrical parts.',
            'Why is GD&T essential in modern automated CNC manufacturing?',
          ],
          quiz: {
            question: 'What does the (M) symbol in a Feature Control Frame represent in GD&T?',
            options: ['Minimum Material Condition', 'Maximum Material Condition', 'Metric Standard', 'Millimeter Precision'],
            correctIndex: 1,
            explanation: 'The circled M indicates Maximum Material Condition (MMC), allowing bonus tolerance for mating components.',
          },
        },
        {
          id: 'mech-5',
          title: 'Machine Design: Fatigue Failure & S-N Goodman Diagram',
          desc: 'Fluctuating cyclic loads, endurance limit of steels, stress concentration factors, and Soderberg/Goodman criteria.',
          difficulty: 'Hard',
          category: 'Machine Design',
          iconName: 'arch',
          keyConcept: 'Over 80% of mechanical component failures occur due to cyclic fatigue below yield strength, starting at micro-notches or surface flaws.',
          deepDive: [
            'Endurance limit (Se) is the stress amplitude below which ferrous materials withstand infinite cycles (typically 10^7 cycles).',
            'Goodman line connects alternating stress endurance limit with ultimate tensile strength Sut.',
            'Surface finish, notch sensitivity (q), size factor, and corrosion reduce the effective component endurance limit.',
          ],
          interviewQuestions: [
            'Explain the difference between Soderberg, Goodman, and Gerber fatigue failure criteria.',
            'How does shot peening or nitriding improve the fatigue life of rotating shafts?',
            'What is the difference between low-cycle fatigue (LCF) and high-cycle fatigue (HCF)?',
          ],
          quiz: {
            question: 'Which fatigue design criterion uses the material yield strength (Syt) instead of ultimate tensile strength (Sut)?',
            options: ['Goodman relation', 'Soderberg relation', 'Gerber parabolic line', 'ASME elliptic equation'],
            correctIndex: 1,
            explanation: 'The Soderberg relation conservatively uses yield strength (Syt) on the mean stress axis to guard against both fatigue and gross static yielding.',
          },
        },
        {
          id: 'mech-6',
          title: 'Heat Transfer: LMTD & Shell-and-Tube Heat Exchanger Design',
          desc: 'Log Mean Temperature Difference, co-current vs counter-current flow, fouling resistance, and TEMA standards.',
          difficulty: 'Medium',
          category: 'Heat Transfer',
          iconName: 'network',
          keyConcept: 'Counter-current flow yields a higher LMTD than parallel flow, enabling greater heat duty for identical surface area.',
          deepDive: [
            'Heat duty equation: Q = U * A * F * Delta_T_lm.',
            'LMTD = (Delta_T1 - Delta_T2) / ln(Delta_T1 / Delta_T2).',
            'Baffles induce cross-flow turbulence on the shell side, increasing heat transfer coefficient while increasing shell pressure drop.',
          ],
          interviewQuestions: [
            'Why is counter-current heat exchange thermodynamically superior to parallel flow?',
            'What causes fouling factor in industrial cooling water exchangers and how is it cleaned?',
            'When is the NTU-effectiveness method preferred over the LMTD method in thermal design?',
          ],
          quiz: {
            question: 'For the same inlet and outlet fluid temperatures, which flow arrangement provides the highest LMTD?',
            options: ['Parallel / Co-current flow', 'Counter-current flow', 'Cross flow with both fluids unmixed', 'Cross flow with both fluids mixed'],
            correctIndex: 1,
            explanation: 'Counter-current flow maintains a consistent, larger temperature difference throughout the exchanger, yielding the maximum LMTD.',
          },
        },
      ];
    }

    if (b.includes('chemical')) {
      return [
        {
          id: 'chem-1',
          title: 'Mass Transfer: Distillation & McCabe-Thiele Method',
          desc: 'Vapor-liquid equilibrium (VLE), q-line slopes, minimum reflux ratio, and stepping off theoretical stages.',
          difficulty: 'Medium',
          category: 'Separation Processes',
          iconName: 'arch',
          keyConcept: 'McCabe-Thiele graphical construction steps off ideal trays between the equilibrium curve and operating lines (rectifying and stripping).',
          deepDive: [
            'Feed condition determines q-line slope: subcooled liquid (q > 1, slope > 0), bubble point (q = 1, vertical), saturated vapor (q = 0, horizontal).',
            'Minimum reflux (R_min) creates a pinch point requiring an infinite number of theoretical stages.',
            'Total reflux yields minimum number of theoretical stages (calculated analytically via Fenske equation).',
          ],
          interviewQuestions: [
            'How does feed thermal quality (q-value) change the intersection of operating lines?',
            'What is the Murphree tray efficiency and how does it relate to overall column efficiency?',
            'What causes weeping, entrainment, and flooding in tray columns?',
          ],
          quiz: {
            question: 'For a feed entering a distillation column as a saturated liquid at its boiling point, what is the value of q?',
            options: ['q = 0', 'q = 0.5', 'q = 1.0', 'q > 1.0'],
            correctIndex: 2,
            explanation: 'For a saturated liquid feed, all of the feed enters the liquid downcomer, so q = 1.0 and the q-line is vertical.',
          },
        },
        {
          id: 'chem-2',
          title: 'Fluid Mechanics: Bernoulli Equation & Pipe Pressure Drops',
          desc: 'Fanning friction factor, Moody chart, laminar vs turbulent Reynolds regimes, and head losses.',
          difficulty: 'Easy',
          category: 'Fluid Flow & Hydraulics',
          iconName: 'network',
          keyConcept: 'Pressure drop in circular pipes follows Darcy-Weisbach: Delta_P = f * (L/D) * (rho * v^2 / 2).',
          deepDive: [
            'Laminar flow (Re < 2100): friction factor f = 64 / Re, independent of pipe surface roughness.',
            'Turbulent flow (Re > 4000): friction factor depends on relative roughness (epsilon / D) and Reynolds number via Colebrook equation.',
            'Minor losses account for valves, elbows, contractions, and expansions via resistance coefficients (K-values).',
          ],
          interviewQuestions: [
            'How does fluid viscosity change with temperature for liquids versus gases?',
            'What is the physical meaning of the Reynolds number?',
            'Derive the Bernoulli equation from the Navier-Stokes momentum balance.',
          ],
          quiz: {
            question: 'In fully developed laminar flow inside a circular pipe, what is the Darcy friction factor f equal to?',
            options: ['16 / Re', '32 / Re', '64 / Re', '0.079 / Re^0.25'],
            correctIndex: 2,
            explanation: 'For laminar pipe flow, the Darcy friction factor is precisely f = 64 / Re (or Fanning friction factor f_F = 16 / Re).',
          },
        },
        {
          id: 'chem-3',
          title: 'Reaction Kinetics: CSTR vs PFR Performance & Space Time',
          desc: 'Design equations for ideal reactors, Damkohler number, selectivity in multiple reactions, and runaway mitigation.',
          difficulty: 'Medium',
          category: 'Chemical Reaction Engineering',
          iconName: 'os',
          keyConcept: 'For positive order kinetics, a Plug Flow Reactor (PFR) always requires less volume than a Continuous Stirred Tank Reactor (CSTR) for the same conversion.',
          deepDive: [
            'CSTR operates entirely at outlet composition (lowest reactant concentration, hence slowest rate of reaction).',
            'PFR concentration drops continuously from inlet to outlet, maintaining a higher average reaction rate throughout reactor volume.',
            'Space time tau = V / v0 represents the time required to process one reactor volume of feed.',
          ],
          interviewQuestions: [
            'Why does a PFR require smaller volume than a CSTR for a 1st order irreversible reaction?',
            'For parallel reactions where desired product has higher reaction order, which reactor configuration maximizes selectivity?',
            'What is thermal runaway in an exothermic batch reactor?',
          ],
          quiz: {
            question: 'For a first-order irreversible liquid reaction, which reactor requires the smallest volume for 90% conversion?',
            options: ['Single CSTR', 'Plug Flow Reactor (PFR)', 'Two equal CSTRs in parallel', 'Batch reactor with infinite mixing'],
            correctIndex: 1,
            explanation: 'PFR operates at higher reactant concentrations along its length, leading to higher reaction rates and smaller required volume.',
          },
        },
        {
          id: 'chem-4',
          title: 'Process Safety: HAZOP & Safety Relief Valve (PSV) Sizing',
          desc: 'Guide words (No, More, Less, As Well As), failure mode effects, emergency depressurization, and API 520 standards.',
          difficulty: 'Hard',
          category: 'Plant Safety & Operations',
          iconName: 'db',
          keyConcept: 'HAZOP (Hazard and Operability Study) systematically applies guide words to process parameters to identify deviations, causes, and safeguards.',
          deepDive: [
            'Node-by-node multidisciplinary review covering flow, temperature, pressure, level, and composition.',
            'PSV sizing scenarios include external pool fire, blocked liquid outlet, cooling water failure, and runaway reaction.',
            'Layers of Protection Analysis (LOPA) assigns safety integrity levels (SIL 1 to 4) to automated safety instrumented systems.',
          ],
          interviewQuestions: [
            'Walk me through a HAZOP analysis for a high-pressure gas separator vessel.',
            'What is the difference between a conventional safety relief valve and a balanced bellows valve?',
            'What is a rupture disk and when is it paired in series with a relief valve?',
          ],
          quiz: {
            question: 'Which HAZOP guide word combined with parameter FLOW indicates reverse fluid motion in a line?',
            options: ['NO FLOW', 'LESS FLOW', 'REVERSE FLOW', 'OTHER THAN FLOW'],
            correctIndex: 2,
            explanation: 'REVERSE indicates complete flow inversion opposite to the intended design direction.',
          },
        },
        {
          id: 'chem-5',
          title: 'Heat Transfer: Shell & Tube Exchanger Baffle Cuts & Fouling',
          desc: 'TEMA standards, tube layout pitch (triangular vs square), Kern\'s method, and pressure drop trade-offs.',
          difficulty: 'Medium',
          category: 'Heat Transfer Equipment',
          iconName: 'arch',
          keyConcept: 'Baffle cut (typically 20% to 25%) balances shell-side turbulence heat transfer coefficient against excessive pumping pressure drop.',
          deepDive: [
            'Triangular pitch (30 deg) provides higher turbulence and heat transfer coefficient for clean fluids.',
            'Square pitch (90 deg) is required when mechanical cleaning of the outside tube surfaces is necessary due to heavy fouling.',
            'Fouling resistance (Rf) increases over time, requiring over-surfacing (15-30% design margin) to ensure design duty is met before turnaround.',
          ],
          interviewQuestions: [
            'Which fluid should go into the tube side versus shell side in a refinery heat exchanger?',
            'How does a small baffle cut (<15%) impact pressure drop and stagnation zones?',
            'What is the difference between sensible heat exchange and reboiler phase-change heat transfer?',
          ],
          quiz: {
            question: 'In shell-and-tube heat exchanger design, where is a corrosive or high-pressure fluid typically routed?',
            options: ['Shell side', 'Tube side', 'Split equally between both', 'Outside the bundle jacket'],
            correctIndex: 1,
            explanation: 'Tube side is preferred for corrosive and high-pressure fluids because tubes are easier to alloy, inspect, and contain pressure safely than the large diameter shell.',
          },
        },
        {
          id: 'chem-6',
          title: 'Separation Engineering: Packed Columns vs Tray Columns',
          desc: 'HETP (Height Equivalent to Theoretical Plate), structured packings, pressure drop per theoretical stage, and flooding.',
          difficulty: 'Medium',
          category: 'Mass Transfer Technology',
          iconName: 'oop',
          keyConcept: 'Packed columns exhibit significantly lower pressure drop per theoretical stage, making them indispensable for vacuum distillation.',
          deepDive: [
            'HETP relates packed bed height to ideal equilibrium stages: Z = N_stages * HETP.',
            'Flooding occurs when upward vapor drag prevents downward liquid draining, causing liquid holdup and massive column pressure spike.',
            'Structured packing offers higher specific surface area (m2/m3) and capacity compared to random dumping rings.',
          ],
          interviewQuestions: [
            'When do you choose a packed column over a sieve tray column?',
            'Explain how liquid maldistribution impairs packed column separation efficiency.',
            'How is column operating velocity selected relative to the flooding velocity?',
          ],
          quiz: {
            question: 'What is the primary advantage of structured packing over traditional sieve trays in vacuum distillation?',
            options: ['Higher construction weight', 'Extremely low pressure drop per theoretical stage', 'Immunity to chemical corrosion', 'Zero requirement for liquid distributors'],
            correctIndex: 1,
            explanation: 'In vacuum distillation, low pressure drop per stage prevents high bottom temperatures that could thermally degrade heat-sensitive materials.',
          },
        },
      ];
    }

    if (b.includes('electronics') || b.includes('electrical') || b.includes('ece') || b.includes('eee')) {
      return [
        {
          id: 'ece-1',
          title: 'Embedded Systems: Volatile Keyword & Interrupt Service Routines (ISRs)',
          desc: 'Compiler register caching optimizations, shared global variables, hardware memory-mapped I/O, and race conditions.',
          difficulty: 'Medium',
          category: 'Embedded C & Firmware',
          iconName: 'os',
          keyConcept: 'The volatile keyword tells the compiler that a variable may change unexpectedly outside current program control, forcing a memory read on every access.',
          deepDive: [
            'Without volatile, optimizing compilers cache variables in CPU registers, failing to detect changes made by an asynchronous ISR or peripheral hardware.',
            'ISRs must be kept short and non-blocking: never call printf, malloc, or delay loops inside interrupt context.',
            'Atomic operations or disabling interrupts are required when reading/writing multi-byte shared variables to avoid torn reads.',
          ],
          interviewQuestions: [
            'Can a variable be both const and volatile simultaneously? Give a real hardware example.',
            'Why should you avoid dynamic memory allocation (malloc) inside an embedded ISR?',
            'What happens if an interrupt flag is not cleared before exiting the ISR?',
          ],
          quiz: {
            question: 'In Embedded C, why MUST a global variable shared between an ISR and main loop be declared volatile?',
            options: [
              'To allocate it in Flash memory',
              'To prevent the compiler from optimizing out repeated memory reads via register caching',
              'To make the variable thread-safe automatically',
              'To increase the clock frequency of the MCU',
            ],
            correctIndex: 1,
            explanation: 'Volatile prevents compiler register caching, ensuring the main loop always fetches the fresh value updated by the ISR from RAM.',
          },
        },
        {
          id: 'ece-2',
          title: 'Digital VLSI: Setup & Hold Time Violations and Metastability',
          desc: 'Flip-flop timing constraints, clock skew, data path delays, and multi-flop synchronizers for clock domain crossing (CDC).',
          difficulty: 'Hard',
          category: 'Digital VLSI Design',
          iconName: 'arch',
          keyConcept: 'Setup time requires data to remain stable BEFORE the active clock edge; hold time requires data to remain stable AFTER the active clock edge.',
          deepDive: [
            'Setup violation equation: T_clk >= T_cq + T_comb_max + T_setup - T_skew. Fix: Reduce clock frequency or optimize combinational logic.',
            'Hold violation equation: T_cq + T_comb_min >= T_hold + T_skew. Fix: Add buffer delay cells; cannot be fixed by lowering clock frequency.',
            'Metastability occurs when timing windows are violated, causing output to oscillate in an indeterminate state before settling.',
          ],
          interviewQuestions: [
            'Why can hold time violations NOT be solved by reducing the clock frequency?',
            'How does a dual-flip-flop synchronizer mitigate metastability in Clock Domain Crossing (CDC)?',
            'Explain the impact of positive versus negative clock skew on setup and hold margins.',
          ],
          quiz: {
            question: 'If a digital circuit exhibits a HOLD time violation, how can the design team resolve it?',
            options: [
              'Lower the system clock frequency',
              'Insert delay buffers along the fast data path',
              'Increase the supply voltage',
              'Reduce the flip-flop setup requirement',
            ],
            correctIndex: 1,
            explanation: 'Hold violations depend only on clock skew and minimum data path delay, not clock period; adding buffer delay solves the violation.',
          },
        },
        {
          id: 'ece-3',
          title: 'Analog Electronics: Op-Amp Virtual Ground & Feedback',
          desc: 'Infinite input impedance, zero output impedance, virtual short concept, and stability in closed-loop configurations.',
          difficulty: 'Easy',
          category: 'Analog Circuits',
          iconName: 'oop',
          keyConcept: 'Under negative feedback with infinite open-loop gain, an op-amp forces its inverting and non-inverting terminals to the same potential (Virtual Short).',
          deepDive: [
            'Virtual ground holds terminal at 0V without sinking current, because input bias current into ideal terminals is zero.',
            'Inverting amplifier gain: Av = -Rf / R1; Non-inverting amplifier gain: Av = 1 + (Rf / R1).',
            'Gain-Bandwidth Product (GBWP) is constant: trading closed-loop gain increases circuit bandwidth proportionally.',
          ],
          interviewQuestions: [
            'Does virtual short exist in open-loop comparator mode? Explain why or why not.',
            'What is Common Mode Rejection Ratio (CMRR) and why is high CMRR desirable in sensor instrumentation?',
            'Explain slew rate and its effect on high-frequency output waveforms.',
          ],
          quiz: {
            question: 'For an ideal op-amp configured as an inverting amplifier with R1 = 10k and Rf = 100k, what is the closed-loop voltage gain?',
            options: ['+10', '-10', '+11', '-100'],
            correctIndex: 1,
            explanation: 'Inverting amplifier gain Av = -Rf / R1 = -100k / 10k = -10.',
          },
        },
        {
          id: 'ece-4',
          title: 'Microcontrollers: DMA (Direct Memory Access) vs Interrupts',
          desc: 'Hardware bus mastering, circular buffer ADC transfers, UART DMA reception, and CPU offloading.',
          difficulty: 'Medium',
          category: 'Microcontroller Architecture',
          iconName: 'os',
          keyConcept: 'DMA transfers data blocks directly between peripherals and SRAM without CPU intervention, saving thousands of clock cycles.',
          deepDive: [
            'Polling consumes 100% CPU cycles checking status flags; Interrupts execute an ISR per byte, incurring register push/pop overhead.',
            'DMA uses hardware request/acknowledge handshakes to transfer words while CPU continues arithmetic execution.',
            'Common uses: ADC multi-channel sensor logging, high-speed SPI TFT displays, and UART streaming buffers.',
          ],
          interviewQuestions: [
            'What is bus contention and how does the bus arbiter manage CPU vs DMA access?',
            'Explain circular DMA mode for continuous sensor sampling.',
            'How do cache coherency issues arise when using DMA in high-performance ARM Cortex-A processors?',
          ],
          quiz: {
            question: 'What is the primary benefit of using DMA over interrupt-driven I/O for receiving a 1KB packet via high-speed SPI?',
            options: [
              'It encrypts the SPI packet in hardware',
              'It eliminates CPU context-switching overhead for every individual byte received',
              'It increases the SPI clock voltage',
              'It allows software to run with zero RAM',
            ],
            correctIndex: 1,
            explanation: 'DMA moves the entire buffer directly into SRAM autonomously without firing 1000 individual interrupt routines, freeing CPU compute power.',
          },
        },
        {
          id: 'ece-5',
          title: 'Power Electronics: Buck/Boost Converter Inductor Sizing',
          desc: 'Continuous Conduction Mode (CCM), inductor ripple current, duty cycle, and MOSFET switching losses.',
          difficulty: 'Medium',
          category: 'Power Electronics',
          iconName: 'network',
          keyConcept: 'In a synchronous Buck converter, output voltage Vout = D * Vin, where duty cycle D is regulated by PWM feedback.',
          deepDive: [
            'CCM inductor equation: L = (Vin - Vout) * D / (f_sw * Delta_I_L), where ripple current is typically 20-40% of rated output current.',
            'Capacitor ESR (Equivalent Series Resistance) dominates output voltage ripple.',
            'High switching frequency reduces inductor physical size, but increases MOSFET switching losses and EMI radiation.',
          ],
          interviewQuestions: [
            'What is the difference between Continuous Conduction Mode (CCM) and Discontinuous Conduction Mode (DCM)?',
            'How do you calculate MOSFET conduction loss versus switching loss?',
            'Why is a freewheeling diode or synchronous MOSFET essential when switching inductive loads?',
          ],
          quiz: {
            question: 'In an ideal Buck converter with input voltage 24V and output voltage 12V, what is the required duty cycle D?',
            options: ['25%', '50%', '75%', '100%'],
            correctIndex: 1,
            explanation: 'For a Buck converter in CCM, Vout = D * Vin => D = 12V / 24V = 0.50 or 50%.',
          },
        },
        {
          id: 'ece-6',
          title: 'Signals & DSP: Nyquist Sampling Theorem & Anti-Aliasing Filters',
          desc: 'Sampling frequency criteria, spectral folding, analog low-pass filtering, and FFT resolution.',
          difficulty: 'Easy',
          category: 'Signals & Communications',
          iconName: 'db',
          keyConcept: 'Sampling rate Fs must be at least twice the highest frequency component of the analog signal (Fs >= 2 * Fmax) to reconstruct without aliasing.',
          deepDive: [
            'Frequencies above Fs/2 fold back into the baseband spectrum as spurious phantom signals indistinguishable from real data.',
            'An analog anti-aliasing low-pass filter MUST precede the ADC sampler to attenuate frequencies above the Nyquist rate.',
            'Oversampling with digital decimation filtering allows simpler, lower-order analog anti-aliasing filters.',
          ],
          interviewQuestions: [
            'What happens if an audio signal with frequencies up to 20 kHz is sampled at 30 kHz without filtering?',
            'What is the difference between Discrete Fourier Transform (DFT) and Fast Fourier Transform (FFT)?',
            'Explain how an FIR filter differs from an IIR filter in terms of stability and phase linearity.',
          ],
          quiz: {
            question: 'To digitize human speech with content up to 4 kHz without aliasing, what is the MINIMUM Nyquist sampling frequency?',
            options: ['2 kHz', '4 kHz', '8 kHz', '16 kHz'],
            correctIndex: 2,
            explanation: 'Nyquist rate requires Fs >= 2 * Fmax = 2 * 4 kHz = 8 kHz (standard telecom voice sampling rate).',
          },
        },
      ];
    }

    if (b.includes('civil')) {
      return [
        {
          id: 'civ-1',
          title: 'Structural Analysis: Shear Force & Bending Moment Diagrams (SFD/BMD)',
          desc: 'Statics equilibrium, point loads, uniformly distributed loads (UDL), and point of contra-flexure.',
          difficulty: 'Easy',
          category: 'Structural Engineering',
          iconName: 'arch',
          keyConcept: 'The derivative of bending moment with respect to distance equals shear force (dM/dx = V); maximum bending moment occurs where shear force is zero.',
          deepDive: [
            'For a simply supported beam with UDL w: Max BMD = (w * L^2) / 8 at midspan.',
            'Point of contra-flexure is the location along the beam where the bending moment changes sign (sagging to hogging).',
            'Shear force diagram slope corresponds to the load intensity: dV/dx = -w.',
          ],
          interviewQuestions: [
            'Where does maximum bending moment occur in any beam under general loading?',
            'What is the significance of the point of contra-flexure in reinforced concrete beam detailing?',
            'Explain the difference between determinate and indeterminate structural frames.',
          ],
          quiz: {
            question: 'At which point along a beam does the maximum bending moment occur?',
            options: ['Where shear force is maximum', 'Where shear force is zero or changes sign', 'At the left roller support', 'At the point of minimum deflection'],
            correctIndex: 1,
            explanation: 'Since dM/dx = V, setting shear force V = 0 locates the mathematical extremum (maximum) of the bending moment.',
          },
        },
        {
          id: 'civ-2',
          title: 'Geotechnical: Mohr-Coulomb Failure Criterion & Bearing Capacity',
          desc: 'Cohesion, angle of internal friction, Terzaghi bearing capacity equation, and soil settlement.',
          difficulty: 'Medium',
          category: 'Geotechnical Engineering',
          iconName: 'network',
          keyConcept: 'Soil shear strength tau = c + sigma * tan(phi), where c is soil cohesion and phi is the internal friction angle.',
          deepDive: [
            'Terzaghi formula for strip footing: q_ult = c*Nc + gamma*D*Nq + 0.5*gamma*B*N_gamma.',
            'Safe bearing capacity equals ultimate capacity divided by a factor of safety (typically 2.5 to 3.0).',
            'Consolidation settlement occurs slowly in clay soils due to slow expulsion of pore water from microscopic voids.',
          ],
          interviewQuestions: [
            'How does water table elevation affect shallow foundation bearing capacity?',
            'What is the difference between compaction and consolidation in soils?',
            'Explain the Standard Penetration Test (SPT) N-value and its field corrections.',
          ],
          quiz: {
            question: 'For purely cohesionless dry sand (c = 0), what determines the ultimate shear strength?',
            options: ['Moisture index', 'Effective normal stress and internal friction angle phi', 'Specific gravity of quartz', 'Liquid limit'],
            correctIndex: 1,
            explanation: 'When cohesion c = 0, shear strength follows tau = sigma * tan(phi), governed entirely by confining normal stress and friction angle.',
          },
        },
        {
          id: 'civ-3',
          title: 'Concrete Tech: Water-Cement Ratio & Slump Cone Workability',
          desc: 'Abrams law, hydration kinetics, slump test classes (true, shear, collapse), and compressive cube strength.',
          difficulty: 'Easy',
          category: 'Materials & Construction',
          iconName: 'os',
          keyConcept: 'According to Abrams law, concrete compressive strength is inversely proportional to water-cement ratio, provided mix is fully compacted.',
          deepDive: [
            'Optimal w/c ratio typically ranges from 0.40 to 0.55 for structural M25 to M40 grades.',
            'Excess water produces capillary pores upon evaporation, severely reducing durability and compressive strength.',
            'Superplasticizers (polycarboxylate ethers) disperse cement flocculations, increasing workability slump without adding excess water.',
          ],
          interviewQuestions: [
            'What is the standard dimension of a concrete test cube in IS 456 versus ASTM cylinder?',
            'Explain the difference between bleeding and segregation in fresh concrete.',
            'What is the purpose of curing concrete and for how many days must it be maintained?',
          ],
          quiz: {
            question: 'What is the primary effect of increasing the water-cement ratio above 0.55 without changing cement content?',
            options: ['Increases compressive strength', 'Decreases strength and increases capillary permeability', 'Speeds up initial setting time', 'Prevents thermal shrinkage cracks'],
            correctIndex: 1,
            explanation: 'Excess water evaporates leaving porous voids, sharply reducing 28-day compressive strength and increasing permeability to moisture.',
          },
        },
        {
          id: 'civ-4',
          title: 'Transportation: Stopping Sight Distance (SSD) & Super-elevation',
          desc: 'Perception-reaction time (PIEV theory), centrifugal force equilibrium, friction factors, and IRC standards.',
          difficulty: 'Medium',
          category: 'Highway & Transportation',
          iconName: 'oop',
          keyConcept: 'Super-elevation e + f = v^2 / (127 * R) tilts the road pavement inward to counteract centrifugal force on horizontal curves.',
          deepDive: [
            'Stopping Sight Distance SSD = lag distance (v * t) + braking distance (v^2 / (254 * f)).',
            'PIEV theory allocates standard 2.5 seconds perception-reaction time for braking initiation.',
            'Maximum allowable super-elevation is capped at 7% for plain/rolling terrain and 10% for hilly snow-free roads.',
          ],
          interviewQuestions: [
            'Derive the formula for equilibrium super-elevation where lateral friction is zero.',
            'What is the purpose of a transition curve (Euler spiral) on highways?',
            'Explain the California Bearing Ratio (CBR) test for flexible pavement subgrade design.',
          ],
          quiz: {
            question: 'According to standard highway design (IRC), what standard perception-reaction time is assumed for SSD calculations?',
            options: ['0.5 seconds', '1.0 second', '2.5 seconds', '5.0 seconds'],
            correctIndex: 2,
            explanation: 'IRC standard assumes a 2.5-second PIEV (Perception, Intellection, Emotion, Volition) reaction time for braking.',
          },
        },
        {
          id: 'civ-5',
          title: 'Environmental: Activated Sludge Process & BOD Kinetics',
          desc: 'Biological Oxygen Demand, microbial growth phases, food-to-mass (F/M) ratio, and secondary clarifier sludge recycling.',
          difficulty: 'Medium',
          category: 'Environmental Engineering',
          iconName: 'db',
          keyConcept: 'BOD5 measures the oxygen consumed by aerobic microorganisms over 5 days at 20 deg C to decompose organic matter.',
          deepDive: [
            'Aeration tank provides oxygen and mixing for suspended microbial biomass (MLSS - Mixed Liquor Suspended Solids).',
            'F/M ratio controls settling velocity of biological flocs; high F/M leads to dispersed growth and turbid effluent.',
            'Sludge Volume Index (SVI) evaluates sludge settling characteristics; SVI between 50 and 150 mL/g indicates good settling.',
          ],
          interviewQuestions: [
            'What is the relationship between BOD, COD, and Total Organic Carbon (TOC)?',
            'What causes sludge bulking in secondary clarifiers and how is it corrected?',
            'Explain the disinfection kinetics of chlorination in municipal drinking water.',
          ],
          quiz: {
            question: 'Which parameter is typically higher for an industrial wastewater sample: BOD or COD?',
            options: ['BOD is always higher', 'COD is always higher or equal', 'Both are identical by definition', 'TOC is always lower than dissolved oxygen'],
            correctIndex: 1,
            explanation: 'Chemical Oxygen Demand (COD) oxidizes both biodegradable and non-biodegradable organic compounds with dichromate, so COD >= BOD.',
          },
        },
        {
          id: 'civ-6',
          title: 'Project Management: Critical Path Method (CPM) & Float',
          desc: 'Forward and backward passes, earliest/latest start times, total float, free float, and crashing schedules.',
          difficulty: 'Hard',
          category: 'Construction Management',
          iconName: 'arch',
          keyConcept: 'The Critical Path is the longest sequence of dependent activities through a network; any delay on the critical path directly delays project completion.',
          deepDive: [
            'Total Float = Late Start - Early Start = Late Finish - Early Finish; Critical activities have Zero Total Float.',
            'Free Float is the delay possible without delaying the early start of any immediate successor activity.',
            'Project crashing compresses duration by allocating extra resources to critical path tasks with the lowest cost slope.',
          ],
          interviewQuestions: [
            'How do you identify the critical path in an activity-on-node (AON) network?',
            'What is the difference between deterministic CPM and probabilistic PERT?',
            'Explain how cost slope determines which activity to crash first.',
          ],
          quiz: {
            question: 'What is the total float of activities that lie on the critical path of a project network?',
            options: ['Infinite', 'Zero', 'Equal to project duration', 'Equal to free float plus independent float'],
            correctIndex: 1,
            explanation: 'Critical path activities cannot be delayed without delaying the entire project, so their Total Float is strictly zero.',
          },
        },
      ];
    }

    // Default: Computer Science & IT concepts
    return [
      {
        id: 'tech-1',
        title: 'OS: Process vs Thread & Context Switching',
        desc: 'Memory models, PCB vs TCB, kernel vs user space, and context switching overhead.',
        difficulty: 'Easy',
        category: 'Operating Systems',
        iconName: 'os',
        keyConcept: 'A thread shares heap, data, and code segments with the parent process, but keeps its own stack, registers, and program counter.',
        deepDive: [
          'Process Control Block (PCB) contains memory registers, open file descriptors, and page table pointers.',
          'Threads within the same process share virtual address space, eliminating expensive TLB flushes during context switches.',
          'Multithreading improves CPU throughput for I/O-bound tasks, but introduces race conditions requiring synchronization.',
        ],
        interviewQuestions: [
          'Why is a thread switch faster than a process switch?',
          'What components are private to a thread and what are shared?',
          'What causes thrashing in an operating system?',
        ],
        quiz: {
          question: 'Which resource is NOT shared between threads belonging to the same process?',
          options: ['Heap memory', 'Global variables', 'Program Counter & Call Stack', 'Open file descriptors'],
          correctIndex: 2,
          explanation: 'Each thread must independently track its own execution point (Program Counter) and local function call frames (Stack), while sharing heap and global data.',
        },
      },
      {
        id: 'tech-2',
        title: 'DBMS: Normalization (1NF to BCNF) & Indexing',
        desc: 'Eliminate update anomalies and optimize read latency using B-Tree and B+ Tree indexes.',
        difficulty: 'Medium',
        category: 'Databases',
        iconName: 'db',
        keyConcept: '2NF eliminates partial dependencies on composite keys; 3NF eliminates transitive dependencies. B+ Trees keep data only in leaf nodes for efficient sequential range scans.',
        deepDive: [
          '1NF requires atomic values (no repeating groups or arrays in a column).',
          '2NF requires 1NF + every non-prime attribute is fully functionally dependent on the entire primary key.',
          '3NF requires 2NF + no transitive dependency (non-prime attribute determining another non-prime attribute).',
          'B+ Trees store all actual record pointers at the leaf level linked sequentially, making range queries O(log N + K).',
        ],
        interviewQuestions: [
          'What is the difference between B-Trees and B+ Trees in database indexing?',
          'When is deliberate denormalization preferred in production microservices?',
          'What is a clustered index vs non-clustered index in SQL?',
        ],
        quiz: {
          question: 'In database normalization, removing a transitive dependency (where X -> Y and Y -> Z) elevates a table to which normal form?',
          options: ['First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'Boyce-Codd Normal Form (BCNF)'],
          correctIndex: 2,
          explanation: 'Third Normal Form (3NF) strictly prohibits transitive functional dependencies between non-key attributes.',
        },
      },
      {
        id: 'tech-3',
        title: 'Networks: TCP 3-Way Handshake & Window Flow Control',
        desc: 'Connection establishment via SYN, SYN-ACK, ACK, plus congestion control and sliding windows.',
        difficulty: 'Medium',
        category: 'Computer Networks',
        iconName: 'network',
        keyConcept: 'TCP establishes reliable, ordered, bi-directional streams using sequence numbers, ACKs, and sliding windows to prevent buffer overflow at the receiver.',
        deepDive: [
          'Step 1: Client sends SYN (Synchronize sequence number X).',
          'Step 2: Server responds with SYN-ACK (Server sequence Y, ACK = X + 1).',
          'Step 3: Client sends ACK (Sequence X + 1, ACK = Y + 1). Connection is established.',
          'Sliding window allows the sender to transmit multiple segments before waiting for an ACK, bounded by the receiver advertised window (rwnd) and congestion window (cwnd).',
        ],
        interviewQuestions: [
          'Why does TCP require 3 packets for handshake instead of 2?',
          'How does TCP deal with out-of-order and dropped packets?',
          'Compare TCP and UDP in terms of header size, reliability, and use cases.',
        ],
        quiz: {
          question: 'What is the primary purpose of the sequence number in the TCP header?',
          options: [
            'To identify the destination port',
            'To reconstruct out-of-order packets and detect dropped segments',
            'To encrypt the payload',
            'To verify IP routing tables',
          ],
          correctIndex: 1,
          explanation: 'Sequence numbers allow the receiver to reassemble transmitted bytes in the exact correct order and identify missing segments for retransmission.',
        },
      },
      {
        id: 'tech-4',
        title: 'OOP: Polymorphism, Virtual Functions & Diamond Problem',
        desc: 'Static vs dynamic dispatch, vtables in C++, interfaces in Java, and multiple inheritance resolution.',
        difficulty: 'Easy',
        category: 'Object-Oriented Design',
        iconName: 'oop',
        keyConcept: 'Dynamic polymorphism uses virtual method tables (vtables) to resolve function calls at runtime based on the actual object type rather than the pointer type.',
        deepDive: [
          'Compile-time polymorphism: Method overloading and operator overloading (resolved during compilation).',
          'Runtime polymorphism: Method overriding using virtual functions and pointers.',
          'The Diamond Problem occurs in multiple inheritance when a class inherits from two classes that share a common base; resolved via virtual inheritance in C++ or default interface rules in Java.',
        ],
        interviewQuestions: [
          'How does a vtable (virtual table) work under the hood in C++?',
          'What is the difference between an abstract class and an interface?',
          'Can a constructor or destructor be virtual?',
        ],
        quiz: {
          question: 'Why should a base class with virtual functions always declare a virtual destructor?',
          options: [
            'To speed up object allocation',
            'To ensure derived class destructors are called when deleting via a base class pointer, preventing memory leaks',
            'To allow private inheritance',
            'Constructors require it by language specification',
          ],
          correctIndex: 1,
          explanation: 'If a base class destructor is non-virtual, deleting a derived object through a base pointer results in undefined behavior and skips the derived class destructor.',
        },
      },
      {
        id: 'tech-5',
        title: 'Architecture: In-Memory Caching & Eviction Policies (LRU/LFU)',
        desc: 'Design Redis-like caches using hash maps with doubly linked lists for O(1) get and put operations.',
        difficulty: 'Hard',
        category: 'System Design',
        iconName: 'arch',
        keyConcept: 'An LRU (Least Recently Used) cache pairs a Hash Map for O(1) key lookup with a Doubly Linked List for O(1) node detachment and head insertion.',
        deepDive: [
          'Hash Map stores Key -> Node Pointer for instant O(1) lookups.',
          'Doubly Linked List keeps nodes ordered by recency: Head = Most Recently Used, Tail = Least Recently Used.',
          'On GET: Look up in hash map, splice node out of its current position, insert at head, return value.',
          'On PUT: If key exists, update value and move to head. If new and at capacity, remove tail node and evict from hash map, then insert new node at head.',
        ],
        interviewQuestions: [
          'How does Redis persist data to disk (RDB snapshots vs AOF append-only files)?',
          'What are cache stampede, cache penetration, and cache breakdown, and how do you mitigate them?',
          'When would you choose LFU (Least Frequently Used) over LRU?',
        ],
        quiz: {
          question: 'What is the optimal data structure combination to implement an LRU cache with O(1) GET and O(1) PUT?',
          options: [
            'Binary Search Tree + Array',
            'Hash Map + Doubly Linked List',
            'Min-Heap + Queue',
            'Stack + Singly Linked List',
          ],
          correctIndex: 1,
          explanation: 'Hash Map gives O(1) pointer access, while a Doubly Linked List allows removing and prepending any node in O(1) time without shifting elements.',
        },
      },
      {
        id: 'tech-6',
        title: 'OS: Deadlocks & The 4 Coffman Conditions',
        desc: 'Mutual exclusion, hold and wait, no preemption, circular wait, and banker\'s algorithm avoidance.',
        difficulty: 'Medium',
        category: 'Operating Systems',
        iconName: 'os',
        keyConcept: 'A deadlock occurs when a set of processes are blocked because each process holds a resource and waits for another resource held by another process. Breaking any ONE Coffman condition prevents deadlocks.',
        deepDive: [
          '1. Mutual Exclusion: At least one resource must be non-shareable.',
          '2. Hold and Wait: A process holds at least one resource and is waiting to acquire additional resources held by others.',
          '3. No Preemption: Resources cannot be forcibly taken from a process until it completes its task.',
          '4. Circular Wait: A closed loop of processes exists where each process waits for a resource held by the next.',
          'Prevention strategy: Impose strict global resource ordering to eliminate circular wait.',
        ],
        interviewQuestions: [
          'State the four Coffman conditions necessary for deadlock to occur.',
          'How does the Banker\'s Algorithm determine if a state is safe?',
          'What is the difference between Deadlock and Starvation?',
        ],
        quiz: {
          question: 'Which deadlock prevention technique directly eliminates the Circular Wait condition?',
          options: [
            'Preempting resources from lower-priority tasks',
            'Imposing a strict global numerical ordering on all resources and acquiring them in ascending order only',
            'Disabling multithreading on the CPU',
            'Allocating all memory upfront at startup',
          ],
          correctIndex: 1,
          explanation: 'By numbering all resources and requiring processes to request resources in strictly ascending order, a circular cycle of waiting can never form.',
        },
      },
    ];
  };

  const technicalTopics = getTechnicalTopicsForBranch(profile?.branch);

  // Categories config
  const categories = [
    {
      id: 'quiz' as const,
      title: 'Database Randomized Quiz',
      desc: 'Timed multi-choice quizzes randomly sampled from our 3,500+ question bank with server-side scoring and explanations.',
      icon: Target,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50',
      actionText: 'Launch Randomized Quiz',
      badge: '3,500+ Bank',
    },
    {
      id: 'aptitude' as const,
      title: 'Aptitude Practice',
      desc: 'Quantitative aptitude, speed arithmetic, logical deduction, and verbal drills.',
      icon: Calculator,
      color: 'text-indigo-600 dark:text-cyan-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/50',
      actionText: 'Practise 24 Aptitude Drills',
      badge: 'Timed MCQs',
    },
    {
      id: 'coding' as const,
      title: 'Coding Workspace',
      desc: 'Data structures, algorithms, test cases, and multi-language coding editor.',
      icon: Code2,
      color: 'text-indigo-600 dark:text-cyan-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/50',
      actionText: 'Solve 10 DSA Challenges',
      badge: 'Interactive IDE',
    },
    {
      id: 'technical' as const,
      title: 'Technical Concepts',
      desc: profile.branch?.toLowerCase().includes('mechanical')
        ? 'Thermodynamics, Strength of Materials, GD&T, and Fluid Machinery with interactive quizzes.'
        : profile.branch?.toLowerCase().includes('chemical')
        ? 'Mass Transfer, McCabe-Thiele, Reaction Kinetics, and HAZOP with interactive quizzes.'
        : profile.branch?.toLowerCase().includes('civil')
        ? 'Structural Mechanics, Concrete Tech, Geotechnical, and Transportation with interactive quizzes.'
        : (profile.branch?.toLowerCase().includes('ece') || profile.branch?.toLowerCase().includes('eee') || profile.branch?.toLowerCase().includes('electronics') || profile.branch?.toLowerCase().includes('electrical'))
        ? 'Embedded C, VLSI Timing, Op-Amps, and Microcontrollers with interactive quizzes.'
        : 'Operating Systems, DBMS, Computer Networks, and OOP with interactive mini-quizzes.',
      icon: BookOpen,
      color: 'text-indigo-600 dark:text-cyan-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/50',
      actionText: 'Explore Concepts & Quizzes',
      badge: profile.branch?.toLowerCase().includes('mechanical')
        ? 'Core Mechanical'
        : profile.branch?.toLowerCase().includes('chemical')
        ? 'Core Chemical'
        : profile.branch?.toLowerCase().includes('civil')
        ? 'Core Civil'
        : (profile.branch?.toLowerCase().includes('ece') || profile.branch?.toLowerCase().includes('eee') || profile.branch?.toLowerCase().includes('electronics') || profile.branch?.toLowerCase().includes('electrical'))
        ? 'Core Electronics & Power'
        : 'Core CS Subjects',
    },
    {
      id: 'communication' as const,
      title: 'Communication & HR',
      desc: 'STAR method answers, behavioral scenarios, and verbal articulation templates.',
      icon: MessageCircle,
      color: 'text-indigo-600 dark:text-cyan-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/50',
      actionText: 'Master Behavioral Drills',
      badge: 'STAR Method',
    },
    {
      id: 'skills' as const,
      title: 'Skill Analysis',
      desc: 'See verified strengths and priority gaps benchmarked against your target role.',
      icon: Target,
      color: 'text-indigo-600 dark:text-cyan-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/50',
      actionText: 'View Competency Matrix',
      badge: 'Evidence Matrix',
    },
    {
      id: 'roadmap' as const,
      title: 'Learning Roadmap',
      desc: 'Structured 5-phase preparation path from foundation to campus drive clearance.',
      icon: Map,
      color: 'text-indigo-600 dark:text-cyan-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/50',
      actionText: 'Open Full Roadmap',
      badge: '5 Phases',
    },
  ];

  // Communication drills with STAR method breakdowns
  const communicationDrills = [
    {
      id: 'comm-1',
      prompt: 'Tell me about a time you had a technical disagreement with a teammate. How did you resolve it?',
      framework: 'STAR Method',
      difficulty: 'Easy',
      tip: 'Focus 20% on the disagreement, 60% on your collaborative listening and benchmark testing, and 20% on the positive outcome.',
      starExample: {
        situation: 'During our third-year capstone project, my teammate wanted to use MongoDB while I advocated for PostgreSQL.',
        task: 'We needed a reliable data store for user profiles and financial ledger transactions with strict ACID guarantees.',
        action: 'Instead of arguing, I created a benchmarking prototype measuring transaction consistency and complex joins, then scheduled a 30-minute review where we weighed trade-offs together.',
        result: 'We agreed on PostgreSQL for the relational financial core and Redis for caching. Our system processed 10,000 mock transactions with zero consistency errors and received top marks.',
      },
    },
    {
      id: 'comm-2',
      prompt: 'Explain your most technically challenging project to a non-technical interviewer.',
      framework: 'Analogy & Simplicity',
      difficulty: 'Medium',
      tip: 'Avoid internal jargon; use everyday analogies (like comparing a message queue to a restaurant order ticket system).',
      starExample: {
        situation: 'I developed an asynchronous distributed image processing service.',
        task: 'My goal was to explain why background workers and queues prevent website slowdowns.',
        action: 'I compared it to a busy pizza restaurant: instead of the front cashier cooking each pizza before taking the next order, the cashier hands the ticket to the kitchen and gives the customer a buzzer.',
        result: 'The non-technical interviewer immediately grasped how decoupling the API from the worker improved responsiveness by 85%.',
      },
    },
    {
      id: 'comm-3',
      prompt: 'Why are you specifically interested in this engineering role and how do you plan to grow in the first 6 months?',
      framework: 'Role Alignment',
      difficulty: 'Hard',
      tip: 'Mention specific tech stack curiosity, team engineering practices, and tangible 30-60-90 day learning milestones.',
      starExample: {
        situation: 'Preparing for a campus recruitment final round at an enterprise software firm.',
        task: 'Demonstrate intrinsic curiosity, mentorship readiness, and a growth mindset.',
        action: 'In the first 30 days: master the codebase and deployment workflows; in 60 days: independently ship small PRs and bug fixes; in 90 days: contribute to a core feature sprint.',
        result: 'Interviewers consistently commend structured 30-60-90 day readiness over generic "I want to learn everything" answers.',
      },
    },
  ];

  // 0. DETAIL VIEW: Database Quiz Runner
  if (activeCategory === 'quiz') {
    return (
      <div className="space-y-4">
        <button
          onClick={handleBackToGrid}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#202431] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Practice Categories</span>
        </button>
        <DynamicQuizRunner initialSubject={quizSubject} initialDifficulty={quizDifficulty} onClose={handleBackToGrid} />
      </div>
    );
  }

  // 1. DETAIL VIEW: Aptitude
  if (activeCategory === 'aptitude') {
    return (
      <div className="space-y-4">
        <button
          onClick={handleBackToGrid}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#202431] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Practice Categories</span>
        </button>
        <AptitudePracticeView />
      </div>
    );
  }

  // 2. DETAIL VIEW: Coding
  if (activeCategory === 'coding') {
    return (
      <div className="space-y-4">
        <button
          onClick={handleBackToGrid}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#202431] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Practice Categories</span>
        </button>
        <CodingPracticeView />
      </div>
    );
  }

  // 3. DETAIL VIEW: Skill Analysis
  if (activeCategory === 'skills') {
    return (
      <div className="space-y-4">
        <button
          onClick={handleBackToGrid}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#202431] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Practice Categories</span>
        </button>
        <SkillAnalysisView />
      </div>
    );
  }

  // 4. DETAIL VIEW: Roadmap
  if (activeCategory === 'roadmap') {
    return (
      <div className="space-y-4">
        <button
          onClick={handleBackToGrid}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#202431] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Practice Categories</span>
        </button>
        <RoadmapView />
      </div>
    );
  }

  // 5. DETAIL VIEW: Technical Concepts
  if (activeCategory === 'technical') {
    const filteredTopics =
      techDifficulty === 'All'
        ? technicalTopics
        : technicalTopics.filter((t) => t.difficulty === techDifficulty);

    return (
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        {/* Navigation & Difficulty Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={handleBackToGrid}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#4F46E5] dark:hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Practice Hub</span>
          </button>

          {/* Difficulty selector tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#141824] border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setTechDifficulty(diff)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  techDifficulty === diff
                    ? 'bg-[#4F46E5] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Section Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950/60 dark:text-cyan-400 border border-indigo-200 dark:border-indigo-800/60 mb-2">
            <BookOpen className="w-3.5 h-3.5 text-cyan-500" />
            <span>
              {profile.branch?.toLowerCase().includes('mechanical')
                ? 'Campus Recruitment: Core Mechanical Engineering'
                : profile.branch?.toLowerCase().includes('chemical')
                ? 'Campus Recruitment: Core Chemical Engineering'
                : profile.branch?.toLowerCase().includes('civil')
                ? 'Campus Recruitment: Core Civil Engineering'
                : (profile.branch?.toLowerCase().includes('ece') || profile.branch?.toLowerCase().includes('eee') || profile.branch?.toLowerCase().includes('electronics') || profile.branch?.toLowerCase().includes('electrical'))
                ? 'Campus Recruitment: Core Electronics & Hardware'
                : 'Campus Recruitment: Core Computer Science & IT'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202334] dark:text-white tracking-tight">
            Technical Concepts & Comprehension Quizzes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Click any concept card to explore its architectural breakdown, review real campus interview questions, and test yourself with an instant comprehension quiz.
          </p>
        </div>

        {/* Topic Grid - Fully Clickable Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => {
                setSelectedTopic(topic);
                setSelectedQuizAnswer(null);
                setQuizSubmitted(false);
              }}
              className="card-cinematic p-6 rounded-2xl flex flex-col justify-between cursor-pointer group hover:border-[#4F46E5] dark:hover:border-cyan-400 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950/60 dark:text-cyan-400 border border-indigo-200/60 dark:border-indigo-800/40">
                    {topic.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      topic.difficulty === 'Easy'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : topic.difficulty === 'Medium'
                        ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                    }`}
                  >
                    {topic.difficulty}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#202334] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-cyan-400 transition-colors">
                  {topic.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                  {topic.desc}
                </p>

                <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-[#0D1017] border border-slate-200/70 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-[#4F46E5] dark:text-cyan-400 block mb-0.5">
                    Recruiter Key Takeaway:
                  </span>
                  {topic.keyConcept}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-[#4F46E5] dark:text-cyan-400">
                <span className="flex items-center gap-1">
                  <span>Deep Dive & Interactive Quiz</span>
                </span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* INTERACTIVE TOPIC STUDY & QUIZ MODAL */}
        {selectedTopic && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
            <div className="card-cinematic max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 custom-scrollbar">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950/60 dark:text-cyan-400">
                      {selectedTopic.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{selectedTopic.difficulty}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#202334] dark:text-white">
                    {selectedTopic.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#151821] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Deep Dive Breakdown */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Architectural Breakdown & Core Theory
                </h3>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0D1017] border border-slate-200/80 dark:border-slate-800 space-y-2">
                  {selectedTopic.deepDive.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] dark:bg-cyan-400 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Frequent Interview Questions */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Campus Interview Questions on This Concept
                </h3>
                <div className="space-y-1.5">
                  {selectedTopic.interviewQuestions.map((q, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-start gap-2"
                    >
                      <HelpCircle className="w-4 h-4 text-[#4F46E5] dark:text-cyan-400 shrink-0 mt-0.5" />
                      <span>"{q}"</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Comprehension Quiz */}
              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#202334] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-500" />
                    <span>Quick Comprehension Check</span>
                  </h3>
                  {quizSubmitted && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        selectedQuizAnswer === selectedTopic.quiz.correctIndex
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                      }`}
                    >
                      {selectedQuizAnswer === selectedTopic.quiz.correctIndex ? 'Correct! +10 XP' : 'Incorrect'}
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {selectedTopic.quiz.question}
                </p>

                <div className="space-y-2">
                  {selectedTopic.quiz.options.map((opt, i) => {
                    const isSelected = selectedQuizAnswer === i;
                    const isCorrect = i === selectedTopic.quiz.correctIndex;
                    let style = 'bg-slate-50 dark:bg-[#121622] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300';

                    if (quizSubmitted) {
                      if (isCorrect) {
                        style = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold';
                      } else if (isSelected && !isCorrect) {
                        style = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-300';
                      }
                    } else if (isSelected) {
                      style = 'bg-indigo-50 dark:bg-indigo-950/50 border-[#4F46E5] text-[#4F46E5] dark:text-cyan-400 font-bold';
                    }

                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          if (!quizSubmitted) setSelectedQuizAnswer(i);
                        }}
                        disabled={quizSubmitted}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${style}`}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-500 shrink-0" />}
                        {quizSubmitted && isSelected && !isCorrect && <X className="w-4 h-4 text-rose-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {quizSubmitted && (
                  <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-[#0C0E14] border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed animate-in fade-in">
                    <span className="font-bold text-[#4F46E5] dark:text-cyan-400 block mb-0.5">Explanation:</span>
                    {selectedTopic.quiz.explanation}
                  </div>
                )}

                {/* Quiz Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <div className="flex items-center gap-2">
                    {!quizSubmitted ? (
                      <button
                        type="button"
                        disabled={selectedQuizAnswer === null}
                        onClick={() => setQuizSubmitted(true)}
                        className="btn-cinematic px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-40"
                      >
                        Check Answer
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setQuizSubmitted(false);
                          setSelectedQuizAnswer(null);
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151821] border border-slate-200 dark:border-slate-800 cursor-pointer"
                      >
                        Retry Question
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        const subj = selectedTopic.category || selectedTopic.title;
                        setSelectedTopic(null);
                        setQuizSubject(subj);
                        setQuizDifficulty(selectedTopic.difficulty);
                        setActiveCategory('quiz');
                      }}
                      className="btn-cinematic-secondary flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                      title="Launch randomized quiz from MongoDB"
                    >
                      <Target className="w-3.5 h-3.5 text-[#4F46E5] dark:text-cyan-400" />
                      <span>Take 10-Question Quiz</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTopic(null);
                      setCurrentPage('interview');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#4F46E5] dark:text-cyan-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
                  >
                    <span>Practice Aloud in Mock Interview</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 6. DETAIL VIEW: Communication
  if (activeCategory === 'communication') {
    const filteredDrills =
      commDifficulty === 'All'
        ? communicationDrills
        : communicationDrills.filter((d) => d.difficulty === commDifficulty);

    return (
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={handleBackToGrid}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#4F46E5] dark:hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Practice Hub</span>
          </button>

          {/* Difficulty selector tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#141824] border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setCommDifficulty(diff)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  commDifficulty === diff
                    ? 'bg-[#4F46E5] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/60 mb-2">
            <MessageCircle className="w-3.5 h-3.5 text-cyan-500" />
            <span>Behavioral & HR Interview Mastery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202334] dark:text-white tracking-tight">
            Communication & STAR Method Drills
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Click any question to view its full STAR structure (Situation, Task, Action, Result) with recruiter evaluation criteria.
          </p>
        </div>

        <div className="space-y-4">
          {filteredDrills.map((drill) => {
            const isExpanded = expandedCommId === drill.id;
            return (
              <div
                key={drill.id}
                className="card-cinematic p-6 rounded-2xl space-y-4 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-200/60 dark:border-cyan-800/40">
                    {drill.framework}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{drill.difficulty}</span>
                </div>

                <h3 className="text-base font-bold text-[#202334] dark:text-white leading-relaxed">
                  "{drill.prompt}"
                </h3>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0D1017] border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-[#4F46E5] dark:text-cyan-400 block mb-0.5">
                    How to Structure Your Answer:
                  </span>
                  {drill.tip}
                </div>

                {/* Collapsible STAR Example */}
                {isExpanded && (
                  <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-[#121622] border border-indigo-100 dark:border-indigo-900/40 space-y-2 text-xs animate-in fade-in">
                    <p className="font-bold text-[#4F46E5] dark:text-cyan-400 mb-1">
                      Model STAR Answer Walkthrough:
                    </p>
                    <p>
                      <strong className="text-slate-900 dark:text-white">Situation:</strong>{' '}
                      <span className="text-slate-600 dark:text-slate-300">{drill.starExample.situation}</span>
                    </p>
                    <p>
                      <strong className="text-slate-900 dark:text-white">Task:</strong>{' '}
                      <span className="text-slate-600 dark:text-slate-300">{drill.starExample.task}</span>
                    </p>
                    <p>
                      <strong className="text-slate-900 dark:text-white">Action:</strong>{' '}
                      <span className="text-slate-600 dark:text-slate-300">{drill.starExample.action}</span>
                    </p>
                    <p>
                      <strong className="text-slate-900 dark:text-white">Result:</strong>{' '}
                      <span className="text-slate-600 dark:text-slate-300">{drill.starExample.result}</span>
                    </p>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setExpandedCommId(isExpanded ? null : drill.id)}
                    className="text-xs font-bold text-[#4F46E5] dark:text-cyan-400 hover:underline cursor-pointer"
                  >
                    {isExpanded ? 'Hide Model Answer ▲' : 'View Model Answer ▼'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentPage('interview')}
                    className="btn-cinematic px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Practice in Interview Room</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 7. DEFAULT: Simple Icon-Based Category Grid
  return (
    <CinematicBackground variant="dashboard" className="space-y-6 max-w-5xl mx-auto pb-12 transition-colors">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950/60 dark:text-cyan-400 border border-indigo-200/80 dark:border-indigo-800/60 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
          <span>Interactive Preparation Modules</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
          Practice Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
          Select a category to start focused practice sessions tailored to campus recruitment tests.
        </p>
      </div>

      {/* Grid of 6 Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="card-cinematic p-6 rounded-2xl flex flex-col justify-between cursor-pointer group hover:border-[#4F46E5] dark:hover:border-cyan-400 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${cat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${cat.color}`} />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#141824] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                    {cat.badge}
                  </span>
                </div>

                <h2 className="text-base font-bold text-[#111827] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-cyan-400 transition-colors">
                  {cat.title}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-[#4F46E5] dark:text-cyan-400">
                <span>{cat.actionText}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </CinematicBackground>
  );
};
