## how to deploy to cloudflare workers (workers.dev)

1. fork repo
2. log in to cloudflare
3. install wrangler CLI if you don't have it: `npm i -g wrangler`
4. authenticate wrangler: `wrangler login`
5. set your API key as a secret: `wrangler secret put API_KEY`
6. deploy with assets: `wrangler deploy --assets ./`

### alternative: deploy through dashboard

1. go to Workers & Pages in Cloudflare dashboard
2. click "Create Application" → "Create Worker"
3. upload the worker.js file
4. configure environment variables in Settings:
   - Add secret `API_KEY` with your zimage API key
5. you'll need to upload static assets separately or use the CLI method above

---

## ~~how to deploy to cloudflare pages (pages.dev)~~ [DEPRECATED]

**Note**: This project is now configured for Cloudflare Workers. For Pages deployment, use the old method below (but Workers is recommended):

1. fork repo
2. log in to cloudflare

now choose how you wanna do this

#### through cli (super reliable)
1. open up the forked repo on ur pc and install wrangler if you dont have it (npm i -g wrangler)
2. do `wrangler pages project create your-project-name`
3. once complete, do `wrangler pages deploy ./`

#### through dashboard
1. go to workers/pages
2. click new application
3. click "looking to deploy pages?" or smth
4. import the repo
5. follow the steps do deploy

### assistant ai features
The assistant AI page includes:
- **Text generation**: Uses the public pollinations.ai endpoint (no API key needed)
- **Image generation**: Uses zimage API with 2k resolution (2048x2048) through a secure worker endpoint

**Important**: You must set the `API_KEY` secret for your Cloudflare Worker for image generation to work:
- Use `wrangler secret put API_KEY` when deploying via CLI
- Or set it in the Worker dashboard under Settings → Variables → Environment Variables → Add variable (type: Secret)