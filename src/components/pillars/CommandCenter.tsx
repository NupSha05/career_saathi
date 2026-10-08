import React from 'react';
import { useCareerSaathi } from '../../context/CareerSaathiContext';
import {
  TrendingUp,
  Award,
  BookOpen,
  Briefcase,
  AlertCircle,
  ArrowRight,
  Zap,
  Activity,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  FileDown,
} from 'lucide-react';
import { TabType } from '../Navigation';

interface CommandCenterProps {
  setActiveTab: (tab: TabType) => void;
  onOpenAskSaathi: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ setActiveTab, onOpenAskSaathi }) => {
  const {
    profile,
    readiness,
    activeJD,
    currentFitReport,
    applications,
    actions,
    eventImpactLog,
  } = useCareerSaathi();

  const activeApps = applications.filter(
    (a) => a.stage !== 'Selected' && a.stage !== 'Rejected' && a.stage !== 'Withdrawn'
  );

  return (
    <div className="space-y-6">
      {/* Top Banner / Student Context Summary */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Career Saathi Cockpit • Persistent Student State</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {profile.name ? `Welcome back, ${profile.name}` : 'Welcome to Career Saathi AI'}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Targeting: <span className="text-slate-200 font-medium">{profile.preferences.targetRoles.join(', ')}</span> {profile.college ? `• ${profile.college}` : '• Setup profile in Pillar 1'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setActiveTab('report-center')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-2"
              title="View and email complete profile analysis & recommendations"
            >
              <FileDown className="w-4 h-4 text-emerald-400" />
              <span>Profile Analysis Report</span>
            </button>
            <button
              onClick={() => setActiveTab('pillar-4-opportunity')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span>Target: {activeJD.company}</span>
            </button>
            <button
              onClick={onOpenAskSaathi}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask Career Saathi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Overall Readiness Score & 5 Dimensional Meters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Readiness Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Career Readiness Index
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                {readiness.trend === 'Improving' ? '↑ Trend: Improving' : '→ Trend: Stable'}
              </span>
            </div>

            <div className="flex items-baseline space-x-3 my-2">
              <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">
                {readiness.overallScore}
              </span>
              <span className="text-slate-500 font-semibold text-lg">/ 100</span>
            </div>

            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Synthesized deterministically from academic verification, verified evidence depth, opportunity alignment, and rubric performance.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2">
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
              Key Contributors:
            </span>
            {readiness.positiveContributors.length > 0 ? (
              readiness.positiveContributors.slice(0, 2).map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-emerald-400/90">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">
                Add academic terms and verified skills to establish readiness contributors.
              </p>
            )}
          </div>
        </div>

        {/* 5 Dimensional Breakdown Meters */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              5-Pillar Readiness Dimensions
            </h2>
            <button
              onClick={() => setActiveTab('pillar-9-readiness')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              Deep Dive <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-4">
            {/* 1. Academic */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" /> Academic Readiness (CGPA: {profile.education.verifiedCGPA || profile.education.selfReportedCGPA})
                </span>
                <span className="font-bold text-slate-200">{readiness.academicReadiness}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${readiness.academicReadiness}%` }}
                />
              </div>
            </div>

            {/* 2. Profile */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-indigo-400" /> Profile & Experience Completeness
                </span>
                <span className="font-bold text-slate-200">{readiness.profileReadiness}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${readiness.profileReadiness}%` }}
                />
              </div>
            </div>

            {/* 3. Skill & Evidence */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Skill Depth & Evidence Classification (Level 0-4)
                </span>
                <span className="font-bold text-slate-200">{readiness.skillReadiness}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${readiness.skillReadiness}%` }}
                />
              </div>
            </div>

            {/* 4. Opportunity Alignment */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-purple-400" /> Target Opportunity Alignment ({activeJD.company})
                </span>
                <span className="font-bold text-slate-200">{readiness.opportunityReadiness}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${readiness.opportunityReadiness}%` }}
                />
              </div>
            </div>

            {/* 5. Interview Prep */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" /> Interview & Practice Coach Maturity
                </span>
                <span className="font-bold text-slate-200">{readiness.interviewReadiness}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${readiness.interviewReadiness}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Active JD Match & Prioritized Next Best Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Opportunity & Eligibility Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Opportunity Fit
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                currentFitReport.matchTier === 'Strong Match'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : currentFitReport.matchTier === 'Conditional Match'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {currentFitReport.matchTier} ({currentFitReport.overallFitScore}%)
            </span>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-white text-base">{activeJD.title}</h3>
                <p className="text-xs text-indigo-400 font-medium">{activeJD.company} • {activeJD.location}</p>
              </div>
              <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                {activeJD.salaryRange}
              </span>
            </div>

            {/* Eligibility Rule Result */}
            <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
              <span className="text-slate-400">Deterministic Eligibility:</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded ${
                  currentFitReport.eligibilityPassed
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-rose-400 bg-rose-500/10'
                }`}
              >
                {currentFitReport.eligibilityPassed ? '✓ All Hard Criteria Passed' : '✗ Cutoff / Criteria Blocked'}
              </span>
            </div>
          </div>

          <div className="space-y-2 mb-4 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Must-Have Skills Matched:</span>
              <span className="font-semibold text-emerald-400">
                {activeJD.mustHaveSkills.length - currentFitReport.missingMustHaves.length} / {activeJD.mustHaveSkills.length}
              </span>
            </div>
            {currentFitReport.missingMustHaves.length > 0 && (
              <div className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5">
                <span className="font-semibold block mb-0.5">Missing Must-Have Evidence:</span>
                {currentFitReport.missingMustHaves.map((m) => m.skill).join(', ')}
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('pillar-4-opportunity')}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-medium transition cursor-pointer text-center"
          >
            Inspect Requirement Breakdown & Gaps →
          </button>
        </div>

        {/* Prioritized Action Center Top Items */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Next Best Actions
            </h2>
            <button
              onClick={() => setActiveTab('action-center')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              View All ({actions.length}) <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {actions.length > 0 ? (
              actions.slice(0, 3).map((action) => (
                <div
                  key={action.id}
                  className="bg-slate-800/70 border border-slate-700/60 hover:border-slate-600 rounded-xl p-3.5 transition"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-white line-clamp-1">{action.title}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold shrink-0 ${
                        action.impact === 'High Impact'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {action.impact}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">{action.description}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="text-indigo-400 font-medium">{action.pillarTarget}</span>
                    <span className="text-amber-400 font-medium">{action.effort}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic py-3 text-center">
                No immediate actions pending. Setup profile evidence to generate prioritized actions.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Active Applications Tracker & Event Impact Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Application Funnel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              Active Applications ({activeApps.length})
            </h2>
            <button
              onClick={() => setActiveTab('pillar-7-applications')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              Manage Funnel <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {activeApps.length > 0 ? (
              activeApps.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{app.company}</span>
                    <span className="text-[11px] text-slate-400">{app.role}</span>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {app.stage}
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-1">Applied: {app.appliedDate}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                No active applications in funnel. Log job applications in Pillar 7.
              </p>
            )}
          </div>
        </div>

        {/* Dynamic Event Impact Matrix Stream */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              Event → Impact Audit Stream
            </h2>
            <span className="text-[10px] text-slate-500">Live Traceability</span>
          </div>

          <div className="space-y-3 max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 pr-1">
            {eventImpactLog.length > 0 ? (
              eventImpactLog.slice(0, 4).map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 bg-slate-800/40 border border-slate-700/40 rounded-xl text-xs space-y-1"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-white">{ev.eventType}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{ev.explanation}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {ev.affectedDimensions.map((dim, i) => (
                      <span
                        key={i}
                        className="text-[9px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-medium"
                      >
                        {dim}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                No activity events logged yet. Actions in any pillar will stream audit updates here.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
