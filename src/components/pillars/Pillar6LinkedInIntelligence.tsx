import React, { useState } from 'react';
import { useCareerSaathi } from '../../context/CareerSaathiContext';
import {
  Linkedin,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  ExternalLink,
  AlertCircle,
  Edit2,
} from 'lucide-react';

export const Pillar6LinkedInIntelligence: React.FC = () => {
  const {
    linkedInAnalysis,
    profile,
    activeJD,
    triggerLinkedInAnalysis,
    isAiProcessing,
    aiError,
  } = useCareerSaathi();

  const [customHeadline, setCustomHeadline] = useState(profile.headline);
  const [customAbout, setCustomAbout] = useState(profile.about);
  const [showConfig, setShowConfig] = useState(false);

  const handleRunAudit = async () => {
    await triggerLinkedInAnalysis({
      url: profile.linkedInUrl || 'https://linkedin.com/in/student',
      headline: customHeadline || profile.headline || 'Student / Early Career',
      about: customAbout || profile.about || 'Looking for software engineering opportunities.',
    });
    setShowConfig(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Linkedin className="w-4 h-4 text-blue-400" />
              <span>Pillar 6 • LinkedIn Intelligence</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Professional Positioning & Recruiter Visibility
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              User-authorized evidence analysis without scraping. Career Saathi isolates visibility gaps from genuine capability gaps and never fabricates accomplishments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>{showConfig ? 'Hide Profile Data' : 'Configure LinkedIn Text'}</span>
            </button>
            <button
              onClick={handleRunAudit}
              disabled={isAiProcessing}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAiProcessing ? 'Auditing...' : linkedInAnalysis ? 'Re-Audit with AI' : 'Run Profile Audit'}</span>
            </button>
            {profile.linkedInUrl && (
              <a
                href={profile.linkedInUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-blue-600/20 text-blue-300 border border-blue-500/40 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-blue-600/30 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Live Profile</span>
              </a>
            )}
          </div>
        </div>

        {/* Configuration Drawer */}
        {showConfig && (
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                Current LinkedIn Headline:
              </label>
              <input
                type="text"
                value={customHeadline}
                onChange={(e) => setCustomHeadline(e.target.value)}
                placeholder="e.g. B.Tech Computer Science Student | Aspiring SDE"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                Current LinkedIn About Summary:
              </label>
              <textarea
                rows={3}
                value={customAbout}
                onChange={(e) => setCustomAbout(e.target.value)}
                placeholder="Paste your current LinkedIn summary here..."
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleRunAudit}
                disabled={isAiProcessing}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-xl text-xs font-semibold"
              >
                {isAiProcessing ? 'Running Audit...' : 'Audit This Content'}
              </button>
            </div>
          </div>
        )}

        {aiError && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{aiError}</span>
          </div>
        )}
      </div>

      {!linkedInAnalysis ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-lg space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
            <Linkedin className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h2 className="text-lg font-bold text-white">No LinkedIn Audit Performed Yet</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Audit your headline, summary, and profile sections to uncover recruiter visibility gaps without fabricating skills.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={handleRunAudit}
              disabled={isAiProcessing}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAiProcessing ? 'Running LinkedIn Audit...' : 'Audit LinkedIn Profile with AI'}</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Visibility Gap vs Genuine Skill Gap */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visibility Gaps Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Eye className="w-4 h-4" />
                <span>Visibility Gaps (You Have It, Recruiters Can't See It)</span>
              </div>
              <h2 className="text-base font-bold text-white mb-2">
                Proven in Profile, Absent from LinkedIn
              </h2>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Capabilities with verified evidence that are buried, unlinked, or missing from your top featured sections:
              </p>

              <div className="space-y-3">
                {linkedInAnalysis.visibilityGaps && linkedInAnalysis.visibilityGaps.length > 0 ? (
                  linkedInAnalysis.visibilityGaps.map((gap, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 space-y-1.5"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">{gap.skill}</span>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                          Quick Win Fix
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{gap.reason}</p>
                      <div className="pt-1.5 border-t border-slate-700/60 flex items-center gap-1.5 text-xs text-emerald-400">
                        <ArrowRight className="w-3 h-3 shrink-0" />
                        <span>Action: {gap.action}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No visibility oversights detected.</p>
                )}
              </div>
            </div>

            {/* Genuine Skill Gaps Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Genuine Skill Gaps (Target Demands It, Evidence Missing)</span>
              </div>
              <h2 className="text-base font-bold text-white mb-2">
                Industry Demands Not Yet Demonstrated
              </h2>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Legitimate preparation deficits. Career Saathi will never advise adding buzzwords for skills you haven't built:
              </p>

              <div className="space-y-3">
                {linkedInAnalysis.genuineSkillGaps && linkedInAnalysis.genuineSkillGaps.length > 0 ? (
                  linkedInAnalysis.genuineSkillGaps.map((gap, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 space-y-1.5"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">{gap.skill}</span>
                        <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-semibold">
                          Requires Learning
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{gap.reason}</p>
                      <div className="pt-1.5 border-t border-slate-700/60 flex items-center gap-1.5 text-xs text-indigo-400">
                        <ArrowRight className="w-3 h-3 shrink-0" />
                        <span>Path: {gap.action}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No genuine skill gaps recorded for target role.</p>
                )}
              </div>
            </div>
          </div>

          {/* Headline & About Section Audit */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Copywriting & Recruiter Search Alignment
            </h2>

            <div className="space-y-4">
              {/* Headline Audit */}
              {linkedInAnalysis.headlineAudit && (
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-3">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                    1. LinkedIn Headline Audit
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-slate-900/80 border border-slate-700 rounded-lg">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Current</span>
                      <p className="text-slate-300 italic">"{linkedInAnalysis.headlineAudit.current}"</p>
                    </div>
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase block mb-1">
                        Optimized Recommendation
                      </span>
                      <p className="text-emerald-200 font-medium">"{linkedInAnalysis.headlineAudit.suggested}"</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 italic">
                    ★ Recruiter Rationale: {linkedInAnalysis.headlineAudit.rationale}
                  </p>
                </div>
              )}

              {/* About Summary Audit */}
              {linkedInAnalysis.aboutSummaryAudit && (
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-3">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                    2. About / Summary Narrative
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-slate-900/80 border border-slate-700 rounded-lg">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Current</span>
                      <p className="text-slate-300 italic">{linkedInAnalysis.aboutSummaryAudit.current}</p>
                    </div>
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase block mb-1">
                        Optimized Recommendation
                      </span>
                      <p className="text-emerald-200 font-medium">{linkedInAnalysis.aboutSummaryAudit.suggested}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 italic">
                    ★ Recruiter Rationale: {linkedInAnalysis.aboutSummaryAudit.rationale}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section Completeness Checklist */}
          {linkedInAnalysis.sectionChecklist && linkedInAnalysis.sectionChecklist.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Profile Completeness & Optimization Checklist
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {linkedInAnalysis.sectionChecklist.map((item, idx) => {
                  const isOpt = item.status === 'Optimized';
                  const isAttn = item.status === 'Needs Attention';
                  return (
                    <div
                      key={idx}
                      className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white">{item.section}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isOpt
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : isAttn
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{item.note}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
