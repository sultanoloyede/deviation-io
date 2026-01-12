import { Handler } from '@netlify/functions';
import { getPool } from './db';

export const handler: Handler = async (event) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS request for CORS
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
    const { min_confidence = '0', player, stat_type } = event.queryStringParameters || {};

    let query = `
      SELECT * FROM nba_props
      WHERE confidence_score >= $1
    `;

    const params: any[] = [min_confidence];

    if (player) {
      query += ` AND name ILIKE $${params.length + 1}`;
      params.push(`%${player}%`);
    }

    if (stat_type && stat_type !== 'all') {
      // Handle multiple stat types separated by comma
      const statTypes = stat_type.split(',').filter(Boolean);
      if (statTypes.length > 0) {
        const placeholders = statTypes.map((_, i) => `$${params.length + i + 1}`).join(', ');
        query += ` AND stat_type IN (${placeholders})`;
        params.push(...statTypes);
      }
    }

    query += ` ORDER BY confidence_score DESC`;

    const result = await pool.query(query, params);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        count: result.rows.length,
        data: result.rows,
      }),
    };
  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to fetch props',
      }),
    };
  }
};
