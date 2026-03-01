const LEADERBOARD_API_URL = import.meta.env.VITE_LEADERBOARD_API_URL;

function validateEnv() {
  if (!LEADERBOARD_API_URL) {
    throw new Error('Leaderboard API URL not configured. Please set VITE_LEADERBOARD_API_URL in your environment variables or run "wrangler dev" for local testing.');
  }
}

export async function submitScore(name, score) {
  validateEnv();

  const res = await fetch(`${LEADERBOARD_API_URL}/api/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, score }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to submit score');
  }

  return res.json();
}

export async function getTopScores(limit = 10) {
  validateEnv();

  const res = await fetch(`${LEADERBOARD_API_URL}/api/scores?limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch scores');
  }

  const data = await res.json();
  return data.scores || [];
}
