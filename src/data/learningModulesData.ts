import { DetailedStudyModule } from '../components/TechnicalLearningModule';

export const STUDY_MODULES: Record<string, DetailedStudyModule> = {
  // 1. ECE / Embedded: Communication Protocols
  'ece-1': {
    id: 'ece-1',
    title: 'Communication Protocols: UART vs SPI vs I²C',
    branchCategory: 'Electronics & Embedded Systems',
    estimatedMinutes: 25,
    difficulty: 'Medium',
    learningObjectives: [
      'Compare bus topology, pin count, and transmission mechanics of UART, SPI, and I2C.',
      'Analyze clock synchronization, baud rate calculation, and framing errors.',
      'Understand open-drain configurations and pull-up resistor calculation in I2C.',
      'Select the right protocol for sensors, displays, and inter-chip telemetry.',
    ],
    prerequisites: [
      'Digital logic levels (TTL / CMOS)',
      'Basic serial vs parallel data transmission',
      'Pull-up resistor fundamentals and Ohm’s Law',
    ],
    conceptExplanation:
      'Embedded microcontrollers communicate with sensors, memories, and actuators using serial protocols to minimize pin count. The three most essential hardware protocols tested in core placement drives are UART (Universal Asynchronous Receiver-Transmitter), SPI (Serial Peripheral Interface), and I²C (Inter-Integrated Circuit).\n\nUART is asynchronous (no shared clock line) and point-to-point. SPI is synchronous (shared SCLK) and full-duplex using master-slave topology with dedicated Chip Select (CS/SS) lines for high speed (10-50+ MHz). I²C is synchronous, half-duplex, and uses only two open-drain bidirectional lines (SDA and SCL) with 7-bit addressing, supporting 128+ devices on a single bus with pull-up resistors.',
    howItWorks: [
      'UART framing: Transmitter holds line HIGH (idle), pulls LOW for 1 Start Bit, transmits 5-9 Data Bits (LSB first), optional Parity Bit, and 1-2 HIGH Stop Bits.',
      'SPI transmission: Master asserts slave Chip Select (CS=LOW), toggles SCLK, and simultaneously shifts bits out on MOSI while latching incoming bits on MISO based on CPOL (Clock Polarity) and CPHA (Clock Phase).',
      'I2C handshake: Master initiates START condition (SDA goes LOW while SCL is HIGH), transmits 7-bit device address + R/W bit, waits for ACK (slave pulls SDA LOW on 9th clock), transmits byte data with ACKs, and terminates with STOP condition (SDA goes HIGH while SCL is HIGH).',
      'I2C open-drain mechanism: Devices only pull lines to ground (active LOW). When released, external pull-up resistors pull lines to VDD, preventing bus contention short-circuits.',
    ],
    keyTerminology: [
      {
        term: 'Baud Rate',
        definition: 'Number of signal transitions per second. In standard UART, 9600 to 115200 baud equates to bits per second including framing.',
      },
      {
        term: 'Clock Stretch (I2C)',
        definition: 'Mechanism where a slow slave holds the SCL line LOW to pause the master until it finishes processing data.',
      },
      {
        term: 'Chip Select (CS / SS)',
        definition: 'An active-LOW hardware line used by an SPI master to address and enable a specific peripheral.',
      },
      {
        term: 'Open-Drain',
        definition: 'An output circuit where a transistor can sink current to ground or float high-Z, requiring an external pull-up resistor.',
      },
    ],
    workedExample: {
      title: 'Calculating I2C Pull-Up Resistor (Rp) for a 400 kHz Fast-Mode Bus',
      scenario:
        'An embedded team is connecting an MPU-6050 accelerometer and an EEPROM over I2C operating at 400 kHz (Fast-Mode). Bus capacitance (trace + pin capacitance) is measured at Cb = 150 pF. Supply voltage VDD = 3.3V. Maximum allowed rise time tr = 300 ns.',
      stepByStep: [
        'Recall rise time formula for an RC circuit from 0.3 VDD to 0.7 VDD: tr = 0.8473 * Rp * Cb.',
        'Rearrange to solve for maximum allowable Rp: Rp_max = tr / (0.8473 * Cb).',
        'Substitute values: Rp_max = (300 * 10^-9 s) / (0.8473 * 150 * 10^-12 F) = 300 / 0.127 = 2360 Ohms (approx 2.36 kOhms).',
        'Check minimum Rp to protect open-drain MOSFET (max sink current = 3 mA, Vol = 0.4V): Rp_min = (VDD - Vol) / Iol = (3.3V - 0.4V) / 3 mA = 966 Ohms.',
        'Conclusion: Choose a standard resistor value between 1 kOhm and 2.2 kOhms. A 1.8 kOhm or 2.2 kOhm resistor is standard.',
      ],
      takeaway:
        'Choosing Rp too high causes slow rising edges exceeding the max rise time, corrupting high-frequency bits. Choosing Rp too low pulls excessive current, exceeding the output pin’s sinking limit.',
    },
    practicalApplication:
      'In modern automotive ECUs and IoT devices: UART connects GPS modules and cellular modems; SPI drives high-speed OLED/TFT displays and SD cards; I²C connects multiple onboard sensors (IMUs, temperature, ambient light) using just two microcontroller GPIO pins.',
    technicalArtifact: {
      type: 'diagram',
      title: 'Protocol Comparison & Waveform Summary',
      content: `+----------+-------+------------+-------------+----------------------+
| Protocol | Wires | Duplex     | Clock Sync  | Typical Max Speed    |
+----------+-------+------------+-------------+----------------------+
| UART     | 2     | Full-Duplex| Asynchronous| 115.2 kbps - 1 Mbps  |
| SPI      | 4     | Full-Duplex| Synchronous | 10 Mbps - 50+ Mbps   |
| I2C      | 2     | Half-Duplex| Synchronous | 100 kHz - 3.4 Mbps   |
+----------+-------+------------+-------------+----------------------+

UART Frame:
[IDLE: HIGH]--\\___[START: 0]___[D0][D1][D2][D3][D4][D5][D6][D7]___[PARITY]___/~~[STOP: 1]~~

I2C START/STOP Conditions:
START: SDA falls while SCL is HIGH
STOP:  SDA rises while SCL is HIGH`,
      explanation:
        'Notice how UART relies on accurate local oscillator matching, while SPI and I2C carry their own master clock, making them immune to baud mismatch.',
    },
    commonMistakes: [
      {
        mistake: 'Forgetting pull-up resistors on an I2C bus.',
        whyWrong: 'Because I2C pins are open-drain, the line will stay LOW forever once pulled down and can never float back to logic HIGH.',
        correctWay: 'Always place 2.2k - 4.7k pull-up resistors to VDD on both SDA and SCL.',
      },
      {
        mistake: 'Connecting UART TX to TX and RX to RX.',
        whyWrong: 'Both sides will transmit onto the same wire and listen on an un-driven line.',
        correctWay: 'Cross the lines: TX of Microcontroller A goes to RX of Microcontroller B, and vice versa.',
      },
      {
        mistake: 'Ignoring clock polarity (CPOL) and clock phase (CPHA) in SPI drivers.',
        whyWrong: 'If master samples on rising edge while slave updates on rising edge, data will be sampled during transition, reading garbage.',
        correctWay: 'Check the peripheral datasheet SPI Mode (Mode 0, 1, 2, or 3) and configure microcontroller SPI registers to match.',
      },
    ],
    interviewPreparation: [
      {
        question: 'Why does I2C need pull-up resistors, but SPI does not?',
        modelAnswer:
          'I2C utilizes open-drain (or open-collector) drivers so multiple devices can share the same bidirectional wire without short-circuits. Open-drain pins can only drive logic LOW (connect to GND) or float (high impedance); they cannot source current to drive logic HIGH. External pull-up resistors pull the voltage up to VDD when all devices release the line. In contrast, SPI uses push-pull CMOS outputs with dedicated unidirectional lines (MOSI, MISO) where the active driver actively pushes to VDD or pulls to GND, eliminating the need for pull-ups.',
        recruiterTips:
          'Emphasize the open-drain wired-AND property and bus contention prevention.',
      },
      {
        question: 'How do you detect and handle a framing error in UART?',
        modelAnswer:
          'A UART framing error occurs when the receiver fails to detect a valid logic HIGH Stop Bit at the expected bit period. Root causes include baud rate mismatch (greater than ~3% oscillator drift), noise spikes, or incorrect parity settings. Microcontrollers flag the FE (Framing Error) bit in their UART status register. The firmware clears the error, discards the corrupted byte, and can re-synchronize by waiting for the line to return to the idle HIGH state.',
        recruiterTips:
          'Mention the 3% oscillator tolerance limit; recruiters love this quantitative detail.',
      },
      {
        question: 'When would you prefer SPI over I2C in an embedded product?',
        modelAnswer:
          'I would choose SPI when high throughput and low software overhead are required, such as streaming graphics to an LCD/TFT display, reading megabytes from flash memory, or sampling high-frequency audio ADCs. SPI supports 20-50+ MHz full-duplex transfers with no packet address overhead. I would choose I2C when pin count is constrained and multiple low-speed sensors (like temperature, pressure, battery monitors) need to share just 2 microcontroller pins.',
        recruiterTips:
          'Structure your answer by comparing throughput, pin count, and protocol overhead.',
      },
    ],
    revisionNotes: [
      'UART = 2 wires (TX, RX), asynchronous, point-to-point, max ~1 Mbps.',
      'SPI = 4 wires (MOSI, MISO, SCLK, CS), synchronous, full-duplex, fast (up to 50+ MHz).',
      'I2C = 2 wires (SDA, SCL), synchronous, half-duplex, multi-device via 7-bit addresses, requires pull-up resistors.',
      'I2C START: SDA falling while SCL HIGH. I2C STOP: SDA rising while SCL HIGH.',
      'Baud rate oscillator tolerance: UART cannot tolerate more than ~3-4% clock drift without framing errors.',
    ],
    knowledgeCheck: [
      {
        question: 'What is the electrical reason I2C buses require pull-up resistors on SDA and SCL?',
        options: [
          'To increase transmission speed past 100 MHz',
          'Because devices use open-drain outputs that can only sink current to ground, relying on resistors to pull the lines HIGH',
          'To invert digital logic signals',
          'To provide power supply to slave sensors',
        ],
        correctIndex: 1,
        explanation:
          'Open-drain transistors can only pull lines LOW. Pull-up resistors pull the bus to VDD when released, allowing collision-free multi-master arbitration.',
      },
      {
        question: 'In SPI communication, which pin is used by the master to select a specific slave device?',
        options: ['MISO', 'MOSI', 'CS / SS (Chip Select / Slave Select)', 'SCLK'],
        correctIndex: 2,
        explanation:
          'Chip Select (CS or Slave Select SS) is pulled LOW by the master to enable communication with a specific slave peripheral.',
      },
      {
        question: 'What happens during a UART Framing Error?',
        options: [
          'The receiver detects a missing or invalid logic HIGH Stop Bit at the expected time',
          'The cable is physically unplugged',
          'The parity calculation overflows',
          'The baud rate increases automatically',
        ],
        correctIndex: 0,
        explanation:
          'A framing error occurs when the receiver samples the Stop Bit time slot and finds logic 0 instead of the expected logic 1.',
      },
    ],
    furtherPractice: [
      'Write a C driver function implementing a software I2C bit-banging START condition using GPIO registers.',
      'Calculate the maximum SPI clock speed given a trace propagation delay of 2 ns and slave setup time of 8 ns.',
      'Design a circular ring buffer in C for receiving UART packets via DMA without dropping bytes.',
    ],
  },

  // 2. Mechanical: Thermodynamics & Carnot Cycle
  'mech-1': {
    id: 'mech-1',
    title: 'Thermodynamics: Second Law, Carnot Cycle & Entropy',
    branchCategory: 'Mechanical Engineering',
    estimatedMinutes: 25,
    difficulty: 'Easy',
    learningObjectives: [
      'Understand the Kelvin-Planck and Clausius statements of the Second Law.',
      'Analyze the 4 reversible processes of the idealized Carnot cycle on P-v and T-s diagrams.',
      'Calculate theoretical Carnot thermal efficiency limits between thermal reservoirs.',
      'Grasp the thermodynamic definition of entropy (dS = dQ_rev / T) and the Principle of Increase of Entropy.',
    ],
    prerequisites: [
      'First Law of Thermodynamics (Energy conservation, Delta_U = Q - W)',
      'Basic PVT state equations for ideal gases (Pv = RT)',
      'Difference between heat and work',
    ],
    conceptExplanation:
      'While the First Law states energy cannot be created or destroyed, it provides no restriction on the direction of energy conversion. The Second Law of Thermodynamics dictates that energy has quality as well as quantity: work can be completely converted into heat, but heat cannot be continuously and completely converted into work without rejecting some heat to a lower-temperature sink.\n\nThe Carnot Cycle is an idealized theoretical thermodynamic cycle proposed by Nicolas Léonard Sadi Carnot in 1824. It consists of four completely reversible processes (two isothermal, two isentropic) and establishes the absolute upper thermodynamic limit on the thermal efficiency of any heat engine operating between two temperature reservoirs (TH and TL).',
    howItWorks: [
      'Process 1-2 (Reversible Isothermal Expansion): Working fluid expands at constant source temperature TH while absorbing heat QH from the hot reservoir.',
      'Process 2-3 (Isentropic / Reversible Adiabatic Expansion): Fluid continues expanding without heat transfer (Q = 0); temperature drops from TH down to sink temperature TL while producing shaft work.',
      'Process 3-4 (Reversible Isothermal Compression): Working fluid is compressed at constant sink temperature TL while rejecting heat QL to the cold reservoir.',
      'Process 4-1 (Isentropic / Reversible Adiabatic Compression): Fluid is compressed adiabatically (Q = 0); temperature rises from TL back to TH, restoring the initial state.',
    ],
    keyTerminology: [
      {
        term: 'Carnot Efficiency (eta_th,rev)',
        definition: 'eta = 1 - (TL / TH), where temperatures TH and TL must be expressed in absolute Kelvin.',
      },
      {
        term: 'Kelvin-Planck Statement',
        definition: 'It is impossible for any device operating in a thermodynamic cycle to receive heat from a single reservoir and produce an equivalent net amount of work.',
      },
      {
        term: 'Clausius Statement',
        definition: 'It is impossible to construct a cyclic device that transfers heat from a colder body to a hotter body without requiring external work input.',
      },
      {
        term: 'Entropy (S)',
        definition: 'A thermodynamic property measuring molecular disorder and energy degradation: dS = (dQ / T)_rev.',
      },
    ],
    workedExample: {
      title: 'Calculating Maximum Power Output of a Geothermal Power Plant',
      scenario:
        'A proposed geothermal power plant utilizes steam at 227 °C (source TH) and rejects heat to an adjacent cooling pond at 27 °C (sink TL). The heat supply rate from the geothermal well is 50 MW.',
      stepByStep: [
        'Convert both temperatures into absolute Kelvin: TH = 227 + 273.15 = 500 K; TL = 27 + 273.15 = 300 K.',
        'Calculate maximum theoretical Carnot thermal efficiency: eta_max = 1 - (TL / TH) = 1 - (300 / 500) = 1 - 0.60 = 0.40 (40%).',
        'Calculate theoretical maximum electrical/shaft power: W_max = eta_max * Q_in = 0.40 * 50 MW = 20 MW.',
        'Determine minimum heat rejected to the cooling pond: Q_out = Q_in - W_max = 50 MW - 20 MW = 30 MW.',
      ],
      takeaway:
        'Even in a frictionless, perfectly reversible world with zero losses, 60% (30 MW) of the geothermal energy must be rejected as waste heat due to Second Law constraints.',
    },
    practicalApplication:
      'Thermal power plants (coal, nuclear, combined-cycle gas turbine), automotive internal combustion engines, and aircraft turbofans all operate against Carnot ceilings. Engineers raise boiler/combustor temperatures (using ceramic thermal barrier coatings) and lower condenser temperatures to maximize thermal efficiency.',
    technicalArtifact: {
      type: 'formula',
      title: 'Carnot Efficiency & Clausius Inequality',
      content: `Carnot Thermal Efficiency:
  eta_th,max = 1 - (TL / TH)   [Note: Temperatures MUST be in Kelvin]

Clausius Inequality:
  oint (dQ / T) <= 0
  = 0 for Reversible cycles (Carnot)
  < 0 for Real Irreversible cycles

Entropy Generation (Second Law Principle):
  S_gen = Delta_S_system + Delta_S_surroundings >= 0`,
      explanation:
        'Any claim by an inventor or vendor of a heat engine achieving efficiency higher than 1 - (TL/TH) violates the Second Law of Thermodynamics.',
    },
    commonMistakes: [
      {
        mistake: 'Using Celsius instead of Kelvin in the Carnot efficiency formula.',
        whyWrong: 'Efficiency calculation depends on absolute thermodynamic temperature ratios. 1 - (27/227) gives 88%, which is completely wrong.',
        correctWay: 'Always add 273.15 to convert Celsius to Kelvin before calculating thermodynamic efficiencies.',
      },
      {
        mistake: 'Believing entropy of an open system cannot decrease.',
        whyWrong: 'A local system’s entropy can decrease (e.g. water freezing in a refrigerator) provided the entropy of the surroundings increases by a greater amount.',
        correctWay: 'The total entropy of an ISOLATED universe (system + surroundings) never decreases: Delta_S_total >= 0.',
      },
    ],
    interviewPreparation: [
      {
        question: 'Why is 100% thermal efficiency impossible for a continuous heat engine?',
        modelAnswer:
          '100% thermal efficiency requires eta = 1 - (TL/TH) = 1, which requires the cold sink temperature TL to be absolute zero (0 Kelvin). By the Third Law of Thermodynamics, absolute zero is unattainable. Furthermore, by the Kelvin-Planck statement of the Second Law, no continuous cyclic engine can convert 100% of absorbed heat into work without rejecting some heat to a lower-temperature sink. Doing so would violate the directional principle of energy conversion.',
        recruiterTips:
          'Cite both Kelvin-Planck statement and absolute zero unattainability.',
      },
      {
        question: 'How does an actual Rankine cycle differ from the ideal Carnot vapor cycle?',
        modelAnswer:
          'Although the Carnot vapor cycle has the highest theoretical efficiency, real power plants use the Rankine cycle due to practical engineering limitations: 1) Isentropic expansion inside a Carnot turbine results in high moisture content (wet steam) that erodes turbine blades. 2) Compressing a two-phase liquid-vapor mixture in a Carnot compressor is impractical and causes pump cavitation. The Rankine cycle superheats steam before the turbine and completely condenses fluid into liquid water before pumping, preventing cavitation.',
        recruiterTips:
          'Highlight practical mechanical reasons: turbine blade droplet erosion and liquid pump cavitation.',
      },
    ],
    revisionNotes: [
      'Carnot cycle = 2 reversible isotherms + 2 isentropic adiabats.',
      'eta_Carnot = 1 - (T_sink / T_source) [Kelvin].',
      'Kelvin-Planck: Heat engine cannot have 100% efficiency. Clausius: Heat does not flow spontaneously cold -> hot.',
      'Entropy dS = dQ_rev / T; For isolated systems: dS >= 0.',
    ],
    knowledgeCheck: [
      {
        question: 'What is the maximum theoretical efficiency of a heat engine operating between 600 K and 300 K?',
        options: ['25%', '50%', '75%', '100%'],
        correctIndex: 1,
        explanation: 'eta = 1 - (300 / 600) = 1 - 0.50 = 0.50 or 50%.',
      },
      {
        question: 'Which statement of the Second Law directly forbids a refrigerator that operates without work input?',
        options: ['Kelvin-Planck Statement', 'Clausius Statement', 'Boyle’s Law', 'Zeroth Law'],
        correctIndex: 1,
        explanation: 'The Clausius statement forbids transferring heat from cold to hot without external work input.',
      },
    ],
    furtherPractice: [
      'Plot the Carnot cycle on a Temperature-Entropy (T-s) diagram and show that net work equals enclosed rectangular area.',
      'Derive the Coefficient of Performance (COP) for a Carnot refrigerator operating between TL and TH.',
    ],
  },

  // 3. Computer Science: Database Indexing Mechanics
  'tech-1': {
    id: 'tech-1',
    title: 'Database Systems: B-Trees vs B+ Trees & Indexing Mechanics',
    branchCategory: 'Computer Science & Engineering',
    estimatedMinutes: 25,
    difficulty: 'Medium',
    learningObjectives: [
      'Understand how disk I/O and block paging dictate database index data structures.',
      'Compare B-Tree vs B+ Tree internal node layout and range query performance.',
      'Distinguish Clustered Indexes vs Non-Clustered (Secondary) Indexes.',
      'Analyze index selectivity, covering indexes, and write amplification overhead.',
    ],
    prerequisites: [
      'Binary Search Trees and Big-O notation',
      'Disk block paging (4KB/8KB OS page size)',
      'Basic SQL SELECT statements',
    ],
    conceptExplanation:
      'Searching an unindexed table requires a full sequential table scan (O(N) disk I/O operations), which is unviable for millions of rows. Modern relational database engines (PostgreSQL, MySQL InnoDB, Oracle) utilize B+ Trees to structure on-disk indexes.\n\nUnlike in-memory binary search trees (where each node has only 2 children), B+ Trees have a high branching factor (fan-out of 100-500+ pointers per node). This keeps tree height small (typically 3-4 levels for 100 million rows), requiring only 3-4 disk block reads. Crucially, B+ Trees store all actual record pointers or table row data exclusively in the leaf nodes, while internal nodes store only search routing keys. Leaf nodes are linked together as a doubly linked list, enabling lightning-fast O(log N + K) range scans.',
    howItWorks: [
      'High Fan-Out: Each B+ Tree node is sized to match a database page (e.g. 16 KB in InnoDB). If a key + child pointer takes 32 bytes, a single node holds 500 children. Height 3 tree indexes 500^3 = 125 million records.',
      'Routing in Internal Nodes: When executing WHERE id = 42, the engine compares 42 against sorted keys in the root page, follows the child pointer to an intermediate page, and repeats until reaching the target leaf page.',
      'Sequential Leaf Traversal: In WHERE price BETWEEN 10 AND 50, the tree searches for key=10 in O(log N) time, then simply follows the next-leaf pointers in the linked list until price > 50, avoiding any tree re-traversals.',
      'Clustered Index: In MySQL InnoDB, the primary key forms the Clustered Index, where leaf pages contain the complete row data itself. Secondary indexes store (index_column, primary_key_value), requiring a secondary lookup (bookmark lookup) to fetch non-indexed columns.',
    ],
    keyTerminology: [
      {
        term: 'Clustered Index',
        definition: 'An index that determines the physical ordering of data pages on disk. A table can have only ONE clustered index.',
      },
      {
        term: 'Covering Index',
        definition: 'An index that contains all columns requested by a SQL query in its index structure, eliminating the need to read the table data pages.',
      },
      {
        term: 'Write Amplification',
        definition: 'The overhead where every INSERT/UPDATE/DELETE requires modifying multiple index B+ Trees and triggering node splits.',
      },
      {
        term: 'Index Cardinality',
        definition: 'The number of unique values in a column. High cardinality (e.g., UUID, email) makes an index efficient; low cardinality (e.g., gender) causes query optimizers to ignore the index.',
      },
    ],
    workedExample: {
      title: 'Calculating B+ Tree Height for 10 Million User Records',
      scenario:
        'A social networking database stores 10,000,000 user rows. Page size = 16 KB. Primary key id is an 8-byte BIGINT, and child page pointer is 8 bytes. Leaf node average record size = 200 bytes.',
      stepByStep: [
        'Calculate internal node fan-out: Each entry = 8 bytes key + 8 bytes pointer = 16 bytes. Fan-out = 16,384 bytes / 16 bytes = 1,024 child pointers.',
        'Calculate leaf node capacity: 16,384 bytes / 200 bytes = ~80 records per leaf page.',
        'Level 1 (Root): 1 page = 1,024 pointers.',
        'Level 2 (Intermediate): 1,024 pages * 1,024 pointers = 1,048,576 leaf pointers.',
        'Level 3 (Leaves): 1,048,576 leaf pages * 80 records = 83,886,080 records (> 83 million rows capacity).',
        'Conclusion: A 3-level B+ Tree easily stores 10 million rows. Any individual user lookup takes at most 3 page reads.',
      ],
      takeaway:
        'Because root and intermediate pages are cached in RAM buffer pools, finding any record in 10 million rows usually takes only ONE physical disk I/O read!',
    },
    practicalApplication:
      'Used by PostgreSQL (B-Tree indexes), MySQL InnoDB (Clustered primary keys), SQLite, MongoDB wiredTiger, and file systems (NTFS, ext4). Essential for keeping database response times under 5 milliseconds on high-traffic web applications.',
    technicalArtifact: {
      type: 'code',
      title: 'SQL Covering Index Demonstration',
      content: `-- Slow Query: Requires Secondary Index Lookup + Table Page Bookmark Lookup
CREATE INDEX idx_users_city ON users(city);
SELECT id, email, created_at FROM users WHERE city = 'Bangalore';

-- Fast Query: Covering Index (Index-Only Scan)
CREATE INDEX idx_users_city_covered ON users(city, email, created_at);
-- Database satisfies the query entirely from the B+ Tree index without reading base table pages!
EXPLAIN ANALYZE SELECT id, email, created_at FROM users WHERE city = 'Bangalore';`,
      explanation:
        'When EXPLAIN ANALYZE shows "Index Only Scan", query execution skips all disk reads from the actual table heap.',
    },
    commonMistakes: [
      {
        mistake: 'Putting indexes on every single column in a table.',
        whyWrong: 'Every index slows down INSERT, UPDATE, and DELETE operations dramatically due to B+ tree node splits, and wastes memory in the buffer pool.',
        correctWay: 'Only index columns heavily filtered in WHERE clauses, JOIN conditions, or ORDER BY statements.',
      },
      {
        mistake: 'Using functions on indexed columns in queries: WHERE YEAR(created_at) = 2025.',
        whyWrong: 'Applying a function prevents the database from using the B+ Tree range ordering, forcing a full table scan.',
        correctWay: 'Use sargable range queries: WHERE created_at >= "2025-01-01" AND created_at < "2026-01-01".',
      },
    ],
    interviewPreparation: [
      {
        question: 'Why do relational databases use B+ Trees instead of Hash Tables or Binary Search Trees for indexes?',
        modelAnswer:
          'Hash tables provide O(1) equality lookups, but cannot perform range scans (e.g. BETWEEN, >, <, ORDER BY) because hash functions scramble sorted order. Binary search trees (BSTs, Red-Black trees) have a low branching factor of 2, creating tall trees with O(log2 N) height, resulting in 25-30 sequential disk I/O reads. B+ Trees combine high fan-out (100-500+ pointers per page) to keep tree height at 3-4 levels, with linked leaf pages that make sequential range scans O(log N + K) without re-traversing the tree.',
        recruiterTips:
          'Emphasize range queries and disk block I/O minimization.',
      },
      {
        question: 'What is a Clustered Index and why can a table have only one?',
        modelAnswer:
          'A clustered index dictates the physical sorting order of rows on disk. The leaf nodes of a clustered index contain the actual data rows rather than pointers. Because physical rows on disk can only be stored in one sorted order, a table can only have one clustered index. All other indexes are secondary (non-clustered) indexes, which store the indexed key along with a pointer (or primary key) back to the clustered index record.',
        recruiterTips:
          'Explain the bookmark lookup cost of secondary indexes.',
      },
    ],
    revisionNotes: [
      'B+ Tree leaves hold all data; internal nodes hold only routing keys.',
      'Leaf nodes are linked in a doubly linked list for fast range queries.',
      'High fan-out (500+) keeps tree depth to 3-4 levels for millions of records.',
      'Clustered index = physical table ordering (1 per table). Secondary index = points to clustered key.',
      'Index-Only Scan occurs when all queried columns exist inside the index.',
    ],
    knowledgeCheck: [
      {
        question: 'Why are B+ Trees preferred over B-Trees for database indexing?',
        options: [
          'B+ Trees are simpler to implement in Python',
          'B+ Tree leaf nodes are linked sequentially and internal nodes hold no data, maximizing fan-out and range scan speed',
          'B-Trees cannot store strings',
          'B+ Trees use half the disk space of B-Trees',
        ],
        correctIndex: 1,
        explanation:
          'By storing data exclusively in leaves, internal nodes hold more routing pointers per 16KB page, decreasing tree height while the linked leaf list enables rapid range scanning.',
      },
      {
        question: 'What does a database query optimizer do when you write WHERE UPPER(email) = "USER@EXAMPLE.COM" on an indexed email column?',
        options: [
          'It uses the B+ Tree index with no performance penalty',
          'It fails with a syntax error',
          'It is forced to perform a full table scan because the function prevents index traversal',
          'It converts the table into a hash table in memory',
        ],
        correctIndex: 2,
        explanation:
          'Wrapping an indexed column in a function makes the query non-sargable, preventing the B+ Tree from binary searching the index.',
      },
    ],
    furtherPractice: [
      'Analyze an EXPLAIN output in PostgreSQL or MySQL and identify Index Scan vs Index Only Scan vs Seq Scan.',
      'Implement B+ Tree node split logic in C++ or Java when a leaf node reaches maximum capacity.',
    ],
  },
};

export const getDetailedStudyModule = (topicId: string, branch?: string): DetailedStudyModule => {
  if (STUDY_MODULES[topicId]) {
    return STUDY_MODULES[topicId];
  }

  // Branch-aware fallback matching
  const b = branch?.toLowerCase() || '';
  if (b.includes('mechanical')) {
    return STUDY_MODULES['mech-1'];
  } else if (b.includes('electronic') || b.includes('electrical')) {
    return STUDY_MODULES['ece-1'];
  }

  return STUDY_MODULES['tech-1'];
};
