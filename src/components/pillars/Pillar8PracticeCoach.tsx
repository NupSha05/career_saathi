import React, { useState } from 'react';
import { useCareerSaathi } from '../../context/CareerSaathiContext';
import {
  MessageSquareCode,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Layers,
  Award,
  RotateCw,
} from 'lucide-react';
import { PracticeEvaluation } from '../../types';

const SAMPLE_QUESTIONS = [
  {
    category: 'Personal Interview' as const,
    framework: 'STAR (Situation, Task, Action, Result)',
    question: 'Tell me about a challenging technical hurdle you faced during a project or internship, and how you overcame it.',
    sampleAnswer:
      'Situation: During my internship at HyperGrowth Labs, API latency on customer dashboards spiked above 3.5 seconds. Task: I was tasked with investigating root cause. Action: I used pg_stat_statements to find unindexed joins, created composite indexes on user_id and created_at, and introduced Redis caching for common queries. Result: Latency dropped by 38% down to 2.1 seconds, directly improving user experience.',
  },
  {
    category: 'Technical' as const,
    framework: 'Concept → Explanation → Example → Application',
    question: 'How does indexing work in PostgreSQL, and when would a B-Tree index become detrimental to performance?',
    sampleAnswer:
      'Concept: A B-Tree index is a balanced tree data structure that allows logarithmic O(log n) lookups by maintaining sorted keys. Explanation: It maps index entries to tuple IDs on disk pages. Example: For high-cardinality lookups like user_id, it is extremely efficient. Detriment: On write-heavy tables with high insert/update throughput, each modification forces index page rebalancing and WAL write amplification, slowing down ingest pipelines.',
  },
  {
    category: 'Case Interview' as const,
    framework: 'Problem → Analysis → Options → Recommendation',
    question: 'A high-scale e-commerce platform crashes during flash sales due to database connection exhaustion. How would you solve this?',
    sampleAnswer:
      'Problem: The connection pool is saturated by concurrent checkout requests. Analysis: Direct database connections cannot scale linearly with 100k requests/second. Options: 1) Increase max connections (risks RAM exhaustion), 2) Implement PgBouncer connection pooling, 3) Decouple checkout using asynchronous message queues (RabbitMQ/Kafka). Recommendation: Implement PgBouncer transaction pooling in front of Postgres and route checkout requests into a durable Kafka order queue to throttle DB writes.',
  },
];

export const Pillar8PracticeCoach: React.FC = () => {
  const {
    activeJD,
    practiceSessions,
    recordPracticeSession,
    readiness,
  } = useCareerSaathi();

  const [selectedCategory, setSelectedCategory] = useState<'Aptitude' | 'Technical' | 'Group Discussion (GD)' | 'Case Interview' | 'Personal Interview'>('Personal Interview');
  const [selectedMode, setSelectedMode] = useState<'Practice' | 'Timed Practice' | 'Targeted Weakness Practice'>('Practice');

  const [currentQuestion, setCurrentQuestion] = useState(SAMPLE_QUESTIONS[0].question);
  const [currentFramework, setCurrentFramework] = useState(SAMPLE_QUESTIONS[0].framework);
  const [userAnswer, setUserAnswer] = useState('');

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [latestEvaluation, setLatestEvaluation] = useState<PracticeEvaluation | null>(
    practiceSessions && practiceSessions.length > 0 ? practiceSessions[0]?.evaluation || null : null
  );

  const handleSelectSample = (sample: typeof SAMPLE_QUESTIONS[0]) => {
    setSelectedCategory(sample.category);
    setCurrentFramework(sample.framework);
    setCurrentQuestion(sample.question);
    setUserAnswer('');
    setLatestEvaluation(null);
  };

  const handleInsertTemplate = () => {
    const currentSample = SAMPLE_QUESTIONS.find((q) => q.question === currentQuestion) || SAMPLE_QUESTIONS[0];
    setUserAnswer(currentSample.sampleAnswer);
  };

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    setIsEvaluating(true);
    try {
      const res = await fetch('/api/ai/evaluate-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion,
          answer: userAnswer,
          category: selectedCategory,
          targetRole: activeJD.title,
          rubricFramework: currentFramework,
        }),
      });

      const evaluation: PracticeEvaluation = await res.json();
      setLatestEvaluation(evaluation);

      // Record to persistent practice sessions
      recordPracticeSession({
        category: selectedCategory,
        mode: selectedMode,
        frameworkApplied: currentFramework,
        question: currentQuestion,
        studentAnswer: userAnswer,
        evaluation,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <MessageSquareCode className="w-4 h-4" />
              <span>Pillar 8 • Preparation Intelligence + AI Practice Coach</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Role-Aware Mock Practice & Structured Rubric Evaluation
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Targeted to {activeJD.company} ({activeJD.title}). Evaluated using authoritative rubrics (STAR, Case, Technical Depth) without arbitrary pass/fail guessing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-bold">
              Interview Readiness: {readiness.interviewReadiness}%
            </span>
          </div>
        </div>

        {/* Category & Mode Bar */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap gap-1.5">
            {(['Personal Interview', 'Technical', 'Case Interview', 'Group Discussion (GD)', 'Aptitude'] as const).map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
            {(['Practice', 'Timed Practice', 'Targeted Weakness Practice'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMode(m)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                  selectedMode === m ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preset Question Pickers */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Select Practice Topic / Framework:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_QUESTIONS.map((sample, i) => (
            <button
              key={i}
              onClick={() => handleSelectSample(sample)}
              className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                currentQuestion === sample.question
                  ? 'bg-indigo-600/20 border-indigo-500/50 text-white'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
              }`}
            >
              <span className="text-[10px] text-indigo-400 font-bold block mb-1">
                {sample.category} • {sample.framework}
              </span>
              <p className="line-clamp-2 text-slate-200">{sample.question}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Active Question & Answer Submission Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Practice Prompt & Answer Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-indigo-400 font-bold uppercase">{selectedCategory} Prompt</span>
              <span className="text-slate-400 font-medium">Framework: {currentFramework}</span>
            </div>
            <h2 className="text-sm font-bold text-white leading-relaxed">{currentQuestion}</h2>
          </div>

          <form onSubmit={handleEvaluate} className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <div className="flex items-center gap-2">
                  <label className="text-slate-300 font-medium">Your Practice Response:</label>
                  <button
                    type="button"
                    onClick={handleInsertTemplate}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 underline font-medium"
                  >
                    Insert Example Template
                  </button>
                </div>
                <span className="text-[11px] text-slate-500">
                  {userAnswer.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                rows={9}
                required
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type or speak your answer following the recommended framework..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-slate-400">
                Target Role: <strong className="text-white">{activeJD.title}</strong>
              </span>
              <button
                type="submit"
                disabled={isEvaluating}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isEvaluating ? 'Evaluating with Rubrics...' : 'Evaluate Answer'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Structured Rubric Evaluation Output */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                Rubric Evaluation & Qualitative Feedback
              </h2>
              {latestEvaluation && (
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    latestEvaluation.overallVerdict === 'Strong'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {latestEvaluation.overallVerdict} ({latestEvaluation.scoreOutOf10}/10)
                </span>
              )}
            </div>

            {latestEvaluation ? (
              <div className="space-y-4 text-xs">
                {/* 4 Rubric Breakdown Meters */}
                <div className="grid grid-cols-2 gap-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-300">Technical Depth</span>
                      <span className="font-bold text-emerald-400">
                        {latestEvaluation.rubricBreakdown.correctnessAndTechnicalDepth?.score}/10
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2">
                      {latestEvaluation.rubricBreakdown.correctnessAndTechnicalDepth?.feedback}
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-300">Framework Structure</span>
                      <span className="font-bold text-emerald-400">
                        {latestEvaluation.rubricBreakdown.structureAndFrameworkAdherence?.score}/10
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2">
                      {latestEvaluation.rubricBreakdown.structureAndFrameworkAdherence?.feedback}
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-300">Communication Clarity</span>
                      <span className="font-bold text-emerald-400">
                        {latestEvaluation.rubricBreakdown.communicationAndClarity?.score}/10
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2">
                      {latestEvaluation.rubricBreakdown.communicationAndClarity?.feedback}
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-300">Target Role Fit</span>
                      <span className="font-bold text-emerald-400">
                        {latestEvaluation.rubricBreakdown.relevanceToTargetRole?.score}/10
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2">
                      {latestEvaluation.rubricBreakdown.relevanceToTargetRole?.feedback}
                    </p>
                  </div>
                </div>

                {/* Highlighted Strengths */}
                <div className="space-y-1">
                  <span className="font-semibold text-emerald-400 text-[11px] uppercase block">
                    ✓ Highlighted Strengths:
                  </span>
                  {latestEvaluation.highlightedStrengths.map((str, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>

                {/* Pinpointed Weaknesses */}
                <div className="space-y-1">
                  <span className="font-semibold text-amber-400 text-[11px] uppercase block">
                    ⚠ Areas for Growth:
                  </span>
                  {latestEvaluation.pinpointedWeaknesses.map((w, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>

                {/* Ideal Structure */}
                <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
                  <span className="font-semibold text-slate-400 text-[10px] uppercase block mb-0.5">
                    Recommended Model Narrative:
                  </span>
                  <p className="text-slate-300 text-[11px]">{latestEvaluation.idealAnswerStructure}</p>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500 text-xs">
                Type your answer and click "Evaluate Answer" to run rubric assessment.
              </div>
            )}
          </div>

          {/* Dynamic Follow-up Question */}
          {latestEvaluation?.followUpQuestion && (
            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-1">
                Dynamic Follow-Up Interview Question:
              </span>
              <p className="text-xs text-white italic">"{latestEvaluation.followUpQuestion}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
