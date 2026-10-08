import React, { useState } from 'react';
import { useCareerSaathi } from '../../context/CareerSaathiContext';
import {
  Send,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Filter,
  Layers,
  History,
  Building2,
  Calendar,
} from 'lucide-react';
import { ApplicationRecord, ApplicationStage } from '../../types';

const STAGE_OPTIONS: ApplicationStage[] = [
  'Applied',
  'Shortlisted',
  'Assessment Pending',
  'GD Pending',
  'Interview Pending',
  'Result Awaited',
  'Selected',
  'Rejected',
  'Withdrawn',
  'Other/Custom',
];

export const Pillar7Applications: React.FC = () => {
  const { applications, updateApplicationStage, addApplication } = useCareerSaathi();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('Software Engineer');
  const [newLocation, setNewLocation] = useState('Bengaluru / Remote');
  const [newDate, setNewDate] = useState('2026-10-01');
  const [newStage, setNewStage] = useState<ApplicationStage>('Applied');
  const [newNotes, setNewNotes] = useState('');

  // Calculate actual funnel metrics deterministically
  const totalApps = applications.length;
  const shortlisted = applications.filter((a) => ['Shortlisted', 'Assessment Pending', 'GD Pending', 'Interview Pending', 'Result Awaited', 'Selected'].includes(a.stage)).length;
  const interviews = applications.filter((a) => ['Interview Pending', 'Result Awaited', 'Selected'].includes(a.stage)).length;
  const offers = applications.filter((a) => a.stage === 'Selected').length;
  const rejections = applications.filter((a) => a.stage === 'Rejected').length;

  const handleCreateApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim()) return;

    addApplication({
      company: newCompany.trim(),
      role: newRole.trim(),
      appliedDate: newDate,
      stage: newStage,
      location: newLocation.trim(),
      notes: newNotes.trim(),
    });

    setNewCompany('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Send className="w-4 h-4" />
              <span>Pillar 7 • Application Intelligence & Funnel Analytics</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Lifecycle Application Tracker & Transparent Health
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Manual recording is the authoritative source behavior. All statistics derive exclusively from verified student entries—no fabricated recruitment estimates.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record New Application</span>
          </button>
        </div>
      </div>

      {/* Real Funnel Analytics (Deterministic from Recorded Data) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Total Recorded</span>
          <span className="text-2xl font-black text-white">{totalApps}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Shortlisted</span>
          <span className="text-2xl font-black text-indigo-400">{shortlisted}</span>
          <span className="text-[10px] text-slate-500 block">
            {totalApps > 0 ? `${Math.round((shortlisted / totalApps) * 100)}% Conv.` : '0%'}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Interview Stage</span>
          <span className="text-2xl font-black text-amber-400">{interviews}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Selected / Offers</span>
          <span className="text-2xl font-black text-emerald-400">{offers}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Rejections / Closed</span>
          <span className="text-2xl font-black text-slate-400">{rejections}</span>
        </div>
      </div>

      {/* Applications List & Stage Transitions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Active Application Lifecycle Pipeline
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {applications.length} Records
          </span>
        </div>

        {applications.length === 0 ? (
          <div className="p-8 text-center bg-slate-800/40 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-2">
            <p>No job applications tracked in this workspace yet.</p>
            <p className="text-slate-500">
              Click 'Record New Application' to log opportunities and track their lifecycle from Applied to Selected.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-3"
              >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{app.company}</h3>
                    <span className="text-xs text-indigo-400 font-medium">({app.role})</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Applied on: {app.appliedDate} • {app.location || 'Remote/Campus'}
                  </p>
                </div>

                {/* Stage Selector Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 hidden sm:inline">Stage:</span>
                  <select
                    value={app.stage}
                    onChange={(e) => updateApplicationStage(app.id, e.target.value as ApplicationStage)}
                    className="bg-slate-900 border border-indigo-500/40 text-indigo-200 text-xs rounded-lg px-2.5 py-1.5 font-semibold focus:outline-none focus:border-indigo-400 cursor-pointer"
                  >
                    {STAGE_OPTIONS.map((stg) => (
                      <option key={stg} value={stg}>
                        {stg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Application Health Rationale */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    Application Health Status:
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      app.healthCategory === 'Healthy'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : app.healthCategory === 'Requires Attention'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {app.healthCategory}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">{app.healthRationale}</p>
                {app.notes && (
                  <p className="text-indigo-300/80 text-[11px] italic pt-1 border-t border-slate-800">
                    Notes: {app.notes}
                  </p>
                )}
              </div>

              {/* Stage Transition History */}
              <div className="text-[11px] text-slate-400 pt-1">
                <span className="font-semibold text-slate-500 block mb-1 uppercase text-[10px] flex items-center gap-1">
                  <History className="w-3 h-3" /> Event History Timeline:
                </span>
                <div className="flex flex-wrap gap-2">
                  {app.history.map((h, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-300"
                    >
                      {h.stage} ({h.timestamp ? new Date(h.timestamp).toLocaleDateString() : 'Recorded'})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Record New Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-3">Record New Job Application</h3>
            <form onSubmit={handleCreateApplication} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. Microsoft / Atlassian"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g. SDE-1 / Associate Engineer"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1">Applied Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Initial Stage</label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as ApplicationStage)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    {STAGE_OPTIONS.map((stg) => (
                      <option key={stg} value={stg}>
                        {stg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Location / Work Mode</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Bengaluru (Hybrid)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Notes & Follow-up Details</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Referred by senior, online test link received, etc."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg cursor-pointer"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
