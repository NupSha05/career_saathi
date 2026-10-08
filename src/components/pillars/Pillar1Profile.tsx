import React, { useState } from 'react';
import { useCareerSaathi } from '../../context/CareerSaathiContext';
import {
  User,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Zap,
  Award,
  Plus,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  Code2,
  FileBadge,
  Edit3,
} from 'lucide-react';
import { EvidenceLevel } from '../../types';

export const Pillar1Profile: React.FC = () => {
  const { profile, updateProfile, addProject, addSkill } = useCareerSaathi();

  // Profile Edit Modal State
  const [showEditBasicsModal, setShowEditBasicsModal] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editCollege, setEditCollege] = useState(profile.college);
  const [editHeadline, setEditHeadline] = useState(profile.headline);
  const [editAbout, setEditAbout] = useState(profile.about);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [editGithub, setEditGithub] = useState(profile.githubUrl);
  const [editLinkedIn, setEditLinkedIn] = useState(profile.linkedInUrl);

  // Project Modal State
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjRole, setNewProjRole] = useState('Solo Developer');
  const [newProjTech, setNewProjTech] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjOutcomes, setNewProjOutcomes] = useState('');
  const [newProjLevel, setNewProjLevel] = useState<EvidenceLevel>(2);

  // Skill Modal State
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<
    'Core CS' | 'Languages & Frameworks' | 'System & Cloud' | 'Databases' | 'Soft Skills'
  >('Languages & Frameworks');
  const [newSkillLevel, setNewSkillLevel] = useState<EvidenceLevel>(2);
  const [newSkillEvidence, setNewSkillEvidence] = useState('');

  const handleSaveBasics = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName.trim(),
      college: editCollege.trim(),
      headline: editHeadline.trim(),
      about: editAbout.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      githubUrl: editGithub.trim(),
      linkedInUrl: editLinkedIn.trim(),
    });
    setShowEditBasicsModal(false);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim()) return;

    addProject({
      title: newProjTitle.trim(),
      role: newProjRole.trim(),
      techStack: newProjTech.split(',').map((s) => s.trim()).filter(Boolean),
      description: newProjDesc.trim(),
      outcomes: newProjOutcomes.trim(),
      evidenceLevel: newProjLevel,
      provenance: 'user_provided',
      verificationStatus: 'unverified',
    });

    setNewProjTitle('');
    setNewProjTech('');
    setNewProjDesc('');
    setNewProjOutcomes('');
    setShowAddProjectModal(false);
  };

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    addSkill({
      name: newSkillName.trim(),
      category: newSkillCategory,
      evidenceLevel: newSkillLevel,
      supportingEvidence: newSkillEvidence ? [newSkillEvidence.trim()] : ['User reported coursework / practice'],
      relevance: 'Directly Relevant',
      provenance: 'user_provided',
    });

    setNewSkillName('');
    setNewSkillEvidence('');
    setShowAddSkillModal(false);
  };

  const getEvidenceBadge = (level: EvidenceLevel) => {
    switch (level) {
      case 4:
        return (
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
            L4: Production Verified
          </span>
        );
      case 3:
        return (
          <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
            L3: Internship / Capstone
          </span>
        );
      case 2:
        return (
          <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
            L2: Project & Repository
          </span>
        );
      case 1:
        return (
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
            L1: Coursework / Theory
          </span>
        );
      case 0:
      default:
        return (
          <span className="bg-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
            L0: Self-Claim
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-500/20">
              {profile.name ? profile.name.charAt(0).toUpperCase() : <User className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {profile.name || 'Setup Candidate Profile'}
                </h1>
                <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                  <ShieldCheck className="w-3 h-3" /> Source of Truth
                </span>
              </div>
              <p className="text-xs text-indigo-400 mt-0.5">
                {profile.headline || 'No headline set — click Edit Profile'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {profile.email || 'No email'} • {profile.college || 'Institution not configured'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => {
                setEditName(profile.name);
                setEditCollege(profile.college);
                setEditHeadline(profile.headline);
                setEditAbout(profile.about);
                setEditEmail(profile.email);
                setEditPhone(profile.phone);
                setEditGithub(profile.githubUrl);
                setEditLinkedIn(profile.linkedInUrl);
                setShowEditBasicsModal(true);
              }}
              className="bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile Basics</span>
            </button>

            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
              >
                <Code2 className="w-3.5 h-3.5 text-indigo-400" /> GitHub
              </a>
            )}
            {profile.linkedInUrl && (
              <a
                href={profile.linkedInUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" /> LinkedIn
              </a>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
          <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px] block mb-1">
            Career Objective & Summary:
          </span>
          {profile.about || (
            <span className="text-slate-500 italic">
              No objective specified. Click 'Edit Profile Basics' to provide your background narrative.
            </span>
          )}
        </div>
      </div>

      {/* Grid: Education & Experience */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Education Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-400" />
              Academic Credentials
            </h2>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-semibold border border-indigo-500/30">
              Semester {profile.education.currentSemester} / {profile.education.totalSemesters}
            </span>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <h3 className="text-sm font-bold text-white">
              {profile.education.degree || 'Degree unconfigured'} in {profile.education.branch || 'Discipline'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {profile.education.institution || 'Institution not recorded'}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Duration: {profile.education.startYear} – {profile.education.expectedGraduationYear} (Expected)
            </p>

            <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
              <span className="text-slate-300">Authoritative CGPA:</span>
              <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                {(profile.education.verifiedCGPA || profile.education.selfReportedCGPA || 0).toFixed(2)} / 10.0
              </span>
            </div>
          </div>
        </div>

        {/* Experience & Internships */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              Internships & Industry Experience
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              {profile.experiences.length} Record(s)
            </span>
          </div>

          <div className="space-y-4">
            {profile.experiences.length === 0 ? (
              <div className="p-6 text-center bg-slate-800/40 rounded-xl border border-slate-800 text-xs text-slate-400">
                No work or internship experiences recorded yet.
              </div>
            ) : (
              profile.experiences.map((exp) => (
                <div key={exp.id} className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xs font-bold text-white">{exp.role}</h3>
                      <p className="text-xs text-indigo-400 font-medium">{exp.company} • {exp.duration}</p>
                    </div>
                    {getEvidenceBadge(exp.evidenceLevel)}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{exp.description}</p>
                  <div className="space-y-1 pt-1">
                    {exp.impactMetrics.map((metric, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                        <CheckCircle2 className="w-3 h-3 shrink-0" />
                        <span>{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-purple-400" />
              Project Evidence & Repositories
            </h2>
            <p className="text-xs text-slate-400">
              Backing claims with tangible code repositories and verifiable architecture
            </p>
          </div>

          <button
            onClick={() => setShowAddProjectModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project Evidence</span>
          </button>
        </div>

        {profile.projects.length === 0 ? (
          <div className="p-8 text-center bg-slate-800/40 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-2">
            <p>No project repositories recorded in your profile.</p>
            <p className="text-slate-500">
              Click 'Add Project Evidence' to log projects, code repositories, and measurable outcomes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.projects.map((proj) => (
              <div key={proj.id} className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-sm font-bold text-white">{proj.title}</h3>
                    {getEvidenceBadge(proj.evidenceLevel)}
                  </div>
                  <span className="text-[11px] text-indigo-400 font-medium block mt-0.5">{proj.role}</span>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{proj.description}</p>
                  <p className="text-xs text-emerald-400/90 font-medium mt-2 bg-emerald-500/10 p-2 rounded-lg">
                    ★ Outcomes: {proj.outcomes}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {proj.techStack.map((tech, idx) => (
                      <span key={idx} className="bg-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-700/60 text-xs">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        <Code2 className="w-3.5 h-3.5" /> Repo
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Competency Matrix & Evidence Depth
            </h2>
            <p className="text-xs text-slate-400">
              Each registered skill carries an evidence tier from L0 (Claim) to L4 (Industry Validated)
            </p>
          </div>

          <button
            onClick={() => setShowAddSkillModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill Evidence</span>
          </button>
        </div>

        {profile.skills.length === 0 ? (
          <div className="p-8 text-center bg-slate-800/40 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-2">
            <p>No skills recorded yet.</p>
            <p className="text-slate-500">
              Click 'Add Skill Evidence' to register your technical competencies and support them with verifiable proof.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {profile.skills.map((skill) => (
              <div key={skill.id} className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-white">{skill.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">{skill.category}</span>
                  <div className="mt-2 text-[11px] text-slate-400 line-clamp-2">
                    {skill.supportingEvidence && skill.supportingEvidence.length > 0 ? (
                      skill.supportingEvidence.map((e, idx) => <span key={idx}>• {e} </span>)
                    ) : (
                      <span>Coursework</span>
                    )}
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between">
                  {getEvidenceBadge(skill.evidenceLevel)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Edit Profile Basics */}
      {showEditBasicsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white mb-4">Edit Profile Basics</h3>
            <form onSubmit={handleSaveBasics} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Priyanshu Verma"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="student@campus.edu"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">College / University</label>
                <input
                  type="text"
                  value={editCollege}
                  onChange={(e) => setEditCollege(e.target.value)}
                  placeholder="e.g. National Institute of Technology"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Headline</label>
                <input
                  type="text"
                  value={editHeadline}
                  onChange={(e) => setEditHeadline(e.target.value)}
                  placeholder="e.g. Final Year B.Tech CSE | Full Stack Developer"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">About / Career Objective</label>
                <textarea
                  rows={3}
                  value={editAbout}
                  onChange={(e) => setEditAbout(e.target.value)}
                  placeholder="Brief summary of your professional goals and technical capabilities."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={editGithub}
                    onChange={(e) => setEditGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={editLinkedIn}
                    onChange={(e) => setEditLinkedIn(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditBasicsModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Project */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Add Project Evidence</h3>
            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Project Title</label>
                <input
                  type="text"
                  value={newProjTitle}
                  onChange={(e) => setNewProjTitle(e.target.value)}
                  placeholder="e.g. Distributed Task Scheduler"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Role in Project</label>
                  <input
                    type="text"
                    value={newProjRole}
                    onChange={(e) => setNewProjRole(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Evidence Level</label>
                  <select
                    value={newProjLevel}
                    onChange={(e) => setNewProjLevel(Number(e.target.value) as EvidenceLevel)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option value={1}>L1: Coursework / Prototype</option>
                    <option value={2}>L2: Deployed Project / GitHub Repo</option>
                    <option value={3}>L3: Hackathon / Capstone / Client Work</option>
                    <option value={4}>L4: Production / High-Traffic Tool</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={newProjTech}
                  onChange={(e) => setNewProjTech(e.target.value)}
                  placeholder="React, TypeScript, PostgreSQL, Docker"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Description & Architecture</label>
                <textarea
                  rows={2}
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  placeholder="What does it do and what architectural choices did you make?"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Measurable Outcomes</label>
                <input
                  type="text"
                  value={newProjOutcomes}
                  onChange={(e) => setNewProjOutcomes(e.target.value)}
                  placeholder="e.g. Benchmark achieved 2,000 req/sec; used by 50+ students"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Skill */}
      {showAddSkillModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Register Skill & Evidence</h3>
            <form onSubmit={handleCreateSkill} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Skill Name</label>
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. PostgreSQL, Redis, React.js"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="Languages & Frameworks">Languages & Frameworks</option>
                  <option value="Core CS">Core CS (DSA, OS, Systems)</option>
                  <option value="Databases">Databases & Storage</option>
                  <option value="System & Cloud">System & Cloud</option>
                  <option value="Soft Skills">Soft Skills & Communication</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Evidence Level</label>
                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(Number(e.target.value) as EvidenceLevel)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value={1}>L1: Coursework / Academic Reading</option>
                  <option value={2}>L2: Built Hands-on Project</option>
                  <option value={3}>L3: Internship / Production Feature</option>
                  <option value={4}>L4: Production Scale / High Concurrency</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Supporting Evidence / Proof</label>
                <input
                  type="text"
                  value={newSkillEvidence}
                  onChange={(e) => setNewSkillEvidence(e.target.value)}
                  placeholder="e.g. Built query optimization module in project X"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddSkillModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold"
                >
                  Register Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
