import React, { useState } from 'react';
import { useCareerSaathi } from '../../context/CareerSaathiContext';
import {
  FileText,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag,
  Layers,
  FileCheck,
  Upload,
} from 'lucide-react';
import { GapType } from '../../types';

export const Pillar5CVIntelligence: React.FC = () => {
  const {
    cvAnalysis,
    activeJD,
    profile,
    triggerCVAnalysis,
    isAiProcessing,
    aiError,
    uploadDocument,
    authState,
  } = useCareerSaathi();
  const [selectedFilter, setSelectedFilter] = useState<GapType | 'All'>('All');
  const [customCvInput, setCustomCvInput] = useState('');
  const [showInputDrawer, setShowInputDrawer] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(`Uploading ${file.name} to persistent storage...`);

    try {
      if (authState.status === 'authenticated') {
        const uploadRes = await uploadDocument(file, 'cv_resume');
        setUploadStatus(`Saved to storage: ${uploadRes?.fileName || file.name}`);
      } else {
        setUploadStatus(`Parsed local file: ${file.name}`);
      }

      // Read text if text-readable
      const text = await file.text();
      if (text && text.trim().length > 20) {
        setCustomCvInput(text);
        await triggerCVAnalysis(text);
      } else {
        await triggerCVAnalysis();
      }
    } catch (err: any) {
      setUploadStatus(`Upload notice: ${err.message || 'Stored locally for review'}`);
      await triggerCVAnalysis();
    } finally {
      setIsUploading(false);
    }
  };

  const filteredGaps =
    cvAnalysis && cvAnalysis.gaps
      ? selectedFilter === 'All'
        ? cvAnalysis.gaps
        : cvAnalysis.gaps.filter((g) => g.gapType === selectedFilter)
      : [];

  const getGapBadge = (type: GapType) => {
    switch (type) {
      case 'CV Gap':
        return {
          label: 'CV Gap (Omitted from Resume)',
          desc: 'Verified in your profile, but missing from your CV!',
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        };
      case 'Evidence Gap':
        return {
          label: 'Evidence Gap (Unbacked Claim)',
          desc: 'Claimed on CV, but no project/internship proof exists in profile.',
          color: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        };
      case 'Profile Gap':
      default:
        return {
          label: 'Profile Gap (Skill Lacking)',
          desc: 'Target JD requires this skill, but neither profile nor CV has it.',
          color: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        };
    }
  };

  const handleRunAnalysis = async () => {
    await triggerCVAnalysis(customCvInput.trim() ? customCvInput.trim() : undefined);
    setShowInputDrawer(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4" />
              <span>Pillar 5 • CV & Document Intelligence</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Triad Gap Analysis & Quantified Resume Impact
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Cross-validating Profile ↔ CV ↔ Target JD. Distinguishes visibility oversights from true skill deficiencies so you never misdiagnose preparation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-xl font-bold">
              Target JD: {activeJD ? activeJD.company : 'None Selected'}
            </span>
            <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
              <input
                type="file"
                accept=".pdf,.docx,.txt,.md"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
            <button
              onClick={() => setShowInputDrawer(!showInputDrawer)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              {showInputDrawer ? 'Hide CV Input' : 'Paste Custom CV'}
            </button>
            <button
              onClick={handleRunAnalysis}
              disabled={isAiProcessing || isUploading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAiProcessing ? 'Analyzing...' : cvAnalysis ? 'Re-Analyze with AI' : 'Run Triad Analysis'}</span>
            </button>
          </div>
        </div>

        {uploadStatus && (
          <div className="mt-3 p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>{uploadStatus}</span>
          </div>
        )}

        {/* Custom CV Input Drawer */}
        {showInputDrawer && (
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
            <label className="text-xs text-slate-300 font-semibold block">
              Paste Resume / CV Plaintext for Cross-Validation:
            </label>
            <textarea
              rows={4}
              value={customCvInput}
              onChange={(e) => setCustomCvInput(e.target.value)}
              placeholder="Paste your CV resume text here (education, experience bullets, projects, skills). If empty, your profile records will be used as baseline."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 font-sans"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleRunAnalysis}
                disabled={isAiProcessing}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-xl text-xs font-semibold"
              >
                {isAiProcessing ? 'Analyzing with AI...' : 'Analyze This CV'}
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

      {/* Main Content: Empty State vs Analyzed Data */}
      {!cvAnalysis ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-lg space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h2 className="text-lg font-bold text-white">No CV Analyzed Yet</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Run triad cross-validation against your verified profile evidence and your active target opportunity ({activeJD ? activeJD.company : 'selected role'}).
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={handleRunAnalysis}
              disabled={isAiProcessing}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAiProcessing ? 'Running AI Analysis...' : 'Analyze CV Against Target JD'}</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Overall CV Health
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-indigo-400">{cvAnalysis.completenessScore}%</span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-2">ATS readability & completeness score</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Quantified Metrics Ratio
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-emerald-400">
                  {Math.round((cvAnalysis.quantifiedAchievementsRatio || 0) * 100)}%
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-2">Bullet points containing measurable metrics</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Active Action Verb Ratio
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-blue-400">
                  {Math.round((cvAnalysis.activeVoiceRatio || 0) * 100)}%
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-2">Sentences starting with strong action verbs</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Target JD Keyword Match
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-purple-400">{cvAnalysis.targetJDAlignmentScore}%</span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-2">Alignment with {activeJD ? activeJD.company : 'Target JD'}</span>
            </div>
          </div>

          {/* Triad Gap Classification */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  Triad Gap Taxonomy & Actionable Fixes
                </h2>
                <p className="text-xs text-slate-400">
                  Strict classification prevents false diagnostics between CV presentation and genuine competence.
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-1 text-xs">
                {(['All', 'CV Gap', 'Evidence Gap', 'Profile Gap'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                      selectedFilter === filter
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {filteredGaps.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-800/40 rounded-xl">
                No gaps detected under filter: {selectedFilter}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredGaps.map((gap) => {
                  const badge = getGapBadge(gap.gapType);
                  return (
                    <div
                      key={gap.id}
                      className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${badge.color}`}>
                            {badge.label}
                          </span>
                          <h3 className="text-xs font-bold text-white">{gap.skillOrCapability}</h3>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{gap.description}</p>
                        {gap.evidenceSource && (
                          <span className="text-[11px] text-slate-400 block italic">
                            Verified Source: {gap.evidenceSource}
                          </span>
                        )}
                      </div>

                      <div className="bg-slate-900/80 border border-slate-700/80 rounded-lg p-3 md:max-w-xs shrink-0">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase block mb-1">
                          Recommended Action
                        </span>
                        <p className="text-xs text-slate-200">{gap.suggestedAction}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quantified Bullet Point Rewrites */}
          {cvAnalysis.bulletImprovements && cvAnalysis.bulletImprovements.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="mb-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Impact-Driven Bullet Point Transformations
                </h2>
                <p className="text-xs text-slate-400">
                  Replacing passive duty descriptions with action verb + technical tool + quantifiable metric.
                </p>
              </div>

              <div className="space-y-4">
                {cvAnalysis.bulletImprovements.map((b, idx) => (
                  <div key={idx} className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                        <span className="text-[10px] font-bold text-rose-400 uppercase block mb-1">
                          Original Weak Statement
                        </span>
                        <p className="text-slate-300 italic">"{b.original}"</p>
                      </div>

                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase block mb-1">
                          Recommended High-Impact Bullet
                        </span>
                        <p className="text-emerald-200 font-medium">"{b.improved}"</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 italic">★ Rationale: {b.rationale}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended ATS Keywords to Inject */}
          {cvAnalysis.suggestedKeywordsToAdd && cvAnalysis.suggestedKeywordsToAdd.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-blue-400" />
                Target JD High-Frequency Keywords
              </h2>
              <p className="text-xs text-slate-400 mb-3">
                Include these verified terms in your CV to improve automated screening ATS match rates:
              </p>
              <div className="flex flex-wrap gap-2">
                {cvAnalysis.suggestedKeywordsToAdd.map((kw, idx) => (
                  <span
                    key={idx}
                    className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs px-3 py-1 rounded-lg font-mono font-medium"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
