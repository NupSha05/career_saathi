import React, { useState } from 'react';
import { useCareerSaathi } from '../../context/CareerSaathiContext';
import {
  FileDown,
  Mail,
  Printer,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  Send,
  ShieldCheck,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { EmailLogEntry } from '../../types';

export const ReportCenterView: React.FC = () => {
  const {
    profile,
    readiness,
    activeJD,
    currentFitReport,
    cvAnalysis,
    emailLogs,
    logEmailDispatch,
    actions,
  } = useCareerSaathi();

  const [selectedReportType, setSelectedReportType] = useState<string>('Career Readiness Diagnostic');
  const [recipientEmail, setRecipientEmail] = useState<string>('placement.office@campus.edu');
  const [recipientRole, setRecipientRole] = useState<string>('Campus Placement Officer');
  const [customSubject, setCustomSubject] = useState<string>(
    `Career Saathi Readiness Dossier — ${profile.name || 'Candidate'} (${profile.education.branch || 'Student'})`
  );
  const [customMessage, setCustomMessage] = useState<string>(
    `Dear Placement Cell,\n\nPlease find attached my Career Saathi AI Readiness Diagnostic Report for campus placement drives. All academic and project repositories reflect my current evidence baseline.\n\nBest regards,\n${profile.name || 'Candidate'}`
  );

  const [isSending, setIsSending] = useState(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail.trim()) return;

    setIsSending(true);
    setSendSuccessMessage(null);

    try {
      const res = await fetch('/api/email/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: recipientEmail.trim(),
          recipientRole,
          reportTitle: selectedReportType,
          customMessage,
          studentName: profile.name || 'Candidate',
        }),
      });

      const data = await res.json();
      if (data.log) {
        logEmailDispatch(data.log);
      } else {
        const fallbackLog: EmailLogEntry = {
          id: `email-${Date.now()}`,
          timestamp: new Date().toISOString(),
          recipient: recipientEmail.trim(),
          recipientRole,
          reportTitle: selectedReportType,
          subject: customSubject,
          status: 'AUDIT_LOGGED',
          authenticatedSender: profile.email || 'student@careersaathi.app',
        };
        logEmailDispatch(fallbackLog);
      }

      setSendSuccessMessage(`Report generation and destination metadata recorded in audit register for ${recipientEmail}.`);
    } catch (err) {
      console.error(err);
      setSendSuccessMessage('Failed to record dispatch in audit register.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <FileDown className="w-4 h-4" />
              <span>Cross-Product Layer • Report Center & Export Register</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Career Dossiers & Audit Register
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Reports compile authoritative data states with provenance metadata. Export high-fidelity PDFs or log report transmissions in the audit register.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-indigo-400" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* Report Type Selector */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap gap-2 text-xs">
          {[
            'Career Readiness Diagnostic',
            'JD & Role Fit Analysis',
            'CV & Profile Optimization',
            'Preparation & Interview Assessment',
            '30-Day Targeted Improvement Plan',
          ].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedReportType(type)}
              className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
                selectedReportType === type
                  ? 'bg-indigo-600 text-white font-semibold shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Live Printable Report Preview & Export Dispatch Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Report Preview (A4 styled) */}
        <div className="lg:col-span-2 bg-white text-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-200 font-sans print:m-0 print:p-0 print:border-none print:shadow-none">
          {/* Report Header */}
          <div className="border-b-2 border-slate-900 pb-5 mb-6 flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-700 block">
                Official Career Intelligence Dossier
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                {selectedReportType}
              </h2>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Candidate: <strong className="text-slate-900">{profile.name || 'Candidate Name'}</strong> • {profile.education.degree || 'Degree'} ({profile.education.branch || 'Discipline'})
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-500 block">
                ID: CS-{profile.id.toUpperCase()}
              </span>
              <span className="text-[10px] text-slate-500 block">
                Generated: {new Date().toLocaleDateString()}
              </span>
              <span className="inline-block mt-1 text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase">
                {profile.education.verificationStatus === 'verified' ? 'Verified Provenance' : 'Self-Reported Baseline'}
              </span>
            </div>
          </div>

          {/* Report Executive Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Overall Readiness</span>
              <span className="text-2xl font-black text-indigo-700">{readiness.overallScore}/100</span>
              <span className="text-[10px] text-emerald-700 font-medium block">Deterministic Index</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Authoritative CGPA</span>
              <span className="text-2xl font-black text-slate-900">{(profile.education.verifiedCGPA || profile.education.selfReportedCGPA || 0).toFixed(2)}</span>
              <span className="text-[10px] text-slate-600 font-medium block">{profile.education.terms?.length || 0} Terms Recorded</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Target Role Fit</span>
              <span className="text-2xl font-black text-purple-700">{currentFitReport.overallFitScore}%</span>
              <span className="text-[10px] text-slate-600 font-medium block">{activeJD.company} ({activeJD.title})</span>
            </div>
          </div>

          {/* Section: Academic & Evidence Credentials */}
          <div className="mb-6 space-y-2 text-xs">
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              1. Academic & Evidence Profile Verification
            </h3>
            <p className="text-slate-700 leading-relaxed text-xs">
              Candidate has completed {profile.education.terms?.length || 0} of {profile.education.totalSemesters || 8} academic semesters at {profile.education.institution || 'institution'} with a credit-weighted CGPA of {(profile.education.verifiedCGPA || profile.education.selfReportedCGPA || 0).toFixed(2)}.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {profile.skills.length > 0 ? (
                profile.skills.slice(0, 6).map((sk) => (
                  <span key={sk.id} className="bg-slate-100 border border-slate-300 px-2 py-1 rounded text-[11px] font-medium text-slate-800">
                    {sk.name} (Level {sk.evidenceLevel} Evidence)
                  </span>
                ))
              ) : (
                <span className="text-slate-500 italic text-[11px]">No skills registered yet.</span>
              )}
            </div>
          </div>

          {/* Section: Role Fit & Deterministic Eligibility */}
          <div className="mb-6 space-y-2 text-xs">
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              2. Opportunity Alignment: {activeJD.company}
            </h3>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex justify-between font-semibold">
                <span>Deterministic Academic Cutoff Gate:</span>
                <span className={currentFitReport.eligibilityPassed ? 'text-emerald-700' : 'text-rose-700'}>
                  {currentFitReport.eligibilityPassed
                    ? `✓ Passed (${(profile.education.verifiedCGPA || profile.education.selfReportedCGPA || 0).toFixed(2)} >= ${activeJD.cgpaCutoff})`
                    : `✗ Below Cutoff (${(profile.education.verifiedCGPA || profile.education.selfReportedCGPA || 0).toFixed(2)} < ${activeJD.cgpaCutoff})`}
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Must-have skills matched: {activeJD.mustHaveSkills.length - currentFitReport.missingMustHaves.length} of {activeJD.mustHaveSkills.length}.
              </p>
            </div>
          </div>

          {/* Section: Key Strategic Next Actions */}
          <div className="space-y-2 text-xs">
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              3. Prioritized Strategic Milestones
            </h3>
            {actions.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs">
                {actions.slice(0, 3).map((act) => (
                  <li key={act.id}>
                    <strong>{act.title}:</strong> {act.description}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-600 italic">Core requirements documented. Continue targeted interview practice and skill depth.</p>
            )}
          </div>

          {/* Signoff Footer */}
          <div className="mt-8 pt-4 border-t border-slate-300 text-[10px] text-slate-500 flex justify-between items-center">
            <span>Career Saathi AI Platform • Analytical Dossier</span>
            <span>Document ID: CS-{profile.id.toUpperCase()}</span>
          </div>
        </div>

        {/* Right Col: Export Transmission & Audit Register */}
        <div className="space-y-6">
          {/* Dispatch Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-4 h-4 text-indigo-400" />
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Report Transmission & Export Audit
              </h2>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Maintains an immutable local audit register of exported dossiers and intended distribution targets.
            </p>

            {sendSuccessMessage && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>{sendSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handleSendEmail} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Recipient Email</label>
                <input
                  type="email"
                  required
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="mentor@college.edu or hr@company.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Recipient Role</label>
                <select
                  value={recipientRole}
                  onChange={(e) => setRecipientRole(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white text-xs"
                >
                  <option value="Campus Placement Officer">Campus Placement Officer</option>
                  <option value="Academic Advisor / Mentor">Academic Advisor / Mentor</option>
                  <option value="Hiring Recruiter">Hiring Recruiter</option>
                  <option value="Personal Backup">Personal Archive</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Subject Line</label>
                <input
                  type="text"
                  required
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Message Body</label>
                <textarea
                  rows={4}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-xs font-sans leading-relaxed"
                />
              </div>

              <div className="p-2.5 bg-slate-800/60 rounded-lg border border-slate-700 text-[11px] text-slate-400 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Attachment: {selectedReportType}.pdf (Signed)</span>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/30 transition cursor-pointer flex items-center justify-center gap-2 text-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Recording Export...' : 'Record Export in Audit Register'}</span>
              </button>
            </form>
          </div>

          {/* Email Activity Audit Log (FR-057) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Email Activity Audit Log (FR-057)
            </h3>

            {emailLogs.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No email dispatches recorded yet.</p>
            ) : (
              <div className="space-y-2.5 max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
                {emailLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white truncate max-w-[150px]">{log.recipient}</span>
                      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        {log.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-indigo-300 truncate">{log.reportTitle}</p>
                    <span className="text-[10px] text-slate-500 block font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
