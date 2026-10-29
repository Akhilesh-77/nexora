import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  CheckCircle2,
  XCircle,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Trophy,
  RotateCcw,
  Clock,
  Award,
  AlertCircle,
  Play,
  Check,
  HelpCircle,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PlacementRound } from '../types';

interface SimulatorQuestion {
  question: string;
  options: string[];
  correctIdx: number;
  tip: string;
}

interface RoundReviewData {
  round: PlacementRound;
  questions: SimulatorQuestion[];
  userAnswers: Record<number, number>;
  score: number;
  passed: boolean;
  correctCount: number;
}

export const PlacementSimulatorView: React.FC = () => {
  const {
    profile,
    placementSimulation,
    updatePlacementRound,
    restartPlacementSimulation,
    setCurrentPage,
  } = useApp();

  const [activeRoundModal, setActiveRoundModal] = useState<PlacementRound | null>(null);
  const [currentRoundQuestionIdx, setCurrentRoundQuestionIdx] = useState<number>(0);
  const [roundAnswers, setRoundAnswers] = useState<Record<number, number>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(15 * 60);
  const [reviewData, setReviewData] = useState<RoundReviewData | null>(null);

  const isMechanical = profile.branch?.includes('Mechanical') && !profile.targetRole?.includes('Cross-Domain');
  const isChemical = profile.branch?.includes('Chemical') && !profile.targetRole?.includes('Cross-Domain');
  const isElectronics = (profile.branch?.includes('Electronics') || profile.branch?.includes('Electrical')) && !profile.targetRole?.includes('Cross-Domain');

  // 10 Distinct Questions per configured Round
  const ROUND_CHALLENGES: Record<number, SimulatorQuestion[]> = {
    // -------------------------------------------------------------------------
    // ROUND 1: Aptitude & Logical Reasoning (10 distinct questions)
    // -------------------------------------------------------------------------
    1: [
      {
        question: 'Q1: A train 180 meters long running at 72 km/h crosses a platform in 20 seconds. What is the length of the platform?',
        options: ['220 meters', '240 meters', '200 meters', '260 meters'],
        correctIdx: 0,
        tip: '72 km/h = 20 m/s. Total distance in 20s = 400m. Platform length = 400 - 180 = 220m.',
      },
      {
        question: 'Q2: A and B can complete a work in 12 days and 18 days respectively. If they work on alternate days starting with A, in how many days will the work finish?',
        options: ['14.33 days', '15 days', '14.5 days', '16 days'],
        correctIdx: 0,
        tip: 'In 2 days, they complete (1/12 + 1/18) = 5/36. In 14 days, 35/36 is finished. The remaining 1/36 takes A (1/36)/(1/12) = 1/3 day. Total = 14 + 1/3 = 14.33 days.',
      },
      {
        question: 'Q3: Pointing to a photograph of a boy, Suresh said, "He is the only son of my mother." How is Suresh related to that boy?',
        options: ['Father', 'Brother', 'Uncle', 'Self'],
        correctIdx: 0,
        tip: 'The only son of Suresh’s mother is Suresh himself. So the boy in the photo is his son.',
      },
      {
        question: 'Q4: If in a certain code language "CAMPUS" is written as "EDORTW", how is "DRIVE" written in that same code?',
        options: ['FTKXE', 'FSKWE', 'ETKWF', 'FTLXG'],
        correctIdx: 0,
        tip: 'Letter progression pattern: +2, +3, +2, +3, +2 across successive characters.',
      },
      {
        question: 'Q5: A sum invested at compound interest doubles itself in 4 years. In how many years will it become 8 times of itself at the same annual interest rate?',
        options: ['12 years', '8 years', '16 years', '24 years'],
        correctIdx: 0,
        tip: 'Principal doubles in 4 years (2^1 in 4y). It becomes 8 times (2^3) in 4 * 3 = 12 years.',
      },
      {
        question: 'Q6: A box contains 5 red, 4 blue, and 3 green marbles. If 2 marbles are drawn at random without replacement, what is the probability that both are red?',
        options: ['5/33', '10/33', '25/144', '5/66'],
        correctIdx: 0,
        tip: 'Total marbles = 12. P(both red) = (5/12) * (4/11) = 20/132 = 5/33.',
      },
      {
        question: 'Q7: Pipe A can fill a tank in 6 hours and Pipe B in 8 hours. Pipe C can empty the full tank in 12 hours. If all three pipes are opened together, how long will it take to fill the tank?',
        options: ['4.8 hours (4 hours 48 mins)', '5.2 hours', '4.0 hours', '6.0 hours'],
        correctIdx: 0,
        tip: 'Net rate = 1/6 + 1/8 - 1/12 = (4 + 3 - 2)/24 = 5/24 tanks per hour. Time = 24/5 = 4.8 hours = 4 hrs 48 mins.',
      },
      {
        question: 'Q8: Find the missing number in the sequence: 4, 18, 48, 100, 180, ?',
        options: ['294', '264', '312', '240'],
        correctIdx: 0,
        tip: 'Pattern is n^3 + n^2 for n=1..5: 1+1=2, 8+4=12... Or n^2 * (n+1): 1*2=2? Here: n^2*(n+1) for n=1: 1*(2)=2? Actually: 1*(4)? Notice: 2*2^2=8? Formula is n^2 * (n+1): for n=1: 1*2=2? Better: 1^2*4=4, 2^2*4.5? Differences: 18-4=14, 48-18=30, 100-48=52, 180-100=80. Second differences: 16, 22, 28 (increasing by 6). Next second diff = 34. Next diff = 80 + 34 = 114. Next term = 180 + 114 = 294.',
      },
      {
        question: 'Q9: Kavita walks 20 meters North, turns right and walks 30 meters, turns right and walks 35 meters, then turns left and walks 15 meters. Finally she turns left and walks 15 meters. How far and in what direction is she from her starting point?',
        options: ['45 meters East', '30 meters East', '45 meters West', '15 meters South'],
        correctIdx: 0,
        tip: 'North-South: +20 -35 +15 = 0 meters. East-West: +30 +15 = 45 meters East. She is exactly 45 meters East.',
      },
      {
        question: 'Q10: In an engineering department of 200 students, 120 study Python, 90 study Java, and 40 study both. How many students study neither Python nor Java?',
        options: ['30 students', '20 students', '40 students', '50 students'],
        correctIdx: 0,
        tip: 'Total studying either = n(P) + n(J) - n(P ∩ J) = 120 + 90 - 40 = 170. Neither = 200 - 170 = 30 students.',
      },
    ],

    // -------------------------------------------------------------------------
    // ROUND 2: Technical Core Knowledge (10 distinct questions per branch)
    // -------------------------------------------------------------------------
    2: isMechanical
      ? [
          {
            question: 'Q1: In a hole-shaft assembly, the hole is dimensioned as 50 (+0.030, +0.000) mm and the shaft as 50 (+0.015, -0.010) mm. What type of fit does this produce?',
            options: ['Transition Fit', 'Clearance Fit', 'Interference Fit', 'Shrink Fit'],
            correctIdx: 0,
            tip: 'Max clearance is positive (+0.040 mm), but min clearance is negative (-0.015 mm), creating a transition fit.',
          },
          {
            question: 'Q2: For an air standard Otto cycle operating with a compression ratio of 8 and ratio of specific heats gamma = 1.4, what is the thermal efficiency?',
            options: ['56.5%', '48.2%', '62.1%', '52.0%'],
            correctIdx: 0,
            tip: 'Efficiency = 1 - (1 / r^(gamma - 1)) = 1 - (1 / 8^0.4) = 56.47%.',
          },
          {
            question: 'Q3: In Mohr’s circle for a two-dimensional state of stress, what does the radius of the circle physically represent?',
            options: ['Maximum in-plane shear stress', 'Principal stress', 'Hydrostatic normal stress', 'Von Mises equivalent stress'],
            correctIdx: 0,
            tip: 'Radius of Mohr circle R = (sigma_1 - sigma_2)/2 = tau_max (maximum in-plane shear stress).',
          },
          {
            question: 'Q4: What happens to the critical radius of insulation for a small cylindrical pipe if the convective heat transfer coefficient of surrounding air increases?',
            options: ['Decreases', 'Increases', 'Remains unchanged', 'Becomes zero'],
            correctIdx: 0,
            tip: 'Critical radius r_cr = k / h. As convective coefficient h increases, r_cr decreases.',
          },
          {
            question: 'Q5: Which casting defect is primarily caused by improper permeability of moulding sand and trapped gas bubbles?',
            options: ['Blowholes', 'Cold shut', 'Misrun', 'Hot tear'],
            correctIdx: 0,
            tip: 'Blowholes and pinholes result from entrapped moisture or poor venting gas permeability.',
          },
          {
            question: 'Q6: In metal cutting, which tool wear mechanism predominantly occurs at the crater on the rake face at high cutting speeds?',
            options: ['Diffusion and chemical dissolution', 'Abrasive wear', 'Adhesion micro-welding', 'Chipping of cutting edge'],
            correctIdx: 0,
            tip: 'At temperatures above 700°C, metallic atomic diffusion into the chip causes crater wear on the rake face.',
          },
          {
            question: 'Q7: What is the degree of freedom of a planar four-bar kinematic linkage according to Grubler’s criterion?',
            options: ['1 Degree of Freedom', '2 Degrees of Freedom', '0 Degrees of Freedom', '3 Degrees of Freedom'],
            correctIdx: 0,
            tip: 'Grubler formula: F = 3(n - 1) - 2j - h = 3(4 - 1) - 2(4) - 0 = 9 - 8 = 1.',
          },
          {
            question: 'Q8: In fluid mechanics, what does the Moody diagram correlate for fluid flow inside circular pipes?',
            options: ['Darcy friction factor vs Reynolds number and relative roughness', 'Velocity profile vs boundary layer thickness', 'Drag coefficient vs Mach number', 'Viscosity vs shear rate'],
            correctIdx: 0,
            tip: 'The Moody chart plots friction factor f against Reynolds number (Re) parameterized by relative roughness (epsilon / D).',
          },
          {
            question: 'Q9: Which crystal structure exhibits the highest number of active slip systems (48 slip systems), resulting in good ductility at room temperature?',
            options: ['Body-Centered Cubic (BCC)', 'Hexagonal Close-Packed (HCP)', 'Face-Centered Cubic (FCC)', 'Simple Cubic'],
            correctIdx: 0,
            tip: 'BCC (like alpha-iron) has 48 slip systems, providing high plasticity across temperature ranges.',
          },
          {
            question: 'Q10: What is the primary difference between a Governor and a Flywheel in a reciprocating heat engine?',
            options: ['A governor controls mean engine speed over multiple cycles upon load variation; a flywheel regulates cyclic speed fluctuations within a single cycle', 'A governor stores kinetic energy while a flywheel adjusts fuel supply', 'A governor only works in turbines while a flywheel only works in cars', 'They perform identical functions'],
            correctIdx: 0,
            tip: 'Flywheels handle cyclic fluctuations within one stroke; governors adjust mean fuel flow in response to external load changes.',
          },
        ]
      : isChemical
      ? [
          {
            question: 'Q1: In a binary distillation column, if feed enters as a saturated liquid at its bubble point, what is the value and slope of the q-line on the McCabe-Thiele diagram?',
            options: ['q = 1 (vertical line)', 'q = 0 (horizontal line)', 'q > 1 (negative slope)', '0 < q < 1 (positive slope)'],
            correctIdx: 0,
            tip: 'Saturated liquid feed has q = 1, which plots as a vertical line intersecting the feed composition on the diagonal line.',
          },
          {
            question: 'Q2: For an isothermal first-order liquid phase reaction, if 75% conversion is achieved in a plug flow reactor in 20 minutes, what is the reaction rate constant k?',
            options: ['0.0693 min^-1', '0.0346 min^-1', '0.1386 min^-1', '0.0500 min^-1'],
            correctIdx: 0,
            tip: 'For first order: k * t = ln(1 / (1 - X)) = ln(4) = 1.3863 => k = 1.3863 / 20 = 0.0693 min^-1.',
          },
          {
            question: 'Q3: In fluid flow through a packed bed of spherical catalyst particles, which equation predicts the frictional pressure drop across both laminar and turbulent regimes?',
            options: ['Ergun Equation', 'Hagen-Poiseuille Equation', 'Fanning Equation', 'Kozény-Carman Equation'],
            correctIdx: 0,
            tip: 'Ergun equation combines viscous loss (Blake-Kozeny) and kinetic inertial loss (Burke-Plummer).',
          },
          {
            question: 'Q4: What is the Prandtl number physically defined as in convective heat transfer?',
            options: ['Ratio of momentum diffusivity (kinematic viscosity) to thermal diffusivity', 'Ratio of buoyancy to viscous forces', 'Ratio of convective to conductive heat transfer', 'Ratio of inertial to viscous forces'],
            correctIdx: 0,
            tip: 'Pr = nu / alpha = (mu * Cp) / k.',
          },
          {
            question: 'Q5: In feedback control of a continuous stirred tank reactor, which controller action eliminates steady-state offset error completely?',
            options: ['Integral (I) action', 'Proportional (P) action only', 'Derivative (D) action only', 'Lead-lag filter only'],
            correctIdx: 0,
            tip: 'Integral action accumulates error over time and drives steady-state offset strictly to zero.',
          },
          {
            question: 'Q6: What is the relation between Lewis number (Le), Schmidt number (Sc), and Prandtl number (Pr) in simultaneous heat and mass transfer?',
            options: ['Le = Sc / Pr', 'Le = Pr / Sc', 'Le = Sc * Pr', 'Le = 1 / (Sc * Pr)'],
            correctIdx: 0,
            tip: 'Lewis number Le = alpha / D_AB = (nu / D_AB) / (nu / alpha) = Sc / Pr.',
          },
          {
            question: 'Q7: In a shell-and-tube heat exchanger, why are baffles placed on the shell side?',
            options: ['To induce turbulence, increase the convective heat transfer coefficient, and support tube bundles', 'To prevent fluid from touching the tubes', 'To reduce pressure drop to zero', 'To filter particulate matter'],
            correctIdx: 0,
            tip: 'Baffles create cross-flow turbulence that drastically increases heat transfer rates and prevents flow-induced tube vibration.',
          },
          {
            question: 'Q8: Which dimensionless number characterizes the ratio of chemical reaction rate to mass transfer diffusion rate (film theory)?',
            options: ['Hatta number (Ha)', 'Biot number', 'Nusselt number', 'Fourier number'],
            correctIdx: 0,
            tip: 'The Hatta number Ha evaluates enhancement of gas absorption rate by liquid-phase chemical reaction.',
          },
          {
            question: 'Q9: For an ideal binary mixture following Raoult’s law, what does an azeotrope represent?',
            options: ['A liquid mixture that boils at a constant temperature with identical vapor and liquid compositions, preventing further separation by simple distillation', 'A mixture with zero enthalpy of vaporization', 'A mixture that freezes at 0°C', 'A supercritical fluid state'],
            correctIdx: 0,
            tip: 'At an azeotropic point, relative volatility alpha = 1. Vapor and liquid compositions are equal (x = y).',
          },
          {
            question: 'Q10: In process safety management, what does the Lower Explosive Limit (LEL) of a volatile hydrocarbon vapor in air signify?',
            options: ['Minimum concentration of vapor in air below which flame propagation cannot occur even in the presence of an ignition source', 'Maximum allowable toxic exposure limit over 8 hours', 'The flash point temperature in Kelvin', 'The pressure at which autoignition occurs'],
            correctIdx: 0,
            tip: 'Below LEL, the mixture is too lean to burn. Above UEL, it is too rich.',
          },
        ]
      : isElectronics
      ? [
          {
            question: 'Q1: In an ideal operational amplifier circuit with negative feedback, what are the current into the inverting input and the voltage difference between inputs?',
            options: ['Zero current (infinite input impedance) and zero voltage difference (virtual short)', 'Maximum saturation current and rail voltage', '5 mA input current and 0.7V difference', 'Variable current depending on load resistance'],
            correctIdx: 0,
            tip: 'Ideal op-amps have infinite input impedance (zero input current) and infinite open-loop gain (virtual short between inputs).',
          },
          {
            question: 'Q2: What is the Nyquist sampling rate required to avoid aliasing for an analog band-limited signal with frequency components between 10 kHz and 25 kHz?',
            options: ['50 kHz', '25 kHz', '20 kHz', '100 kHz'],
            correctIdx: 0,
            tip: 'Nyquist rate f_s >= 2 * f_max = 2 * 25 kHz = 50 kHz.',
          },
          {
            question: 'Q3: In a silicon pn junction diode at 300K, what is the approximate value of thermal voltage V_t?',
            options: ['26 mV', '0.7 V', '1.1 eV', '50 mV'],
            correctIdx: 0,
            tip: 'Thermal voltage V_t = k*T/q ~ 25.86 mV ~ 26 mV at room temperature.',
          },
          {
            question: 'Q4: What type of digital filter is inherently guaranteed to possess unconditional stability?',
            options: ['Finite Impulse Response (FIR) filter', 'Infinite Impulse Response (IIR) filter', 'Butterworth IIR filter', 'Chebyshev type II filter'],
            correctIdx: 0,
            tip: 'FIR filters have all poles located exclusively at the origin of the z-plane (z = 0), guaranteeing unconditional stability.',
          },
          {
            question: 'Q5: In CMOS inverter design, why is the width of the PMOS transistor typically made 2 to 3 times larger than the width of the NMOS transistor?',
            options: ['Because hole mobility is roughly 2 to 3 times lower than electron mobility in silicon', 'To increase the threshold voltage of PMOS', 'To minimize gate oxide capacitance', 'To reduce static leakage current'],
            correctIdx: 0,
            tip: 'Electron mobility mu_n is 2.5-3x higher than hole mobility mu_p. Matching transconductance requires wider PMOS.',
          },
          {
            question: 'Q6: What is the propagation delay of a logic gate primarily determined by in digital CMOS circuits?',
            options: ['RC time constant of output drive resistance and capacitive load', 'Thermal noise power', 'External clock jitter', 'Silicon substrate bandgap only'],
            correctIdx: 0,
            tip: 't_pd is proportional to R_on * C_load where C_load includes gate, diffusion, and interconnect wire capacitance.',
          },
          {
            question: 'Q7: In serial microcontroller telemetry, what distinguishes the I2C bus physical layer from SPI?',
            options: ['I2C uses open-drain lines with pull-up resistors requiring only 2 wires, whereas SPI uses push-pull lines with dedicated Chip Select pins', 'I2C is faster than SPI (exceeding 100 MHz)', 'SPI cannot support multiple peripherals', 'I2C requires 6 hardware pins per slave'],
            correctIdx: 0,
            tip: 'I2C uses open-drain SDA/SCL lines with pull-ups. SPI uses SCLK, MOSI, MISO, and individual CS lines.',
          },
          {
            question: 'Q8: What condition must be met for an amplifier circuit to sustain stable continuous oscillations (Barkhausen criterion)?',
            options: ['Loop gain magnitude |A * beta| = 1 and total loop phase shift is 0° or 360°', 'Loop gain magnitude must be zero', 'Phase shift must be exactly 90°', 'Negative feedback must exceed 40 dB'],
            correctIdx: 0,
            tip: 'Barkhausen criterion requires unity loop gain magnitude |A*beta| = 1 with 0° (or 360°) net phase shift.',
          },
          {
            question: 'Q9: What is the physical role of the Translation Lookaside Buffer (TLB) in microprocessor memory management?',
            options: ['Fast associative hardware cache storing recent virtual-to-physical address mappings to avoid page table RAM lookups', 'Instruction decoder pipeline register', 'L3 cache controller', 'Interrupt vector lookup table'],
            correctIdx: 0,
            tip: 'The TLB caches recent VPN -> PFN mappings directly on the CPU die, turning memory translation into a 1-cycle hit.',
          },
          {
            question: 'Q10: In transmission lines, what does a Voltage Standing Wave Ratio (VSWR) of 1.0 indicate?',
            options: ['Perfect impedance matching between line and load with zero reflected power', 'Complete short circuit at the load', 'Complete open circuit at the load', '100% signal reflection'],
            correctIdx: 0,
            tip: 'VSWR = (1 + |Gamma|) / (1 - |Gamma|). When reflection coefficient Gamma = 0, VSWR = 1.0 (perfect match).',
          },
        ]
      : [
          // CSE / IT Technical Core (10 questions)
          {
            question: 'Q1: In a hash table of size 10 using open addressing with linear probing, insert keys [12, 22, 32]. Where does 32 end up?',
            options: ['Index 4', 'Index 2', 'Index 3', 'Index 5'],
            correctIdx: 0,
            tip: '12 hashes to index 2. 22 collides and probes to index 3. 32 collides at 2, 3 and lands on index 4.',
          },
          {
            question: 'Q2: What is the tightest worst-case time complexity of finding the median in an unsorted array of n distinct integers using Quickselect or Median of Medians?',
            options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'],
            correctIdx: 0,
            tip: 'Median of Medians algorithm achieves guaranteed deterministic O(n) worst-case time for selection.',
          },
          {
            question: 'Q3: In relational databases, what does the ACID "Isolation" property guarantee when multiple concurrent transactions execute?',
            options: ['Transactions execute independently without experiencing dirty or non-repeatable reads according to the isolation level', 'Transactions never fail due to hardware power outages', 'Database constraints like foreign keys are never violated', 'Changes are permanently recorded to disk before returning'],
            correctIdx: 0,
            tip: 'Isolation prevents intermediate states of one transaction from being prematurely observed or disrupted by concurrent transactions.',
          },
          {
            question: 'Q4: Which CPU scheduling algorithm is mathematically proven to minimize average waiting time for a set of processes arriving at time zero?',
            options: ['Shortest Job First (SJF / SRTF)', 'Round Robin (RR)', 'Priority Scheduling', 'First Come First Served (FCFS)'],
            correctIdx: 0,
            tip: 'SJF is optimal in giving the minimum average waiting time for a given set of processes.',
          },
          {
            question: 'Q5: In a TCP connection, which mechanism specifically detects packet loss and triggers fast retransmit without waiting for the retransmission timeout (RTO)?',
            options: ['Receipt of 3 duplicate ACKs', 'TCP SYN-ACK flag mismatch', 'Zero window probe packet', 'Checksum bit error in header'],
            correctIdx: 0,
            tip: 'Fast Retransmit sends missing segments immediately upon receiving 3 duplicate ACKs.',
          },
          {
            question: 'Q6: Which SQL clause benefits most directly from a composite B+ Tree index created on (department_id, salary)?',
            options: ['WHERE department_id = 10 AND salary > 50000', 'WHERE salary > 50000 (without department_id)', 'ORDER BY hire_date DESC', 'WHERE first_name LIKE "%John%"'],
            correctIdx: 0,
            tip: 'Composite B+ Tree indexes can only be traversed using the leftmost column prefix. Queries referencing department_id first can binary search the index.',
          },
          {
            question: 'Q7: In Banker’s Algorithm for deadlock avoidance, what does it mean for a system state to be "Safe"?',
            options: ['There exists at least one allocation sequence where all processes can finish execution without getting deadlocked', 'No processes are requesting I/O', 'Memory is 100% unallocated', 'CPU utilization is below 50%'],
            correctIdx: 0,
            tip: 'A state is safe if there exists a safe execution sequence <P1, P2... Pn> where each process can satisfy maximum demands using available resources.',
          },
          {
            question: 'Q8: What is the usable host IP address range for the subnet 192.168.10.64/26?',
            options: ['192.168.10.65 to 192.168.10.126', '192.168.10.64 to 192.168.10.127', '192.168.10.1 to 192.168.10.62', '192.168.10.65 to 192.168.10.128'],
            correctIdx: 0,
            tip: 'A /26 subnet has 32 - 26 = 6 host bits (64 IPs total). Network IP = .64, Broadcast IP = .127. Usable hosts = .65 to .126.',
          },
          {
            question: 'Q9: What is the maximum number of nodes in a full binary tree of height h (where a root node alone has height 1)?',
            options: ['2^h - 1', '2^(h - 1)', '2^(h + 1)', 'h^2'],
            correctIdx: 0,
            tip: 'Sum of geometric progression 1 + 2 + 4 + ... + 2^(h-1) = 2^h - 1 nodes.',
          },
          {
            question: 'Q10: What is the fundamental difference between Internal Fragmentation and External Fragmentation in memory management?',
            options: ['Internal fragmentation is allocated memory unutilized within a fixed frame; external fragmentation is free memory fragmented between allocated partitions', 'Internal fragmentation only occurs on disk, external in RAM', 'Internal fragmentation is resolved by paging, external cannot be resolved', 'They are synonymous terms for page faults'],
            correctIdx: 0,
            tip: 'Paging eliminates external fragmentation but can produce internal fragmentation in the final page of a process.',
          },
        ],

    // -------------------------------------------------------------------------
    // ROUND 3: System Architecture & Design (10 distinct questions)
    // -------------------------------------------------------------------------
    3: [
      {
        question: 'Q1: Interviewer: "How would you handle eventual consistency and cache invalidation when a user updates their profile picture across distributed edge servers?"',
        options: [
          'Use write-through caching with unique immutable hashed image URLs or explicit cache invalidation webhooks.',
          'Delete the primary database and re-upload every time.',
          'Wait 24 hours for DNS TTL to naturally expire.',
          'Disable all caching layers permanently across the system.',
        ],
        correctIdx: 0,
        tip: 'Immutable asset URLs with version hashes prevent stale cache reads immediately.',
      },
      {
        question: 'Q2: Interviewer: "When scaling an API to millions of requests per minute, how would you prevent a database bottleneck on hot read queries?"',
        options: [
          'Implement distributed caching (Redis/Memcached) with cache-aside pattern, read replicas, and connection pooling.',
          'Store all data in flat text files on disk.',
          'Restart the server every 10 minutes.',
          'Use synchronous file locks on every database row.',
        ],
        correctIdx: 0,
        tip: 'Distributed caching shields the database while read replicas handle distributed read scale.',
      },
      {
        question: 'Q3: Interviewer: "Explain how database indexing using B+ Trees optimizes range queries compared to a Hash index."',
        options: [
          'B+ Trees store all records sorted in leaf nodes linked as a doubly-linked list, enabling efficient sequential range scans in O(log n + k).',
          'Hash indices are faster for range queries than B+ Trees.',
          'B+ Trees compress all data into binary strings.',
          'B+ Trees only work with numerical integers.',
        ],
        correctIdx: 0,
        tip: 'Linked leaf nodes in B+ Trees allow bidirectional range scans after an O(log n) boundary lookup.',
      },
      {
        question: 'Q4: Interviewer: "How do you detect and recover from deadlocks in concurrent multi-threaded programs?"',
        options: [
          'Prevent cyclic wait by enforcing a global lock acquisition order, using timed try-locks, and resource allocation graphs for detection.',
          'Ignore them because modern operating systems terminate threads silently.',
          'Increase thread count to 10,000.',
          'Never use synchronization in multi-threaded programs.',
        ],
        correctIdx: 0,
        tip: 'Breaking Coffman condition (circular wait) via consistent ordering prevents deadlocks completely.',
      },
      {
        question: 'Q5: Interviewer: "What architectural tradeoffs distinguish microservices from a well-structured modular monolith for a campus placement startup?"',
        options: [
          'Monolith offers simpler transactions, lower deployment overhead, and easier refactoring initially, whereas microservices introduce network latency and distributed data consistency tradeoffs.',
          'Microservices are always superior regardless of scale and cost.',
          'Monoliths cannot connect to a database.',
          'Microservices don’t require APIs to communicate.',
        ],
        correctIdx: 0,
        tip: 'Operational complexity, network boundaries, and eventual consistency are the key tradeoffs.',
      },
      {
        question: 'Q6: Interviewer: "Which rate-limiting algorithm is best suited for an API gateway that must permit short bursts of traffic while enforcing a strict average limit?"',
        options: [
          'Token Bucket Algorithm',
          'Fixed Window Counter',
          'Random Dropping Algorithm',
          'First-Come First-Served Queue',
        ],
        correctIdx: 0,
        tip: 'Token Bucket allows accumulated tokens to be consumed in bursts up to bucket capacity while replenishing at a steady fill rate.',
      },
      {
        question: 'Q7: Interviewer: "According to the CAP Theorem, why can a distributed data store not provide both Consistency and Availability simultaneously during a network partition (P)?"',
        options: [
          'Because if nodes cannot communicate across a network split, updating one node causes inconsistencies unless other partitions reject writes (sacrificing availability).',
          'Because CPUs cannot process two network packets at the same time.',
          'Because databases must restart after every query.',
          'CAP theorem only applies to single-core computers.',
        ],
        correctIdx: 0,
        tip: 'When a partition occurs, an update must either be written to the reachable node (creating inconsistency) or rejected (sacrificing availability).',
      },
      {
        question: 'Q8: Interviewer: "Why is Consistent Hashing preferred over simple modulo hashing (hash(key) % N) when distributing keys across caching servers?"',
        options: [
          'When adding or removing a server node, consistent hashing remaps only K/N keys on average, whereas modulo hashing remaps virtually all keys.',
          'Consistent hashing compresses keys into 8 bits.',
          'Consistent hashing makes database queries unnecessary.',
          'Consistent hashing avoids using cryptographic hash functions.',
        ],
        correctIdx: 0,
        tip: 'Consistent hashing ring topology prevents massive cache invalidation thundering herds when cluster size changes.',
      },
      {
        question: 'Q9: Interviewer: "In an asynchronous message queue architecture (e.g. RabbitMQ or Kafka), how do you ensure idempotent message processing?"',
        options: [
          'Assign each message a unique idempotency key or UUID and verify in an ACID store or Redis whether the key was already processed before applying state changes.',
          'Delete the message queue server after each message.',
          'Ensure messages are only sent once over the network with zero retries.',
          'Never use message queues for financial transactions.',
        ],
        correctIdx: 0,
        tip: 'Because distributed networks provide at-least-once delivery, consumer idempotency keys prevent duplicate processing upon retries.',
      },
      {
        question: 'Q10: Interviewer: "How does Optimistic Concurrency Control (OCC) differ from Pessimistic Locking in database transactions?"',
        options: [
          'OCC allows concurrent reads and writes without locking, checking a version timestamp at commit time; Pessimistic locking acquires exclusive locks upfront.',
          'OCC locks the entire table for 10 minutes.',
          'Pessimistic locking never aborts transactions.',
          'OCC requires two separate databases.',
        ],
        correctIdx: 0,
        tip: 'OCC is optimal for read-heavy workloads with low contention, avoiding expensive lock contention overhead.',
      },
    ],

    // -------------------------------------------------------------------------
    // ROUND 4: HR Behavioral & Situational Judgment (10 distinct questions)
    // -------------------------------------------------------------------------
    4: [
      {
        question: 'Q1: HR Question: "Tell me about a situation where your project team faced an unexpected deadline crunch due to a broken component or scope change. How did you handle it?"',
        options: [
          'Followed the STAR method: identified the root problem, re-allocated workload, aligned with the guide/team, and delivered verified milestones on time.',
          'Blamed external vendors and demanded an extension from university evaluators.',
          'Ignored the broken component and submitted an incomplete demo.',
          'Left the project team entirely.',
        ],
        correctIdx: 0,
        tip: 'Leadership, composure under stress, and clear communication are key HR evaluation criteria.',
      },
      {
        question: 'Q2: HR Question: "Where do you see yourself in 3 to 5 years after joining our engineering organization?"',
        options: [
          'Mastering the domain technology stack, taking ownership of critical features, mentoring junior teammates, and growing toward technical leadership.',
          'Leaving after 3 months to pursue personal projects.',
          'Doing only the bare minimum required to keep the job.',
          'Switching completely out of engineering into unrelated fields immediately.',
        ],
        correctIdx: 0,
        tip: 'Recruiters assess learning agility, stability, self-direction, and commitment to growth.',
      },
      {
        question: 'Q3: HR Question: "How do you handle constructive criticism or code review feedback when a senior engineer flags issues in your solution?"',
        options: [
          'Listen objectively without being defensive, understand the rationale, implement the suggested improvements, and verify with tests.',
          'Argue aggressively that their opinion is irrelevant.',
          'Silently ignore the comments and push code to production anyway.',
          'File an HR grievance against the reviewer.',
        ],
        correctIdx: 0,
        tip: 'Receptiveness to feedback is an essential trait for collaborative software engineering teams.',
      },
      {
        question: 'Q4: HR Question: "Why are you specifically interested in joining our company rather than other recruiting firms on campus?"',
        options: [
          'Because your engineering culture, technical problems in this domain, and structured mentorship align directly with my career ambitions.',
          'I am applying to every company randomly without preference.',
          'Only because your campus placement stipend is high.',
          'My parents forced me to attend this interview.',
        ],
        correctIdx: 0,
        tip: 'Genuine alignment with company domain, mission, and learning environment leaves a strong impression.',
      },
      {
        question: 'Q5: HR Question: "Describe a time when you had to learn an unfamiliar technology or framework within a short timeframe to deliver an academic or hackathon project."',
        options: [
          'Deconstructed official documentation, built a small proof-of-concept prototype, diagnosed errors methodically, and integrated it into the production deliverable.',
          'Panicked and gave up on the project completely.',
          'Copied random code from the internet without understanding how it works.',
          'Asked someone else to do the entire assignment for me.',
        ],
        correctIdx: 0,
        tip: 'Autodidactic learning, curiosity, and resourceful problem-solving are high-value graduate traits.',
      },
      {
        question: 'Q6: HR Question: "How do you prioritize multiple conflicting deadlines when three different stakeholders demand urgency?"',
        options: [
          'Evaluate each task using an impact-versus-urgency matrix, transparently communicate realistic delivery timelines with stakeholders, and renegotiate dependencies.',
          'Work on whatever task is shouted about loudest.',
          'Promise all three that their project will be finished in 1 hour and fail all three.',
          'Shut down communication and go home.',
        ],
        correctIdx: 0,
        tip: 'Stakeholder communication and transparent triage demonstrate executive maturity.',
      },
      {
        question: 'Q7: HR Question: "Tell me about a time you noticed an error or edge-case bug in your own code before it reached production or evaluation."',
        options: [
          'Immediately took ownership, wrote an automated test reproducing the failure, implemented a clean fix, and documented the root cause.',
          'Hidden the bug hoping nobody would notice during evaluation.',
          'Blamed the compiler or operating system.',
          'Deleted the test suite so the build would pass green.',
        ],
        correctIdx: 0,
        tip: 'Intellectual integrity and proactive ownership are prized in high-reliability software teams.',
      },
      {
        question: 'Q8: HR Question: "How would you handle a situation where a teammate is disengaged or not contributing their fair share to a group milestone?"',
        options: [
          'Schedule a private 1-on-1 check-in to understand any technical hurdles or personal blockers, clarify specific module ownership, and establish mutual milestones.',
          'Publicly shame them in front of the entire team.',
          'Secretly report them to university authorities without talking to them first.',
          'Refuse to do any work until they finish their portion.',
        ],
        correctIdx: 0,
        tip: 'Empathy combined with accountable communication resolves collaborative dysfunction.',
      },
      {
        question: 'Q9: HR Question: "What are your salary expectations as a campus fresher graduate?"',
        options: [
          'I am guided by campus placement standards for this tier and role; my primary focus is joining a team where I can solve high-impact engineering problems and grow my technical abilities.',
          'I demand the highest salary in the entire college batch regardless of performance.',
          'I will work for zero compensation indefinitely.',
          'I refuse to discuss compensation until after I am hired.',
        ],
        correctIdx: 0,
        tip: 'A balanced response demonstrates market awareness and focus on learning and value creation.',
      },
      {
        question: 'Q10: HR Question: "Do you have any questions for us about the team, tech stack, or engineering culture?"',
        options: [
          'Ask thoughtful questions about code review standards, onboarding mentorship, production deployment cadence, or major technical initiatives.',
          'Say "No, I have no questions at all, when do I get the offer letter?"',
          'Ask what time employees are allowed to leave every day.',
          'Ask if employees can skip work without notifying anyone.',
        ],
        correctIdx: 0,
        tip: 'Having prepared, inquisitive questions indicates deep engagement and proactive preparation.',
      },
    ],
  };

  const currentRoundQuestions = activeRoundModal ? (ROUND_CHALLENGES[activeRoundModal.id] || []) : [];
  const currentChallenge = currentRoundQuestions[currentRoundQuestionIdx] || null;

  // Active Timer Countdown
  useEffect(() => {
    if (!activeRoundModal || reviewData) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto submit when time expires
          handleCompleteRoundModal();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeRoundModal, reviewData]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRoundModal = (round: PlacementRound) => {
    setActiveRoundModal(round);
    setCurrentRoundQuestionIdx(0);
    setRoundAnswers({});
    setSecondsRemaining(15 * 60);
    setReviewData(null);
  };

  const handleCompleteRoundModal = () => {
    if (!activeRoundModal) return;

    let correctCount = 0;
    currentRoundQuestions.forEach((q, idx) => {
      if (roundAnswers[idx] === q.correctIdx) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / currentRoundQuestions.length) * 100);
    const passed = score >= 70;

    // Show Post-Round Review
    setReviewData({
      round: activeRoundModal,
      questions: [...currentRoundQuestions],
      userAnswers: { ...roundAnswers },
      score,
      passed,
      correctCount,
    });
  };

  const handleConfirmReview = () => {
    if (!reviewData) return;

    const { round, score, passed, correctCount, questions } = reviewData;
    const feedback = passed
      ? `Passed round with a verified score of ${score}% (${correctCount}/${questions.length} correct). Above the 70% company recruitment cutoff!`
      : `Scored ${score}% (${correctCount}/${questions.length} correct). Need 70% to pass campus recruitment threshold. Review recommended topics and try again.`;

    updatePlacementRound(round.id, passed ? 'completed' : 'current', score, feedback);
    setActiveRoundModal(null);
    setReviewData(null);
    setCurrentRoundQuestionIdx(0);
    setRoundAnswers({});
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#202431] border border-slate-800 shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
              <span>Multi-Round Recruitment Workflow Simulation</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Role Simulation: {placementSimulation.companyName}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Target Role: <span className="text-cyan-400 font-semibold">{placementSimulation.role}</span>.
              Simulate actual placement rounds by advancing sequentially through Aptitude, Technical MCQ, System Architecture, and HR Interview. Each round contains 10 rigorous questions with a 70% cutoff barrier.
            </p>
            <p className="text-[11px] text-slate-400 italic">
              Notice: Practice simulation only. Scores measure practice competency evidence and do not predict or guarantee employment outcomes.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={restartPlacementSimulation}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#151821] hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Simulation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Completion Banner if all completed */}
      {placementSimulation.status === 'selected' && (
        <div className="p-6 rounded-2xl bg-[#202431] border border-emerald-500/30 shadow-lg space-y-4 animate-in fade-in">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-400 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Simulation Complete
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                All 4 Simulated Practice Rounds Completed
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                {placementSimulation.finalResult?.summary}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-[#151821] border border-slate-800 text-xs text-slate-300">
              <span className="font-bold text-emerald-400">Demonstrated Strength: </span>
              {placementSimulation.finalResult?.strongestRound}
            </div>
            <div className="p-3.5 rounded-xl bg-[#151821] border border-slate-800 text-xs text-slate-300">
              <span className="font-bold text-amber-400">Priority Competency Gap: </span>
              {placementSimulation.finalResult?.weakestRound}
            </div>
          </div>
        </div>
      )}

      {/* Rounds Progression Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {placementSimulation.rounds.map((round, idx) => {
          const isCompleted = round.status === 'completed';
          const isCurrent = round.status === 'current';
          const isLocked = round.status === 'locked';

          return (
            <div
              key={round.id}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                isCompleted
                  ? 'bg-emerald-950/10 dark:bg-emerald-950/15 border-emerald-500/30'
                  : isCurrent
                  ? 'bg-white dark:bg-slate-900 border-violet-500 shadow-md ring-1 ring-violet-500/50'
                  : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800/80 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                    Round 0{idx + 1} • 10 Questions
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      isCompleted
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                        : isCurrent
                        ? 'bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 animate-pulse'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isCompleted
                      ? `Passed (${round.score}/100)`
                      : isCurrent
                      ? 'Current Round'
                      : 'Locked'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {round.name}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {round.description}
                </p>

                {round.feedback && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-violet-600 dark:text-violet-400">Recruiter Feedback: </span>
                    {round.feedback}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="w-3.5 h-3.5" /> Duration: 15 mins (10 Qs)
                </span>

                {isCurrent && (
                  <button
                    onClick={() => handleStartRoundModal(round)}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 shadow-md shadow-violet-600/25 transition-all cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Attempt Round</span>
                  </button>
                )}

                {isCompleted && (
                  <button
                    onClick={() => handleStartRoundModal(round)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Retake Practice
                  </button>
                )}

                {isLocked && (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Complete prior round
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: Round Assessment Test Mode (10 Questions + Countdown Timer + 10 Jumpers) */}
      {activeRoundModal && currentChallenge && !reviewData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            {/* Header with Title and Countdown Timer */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                  Recruitment Round • Question {currentRoundQuestionIdx + 1} of {currentRoundQuestions.length}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {activeRoundModal.name}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono text-xs font-bold ${
                    secondsRemaining < 120
                      ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30 animate-pulse'
                      : 'bg-indigo-50 dark:bg-indigo-950/60 text-[#4F46E5] dark:text-cyan-400 border border-indigo-200 dark:border-indigo-800'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTimer(secondsRemaining)}</span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  Cutoff: 70%
                </span>
              </div>
            </div>

            {/* 10-Question Jumper Navigation */}
            <div className="py-2 border-b border-slate-100 dark:border-slate-800/80">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Question Jumper ({Object.keys(roundAnswers).length}/10 answered)
              </p>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {currentRoundQuestions.map((_, qIdx) => {
                  const isAnswered = roundAnswers[qIdx] !== undefined;
                  const isCurrent = currentRoundQuestionIdx === qIdx;
                  return (
                    <button
                      key={qIdx}
                      type="button"
                      onClick={() => setCurrentRoundQuestionIdx(qIdx)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                        isCurrent
                          ? 'bg-[#4F46E5] text-white ring-2 ring-indigo-400 shadow-md'
                          : isAnswered
                          ? 'bg-emerald-500 text-white font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {qIdx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question Text */}
            <div className="flex-1 overflow-y-auto space-y-4 py-2">
              <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
                {currentChallenge.question}
              </p>

              {/* Options */}
              <div className="space-y-2.5">
                {currentChallenge.options.map((opt, optIdx) => {
                  const isSelected = roundAnswers[currentRoundQuestionIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() =>
                        setRoundAnswers((prev) => ({
                          ...prev,
                          [currentRoundQuestionIdx]: optIdx,
                        }))
                      }
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 border-[#4F46E5] text-[#4F46E5] dark:text-cyan-300 font-bold ring-2 ring-indigo-400/30'
                          : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#4F46E5] dark:text-cyan-300 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setActiveRoundModal(null);
                  setRoundAnswers({});
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                Exit Simulation
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentRoundQuestionIdx === 0}
                  onClick={() => setCurrentRoundQuestionIdx((prev) => Math.max(0, prev - 1))}
                  className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {currentRoundQuestionIdx < currentRoundQuestions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentRoundQuestionIdx((prev) => prev + 1)}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#3730A3] shadow-md transition-all cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCompleteRoundModal}
                    disabled={Object.keys(roundAnswers).length === 0}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 shadow-md transition-all cursor-pointer"
                  >
                    <span>Submit Round ({Object.keys(roundAnswers).length}/10 Answered)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Post-Round Review & Verification (All 10 Questions + Detailed Explanations) */}
      {reviewData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[92vh] flex flex-col">
            {/* Review Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                  Post-Round Evaluation & Detailed Review
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {reviewData.round.name} Results
                </h3>
              </div>

              <div
                className={`px-4 py-2 rounded-2xl flex items-center gap-2 font-bold text-sm shadow-xs ${
                  reviewData.passed
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                }`}
              >
                {reviewData.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-500" />
                )}
                <span>
                  {reviewData.score}% — {reviewData.passed ? 'Cleared (Cutoff: 70%)' : 'Did Not Clear (Need 70%)'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              You answered <span className="font-bold text-[#4F46E5] dark:text-cyan-400">{reviewData.correctCount} of {reviewData.questions.length}</span> questions correctly. Review the technical explanations and recruiter takeaways below before proceeding:
            </p>

            {/* Review Questions Accordion List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {reviewData.questions.map((q, idx) => {
                const userAns = reviewData.userAnswers[idx];
                const isCorrect = userAns === q.correctIdx;
                const isUnanswered = userAns === undefined;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCorrect
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <span
                          className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                            isCorrect
                              ? 'bg-emerald-500 text-white'
                              : 'bg-rose-500 text-white'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {q.question}
                        </p>
                      </div>

                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          isCorrect
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {isCorrect ? '+10 Pts' : '0 Pts'}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1.5 pl-8 text-xs">
                      <p>
                        <span className="font-semibold text-slate-500 dark:text-slate-400">Your Answer: </span>
                        {isUnanswered ? (
                          <span className="text-slate-400 italic">Not attempted</span>
                        ) : (
                          <span className={isCorrect ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-rose-600 dark:text-rose-400 font-bold'}>
                            {q.options[userAns]}
                          </span>
                        )}
                      </p>

                      {!isCorrect && (
                        <p>
                          <span className="font-semibold text-slate-500 dark:text-slate-400">Correct Answer: </span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            {q.options[q.correctIdx]}
                          </span>
                        </p>
                      )}

                      <div className="mt-2 p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                        <span className="font-bold text-violet-600 dark:text-violet-400">Technical Tip / Solution: </span>
                        {q.tip}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setReviewData(null);
                  setActiveRoundModal(null);
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                Close Without Saving
              </button>

              <button
                type="button"
                onClick={handleConfirmReview}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 shadow-md shadow-violet-600/30 transition-all cursor-pointer"
              >
                <span>{reviewData.passed ? 'Save & Advance Simulation' : 'Record Score & Retry Round'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
