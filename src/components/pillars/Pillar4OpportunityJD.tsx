import React, { useState } from 'react';
import { useCareerSaathi } from '../../context/CareerSaathiContext';
import {
  Briefcase,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Upload,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Building2,
  MapPin,
  Clock,
  Layers,
} from 'lucide-react';
import { OpportunityJD } from '../../types';

export const Pillar4OpportunityJD: React.FC = () => {
  const {
    activeJD,
    allJDs,
    setActiveJD,
    addJD,
    currentFitReport,
    profile,
  } = useCareerSaathi();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [jdPasteText, setJdPasteText] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const handleParseJD = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jdPasteText.trim()) return;

    setIsParsing(true);
    try {
      const res = await fetch('/api/ai/parse-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jdText: jdPasteText }),
      });
      const data = await res.json();

      const newJD: OpportunityJD = {
        id: `jd-${Date.now()}`,
        company: data.company || 'Custom Opportunity',
        title: data.title || 'Target Role',
        function: data.function || 'Engineering',
        location: data.location || 'Bengaluru / Hybrid',
        workArrangement: data.workArrangement || 'Hybrid',
        experienceRange: data.experienceRange || '0 - 2 Years',
        educationRequirement: data.educationRequirement || 'B.Tech / B.E.',
        cgpaCutoff: data.cgpaCutoff || 7.0,
        maxBacklogs: data.maxBacklogs ?? 0,
        salaryRange: data.salaryRange || '₹10 - ₹15 LPA',
        mustHaveSkills: data.mustHaveSkills || ['Problem Solving', 'Data Structures'],
        preferredSkills: data.preferredSkills || ['Git', 'System Design'],
        goodToHaveSkills: data.goodToHaveSkills || [],
        keyResponsibilities: data.keyResponsibilities || [],
        ambiguousOrUncertainTerms: data.ambiguousOrUncertainTerms || [],
        rawText: jdPasteText,
      };

      addJD(newJD);
      setShowUploadModal(false);
      setJdPasteText('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Preset Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Briefcase className="w-4 h-4" />
              <span>Pillar 4 • Opportunity & Role Fit Intelligence</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              JD Semantic Parsing & Deterministic Eligibility
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Strict separation: Academic cutoffs are tested via deterministic rules, while semantic evidence coverage is evaluated by Gemini. No unsupported hiring odds.
            </p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition cursor-pointer flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload / Paste New JD</span>
          </button>
        </div>

        {/* Preset Selector Buttons */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Switch Target Opportunity:
          </span>
          <div className="flex flex-wrap gap-2">
            {allJDs.map((jd) => {
              const isSelected = activeJD.id === jd.id;
              return (
                <button
                  key={jd.id}
                  onClick={() => setActiveJD(jd)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/50 shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{jd.company}: {jd.title}</span>
                  {jd.cgpaCutoff >= 8.5 && (
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                      Cutoff: {jd.cgpaCutoff}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Target Opportunity Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{activeJD.title}</h2>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                {activeJD.workArrangement}
              </span>
            </div>
            <p className="text-xs text-indigo-400 font-semibold mt-0.5 flex items-center gap-2">
              <span>{activeJD.company}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-400">
                <MapPin className="w-3 h-3" /> {activeJD.location}
              </span>
              <span>•</span>
              <span className="text-emerald-400">{activeJD.salaryRange}</span>
            </p>
          </div>

          <div className="text-right">
            <span
              className={`text-xs px-3 py-1 rounded-full font-bold inline-block ${
                currentFitReport.matchTier === 'Strong Match'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : currentFitReport.matchTier === 'Conditional Match'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {currentFitReport.matchTier} ({currentFitReport.overallFitScore}%)
            </span>
            <span className="block text-[10px] text-slate-500 mt-1">
              Contextual Match (Not a selection guarantee)
            </span>
          </div>
        </div>

        {/* Deterministic Criteria Gate */}
        <div className="mt-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              1. Deterministic Eligibility Gate (Rule-Based, Non-Negotiable)
            </span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded ${
                currentFitReport.eligibilityPassed ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
              }`}
            >
              {currentFitReport.eligibilityPassed ? 'ELIGIBLE TO APPLY' : 'BLOCKED BY HARD CUTOFF'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {currentFitReport.criteriaBreakdown.map((crit, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs space-y-1 ${
                  crit.status === 'PASS'
                    ? 'bg-slate-800/60 border-slate-700/60'
                    : crit.status === 'FAIL'
                    ? 'bg-rose-950/20 border-rose-800/40'
                    : 'bg-amber-950/20 border-amber-800/40'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">{crit.criterion}</span>
                  {crit.status === 'PASS' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : crit.status === 'FAIL' ? (
                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  ) : (
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </div>
                <div className="text-[10px] text-slate-400">
                  <span className="block">Required: <strong className="text-slate-200">{crit.required}</strong></span>
                  <span className="block">Your Record: <strong className="text-slate-200">{crit.studentValue}</strong></span>
                </div>
                <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-700/40">
                  {crit.notes}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Ambiguous Terms Warning (if any) */}
        {activeJD.ambiguousOrUncertainTerms.length > 0 && (
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs space-y-1">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Explicit Ambiguity in JD Document:
            </span>
            {activeJD.ambiguousOrUncertainTerms.map((term, i) => (
              <p key={i} className="text-slate-300 text-[11px] leading-relaxed">
                • {term}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Semantic Requirements & Evidence Mapping Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Must-Have Requirements Coverage */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Must-Have Skills & Evidence Mapping
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {currentFitReport.matchedSkills.length} / {activeJD.mustHaveSkills.length} Verified
            </span>
          </div>

          <div className="space-y-2.5">
            {activeJD.mustHaveSkills.map((skillName, idx) => {
              const matched = currentFitReport.matchedSkills.find(
                (m) => m.skill.toLowerCase() === skillName.toLowerCase()
              );
              return (
                <div
                  key={idx}
                  className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-semibold text-white block">{skillName}</span>
                    <span className="text-[10px] text-slate-400">
                      {matched ? 'Backed by profile projects / internships' : 'No recorded evidence in student profile'}
                    </span>
                  </div>
                  {matched ? (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                      Matched (L{matched.evidenceLevel})
                    </span>
                  ) : (
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded-full font-bold">
                      Profile Gap
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Preferred & Good-To-Have Skills */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Preferred & Good-to-Have Skills
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {activeJD.preferredSkills.length + activeJD.goodToHaveSkills.length} Skills
            </span>
          </div>

          <div className="space-y-2.5">
            {activeJD.preferredSkills.map((skillName, idx) => {
              const found = profile.skills.find(
                (s) => s.name.toLowerCase().includes(skillName.toLowerCase()) || skillName.toLowerCase().includes(s.name.toLowerCase())
              );
              return (
                <div
                  key={idx}
                  className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-white block">{skillName}</span>
                    <span className="text-[10px] text-slate-400">Preferred requirement</span>
                  </div>
                  {found ? (
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full font-bold">
                      Present (L{found.evidenceLevel})
                    </span>
                  ) : (
                    <span className="text-[10px] bg-slate-700 text-slate-300 px-2.5 py-0.5 rounded-full font-semibold">
                      Unfulfilled
                    </span>
                  )}
                </div>
              );
            })}

            {activeJD.goodToHaveSkills.map((skillName, idx) => (
              <div
                key={`g-${idx}`}
                className="p-3 bg-slate-800/40 border border-slate-700/40 rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-medium text-slate-300 block">{skillName}</span>
                  <span className="text-[10px] text-slate-500">Good-to-have bonus</span>
                </div>
                <span className="text-[10px] text-slate-400">Bonus</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload JD Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Upload or Paste Job Description</h3>
            <p className="text-xs text-slate-400 mb-4">
              Career Saathi AI will semantically parse company details, cutoffs, and skill tiers, then test deterministic eligibility.
            </p>
            <form onSubmit={handleParseJD} className="space-y-4">
              <textarea
                rows={8}
                required
                value={jdPasteText}
                onChange={(e) => setJdPasteText(e.target.value)}
                placeholder="Paste full Job Description text here..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />

              <div className="flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => setJdPasteText(PRESET_JDS[0].rawText || '')}
                  className="text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                >
                  Load sample JD text
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isParsing}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isParsing ? 'Analyzing with AI...' : 'Parse Opportunity'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
