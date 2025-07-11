import { generateDashboardHTML } from './templates/dashboard.js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (url.pathname === '/api/event' && request.method === 'POST') {
      return handleAnalyticsEvent(request, env);
    }

    if (url.pathname === '/dashboard' || url.pathname === '/') {
      return handleDashboard(request, env);
    }

    return new Response('Not Found', { status: 404, headers: CORS_HEADERS });
  },
};

async function handleAnalyticsEvent(request, env) {
  try {
    const { type, installationUUID } = await request.json();
    const userAgent = request.headers.get('User-Agent') || 'unknown';

    if (!['iframe_loaded', 'player_loaded'].includes(type)) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    await env.DB.prepare(
      `
      INSERT INTO analytics (type, user_agent, installation_uuid) 
      VALUES (?, ?, ?)
    `
    )
      .bind(type, userAgent, installationUUID || null)
      .run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
}

async function handleDashboard(request, env) {
  const url = new URL(request.url);
  const days = parseInt(url.searchParams.get('days')) || 30;
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - days);

  try {
    const [uniquePlayerLoads, totalPlayerLoads, uniqueIframeLoads, totalIframeLoads] =
      await Promise.all([
        env.DB.prepare(
          `
          SELECT COUNT(DISTINCT installation_uuid) as count
          FROM analytics 
          WHERE type = 'player_loaded' 
          AND date >= ? 
          AND installation_uuid IS NOT NULL
        `
        )
          .bind(daysAgo.toISOString())
          .first(),

        env.DB.prepare(
          `
          SELECT COUNT(*) as count
          FROM analytics 
          WHERE type = 'player_loaded' 
          AND date >= ?
        `
        )
          .bind(daysAgo.toISOString())
          .first(),

        env.DB.prepare(
          `
          SELECT COUNT(DISTINCT installation_uuid) as count
          FROM analytics 
          WHERE type = 'iframe_loaded' 
          AND date >= ? 
          AND installation_uuid IS NOT NULL
        `
        )
          .bind(daysAgo.toISOString())
          .first(),

        env.DB.prepare(
          `
          SELECT COUNT(*) as count
          FROM analytics 
          WHERE type = 'iframe_loaded' 
          AND date >= ?
        `
        )
          .bind(daysAgo.toISOString())
          .first(),
      ]);

    const playerAverage = uniquePlayerLoads?.count > 0 
      ? Math.round((totalPlayerLoads?.count || 0) / uniquePlayerLoads.count * 10) / 10
      : 0;
    
    const iframeAverage = uniqueIframeLoads?.count > 0 
      ? Math.round((totalIframeLoads?.count || 0) / uniqueIframeLoads.count * 10) / 10
      : 0;

    const html = generateDashboardHTML({
      uniquePlayerLoads: uniquePlayerLoads?.count || 0,
      totalPlayerLoads: totalPlayerLoads?.count || 0,
      uniqueIframeLoads: uniqueIframeLoads?.count || 0,
      totalIframeLoads: totalIframeLoads?.count || 0,
      playerAverage,
      iframeAverage,
      selectedDays: days,
    });

    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=UTF-8', ...CORS_HEADERS },
    });
  } catch (error) {
    return new Response('שגיאה בטעינת הדשבורד', {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=UTF-8', ...CORS_HEADERS },
    });
  }
}
