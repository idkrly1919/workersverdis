/**
 * Cloudflare Worker for workersverdis
 * Handles API routes and serves static files using Workers Assets
 */

// Configuration constants
const IMAGE_GENERATION_TIMEOUT_MS = 120000; // 2 minutes

/**
 * Handle image generation API endpoint
 */
async function handleGenerateImage(request, env) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get API key from environment variables
    const apiKey = env.API_KEY;

    if (!apiKey) {
      // Generic error message to avoid leaking configuration details
      return new Response(JSON.stringify({ error: 'Service temporarily unavailable' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Build the image generation URL with the secure API key
    const encoded = encodeURIComponent(prompt);
    const imgUrl = `https://image.pollinations.ai/prompt/${encoded}?model=zimage&width=2048&height=2048&key=${apiKey}`;

    // Fetch the image from pollinations.ai with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), IMAGE_GENERATION_TIMEOUT_MS);

    const response = await fetch(imgUrl, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    // Return the image with appropriate headers
    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/png',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    // Handle timeout errors specifically
    if (error.name === 'AbortError') {
      return new Response(JSON.stringify({ error: 'Image generation timed out' }), {
        status: 504,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    // Generic error message to avoid exposing internal details
    console.error('Image generation error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate image' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Main request handler
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Handle API routes first
    if (pathname === '/api/generate-image') {
      return handleGenerateImage(request, env);
    }

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // For static assets, use env.ASSETS if available (Workers Assets)
    // Otherwise fall back to fetching the static files
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    // Fallback: serve static files directly
    // This will work when deployed with wrangler deploy --assets ./
    return new Response('Not Found', { status: 404 });
  }
};
