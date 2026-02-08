import { Handler } from '@netlify/functions';
import { getPool } from './db';

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const pool = getPool();
    const { period = 'all-time' } = event.queryStringParameters || {};

    // Build date filter based on period
    let dateFilter = '';
    const params: any[] = [];

    switch (period) {
      case 'season':
        // Current NBA season: Oct 2025 - Jun 2026
        dateFilter = `AND TO_DATE(game_date, 'Mon DD, YYYY') >= '2025-10-01'::date
                      AND TO_DATE(game_date, 'Mon DD, YYYY') <= '2026-06-30'::date`;
        break;
      case 'monthly':
        dateFilter = `AND TO_DATE(game_date, 'Mon DD, YYYY') >= CURRENT_DATE - INTERVAL '30 days'`;
        break;
      case 'weekly':
        dateFilter = `AND TO_DATE(game_date, 'Mon DD, YYYY') >= CURRENT_DATE - INTERVAL '7 days'`;
        break;
      case 'daily':
        dateFilter = `AND TO_DATE(game_date, 'Mon DD, YYYY') = CURRENT_DATE`;
        break;
      case 'all-time':
      default:
        dateFilter = '';
        break;
    }

    const baseWhere = `WHERE result IS NOT NULL ${dateFilter}`;

    // Run all 4 grouping queries + summary in parallel
    const [summaryResult, teamResult, confidenceResult, statTypeResult, directionResult] = await Promise.all([
      // Summary
      pool.query(`
        SELECT
          COUNT(*) as total,
          COUNT(CASE WHEN result = 'hit' THEN 1 END) as hits,
          COUNT(CASE WHEN result = 'miss' THEN 1 END) as misses,
          ROUND(COUNT(CASE WHEN result = 'hit' THEN 1 END)::DECIMAL /
            NULLIF(COUNT(*), 0) * 100, 1) as hit_rate
        FROM nba_props_history
        ${baseWhere}
      `),

      // By team (player's team = first token of matchup)
      pool.query(`
        SELECT
          SPLIT_PART(matchup, ' ', 1) as label,
          COUNT(*) as total,
          COUNT(CASE WHEN result = 'hit' THEN 1 END) as hits,
          COUNT(CASE WHEN result = 'miss' THEN 1 END) as misses,
          ROUND(COUNT(CASE WHEN result = 'hit' THEN 1 END)::DECIMAL /
            NULLIF(COUNT(*), 0) * 100, 1) as hit_rate
        FROM nba_props_history
        ${baseWhere}
        GROUP BY SPLIT_PART(matchup, ' ', 1)
        ORDER BY hit_rate DESC
      `),

      // By confidence tier
      pool.query(`
        SELECT
          label,
          SUM(total) as total,
          SUM(hits) as hits,
          SUM(misses) as misses,
          ROUND(SUM(hits)::DECIMAL / NULLIF(SUM(total), 0) * 100, 1) as hit_rate
        FROM (
          SELECT
            CASE
              WHEN confidence_score >= 0.95 THEN '95%+'
              WHEN confidence_score >= 0.90 THEN '90%+'
              WHEN confidence_score >= 0.85 THEN '85%+'
              WHEN confidence_score >= 0.80 THEN '80%+'
              WHEN confidence_score >= 0.75 THEN '75%+'
              ELSE 'Below 75%'
            END as label,
            COUNT(*) as total,
            COUNT(CASE WHEN result = 'hit' THEN 1 END) as hits,
            COUNT(CASE WHEN result = 'miss' THEN 1 END) as misses
          FROM nba_props_history
          ${baseWhere}
          GROUP BY
            CASE
              WHEN confidence_score >= 0.95 THEN '95%+'
              WHEN confidence_score >= 0.90 THEN '90%+'
              WHEN confidence_score >= 0.85 THEN '85%+'
              WHEN confidence_score >= 0.80 THEN '80%+'
              WHEN confidence_score >= 0.75 THEN '75%+'
              ELSE 'Below 75%'
            END
        ) sub
        GROUP BY label
        ORDER BY
          CASE label
            WHEN '95%+' THEN 1
            WHEN '90%+' THEN 2
            WHEN '85%+' THEN 3
            WHEN '80%+' THEN 4
            WHEN '75%+' THEN 5
            ELSE 6
          END
      `),

      // By stat type
      pool.query(`
        SELECT
          stat_type as label,
          COUNT(*) as total,
          COUNT(CASE WHEN result = 'hit' THEN 1 END) as hits,
          COUNT(CASE WHEN result = 'miss' THEN 1 END) as misses,
          ROUND(COUNT(CASE WHEN result = 'hit' THEN 1 END)::DECIMAL /
            NULLIF(COUNT(*), 0) * 100, 1) as hit_rate
        FROM nba_props_history
        ${baseWhere}
        GROUP BY stat_type
        ORDER BY hit_rate DESC
      `),

      // By direction (Over/Under)
      pool.query(`
        SELECT
          CASE WHEN prop ILIKE 'Over%' THEN 'Over' ELSE 'Under' END as label,
          COUNT(*) as total,
          COUNT(CASE WHEN result = 'hit' THEN 1 END) as hits,
          COUNT(CASE WHEN result = 'miss' THEN 1 END) as misses,
          ROUND(COUNT(CASE WHEN result = 'hit' THEN 1 END)::DECIMAL /
            NULLIF(COUNT(*), 0) * 100, 1) as hit_rate
        FROM nba_props_history
        ${baseWhere}
        GROUP BY CASE WHEN prop ILIKE 'Over%' THEN 'Over' ELSE 'Under' END
        ORDER BY hit_rate DESC
      `),
    ]);

    const summary = summaryResult.rows[0] || { total: 0, hits: 0, misses: 0, hit_rate: 0 };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        period,
        data: {
          by_team: teamResult.rows,
          by_confidence: confidenceResult.rows,
          by_stat_type: statTypeResult.rows,
          by_direction: directionResult.rows,
        },
        summary: {
          total: parseInt(summary.total),
          hits: parseInt(summary.hits),
          misses: parseInt(summary.misses),
          hit_rate: parseFloat(summary.hit_rate) || 0,
        },
      }),
    };
  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to fetch performance data',
      }),
    };
  }
};
