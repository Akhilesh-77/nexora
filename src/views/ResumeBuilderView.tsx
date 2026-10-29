import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  Printer,
  Wand2,
  ExternalLink,
  Save,
  RotateCcw,
  Layout,
  Layers,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { aiService } from '../services/aiService';
import { CinematicBackground } from '../components/CinematicBackground';

export const ResumeBuilderView: React.FC = () => {
  const { resumeData, updateResumeData, profile } = useApp();

  const [activeTab, setActiveTab] = useState<'contact' | 'education' | 'skills' | 'projects' | 'experience' | 'extras'>('contact');
  const [isPolishing, setIsPolishing] = useState(false);
  const [polishMessage, setPolishMessage] = useState<string | null>(null);

  // AI Resume Bullet Polish
  const handleAiPolishBullets = async (section: string, currentText: string, onApply: (revised: string) => void) => {
    setIsPolishing(true);
    setPolishMessage('Analyzing bullet points with recruiter benchmarks...');
    try {
      const res = await aiService.enhanceResumeSection({
        text: currentText,
        targetRole: profile.targetRole || 'Software Engineer',
        section,
      });

      if (res && res.improvedText) {
        onApply(res.improvedText);
        setPolishMessage('Enhanced with high-impact action verbs and quantified structure!');
        setTimeout(() => setPolishMessage(null), 3500);
      }
    } catch (e) {
      setPolishMessage('Could not polish at this moment.');
    } finally {
      setIsPolishing(false);
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const currentTemplate = resumeData.template || 'modern';

  return (
    <CinematicBackground variant="dashboard" className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="card-cinematic p-6 sm:p-8 rounded-3xl relative overflow-hidden print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950/60 dark:text-cyan-400 border border-indigo-200 dark:border-indigo-800/60 mb-2">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Recruiter-Approved Resume Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202334] dark:text-white tracking-tight">
              One-Page Placement Resume Builder
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Select an industry template, edit your academic achievements, polish project bullets with AI, and export print-ready PDFs.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                const defaultResume = {
                  fullName: profile.name || 'Akhilesh',
                  email: `${(profile.name || 'akhilesh').toLowerCase()}@campus.edu`,
                  phone: '+91 98765 43210',
                  location: `${profile.college || 'National Institute of Engineering'}, India`,
                  linkedin: `linkedin.com/in/${(profile.name || 'akhilesh').toLowerCase()}`,
                  github: `github.com/${(profile.name || 'akhilesh').toLowerCase()}-dev`,
                  portfolio: `${(profile.name || 'akhilesh').toLowerCase()}.dev`,
                  summary: `Pre-final year ${profile.degree || 'B.Tech.'} student specializing in ${profile.branch || 'Engineering'}. Aspiring to excel as a ${profile.targetRole || 'Software Engineer'}.`,
                  education: [
                    {
                      id: 'edu-1',
                      institution: profile.college || 'National Institute of Engineering',
                      degree: profile.degree || 'Bachelor of Technology (B.Tech.)',
                      field: profile.branch || 'Engineering',
                      startYear: '2022',
                      endYear: profile.gradYear || '2026',
                      score: `${profile.cgpa || '8.7'} CGPA`,
                    },
                  ],
                  skills: [
                    { category: 'Technical Proficiencies', items: 'Python, C++, Java, SQL, Git' },
                    { category: 'Core Subjects', items: 'Data Structures, OS, Database Management, Networks' },
                  ],
                  projects: [
                    {
                      id: 'proj-1',
                      title: 'Engineering Placement Portal',
                      technologies: 'React, TypeScript, Tailwind CSS',
                      description: 'Engineered student recruitment practice workspace handling multi-round simulations.',
                      link: 'github.com/placement-portal',
                    },
                  ],
                  experience: [
                    {
                      id: 'exp-1',
                      role: 'Software Development Intern',
                      company: 'Apex Innovations',
                      duration: 'May 2025 – Jul 2025',
                      location: 'Bangalore, India',
                      bullets: 'Developed high-throughput API endpoints and modular frontend components.',
                    },
                  ],
                  certifications: [
                    'Industry Technical Certification in Software Engineering',
                    'Campus Academic Merit Recognition',
                  ],
                  achievements: [
                    '1st Place in Department Engineering Project Expo 2025',
                  ],
                  template: currentTemplate,
                };
                updateResumeData(defaultResume);
                setPolishMessage('Resume reset to standard placement benchmark profile.');
                setTimeout(() => setPolishMessage(null), 3000);
              }}
              className="btn-cinematic-secondary flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
              title="Reset resume"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={handlePrintPdf}
              className="btn-cinematic flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* Template Selector Bar */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layout className="w-4 h-4 text-[#4F46E5] dark:text-cyan-400" />
            <span className="text-xs font-bold text-[#202334] dark:text-white">Select Resume Template:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'modern', title: 'Modern Technical', desc: 'Engineering & developer focus' },
              { id: 'classic', title: 'Classic Professional', desc: 'Clean corporate layout' },
              { id: 'minimal', title: 'Minimal ATS-Friendly', desc: 'Maximum ATS machine score' },
            ].map((t) => {
              const isSelected = currentTemplate === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => updateResumeData({ template: t.id as any })}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#4F46E5] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-[#141824] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  <span>{t.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {polishMessage && (
          <div className="mt-4 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-[#4F46E5] dark:text-cyan-300 flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{polishMessage}</span>
          </div>
        )}
      </div>

      {/* Main Split Grid: Live Form (5 Cols) vs Live Preview (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start print:block print:w-full">
        {/* LEFT COLUMN: EDIT FORM */}
        <div className="lg:col-span-5 space-y-4 print:hidden">
          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto bg-white dark:bg-[#141824] p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs custom-scrollbar">
            {[
              { id: 'contact', label: 'Contact' },
              { id: 'education', label: 'Education' },
              { id: 'skills', label: 'Skills' },
              { id: 'projects', label: 'Projects' },
              { id: 'experience', label: 'Experience' },
              { id: 'extras', label: 'Extras' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#4F46E5] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content Card */}
          <div className="card-cinematic p-5 sm:p-6 rounded-3xl space-y-4">
            {/* TAB 1: CONTACT */}
            {activeTab === 'contact' && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#202334] dark:text-white uppercase tracking-wider">
                  Contact Information
                </h3>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={resumeData.fullName}
                    onChange={(e) => updateResumeData({ fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0D1017] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-[#202334] dark:text-white focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Email</label>
                    <input
                      type="email"
                      value={resumeData.email}
                      onChange={(e) => updateResumeData({ email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0D1017] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-[#202334] dark:text-white focus:outline-none focus:border-[#4F46E5]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Phone</label>
                    <input
                      type="text"
                      value={resumeData.phone}
                      onChange={(e) => updateResumeData({ phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0D1017] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-[#202334] dark:text-white focus:outline-none focus:border-[#4F46E5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Location</label>
                    <input
                      type="text"
                      value={resumeData.location}
                      onChange={(e) => updateResumeData({ location: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0D1017] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-[#202334] dark:text-white focus:outline-none focus:border-[#4F46E5]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">LinkedIn Profile</label>
                    <input
                      type="text"
                      value={resumeData.linkedin}
                      onChange={(e) => updateResumeData({ linkedin: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0D1017] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-[#202334] dark:text-white focus:outline-none focus:border-[#4F46E5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">GitHub / Portfolio</label>
                  <input
                    type="text"
                    value={resumeData.github}
                    onChange={(e) => updateResumeData({ github: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0D1017] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-[#202334] dark:text-white focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Professional Summary</label>
                  <textarea
                    rows={3}
                    value={resumeData.summary}
                    onChange={(e) => updateResumeData({ summary: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#0D1017] border border-slate-200 dark:border-slate-800 text-xs leading-relaxed text-[#202334] dark:text-white focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: EDUCATION */}
            {/* TAB 2: EDUCATION */}
            {activeTab === 'education' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#111827] dark:text-white uppercase tracking-wider">
                    Academic Credentials
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newEdu = {
                        id: `edu-${Date.now()}`,
                        institution: '',
                        degree: profile.degree || 'Bachelor of Technology (B.Tech.)',
                        field: profile.branch || 'Engineering',
                        startYear: '2022',
                        endYear: '2026',
                        score: '8.5 CGPA',
                      };
                      updateResumeData({ education: [...resumeData.education, newEdu] });
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-[#4F46E5] dark:text-cyan-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 hover:bg-[#4F46E5] hover:text-white transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Education</span>
                  </button>
                </div>

                {resumeData.education.map((edu, idx) => (
                  <div key={edu.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0D1017] border border-slate-200 dark:border-slate-800 space-y-2.5 relative">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-slate-800/60">
                      <span className="text-[11px] font-bold text-[#4F46E5] dark:text-cyan-400">
                        Degree #{idx + 1}
                      </span>
                      {resumeData.education.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = resumeData.education.filter((_, i) => i !== idx);
                            updateResumeData({ education: updated });
                          }}
                          className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors cursor-pointer"
                          title="Remove degree"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Institution / University</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => {
                          const updated = [...resumeData.education];
                          updated[idx].institution = e.target.value;
                          updateResumeData({ education: updated });
                        }}
                        placeholder="National Institute of Engineering"
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-[#111827] dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Degree</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = [...resumeData.education];
                            updated[idx].degree = e.target.value;
                            updateResumeData({ education: updated });
                          }}
                          placeholder="B.Tech."
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-800 text-xs text-[#111827] dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Field / Branch</label>
                        <input
                          type="text"
                          value={edu.field}
                          onChange={(e) => {
                            const updated = [...resumeData.education];
                            updated[idx].field = e.target.value;
                            updateResumeData({ education: updated });
                          }}
                          placeholder="Computer Science and Engineering"
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-800 text-xs text-[#111827] dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Start Year</label>
                        <input
                          type="text"
                          value={edu.startYear}
                          onChange={(e) => {
                            const updated = [...resumeData.education];
                            updated[idx].startYear = e.target.value;
                            updateResumeData({ education: updated });
                          }}
                          placeholder="2022"
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-800 text-xs text-[#111827] dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">End Year</label>
                        <input
                          type="text"
                          value={edu.endYear}
                          onChange={(e) => {
                            const updated = [...resumeData.education];
                            updated[idx].endYear = e.target.value;
                            updateResumeData({ education: updated });
                          }}
                          placeholder="2026"
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-800 text-xs text-[#111827] dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Score / CGPA</label>
                        <input
                          type="text"
                          value={edu.score}
                          onChange={(e) => {
                            const updated = [...resumeData.education];
                            updated[idx].score = e.target.value;
                            updateResumeData({ education: updated });
                          }}
                          placeholder="8.7 CGPA"
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-800 text-xs text-[#111827] dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: SKILLS */}
            {activeTab === 'skills' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#111827] dark:text-white uppercase tracking-wider">
                    Categorized Skills
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      updateResumeData({
                        skills: [...resumeData.skills, { category: 'Tools & DevOps', items: 'Git, Docker, Linux, CI/CD' }],
                      });
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-[#4F46E5] dark:text-cyan-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 hover:bg-[#4F46E5] hover:text-white transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Category</span>
                  </button>
                </div>

                {resumeData.skills.map((s, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0D1017] border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={s.category}
                        onChange={(e) => {
                          const updated = [...resumeData.skills];
                          updated[idx].category = e.target.value;
                          updateResumeData({ skills: updated });
                        }}
                        placeholder="Category Name"
                        className="text-xs font-bold text-[#4F46E5] dark:text-cyan-400 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#4F46E5] focus:outline-hidden"
                      />
                      {resumeData.skills.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = resumeData.skills.filter((_, i) => i !== idx);
                            updateResumeData({ skills: updated });
                          }}
                          className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors cursor-pointer"
                          title="Remove category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={s.items}
                      onChange={(e) => {
                        const updated = [...resumeData.skills];
                        updated[idx].items = e.target.value;
                        updateResumeData({ skills: updated });
                      }}
                      placeholder="Comma-separated items (e.g. Python, Java, C++)"
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-800 text-xs text-[#111827] dark:text-white"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#111827] dark:text-white uppercase tracking-wider">
                    Technical Projects
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newProj = {
                        id: `proj-${Date.now()}`,
                        title: 'Campus Automation System',
                        technologies: 'React, Node.js, PostgreSQL',
                        description: 'Engineered high-concurrency portal handling 5,000+ student requests daily.',
                        link: 'github.com/project-repo',
                      };
                      updateResumeData({ projects: [...resumeData.projects, newProj] });
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-[#4F46E5] dark:text-cyan-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 hover:bg-[#4F46E5] hover:text-white transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>

                {resumeData.projects.map((proj, idx) => (
                  <div key={proj.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0D1017] border border-slate-200 dark:border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-slate-800/60">
                      <span className="text-xs font-bold text-[#4F46E5] dark:text-cyan-400">
                        Project #{idx + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleAiPolishBullets('Project', proj.description, (revised) => {
                              const updated = [...resumeData.projects];
                              updated[idx].description = revised;
                              updateResumeData({ projects: updated });
                            })
                          }
                          className="text-[10px] text-[#4F46E5] dark:text-cyan-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                        >
                          <Wand2 className="w-3 h-3" /> AI Polish
                        </button>
                        {resumeData.projects.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = resumeData.projects.filter((_, i) => i !== idx);
                              updateResumeData({ projects: updated });
                            }}
                            className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors cursor-pointer"
                            title="Remove project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Project Title</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => {
                          const updated = [...resumeData.projects];
                          updated[idx].title = e.target.value;
                          updateResumeData({ projects: updated });
                        }}
                        placeholder="Project Title"
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-[#111827] dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Tech Stack</label>
                        <input
                          type="text"
                          value={proj.technologies}
                          onChange={(e) => {
                            const updated = [...resumeData.projects];
                            updated[idx].technologies = e.target.value;
                            updateResumeData({ projects: updated });
                          }}
                          placeholder="React, TypeScript, SQLite"
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-800 text-xs text-[#111827] dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Live Link / Repo</label>
                        <input
                          type="text"
                          value={proj.link || ''}
                          onChange={(e) => {
                            const updated = [...resumeData.projects];
                            updated[idx].link = e.target.value;
                            updateResumeData({ projects: updated });
                          }}
                          placeholder="github.com/my-project"
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-800 text-xs text-[#111827] dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Description & Quantified Outcomes</label>
                      <textarea
                        rows={3}
                        value={proj.description}
                        onChange={(e) => {
                          const updated = [...resumeData.projects];
                          updated[idx].description = e.target.value;
                          updateResumeData({ projects: updated });
                        }}
                        placeholder="Describe system design, responsibilities, and quantified impact (e.g. reduced load time by 30%)"
                        className="w-full p-2.5 rounded-lg bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-800 text-xs text-[#111827] dark:text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: EXPERIENCE */}
            {activeTab === 'experience' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#111827] dark:text-white uppercase tracking-wider">
                    Internships & Work History
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newExp = {
                        id: `exp-${Date.now()}`,
                        role: 'Engineering Intern',
                        company: 'Innovative Systems Ltd.',
                        duration: 'May 2025 – Jul 2025',
                        location: 'Bangalore, India',
                        bullets: 'Contributed to architecture migration, improving data query throughput by 22%.\nCollaborated in Agile sprints with cross-functional engineers.',
                      };
                      updateResumeData({ experience: [...resumeData.experience, newExp] });
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-[#4F46E5] dark:text-cyan-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 hover:bg-[#4F46E5] hover:text-white transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Experience</span>
                  </button>
                </div>

                {resumeData.experience.map((exp, idx) => (
                  <div key={exp.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0D1017] border border-slate-200 dark:border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-slate-800/60">
                      <span className="text-xs font-bold text-[#4F46E5] dark:text-cyan-400">
                        Experience #{idx + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleAiPolishBullets('Experience', exp.bullets, (revised) => {
                              const updated = [...resumeData.experience];
                              updated[idx].bullets = revised;
                              updateResumeData({ experience: updated });
                            })
                          }
                          className="text-[10px] text-[#4F46E5] dark:text-cyan-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                        >
                          <Wand2 className="w-3 h-3" /> AI Polish
                        </button>
                        {resumeData.experience.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = resumeData.experience.filter((_, i) => i !== idx);
                              updateResumeData({ experience: updated });
                            }}
                            className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors cursor-pointer"
                            title="Remove experience"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Role / Position</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const updated = [...resumeData.experience];
                            updated[idx].role = e.target.value;
                            updateResumeData({ experience: updated });
                          }}
                          placeholder="Role / Title"
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-[#111827] dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Company Name</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...resumeData.experience];
                            updated[idx].company = e.target.value;
                            updateResumeData({ experience: updated });
                          }}
                          placeholder="Company Name"
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-[#111827] dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Duration</label>
                        <input
                          type="text"
                          value={exp.duration}
                          onChange={(e) => {
                            const updated = [...resumeData.experience];
                            updated[idx].duration = e.target.value;
                            updateResumeData({ experience: updated });
                          }}
                          placeholder="Jun 2025 – Aug 2025"
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-800 text-xs text-[#111827] dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => {
                            const updated = [...resumeData.experience];
                            updated[idx].location = e.target.value;
                            updateResumeData({ experience: updated });
                          }}
                          placeholder="Bangalore, India"
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-800 text-xs text-[#111827] dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Responsibilities & Impact Bullets</label>
                      <textarea
                        rows={3}
                        value={exp.bullets}
                        onChange={(e) => {
                          const updated = [...resumeData.experience];
                          updated[idx].bullets = e.target.value;
                          updateResumeData({ experience: updated });
                        }}
                        placeholder="Bullet points describing your accomplishments (one per line)"
                        className="w-full p-2.5 rounded-lg bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-800 text-xs text-[#111827] dark:text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 6: EXTRAS (Certifications & Achievements) */}
            {activeTab === 'extras' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#111827] dark:text-white uppercase tracking-wider">
                  Certifications & Honors
                </h3>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-500">
                      Certifications (one per line)
                    </label>
                  </div>
                  <textarea
                    rows={3}
                    value={resumeData.certifications.join('\n')}
                    onChange={(e) =>
                      updateResumeData({
                        certifications: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                      })
                    }
                    placeholder="AWS Certified Solutions Architect&#10;Oracle Certified Java Associate"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#0D1017] border border-slate-200 dark:border-slate-800 text-xs text-[#111827] dark:text-white focus:outline-hidden focus:border-[#4F46E5]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-500">
                      Achievements & Honors (one per line)
                    </label>
                  </div>
                  <textarea
                    rows={3}
                    value={resumeData.achievements.join('\n')}
                    onChange={(e) =>
                      updateResumeData({
                        achievements: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                      })
                    }
                    placeholder="1st Place in University Hackathon 2025&#10;Dean's Academic Honor List (Top 5%)"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#0D1017] border border-slate-200 dark:border-slate-800 text-xs text-[#111827] dark:text-white focus:outline-hidden focus:border-[#4F46E5]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE RESUME PREVIEW SHEET */}
        <div className="lg:col-span-7 bg-white text-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-300 shadow-xl space-y-4 min-h-[750px] print:p-0 print:border-none print:shadow-none print:rounded-none print:w-full print:max-w-full">
          {/* ======================================================== */}
          {/* TEMPLATE 1: MODERN TECHNICAL                             */}
          {/* ======================================================== */}
          {currentTemplate === 'modern' && (
            <div className="space-y-4">
              {/* Header */}
              <div className="border-b-2 border-indigo-600 pb-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
                  {resumeData.fullName || profile.name}
                </h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-1 font-mono">
                  <span>{resumeData.email}</span>
                  <span>•</span>
                  <span>{resumeData.phone}</span>
                  <span>•</span>
                  <span>{resumeData.location}</span>
                  <span>•</span>
                  <span className="font-semibold text-indigo-700">{resumeData.linkedin}</span>
                  <span>•</span>
                  <span className="text-slate-800">{resumeData.github}</span>
                </div>
              </div>

              {/* Summary */}
              {resumeData.summary && (
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1 border-b border-slate-200 pb-0.5">
                    Professional Summary
                  </h2>
                  <p className="text-xs text-slate-700 leading-relaxed">{resumeData.summary}</p>
                </div>
              )}

              {/* Technical Proficiencies */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1.5 border-b border-slate-200 pb-0.5">
                  Technical Proficiencies
                </h2>
                <div className="space-y-1 text-xs">
                  {resumeData.skills.map((s, i) => (
                    <p key={i}>
                      <span className="font-bold text-slate-900">{s.category}: </span>
                      <span className="text-slate-700">{s.items}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1.5 border-b border-slate-200 pb-0.5">
                  Technical Projects
                </h2>
                <div className="space-y-2.5">
                  {resumeData.projects.map((proj) => (
                    <div key={proj.id} className="text-xs">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-slate-900">
                          {proj.title} <span className="font-mono font-normal text-slate-500">| {proj.technologies}</span>
                        </p>
                        {proj.link && <span className="text-[11px] font-mono text-indigo-700">{proj.link}</span>}
                      </div>
                      <p className="text-slate-700 mt-0.5 leading-relaxed">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1.5 border-b border-slate-200 pb-0.5">
                  Internship Experience
                </h2>
                <div className="space-y-2">
                  {resumeData.experience.map((exp) => (
                    <div key={exp.id} className="text-xs">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-slate-900">
                          {exp.role} — <span className="font-normal text-slate-700">{exp.company}</span>
                        </p>
                        <span className="font-mono text-slate-600 text-[11px]">{exp.duration}</span>
                      </div>
                      <ul className="list-disc list-inside mt-1 text-slate-700 space-y-0.5">
                        {exp.bullets.split('\n').map((bullet, i) => (
                          <li key={i}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1.5 border-b border-slate-200 pb-0.5">
                  Education
                </h2>
                <div className="space-y-2">
                  {resumeData.education.map((edu) => (
                    <div key={edu.id} className="flex justify-between items-start text-xs">
                      <div>
                        <p className="font-bold text-slate-900">{edu.institution}</p>
                        <p className="text-slate-700">
                          {edu.degree} in {edu.field}
                        </p>
                      </div>
                      <div className="text-right text-slate-600 font-mono">
                        <p>{edu.startYear} – {edu.endYear}</p>
                        <p className="font-semibold text-slate-800">{edu.score}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications & Achievements */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1.5 border-b border-slate-200 pb-0.5">
                  Certifications & Honors
                </h2>
                <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5">
                  {resumeData.certifications.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                  {resumeData.achievements.map((a, i) => (
                    <li key={i} className="font-medium text-slate-800">{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TEMPLATE 2: CLASSIC PROFESSIONAL                         */}
          {/* ======================================================== */}
          {currentTemplate === 'classic' && (
            <div className="space-y-4 font-serif">
              {/* Centered Traditional Header */}
              <div className="text-center border-b border-slate-400 pb-3">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-normal text-slate-950 uppercase">
                  {resumeData.fullName || profile.name}
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-xs text-slate-700 mt-1.5 font-sans">
                  <span>{resumeData.location}</span>
                  <span>•</span>
                  <span>{resumeData.phone}</span>
                  <span>•</span>
                  <span>{resumeData.email}</span>
                  <span>•</span>
                  <span>{resumeData.linkedin}</span>
                </div>
              </div>

              {/* Summary */}
              {resumeData.summary && (
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1">
                    Executive Summary
                  </h2>
                  <p className="text-xs text-slate-800 leading-relaxed font-sans">{resumeData.summary}</p>
                </div>
              )}

              {/* Education First */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                  Education
                </h2>
                <div className="space-y-2">
                  {resumeData.education.map((edu) => (
                    <div key={edu.id} className="flex justify-between items-start text-xs font-sans">
                      <div>
                        <p className="font-bold text-slate-900">{edu.institution}</p>
                        <p className="text-slate-800 italic">
                          {edu.degree} in {edu.field}
                        </p>
                      </div>
                      <div className="text-right text-slate-700">
                        <p>{edu.startYear} – {edu.endYear}</p>
                        <p className="font-semibold">{edu.score}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                  Key Technical Projects
                </h2>
                <div className="space-y-2 font-sans">
                  {resumeData.projects.map((proj) => (
                    <div key={proj.id} className="text-xs">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-slate-900">
                          {proj.title} <span className="font-normal text-slate-600">({proj.technologies})</span>
                        </p>
                        {proj.link && <span className="text-[11px] text-slate-600">{proj.link}</span>}
                      </div>
                      <p className="text-slate-800 mt-0.5 leading-relaxed">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                  Professional Experience
                </h2>
                <div className="space-y-2 font-sans">
                  {resumeData.experience.map((exp) => (
                    <div key={exp.id} className="text-xs">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-slate-900">
                          {exp.role}, <span className="font-normal italic">{exp.company}</span>
                        </p>
                        <span className="text-slate-600 text-[11px]">{exp.duration}</span>
                      </div>
                      <ul className="list-disc list-inside mt-1 text-slate-800 space-y-0.5">
                        {exp.bullets.split('\n').map((bullet, i) => (
                          <li key={i}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                  Core Skills & Proficiencies
                </h2>
                <div className="space-y-1 text-xs font-sans">
                  {resumeData.skills.map((s, i) => (
                    <p key={i}>
                      <span className="font-bold text-slate-900">{s.category}: </span>
                      <span className="text-slate-800">{s.items}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                  Certifications & Honors
                </h2>
                <ul className="list-disc list-inside text-xs font-sans text-slate-800 space-y-0.5">
                  {resumeData.certifications.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                  {resumeData.achievements.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TEMPLATE 3: MINIMAL ATS-FRIENDLY                         */}
          {/* ======================================================== */}
          {currentTemplate === 'minimal' && (
            <div className="space-y-3.5 font-mono text-xs text-slate-950">
              {/* Left-Aligned Clean Monochrome Header */}
              <div className="border-b border-black pb-2">
                <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wider">
                  {resumeData.fullName || profile.name}
                </h1>
                <p className="text-[11px] text-slate-700 mt-1">
                  {resumeData.email} | {resumeData.phone} | {resumeData.location} | {resumeData.linkedin} | {resumeData.github}
                </p>
              </div>

              {/* Summary */}
              {resumeData.summary && (
                <div>
                  <h2 className="font-bold text-[11px] uppercase tracking-wider text-black border-b border-black/40 pb-0.5 mb-1">
                    [1] OBJECTIVE & SUMMARY
                  </h2>
                  <p className="text-[11px] text-slate-800 leading-relaxed font-sans">{resumeData.summary}</p>
                </div>
              )}

              {/* Skills */}
              <div>
                <h2 className="font-bold text-[11px] uppercase tracking-wider text-black border-b border-black/40 pb-0.5 mb-1">
                  [2] TECHNICAL PROFICIENCIES
                </h2>
                <div className="space-y-0.5 text-[11px] font-sans">
                  {resumeData.skills.map((s, i) => (
                    <p key={i}>
                      <strong>{s.category}:</strong> {s.items}
                    </p>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <h2 className="font-bold text-[11px] uppercase tracking-wider text-black border-b border-black/40 pb-0.5 mb-1">
                  [3] EDUCATION
                </h2>
                <div className="space-y-1.5 text-[11px] font-sans">
                  {resumeData.education.map((edu) => (
                    <div key={edu.id} className="flex justify-between">
                      <div>
                        <p className="font-bold">{edu.institution}</p>
                        <p>{edu.degree} in {edu.field}</p>
                      </div>
                      <div className="text-right font-mono text-[10px]">
                        <p>{edu.startYear} - {edu.endYear}</p>
                        <p>Score: {edu.score}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h2 className="font-bold text-[11px] uppercase tracking-wider text-black border-b border-black/40 pb-0.5 mb-1">
                  [4] PROJECTS
                </h2>
                <div className="space-y-2 text-[11px] font-sans">
                  {resumeData.projects.map((proj) => (
                    <div key={proj.id}>
                      <p className="font-bold">
                        {proj.title} [{proj.technologies}]
                      </p>
                      <p className="text-slate-800">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <h2 className="font-bold text-[11px] uppercase tracking-wider text-black border-b border-black/40 pb-0.5 mb-1">
                  [5] EXPERIENCE
                </h2>
                <div className="space-y-1.5 text-[11px] font-sans">
                  {resumeData.experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between font-bold">
                        <p>{exp.role} - {exp.company}</p>
                        <p className="font-mono text-[10px]">{exp.duration}</p>
                      </div>
                      <ul className="list-disc list-inside text-slate-800 text-[11px]">
                        {exp.bullets.split('\n').map((bullet, i) => (
                          <li key={i}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h2 className="font-bold text-[11px] uppercase tracking-wider text-black border-b border-black/40 pb-0.5 mb-1">
                  [6] CERTIFICATIONS & ACHIEVEMENTS
                </h2>
                <ul className="list-disc list-inside text-[11px] font-sans text-slate-800">
                  {resumeData.certifications.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                  {resumeData.achievements.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </CinematicBackground>
  );
};
