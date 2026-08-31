import { ScenarioCategory, ScenarioStatus, SimulationStatus, UserRole } from "@prisma/client";

export type { ScenarioCategory, ScenarioStatus, SimulationStatus, UserRole };

export interface ScenarioWithRelations {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: ScenarioCategory;
  tags: string[];
  status: ScenarioStatus;
  isPublic: boolean;
  viewCount: number;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user?: {
    id: string;
    name: string | null;
    image: string | null;
  };
  branches?: BranchWithTimeline[];
  evidence?: EvidenceItem[];
  _count?: {
    comments: number;
    bookmarks: number;
  };
}

export interface BranchWithTimeline {
  id: string;
  title: string;
  description: string;
  probability: number;
  orderIndex: number;
  timeline?: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  description: string;
  impact: string;
  probability: number;
  orderIndex: number;
}

export interface EvidenceItem {
  id: string;
  title: string;
  source: string;
  url: string | null;
  summary: string;
  credibility: number;
  relevance: number;
}

export interface SimulationWithUser {
  id: string;
  query: string;
  parameters: Record<string, any> | null;
  result: Record<string, any> | null;
  aiAnalysis: string | null;
  confidence: number;
  status: SimulationStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  scenarioId: string | null;
  user?: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export interface DashboardStats {
  totalScenarios: number;
  totalSimulations: number;
  publicScenarios: number;
  recentSimulations: SimulationWithUser[];
  popularScenarios: ScenarioWithRelations[];
}

export interface CategoryStat {
  category: ScenarioCategory;
  count: number;
}

export type { Branch, Evidence, Comment, Bookmark } from "@prisma/client";
