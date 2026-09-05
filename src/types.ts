export interface CategoryScore {
  score: number;
  maxScore: number;
  label: string;
  rating: 'exceptional' | 'strong' | 'average' | 'weak' | 'insufficient';
  evidence: string[];
  strengths: string[];
  gaps: string[];
  reasoning: string;
}

export interface BonusItem {
  points: number;
  title: string;
  evidence: string;
}

export interface DeductionItem {
  points: number;
  issue: string;
  evidence: string;
  remedy: string;
}

export interface BulletImprovement {
  original: string;
  improved: string;
  impactMetricsAdded: string;
  category: 'action-verb' | 'metrics' | 'tech-stack' | 'business-value';
}

export interface AtsAuditItem {
  criterion: string;
  status: 'pass' | 'warning' | 'fail';
  feedback: string;
}

export interface CandidateInfo {
  name?: string;
  email?: string;
  github?: string;
  linkedin?: string;
  yearsOfExperienceEstimate?: number;
  primaryDomain?: string;
  detectedSkills: string[];
}

export interface HiringEvaluation {
  candidateInfo: CandidateInfo;
  role: string;
  totalScore: number; // -20 to 120
  scorePercentage: number; // 0-100% equivalent
  recommendation: 'STRONG_PASS' | 'PASS' | 'LEANING_PASS' | 'LEANING_REJECT' | 'STRONG_REJECT';
  summaryVerdict: string;
  categories: {
    openSource: CategoryScore; // max 35
    selfProjects: CategoryScore; // max 25
    productionExperience: CategoryScore; // max 30
    technicalSkills: CategoryScore; // max 10
  };
  bonusPoints: {
    total: number; // max 20
    items: BonusItem[];
  };
  deductions: {
    total: number; // max 20 (negative)
    items: DeductionItem[];
  };
  atsAudit: {
    parsabilityScore: number; // 0 to 100
    findings: AtsAuditItem[];
    detectedBuzzwords: string[];
    quantificationPercentage: number;
  };
  bulletImprovements: BulletImprovement[];
  githubSignalsUsed?: {
    username: string;
    publicReposCount: number;
    totalStars: number;
    topLanguages: string[];
    openSourceSignalsFound: boolean;
  };
}

export interface RoleConfig {
  id: string;
  title: string;
  description: string;
  keySignals: string[];
  focusAreas: string;
  criteriaNotes: string;
}
