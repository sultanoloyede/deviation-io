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
  opp_pts_rank: number | null;
  opp_reb_rank: number | null;
  opp_ast_rank: number | null;
  created_at: string;
}

export interface PropsResponse {
  success: boolean;
  count: number;
  data: NBAProp[];
}
