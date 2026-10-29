import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDatabase } from './db';
import { User } from './models/User';
import { UserProgress } from './models/UserProgress';
import { RoleCatalogue } from './models/RoleCatalogue';
import { LearningModule } from './models/LearningModule';
import { Question } from './models/Question';
import { generateQuestionBank, SUBJECT_DEFINITIONS } from './questionGenerator';
import { ADDITIONAL_STUDY_MODULES } from './cseStudyModules';

dotenv.config();

// 26+ Career Roles Catalogue mapped to branches and skills
const CAREER_ROLES = [
  {
    roleId: 'software-developer',
    title: 'Software Developer',
    category: 'Software Engineering',
    branches: ['Computer Science and Engineering', 'Information Science and Engineering', 'AI/ML', 'Data Science'],
    overview: 'Designs, develops, tests, and maintains scalable software applications and services across diverse platforms.',
    requiredSkills: ['Data Structures & Algorithms', 'Object-Oriented Design', 'Git & Version Control', 'Unit Testing & CI/CD', 'Problem Solving'],
    coreConcepts: ['Time & Space Complexity', 'Memory Management', 'Design Patterns (Factory, Singleton, Observer)', 'System Architecture'],
    prerequisites: ['Proficiency in at least one language: Java, C++, Python, or C#', 'Basic OS and networking foundations'],
    learningRoadmap: [
      { phase: 'Phase 1', title: 'Data Structures & Algorithms Mastery', duration: '4 Weeks', topics: ['Arrays & Hash Maps', 'Trees & Graphs', 'Dynamic Programming'] },
      { phase: 'Phase 2', title: 'OOP & System Architecture', duration: '3 Weeks', topics: ['SOLID Principles', 'Design Patterns', 'UML Diagrams'] },
      { phase: 'Phase 3', title: 'Testing & Build Automation', duration: '2 Weeks', topics: ['JUnit / PyTest', 'Docker Containerization', 'Git Workflows'] },
    ],
    technicalInterviewQuestions: [
      { question: 'Explain the difference between composition and inheritance, and when to prefer one over the other.', answerGuidance: 'Prefer composition for flexibility without tight coupling ("has-a" vs "is-a").', keywords: ['Composition', 'Inheritance', 'Coupling', 'Polymorphism'] },
      { question: 'How would you detect and resolve a memory leak in a production application?', answerGuidance: 'Discuss heap profilers, GC root analysis, unclosed streams, and static reference accumulation.', keywords: ['Memory Profiler', 'Heap Dump', 'Garbage Collector', 'Resource Leak'] },
    ],
    behavioralInterviewQuestions: [
      { question: 'Describe a project where requirements shifted midway and how you adapted.', starFocus: 'Agility, communication with stakeholders, and test-driven refactoring.' },
      { question: 'Tell me about a time you had to optimize slow or inefficient legacy code.', starFocus: 'Benchmarking before optimizing, algorithmic reduction, and risk mitigation.' },
    ],
    exampleProjects: [
      { title: 'Distributed Task Scheduling Engine', stack: 'Go / Python, Redis, Docker', description: 'Engineered a distributed priority queue processing 10k asynchronous tasks per minute with fault recovery.' },
      { title: 'Multi-Tenant Microservices Gateway', stack: 'Node.js, Express, JWT, Redis', description: 'Implemented rate-limiting, JWT authentication, and circuit breaking for 5 backend services.' },
    ],
    resumeGuidance: {
      keywords: ['Distributed Systems', 'Algorithmic Optimization', 'CI/CD Pipelines', 'Object-Oriented Programming', 'REST APIs'],
      actionVerbs: ['Architected', 'Engineered', 'Optimized', 'Refactored', 'Spearheaded'],
      keyBulletExamples: [
        'Architected RESTful microservices reducing request latency by 32% under simulated peak loads.',
        'Authored 120+ unit and integration test suites achieving 94% test coverage on billing transactions.',
      ],
    },
    assessmentCriteria: [
      { metric: 'Algorithmic Fluency', targetScore: 85, description: 'Ability to solve medium LeetCode-style problems within 25 minutes.' },
      { metric: 'Code Cleanliness', targetScore: 80, description: 'Readable, modular code following SOLID guidelines.' },
    ],
  },
  {
    roleId: 'frontend-developer',
    title: 'Frontend Developer',
    category: 'Web Development',
    branches: ['Computer Science and Engineering', 'Information Science and Engineering'],
    overview: 'Builds responsive, high-performance, accessible, and delightful user interfaces for modern web applications.',
    requiredSkills: ['JavaScript / TypeScript', 'React / Next.js', 'CSS Architecture & Tailwind', 'Browser Performance & Rendering', 'Web Accessibility (a11y)'],
    coreConcepts: ['Virtual DOM & Reconciliation', 'State Management', 'Critical Rendering Path', 'Responsive Layouts & Flexbox/Grid'],
    prerequisites: ['HTML5, CSS3, ES6+ JavaScript'],
    learningRoadmap: [
      { phase: 'Phase 1', title: 'Advanced Modern JavaScript & DOM', duration: '3 Weeks', topics: ['Event Loop & Promises', 'Closures & Scope', 'DOM Optimization'] },
      { phase: 'Phase 2', title: 'React Ecosystem & State', duration: '4 Weeks', topics: ['Hooks Lifecycle', 'Context API & Zustand', 'Performance Profiling'] },
      { phase: 'Phase 3', title: 'Styling, Accessibility & Tooling', duration: '3 Weeks', topics: ['Tailwind CSS', 'WCAG Standards', 'Vite & Webpack'] },
    ],
    technicalInterviewQuestions: [
      { question: 'Explain how the browser critical rendering path works and how you minimize reflow and repaint.', answerGuidance: 'Discuss DOM, CSSOM, Render Tree, Layout, Paint, and composite layers with transform/opacity.', keywords: ['Critical Rendering Path', 'Reflow', 'Repaint', 'CSSOM'] },
    ],
    behavioralInterviewQuestions: [
      { question: 'Tell me about a time you collaborated with designers to translate complex Figma specs into code.', starFocus: 'Attention to detail, design tokens, and edge case handling for responsiveness.' },
    ],
    exampleProjects: [
      { title: 'Interactive Analytics Dashboard', stack: 'React, TypeScript, Tailwind, Chart.js', description: 'Built dynamic data visualization dashboard handling 10k real-time streaming data points.' },
    ],
    resumeGuidance: {
      keywords: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux', 'Web Vitals'],
      actionVerbs: ['Engineered', 'Designed', 'Enhanced', 'Crafted', 'Streamlined'],
      keyBulletExamples: [
        'Engineered responsive frontend modules improving Largest Contentful Paint (LCP) by 40%.',
      ],
    },
    assessmentCriteria: [
      { metric: 'Component Architecture', targetScore: 85, description: 'Clean decoupling of UI components from business logic.' },
    ],
  },
  {
    roleId: 'backend-developer',
    title: 'Backend Developer',
    category: 'Software Engineering',
    branches: ['Computer Science and Engineering', 'Information Science and Engineering'],
    overview: 'Engineers server-side architectures, API layers, databases, caching layers, and high-availability messaging backbones.',
    requiredSkills: ['Node.js / Python / Java / Go', 'SQL & NoSQL Databases', 'REST & GraphQL APIs', 'Caching with Redis', 'System Design & Scalability'],
    coreConcepts: ['ACID Transactions', 'Database Indexing', 'CAP Theorem', 'Microservices vs Monolith', 'Asynchronous Queues'],
    prerequisites: ['Solid fundamentals in data structures, networking, and relational databases'],
    learningRoadmap: [
      { phase: 'Phase 1', title: 'API Design & Security', duration: '3 Weeks', topics: ['RESTful Standards', 'JWT & OAuth2', 'Input Validation & Rate Limiting'] },
      { phase: 'Phase 2', title: 'Database Optimization', duration: '4 Weeks', topics: ['Indexing & B-Trees', 'Query Optimization', 'Sharding & Replication'] },
      { phase: 'Phase 3', title: 'Distributed Systems', duration: '4 Weeks', topics: ['Message Brokers (Kafka/RabbitMQ)', 'Caching Strategies', 'Microservices'] },
    ],
    technicalInterviewQuestions: [
      { question: 'How do you handle race conditions when updating account balances in a high-concurrency database?', answerGuidance: 'Explain pessimistic locking (SELECT FOR UPDATE) vs optimistic locking with versioning.', keywords: ['Pessimistic Locking', 'Optimistic Locking', 'ACID', 'Transactions'] },
    ],
    behavioralInterviewQuestions: [
      { question: 'Describe how you diagnosed and resolved an unexpected production database spike.', starFocus: 'Slow query logs, index creation, connection pool exhaustion analysis.' },
    ],
    exampleProjects: [
      { title: 'Scalable E-Commerce Order API', stack: 'Node.js, PostgreSQL, Redis, Docker', description: 'Handles 5k concurrent checkout transactions with distributed locking and idempotent webhooks.' },
    ],
    resumeGuidance: {
      keywords: ['REST APIs', 'PostgreSQL', 'Redis', 'Docker', 'Microservices', 'Distributed Systems'],
      actionVerbs: ['Architected', 'Implemented', 'Scaled', 'Secured', 'Optimized'],
      keyBulletExamples: [
        'Implemented distributed redis caching reducing database read load by 65%.',
      ],
    },
    assessmentCriteria: [
      { metric: 'Database Mastery', targetScore: 85, description: 'Complex SQL queries, indexing, and schema normalization.' },
    ],
  },
  {
    roleId: 'fullstack-developer',
    title: 'Full-Stack Developer',
    category: 'Software Engineering',
    branches: ['Computer Science and Engineering', 'Information Science and Engineering', 'AI/ML'],
    overview: 'Owns end-to-end features spanning client web interfaces, REST/GraphQL APIs, background workers, and database storage.',
    requiredSkills: ['Frontend (React / Vue)', 'Backend (Node / Python / Java)', 'Database Systems', 'DevOps & Infrastructure Basics', 'System Integration'],
    coreConcepts: ['Client-Server Lifecycle', 'API Contract Design', 'End-to-End Authentication', 'Performance Bottlenecks'],
    prerequisites: ['Web programming and database fundamentals'],
    learningRoadmap: [
      { phase: 'Phase 1', title: 'Frontend Fluency', duration: '4 Weeks', topics: ['Component Architecture', 'State Management', 'CSS & Responsive Design'] },
      { phase: 'Phase 2', title: 'Backend Mastery', duration: '4 Weeks', topics: ['API Architecture', 'Database Management', 'Authentication & Auth'] },
      { phase: 'Phase 3', title: 'Fullstack Deployment', duration: '2 Weeks', topics: ['Docker', 'CI/CD Pipelines', 'Production Deployment'] },
    ],
    technicalInterviewQuestions: [
      { question: 'Walk me through what happens from typing a URL into the browser until the page renders completely.', answerGuidance: 'Cover DNS resolution, TCP handshake, TLS negotiation, HTTP request/response, and browser rendering.', keywords: ['DNS', 'TCP 3-Way Handshake', 'TLS', 'DOM/CSSOM', 'Rendering'] },
    ],
    behavioralInterviewQuestions: [
      { question: 'How do you balance rapid feature delivery with code quality when building an end-to-end MVP?', starFocus: 'Pragmatic technical debt, automated testing, and modular separation.' },
    ],
    exampleProjects: [
      { title: 'Collaborative Workspace Platform', stack: 'React, Node.js, WebSockets, MongoDB', description: 'Real-time collaborative kanban board with live cursor synchronization and presence detection.' },
    ],
    resumeGuidance: {
      keywords: ['Full-Stack', 'MERN / PERN', 'REST APIs', 'WebSockets', 'PostgreSQL', 'Docker'],
      actionVerbs: ['Engineered', 'Delivered', 'Deployed', 'Constructed', 'Integrated'],
      keyBulletExamples: [
        'Delivered full-stack collaborative platform serving 2,500 active campus student users.',
      ],
    },
    assessmentCriteria: [
      { metric: 'End-to-End Delivery', targetScore: 85, description: 'Seamless data flow from database to frontend UI.' },
    ],
  },
  {
    roleId: 'data-analyst',
    title: 'Data Analyst',
    category: 'Data & Analytics',
    branches: ['Data Science', 'Computer Science and Engineering', 'Information Science and Engineering'],
    overview: 'Extracts, cleans, analyzes, and visualizes complex datasets to drive actionable business and product decisions.',
    requiredSkills: ['SQL & Relational Databases', 'Python / R (Pandas, NumPy)', 'Data Visualization (Tableau, PowerBI)', 'Statistical Analysis', 'A/B Testing'],
    coreConcepts: ['Data Wrangling & Imputation', 'Descriptive & Inferential Statistics', 'Hypothesis Testing', 'Cohort Analysis'],
    prerequisites: ['Basic probability and statistics, SQL fundamentals'],
    learningRoadmap: [
      { phase: 'Phase 1', title: 'SQL & Database Querying', duration: '3 Weeks', topics: ['Window Functions', 'Complex Joins', 'Aggregations'] },
      { phase: 'Phase 2', title: 'Python for Data Analysis', duration: '4 Weeks', topics: ['Pandas DataFrames', 'NumPy Arrays', 'Matplotlib & Seaborn'] },
      { phase: 'Phase 3', title: 'Applied Business Analytics', duration: '3 Weeks', topics: ['A/B Testing Frameworks', 'Dashboard Creation', 'Storytelling'] },
    ],
    technicalInterviewQuestions: [
      { question: 'Explain the difference between WHERE and HAVING in SQL with a practical aggregation example.', answerGuidance: 'WHERE filters rows before aggregation; HAVING filters groups after GROUP BY.', keywords: ['WHERE', 'HAVING', 'GROUP BY', 'Aggregation'] },
    ],
    behavioralInterviewQuestions: [
      { question: 'Tell me about a time your data insights challenged the team’s initial assumptions.', starFocus: 'Objective statistical evidence, clear visualizations, and empathetic stakeholder communication.' },
    ],
    exampleProjects: [
      { title: 'Campus Placement Trends Analyzer', stack: 'Python, Pandas, Streamlit, PostgreSQL', description: 'Analyzed 5 years of historical placement offers, uncovering correlation between DSA practice and package LPA.' },
    ],
    resumeGuidance: {
      keywords: ['SQL', 'Python (Pandas)', 'PowerBI', 'Tableau', 'Statistical Modeling', 'Hypothesis Testing'],
      actionVerbs: ['Analyzed', 'Uncovered', 'Visualized', 'Synthesized', 'Modelled'],
      keyBulletExamples: [
        'Synthesized 100k+ user transaction logs using SQL window functions to discover 18% retention drop-off.',
      ],
    },
    assessmentCriteria: [
      { metric: 'SQL Fluency', targetScore: 90, description: 'Speed and accuracy on window functions, self-joins, and aggregations.' },
    ],
  },
  {
    roleId: 'data-scientist',
    title: 'Data Scientist',
    category: 'Data & Analytics',
    branches: ['Data Science', 'Artificial Intelligence and Machine Learning', 'Computer Science and Engineering'],
    overview: 'Builds predictive statistical models, machine learning systems, and experimental pipelines to solve complex business questions.',
    requiredSkills: ['Python / R', 'Machine Learning (Scikit-Learn)', 'Probability & Linear Algebra', 'Feature Engineering', 'Experimental Design'],
    coreConcepts: ['Bias-Variance Tradeoff', 'Supervised & Unsupervised Learning', 'Cross-Validation Strategies', 'Model Explainability (SHAP)'],
    prerequisites: ['Multivariable calculus, linear algebra, probability, Python'],
    learningRoadmap: [
      { phase: 'Phase 1', title: 'Mathematical Foundations', duration: '4 Weeks', topics: ['Matrix Decompositions', 'Probability Distributions', 'Gradient Descent'] },
      { phase: 'Phase 2', title: 'Machine Learning Algorithms', duration: '4 Weeks', topics: ['Tree Ensembles (XGBoost)', 'SVM & Logistic Regression', 'Clustering'] },
      { phase: 'Phase 3', title: 'Production ML Pipelines', duration: '3 Weeks', topics: ['Feature Stores', 'Model Deployment (Flask/FastAPI)', 'Drift Monitoring'] },
    ],
    technicalInterviewQuestions: [
      { question: 'How do you address the bias-variance tradeoff when your model is severely overfitting?', answerGuidance: 'Discuss regularization (L1/L2), pruning decision trees, reducing features, and getting more data.', keywords: ['Overfitting', 'Regularization', 'Cross-Validation', 'Variance'] },
    ],
    behavioralInterviewQuestions: [
      { question: 'Describe how you communicate complex statistical models to non-technical stakeholders.', starFocus: 'Framing results in terms of ROI, business metrics, and intuitive visual aids.' },
    ],
    exampleProjects: [
      { title: 'Student Placement Success Predictor', stack: 'Python, Scikit-Learn, XGBoost, SHAP', description: 'Trained ensemble gradient boosting model achieving 88% AUC-ROC in predicting placement readiness.' },
    ],
    resumeGuidance: {
      keywords: ['Machine Learning', 'Scikit-Learn', 'Feature Engineering', 'XGBoost', 'Statistical Inference'],
      actionVerbs: ['Formulated', 'Developed', 'Predicted', 'Trained', 'Validated'],
      keyBulletExamples: [
        'Developed predictive churn model with XGBoost achieving 0.89 AUC-ROC, outperforming baseline by 14%.',
      ],
    },
    assessmentCriteria: [
      { metric: 'Statistical Rigor', targetScore: 85, description: 'Correct application of hypotheses tests and cross-validation.' },
    ],
  },
  {
    roleId: 'machine-learning-engineer',
    title: 'Machine Learning Engineer',
    category: 'Artificial Intelligence & ML',
    branches: ['Artificial Intelligence and Machine Learning', 'Data Science', 'Computer Science and Engineering'],
    overview: 'Takes ML and deep learning models from prototype research into highly scalable, low-latency production serving pipelines.',
    requiredSkills: ['PyTorch / TensorFlow', 'MLOps & Pipeline Tools (MLflow, Kubeflow)', 'Docker & Kubernetes', 'C++ / Python for Inference', 'Model Quantization (ONNX, TensorRT)'],
    coreConcepts: ['Distributed Training', 'Latency vs Accuracy Optimization', 'Feature Pipelines', 'Continuous Training & Drift'],
    prerequisites: ['Deep learning foundations, systems programming, linear algebra'],
    learningRoadmap: [
      { phase: 'Phase 1', title: 'Deep Learning Architectures', duration: '4 Weeks', topics: ['CNNs & Transformers', 'Backpropagation Math', 'Loss Landscapes'] },
      { phase: 'Phase 2', title: 'Model Optimization & Serving', duration: '4 Weeks', topics: ['Quantization & Pruning', 'TensorRT & ONNX', 'FastAPI Serving'] },
      { phase: 'Phase 3', title: 'MLOps & Infrastructure', duration: '3 Weeks', topics: ['Docker Containers', 'CI/CD for ML', 'Model Registry & Tracking'] },
    ],
    technicalInterviewQuestions: [
      { question: 'How does self-attention in a Transformer architecture scale in memory and time complexity with sequence length N?', answerGuidance: 'O(N^2) complexity because every token attends to every other token in the QK^T matrix multiplication.', keywords: ['Self-Attention', 'Transformer', 'O(N^2)', 'QK^T Matrix'] },
    ],
    behavioralInterviewQuestions: [
      { question: 'Tell me about an instance where an ML model performed well in validation but failed in live testing.', starFocus: 'Data distribution shift, latency SLA breaches, and data leakage identification.' },
    ],
    exampleProjects: [
      { title: 'Real-Time Edge Audio Classifier', stack: 'PyTorch, ONNX Runtime, C++, Docker', description: 'Quantized audio spectrogram CNN to INT8, achieving 8ms inference latency on edge devices.' },
    ],
    resumeGuidance: {
      keywords: ['PyTorch', 'MLOps', 'Transformers', 'Docker', 'ONNX Runtime', 'TensorRT'],
      actionVerbs: ['Deployed', 'Optimized', 'Trained', 'Containerized', 'Scaled'],
      keyBulletExamples: [
        'Containerized and deployed transformer models on Kubernetes handling 400 requests/sec with <50ms P99 latency.',
      ],
    },
    assessmentCriteria: [
      { metric: 'ML Systems Architecture', targetScore: 85, description: 'Ability to design production training and inference pipelines.' },
    ],
  },
  {
    roleId: 'ai-engineer',
    title: 'AI Engineer',
    category: 'Artificial Intelligence & ML',
    branches: ['Artificial Intelligence and Machine Learning', 'Computer Science and Engineering'],
    overview: 'Specializes in integrating generative AI, Large Language Models (LLMs), vector embeddings, and RAG pipelines into products.',
    requiredSkills: ['Prompt Engineering & Evaluation', 'Vector Databases (Chroma, Pinecone)', 'LangChain / LlamaIndex', 'Fine-Tuning Techniques (LoRA)', 'Python & API Integration'],
    coreConcepts: ['Retrieval-Augmented Generation (RAG)', 'Context Window Limitations', 'Embedding Space & Cosine Similarity', 'Agentic Workflows'],
    prerequisites: ['Python proficiency, basic NLP principles, REST APIs'],
    learningRoadmap: [
      { phase: 'Phase 1', title: 'Vector Embeddings & Semantic Search', duration: '3 Weeks', topics: ['Embedding Models', 'Vector Indexing (HNSW)', 'Cosine Similarity'] },
      { phase: 'Phase 2', title: 'RAG Pipeline Engineering', duration: '4 Weeks', topics: ['Chunking Strategies', 'Hybrid Search', 'Reranking & Evaluation'] },
      { phase: 'Phase 3', title: 'Agentic Systems & Tool Calling', duration: '3 Weeks', topics: ['Function Calling', 'Multi-Agent Frameworks', 'Guardrails & Safety'] },
    ],
    technicalInterviewQuestions: [
      { question: 'What strategies do you employ to prevent hallucinations in RAG applications?', answerGuidance: 'Top-k reranking, strict prompt system constraints, temperature=0, and source attribution verification.', keywords: ['RAG', 'Hallucination', 'Reranking', 'Source Grounding'] },
    ],
    behavioralInterviewQuestions: [
      { question: 'Describe how you navigated latency and cost constraints when building an AI feature.', starFocus: 'Model tiering (flash vs pro), semantic caching, and streaming responses.' },
    ],
    exampleProjects: [
      { title: 'Domain-Specific Engineering Tutor with RAG', stack: 'Python, FastAPI, ChromaDB, LangChain', description: 'Constructed enterprise RAG system indexing 50 engineering textbooks with sub-second citation retrieval.' },
    ],
    resumeGuidance: {
      keywords: ['Generative AI', 'RAG Pipelines', 'Vector Databases', 'Prompt Engineering', 'LangChain'],
      actionVerbs: ['Architected', 'Engineered', 'Integrated', 'Automated', 'Fine-Tuned'],
      keyBulletExamples: [
        'Engineered enterprise RAG pipeline indexing 40,000 technical PDF pages with 92% retrieval accuracy.',
      ],
    },
    assessmentCriteria: [
      { metric: 'RAG Architecture', targetScore: 85, description: 'Proficiency with chunking, embedding models, and hybrid retrieval.' },
    ],
  },
  {
    roleId: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    category: 'Security & Infrastructure',
    branches: ['Information Science and Engineering', 'Computer Science and Engineering'],
    overview: 'Monitors, detects, investigates, and defends computing environments, networks, and applications against security threats.',
    requiredSkills: ['Network Security & Wireshark', 'SIEM & Threat Detection (Splunk)', 'OWASP Top 10 Vulnerabilities', 'Penetration Testing Tools', 'Incident Response'],
    coreConcepts: ['Defense in Depth', 'Cryptography & Public Key Infrastructure', 'Authentication Protocols', 'Zero Trust Architecture'],
    prerequisites: ['Networking fundamentals, OS security principles, Linux CLI'],
    learningRoadmap: [
      { phase: 'Phase 1', title: 'Network Defense & Packet Analysis', duration: '4 Weeks', topics: ['Wireshark', 'TCP/IP Vulnerabilities', 'Firewalls & IDS/IPS'] },
      { phase: 'Phase 2', title: 'Application Security (AppSec)', duration: '4 Weeks', topics: ['OWASP Top 10', 'SQLi & XSS', 'Secure Code Review'] },
      { phase: 'Phase 3', title: 'SIEM & Incident Handling', duration: '3 Weeks', topics: ['Log Analysis', 'Threat Hunting', 'Incident Playbooks'] },
    ],
    technicalInterviewQuestions: [
      { question: 'Explain how Cross-Site Scripting (XSS) occurs and the primary defenses against it.', answerGuidance: 'Reflected vs Stored vs DOM XSS. Defend with contextual output encoding, CSP, and input sanitization.', keywords: ['XSS', 'Content Security Policy (CSP)', 'Output Encoding', 'Sanitization'] },
    ],
    behavioralInterviewQuestions: [
      { question: 'Tell me about how you handled a simulated or real security incident under time pressure.', starFocus: 'Immediate containment, chain of custody, systematic eradication, and post-mortem.' },
    ],
    exampleProjects: [
      { title: 'Automated Vulnerability Scanner', stack: 'Python, Nmap, Scapy, Docker', description: 'Scripted automated network auditing tool detecting outdated SSH ciphers and open vulnerable ports.' },
    ],
    resumeGuidance: {
      keywords: ['OWASP Top 10', 'SIEM', 'Network Security', 'Penetration Testing', 'Incident Response'],
      actionVerbs: ['Defended', 'Audited', 'Investigated', 'Mitigated', 'Hardened'],
      keyBulletExamples: [
        'Audited internal web applications against OWASP Top 10, remediating 14 high-severity injection vulnerabilities.',
      ],
    },
    assessmentCriteria: [
      { metric: 'Threat Identification', targetScore: 85, description: 'Ability to identify protocol weaknesses and attack vectors.' },
    ],
  },
  {
    roleId: 'cloud-engineer',
    title: 'Cloud Engineer',
    category: 'Cloud & DevOps',
    branches: ['Computer Science and Engineering', 'Information Science and Engineering'],
    overview: 'Designs, implements, and maintains robust, secure, and cost-efficient cloud infrastructure on AWS, Azure, or GCP.',
    requiredSkills: ['AWS / GCP / Azure Core Services', 'Infrastructure as Code (Terraform)', 'Virtual Networks & VPCs', 'Linux Administration', 'Cloud Security & IAM'],
    coreConcepts: ['High Availability & Fault Tolerance', 'Load Balancing & Auto-Scaling', 'Serverless Architecture', 'Cost Optimization'],
    prerequisites: ['Linux fundamentals, networking basics (DNS, subnets, routing)'],
    learningRoadmap: [
      { phase: 'Phase 1', title: 'Compute & Storage Services', duration: '3 Weeks', topics: ['EC2 / VMs', 'S3 / Object Storage', 'IAM Roles & Policies'] },
      { phase: 'Phase 2', title: 'Virtual Networking (VPC)', duration: '4 Weeks', topics: ['Subnetting', 'Route Tables & NAT Gateways', 'Security Groups'] },
      { phase: 'Phase 3', title: 'Infrastructure as Code (IaC)', duration: '3 Weeks', topics: ['Terraform Modules', 'State Management', 'CloudFormation'] },
    ],
    technicalInterviewQuestions: [
      { question: 'What is the architectural difference between a Public Subnet and a Private Subnet in a cloud VPC?', answerGuidance: 'A public subnet has a route to an Internet Gateway (IGW); a private subnet routes outbound via a NAT Gateway.', keywords: ['VPC', 'Internet Gateway', 'NAT Gateway', 'Route Table'] },
    ],
    behavioralInterviewQuestions: [
      { question: 'Describe how you resolved a cloud cost overrun or architectural bottleneck.', starFocus: 'Resource right-sizing, reserved instances, lifecycle policies, and auto-scaling rules.' },
    ],
    exampleProjects: [
      { title: 'Automated Multi-Tier Cloud VPC', stack: 'Terraform, AWS (VPC, EC2, ALB, RDS)', description: 'Defined modular Infrastructure-as-Code deploying secure highly-available 3-tier web architecture.' },
    ],
    resumeGuidance: {
      keywords: ['AWS', 'Terraform', 'VPC', 'Docker', 'IAM', 'Auto-Scaling'],
      actionVerbs: ['Provisioned', 'Architected', 'Automated', 'Migrated', 'Configured'],
      keyBulletExamples: [
        'Provisioned multi-region AWS cloud infrastructure using Terraform, eliminating manual server configuration.',
      ],
    },
    assessmentCriteria: [
      { metric: 'IaC & Networking', targetScore: 85, description: 'Proficiency in Terraform declarations and secure VPC topologies.' },
    ],
  },
  {
    roleId: 'devops-engineer',
    title: 'DevOps Engineer',
    category: 'Cloud & DevOps',
    branches: ['Computer Science and Engineering', 'Information Science and Engineering'],
    overview: 'Bridges development and IT operations by automating build, testing, deployment, and monitoring pipelines.',
    requiredSkills: ['CI/CD (GitHub Actions, Jenkins)', 'Docker & Container Orchestration (Kubernetes)', 'Infrastructure as Code', 'Observability (Prometheus, Grafana)', 'Bash & Python Scripting'],
    coreConcepts: ['GitOps & Continuous Delivery', 'Immutability & Declarative Config', 'Site Reliability Engineering (SRE)', 'Zero-Downtime Deployments (Blue/Green, Canary)'],
    prerequisites: ['Linux systems administration, Git, container basics'],
    learningRoadmap: [
      { phase: 'Phase 1', title: 'Containerization & Docker', duration: '3 Weeks', topics: ['Dockerfile Optimization', 'Multi-stage Builds', 'Docker Compose'] },
      { phase: 'Phase 2', title: 'CI/CD Automation', duration: '3 Weeks', topics: ['GitHub Actions Workflows', 'Automated Testing', 'Artifact Packaging'] },
      { phase: 'Phase 3', title: 'Kubernetes & Observability', duration: '4 Weeks', topics: ['Pods, Deployments, Services', 'Prometheus & Grafana', 'Helm Charts'] },
    ],
    technicalInterviewQuestions: [
      { question: 'Explain the difference between Blue-Green deployment and Canary deployment.', answerGuidance: 'Blue-Green swaps 100% traffic between two identical environments. Canary routes a small percentage (e.g., 5%) to the new version first.', keywords: ['Blue-Green', 'Canary', 'Zero Downtime', 'Rollback'] },
    ],
    behavioralInterviewQuestions: [
      { question: 'How do you handle a scenario where a deployment breaks production during business hours?', starFocus: 'Immediate automated rollback, communication channel updates, root cause analysis, and post-mortem.' },
    ],
    exampleProjects: [
      { title: 'Zero-Downtime GitOps Pipeline', stack: 'GitHub Actions, Docker, Kubernetes, Helm', description: 'Engineered automated pipeline building, testing, and deploying microservices to K8s cluster on every git tag.' },
    ],
    resumeGuidance: {
      keywords: ['Kubernetes', 'Docker', 'CI/CD Pipelines', 'GitHub Actions', 'Prometheus', 'Grafana'],
      actionVerbs: ['Automated', 'Streamlined', 'Containerized', 'Orchestrated', 'Maintained'],
      keyBulletExamples: [
        'Automated CI/CD deployment pipelines cutting software release turnaround times from 3 hours to 8 minutes.',
      ],
    },
    assessmentCriteria: [
      { metric: 'Pipeline Automation', targetScore: 85, description: 'Ability to construct robust, self-healing deployment workflows.' },
    ],
  },
  {
    roleId: 'embedded-systems-engineer',
    title: 'Embedded Systems Engineer',
    category: 'Hardware & Electronics',
    branches: ['Electronics and Communication Engineering', 'Electrical and Electronics Engineering', 'Computer Science and Engineering'],
    overview: 'Develops low-level firmware and hardware drivers running directly on resource-constrained microcontrollers and SoCs.',
    requiredSkills: ['Embedded C / C++', 'Microcontrollers (ARM Cortex-M, ESP32, STM32)', 'Hardware Protocols (UART, SPI, I2C, CAN)', 'Oscilloscopes & Logic Analyzers', 'RTOS (FreeRTOS)'],
    coreConcepts: ['Interrupt Service Routines (ISRs)', 'Memory-Mapped I/O', 'Direct Memory Access (DMA)', 'Power Management & Sleep Modes'],
    prerequisites: ['Digital logic, C programming (pointers, bitwise ops), basic circuit analysis'],
    learningRoadmap: [
      { phase: 'Phase 1', title: 'Bare-Metal C & Register Programming', duration: '4 Weeks', topics: ['Bit Manipulation', 'GPIO & Timers', 'Memory-Mapped Peripherals'] },
      { phase: 'Phase 2', title: 'Serial Communication Drivers', duration: '4 Weeks', topics: ['UART Driver', 'SPI & I2C Bus Masters', 'Ring Buffers'] },
      { phase: 'Phase 3', title: 'Real-Time Operating Systems (RTOS)', duration: '3 Weeks', topics: ['Task Scheduling', 'Queues & Semaphores', 'Priority Inversion'] },
    ],
    technicalInterviewQuestions: [
      { question: 'Why must variables shared between an ISR and normal code be declared with the "volatile" keyword in C?', answerGuidance: 'It informs the compiler optimizer that the variable value can change asynchronously outside the program flow, preventing register caching.', keywords: ['Volatile', 'ISR', 'Compiler Optimization', 'Memory-Mapped I/O'] },
    ],
    behavioralInterviewQuestions: [
      { question: 'Tell me about how you debugged a tricky hardware-software integration issue.', starFocus: 'Using logic analyzer waveforms, verifying clock signal integrity, and isolated unit tests.' },
    ],
    exampleProjects: [
      { title: 'FreeRTOS Multi-Sensor Telemetry Hub', stack: 'STM32, FreeRTOS, Embedded C, I2C, CAN', description: 'Engineered firmware reading IMU and temperature sensors via DMA, broadcasting telemetry over CAN bus at 100 Hz.' },
    ],
    resumeGuidance: {
      keywords: ['Embedded C', 'ARM Cortex-M', 'FreeRTOS', 'SPI', 'I2C', 'CAN Bus', 'DMA'],
      actionVerbs: ['Programmed', 'Engineered', 'Debugged', 'Interfaced', 'Calibrated'],
      keyBulletExamples: [
        'Authored bare-metal STM32 firmware drivers utilizing DMA to achieve 115.2 kbps telemetry with 0% CPU blocking.',
      ],
    },
    assessmentCriteria: [
      { metric: 'Hardware-Firmware Fluency', targetScore: 85, description: 'Deep knowledge of register maps, timing constraints, and ISR design.' },
    ],
  },
  {
    roleId: 'vlsi-engineer',
    title: 'VLSI Engineer',
    category: 'Hardware & Electronics',
    branches: ['Electronics and Communication Engineering', 'Electrical and Electronics Engineering'],
    overview: 'Designs, models, verifies, and tests complex integrated circuits (ICs), ASICs, and FPGA digital hardware systems.',
    requiredSkills: ['Verilog / SystemVerilog', 'Digital Design & FSMs', 'Static Timing Analysis (STA)', 'FPGA Prototyping (Xilinx Vivado)', 'UVM Verification'],
    coreConcepts: ['Setup and Hold Time Constraints', 'Clock Domain Crossing (CDC)', 'Combinational vs Sequential Synthesis', 'CMOS Logic Scaling'],
    prerequisites: ['Digital electronics, Boolean algebra, CMOS transistor fundamentals'],
    learningRoadmap: [
      { phase: 'Phase 1', title: 'Digital Logic & Verilog RTL', duration: '4 Weeks', topics: ['RTL Design', 'FSM Architectures', 'Synthesizable Code'] },
      { phase: 'Phase 2', title: 'Static Timing & Synthesis', duration: '4 Weeks', topics: ['Setup & Hold Violations', 'Clock Jitter & Skew', 'Gate Level Synthesis'] },
      { phase: 'Phase 3', title: 'Verification & FPGA Testing', duration: '3 Weeks', topics: ['SystemVerilog Testbenches', 'Coverage Metrics', 'FPGA Synthesis'] },
    ],
    technicalInterviewQuestions: [
      { question: 'What is a setup time violation and how do you resolve it during physical synthesis?', answerGuidance: 'Data must be stable before the clock edge (T_clk >= T_cq + T_comb + T_setup). Fix by pipelining, buffer insertion, or lowering frequency.', keywords: ['Setup Time', 'Critical Path', 'Pipelining', 'Static Timing Analysis'] },
    ],
    behavioralInterviewQuestions: [
      { question: 'Describe your methodology when a simulated testbench produces unexpected functional mismatch.', starFocus: 'Waveform inspection, assertions, tracing back from mismatch to driving registers.' },
    ],
    exampleProjects: [
      { title: 'Pipelined 32-Bit RISC-V CPU Core', stack: 'SystemVerilog, Xilinx Vivado, ModelSim', description: 'Designed 5-stage pipelined processor with hazard detection, branch prediction, and forwarding unit.' },
    ],
    resumeGuidance: {
      keywords: ['Verilog', 'SystemVerilog', 'RTL Design', 'FPGA', 'Static Timing Analysis (STA)', 'Vivado'],
      actionVerbs: ['Synthesized', 'Verified', 'Architected', 'Simulated', 'Pipelined'],
      keyBulletExamples: [
        'Designed synthesizable 32-bit arithmetic logic unit in SystemVerilog passing 100% of randomized verification testbenches.',
      ],
    },
    assessmentCriteria: [
      { metric: 'Timing & RTL Rigor', targetScore: 85, description: 'Flawless calculation of setup/hold slack and pipelining trade-offs.' },
    ],
  },
  {
    roleId: 'electronics-engineer',
    title: 'Electronics Engineer',
    category: 'Hardware & Electronics',
    branches: ['Electronics and Communication Engineering'],
    overview: 'Designs analog and mixed-signal electronic circuits, PCB layouts, power supplies, and communication hardware.',
    requiredSkills: ['Analog Circuit Design (Op-Amps, Filters)', 'PCB Design (KiCad, Altium)', 'RF & Signal Integrity', 'Testing & Measurement Equipment', 'Component Selection'],
    coreConcepts: ['Frequency Response & Bode Plots', 'Impedance Matching', 'Noise Filtering & EMI/EMC', 'Power Dissipation & Thermal Design'],
    prerequisites: ['Circuit theory, semiconductor devices, signals and systems'],
    learningRoadmap: [
      { phase: 'Phase 1', title: 'Analog Circuit Mastery', duration: '4 Weeks', topics: ['Op-Amp Topologies', 'Active Filters', 'BJT/MOSFET Biasing'] },
      { phase: 'Phase 2', title: 'PCB Layout & Schematics', duration: '4 Weeks', topics: ['Multi-layer Routing', 'Ground Planes', 'Decoupling Capacitors'] },
      { phase: 'Phase 3', title: 'Testing & Signal Integrity', duration: '3 Weeks', topics: ['Bode Plots', 'Differential Pairs', 'Thermal Calculations'] },
    ],
    technicalInterviewQuestions: [
      { question: 'Why is a ground plane crucial in high-speed 4-layer PCB design?', answerGuidance: 'Provides low-impedance return path for high-frequency current loops, minimizing EMI and crosstalk.', keywords: ['Ground Plane', 'Return Path', 'EMI', 'Loop Inductance'] },
    ],
    behavioralInterviewQuestions: [
      { question: 'Tell me about how you handled component shortages or obsolescence in a hardware project.', starFocus: 'Datasheet comparison, pin compatibility, and redesigning biasing circuits.' },
    ],
    exampleProjects: [
      { title: 'Low-Noise Audio Preamplifier PCB', stack: 'Altium Designer, SPICE, Op-Amps', description: 'Designed 4-layer analog PCB achieving >95 dB signal-to-noise ratio with custom active Sallen-Key filtering.' },
    ],
    resumeGuidance: {
      keywords: ['PCB Design', 'KiCad', 'Altium', 'Analog Circuit Design', 'Op-Amps', 'Signal Integrity'],
      actionVerbs: ['Designed', 'Prototyped', 'Routed', 'Validated', 'Simulated'],
      keyBulletExamples: [
        'Routed high-density multi-layer PCBs in KiCad adhering to strict 50-ohm controlled impedance standards.',
      ],
    },
    assessmentCriteria: [
      { metric: 'Analog & PCB Fundamentals', targetScore: 85, description: 'Accurate filter design and high-frequency layout awareness.' },
    ],
  },
  {
    roleId: 'electrical-design-engineer',
    title: 'Electrical Design Engineer',
    category: 'Electrical Engineering',
    branches: ['Electrical and Electronics Engineering'],
    overview: 'Develops electrical distribution schematics, motor control centers, industrial automation panels, and cabling layouts.',
    requiredSkills: ['AutoCAD Electrical / EPLAN', 'PLC Programming (Ladder Logic)', 'Motor Control & VFDs', 'Circuit Breaker Sizing & Protection', 'National Electrical Code (NEC / IEC)'],
    coreConcepts: ['Short Circuit Calculations', 'Voltage Drop Analysis', 'Power Factor Correction', 'Single-Line Diagrams (SLD)'],
    prerequisites: ['AC circuits, electrical machines, switchgear fundamentals'],
    learningRoadmap: [
      { phase: 'Phase 1', title: 'Single-Line Diagrams & Load Schedules', duration: '4 Weeks', topics: ['SLD Creation', 'Transformer Sizing', 'Cable Schedules'] },
      { phase: 'Phase 2', title: 'Motor Control & Automation', duration: '4 Weeks', topics: ['Direct-On-Line vs Star-Delta', 'VFD Drives', 'PLC Interfacing'] },
      { phase: 'Phase 3', title: 'Protective Relaying & Standards', duration: '3 Weeks', topics: ['Overcurrent Relays', 'Earth Fault Protection', 'IEC 60364'] },
    ],
    technicalInterviewQuestions: [
      { question: 'Why is Star-Delta starting used for large 3-phase induction motors instead of Direct-On-Line (DOL)?', answerGuidance: 'Reduces inrush starting current to 1/3 of DOL starting current, protecting grid and equipment.', keywords: ['Star-Delta', 'Inrush Current', 'Motor Starting', 'Starting Torque'] },
    ],
    behavioralInterviewQuestions: [
      { question: 'Describe how you ensure electrical safety standards in a high-voltage design.', starFocus: 'Strict adherence to clearance distances, circuit breaker ratings, and lock-out/tag-out rules.' },
    ],
    exampleProjects: [
      { title: 'Industrial Motor Control Panel Design', stack: 'AutoCAD Electrical, EPLAN, Siemens PLC', description: 'Engineered complete electrical schematics for a 45 kW motor control center with VFD speed regulation.' },
    ],
    resumeGuidance: {
      keywords: ['Single-Line Diagrams', 'AutoCAD Electrical', 'PLC Programming', 'VFDs', 'Switchgear', 'Power Factor'],
      actionVerbs: ['Engineered', 'Designed', 'Calculated', 'Specified', 'Commissioned'],
      keyBulletExamples: [
        'Designed industrial electrical panel schematics in AutoCAD Electrical compliant with IEC 60204 safety standards.',
      ],
    },
    assessmentCriteria: [
      { metric: 'Industrial Standards & Protection', targetScore: 85, description: 'Accurate breaker coordination and motor starter calculations.' },
    ],
  },
  {
    roleId: 'power-systems-engineer',
    title: 'Power Systems Engineer',
    category: 'Electrical Engineering',
    branches: ['Electrical and Electronics Engineering'],
    overview: 'Analyzes, simulates, and optimizes electric power grids, high-voltage transmission lines, and renewable energy integration.',
    requiredSkills: ['Power Flow Analysis (MATLAB, ETAP, PowerWorld)', 'Symmetrical Components', 'Protection Relay Coordination', 'Transmission Line Parameters', 'Grid Stability'],
    coreConcepts: ['Swing Equation & Transient Stability', 'Fault Currents (LG, LL, LLG, 3-Phase)', 'Reactive Power & Voltage Control', 'SCADA Systems'],
    prerequisites: ['Power system analysis, electromagnetics, linear systems'],
    learningRoadmap: [
      { phase: 'Phase 1', title: 'Transmission Line Modeling & Load Flow', duration: '4 Weeks', topics: ['ABCD Parameters', 'Gauss-Seidel & Newton-Raphson', 'Bus Admittance Matrix'] },
      { phase: 'Phase 2', title: 'Fault Analysis & Symmetrical Components', duration: '4 Weeks', topics: ['Sequence Networks', 'Unsymmetrical Faults', 'Short-Circuit MVA'] },
      { phase: 'Phase 3', title: 'Power System Protection & Stability', duration: '3 Weeks', topics: ['Distance Relays', 'Equal Area Criterion', 'ETAP Simulation'] },
    ],
    technicalInterviewQuestions: [
      { question: 'Explain the Equal Area Criterion and how it determines transient stability after a fault.', answerGuidance: 'Area under accelerating power must equal decelerating power for rotor to stabilize without losing synchronism.', keywords: ['Equal Area Criterion', 'Rotor Angle', 'Transient Stability', 'Critical Clearing Angle'] },
    ],
    behavioralInterviewQuestions: [
      { question: 'Tell me about a complex grid simulation you executed and how you verified its convergence.', starFocus: 'Validating bus voltage profiles, reactive power limits, and iterative solver tolerances.' },
    ],
    exampleProjects: [
      { title: '132/33 kV Substation Load Flow & Fault Simulation', stack: 'ETAP, MATLAB/Simulink', description: 'Modelled 14-bus transmission network in ETAP, simulating 3-phase and single line-to-ground faults to size circuit breakers.' },
    ],
    resumeGuidance: {
      keywords: ['ETAP', 'MATLAB/Simulink', 'Load Flow Analysis', 'Fault Calculation', 'Power Systems', 'Substation Design'],
      actionVerbs: ['Modelled', 'Simulated', 'Analyzed', 'Calculated', 'Coordinated'],
      keyBulletExamples: [
        'Simulated 14-bus power transmission grid in ETAP, evaluating Newton-Raphson load flow convergence under peak loading.',
      ],
    },
    assessmentCriteria: [
      { metric: 'Grid Stability Analysis', targetScore: 85, description: 'Mastery of sequence networks and load flow algorithms.' },
    ],
  },
  {
    roleId: 'mechanical-design-engineer',
    title: 'Mechanical Design Engineer',
    category: 'Mechanical Engineering',
    branches: ['Mechanical Engineering'],
    overview: 'Designs physical mechanisms, mechanical components, housings, and consumer/industrial products using 3D CAD and GD&T.',
    requiredSkills: ['3D CAD (SolidWorks, CATIA, Creo)', 'Geometric Dimensioning & Tolerancing (GD&T)', 'Design for Manufacturing & Assembly (DFMA)', 'Material Selection', 'Finite Element Analysis (FEA)'],
    coreConcepts: ['Stress Concentration & Fatigue Life', 'Thermal Expansion & Fits/Tolerances', 'Sheet Metal & Injection Molding Design', 'Kinematic Linkages'],
    prerequisites: ['Engineering mechanics, strength of materials, manufacturing processes'],
    learningRoadmap: [
      { phase: 'Phase 1', title: 'Parametric 3D Solid Modeling', duration: '4 Weeks', topics: ['Part Modeling', 'Complex Assemblies', 'Drafting & BOMs'] },
      { phase: 'Phase 2', title: 'GD&T & Tolerance Stack-Up', duration: '4 Weeks', topics: ['Datums & Modifiers', 'Position & Profile Tolerances', 'Worst-Case Stackup'] },
      { phase: 'Phase 3', title: 'DFMA & Prototyping', duration: '3 Weeks', topics: ['Injection Molding Rules', 'Sheet Metal Bends', '3D Printing'] },
    ],
    technicalInterviewQuestions: [
      { question: 'Explain the difference between Clearance Fit, Transition Fit, and Interference Fit with an example application.', answerGuidance: 'Clearance allows relative motion (journal bearing); interference creates permanent press-fit (gear on shaft); transition allows tight location.', keywords: ['Fits and Tolerances', 'Interference Fit', 'Clearance Fit', 'Tolerance Stackup'] },
    ],
    behavioralInterviewQuestions: [
      { question: 'Describe how you redesigned a component to reduce manufacturing cost or assembly time.', starFocus: 'Eliminating fasteners, adopting snap-fits, and reducing part count using DFMA.' },
    ],
    exampleProjects: [
      { title: 'Planetary Gearbox Reducer Design', stack: 'SolidWorks, ANSYS FEA, GD&T', description: 'Designed 5:1 planetary gearbox assembly in SolidWorks, verifying gear tooth bending stresses via AGMA standards.' },
    ],
    resumeGuidance: {
      keywords: ['SolidWorks', 'GD&T', 'CAD Modeling', 'FEA Simulation', 'DFMA', 'Mechanism Design'],
      actionVerbs: ['Engineered', 'Modelled', 'Optimized', 'Drafted', 'Validated'],
      keyBulletExamples: [
        'Engineered complex mechanical assemblies in SolidWorks applying ASME Y14.5 GD&T standards to achieve reliable fits.',
      ],
    },
    assessmentCriteria: [
      { metric: 'CAD & Tolerancing Mastery', targetScore: 85, description: 'Precise tolerance stack-up and DFMA considerations.' },
    ],
  },
  {
    roleId: 'cad-cae-engineer',
    title: 'CAD/CAE Engineer',
    category: 'Mechanical Engineering',
    branches: ['Mechanical Engineering', 'Civil Engineering'],
    overview: 'Performs computational structural, thermal, and modal simulations using finite element analysis to ensure product reliability.',
    requiredSkills: ['FEA Tools (ANSYS Workbench, Abaqus)', 'Meshing Techniques & Quality Metrics', 'Static & Dynamic Structural Analysis', 'Thermal & Modal Simulation', '3D CAD'],
    coreConcepts: ['Von Mises Stress Criterion', 'Convergence Studies & Mesh Independence', 'Boundary Conditions & Contact Formulation', 'Buckling & Natural Frequencies'],
    prerequisites: ['Strength of materials, continuum mechanics, finite element fundamentals'],
    learningRoadmap: [
      { phase: 'Phase 1', title: 'Meshing & Finite Element Theory', duration: '4 Weeks', topics: ['Element Types (Tet vs Hex)', 'Aspect Ratio & Skewness', 'Mesh Refinement'] },
      { phase: 'Phase 2', title: 'Static Structural & Thermal FEA', duration: '4 Weeks', topics: ['Von Mises Stress', 'Thermal Gradients', 'Nonlinear Contacts'] },
      { phase: 'Phase 3', title: 'Modal & Fatigue Analysis', duration: '3 Weeks', topics: ['Resonance & Harmonics', 'S-N Fatigue Curves', 'Topology Optimization'] },
    ],
    technicalInterviewQuestions: [
      { question: 'What is a mesh convergence study and why is it mandatory before accepting FEA stress results?', answerGuidance: 'Refining mesh size until output stresses stabilize within an acceptable delta (e.g. <3%), proving results are independent of element discretization.', keywords: ['Mesh Convergence', 'Element Quality', 'Discretization Error', 'Von Mises'] },
    ],
    behavioralInterviewQuestions: [
      { question: 'Tell me about how you validated simulation results against hand calculations or physical lab tests.', starFocus: 'Comparing theoretical beam equations with FEA results to confirm proper boundary conditions.' },
    ],
    exampleProjects: [
      { title: 'Automotive Suspension Arm Structural FEA', stack: 'ANSYS Workbench, SolidWorks', description: 'Conducted static and modal simulation of lightweight aluminum wishbone suspension, confirming factor of safety > 2.2.' },
    ],
    resumeGuidance: {
      keywords: ['ANSYS', 'FEA', 'Meshing', 'Structural Analysis', 'Thermal Simulation', 'Von Mises'],
      actionVerbs: ['Simulated', 'Analyzed', 'Meshed', 'Validated', 'Optimized'],
      keyBulletExamples: [
        'Conducted finite element structural simulations in ANSYS, identifying stress hotspots and optimizing component mass by 18%.',
      ],
    },
    assessmentCriteria: [
      { metric: 'Simulation Rigor', targetScore: 85, description: 'Correct boundary condition setup and mesh quality verification.' },
    ],
  },
  {
    roleId: 'manufacturing-engineer',
    title: 'Manufacturing Engineer',
    category: 'Industrial & Mechanical',
    branches: ['Mechanical Engineering'],
    overview: 'Designs, optimizes, and oversees manufacturing processes, tooling, CNC machining setups, and assembly plant operations.',
    requiredSkills: ['CNC Programming (G-Code / M-Code)', 'Jig & Fixture Design', 'Lean Manufacturing & 5S', 'Quality Control & SPC', 'Process Capability (Cp, Cpk)'],
    coreConcepts: ['Six Sigma DMAIC', 'Root Cause Analysis (Ishikawa, 5-Whys)', 'Cycle Time & Takt Time Optimization', 'Tool Wear & Cutting Speeds'],
    prerequisites: ['Workshop manufacturing technology, metrology, materials science'],
    learningRoadmap: [
      { phase: 'Phase 1', title: 'Machining & CNC Operations', duration: '4 Weeks', topics: ['Milling & Turning', 'G-Code Programming', 'Speeds and Feeds'] },
      { phase: 'Phase 2', title: 'Jigs, Fixtures & Tooling', duration: '4 Weeks', topics: ['Locating Principles (3-2-1)', 'Clamping Mechanisms', 'Assembly Fixtures'] },
      { phase: 'Phase 3', title: 'Lean & Quality Engineering', duration: '3 Weeks', topics: ['Value Stream Mapping', 'Statistical Process Control', 'Cpk Analysis'] },
    ],
    technicalInterviewQuestions: [
      { question: 'Explain the 3-2-1 locating principle used in designing manufacturing fixtures.', answerGuidance: 'Restricts 9 degrees of freedom: 3 on primary plane, 2 on secondary plane, and 1 on tertiary plane.', keywords: ['3-2-1 Principle', 'Degrees of Freedom', 'Fixture Design', 'Location'] },
    ],
    behavioralInterviewQuestions: [
      { question: 'Describe an instance where you identified and eliminated a bottleneck on a production line.', starFocus: 'Calculating takt time vs cycle time, reorganizing work cell layout, and worker training.' },
    ],
    exampleProjects: [
      { title: 'Pneumatic Assembly Fixture Design', stack: 'SolidWorks, AutoCAD, CNC Machining', description: 'Engineered multi-point clamping fixture reducing part loading time from 45 seconds to 12 seconds.' },
    ],
    resumeGuidance: {
      keywords: ['CNC Programming', 'Lean Manufacturing', 'Six Sigma', 'Tooling Design', 'Cpk', 'SPC'],
      actionVerbs: ['Manufactured', 'Streamlined', 'Programmed', 'Eliminated', 'Standardized'],
      keyBulletExamples: [
        'Designed custom pneumatic machining fixtures reducing component clamping time and operational cycle latency by 35%.',
      ],
    },
    assessmentCriteria: [
      { metric: 'Process Efficiency', targetScore: 85, description: 'Demonstrated mastery of tooling design and lean methodologies.' },
    ],
  },
  {
    roleId: 'quality-engineer',
    title: 'Quality Engineer',
    category: 'Industrial & Quality',
    branches: ['Mechanical Engineering', 'Chemical Engineering', 'Civil Engineering'],
    overview: 'Ensures products meet rigorous industrial, safety, and regulatory quality standards through systematic audits and metrology.',
    requiredSkills: ['Statistical Process Control (SPC)', 'Quality Tools (7 QC Tools, FMEA)', 'Metrology & CMM Inspection', 'ISO 9001 / IATF 16949 Standards', 'Root Cause Analysis'],
    coreConcepts: ['Failure Mode and Effects Analysis (FMEA)', 'Process Capability (Cpk > 1.33)', 'Measurement System Analysis (Gage R&R)', 'Cost of Quality'],
    prerequisites: ['Basic statistics, engineering drawings, metrology'],
    learningRoadmap: [
      { phase: 'Phase 1', title: 'Statistical Quality Control', duration: '4 Weeks', topics: ['Control Charts (X-bar, R)', 'Process Capability', 'Sampling Plans'] },
      { phase: 'Phase 2', title: 'FMEA & Risk Mitigation', duration: '4 Weeks', topics: ['Design FMEA', 'Process FMEA', 'Risk Priority Numbers (RPN)'] },
      { phase: 'Phase 3', title: 'Metrology & Quality Audits', duration: '3 Weeks', topics: ['CMM Programming', 'Gage R&R Studies', 'ISO 9001 Compliance'] },
    ],
    technicalInterviewQuestions: [
      { question: 'What is the significance of a Process Capability Index Cpk >= 1.33?', answerGuidance: 'Indicates the process is statistically capable and centered, operating with less than 64 defects per million opportunities (4-sigma).', keywords: ['Cpk', 'Process Capability', 'Specification Limits', 'Defect Rate'] },
    ],
    behavioralInterviewQuestions: [
      { question: 'How do you handle a scenario where production pushes to ship a batch with borderline quality metrics?', starFocus: 'Holding firm on quality standards, conducting rapid risk assessment, and presenting data to management.' },
    ],
    exampleProjects: [
      { title: 'Six Sigma Quality Defect Reduction', stack: 'Minitab, SPC, Control Charts, FMEA', description: 'Applied DMAIC framework on precision turning line, reducing dimensional scrap rate from 4.2% to 0.7%.' },
    ],
    resumeGuidance: {
      keywords: ['Six Sigma', 'FMEA', 'SPC', 'Cpk Analysis', 'ISO 9001', 'Metrology'],
      actionVerbs: ['Audited', 'Inspected', 'Reduced', 'Standardized', 'Quantified'],
      keyBulletExamples: [
        'Formulated Process FMEAs and implemented real-time SPC control charting, reducing assembly defects by 42%.',
      ],
    },
    assessmentCriteria: [
      { metric: 'Root Cause & Statistical Accuracy', targetScore: 85, description: 'Fluency with control charts and risk priority numbers.' },
    ],
  },
  {
    roleId: 'automotive-engineer',
    title: 'Automotive Engineer',
    category: 'Mechanical & Automotive',
    branches: ['Mechanical Engineering', 'Electrical and Electronics Engineering'],
    overview: 'Develops vehicle dynamics, powertrain systems, electric vehicle (EV) battery architectures, and chassis structures.',
    requiredSkills: ['Vehicle Dynamics & Suspension Tuning', 'Powertrain & EV Battery Systems', 'MATLAB/Simulink Modeling', 'Crash & NVH Simulation', 'CAN Bus In-Vehicle Telemetry'],
    coreConcepts: ['Aerodynamic Drag & Rolling Resistance', 'Battery Management Systems (BMS)', 'Oversteer vs Understeer', 'Torque Curves & Transmission Gearing'],
    prerequisites: ['Thermodynamics, mechanics of materials, electric circuits'],
    learningRoadmap: [
      { phase: 'Phase 1', title: 'Powertrain & Vehicle Resistance', duration: '4 Weeks', topics: ['Tractive Effort', 'EV Motor Sizing', 'Battery Cell Topologies'] },
      { phase: 'Phase 2', title: 'Vehicle Dynamics & Handling', duration: '4 Weeks', topics: ['Bicycle Model', 'Roll Center', 'Suspension Kinematics'] },
      { phase: 'Phase 3', title: 'Automotive Electronics & Controls', duration: '3 Weeks', topics: ['BMS Architecture', 'CAN Bus Telemetry', 'ABS & ESP Algorithms'] },
    ],
    technicalInterviewQuestions: [
      { question: 'Explain the fundamental trade-offs between Lithium Iron Phosphate (LFP) and Nickel Manganese Cobalt (NMC) battery chemistries in modern EVs.', answerGuidance: 'LFP offers higher thermal stability, cycle life, and lower cost; NMC provides higher gravimetric energy density.', keywords: ['LFP', 'NMC', 'Energy Density', 'Thermal Runaway', 'BMS'] },
    ],
    behavioralInterviewQuestions: [
      { question: 'Tell me about your contribution to a student racing team (FSAE / BAJA) or automotive project.', starFocus: 'Weight reduction, packaging constraints, and endurance test verification.' },
    ],
    exampleProjects: [
      { title: 'Formula Student EV Powertrain & Battery Packaging', stack: 'MATLAB/Simulink, SolidWorks, CAN', description: 'Simulated 72V 5 kWh accumulator pack with liquid cooling, optimizing cell packaging and center of gravity.' },
    ],
    resumeGuidance: {
      keywords: ['Vehicle Dynamics', 'EV Powertrain', 'Battery Management Systems', 'MATLAB/Simulink', 'SolidWorks'],
      actionVerbs: ['Engineered', 'Calculated', 'Packaged', 'Simulated', 'Tested'],
      keyBulletExamples: [
        'Modelled electric vehicle tractive power requirements in MATLAB/Simulink, sizing motor torque curve for 0-60 km/h acceleration.',
      ],
    },
    assessmentCriteria: [
      { metric: 'Powertrain & Dynamics Modeling', targetScore: 85, description: 'Precise tractive effort calculations and battery sizing.' },
    ],
  },
  {
    roleId: 'process-engineer',
    title: 'Process Engineer',
    category: 'Chemical & Industrial',
    branches: ['Chemical Engineering', 'Mechanical Engineering'],
    overview: 'Designs, scales, and controls industrial continuous and batch processes for chemicals, pharmaceuticals, and manufacturing.',
    requiredSkills: ['Process Simulation (Aspen Plus, DWSIM)', 'Heat & Mass Balances', 'Piping & Instrumentation Diagrams (P&ID)', 'Equipment Sizing (Pumps, Heat Exchangers)', 'Hazard & Operability Studies (HAZOP)'],
    coreConcepts: ['Mass & Energy Conservation', 'Fluid Transport & Head Loss', 'Process Dynamics & Feedback Loops', 'Distillation & Separation'],
    prerequisites: ['Chemical reaction engineering, fluid dynamics, heat transfer'],
    learningRoadmap: [
      { phase: 'Phase 1', title: 'Mass & Energy Balances', duration: '4 Weeks', topics: ['Recycle & Bypass Streams', 'Enthalpy Balances', 'Combustion Calculations'] },
      { phase: 'Phase 2', title: 'Piping & Instrumentation (P&ID)', duration: '4 Weeks', topics: ['Control Valve Sizing', 'Pump Head Curves', 'P&ID Standards'] },
      { phase: 'Phase 3', title: 'Process Safety & HAZOP', duration: '3 Weeks', topics: ['Pressure Relief Sizing', 'HAZOP Guide Words', 'Interlock Systems'] },
    ],
    technicalInterviewQuestions: [
      { question: 'What is Net Positive Suction Head (NPSH) and how do you ensure a centrifugal pump does not cavitate?', answerGuidance: 'Ensure NPSH Available (NPSHA) exceeds NPSH Required (NPSHR) by calculating suction pressure head minus vapor pressure.', keywords: ['NPSH', 'Cavitation', 'Centrifugal Pump', 'Suction Head'] },
    ],
    behavioralInterviewQuestions: [
      { question: 'Describe how you conducted a HAZOP review on an industrial process line.', starFocus: 'Applying guide words (MORE, LESS, NONE), identifying root causes, and recommending safety interlocks.' },
    ],
    exampleProjects: [
      { title: 'Continuous Ethanol Distillation Column Simulation', stack: 'Aspen Plus, DWSIM, MATLAB', description: 'Simulated 24-tray sieve distillation column in Aspen Plus, achieving 94.5% purity with optimized reflux ratio.' },
    ],
    resumeGuidance: {
      keywords: ['Aspen Plus', 'P&ID', 'Mass & Energy Balances', 'Heat Exchangers', 'HAZOP', 'Process Optimization'],
      actionVerbs: ['Modelled', 'Calculated', 'Sized', 'Simulated', 'Optimized'],
      keyBulletExamples: [
        'Formulated rigorous mass and energy balances across multi-effect evaporator systems, reducing steam consumption by 18%.',
      ],
    },
    assessmentCriteria: [
      { metric: 'Process Modeling Rigor', targetScore: 85, description: 'Accurate pump sizing, enthalpy calculations, and safety margins.' },
    ],
  },
  {
    roleId: 'chemical-plant-engineer',
    title: 'Chemical Plant Engineer',
    category: 'Chemical Engineering',
    branches: ['Chemical Engineering'],
    overview: 'Directs on-site unit operations, reactors, distillation columns, and safety protocols in chemical manufacturing plants.',
    requiredSkills: ['Unit Operations & Reactor Maintenance', 'OSHA & Industrial Safety Standards', 'DCS / SCADA Monitoring', 'Troubleshooting Operations', 'Root Cause Environmental Audits'],
    coreConcepts: ['Catalyst Poisoning & Regeneration', 'Reflux Ratio Optimization', 'Cooling Water & Steam Utility Networks', 'Emissions Abatement'],
    prerequisites: ['Chemical engineering kinetics, plant design, safety engineering'],
    learningRoadmap: [
      { phase: 'Phase 1', title: 'Reactor Operations & Kinetics', duration: '4 Weeks', topics: ['CSTR and PFR Troubleshooting', 'Catalyst Loading', 'Thermal Runaways'] },
      { phase: 'Phase 2', title: 'Distillation & Separation Units', duration: '4 Weeks', topics: ['Column Flooding & Weeping', 'Tray Efficiency', 'Reboiler Operation'] },
      { phase: 'Phase 3', title: 'Plant Safety & Utilities', duration: '3 Weeks', topics: ['Steam Traps & Boilers', 'Effluent Treatment Plants (ETP)', 'Emergency Shutdown'] },
    ],
    technicalInterviewQuestions: [
      { question: 'What causes flooding in a distillation column, and what immediate operational actions mitigate it?', answerGuidance: 'Caused by excessive vapor velocity or high liquid loading. Mitigate by decreasing reboiler heat or reducing feed rate.', keywords: ['Column Flooding', 'Differential Pressure', 'Reflux Rate', 'Weeping'] },
    ],
    behavioralInterviewQuestions: [
      { question: 'Tell me about how you handled an operational alarm or equipment failure during shift operations.', starFocus: 'Adhering to operating procedures, stabilizing process parameters, and communicating with cross-functional crews.' },
    ],
    exampleProjects: [
      { title: 'Plant Heat Exchanger Network Optimization', stack: 'DWSIM, Pinch Analysis, Excel', description: 'Applied pinch technology to plant heat integration, recovering 1.4 MW of waste heat across cooling streams.' },
    ],
    resumeGuidance: {
      keywords: ['Plant Operations', 'Distillation Columns', 'CSTR Reactors', 'Pinch Analysis', 'HAZOP', 'Safety Protocols'],
      actionVerbs: ['Supervised', 'Troubleshot', 'Optimized', 'Maintained', 'Mitigated'],
      keyBulletExamples: [
        'Supervised day-to-day operations of catalytic fixed-bed reactor, maintaining conversion efficiency above 91%.',
      ],
    },
    assessmentCriteria: [
      { metric: 'Plant Troubleshooting', targetScore: 85, description: 'Immediate diagnosis of column instability and utility imbalances.' },
    ],
  },
  {
    roleId: 'process-design-engineer',
    title: 'Process Design Engineer',
    category: 'Chemical Engineering',
    branches: ['Chemical Engineering'],
    overview: 'Translates laboratory chemistry into commercial-scale plant specifications, process flow diagrams, and equipment data sheets.',
    requiredSkills: ['Aspen HYSYS / Aspen Plus', 'Process Flow Diagrams (PFD)', 'Equipment Datasheet Generation', 'Capital & Operational Cost Estimation (CAPEX/OPEX)', 'Scale-Up Methodologies'],
    coreConcepts: ['Scale-Up Criteria (Geometric, Kinematic, Dynamic)', 'Heat Integration & Pinch Technology', 'Economic Feasibility', 'Equipment Metallurgy Selection'],
    prerequisites: ['Thermodynamics, chemical reaction engineering, transport phenomena'],
    learningRoadmap: [
      { phase: 'Phase 1', title: 'Flowsheet Simulation & PFDs', duration: '4 Weeks', topics: ['Aspen HYSYS', 'Equation of State Selection', 'Stream Summaries'] },
      { phase: 'Phase 2', title: 'Detailed Equipment Sizing', duration: '4 Weeks', topics: ['Shell & Tube Exchangers', 'Vessel Wall Thickness', 'Distillation Columns'] },
      { phase: 'Phase 3', title: 'Economic Evaluation & Materials', duration: '3 Weeks', topics: ['CAPEX/OPEX Estimation', 'Corrosion Allowances', 'Plant Layout'] },
    ],
    technicalInterviewQuestions: [
      { question: 'How do you choose between Peng-Robinson and NRTL property packages when simulating a chemical flowsheet?', answerGuidance: 'Peng-Robinson for high-pressure hydrocarbons and non-polar mixtures; NRTL for polar, highly non-ideal liquid mixtures.', keywords: ['Peng-Robinson', 'NRTL', 'Thermodynamic Models', 'Vapor-Liquid Equilibrium'] },
    ],
    behavioralInterviewQuestions: [
      { question: 'Describe how you justified equipment sizing decisions when client specifications were ambiguous.', starFocus: 'Applying engineering design margins, sensitivity analysis, and documenting assumptions.' },
    ],
    exampleProjects: [
      { title: 'Green Hydrogen Production Plant Design', stack: 'Aspen HYSYS, Water Electrolysis, PFD', description: 'Generated full PFD, mass balances, and equipment data sheets for a 10 MW PEM electrolyzer facility.' },
    ],
    resumeGuidance: {
      keywords: ['Aspen HYSYS', 'PFD', 'Equipment Data Sheets', 'Pinch Analysis', 'CAPEX Estimation', 'Scale-Up'],
      actionVerbs: ['Designed', 'Specified', 'Sized', 'Evaluated', 'Simulated'],
      keyBulletExamples: [
        'Authored detailed Process Flow Diagrams (PFD) and equipment datasheets for 50 ton/day chemical synthesis unit.',
      ],
    },
    assessmentCriteria: [
      { metric: 'Design Engineering Rigor', targetScore: 85, description: 'Proficiency with thermodynamic model selection and sizing calculations.' },
    ],
  },
  {
    roleId: 'civil-design-engineer',
    title: 'Civil Design Engineer',
    category: 'Civil & Structural',
    branches: ['Civil Engineering'],
    overview: 'Produces civil site engineering plans, roadway alignments, stormwater drainage models, and grading specifications.',
    requiredSkills: ['AutoCAD Civil 3D', 'Hydrology & Stormwater Modeling (HEC-RAS, EPA-SWMM)', 'Site Grading & Earthwork Balances', 'Cut-and-Fill Calculations', 'Local Municipal Building Codes'],
    coreConcepts: ['Rational Method for Runoff (Q = C*I*A)', 'Manning Equation for Open Channels', 'Slope Stability & Erosion Control', 'Utility Coordination'],
    prerequisites: ['Fluid mechanics, surveying, geotechnical foundations'],
    learningRoadmap: [
      { phase: 'Phase 1', title: 'Site Layout & Civil 3D Surfaces', duration: '4 Weeks', topics: ['Contour Modeling', 'Corridors & Alignments', 'Cut/Fill Volumes'] },
      { phase: 'Phase 2', title: 'Hydrology & Storm Drainage', duration: '4 Weeks', topics: ['Rational Method', 'Retention Basin Design', 'Pipe Network Hydraulics'] },
      { phase: 'Phase 3', title: 'Utility Coordination & Permitting', duration: '3 Weeks', topics: ['Water/Sewer Profiles', 'Erosion Control Plans', 'Permitting Documentation'] },
    ],
    technicalInterviewQuestions: [
      { question: 'How is the Rational Method applied to size a stormwater culvert, and what are its key assumptions?', answerGuidance: 'Q = C*I*A assumes rainfall intensity is uniform over the watershed and duration equals time of concentration (Tc).', keywords: ['Rational Method', 'Runoff Coefficient', 'Time of Concentration', 'Hydrology'] },
    ],
    behavioralInterviewQuestions: [
      { question: 'Tell me about how you handled conflicting utility alignments (water vs sewer) on a site plan.', starFocus: 'Maintaining minimum vertical/horizontal separation distances per environmental regulations.' },
    ],
    exampleProjects: [
      { title: 'Commercial Site Civil Development Plan', stack: 'AutoCAD Civil 3D, EPA-SWMM, HEC-RAS', description: 'Engineered site grading surfaces balancing 15,000 cu yds of cut/fill with dedicated retention basin.' },
    ],
    resumeGuidance: {
      keywords: ['AutoCAD Civil 3D', 'Stormwater Design', 'Cut & Fill', 'Grading Plans', 'Hydrology', 'Site Development'],
      actionVerbs: ['Designed', 'Calculated', 'Modelled', 'Drafted', 'Permitted'],
      keyBulletExamples: [
        'Modelled 3D topographic terrain surfaces in AutoCAD Civil 3D, balancing site cut-and-fill within 3% tolerance.',
      ],
    },
    assessmentCriteria: [
      { metric: 'Hydraulic & Grading Precision', targetScore: 85, description: 'Accurate runoff sizing and terrain modeling.' },
    ],
  },
  {
    roleId: 'structural-engineer',
    title: 'Structural Engineer',
    category: 'Civil & Structural',
    branches: ['Civil Engineering'],
    overview: 'Analyzes and designs reinforced concrete, structural steel, and timber frameworks to withstand dead, live, wind, and seismic loads.',
    requiredSkills: ['Structural Analysis Software (STAAD.Pro, ETABS, SAP2000)', 'IS 456 / ACI 318 Concrete Design', 'IS 800 / AISC Steel Design', 'Seismic & Wind Load Calculations', 'Reinforcement Detailing'],
    coreConcepts: ['Limit State Method (Safety & Serviceability)', 'P-Delta Effects', 'Moment Curvature & Shear Design', 'Response Spectrum Analysis'],
    prerequisites: ['Structural analysis, mechanics of materials, soil mechanics'],
    learningRoadmap: [
      { phase: 'Phase 1', title: 'Structural Analysis & Modeling', duration: '4 Weeks', topics: ['ETABS / STAAD 3D Frames', 'Load Combinations', 'Deflection Limits'] },
      { phase: 'Phase 2', title: 'Reinforced Concrete (RCC) Design', duration: '4 Weeks', topics: ['Beam & Column Sizing', 'Two-Way Slabs', 'Footing Design'] },
      { phase: 'Phase 3', title: 'Seismic Design & Steel Connections', duration: '3 Weeks', topics: ['Response Spectrum Method', 'Bolted/Welded Connections', 'Ductile Detailing'] },
    ],
    technicalInterviewQuestions: [
      { question: 'Why is under-reinforced design mandatory for reinforced concrete beams in Limit State Design?', answerGuidance: 'Ensures ductile tensile failure: steel yields first with visible cracks and deflection before brittle concrete crushing, providing warning.', keywords: ['Under-Reinforced', 'Ductility', 'Tension Failure', 'Limit State Method'] },
    ],
    behavioralInterviewQuestions: [
      { question: 'Describe how you verified that a high-rise building model conformed to seismic drift limitations.', starFocus: 'Calculating inter-story drift ratios under dynamic response spectrum cases and adding shear walls.' },
    ],
    exampleProjects: [
      { title: 'G+8 Commercial RCC Frame Structural Design', stack: 'ETABS, STAAD.Pro, AutoCAD', description: 'Modelled 9-story moment-resisting concrete frame, executing response spectrum seismic analysis compliant with IS 1893.' },
    ],
    resumeGuidance: {
      keywords: ['ETABS', 'STAAD.Pro', 'Reinforced Concrete Design', 'Structural Steel', 'Seismic Analysis', 'IS 456'],
      actionVerbs: ['Analyzed', 'Engineered', 'Modelled', 'Detailed', 'Calculated'],
      keyBulletExamples: [
        'Modelled multi-story commercial concrete frames in ETABS, performing dynamic response spectrum seismic evaluations.',
      ],
    },
    assessmentCriteria: [
      { metric: 'Code Compliance & Mechanics', targetScore: 85, description: 'Flawless calculation of shear capacity and ductile reinforcement detailing.' },
    ],
  },
  {
    roleId: 'construction-project-engineer',
    title: 'Construction/Project Engineer',
    category: 'Civil & Construction',
    branches: ['Civil Engineering', 'Mechanical Engineering'],
    overview: 'Manages job site construction schedules, subcontractor coordination, material procurement, quality inspections, and job safety.',
    requiredSkills: ['Project Scheduling (Primavera P6, MS Project)', 'Earned Value Management (EVM)', 'Quantity Surveying & Estimation', 'Quality Assurance & Site Safety (OSHA)', 'RFI & Submittal Management'],
    coreConcepts: ['Critical Path Method (CPM)', 'Schedule Variance & Cost Variance (SV/CV)', 'Concrete Slump & Compressive Testing', 'Contract Administration (FIDIC)'],
    prerequisites: ['Civil construction materials, project management principles, surveying'],
    learningRoadmap: [
      { phase: 'Phase 1', title: 'CPM Scheduling & Planning', duration: '4 Weeks', topics: ['WBS Hierarchy', 'Primavera P6 Logic Links', 'Float Calculations'] },
      { phase: 'Phase 2', title: 'Quantity Takeoffs & Estimation', duration: '4 Weeks', topics: ['Rate Analysis', 'Bill of Quantities (BOQ)', 'Bar Bending Schedules (BBS)'] },
      { phase: 'Phase 3', title: 'Site Operations & EVM', duration: '3 Weeks', topics: ['Earned Value Calculations', 'QA/QC Inspections', 'Safety Audits'] },
    ],
    technicalInterviewQuestions: [
      { question: 'What is Total Float in Critical Path Method (CPM) and what does a zero-float activity indicate?', answerGuidance: 'Total Float is time an activity can be delayed without delaying project completion. Zero float means the activity lies on the Critical Path.', keywords: ['Critical Path', 'Total Float', 'Primavera P6', 'Schedule Delay'] },
    ],
    behavioralInterviewQuestions: [
      { question: 'Tell me about how you handled a concrete pour delay or material delivery shortage on a site.', starFocus: 'Rescheduling non-critical tasks, coordinating backup concrete batching plants, and maintaining curing logs.' },
    ],
    exampleProjects: [
      { title: 'High-Rise Commercial Construction Master Schedule', stack: 'Primavera P6, MS Excel, AutoCAD', description: 'Developed 450-activity baseline construction schedule with resource leveling and cash flow forecast.' },
    ],
    resumeGuidance: {
      keywords: ['Primavera P6', 'Critical Path Method', 'Quantity Surveying', 'Bill of Quantities (BOQ)', 'Earned Value Management'],
      actionVerbs: ['Coordinated', 'Scheduled', 'Supervised', 'Estimated', 'Managed'],
      keyBulletExamples: [
        'Formulated comprehensive 300-activity master construction schedules in Primavera P6, monitoring weekly EVM performance.',
      ],
    },
    assessmentCriteria: [
      { metric: 'Project Controls & Execution', targetScore: 85, description: 'Accurate critical path determination and Earned Value metrics.' },
    ],
  },
  {
    roleId: 'environmental-engineer',
    title: 'Environmental Engineer',
    category: 'Civil & Environmental',
    branches: ['Civil Engineering', 'Chemical Engineering'],
    overview: 'Designs wastewater treatment facilities, air pollution scrubbers, remediation systems, and conducts environmental impact assessments.',
    requiredSkills: ['Wastewater Treatment Design (Activated Sludge)', 'Air Dispersion Modeling (AERMOD)', 'Environmental Regulations & Permitting', 'Water Quality Chemistry', 'Solid Waste Management'],
    coreConcepts: ['Biological Oxygen Demand (BOD/COD)', 'Sedimentation & Clarifier Sizing', 'Membrane Bioreactors (MBR)', 'Life Cycle Assessment (LCA)'],
    prerequisites: ['Fluid mechanics, chemistry, microbiology, hydrology'],
    learningRoadmap: [
      { phase: 'Phase 1', title: 'Water & Wastewater Engineering', duration: '4 Weeks', topics: ['Primary & Secondary Clarifiers', 'Activated Sludge Math', 'Disinfection'] },
      { phase: 'Phase 2', title: 'Air Pollution & Dispersion', duration: '4 Weeks', topics: ['Gaussian Plume Model', 'Cyclone Separators', 'Baghouse Filters'] },
      { phase: 'Phase 3', title: 'Solid Waste & EIA Permitting', duration: '3 Weeks', topics: ['Sanitary Landfill Design', 'Leachate Treatment', 'EIA Statements'] },
    ],
    technicalInterviewQuestions: [
      { question: 'Explain the difference between BOD and COD and why COD is almost always higher than BOD for a given wastewater sample.', answerGuidance: 'BOD measures biologically degradable organic matter via microbial oxidation over 5 days; COD measures total chemically oxidizable matter using strong dichromate reagent.', keywords: ['BOD', 'COD', 'Wastewater', 'Chemical Oxidation', 'Activated Sludge'] },
    ],
    behavioralInterviewQuestions: [
      { question: 'Describe how you communicated environmental remediation data to community or government stakeholders.', starFocus: 'Translating parts-per-million contaminant thresholds into clear public health context.' },
    ],
    exampleProjects: [
      { title: '5 MLD Municipal Sewage Treatment Plant Design', stack: 'AutoCAD, BioWin, Water Quality Calculations', description: 'Sized aeration basins, secondary clarifiers, and chlorination tanks achieving <10 mg/L BOD effluent standard.' },
    ],
    resumeGuidance: {
      keywords: ['Wastewater Treatment', 'BOD / COD Analysis', 'Activated Sludge', 'Environmental Impact Assessment', 'Clarifier Sizing'],
      actionVerbs: ['Engineered', 'Modelled', 'Remediated', 'Monitored', 'Designed'],
      keyBulletExamples: [
        'Designed secondary biological aeration basins sizing oxygen transfer rates to achieve 92% BOD removal efficiency.',
      ],
    },
    assessmentCriteria: [
      { metric: 'Treatment Sizing & Chemistry', targetScore: 85, description: 'Flawless calculation of sludge age, F/M ratios, and aeration requirements.' },
    ],
  },
];

// Structured Learning Modules across all 9 engineering branches
const LEARNING_MODULES_DATA = [
  // 1. CSE: Operating Systems - Virtual Memory & Paging
  {
    moduleId: 'cse-mod-1',
    branch: 'Computer Science and Engineering',
    subject: 'Operating Systems',
    title: 'Virtual Memory, Multi-Level Paging & Page Fault Handling',
    estimatedMinutes: 30,
    difficulty: 'Medium',
    order: 1,
    learningObjectives: [
      'Understand how the Memory Management Unit (MMU) translates virtual addresses to physical frames.',
      'Analyze the structure and memory overhead of single-level vs multi-level hierarchical page tables.',
      'Trace the complete hardware-software interrupt sequence during a page fault exception.',
      'Compare page replacement algorithms: FIFO, LRU, and the Clock (Second-Chance) algorithm.',
    ],
    prerequisites: ['Basic computer architecture (registers, RAM, disk)', 'C pointers and address space fundamentals'],
    conceptIntroduction:
      'Virtual memory provides an illusion to each running process of a vast, private, contiguous address space. In reality, physical RAM is fragmented and scarce. The operating system, in tight coordination with the CPU MMU, dynamically maps fixed-size virtual pages to physical frames, swapping inactive pages to disk storage when physical RAM is exhausted.',
    simpleDefinition:
      'Virtual memory is a memory management technique where the operating system maps program-generated virtual addresses to physical RAM frames, allowing processes to execute even when they exceed physical memory capacity.',
    detailedExplanation:
      'A 32-bit virtual address space contains 2^32 bytes (4 GB). With a standard 4 KB page size, 2^12 bytes represent the page offset, leaving 20 bits for the Virtual Page Number (VPN). If a flat page table were stored in memory, it would require 2^20 entries (approx. 1 million entries). At 4 bytes per entry, every single process would require 4 MB of contiguous RAM just for its page table!\n\nTo eliminate this waste for sparse address spaces, modern systems use Multi-Level Page Tables (e.g., 2-level on 32-bit or 4-level on 64-bit x86-64). The outer page directory is loaded in the CPU CR3 register. Inner tables are allocated dynamically on-demand, saving enormous amounts of physical RAM.',
    importantTerminology: [
      { term: 'Page Table Entry (PTE)', definition: 'A hardware-read data record containing the Physical Frame Number (PFN) and status bits: Present/Absent, Read/Write, User/Kernel, Dirty, and Accessed.' },
      { term: 'Translation Lookaside Buffer (TLB)', definition: 'A small, blazing-fast associative hardware cache located directly on the CPU die that stores recent virtual-to-physical address translations.' },
      { term: 'Page Fault', definition: 'A hardware interrupt triggered by the MMU when a process attempts to access a virtual page whose Present bit in its PTE is 0 (i.e. swapped to disk).' },
      { term: 'Thrashing', definition: 'A critical state where physical memory is overcommitted and the OS spends virtually all its CPU time swapping pages to/from disk rather than executing application code.' },
    ],
    technicalArtifact: {
      type: 'diagram',
      title: '32-Bit Two-Level Paging Address Translation',
      content: `Virtual Address: [ 10 bits: Directory | 10 bits: Page Table | 12 bits: Offset ]
                      |                       |                      |
                      v                       |                      |
CR3 Register ----> [Page Directory]           |                      |
                     (1024 entries)           v                      |
                           |---------> [Page Table]                  |
                                       (1024 entries)                v
                                             |---------> [ Physical RAM Frame ] + [ Offset ]`,
      explanation: 'The CPU divides the 32-bit address into directory index, page table index, and offset, resolving addresses through pointer indirection while conserving memory.',
    },
    workedExamples: [
      {
        title: 'Calculating Effective Memory Access Time (EMAT) with TLB',
        scenario: 'A system has a TLB lookup time of 2 ns and main memory access time of 100 ns. The TLB hit ratio is 95%. Assume a single-level page table where a TLB miss requires one memory lookup for the page table plus one memory lookup for the data.',
        stepByStep: [
          'Case 1 (TLB Hit): Translation found in TLB (2 ns) + Data access in RAM (100 ns) = 102 ns.',
          'Case 2 (TLB Miss): TLB lookup (2 ns) + Page table lookup in RAM (100 ns) + Data access in RAM (100 ns) = 202 ns.',
          'Formula: EMAT = (Hit Ratio * Hit Time) + ((1 - Hit Ratio) * Miss Time).',
          'Calculate: EMAT = (0.95 * 102 ns) + (0.05 * 202 ns) = 96.9 ns + 10.1 ns = 107.0 ns.',
          'Conclusion: Even a small 5% miss rate increases effective memory latency by nearly 5% over pure physical RAM access.',
        ],
        takeaway: 'High TLB hit ratios (>98%) are critical for performance, which is why operating systems support Huge Pages (2 MB / 1 GB) for database engines to maximize TLB coverage.',
      },
    ],
    practicalApplications: [
      'Database engines like PostgreSQL and MySQL utilize mmap and huge pages to minimize TLB misses on large buffer pools.',
      'Fork() in Linux utilizes Copy-On-Write (COW) by marking child PTEs as read-only, avoiding copying physical memory until either parent or child writes.',
    ],
    commonMistakes: [
      {
        mistake: 'Assuming page size can be any arbitrary number of bytes.',
        whyWrong: 'Hardware MMUs strictly require page sizes to be powers of 2 (typically 4 KB, 2 MB, or 1 GB) so address splitting can be performed with zero-cost bit shifting.',
        correctWay: 'Always choose standard power-of-two page sizes supported by the target architecture.',
      },
    ],
    practiceExercises: [
      {
        title: 'Exercise: 64-Bit Address Space Page Calculation',
        problem: 'Given a 64-bit architecture with 4 KB page size, how many bits are used for the page offset, and how many bits remain for the virtual page number?',
        hint: '4 KB = 2^12 bytes.',
        solution: '4 KB = 2^12 bytes, so the page offset requires 12 bits. The remaining 64 - 12 = 52 bits are used for the virtual page number (typically 48 bits are physically implemented in 4-level paging).',
      },
    ],
    knowledgeCheck: [
      {
        question: 'What occurs when the CPU MMU attempts to translate an address and finds the Present bit in the PTE is 0?',
        options: ['The CPU executes a page fault trap into the OS kernel', 'The CPU permanently shuts down', 'The process memory is immediately wiped', 'The CPU reads all zeros into the register'],
        correctIndex: 0,
        explanation: 'A Present bit of 0 triggers a page fault exception interrupt. The OS page fault handler locates the page in swap space, loads it into an available frame, updates the PTE, and restarts the instruction.',
      },
    ],
    interviewPreparation: [
      {
        question: 'How does Copy-on-Write (COW) improve the performance of fork() in Unix-like operating systems?',
        modelAnswer: 'Instead of duplicating all memory pages when fork() is called, the OS duplicates only the page table pointers and marks the pages as read-only for both parent and child. If either writes to a page, a protection fault occurs, and the OS creates a copy of only that specific page. This makes fork() near-instantaneous when followed by exec().',
        recruiterTips: 'Emphasize page table duplication vs physical frame copying and protection fault handling.',
      },
    ],
    revisionNotes: [
      'Virtual addresses = Virtual Page Number (VPN) + Offset.',
      'TLB is an on-chip hardware cache for rapid translation; miss penalty requires page table walking.',
      'Copy-on-Write and demand paging make memory allocation fast and memory-efficient.',
    ],
  },

  // 2. ECE: Embedded Systems - Communication Protocols
  {
    moduleId: 'ece-mod-1',
    branch: 'Electronics and Communication Engineering',
    subject: 'Digital Electronics & Embedded Systems',
    title: 'Serial Communication Protocols: UART vs SPI vs I2C Architecture & Timing',
    estimatedMinutes: 28,
    difficulty: 'Medium',
    order: 1,
    learningObjectives: [
      'Compare bus topology, pin count, and transmission mechanics of UART, SPI, and I2C.',
      'Analyze clock synchronization, baud rate calculation, and framing errors.',
      'Understand open-drain configurations and pull-up resistor calculation in I2C.',
      'Select the right protocol for sensors, displays, and inter-chip telemetry.',
    ],
    prerequisites: ['Digital logic levels (TTL / CMOS)', 'Pull-up resistor fundamentals and Ohm’s Law'],
    conceptIntroduction:
      'Embedded microcontrollers communicate with sensors, memories, and actuators using serial protocols to minimize pin count. The three most essential hardware protocols tested in core placement drives are UART (Universal Asynchronous Receiver-Transmitter), SPI (Serial Peripheral Interface), and I2C (Inter-Integrated Circuit).',
    simpleDefinition:
      'UART is asynchronous point-to-point serial communication; SPI is high-speed synchronous full-duplex master-slave; I2C is a two-wire synchronous half-duplex multi-master bus with open-drain outputs.',
    detailedExplanation:
      'UART is asynchronous (no shared clock line) and point-to-point. SPI is synchronous (shared SCLK) and full-duplex using master-slave topology with dedicated Chip Select (CS/SS) lines for high speed (10-50+ MHz). I2C is synchronous, half-duplex, and uses only two open-drain bidirectional lines (SDA and SCL) with 7-bit addressing, supporting 128+ devices on a single bus with pull-up resistors.',
    importantTerminology: [
      { term: 'Baud Rate', definition: 'The rate of signal transitions per second. In standard UART without modulation, baud rate equals bits per second including start/stop framing.' },
      { term: 'Open-Drain', definition: 'An output circuit topology where a transistor can pull the line to ground (0V) or float high-impedance, requiring an external pull-up resistor to pull HIGH.' },
      { term: 'Clock Stretching (I2C)', definition: 'A mechanism where a slow slave pulls SCL LOW to pause the master until it completes processing.' },
      { term: 'Clock Polarity (CPOL) & Phase (CPHA)', definition: 'SPI parameters defining the idle clock state and which clock edge (rising or falling) latches data.' },
    ],
    technicalArtifact: {
      type: 'diagram',
      title: 'Hardware Protocol Comparison Matrix',
      content: `+----------+-------+------------+-------------+----------------------+
| Protocol | Wires | Duplex     | Clock Sync  | Typical Max Speed    |
+----------+-------+------------+-------------+----------------------+
| UART     | 2     | Full-Duplex| Asynchronous| 115.2 kbps - 1 Mbps  |
| SPI      | 4     | Full-Duplex| Synchronous | 10 Mbps - 50+ Mbps   |
| I2C      | 2     | Half-Duplex| Synchronous | 100 kHz - 3.4 Mbps   |
+----------+-------+------------+-------------+----------------------+`,
      explanation: 'Notice how UART relies on accurate local oscillators, while SPI and I2C carry their own master clock, making them immune to baud mismatch.',
    },
    workedExamples: [
      {
        title: 'Calculating I2C Pull-Up Resistor for a 400 kHz Fast-Mode Bus',
        scenario: 'Connecting an accelerometer and EEPROM over 400 kHz I2C. Total bus capacitance Cb = 150 pF. Supply VDD = 3.3V. Max allowed rise time tr = 300 ns. Output pin max sink current = 3 mA at Vol = 0.4V.',
        stepByStep: [
          'Rise time formula for RC circuit from 0.3 to 0.7 VDD: tr = 0.8473 * Rp * Cb.',
          'Solve for max Rp: Rp_max = tr / (0.8473 * Cb) = (300 * 10^-9) / (0.8473 * 150 * 10^-12) = 2360 Ohms (approx 2.36 kOhms).',
          'Solve for min Rp: Rp_min = (VDD - Vol) / Iol = (3.3V - 0.4V) / 3 mA = 966 Ohms.',
          'Conclusion: Select standard resistor between 1 kOhm and 2.2 kOhms (2.2 kOhm is standard).',
        ],
        takeaway: 'Too high resistance causes slow rising edges violating timing; too low pulls excessive current burning the open-drain transistor.',
      },
    ],
    practicalApplications: [
      'Automotive: UART connects GPS and cellular modems; SPI connects high-speed TFT clusters; I2C connects temperature and IMU sensors.',
    ],
    commonMistakes: [
      {
        mistake: 'Connecting UART TX to TX and RX to RX.',
        whyWrong: 'Both sides attempt to transmit on the same wire and listen on an un-driven pin.',
        correctWay: 'Cross the lines: TX of Device A goes to RX of Device B, and RX of Device A to TX of Device B.',
      },
    ],
    practiceExercises: [
      {
        title: 'Exercise: UART Frame Time Calculation',
        problem: 'How long does it take to transmit 1000 bytes over UART configured at 9600 baud, 8 data bits, no parity, 1 stop bit (8-N-1)?',
        hint: 'Each byte requires 1 start bit + 8 data bits + 1 stop bit = 10 bits.',
        solution: 'Total bits = 1000 * 10 = 10,000 bits. Time = 10,000 bits / 9600 bits/sec = 1.042 seconds.',
      },
    ],
    knowledgeCheck: [
      {
        question: 'Why does SPI scale to significantly higher transfer speeds than I2C?',
        options: ['SPI uses active push-pull drivers rather than passive open-drain pull-up resistors', 'SPI transmits analog voltages', 'SPI requires no clock signal', 'SPI uses radio frequency'],
        correctIndex: 0,
        explanation: 'Push-pull drivers actively drive lines HIGH and LOW in nanoseconds, whereas I2C relies on passive pull-up resistors with slower RC time constants.',
      },
    ],
    interviewPreparation: [
      {
        question: 'When would you choose I2C over SPI for a multi-sensor wearable device?',
        modelAnswer: 'I2C is preferred when pin count and board routing space are strictly limited. It supports dozens of devices over just 2 shared lines (SDA/SCL) via software addressing, whereas SPI requires a dedicated Chip Select (CS) pin for each additional peripheral.',
        recruiterTips: 'Mention pin count economy, board routing area, and slave addressing.',
      },
    ],
    revisionNotes: [
      'UART = 2 wires, asynchronous, point-to-point.',
      'SPI = 4 wires (MOSI, MISO, SCLK, CS), synchronous, full-duplex, fast.',
      'I2C = 2 wires (SDA, SCL), open-drain, pull-ups required, 7-bit addressing.',
    ],
  },

  // 3. EEE: Power Systems - Transmission Line Modeling & Faults
  {
    moduleId: 'eee-mod-1',
    branch: 'Electrical and Electronics Engineering',
    subject: 'Electrical Machines & Power Systems',
    title: 'Transmission Line ABCD Parameters, Ferranti Effect & Symmetrical Faults',
    estimatedMinutes: 30,
    difficulty: 'Medium',
    order: 1,
    learningObjectives: [
      'Classify transmission lines as Short, Medium, or Long based on length and operating frequency.',
      'Derive and calculate two-port ABCD transmission matrix parameters.',
      'Explain the physical mechanism of the Ferranti Effect under light-load or no-load conditions.',
      'Analyze balanced 3-phase symmetrical short-circuit faults using per-unit systems.',
    ],
    prerequisites: ['AC circuit phasor analysis', 'Complex power (P + jQ)', 'Transformers and per-unit representations'],
    conceptIntroduction:
      'High-voltage electric power transmission lines transport vast bulk energy across hundreds of kilometers. Understanding line inductance, capacitance, and impedance modeling is essential for ensuring grid stability, voltage regulation, and sizing protection switchgear.',
    simpleDefinition:
      'Transmission line modeling uses two-port network ABCD matrices relating sending-end voltage and current to receiving-end voltage and current: Vs = A*Vr + B*Ir and Is = C*Vr + D*Ir.',
    detailedExplanation:
      'Transmission lines are categorized by length:\n- Short lines (< 80 km): Capacitance is neglected. Modeled as simple series R + jX.\n- Medium lines (80 km - 240 km): Capacitance is lumped using Nominal-T or Nominal-Pi models.\n- Long lines (> 240 km): Line parameters (R, L, C, G) are distributed uniformly per unit length using hyperbolic functions.\n\nFor any symmetrical, passive, reciprocal transmission line: A = D and AD - BC = 1.',
    importantTerminology: [
      { term: 'Ferranti Effect', definition: 'The phenomenon where receiving-end voltage Vr exceeds sending-end voltage Vs under no-load or lightly loaded conditions due to line charging capacitive current flowing through line inductance.' },
      { term: 'Surge Impedance Loading (SIL)', definition: 'The electric power delivered when the reactive power generated by line capacitance exactly balances the reactive power consumed by line inductance: SIL = (V_L)^2 / Zc.' },
      { term: 'Per-Unit (pu) System', definition: 'A normalized dimensionless system expressing electrical quantities as fractions of defined base values: Value_pu = Actual_value / Base_value.' },
    ],
    technicalArtifact: {
      type: 'formula',
      title: 'Nominal-Pi Transmission Two-Port Matrix',
      content: `Vs = (1 + Y*Z / 2) * Vr + Z * Ir
Is = Y * (1 + Y*Z / 4) * Vr + (1 + Y*Z / 2) * Ir

A = 1 + (Y * Z) / 2
B = Z
C = Y * [ 1 + (Y * Z) / 4 ]
D = A = 1 + (Y * Z) / 2

Condition for reciprocity: A*D - B*C = 1`,
      explanation: 'The Nominal-Pi model splits line shunt admittance into two equal Y/2 branches at sending and receiving ends with series impedance Z in the middle.',
    },
    workedExamples: [
      {
        title: 'Calculating Surge Impedance and SIL of a 400 kV Line',
        scenario: 'A 3-phase, 400 kV, 50 Hz transmission line has series inductance L = 1.0 mH/km and shunt capacitance C = 0.01 uF/km. Calculate its Surge Impedance Zc and Surge Impedance Loading (SIL).',
        stepByStep: [
          'Surge impedance Zc = sqrt(L / C) = sqrt((1.0 * 10^-3 H) / (0.01 * 10^-6 F)) = sqrt(100,000) = 316.2 Ohms.',
          'SIL formula: SIL = (Line-to-Line Voltage)^2 / Zc.',
          'Substitute: SIL = (400 * 10^3 V)^2 / 316.2 Ohms = (160 * 10^9) / 316.2 = 506 * 10^6 W = 506 MW.',
          'Conclusion: If loaded below 506 MW, the line produces net reactive power (voltage rises); if loaded above 506 MW, it absorbs net reactive power (voltage drops).',
        ],
        takeaway: 'Surge impedance is independent of line length, depending only on conductor geometry and spacing.',
      },
    ],
    practicalApplications: [
      'Shunt reactors (inductors) are installed at receiving ends of EHV/UHV lines to absorb capacitive reactive power and counteract the Ferranti Effect during low demand.',
    ],
    commonMistakes: [
      {
        mistake: 'Using line-to-neutral voltage in the 3-phase SIL formula.',
        whyWrong: 'The formula SIL = V^2 / Zc uses rated line-to-line voltage to compute total 3-phase active power directly.',
        correctWay: 'Always use line-to-line kV in the numerator when calculating 3-phase SIL in MW.',
      },
    ],
    practiceExercises: [
      {
        title: 'Exercise: Verify Line Reciprocity',
        problem: 'A line has A = 0.98 + j0.02, B = 20 + j80, C = j0.0005. If symmetrical (A = D), verify the value of AD - BC.',
        hint: 'Compute A^2 - B*C.',
        solution: 'A^2 = (0.98+j0.02)^2 = 0.960 + j0.0392. B*C = (20+j80)*(j0.0005) = -0.040 + j0.010. AD - BC = 0.960 - (-0.040) + j(0.0392 - 0.010) = 1.0 + j0.029 (approx 1.0 within rounding).',
      },
    ],
    knowledgeCheck: [
      {
        question: 'What compensation device is utilized to mitigate the Ferranti Effect on long unloaded transmission lines?',
        options: ['Shunt Reactors', 'Series Capacitors', 'Shunt Capacitors', 'Rotary Synchronous Condensers delivering leading VARs'],
        correctIndex: 0,
        explanation: 'Shunt reactors (inductive coils connected in parallel) absorb the excess leading capacitive charging VARs, preventing voltage rise at the receiving end.',
      },
    ],
    interviewPreparation: [
      {
        question: 'Explain why the Ferranti Effect does not occur on short transmission lines.',
        modelAnswer: 'Short transmission lines (< 80 km) operate with negligible shunt capacitance. Without significant capacitive charging current flowing through the line series inductive reactance, the reactive voltage drop is zero, preventing the receiving-end voltage from exceeding sending-end voltage.',
        recruiterTips: 'State the length threshold (<80 km) and the absence of shunt capacitance charging current.',
      },
    ],
    revisionNotes: [
      'Short: R + jX. Medium: Nominal-T or Nominal-Pi. Long: Distributed parameters.',
      'Reciprocal lines: AD - BC = 1. Symmetrical lines: A = D.',
      'Ferranti effect: Vr > Vs at no load. Mitigated by shunt reactors.',
    ],
  },

  // 4. Mechanical: Thermodynamics & Thermal Systems
  {
    moduleId: 'mech-mod-1',
    branch: 'Mechanical Engineering',
    subject: 'Thermodynamics & Thermal Engineering',
    title: 'First & Second Laws, Carnot Efficiency, Entropy & Power Cycles',
    estimatedMinutes: 30,
    difficulty: 'Medium',
    order: 1,
    learningObjectives: [
      'Apply First Law of Thermodynamics energy balances to open and closed control volumes.',
      'Explain the Second Law: Clausius and Kelvin-Planck statements and the concept of irreversibility.',
      'Calculate Carnot cycle efficiency and maximum theoretical coefficient of performance (COP).',
      'Analyze the Rankine steam cycle with superheat and reheat modifications.',
    ],
    prerequisites: ['Basic physics (work, heat, temperature in Kelvin)', 'Calculus and differential equations'],
    conceptIntroduction:
      'Thermodynamics governs energy transformation, heat transfer, and mechanical work. From steam power stations and internal combustion engines to jet turbines and refrigeration plants, mastering cyclic processes and entropy generation is the cornerstone of mechanical engineering.',
    simpleDefinition:
      'The First Law states that energy cannot be created or destroyed (conservation of energy: dU = dQ - dW); the Second Law dictates that heat naturally flows from hot to cold, and entropy of an isolated system always increases (irreversibility).',
    detailedExplanation:
      'The Kelvin-Planck statement establishes that it is impossible for any heat engine operating in a cycle to convert all absorbed heat into net work without rejecting heat to a lower-temperature sink. The Carnot heat engine represents the ideal, reversible upper-bound efficiency between two thermal reservoirs:\neta_Carnot = 1 - (T_cold / T_hot), where temperatures are expressed in absolute Kelvin.\n\nIn practical power generation, the Rankine cycle uses water as a working fluid. Superheating steam before entering the turbine eliminates blade moisture erosion, while reheat increases thermal efficiency.',
    importantTerminology: [
      { term: 'Entropy (S)', definition: 'A thermodynamic property measuring microscopic disorder and unavailable energy: dS = dQ_rev / T. In irreversible processes, dS_total > 0.' },
      { term: 'Isentropic Process', definition: 'An idealized process that is both reversible and adiabatic (zero heat transfer), resulting in constant entropy (s1 = s2).' },
      { term: 'Coefficient of Performance (COP)', definition: 'The ratio of desired heating or cooling output to required work input in a refrigeration or heat pump cycle.' },
    ],
    technicalArtifact: {
      type: 'formula',
      title: 'Carnot Heat Engine & Refrigerator Efficiencies',
      content: `Heat Engine Efficiency:
eta_Carnot = (W_net / Q_hot) = 1 - (T_cold / T_hot)

Refrigerator COP:
COP_R = Q_cold / W_net = T_cold / (T_hot - T_cold)

Heat Pump COP:
COP_HP = Q_hot / W_net = T_hot / (T_hot - T_cold) = COP_R + 1

*Note: All temperatures T must strictly be in Kelvin (K = °C + 273.15)*`,
      explanation: 'Notice that COP of a heat pump is always strictly greater than COP of a refrigerator by exactly 1.',
    },
    workedExamples: [
      {
        title: 'Evaluating an Inventor’s Heat Engine Claim',
        scenario: 'An inventor claims to have built an engine operating between a boiler at 527 °C and a river at 27 °C that receives 100 kW of thermal heat and produces 65 kW of electrical work. Determine if the claim violates the Second Law.',
        stepByStep: [
          'Convert temperatures to Kelvin: T_hot = 527 + 273.15 = 800 K. T_cold = 27 + 273.15 = 300 K.',
          'Calculate maximum possible Carnot efficiency: eta_max = 1 - (300 / 800) = 1 - 0.375 = 0.625 (62.5%).',
          'Calculate claimed efficiency: eta_claimed = Work / Heat_in = 65 kW / 100 kW = 0.65 (65.0%).',
          'Comparison: Claimed efficiency (65%) exceeds the absolute Carnot theoretical limit (62.5%).',
          'Conclusion: The claim is thermodynamically impossible and violates the Second Law.',
        ],
        takeaway: 'No real heat engine can ever exceed or even match Carnot efficiency due to internal fluid friction, turbulence, and heat leakage.',
      },
    ],
    practicalApplications: [
      'Modern supercritical coal and gas-fired combined-cycle power stations operate at temperatures above 600 °C to push Rankine/Brayton thermal efficiencies towards 60%.',
    ],
    commonMistakes: [
      {
        mistake: 'Using temperatures in Celsius when calculating Carnot efficiency.',
        whyWrong: 'Thermodynamic ratios depend strictly on absolute zero. (1 - 27/527) = 0.948 (95%), which is entirely incorrect.',
        correctWay: 'Always add 273.15 to convert Celsius to Kelvin before dividing.',
      },
    ],
    practiceExercises: [
      {
        title: 'Exercise: Heat Pump Work Calculation',
        problem: 'A Carnot heat pump delivers 15 kW of heat to maintain a building at 21 °C (294 K) when outside ambient is -9 °C (264 K). What minimum electrical power is required?',
        hint: 'COP_HP = T_hot / (T_hot - T_cold). Work = Heat / COP.',
        solution: 'COP_HP = 294 / (294 - 264) = 294 / 30 = 9.8. Work = 15 kW / 9.8 = 1.53 kW.',
      },
    ],
    knowledgeCheck: [
      {
        question: 'Which statement accurately describes an isentropic process?',
        options: ['Reversible and Adiabatic', 'Constant temperature and pressure', 'Zero work and zero heat', 'Irreversible with constant enthalpy'],
        correctIndex: 0,
        explanation: 'Because dS = dQ_rev / T, an adiabatic process (dQ = 0) that is also internally reversible has dS = 0, meaning entropy remains constant (isentropic).',
      },
    ],
    interviewPreparation: [
      {
        question: 'Why does reheating steam between high-pressure and low-pressure turbine stages improve Rankine cycle performance?',
        modelAnswer: 'Reheating increases the average temperature of heat addition, raising Carnot efficiency. Crucially, it also increases the steam quality at turbine exhaust, preventing condensation moisture droplets from causing catastrophic erosion of turbine blades.',
        recruiterTips: 'Mention both thermal efficiency improvement and blade moisture protection.',
      },
    ],
    revisionNotes: [
      '1st Law: Conservation of Energy (dU = dQ - dW).',
      '2nd Law: Kelvin-Planck and Clausius statements; entropy always increases in real systems.',
      'Carnot Limit: eta = 1 - (Tc / Th). Temperatures MUST be in Kelvin.',
    ],
  },

  // 5. Chemical: Chemical Reaction Engineering - Reactor Design
  {
    moduleId: 'che-mod-1',
    branch: 'Chemical Engineering',
    subject: 'Chemical Reaction Engineering & Plant Design',
    title: 'Reaction Kinetics, Rate Laws & Design Equations for Batch, CSTR & PFR',
    estimatedMinutes: 30,
    difficulty: 'Medium',
    order: 1,
    learningObjectives: [
      'Derive and compare ideal design performance equations for Batch, CSTR, and PFR reactors.',
      'Analyze reaction order, rate constant Arrhenius temperature dependence, and activation energy.',
      'Evaluate reactor volume requirements for equal fractional conversion of liquid-phase reactions.',
      'Understand reactor staging (CSTRs in series vs PFR) for positive and auto-catalytic kinetics.',
    ],
    prerequisites: ['Differential calculus and integration', 'Stoichiometry and chemical equilibrium'],
    conceptIntroduction:
      'Chemical reaction engineering deals with the sizing and operational design of vessels where raw chemical species are transformed into high-value products. Choosing the optimal combination of Continuous Stirred-Tank Reactors (CSTR) or Plug Flow Reactors (PFR) directly dictates plant capital costs, product yield, and selectivity.',
    simpleDefinition:
      'A CSTR operates under perfect spatial mixing with homogeneous internal concentration identical to the exit stream; a PFR operates with no axial mixing, with concentration dropping continuously along its length.',
    detailedExplanation:
      'For an irreversible reaction A -> Products with rate law -rA = k * Ca^n (where n > 0):\n- In a CSTR, the reaction takes place entirely at the lowest concentration (the exit concentration Ca_out), meaning the reaction rate is at its minimum throughout the vessel. Consequently, a CSTR requires a much larger volume than a PFR to achieve the same conversion.\n- In a PFR, reactants enter at high concentration Ca0, starting at maximum rate and decaying along the tube.\n- As the number of equal-sized CSTRs in series approaches infinity (N -> inf), their combined performance converges exactly to that of a single ideal PFR.',
    importantTerminology: [
      { term: 'Space Time (tau)', definition: 'The time required to process one reactor volume of feed measured at entering conditions: tau = V / v0, where V is reactor volume and v0 is volumetric flow rate.' },
      { term: 'Space Velocity (s)', definition: 'The reciprocal of space time (s = 1 / tau = v0 / V), measuring the number of reactor volumes of feed processed per unit time.' },
      { term: 'Activation Energy (Ea)', definition: 'The minimum energy barrier that colliding molecules must possess for a reaction to occur: k = A * exp(-Ea / (R * T)).' },
    ],
    technicalArtifact: {
      type: 'formula',
      title: 'Ideal Reactor Design Equations',
      content: `Batch Reactor:
t = Na0 * Integral[ dXa / (-rA * V) ] from 0 to Xa

CSTR (Continuous Stirred Tank Reactor):
V_CSTR = (F_A0 * Xa) / (-rA_exit) = [ v0 * Ca0 * Xa ] / (-rA_exit)

PFR (Plug Flow Reactor):
V_PFR = F_A0 * Integral[ dXa / (-rA) ] from 0 to Xa

*Key Insight for n > 0: V_CSTR > V_PFR for identical conversion*`,
      explanation: 'The CSTR volume is represented graphically by a rectangle on a Levenspiel plot [Xa vs 1/(-rA)], whereas PFR volume is the smaller area under the curve.',
    },
    workedExamples: [
      {
        title: 'Comparing CSTR vs PFR Volume for a 1st Order Reaction',
        scenario: 'A liquid-phase first-order reaction (-rA = k*Ca) achieves 80% conversion (Xa = 0.8). Calculate the ratio of required CSTR volume to PFR volume.',
        stepByStep: [
          'For 1st order CSTR: tau_CSTR = Xa / [ k * (1 - Xa) ] = 0.8 / [ k * (1 - 0.8) ] = 0.8 / (0.2 * k) = 4 / k.',
          'For 1st order PFR: tau_PFR = (1 / k) * ln(1 / (1 - Xa)) = (1 / k) * ln(1 / 0.2) = (1 / k) * ln(5) = 1.609 / k.',
          'Volume ratio: V_CSTR / V_PFR = tau_CSTR / tau_PFR = (4 / k) / (1.609 / k) = 4 / 1.609 = 2.486.',
          'Conclusion: The CSTR requires nearly 2.5 times larger volume than a PFR to accomplish the identical 80% conversion.',
        ],
        takeaway: 'For positive-order kinetics, PFR is always more volume-efficient than a single CSTR because it maintains higher average reactant concentrations.',
      },
    ],
    practicalApplications: [
      'Polymer synthesis and fermentation often utilize CSTRs to ensure uniform temperature and prevent thermal runaway; petrochemical cracking and gas-phase hydrocarbon conversions use tubular PFRs.',
    ],
    commonMistakes: [
      {
        mistake: 'Evaluating the rate law in a CSTR design equation at initial concentration Ca0.',
        whyWrong: 'Because of perfect mixing, the reactant concentration inside a CSTR is uniform and equal to the outlet concentration Ca.',
        correctWay: 'Always evaluate -rA in the CSTR equation at the exit concentration Ca_exit = Ca0 * (1 - Xa).',
      },
    ],
    practiceExercises: [
      {
        title: 'Exercise: Arrhenius Reaction Rate Doubling',
        problem: 'By approximately how much does the rate of a typical chemical reaction increase for every 10 °C rise in temperature near room temperature?',
        hint: 'Rule of thumb in chemical kinetics.',
        solution: 'For reactions with moderate activation energy (~50 kJ/mol), a 10 °C rise in temperature approximately doubles the rate constant k (2x increase).',
      },
    ],
    knowledgeCheck: [
      {
        question: 'What occurs to the performance of N identical CSTRs connected in series as N approaches infinity?',
        options: ['It converges to the performance of an ideal PFR', 'The conversion drops to zero', 'The total volume required becomes infinite', 'It behaves like an isothermal batch reactor with infinite time'],
        correctIndex: 0,
        explanation: 'Each small CSTR operates at a slightly lower concentration. In the limit as N -> infinity, the step-wise concentration drop becomes continuous, perfectly matching a PFR.',
      },
    ],
    interviewPreparation: [
      {
        question: 'Under what specific kinetic condition is a CSTR smaller in volume than a PFR for the same conversion?',
        modelAnswer: 'For auto-catalytic reactions or reactions with negative order kinetics (where rate increases as reactant concentration decreases), a CSTR is smaller than a PFR because the CSTR operates at the exit concentration where the reaction rate is at its peak.',
        recruiterTips: 'Mention auto-catalytic reactions and Levenspiel plot shape.',
      },
    ],
    revisionNotes: [
      'Batch: Unsteady state. CSTR: Perfect mixing, evaluated at exit conditions.',
      'PFR: No axial mixing, plug flow, volume is integral under 1/(-rA).',
      'For n > 0: V_CSTR > V_PFR. For autocatalytic: CSTR can be smaller than PFR.',
    ],
  },

  // 6. Civil: Structural Analysis - Bending Moments & Shear
  {
    moduleId: 'civ-mod-1',
    branch: 'Civil Engineering',
    subject: 'Structural Analysis & Concrete Mechanics',
    title: 'Shear Force & Bending Moment Diagrams (SFD/BMD) and Beam Deflections',
    estimatedMinutes: 30,
    difficulty: 'Medium',
    order: 1,
    learningObjectives: [
      'Construct Shear Force Diagrams (SFD) and Bending Moment Diagrams (BMD) for diverse beam loading conditions.',
      'Identify points of contraflexure (inflection) and locate maximum bending moments.',
      'Derive and apply differential equilibrium relations: dV/dx = -w and dM/dx = V.',
      'Calculate elastic beam deflections using Macaulay’s method and Moment-Area theorems.',
    ],
    prerequisites: ['Static equilibrium (Sum Fx=0, Sum Fy=0, Sum M=0)', 'Basic integration and mechanics of materials'],
    conceptIntroduction:
      'Beams are structural members designed to carry transverse lateral loads. Determining the distribution of internal shear forces and bending moments along the member span is the foundational step before sizing concrete reinforcement or selecting structural steel I-beams.',
    simpleDefinition:
      'A Shear Force Diagram (SFD) plots internal vertical shearing force along a beam; a Bending Moment Diagram (BMD) plots internal bending moment. The maximum bending moment occurs where shear force equals zero or changes sign.',
    detailedExplanation:
      'The fundamental differential relationships between distributed load w(x), shear force V(x), and bending moment M(x) are:\n1. dV/dx = -w(x) -> The slope of the SFD at any point equals the negative of the distributed load.\n2. dM/dx = V(x) -> The slope of the BMD at any point equals the shear force.\n3. Integral[ V(x) dx ] = Delta M -> The area under the shear force diagram between two points equals the change in bending moment between those points.\n\nPoints where the bending moment changes sign (M = 0) are called Points of Contraflexure (or inflection points), indicating where curvature shifts from sagging to hogging.',
    importantTerminology: [
      { term: 'Point of Contraflexure', definition: 'A location along a flexural member where the bending moment changes sign from positive (sagging) to negative (hogging), signifying zero curvature.' },
      { term: 'Flexural Rigidity (EI)', definition: 'The product of modulus of elasticity (E) and area moment of inertia (I), representing a beam’s resistance to bending deflection.' },
      { term: 'Sagging vs Hogging', definition: 'Sagging bending produces compression in top fibers and tension in bottom fibers (positive); hogging produces tension in top and compression in bottom (negative).' },
    ],
    technicalArtifact: {
      type: 'formula',
      title: 'Standard Simply Supported Beam Formulas (Span L, Load w or P)',
      content: `Uniformly Distributed Load (UDL = w):
Reactions: Ra = Rb = w * L / 2
Max Shear Force: V_max = w * L / 2 (at supports)
Max Bending Moment: M_max = (w * L^2) / 8 (at midspan L/2)
Max Midspan Deflection: delta_max = 5 * w * L^4 / (384 * E * I)

Central Point Load (P):
Reactions: Ra = Rb = P / 2
Max Bending Moment: M_max = (P * L) / 4 (at midspan)
Max Midspan Deflection: delta_max = P * L^3 / (48 * E * I)`,
      explanation: 'These classic beam solutions form the baseline checks used by civil and structural engineers to verify complex computer FEA models.',
    },
    workedExamples: [
      {
        title: 'Locating Maximum Bending Moment on an Overhanging Beam',
        scenario: 'A beam ABC of length 6 m has supports at A (left end) and B (4 m from A), with a 2 m cantilever overhang BC. A UDL of 10 kN/m acts over the entire 6 m length. Find the maximum sagging and hogging moments.',
        stepByStep: [
          'Calculate total load: 10 kN/m * 6 m = 60 kN acting at 3 m from A.',
          'Take moment about support A: Sum M_A = 0 -> (R_B * 4 m) - (60 kN * 3 m) = 0 -> R_B = 180 / 4 = 45 kN.',
          'Calculate support reaction A: R_A = 60 kN - 45 kN = 15 kN.',
          'Find location of zero shear between A and B: V(x) = R_A - w*x = 15 - 10*x = 0 -> x = 1.5 m from support A.',
          'Calculate maximum sagging moment at x = 1.5 m: M_sagging = (15 * 1.5) - (10 * 1.5^2 / 2) = 22.5 - 11.25 = +11.25 kNm.',
          'Calculate maximum hogging moment at support B (x = 4 m): M_hogging = (15 * 4) - (10 * 4^2 / 2) = 60 - 80 = -20.0 kNm.',
          'Conclusion: Max bending moment is 20 kNm (hogging) at support B. Tensile steel must be placed in the top of the beam over the support.',
        ],
        takeaway: 'In continuous and overhanging beams, maximum moments often occur over interior supports rather than midspan.',
      },
    ],
    practicalApplications: [
      'Structural engineers design steel reinforcement bars in concrete beams: bottom bars resist midspan sagging tension, while top bars resist support hogging tension.',
    ],
    commonMistakes: [
      {
        mistake: 'Assuming maximum bending moment always occurs at the geometric center of the beam.',
        whyWrong: 'For asymmetric loading, moving loads, or overhanging spans, zero shear (and hence maximum moment) shifts away from midspan.',
        correctWay: 'Always solve for x where V(x) = 0 by setting the shear equation to zero.',
      },
    ],
    practiceExercises: [
      {
        title: 'Exercise: Cantilever Beam Moment Calculation',
        problem: 'A cantilever beam of length L = 3 m is fixed at support A and carries a tip load P = 20 kN at free end B. What is the maximum bending moment and where does it occur?',
        hint: 'Moment is force times distance to fixed support.',
        solution: 'Max moment occurs at the fixed support A: M = P * L = 20 kN * 3 m = -60 kNm (hogging moment causing tension on top).',
      },
    ],
    knowledgeCheck: [
      {
        question: 'At what point does the maximum bending moment occur on a statically determinate beam?',
        options: ['At the point where the shear force is zero or changes sign', 'At the left-most support', 'At the point of minimum deflection', 'At the point of contraflexure'],
        correctIndex: 0,
        explanation: 'Because dM/dx = V, the derivative of bending moment with respect to distance is shear force. Therefore, the mathematical extrema of moment (dM/dx = 0) occurs where shear force is zero.',
      },
    ],
    interviewPreparation: [
      {
        question: 'What is a point of contraflexure and why is it critical when detailing reinforced concrete beams?',
        modelAnswer: 'A point of contraflexure is where the bending moment equals zero as it transitions from sagging (positive) to hogging (negative). At this point, curvature reverses, and the tension zone shifts from the bottom of the beam to the top, dictating where reinforcement bars must be curtailed or cranked upward.',
        recruiterTips: 'Mention zero curvature, moment sign change, and tensile steel relocation.',
      },
    ],
    revisionNotes: [
      'dV/dx = -w, dM/dx = V. Max moment occurs where V = 0.',
      'Simply supported with UDL: M_max = w*L^2 / 8; delta = 5*w*L^4 / (384*EI).',
      'Point of contraflexure: M = 0 where moment changes sign.',
    ],
  },
];

// Main Seed Function
export async function seedDatabase(options: { forceFresh?: boolean } = {}) {
  const connected = await connectDatabase();
  if (!connected) {
    console.error('[NEXORA Seed] Cannot run seed without an active MongoDB connection.');
    return false;
  }

  console.log('[NEXORA Seed] Starting automated database verification and seeding...');

  try {
    // 1. Initial Administrator Setup
    const adminUsername = (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase();
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@nexora.edu').trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminSecurePass2026!';

    let admin = await User.findOne({
      $or: [{ username: adminUsername }, { email: adminEmail }],
    });

    if (!admin) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      admin = new User({
        name: 'System Administrator',
        username: adminUsername,
        email: adminEmail,
        passwordHash,
        role: 'admin',
        isActive: true,
        branch: 'Computer Science and Engineering',
        targetRole: 'Software Developer',
        degree: 'Master of Technology',
        college: 'NEXORA Engineering Institute',
        onboarded: true,
      });
      await admin.save();

      const today = new Date().toISOString().split('T')[0];
      const adminProgress = new UserProgress({
        userId: admin._id,
        completedLessons: [],
        completedModules: [],
        bookmarks: [],
        notes: [],
        quizAttempts: [],
        streak: { currentStreak: 1, longestStreak: 1, lastActivityDate: today, activityDates: [today] },
      });
      await adminProgress.save();

      console.log(`[NEXORA Seed] Initial administrator created: ${adminUsername} (${adminEmail})`);
    } else {
      console.log(`[NEXORA Seed] Administrator account verified: ${admin.username}`);
    }

    // 2. Career Roles Catalogue (26+ Roles)
    const existingRolesCount = await RoleCatalogue.countDocuments();
    if (existingRolesCount === 0 || options.forceFresh) {
      if (options.forceFresh) await RoleCatalogue.deleteMany({});
      await RoleCatalogue.insertMany(CAREER_ROLES);
      console.log(`[NEXORA Seed] Successfully seeded ${CAREER_ROLES.length} engineering career roles into RoleCatalogue.`);
    } else {
      console.log(`[NEXORA Seed] RoleCatalogue already contains ${existingRolesCount} roles. Skipping re-insertion.`);
    }

    // 3. Structured Learning Modules across branches (CSE + Core Branches)
    const combinedModules = [...LEARNING_MODULES_DATA, ...ADDITIONAL_STUDY_MODULES];
    if (options.forceFresh) {
      await LearningModule.deleteMany({});
      await LearningModule.insertMany(combinedModules);
      console.log(`[NEXORA Seed] Freshly inserted ${combinedModules.length} structured branch learning modules.`);
    } else {
      // Upsert each module by moduleId to ensure new modules are added without deleting existing user progress
      for (const mod of combinedModules) {
        await LearningModule.findOneAndUpdate(
          { moduleId: mod.moduleId },
          { $set: mod },
          { upsert: true, new: true }
        );
      }
      const totalModulesCount = await LearningModule.countDocuments();
      console.log(`[NEXORA Seed] Upserted learning modules. Collection now contains ${totalModulesCount} comprehensive engineering modules.`);
    }

    // 4. Large Question Bank with Randomized Quizzes
    // Target: At least 70 Easy, 70 Medium, 70 Hard questions for each supported subject!
    const existingQuestionsCount = await Question.countDocuments();
    console.log(`[NEXORA Seed] Current questions in question bank: ${existingQuestionsCount}`);

    // Total target: 17 subjects * 210 = 3,570 questions
    const expectedMinimum = SUBJECT_DEFINITIONS.length * 210;

    if (existingQuestionsCount < expectedMinimum || options.forceFresh) {
      if (options.forceFresh) {
        await Question.deleteMany({});
        console.log('[NEXORA Seed] Cleared old question bank for fresh import.');
      }

      console.log(`[NEXORA Seed] Generating comprehensive question bank (70 Easy, 70 Med, 70 Hard per subject across 17 subjects)...`);
      const allQuestions = generateQuestionBank();
      console.log(`[NEXORA Seed] Generated ${allQuestions.length} validated technical questions.`);

      // Batch insert in chunks of 500 for optimal memory and write throughput
      const CHUNK_SIZE = 500;
      let insertedCount = 0;
      for (let i = 0; i < allQuestions.length; i += CHUNK_SIZE) {
        const chunk = allQuestions.slice(i, i + CHUNK_SIZE);
        await Question.insertMany(chunk, { ordered: false });
        insertedCount += chunk.length;
        console.log(`[NEXORA Seed] Inserted batch: ${insertedCount} / ${allQuestions.length} questions.`);
      }

      console.log(`[NEXORA Seed] Question bank generation and import completed successfully: ${insertedCount} questions stored.`);
    } else {
      console.log(`[NEXORA Seed] Question bank is already fully seeded with ${existingQuestionsCount} questions. No regeneration needed.`);
    }

    console.log('[NEXORA Seed] Database seeding and integrity verification completed successfully.');
    return true;
  } catch (err: any) {
    console.error('[NEXORA Seed] Error during database seeding:', err);
    return false;
  }
}

// Allow direct CLI invocation: npx tsx server/seed.ts [--fresh]
if (process.argv[1]?.includes('seed.ts')) {
  const forceFresh = process.argv.includes('--fresh');
  seedDatabase({ forceFresh })
    .then(() => {
      console.log('[NEXORA Seed] CLI execution finished.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[NEXORA Seed] CLI fatal error:', err);
      process.exit(1);
    });
}

