import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  StudentProfile,
  OpportunityJD,
  RoleFitReport,
  CVAnalysis,
  LinkedInAnalysis,
  ApplicationRecord,
  PracticeSession,
  ReadinessDimensions,
  ReadinessSnapshot,
  NextBestAction,
  EventImpactRecord,
  EmailLogEntry,
  AuthState,
} from '../types';
import {
  calculateContextualRoleFit,
  calculateReadiness,
  generatePrioritizedActions,
} from '../services/intelligenceEngine';
import {
  AARAV_SHARMA_DEMO_PROFILE,
  DEMO_JDS,
  DEMO_APPLICATIONS,
  DEMO_PRACTICE_SESSIONS,
  DEMO_CV_ANALYSIS,
  DEMO_LINKEDIN_ANALYSIS,
  DEMO_READINESS_SNAPSHOTS,
  DEMO_EVENT_LOG,
  createBlankProductionProfile,
  DEFAULT_PRODUCTION_JDS,
} from '../fixtures/demoData';

/**
 * Career Saathi Master Context
 *
 * Enforces strict separation between:
 * 1. Authentication & System Mode State
 * 2. Persistent User Application Data (Source of Truth)
 * 3. Derived Deterministic Intelligence (Pure Functions of Persistent Data)
 * 4. AI Analysis State (Explicit status, null baseline in production)
 * 5. Explicit Demo Mode Fixture Layer (Never used as production fallback)
 */

interface CareerSaathiContextType {
  // Auth & Mode State
  authState: AuthState;
  isDemoMode: boolean;
  enableDemoMode: () => void;
  disableDemoMode: () => void;
  resetProductionData: () => void;

  // Persistent Application Data
  profile: StudentProfile;
  activeJD: OpportunityJD;
  allJDs: OpportunityJD[];
  applications: ApplicationRecord[];
  practiceSessions: PracticeSession[];
  eventImpactLog: EventImpactRecord[];
  emailLogs: EmailLogEntry[];

  // Derived Deterministic Intelligence
  readiness: ReadinessDimensions;
  readinessSnapshots: ReadinessSnapshot[];
  actions: NextBestAction[];
  currentFitReport: RoleFitReport;

  // AI Analysis State
  cvAnalysis: CVAnalysis | null;
  linkedInAnalysis: LinkedInAnalysis | null;
  isAiProcessing: boolean;
  aiError: string | null;

  // Mutation Operations
  updateProfile: (updated: Partial<StudentProfile>) => void;
  updateEducation: (edu: Partial<StudentProfile['education']>) => void;
  addProject: (proj: Omit<StudentProfile['projects'][0], 'id'>) => void;
  addSkill: (skill: Omit<StudentProfile['skills'][0], 'id'>) => void;
  setActiveJD: (jd: OpportunityJD) => void;
  addJD: (jd: OpportunityJD) => void;
  updateApplicationStage: (appId: string, newStage: ApplicationRecord['stage'], note?: string) => void;
  addApplication: (app: Omit<ApplicationRecord, 'id' | 'healthCategory' | 'healthRationale' | 'history' | 'stageUpdatedDate'>) => void;
  recordPracticeSession: (session: Omit<PracticeSession, 'id' | 'completedAt'>) => void;
  reconcileDiscrepancy: (authoritativeValue: number) => void;
  logEventImpact: (eventType: string, sourcePillar: string, affected: string[], explanation: string) => void;
  logEmailDispatch: (entry: EmailLogEntry) => void;
  triggerCVAnalysis: (customCvText?: string) => Promise<void>;
  triggerLinkedInAnalysis: (customLinkedInData?: any) => Promise<void>;
  clearCVAnalysis: () => void;
  clearLinkedInAnalysis: () => void;
}

const CareerSaathiContext = createContext<CareerSaathiContextType | null>(null);

// Local Storage Keys
const PROD_PROFILE_KEY = 'cs_prod_profile_v2';
const PROD_JDS_KEY = 'cs_prod_jds_v2';
const PROD_APPS_KEY = 'cs_prod_apps_v2';
const PROD_PRACTICE_KEY = 'cs_prod_practice_v2';
const PROD_EVENTS_KEY = 'cs_prod_events_v2';
const PROD_EMAILS_KEY = 'cs_prod_emails_v2';
const PROD_CV_KEY = 'cs_prod_cv_v2';
const PROD_LINKEDIN_KEY = 'cs_prod_linkedin_v2';
const DEMO_MODE_FLAG = 'cs_demo_mode_active';

export const CareerSaathiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. System Mode: Production vs Controlled Demo Mode
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem(DEMO_MODE_FLAG) === 'true';
  });

  // 2. Persistent Application Data
  const [profile, setProfile] = useState<StudentProfile>(() => {
    if (localStorage.getItem(DEMO_MODE_FLAG) === 'true') {
      return AARAV_SHARMA_DEMO_PROFILE;
    }
    const saved = localStorage.getItem(PROD_PROFILE_KEY);
    return saved ? JSON.parse(saved) : createBlankProductionProfile();
  });

  const [allJDs, setAllJDs] = useState<OpportunityJD[]>(() => {
    if (localStorage.getItem(DEMO_MODE_FLAG) === 'true') {
      return DEMO_JDS;
    }
    const saved = localStorage.getItem(PROD_JDS_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTION_JDS;
  });

  const [activeJD, setActiveJDState] = useState<OpportunityJD>(() => {
    return allJDs[0] || DEFAULT_PRODUCTION_JDS[0];
  });

  const [applications, setApplications] = useState<ApplicationRecord[]>(() => {
    if (localStorage.getItem(DEMO_MODE_FLAG) === 'true') {
      return DEMO_APPLICATIONS;
    }
    const saved = localStorage.getItem(PROD_APPS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>(() => {
    if (localStorage.getItem(DEMO_MODE_FLAG) === 'true') {
      return DEMO_PRACTICE_SESSIONS;
    }
    const saved = localStorage.getItem(PROD_PRACTICE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [eventImpactLog, setEventImpactLog] = useState<EventImpactRecord[]>(() => {
    if (localStorage.getItem(DEMO_MODE_FLAG) === 'true') {
      return DEMO_EVENT_LOG;
    }
    const saved = localStorage.getItem(PROD_EVENTS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [emailLogs, setEmailLogs] = useState<EmailLogEntry[]>(() => {
    const saved = localStorage.getItem(PROD_EMAILS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // 3. AI Analysis State (null by default in production; populated only after real analysis)
  const [cvAnalysis, setCvAnalysis] = useState<CVAnalysis | null>(() => {
    if (localStorage.getItem(DEMO_MODE_FLAG) === 'true') {
      return DEMO_CV_ANALYSIS;
    }
    const saved = localStorage.getItem(PROD_CV_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [linkedInAnalysis, setLinkedInAnalysis] = useState<LinkedInAnalysis | null>(() => {
    if (localStorage.getItem(DEMO_MODE_FLAG) === 'true') {
      return DEMO_LINKEDIN_ANALYSIS;
    }
    const saved = localStorage.getItem(PROD_LINKEDIN_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // 4. Derived Deterministic State (Computed from Source of Truth)
  const readiness = useMemo(() => {
    return calculateReadiness(profile, practiceSessions);
  }, [profile, practiceSessions]);

  const currentFitReport = useMemo(() => {
    return calculateContextualRoleFit(profile, activeJD);
  }, [profile, activeJD]);

  const actions = useMemo(() => {
    return generatePrioritizedActions(profile, readiness, activeJD);
  }, [profile, readiness, activeJD]);

  // Readiness snapshots
  const [readinessSnapshots, setReadinessSnapshots] = useState<ReadinessSnapshot[]>(() => {
    if (localStorage.getItem(DEMO_MODE_FLAG) === 'true') {
      return DEMO_READINESS_SNAPSHOTS;
    }
    return [];
  });

  // Update snapshots when readiness changes meaningfully
  useEffect(() => {
    if (!profile.name && readiness.overallScore === 0) return;
    const snapId = `snap-${Date.now()}`;
    setReadinessSnapshots((prev) => {
      // Don't flood snapshots if the latest is identical
      const last = prev[prev.length - 1];
      if (last && last.overallScore === readiness.overallScore && last.academicReadiness === readiness.academicReadiness) {
        return prev;
      }
      return [
        ...prev.slice(-9), // Keep latest 10
        {
          ...readiness,
          id: snapId,
          timestamp: new Date().toISOString(),
          triggerEvent: isDemoMode ? 'Demo State Active' : 'Evidence Repository Updated',
        },
      ];
    });
  }, [readiness, isDemoMode, profile.name]);

  // Sync to localStorage only when NOT in demo mode (persist production user state cleanly)
  useEffect(() => {
    if (!isDemoMode) {
      localStorage.setItem(PROD_PROFILE_KEY, JSON.stringify(profile));
    }
  }, [profile, isDemoMode]);

  useEffect(() => {
    if (!isDemoMode) {
      localStorage.setItem(PROD_JDS_KEY, JSON.stringify(allJDs));
    }
  }, [allJDs, isDemoMode]);

  useEffect(() => {
    if (!isDemoMode) {
      localStorage.setItem(PROD_APPS_KEY, JSON.stringify(applications));
    }
  }, [applications, isDemoMode]);

  useEffect(() => {
    if (!isDemoMode) {
      localStorage.setItem(PROD_PRACTICE_KEY, JSON.stringify(practiceSessions));
    }
  }, [practiceSessions, isDemoMode]);

  useEffect(() => {
    if (!isDemoMode) {
      localStorage.setItem(PROD_EVENTS_KEY, JSON.stringify(eventImpactLog));
    }
  }, [eventImpactLog, isDemoMode]);

  useEffect(() => {
    if (!isDemoMode) {
      localStorage.setItem(PROD_EMAILS_KEY, JSON.stringify(emailLogs));
    }
  }, [emailLogs, isDemoMode]);

  useEffect(() => {
    if (!isDemoMode) {
      if (cvAnalysis) {
        localStorage.setItem(PROD_CV_KEY, JSON.stringify(cvAnalysis));
      } else {
        localStorage.removeItem(PROD_CV_KEY);
      }
    }
  }, [cvAnalysis, isDemoMode]);

  useEffect(() => {
    if (!isDemoMode) {
      if (linkedInAnalysis) {
        localStorage.setItem(PROD_LINKEDIN_KEY, JSON.stringify(linkedInAnalysis));
      } else {
        localStorage.removeItem(PROD_LINKEDIN_KEY);
      }
    }
  }, [linkedInAnalysis, isDemoMode]);

  // 5. Controlled Demo Mode Switchers
  const enableDemoMode = () => {
    localStorage.setItem(DEMO_MODE_FLAG, 'true');
    setIsDemoMode(true);
    setProfile(AARAV_SHARMA_DEMO_PROFILE);
    setAllJDs(DEMO_JDS);
    setActiveJDState(DEMO_JDS[0]);
    setApplications(DEMO_APPLICATIONS);
    setPracticeSessions(DEMO_PRACTICE_SESSIONS);
    setCvAnalysis(DEMO_CV_ANALYSIS);
    setLinkedInAnalysis(DEMO_LINKEDIN_ANALYSIS);
    setReadinessSnapshots(DEMO_READINESS_SNAPSHOTS);
    setEventImpactLog(DEMO_EVENT_LOG);
  };

  const disableDemoMode = () => {
    localStorage.removeItem(DEMO_MODE_FLAG);
    setIsDemoMode(false);
    // Reload user production data
    const savedProfile = localStorage.getItem(PROD_PROFILE_KEY);
    setProfile(savedProfile ? JSON.parse(savedProfile) : createBlankProductionProfile());
    const savedJDs = localStorage.getItem(PROD_JDS_KEY);
    const prodJDs = savedJDs ? JSON.parse(savedJDs) : DEFAULT_PRODUCTION_JDS;
    setAllJDs(prodJDs);
    setActiveJDState(prodJDs[0] || DEFAULT_PRODUCTION_JDS[0]);
    const savedApps = localStorage.getItem(PROD_APPS_KEY);
    setApplications(savedApps ? JSON.parse(savedApps) : []);
    const savedPractice = localStorage.getItem(PROD_PRACTICE_KEY);
    setPracticeSessions(savedPractice ? JSON.parse(savedPractice) : []);
    const savedEvents = localStorage.getItem(PROD_EVENTS_KEY);
    setEventImpactLog(savedEvents ? JSON.parse(savedEvents) : []);
    const savedCv = localStorage.getItem(PROD_CV_KEY);
    setCvAnalysis(savedCv ? JSON.parse(savedCv) : null);
    const savedLinkedIn = localStorage.getItem(PROD_LINKEDIN_KEY);
    setLinkedInAnalysis(savedLinkedIn ? JSON.parse(savedLinkedIn) : null);
    setReadinessSnapshots([]);
  };

  const resetProductionData = () => {
    localStorage.removeItem(PROD_PROFILE_KEY);
    localStorage.removeItem(PROD_JDS_KEY);
    localStorage.removeItem(PROD_APPS_KEY);
    localStorage.removeItem(PROD_PRACTICE_KEY);
    localStorage.removeItem(PROD_EVENTS_KEY);
    localStorage.removeItem(PROD_EMAILS_KEY);
    localStorage.removeItem(PROD_CV_KEY);
    localStorage.removeItem(PROD_LINKEDIN_KEY);
    localStorage.removeItem(DEMO_MODE_FLAG);
    setIsDemoMode(false);

    setProfile(createBlankProductionProfile());
    setAllJDs(DEFAULT_PRODUCTION_JDS);
    setActiveJDState(DEFAULT_PRODUCTION_JDS[0]);
    setApplications([]);
    setPracticeSessions([]);
    setCvAnalysis(null);
    setLinkedInAnalysis(null);
    setEventImpactLog([]);
    setEmailLogs([]);
    setReadinessSnapshots([]);
  };

  // 6. Traceability & Mutation Methods
  const logEventImpact = (eventType: string, sourcePillar: string, affected: string[], explanation: string) => {
    const newRecord: EventImpactRecord = {
      id: `ev-${Date.now()}`,
      timestamp: new Date().toISOString(),
      eventType,
      sourcePillar,
      affectedDimensions: affected,
      explanation,
    };
    setEventImpactLog((prev) => [newRecord, ...prev]);
  };

  const updateProfile = (updated: Partial<StudentProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
    logEventImpact(
      'Profile Information Updated',
      'Pillar 1: Student Intelligence Profile',
      ['Profile Readiness', 'Overall Career Readiness'],
      'Updated student career profile fields.'
    );
  };

  const updateEducation = (edu: Partial<StudentProfile['education']>) => {
    setProfile((prev) => {
      const newEdu = { ...prev.education, ...edu };
      return { ...prev, education: newEdu };
    });
    logEventImpact(
      'Academic Record Modified',
      'Pillar 2: Academic Intelligence',
      ['Academic Readiness', 'Deterministic Eligibility'],
      'Recomputed credit-weighted CGPA and updated eligibility criteria.'
    );
  };

  const addProject = (proj: Omit<StudentProfile['projects'][0], 'id'>) => {
    const newProj = { ...proj, id: `proj-${Date.now()}` };
    setProfile((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects],
    }));
    logEventImpact(
      `Project Recorded: "${proj.title}"`,
      'Pillar 1: Student Intelligence Profile',
      ['Skill Readiness', 'Role Fit', 'Profile Readiness'],
      `Registered portfolio project with Level ${proj.evidenceLevel} evidence.`
    );
  };

  const addSkill = (skill: Omit<StudentProfile['skills'][0], 'id'>) => {
    const newSkill = { ...skill, id: `sk-${Date.now()}` };
    setProfile((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
    logEventImpact(
      `Skill Capability Added: ${skill.name}`,
      'Pillar 3: Career & Profile Intelligence',
      ['Skill Readiness', 'Role Fit'],
      `Registered Level ${skill.evidenceLevel} capability.`
    );
  };

  const setActiveJD = (jd: OpportunityJD) => {
    setActiveJDState(jd);
    logEventImpact(
      `Target Opportunity Set: ${jd.company} (${jd.title})`,
      'Pillar 4: JD & Opportunity Intelligence',
      ['Opportunity Alignment', 'Role Fit', 'Action Center'],
      `Evaluated requirements against ${jd.company}.`
    );
  };

  const addJD = (jd: OpportunityJD) => {
    setAllJDs((prev) => [jd, ...prev]);
    setActiveJDState(jd);
    logEventImpact(
      `New Job Description Added: ${jd.company}`,
      'Pillar 4: JD & Opportunity Intelligence',
      ['Opportunity Alignment', 'Role Fit'],
      'Parsed criteria and extracted skill requirements.'
    );
  };

  const updateApplicationStage = (appId: string, newStage: ApplicationRecord['stage'], note?: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const newHistory = [...app.history, { stage: newStage, timestamp: new Date().toISOString(), comment: note }];
        return {
          ...app,
          stage: newStage,
          stageUpdatedDate: new Date().toISOString(),
          history: newHistory,
        };
      })
    );
    logEventImpact(
      `Application Stage Advanced: "${newStage}"`,
      'Pillar 7: Application Intelligence',
      ['Application Pipeline', 'Interview Priority'],
      `Transitioned lifecycle state.`
    );
  };

  const addApplication = (appData: Omit<ApplicationRecord, 'id' | 'healthCategory' | 'healthRationale' | 'history' | 'stageUpdatedDate'>) => {
    const newApp: ApplicationRecord = {
      ...appData,
      id: `app-${Date.now()}`,
      stageUpdatedDate: new Date().toISOString(),
      healthCategory: 'Healthy',
      healthRationale: 'Application newly recorded in active tracking lifecycle.',
      history: [{ stage: appData.stage, timestamp: new Date().toISOString(), comment: 'Logged in tracker' }],
    };
    setApplications((prev) => [newApp, ...prev]);
    logEventImpact(
      `Application Tracked: ${newApp.company} (${newApp.role})`,
      'Pillar 7: Application Intelligence',
      ['Application Funnel'],
      'Added to lifecycle pipeline.'
    );
  };

  const recordPracticeSession = (sessionData: Omit<PracticeSession, 'id' | 'completedAt'>) => {
    const newSession: PracticeSession = {
      ...sessionData,
      id: `prac-${Date.now()}`,
      completedAt: new Date().toISOString(),
    };
    setPracticeSessions((prev) => [newSession, ...prev]);
    logEventImpact(
      `Practice Coach Session Evaluated: ${sessionData.category}`,
      'Pillar 8: Preparation Coach',
      ['Interview Readiness', 'Overall Career Readiness'],
      `Evaluated under ${sessionData.frameworkApplied}. Score: ${sessionData.evaluation?.scoreOutOf10 || 7}/10.`
    );
  };

  const reconcileDiscrepancy = (authoritativeValue: number) => {
    setProfile((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        selfReportedCGPA: authoritativeValue,
        verifiedCGPA: authoritativeValue,
        discrepancyFlag: false,
        verificationStatus: 'verified',
        provenance: 'verified',
      },
    }));
    logEventImpact(
      'Academic Discrepancy Reconciled by Student',
      'Pillar 2: Academic Intelligence',
      ['Academic Readiness', 'Deterministic Eligibility'],
      `Confirmed authoritative CGPA as ${authoritativeValue}.`
    );
  };

  const logEmailDispatch = (entry: EmailLogEntry) => {
    setEmailLogs((prev) => [entry, ...prev]);
    logEventImpact(
      `Report Activity Logged: "${entry.reportTitle}"`,
      'Cross-Product Layer: Report Center',
      ['Audit Register'],
      `Target recipient: ${entry.recipient} (${entry.status}).`
    );
  };

  const triggerCVAnalysis = async (customCvText?: string) => {
    setIsAiProcessing(true);
    setAiError(null);
    try {
      const text =
        customCvText ||
        `${profile.name || 'Candidate'} — ${profile.headline || 'Student'}\nEducation: ${profile.education.degree || 'Degree'} in ${profile.education.branch || 'Discipline'}, CGPA: ${profile.education.verifiedCGPA || profile.education.selfReportedCGPA || 'N/A'}\nExperience: ${profile.experiences.map((e) => `${e.role} at ${e.company} (${e.description})`).join('; ') || 'None recorded'}\nProjects: ${profile.projects.map((p) => `${p.title} (${p.description})`).join('; ') || 'None recorded'}\nSkills: ${profile.skills.map((s) => s.name).join(', ') || 'None recorded'}`;

      const res = await fetch('/api/ai/analyze-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, cvText: text, activeJD }),
      });
      if (!res.ok) {
        throw new Error(`AI CV analysis failed: ${res.statusText}`);
      }
      const data = await res.json();
      setCvAnalysis(data);
      logEventImpact(
        'CV Triad Analysis Completed',
        'Pillar 5: CV Intelligence',
        ['CV Health', 'Three-Way Gaps', 'Action Center'],
        `Validated CV alignment against ${activeJD.company}.`
      );
    } catch (err: any) {
      console.error('Failed to trigger CV analysis:', err);
      setAiError(err.message || 'CV analysis request failed');
    } finally {
      setIsAiProcessing(false);
    }
  };

  const triggerLinkedInAnalysis = async (customLinkedInData?: any) => {
    setIsAiProcessing(true);
    setAiError(null);
    try {
      const payload = customLinkedInData || {
        url: profile.linkedInUrl,
        headline: profile.headline,
        about: profile.about,
      };

      const res = await fetch('/api/ai/analyze-linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, linkedInData: payload, activeJD }),
      });
      if (!res.ok) {
        throw new Error(`LinkedIn analysis failed: ${res.statusText}`);
      }
      const data = await res.json();
      setLinkedInAnalysis(data);
      logEventImpact(
        'LinkedIn Recruiter Visibility Audited',
        'Pillar 6: LinkedIn Intelligence',
        ['Visibility Gaps', 'Genuine Skill Gaps'],
        'Audited recruiter discoverability.'
      );
    } catch (err: any) {
      console.error('Failed to trigger LinkedIn analysis:', err);
      setAiError(err.message || 'LinkedIn audit request failed');
    } finally {
      setIsAiProcessing(false);
    }
  };

  const clearCVAnalysis = () => {
    setCvAnalysis(null);
  };

  const clearLinkedInAnalysis = () => {
    setLinkedInAnalysis(null);
  };

  const authState: AuthState = {
    status: isDemoMode ? 'authenticated' : (profile.name ? 'authenticated' : 'unauthenticated'),
    user: isDemoMode
      ? {
          id: 'demo-user-01',
          email: 'aarav.sharma@campus.edu',
          name: 'Aarav Sharma (Demo Persona)',
          role: 'student',
          authProvider: 'guest',
          createdAt: '2026-10-06T00:00:00Z',
        }
      : profile.name
      ? {
          id: profile.id,
          email: profile.email || 'student@careersaathi.app',
          name: profile.name,
          role: 'student',
          authProvider: 'local',
          createdAt: new Date().toISOString(),
        }
      : null,
    mode: isDemoMode ? 'demo' : 'production',
  };

  return (
    <CareerSaathiContext.Provider
      value={{
        authState,
        isDemoMode,
        enableDemoMode,
        disableDemoMode,
        resetProductionData,
        profile,
        activeJD,
        allJDs,
        applications,
        practiceSessions,
        eventImpactLog,
        emailLogs,
        readiness,
        readinessSnapshots,
        actions,
        currentFitReport,
        cvAnalysis,
        linkedInAnalysis,
        isAiProcessing,
        aiError,
        updateProfile,
        updateEducation,
        addProject,
        addSkill,
        setActiveJD,
        addJD,
        updateApplicationStage,
        addApplication,
        recordPracticeSession,
        reconcileDiscrepancy,
        logEventImpact,
        logEmailDispatch,
        triggerCVAnalysis,
        triggerLinkedInAnalysis,
        clearCVAnalysis,
        clearLinkedInAnalysis,
      }}
    >
      {children}
    </CareerSaathiContext.Provider>
  );
};

export const useCareerSaathi = () => {
  const context = useContext(CareerSaathiContext);
  if (!context) throw new Error('useCareerSaathi must be used within CareerSaathiProvider');
  return context;
};
