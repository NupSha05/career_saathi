import React, { useState } from 'react';
import { useCareerSaathi } from '../../context/CareerSaathiContext';
import {
  Sparkles,
  GraduationCap,
  Building2,
  Compass,
  ArrowRight,
  CheckCircle2,
  FileText,
  UploadCloud,
  Loader2,
  Briefcase,
  ShieldCheck,
} from 'lucide-react';

export const StudentOnboarding: React.FC = () => {
  const { profile, updateProfile, updateEducation, uploadDocument } = useCareerSaathi();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState(profile.name || '');
  const [college, setCollege] = useState(profile.college || profile.education.institution || '');
  const [degree, setDegree] = useState(profile.education.degree || 'B.Tech');
  const [branch, setBranch] = useState(profile.education.branch || 'Computer Science & Engineering');
  const [gradYear, setGradYear] = useState(profile.education.expectedGraduationYear || 2026);
  const [cgpa, setCgpa] = useState(profile.education.selfReportedCGPA || 8.5);

  // Step 2 State - Career Preferences
  const [targetRoles, setTargetRoles] = useState<string[]>(
    profile.preferences.targetRoles.length > 0
      ? profile.preferences.targetRoles
      : ['Software Development Engineer', 'Full Stack Developer']
  );
  const [newRoleInput, setNewRoleInput] = useState('');
  const [workType, setWorkType] = useState<any>(profile.preferences.preferredWorkType || 'Hybrid');
  const [minCtc, setMinCtc] = useState(profile.preferences.minAcceptableCTC || '₹12,00,000');

  // Step 3 State - Initial CV
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleAddRole = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    if (newRoleInput.trim() && !targetRoles.includes(newRoleInput.trim())) {
      setTargetRoles([...targetRoles, newRoleInput.trim()]);
      setNewRoleInput('');
    }
  };

  const handleRemoveRole = (role: string) => {
    setTargetRoles(targetRoles.filter((r) => r !== role));
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      // 1. Update Profile & Education
      updateProfile({
        name,
        college,
        headline: `${degree} in ${branch} • Aspiring ${targetRoles[0] || 'Software Engineer'}`,
        careerStage: 'Final Year Student',
        onboardingCompleted: true,
        preferences: {
          ...profile.preferences,
          targetRoles,
          preferredWorkType: workType,
          minAcceptableCTC: minCtc,
        },
      });

      updateEducation({
        institution: college,
        degree,
        branch,
        expectedGraduationYear: Number(gradYear),
        selfReportedCGPA: Number(cgpa),
      });

      // 2. Upload CV if provided
      if (cvFile) {
        setUploadStatus('Uploading initial CV to Supabase Storage...');
        await uploadDocument(cvFile, 'cv_resume');
      }
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-indigo-500/10 blur-3xl pointer-events-none" />

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Student Intelligence Setup</h2>
              <p className="text-xs text-slate-400">Step {step} of 3 • Establishing your persistent career foundation</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-8 bg-indigo-500'
                    : s < step
                    ? 'w-2 bg-emerald-500'
                    : 'w-2 bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Academic Identity */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
                Academic Identity & Institution
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Your degree and verified coursework anchor your academic readiness metrics.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Shalini Sharma"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">College / University</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. Indian Institute of Technology (IIT) Delhi"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Degree</label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="B.Tech, B.E., M.Tech, MCA..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Branch / Specialization</label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="Computer Science & Engineering"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Graduation Year</label>
                <input
                  type="number"
                  value={gradYear}
                  onChange={(e) => setGradYear(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Cumulative CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={cgpa}
                  onChange={(e) => setCgpa(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!name.trim() || !college.trim()}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl flex items-center space-x-2 transition cursor-pointer"
              >
                <span>Continue to Target Roles</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Target Aspirations */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-400" />
                Target Opportunities & Placement Goals
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Defines the contextual baseline for JD Role-Fit audits and Readiness scoring.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Roles</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {targetRoles.map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-lg text-xs"
                    >
                      <span>{role}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRole(role)}
                        className="text-slate-400 hover:text-white ml-1 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newRoleInput}
                    onChange={(e) => setNewRoleInput(e.target.value)}
                    onKeyDown={handleAddRole}
                    placeholder="Add role (e.g. Backend Engineer) and press enter"
                    className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddRole}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Work Modality</label>
                  <select
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Minimum CTC</label>
                  <input
                    type="text"
                    value={minCtc}
                    onChange={(e) => setMinCtc(e.target.value)}
                    placeholder="e.g. ₹12,00,000"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-xl transition cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl flex items-center space-x-2 transition cursor-pointer"
              >
                <span>Continue to Document Vault</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Document Vault Initialization */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                Initial CV & Storage Vault (Optional)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Upload your latest resume or CV to establish your baseline for the CV Intelligence Triad.
              </p>
            </div>

            <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 text-center transition bg-slate-950/40">
              <input
                type="file"
                id="cv-upload-input"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) setCvFile(e.target.files[0]);
                }}
              />
              <label htmlFor="cv-upload-input" className="cursor-pointer block">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                {cvFile ? (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">{cvFile.name}</p>
                    <p className="text-xs text-emerald-400">Ready to store in Supabase career-documents bucket</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">Click to select CV (PDF, DOCX, TXT)</p>
                    <p className="text-xs text-slate-500">Max size 15MB • Stored in user-isolated bucket</p>
                  </div>
                )}
              </label>
            </div>

            {uploadStatus && (
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-xs text-indigo-300 flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>{uploadStatus}</span>
              </div>
            )}

            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-start space-x-3 text-xs text-slate-400">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">Supabase Persistent Architecture Active</span>
                <p className="mt-0.5 text-slate-400 leading-relaxed">
                  Your academic records, projects, and documents are bound to your authenticated Supabase user ID with Row Level Security.
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-xl transition cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleComplete}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl flex items-center space-x-2 transition shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Synchronizing with Supabase...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Career Saathi Command Center</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
