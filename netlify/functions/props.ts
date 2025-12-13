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
    const { limit = '100', min_confidence = '0', player } = event.queryStringParameters || {};

    let query = `
      SELECT * FROM nba_props
      WHERE confidence_score >= $1
    `;

    const params: any[] = [min_confidence];

    if (player) {
      query += ` AND name ILIKE $2`;
      params.push(`%${player}%`);
    }

    query += ` ORDER BY confidence_score DESC LIMIT $${params.length + 1}`;
    params.push(limit);

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
