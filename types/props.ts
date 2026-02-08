export interface NBAProp {
  id: number;
  name: string;
  matchup: string;
  game_date: string;
  prop: string;
  line: number;
  confidence_score: number;
  last_5: number | null;
  last_10: number | null;
  this_season: number | null;
  last_season: number | null;
  h2h: number | null;
  lineup_pct: number | null;
  opp_strength: number | null;
  opp_pts_rank: number | null;
  opp_reb_rank: number | null;
  opp_ast_rank: number | null;
  stat_type: string;
  created_at: string;
}

export interface PropsResponse {
  success: boolean;
  count: number;
  data: NBAProp[];
}

export interface PerformanceGroup {
  label: string;
  total: number;
  hits: number;
  misses: number;
  hit_rate: number;
}

export interface PerformanceData {
  by_team: PerformanceGroup[];
  by_confidence: PerformanceGroup[];
  by_stat_type: PerformanceGroup[];
  by_direction: PerformanceGroup[];
}

export interface PerformanceResponse {
  success: boolean;
  period: string;
  data: PerformanceData;
  summary: {
    total: number;
    hits: number;
    misses: number;
    hit_rate: number;
  };
}
