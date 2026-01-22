# Cloudflare Workers Deployment Guide

This project is configured to run on **Cloudflare Workers** (not Cloudflare Pages). This guide will help you deploy it.

## Prerequisites

- A Cloudflare account (free tier works!)
- Node.js and npm installed
- A zimage API key for the image generation feature
- **Git repository cloned locally** (not run from within `.git` directory)

## Important Note About Assets

When deploying from a Git repository, you need to deploy from outside the repository directory or the `.git` folder will cause issues. **Best practice**: Create a deployment copy without .git.

## Quick Start Deployment

### Method 1: Using Wrangler CLI (Recommended)

1. **Install Wrangler globally**:
   ```bash
   npm install -g wrangler
   ```

2. **Authenticate with Cloudflare**:
   ```bash
   wrangler login
   ```
   This will open a browser window for authentication.

3. **Set your API key as a secret**:
   ```bash
   wrangler secret put API_KEY
   ```
   When prompted, paste your zimage API key.

4. **Deploy the worker with assets**:
   
   **Option A - Deploy from repo** (recommended - wranglerignore should handle .git):
   ```bash
   wrangler deploy --assets ./
   ```
   
   **Option B - If you encounter .git size issues**:
   ```bash
   # Create a deployment directory without .git
   mkdir -p /tmp/deploy-workersverdis
   rsync -av --exclude='.git' --exclude='node_modules' --exclude='functions' --exclude='scripts' ./ /tmp/deploy-workersverdis/
   cd /tmp/deploy-workersverdis
   wrangler deploy --assets ./
   ```

5. **Done!** Your site is now live at `https://workersverdis.<your-subdomain>.workers.dev`

### Method 2: Using Cloudflare Dashboard

This method is more manual but doesn't require CLI tools. **Note**: Static assets must still be deployed via CLI.

1. **Create a Worker**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to **Workers & Pages**
   - Click **Create Application** → **Create Worker**
   - Give it a name (e.g., "workersverdis")

2. **Upload the Worker Code**:
   - Copy the contents of `worker.js`
   - In the worker editor, paste the code
   - Click **Save and Deploy**

3. **Set Environment Variables**:
   - In the worker settings, go to **Settings** → **Variables**
   - Add a new **Secret** variable:
     - Name: `API_KEY`
     - Value: Your zimage API key
   - Click **Save**

4. **Upload Static Assets**:
   - Assets must be deployed via CLI using Method 1 above
   - Use: `wrangler deploy --assets ./`

## Environment Variables

The worker uses the following environment variables:

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `API_KEY` | Secret | Yes | Your zimage API key for image generation |

## Features Included

✅ **All static files** - HTML, CSS, JavaScript, images, fonts, etc.
✅ **API endpoint** - `/api/generate-image` for AI image generation  
✅ **Service workers** - Baremux and UV for proxy functionality
✅ **CORS support** - Enabled for public access
✅ **Error handling** - Proper 404 and 500 error pages

## Updating Your Deployment

To update your deployed worker:

```bash
# After making changes to your code
wrangler deploy --assets ./
```

## Custom Domain

To use a custom domain:

1. Add your domain to Cloudflare
2. In the worker settings, go to **Settings** → **Triggers**
3. Click **Add Custom Domain**
4. Enter your domain and click **Add Custom Domain**

## Troubleshooting

### Issue: "wrangler: command not found"
**Solution**: Install wrangler globally: `npm install -g wrangler`

### Issue: "Not authenticated"
**Solution**: Run `wrangler login` and complete the authentication flow

### Issue: "API_KEY not set" error
**Solution**: Make sure you've run `wrangler secret put API_KEY` and entered your key

### Issue: "Asset too large" error mentioning .git directory
**Solution**: Use the rsync deployment method (Option B above) to deploy without the .git directory:
```bash
mkdir -p /tmp/deploy-workersverdis
rsync -av --exclude='.git' --exclude='node_modules' --exclude='functions' --exclude='scripts' ./ /tmp/deploy-workersverdis/
cd /tmp/deploy-workersverdis
wrangler deploy --assets ./
```

### Issue: Static files not loading
**Solution**: Make sure you're deploying with the `--assets ./` flag:
```bash
wrangler deploy --assets ./
```

### Issue: Image generation not working
**Solution**: 
1. Verify your API key is set correctly: `wrangler secret put API_KEY`
2. Check the browser console for error messages
3. Ensure you're using a valid zimage API key

## Development

For local development with wrangler dev, you may need to use a clean directory without .git:

```bash
# Create dev directory
mkdir -p /tmp/dev-workersverdis
rsync -av --exclude='.git' --exclude='node_modules' ./ /tmp/dev-workersverdis/
cd /tmp/dev-workersverdis
wrangler dev --assets ./
```

This will start a local server (usually at `http://localhost:8787`)

## Cost

Cloudflare Workers free tier includes:
- 100,000 requests per day
- 10ms CPU time per request
- Unlimited static asset storage

This should be more than enough for most personal projects!

## Additional Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [Workers Assets Docs](https://developers.cloudflare.com/workers/static-assets/)
