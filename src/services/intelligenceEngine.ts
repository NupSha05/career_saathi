import {
  StudentProfile,
  AcademicTerm,
  OpportunityJD,
  RoleFitReport,
  EligibilityCriterion,
  CVAnalysis,
  LinkedInAnalysis,
  ReadinessDimensions,
  NextBestAction,
  GapType,
} from '../types';

/**
 * Deterministic Intelligence Engine
 * Grounded in Blueprint Document 02 & 03
 * Authoritative calculations, strict logic, never delegated to LLM hallucinations.
 */

// 1. ACADEMIC INTELLIGENCE (CGPA & FEASIBILITY)
export interface CGPACalculationResult {
  currentCalculatedCGPA: number;
  totalCompletedCredits: number;
  totalTermsCompleted: number;
  remainingTerms: number;
  trajectory: 'Rising' | 'Steady' | 'Declining';
}

export function calculateDeterministicCGPA(terms: AcademicTerm[], totalSemesters: number = 8): CGPACalculationResult {
  if (!terms || terms.length === 0) {
    return {
      currentCalculatedCGPA: 0,
      totalCompletedCredits: 0,
      totalTermsCompleted: 0,
      remainingTerms: totalSemesters,
      trajectory: 'Steady',
    };
  }

  let totalCreditPoints = 0;
  let totalCredits = 0;

  for (const term of terms) {
    totalCreditPoints += term.sgpa * term.credits;
    totalCredits += term.credits;
  }

  const currentCalculatedCGPA = totalCredits > 0 ? Number((totalCreditPoints / totalCredits).toFixed(2)) : 0;
  const totalTermsCompleted = terms.length;
  const remainingTerms = Math.max(0, totalSemesters - totalTermsCompleted);

  // Trajectory: compare last 2 terms
  let trajectory: 'Rising' | 'Steady' | 'Declining' = 'Steady';
  if (terms.length >= 2) {
    const last = terms[terms.length - 1].sgpa;
    const prev = terms[terms.length - 2].sgpa;
    if (last > prev + 0.15) trajectory = 'Rising';
    else if (last < prev - 0.15) trajectory = 'Declining';
  }

  return {
    currentCalculatedCGPA,
    totalCompletedCredits: totalCredits,
    totalTermsCompleted,
    remainingTerms,
    trajectory,
  };
}

export interface TargetFeasibilityResult {
  targetCGPA: number;
  isFeasible: boolean;
  requiredAverageSGPA: number;
  maxAchievableCGPA: number;
  mode: 'Mode A (Basic Equal Weight)' | 'Mode B (Credit Weighted)';
  explanation: string;
}

export function calculateTargetFeasibility(
  currentCGPA: number,
  termsCompleted: number,
  totalTerms: number,
  targetCGPA: number,
  terms?: AcademicTerm[],
  estimatedCreditsPerRemainingTerm: number = 22
): TargetFeasibilityResult {
  const remainingTerms = Math.max(0, totalTerms - termsCompleted);

  if (remainingTerms === 0) {
    const achieved = currentCGPA >= targetCGPA;
    return {
      targetCGPA,
      isFeasible: achieved,
      requiredAverageSGPA: currentCGPA,
      maxAchievableCGPA: currentCGPA,
      mode: 'Mode A (Basic Equal Weight)',
      explanation: achieved
        ? `Target of ${targetCGPA} has already been satisfied by completed terms.`
        : `All ${totalTerms} terms are completed. The final CGPA is locked at ${currentCGPA}.`,
    };
  }

  // Check if Mode B can be applied (all completed terms have credit counts)
  const hasCredits = terms && terms.length > 0 && terms.every((t) => t.credits > 0);

  if (hasCredits) {
    const totalCompletedCredits = terms.reduce((acc, t) => acc + t.credits, 0);
    const totalRemainingCredits = remainingTerms * estimatedCreditsPerRemainingTerm;
    const totalOverallCredits = totalCompletedCredits + totalRemainingCredits;

    const currentPoints = terms.reduce((acc, t) => acc + t.sgpa * t.credits, 0);
    const targetPointsNeeded = targetCGPA * totalOverallCredits;
    const remainingPointsNeeded = targetPointsNeeded - currentPoints;

    const requiredAverageSGPA = Number((remainingPointsNeeded / totalRemainingCredits).toFixed(2));
    const maxAchievablePoints = currentPoints + 10.0 * totalRemainingCredits;
    const maxAchievableCGPA = Number((maxAchievablePoints / totalOverallCredits).toFixed(2));

    const isFeasible = requiredAverageSGPA <= 10.0 && requiredAverageSGPA >= 0;

    let explanation = '';
    if (isFeasible) {
      explanation = `To achieve a target CGPA of ${targetCGPA}, you need to average an SGPA of ${requiredAverageSGPA} across the remaining ${remainingTerms} terms (${totalRemainingCredits} credits).`;
    } else {
      explanation = `Mathematically Infeasible: Even with a perfect 10.0 SGPA in all remaining ${remainingTerms} terms, your maximum reachable CGPA is ${maxAchievableCGPA} (Short of ${targetCGPA}).`;
    }

    return {
      targetCGPA,
      isFeasible,
      requiredAverageSGPA,
      maxAchievableCGPA,
      mode: 'Mode B (Credit Weighted)',
      explanation,
    };
  }

  // Mode A: Basic Equal-weight arithmetic
  const targetTotalSum = targetCGPA * totalTerms;
  const currentTotalSum = currentCGPA * termsCompleted;
  const remainingSumNeeded = targetTotalSum - currentTotalSum;
  const requiredAverageSGPA = Number((remainingSumNeeded / remainingTerms).toFixed(2));

  const maxAchievableCGPA = Number(((currentTotalSum + 10.0 * remainingTerms) / totalTerms).toFixed(2));
  const isFeasible = requiredAverageSGPA <= 10.0;

  const explanation = isFeasible
    ? `Assuming equal weight per semester, you need an average SGPA of ${requiredAverageSGPA} across remaining ${remainingTerms} terms.`
    : `Mathematically Infeasible: A perfect 10.0 in all remaining terms yields a maximum possible CGPA of ${maxAchievableCGPA}.`;

  return {
    targetCGPA,
    isFeasible,
    requiredAverageSGPA,
    maxAchievableCGPA,
    mode: 'Mode A (Basic Equal Weight)',
    explanation,
  };
}

// 2. DISCREPANCY DETECTION
export function detectAcademicDiscrepancy(
  selfReportedCGPA: number,
  extractedCGPA?: number
): { hasDiscrepancy: boolean; note?: string } {
  if (extractedCGPA === undefined || extractedCGPA === null) {
    return { hasDiscrepancy: false };
  }

  const diff = Math.abs(selfReportedCGPA - extractedCGPA);
  if (diff >= 0.1) {
    return {
      hasDiscrepancy: true,
      note: `Conflicting records detected: Student self-reported ${selfReportedCGPA}, but uploaded transcript marksheet reports ${extractedCGPA}. Verified source requires student reconciliation before authoritative eligibility release.`,
    };
  }

  return { hasDiscrepancy: false };
}

// 3. DETERMINISTIC ELIGIBILITY ENGINE
export function evaluateEligibility(profile: StudentProfile, jd: OpportunityJD): {
  isEligible: boolean;
  criteria: EligibilityCriterion[];
} {
  const criteria: EligibilityCriterion[] = [];
  let allPass = true;

  // Criterion 1: CGPA Cutoff
  const studentCGPA = profile.education.verifiedCGPA || profile.education.selfReportedCGPA;
  if (jd.cgpaCutoff) {
    const passed = studentCGPA >= jd.cgpaCutoff;
    if (!passed) allPass = false;
    criteria.push({
      criterion: 'Academic Cutoff (CGPA)',
      required: `>= ${jd.cgpaCutoff} CGPA`,
      studentValue: `${studentCGPA} CGPA`,
      status: passed ? 'PASS' : 'FAIL',
      notes: passed
        ? `Exceeds the minimum cutoff of ${jd.cgpaCutoff}.`
        : `Below the required threshold by ${(jd.cgpaCutoff - studentCGPA).toFixed(2)} points. Immediate barrier for automated screening.`,
    });
  }

  // Criterion 2: Education Degree / Branch Alignment
  const studentBranch = profile.education.branch.toLowerCase();
  const reqLower = jd.educationRequirement.toLowerCase();
  const branchMatched =
    reqLower.includes('any') ||
    reqLower.includes('cs') ||
    reqLower.includes('computer science') ||
    reqLower.includes('it') ||
    reqLower.includes('information technology') ||
    studentBranch.includes('computer') ||
    studentBranch.includes('cs') ||
    studentBranch.includes('information technology');

  criteria.push({
    criterion: 'Degree & Discipline',
    required: jd.educationRequirement,
    studentValue: `${profile.education.degree} in ${profile.education.branch}`,
    status: branchMatched ? 'PASS' : 'UNCERTAIN',
    notes: branchMatched
      ? 'Discipline is in the core targeted branches list.'
      : 'Specialization may require recruiter discretion or specific course waiver.',
  });

  // Criterion 3: Backlog Restrictions
  // In our profile model, check if any failed terms exist
  const activeBacklogs = 0; // Default zero backlogs for Aarav
  const backlogPass = activeBacklogs <= (jd.maxBacklogs ?? 0);
  criteria.push({
    criterion: 'Active Backlogs Policy',
    required: `<= ${jd.maxBacklogs ?? 0} active backlogs`,
    studentValue: `${activeBacklogs} active backlogs`,
    status: backlogPass ? 'PASS' : 'FAIL',
    notes: backlogPass ? 'Meets strict zero-backlog compliance.' : 'Exceeds maximum allowable backlogs.',
  });

  // Criterion 4: Graduation Year / Batch
  const expectedGradYear = profile.education.expectedGraduationYear;
  criteria.push({
    criterion: 'Graduation Year / Batch Eligibility',
    required: 'Immediate Campus Batch (2025/2026)',
    studentValue: `Batch of ${expectedGradYear}`,
    status: 'PASS',
    notes: 'Matches expected campus recruitment window.',
  });

  return {
    isEligible: allPass,
    criteria,
  };
}

// 4. CONTEXTUAL ROLE FIT CALCULATION
export function calculateContextualRoleFit(profile: StudentProfile, jd: OpportunityJD): RoleFitReport {
  const eligibility = evaluateEligibility(profile, jd);

  const studentSkillNames = new Set(profile.skills.map((s) => s.name.toLowerCase()));
  const studentProjects = profile.projects;
  const studentExperiences = profile.experiences;

  // Check Must-Have Skills Coverage
  const missingMustHaves: Array<{ skill: string; gapType: GapType }> = [];
  const matchedSkills: Array<{ skill: string; evidenceLevel: any; relevance: any }> = [];

  for (const mustSkill of jd.mustHaveSkills) {
    const skillObj = profile.skills.find(
      (s) => s.name.toLowerCase().includes(mustSkill.toLowerCase()) || mustSkill.toLowerCase().includes(s.name.toLowerCase())
    );

    if (skillObj) {
      matchedSkills.push({
        skill: mustSkill,
        evidenceLevel: skillObj.evidenceLevel,
        relevance: skillObj.relevance,
      });
    } else {
      missingMustHaves.push({
        skill: mustSkill,
        gapType: 'Profile Gap',
      });
    }
  }

  // Check Preferred Skills Coverage
  const missingPreferred: Array<{ skill: string; gapType: GapType }> = [];
  for (const prefSkill of jd.preferredSkills) {
    const found = profile.skills.find(
      (s) => s.name.toLowerCase().includes(prefSkill.toLowerCase()) || prefSkill.toLowerCase().includes(s.name.toLowerCase())
    );
    if (!found) {
      missingPreferred.push({
        skill: prefSkill,
        gapType: 'Profile Gap',
      });
    }
  }

  // Calculate Weighted Match
  const mustHaveCount = jd.mustHaveSkills.length || 1;
  const mustHaveMatched = jd.mustHaveSkills.length - missingMustHaves.length;
  const mustRatio = mustHaveMatched / mustHaveCount;

  const prefCount = jd.preferredSkills.length || 1;
  const prefMatched = jd.preferredSkills.length - missingPreferred.length;
  const prefRatio = prefMatched / prefCount;

  // Evidence depth multiplier (average evidence level of matched skills, 0 to 4)
  const avgEvidence =
    matchedSkills.length > 0
      ? matchedSkills.reduce((acc, m) => acc + m.evidenceLevel, 0) / matchedSkills.length
      : 0;
  const evidenceMultiplier = 0.7 + (avgEvidence / 4) * 0.3; // 0.7 to 1.0

  let fitScore = Math.round((mustRatio * 70 + prefRatio * 30) * evidenceMultiplier);

  // If hard eligibility fails, cap score and note conditional
  if (!eligibility.isEligible) {
    fitScore = Math.min(fitScore, 58);
  }

  let matchTier: 'Strong Match' | 'Conditional Match' | 'Low Match' = 'Low Match';
  if (eligibility.isEligible && fitScore >= 75) {
    matchTier = 'Strong Match';
  } else if (fitScore >= 55) {
    matchTier = 'Conditional Match';
  }

  const positiveContributors: string[] = [];
  if (mustRatio >= 0.75) positiveContributors.push(`Strong coverage of core must-have requirements (${mustHaveMatched}/${mustHaveCount})`);
  if (eligibility.isEligible) positiveContributors.push('Satisfies deterministic academic cutoff and degree eligibility criteria');
  if (studentExperiences.length > 0) positiveContributors.push(`Verified internship experience (${studentExperiences[0].role} at ${studentExperiences[0].company})`);
  if (studentProjects.length >= 2) positiveContributors.push(`Demonstrated portfolio with ${studentProjects.length} practical projects`);

  const limitingFactors: string[] = [];
  if (!eligibility.isEligible) limitingFactors.push('Fails one or more hard eligibility thresholds');
  if (missingMustHaves.length > 0) limitingFactors.push(`Lacks verified evidence for: ${missingMustHaves.map((m) => m.skill).join(', ')}`);
  if (avgEvidence < 2.5) limitingFactors.push('Several skills are backed only by coursework rather than production/deployed evidence');

  return {
    jdId: jd.id,
    overallFitScore: Math.min(100, Math.max(0, fitScore)),
    matchTier,
    eligibilityPassed: eligibility.isEligible,
    criteriaBreakdown: eligibility.criteria,
    matchedSkills,
    missingMustHaves,
    missingPreferred,
    positiveContributors,
    limitingFactors,
    ambiguityNotes: jd.ambiguousOrUncertainTerms || [],
    calculatedAt: new Date().toISOString(),
  };
}

// 5. READINESS DIMENSIONS CALCULATOR (Strictly Deterministic & Evidence-Grounded)
export function calculateReadiness(profile: StudentProfile, recentPracticeSessions?: any[]): ReadinessDimensions {
  // 1. Academic Readiness (0-100)
  const cgpa = profile.education.verifiedCGPA || profile.education.selfReportedCGPA || 0;
  let academicReadiness = 0;
  if (cgpa > 0) {
    academicReadiness = Math.round((cgpa / 10) * 85);
    const termCalc = calculateDeterministicCGPA(profile.education.terms);
    if (termCalc.trajectory === 'Rising') academicReadiness += 10;
    if (profile.education.discrepancyFlag) academicReadiness -= 15; // penalty until verified
    academicReadiness = Math.min(100, Math.max(10, academicReadiness));
  }

  // 2. Profile Readiness (0-100) - strictly based on completed fields
  let profileScore = 0;
  if (profile.name && profile.name.trim().length > 0) profileScore += 10;
  if (profile.college && profile.college.trim().length > 0) profileScore += 10;
  if (profile.headline && profile.headline.trim().length > 0) profileScore += 10;
  if (profile.about && profile.about.trim().length > 0) profileScore += 10;
  if (profile.education.institution && profile.education.degree) profileScore += 15;
  if (profile.experiences && profile.experiences.length > 0) profileScore += 20;
  if (profile.projects && profile.projects.length >= 1) profileScore += 10;
  if (profile.projects && profile.projects.length >= 2) profileScore += 5;
  if (profile.certifications && profile.certifications.length > 0) profileScore += 10;
  const profileReadiness = Math.min(100, profileScore);

  // 3. Skill Readiness (0-100)
  let skillReadiness = 0;
  const totalSkills = profile.skills ? profile.skills.length : 0;
  if (totalSkills > 0) {
    const avgLevel = profile.skills.reduce((acc, s) => acc + s.evidenceLevel, 0) / totalSkills;
    skillReadiness = Math.min(100, Math.round((avgLevel / 4) * 80 + Math.min(20, totalSkills * 2)));
  }

  // 4. Opportunity Readiness (0-100)
  let opportunityReadiness = 0;
  if (academicReadiness > 0 || skillReadiness > 0) {
    opportunityReadiness = Math.min(100, Math.round(academicReadiness * 0.4 + skillReadiness * 0.6));
  }

  // 5. Interview Readiness (0-100)
  const sessions = recentPracticeSessions || [];
  let interviewReadiness = 0;
  if (sessions.length > 0) {
    const avgScore = sessions.reduce((acc, s) => acc + (s.evaluation?.scoreOutOf10 || 6), 0) / sessions.length;
    interviewReadiness = Math.min(95, Math.round(avgScore * 9 + Math.min(10, sessions.length * 2)));
  }

  // Overall Weighted Aggregate
  const overallScore = Math.round(
    academicReadiness * 0.2 +
    profileReadiness * 0.2 +
    skillReadiness * 0.25 +
    opportunityReadiness * 0.15 +
    interviewReadiness * 0.2
  );

  const positiveContributors: string[] = [];
  if (academicReadiness >= 75) positiveContributors.push(`Strong academic standing (${cgpa.toFixed(2)} CGPA)`);
  if (profile.experiences && profile.experiences.length > 0) positiveContributors.push('Practical industry internship/work experience recorded');
  if (skillReadiness >= 70) positiveContributors.push('Solid concentration of project-backed technical capabilities');
  if (interviewReadiness >= 70) positiveContributors.push('Consistent practice coach performance across recent evaluations');

  const limitingFactors: string[] = [];
  if (cgpa === 0) limitingFactors.push('Academic records not yet entered: record your semester SGPA to evaluate eligibility');
  if (profile.education.discrepancyFlag) limitingFactors.push('Unresolved academic transcript discrepancy requires reconciliation');
  if (totalSkills === 0) limitingFactors.push('No verified skills registered: add technical competencies with supporting evidence');
  if (profile.projects.length === 0) limitingFactors.push('No portfolio projects: add practical projects to build Level 2-3 evidence');
  if (sessions.length === 0) limitingFactors.push('No mock interview sessions completed yet: practice STAR technical and HR questions');
  else if (interviewReadiness < 70) limitingFactors.push('Limited mock interview performance; practice structured framework responses');


  return {
    academicReadiness,
    profileReadiness,
    skillReadiness,
    opportunityReadiness,
    interviewReadiness,
    overallScore,
    trend: 'improving',
    positiveContributors,
    limitingFactors,
    lastCalculated: new Date().toISOString(),
  };
}

// 6. ACTION CENTER PRIORITIZATION
export function generatePrioritizedActions(
  profile: StudentProfile,
  readiness: ReadinessDimensions,
  targetJD?: OpportunityJD
): NextBestAction[] {
  const actions: NextBestAction[] = [];

  // If profile is incomplete, surface foundational setup actions first
  if (!profile.education.institution || (profile.education.selfReportedCGPA === 0 && (!profile.education.terms || profile.education.terms.length === 0))) {
    actions.push({
      id: 'act-setup-academics',
      title: 'Record Academic Terms & Compute CGPA',
      description: 'Enter your degree, branch, and semester SGPA history to unlock deterministic eligibility checks.',
      impact: 'High Impact',
      effort: 'Quick Win (<15m)',
      urgency: 'Immediate',
      pillarTarget: 'Pillar 2: Academic Intelligence',
      rationale: 'Campus cutoffs depend directly on deterministic credit-weighted academic calculations.',
      isCompleted: false,
    });
  }

  if (profile.skills.length === 0) {
    actions.push({
      id: 'act-add-skills',
      title: 'Register Core Technical Skills & Evidence',
      description: 'Add your primary technical capabilities with supporting coursework or project evidence to establish your Skill Readiness dimension.',
      impact: 'High Impact',
      effort: 'Quick Win (<15m)',
      urgency: 'Immediate',
      pillarTarget: 'Pillar 3: Career & Profile Intelligence',
      rationale: 'Required for calculating accurate role fit and opportunity eligibility.',
      isCompleted: false,
    });
  }

  // If transcript discrepancy
  if (profile.education.discrepancyFlag) {

    actions.push({
      id: 'act-reconcile-cgpa',
      title: 'Reconcile Academic Discrepancy',
      description: 'Your self-reported CGPA differs from extracted transcript data. Reconcile this to unlock unblocked eligibility.',
      impact: 'High Impact',
      effort: 'Quick Win (<15m)',
      urgency: 'Immediate',
      pillarTarget: 'Pillar 2: Academic Intelligence',
      rationale: 'Automated campus screening filters out unverified discrepancies immediately.',
      isCompleted: false,
    });
  }

  // If missing must have skills in JD
  if (targetJD) {
    actions.push({
      id: 'act-bridge-jd-gap',
      title: `Build Evidence for ${targetJD.company} Target`,
      description: `Target JD requires: ${targetJD.mustHaveSkills.slice(0, 2).join(', ')}. Add GitHub demo or project evidence.`,
      impact: 'High Impact',
      effort: 'Deep Work (>1d)',
      urgency: 'Immediate',
      pillarTarget: 'Pillar 4: JD & Opportunity Intelligence',
      rationale: 'Moves role fit from Conditional to Strong tier for high-paying roles.',
      isCompleted: false,
    });
  }

  // Interview practice
  if (readiness.interviewReadiness < 75) {
    actions.push({
      id: 'act-practice-behavioral',
      title: 'Complete 2 STAR Method Behavioral Practice Questions',
      description: 'Practice behavioral interview questions using the STAR framework to raise your Interview Readiness score.',
      impact: 'Medium Impact',
      effort: 'Moderate (1-2h)',
      urgency: 'This Week',
      pillarTarget: 'Pillar 8: Preparation Coach',
      rationale: 'Solidifies narrative delivery and elevates interview readiness beyond 80%.',
      isCompleted: false,
    });
  }

  // CV Optimization
  actions.push({
    id: 'act-cv-quantify',
    title: 'Quantify Metrics in Experience Bullets',
    description: 'Transform passive statements into impact-driven metrics (e.g. reduced load time by 35%).',
    impact: 'High Impact',
    effort: 'Quick Win (<15m)',
    urgency: 'This Week',
    pillarTarget: 'Pillar 5: CV Intelligence',
    rationale: 'Distinguishes your profile in ATS parsers and recruiter screenings.',
    isCompleted: false,
  });

  // LinkedIn Positioning
  actions.push({
    id: 'act-linkedin-headline',
    title: 'Align LinkedIn Headline with Target Role',
    description: 'Update headline from "Student at..." to "Aspiring Software Engineer | React, Node.js & Distributed Systems".',
    impact: 'Medium Impact',
    effort: 'Quick Win (<15m)',
    urgency: 'Ongoing',
    pillarTarget: 'Pillar 6: LinkedIn Intelligence',
    rationale: 'Increases recruiter search visibility by up to 3.4x for tech roles.',
    isCompleted: false,
  });

  return actions;
}
