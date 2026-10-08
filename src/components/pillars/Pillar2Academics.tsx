import React, { useState } from 'react';
import { useCareerSaathi } from '../../context/CareerSaathiContext';
import {
  calculateDeterministicCGPA,
  calculateTargetFeasibility,
} from '../../services/intelligenceEngine';
import {
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calculator,
  Plus,
  Scale,
  Edit2,
  FileCheck,
  UploadCloud,
  Loader2,
} from 'lucide-react';
import { AcademicTerm } from '../../types';

export const Pillar2Academics: React.FC = () => {
  const { profile, updateEducation, reconcileDiscrepancy, uploadDocument } = useCareerSaathi();

  const [targetCGPAInput, setTargetCGPAInput] = useState<number>(8.5);
  const [useCreditWeighted, setUseCreditWeighted] = useState(true);
  const [showAddTermModal, setShowAddTermModal] = useState(false);
  const [showDegreeConfigModal, setShowDegreeConfigModal] = useState(false);
  const [isUploadingMarksheet, setIsUploadingMarksheet] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  // New term form state
  const nextTermNumber = (profile.education.terms?.length || 0) + 1;
  const [termNumber, setTermNumber] = useState<number>(nextTermNumber);
  const [sgpaInput, setSgpaInput] = useState<string>('8.0');
  const [creditsInput, setCreditsInput] = useState<string>('24');

  // Degree config state
  const [degreeInput, setDegreeInput] = useState(profile.education.degree);
  const [branchInput, setBranchInput] = useState(profile.education.branch);
  const [institutionInput, setInstitutionInput] = useState(profile.education.institution);
  const [totalSemestersInput, setTotalSemestersInput] = useState(profile.education.totalSemesters || 8);

  const termMetrics = calculateDeterministicCGPA(profile.education.terms, profile.education.totalSemesters);
  const currentCGPA = termMetrics.currentCalculatedCGPA || profile.education.verifiedCGPA || profile.education.selfReportedCGPA || 0;

  const feasibilityResult = calculateTargetFeasibility(
    currentCGPA,
    termMetrics.totalTermsCompleted,
    profile.education.totalSemesters,
    targetCGPAInput,
    useCreditWeighted ? profile.education.terms : undefined
  );

  const handleAddTerm = (e: React.FormEvent) => {
    e.preventDefault();
    const sgpa = parseFloat(sgpaInput);
    const credits = parseFloat(creditsInput);
    if (isNaN(sgpa) || isNaN(credits) || sgpa < 0 || sgpa > 10) return;

    const newTerm: AcademicTerm = {
      termNumber,
      sgpa: Number(sgpa.toFixed(2)),
      credits,
      verified: false,
    };

    const existingTerms = profile.education.terms || [];
    const updatedTerms = [...existingTerms.filter((t) => t.termNumber !== termNumber), newTerm].sort(
      (a, b) => a.termNumber - b.termNumber
    );

    const newTermMetrics = calculateDeterministicCGPA(updatedTerms, profile.education.totalSemesters);

    updateEducation({
      terms: updatedTerms,
      currentSemester: Math.min(profile.education.totalSemesters, updatedTerms.length + 1),
      selfReportedCGPA: newTermMetrics.currentCalculatedCGPA,
      verifiedCGPA: newTermMetrics.currentCalculatedCGPA,
    });

    setShowAddTermModal(false);
    setTermNumber(updatedTerms.length + 1);
  };

  const handleSaveDegreeConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateEducation({
      degree: degreeInput.trim(),
      branch: branchInput.trim(),
      institution: institutionInput.trim(),
      totalSemesters: totalSemestersInput,
    });
    setShowDegreeConfigModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Deterministic Metric Display */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>Pillar 2 • Deterministic Academic Intelligence</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Academic Trajectory & Credential Verification
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Strictly computed via deterministic arithmetic and credit weighting. AI is never permitted to alter or hallucinate academic formulas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-1.5">
              {isUploadingMarksheet ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              ) : (
                <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
              )}
              <span>{isUploadingMarksheet ? 'Uploading...' : 'Upload Marksheet'}</span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                disabled={isUploadingMarksheet}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    setIsUploadingMarksheet(true);
                    setUploadNotice(null);
                    await uploadDocument(file, 'academic_transcript');
                    setUploadNotice(`Marksheet "${file.name}" uploaded to Supabase Storage vault successfully.`);
                  } catch (err: any) {
                    setUploadNotice(`Upload notice: ${err.message || 'Stored locally'}`);
                  } finally {
                    setIsUploadingMarksheet(false);
                  }
                }}
              />
            </label>
            <button
              onClick={() => {
                setDegreeInput(profile.education.degree);
                setBranchInput(profile.education.branch);
                setInstitutionInput(profile.education.institution);
                setTotalSemestersInput(profile.education.totalSemesters);
                setShowDegreeConfigModal(true);
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Degree Settings</span>
            </button>
            <button
              onClick={() => {
                setTermNumber((profile.education.terms?.length || 0) + 1);
                setShowAddTermModal(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Semester Term</span>
            </button>
          </div>
        </div>

        {/* Upload status banner if present */}
        {uploadNotice && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
            <span>{uploadNotice}</span>
            <button
              onClick={() => setUploadNotice(null)}
              className="text-slate-400 hover:text-white text-xs font-bold px-1"
            >
              ×
            </button>
          </div>
        )}

        {/* Highlighted Discrepancy Banner if present */}
        {profile.education.discrepancyFlag && (
          <div className="mt-5 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Academic Discrepancy Detected — Verification Required</span>
            </div>
            <p className="text-slate-300">
              Your self-reported profile records <span className="font-bold text-white">{profile.education.selfReportedCGPA} CGPA</span>, but the marksheet extraction indicates <span className="font-bold text-amber-300">{profile.education.marksheetExtractedCGPA} CGPA</span>.
              In accordance with Career Saathi governance rules, data is <span className="underline">never silently overwritten</span>.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => reconcileDiscrepancy(profile.education.marksheetExtractedCGPA || currentCGPA)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm Extracted Marksheet Value ({profile.education.marksheetExtractedCGPA})</span>
              </button>
              <button
                onClick={() => reconcileDiscrepancy(profile.education.selfReportedCGPA)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer"
              >
                Keep Self-Reported Value ({profile.education.selfReportedCGPA})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Grid: Current CGPA Card, Completed Terms, Trajectory */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Deterministic CGPA
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-emerald-400">
              {currentCGPA > 0 ? currentCGPA.toFixed(2) : '0.00'}
            </span>
            <span className="text-xs text-slate-500">/ 10.0</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-2">
            Weighted across {termMetrics.totalCompletedCredits} total credits
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Terms Completed
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-indigo-400">
              {termMetrics.totalTermsCompleted}
            </span>
            <span className="text-xs text-slate-500">/ {profile.education.totalSemesters}</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-2">
            {termMetrics.remainingTerms} terms remaining to graduate
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Performance Trajectory
          </span>
          <div className="flex items-baseline space-x-2">
            <span className={`text-2xl font-black ${
              termMetrics.trajectory === 'Rising' ? 'text-emerald-400' : termMetrics.trajectory === 'Declining' ? 'text-amber-400' : 'text-slate-300'
            }`}>
              {termMetrics.totalTermsCompleted >= 2
                ? termMetrics.trajectory === 'Rising'
                  ? '↑ Rising'
                  : termMetrics.trajectory === 'Declining'
                  ? '↓ Declining'
                  : '→ Steady'
                : 'Baseline'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-2">
            {termMetrics.totalTermsCompleted >= 2
              ? 'Compared across recent consecutive terms'
              : 'Add at least 2 terms for trajectory'}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Equivalent Percentage
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-blue-400">
              {currentCGPA > 0 ? (currentCGPA * 9.5).toFixed(1) : '0.0'}%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-2">
            Standard AICTE formula (CGPA × 9.5)
          </span>
        </div>
      </div>

      {/* Term-by-Term SGPA Breakdown Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Semester Performance History
            </h2>
            <p className="text-xs text-slate-400">
              {profile.education.institution ? `${profile.education.institution} • ` : ''}Credit-weighted academic records
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {profile.education.terms?.length || 0} Terms Logged
          </span>
        </div>

        {(!profile.education.terms || profile.education.terms.length === 0) ? (
          <div className="p-8 text-center bg-slate-800/40 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-2">
            <p>No academic terms logged yet.</p>
            <p className="text-slate-500">
              Click 'Add Semester Term' above to enter your semester SGPA and credit load to establish your deterministic CGPA.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
            {profile.education.terms.map((term) => (
              <div
                key={term.termNumber}
                className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 text-center"
              >
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                  Semester {term.termNumber}
                </span>
                <span className="text-lg font-bold text-white block my-0.5">{term.sgpa}</span>
                <span className="text-[10px] text-slate-400 block">{term.credits} Credits</span>
                <span className="text-[9px] text-indigo-400 font-medium mt-1 inline-flex items-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" /> User Logged
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Target CGPA Feasibility Calculator (Mode A & Mode B) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Calculator className="w-4 h-4 text-purple-400" />
              Target CGPA & Mathematical Feasibility Simulator
            </h2>
            <p className="text-xs text-slate-400">
              Evaluates if your graduation CGPA target is mathematically achievable in remaining terms.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setUseCreditWeighted(false)}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                !useCreditWeighted ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Mode A (Equal Weight)
            </button>
            <button
              onClick={() => setUseCreditWeighted(true)}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                useCreditWeighted ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Mode B (Credit Weighted)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">
                Desired Graduation Target CGPA:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.05"
                  min="5.0"
                  max="10.0"
                  value={targetCGPAInput}
                  onChange={(e) => setTargetCGPAInput(parseFloat(e.target.value) || 0)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-base w-32 text-center"
                />
                <div className="flex gap-1">
                  {[8.0, 8.5, 9.0].map((val) => (
                    <button
                      key={val}
                      onClick={() => setTargetCGPAInput(val)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-2 rounded-lg font-semibold transition cursor-pointer"
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              Strict deterministic projection calculated using credit-weighted formulas.
            </p>
          </div>

          <div className="md:col-span-2 bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-semibold uppercase">
                {feasibilityResult.mode}
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  feasibilityResult.isFeasible
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {feasibilityResult.isFeasible ? '✓ Mathematically Feasible' : '✗ Infeasible Target'}
              </span>
            </div>

            <p className="text-xs text-slate-200 mb-3 leading-relaxed">
              {feasibilityResult.explanation}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-700/60 pt-3">
              <div>
                <span className="text-slate-400 block text-[11px]">Required Average SGPA:</span>
                <span className="font-bold text-white text-sm">
                  {feasibilityResult.requiredAverageSGPA} / 10.0
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Maximum Reachable CGPA:</span>
                <span className="font-bold text-emerald-400 text-sm">
                  {feasibilityResult.maxAchievableCGPA} / 10.0
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add Semester Term */}
      {showAddTermModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Record Semester Term</h3>
            <form onSubmit={handleAddTerm} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Semester Number</label>
                <input
                  type="number"
                  min="1"
                  max={profile.education.totalSemesters || 8}
                  value={termNumber}
                  onChange={(e) => setTermNumber(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Semester SGPA (0.00 – 10.00)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={sgpaInput}
                  onChange={(e) => setSgpaInput(e.target.value)}
                  placeholder="8.2"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Completed Credits in Term</label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={creditsInput}
                  onChange={(e) => setCreditsInput(e.target.value)}
                  placeholder="24"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddTermModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold"
                >
                  Save Term
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Degree Settings */}
      {showDegreeConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Academic Degree Settings</h3>
            <form onSubmit={handleSaveDegreeConfig} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Institution</label>
                <input
                  type="text"
                  value={institutionInput}
                  onChange={(e) => setInstitutionInput(e.target.value)}
                  placeholder="e.g. National Institute of Technology, Karnataka"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Degree</label>
                  <input
                    type="text"
                    value={degreeInput}
                    onChange={(e) => setDegreeInput(e.target.value)}
                    placeholder="B.Tech / M.Tech"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Branch / Major</label>
                  <input
                    type="text"
                    value={branchInput}
                    onChange={(e) => setBranchInput(e.target.value)}
                    placeholder="Computer Science & Engineering"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Total Semesters in Program</label>
                <input
                  type="number"
                  min="2"
                  max="12"
                  value={totalSemestersInput}
                  onChange={(e) => setTotalSemestersInput(parseInt(e.target.value) || 8)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowDegreeConfigModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
