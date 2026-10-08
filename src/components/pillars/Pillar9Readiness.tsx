import React from 'react';
import { useCareerSaathi } from '../../context/CareerSaathiContext';
import {
  LineChart,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers,
  History,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export const Pillar9Readiness: React.FC = () => {
  const { readiness, readinessSnapshots, eventImpactLog, profile } = useCareerSaathi();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <LineChart className="w-4 h-4" />
              <span>Pillar 9 • Readiness Intelligence & Event-Impact Analytics</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Multi-Dimensional Career Readiness Diagnostic
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Strictly explainable. Career Saathi never presents an opaque or unexplained number. Every point in the index traces directly to validated evidence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl font-bold">
              Current Aggregate: {readiness.overallScore}/100
            </span>
          </div>
        </div>
      </div>

      {/* Deep-Dive on the 5 Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase">1. Academic</span>
            <span className="text-xs font-bold text-blue-400">20% Weight</span>
          </div>
          <span className="text-3xl font-black text-white">{readiness.academicReadiness}%</span>
          <p className="text-[11px] text-slate-400">
            Based on {(profile.education.verifiedCGPA || profile.education.selfReportedCGPA || 0).toFixed(2)} CGPA across {profile.education.terms?.length || 0} completed terms.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase">2. Profile</span>
            <span className="text-xs font-bold text-indigo-400">20% Weight</span>
          </div>
          <span className="text-3xl font-black text-white">{readiness.profileReadiness}%</span>
          <p className="text-[11px] text-slate-400">
            {profile.experiences.length > 0 ? `${profile.experiences.length} work experience(s)` : 'No industry tenure recorded'}, and {profile.projects.length} project repository(s).
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase">3. Skill Depth</span>
            <span className="text-xs font-bold text-amber-400">25% Weight</span>
          </div>
          <span className="text-3xl font-black text-white">{readiness.skillReadiness}%</span>
          <p className="text-[11px] text-slate-400">
            {profile.skills.length > 0 ? `${profile.skills.length} technical skills registered with evidence depth.` : 'No skills recorded in profile.'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase">4. Opportunity</span>
            <span className="text-xs font-bold text-purple-400">15% Weight</span>
          </div>
          <span className="text-3xl font-black text-white">{readiness.opportunityReadiness}%</span>
          <p className="text-[11px] text-slate-400">
            Evaluated against active target job requirements and deterministic criteria.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase">5. Interview Prep</span>
            <span className="text-xs font-bold text-emerald-400">20% Weight</span>
          </div>
          <span className="text-3xl font-black text-white">{readiness.interviewReadiness}%</span>
          <p className="text-[11px] text-slate-400">
            Derived from structured framework practice sessions and rubric scores.
          </p>
        </div>
      </div>

      {/* Positive Contributors vs Limiting Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-3">
          <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Positive Contributors Driving Score Up
          </h2>
          <div className="space-y-2 text-xs">
            {readiness.positiveContributors.map((c, i) => (
              <div key={i} className="p-3 bg-emerald-950/20 border border-emerald-800/30 rounded-xl text-emerald-200">
                • {c}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-3">
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            Limiting Factors & Immediate Bottlenecks
          </h2>
          <div className="space-y-2 text-xs">
            {readiness.limitingFactors.map((l, i) => (
              <div key={i} className="p-3 bg-amber-950/20 border border-amber-800/30 rounded-xl text-amber-200">
                • {l}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Readiness Snapshot Timeline Trend */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" />
            Readiness Trajectory Timeline
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {readinessSnapshots.length} Point-in-Time Snapshots
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {readinessSnapshots.map((snap) => (
            <div
              key={snap.id}
              className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 text-xs space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">{snap.triggerEvent}</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">
                  {snap.overallScore}/100
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">
                {new Date(snap.timestamp).toLocaleDateString()}
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-300 pt-1 border-t border-slate-700/50">
                <span>Acad: {snap.academicReadiness}%</span>
                <span>Prof: {snap.profileReadiness}%</span>
                <span>Skill: {snap.skillReadiness}%</span>
                <span>Prep: {snap.interviewReadiness}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Event Impact Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Dynamic Event → Impact Matrix Log (Blueprint Section 14)
          </h2>
          <span className="text-xs text-slate-400">Targeted Recalculation Engine</span>
        </div>

        <div className="space-y-3">
          {eventImpactLog.map((ev) => (
            <div
              key={ev.id}
              className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-xl text-xs space-y-1.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{ev.eventType}</span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono">
                    {ev.sourcePillar}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(ev.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">{ev.explanation}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Impacted Dimensions:</span>
                {ev.affectedDimensions.map((dim, i) => (
                  <span key={i} className="text-[10px] bg-slate-700 text-slate-200 px-2 py-0.5 rounded font-medium">
                    {dim}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
