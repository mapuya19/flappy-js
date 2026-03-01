export default {
  async fetch(request, env) {
    const CORS_HEADERS = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      if (path === '/api/submit' && request.method === 'POST') {
        return await handleSubmitScore(request, env, CORS_HEADERS);
      } else if (path === '/api/scores' && request.method === 'GET') {
        return await handleGetScores(request, env, CORS_HEADERS);
      } else {
        return new Response('Not Found', { status: 404, headers: CORS_HEADERS });
      }
    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }
  }
};

async function handleSubmitScore(request, env, corsHeaders) {
  const { name, score } = await request.json();

  if (!name || !score) {
    return new Response(JSON.stringify({ error: 'Missing name or score' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const response = await fetch(`${env.TURSO_URL}/v2/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.TURSO_AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [{
        type: 'execute',
        stmt: {
          sql: 'insert into scores (name, score) values (?, ?)',
          args: [{ type: 'text', value: name }, { type: 'integer', value: String(score) }]
        }
      }],
    }),
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleGetScores(request, env, corsHeaders) {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit')) || 10;

  const response = await fetch(`${env.TURSO_URL}/v2/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.TURSO_AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [{
        type: 'execute',
        stmt: {
          sql: 'select name, score from scores order by score desc limit ?',
          args: [{ type: 'integer', value: String(limit) }]
        }
      }],
    }),
  });

  const data = await response.json();
  const rows = data.results[0].response.result.rows;
  const scores = rows.map(row => ({ name: row[0].value, score: Number(row[1].value) }));

  return new Response(JSON.stringify({ scores }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}
