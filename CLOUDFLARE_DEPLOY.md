# MA Studio Portfolio — Cloudflare Pages Deployment Guide

## Quick Summary

| Setting | Value |
|---------|-------|
| **Framework preset** | Next.js (Static HTML Export) |
| **Build command** | `npx next build` |
| **Build output directory** | `out` |
| **Root directory** | `/` (project root) |

---

## Step 1 — Push to GitHub

```bash
cd /home/z/my-project

# Create a repo on github.com first, then:
git remote add origin https://github.com/YOUR-USERNAME/ma-studio-portfolio.git
git push -u origin main
```

## Step 2 — Create Cloudflare Pages Project

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages**
2. Click **"Create"** → **"Pages"** tab → **"Connect to Git"**
3. Select your GitHub account and the `ma-studio-portfolio` repository
4. Configure the build:
   - **Framework preset:** `Next.js (Static HTML Export)`
   - **Build command:** `npx next build`
   - **Build output directory:** `out`
   - **Root directory:** `/`
5. Click **"Save and Deploy"**

Cloudflare will build your site and deploy it to a `*.pages.dev` subdomain — it's live!

## Step 3 — Connect Custom Domain

1. In your Cloudflare Pages project → **Custom domains** tab
2. Click **"Set up a custom domain"**
3. Enter your domain (e.g., `morshedalam.com`)
4. Cloudflare will guide you through DNS setup:
   - If your domain is **on Cloudflare** (registered as a Cloudflare zone) → automatic, no manual DNS changes needed
   - If your domain is **elsewhere** (Namecheap, GoDaddy, etc.) → add a CNAME record pointing to `your-project.pages.dev`

5. Cloudflare provisions **free SSL/HTTPS** automatically

## Step 4 — Buy a Domain (if needed)

Best options for .com domains:
- [Cloudflare Registrar](https://dash.cloudflare.com/domains) — at-cost pricing (~$9.77/year for .com), no markup
- [Namecheap](https://namecheap.com) — ~$9-12/year, good UI
- [Porkbun](https://porkbun.com) — ~$9-10/year, free WHOIS privacy

**Pro tip:** Register the domain through Cloudflare for the easiest setup — it auto-configures DNS and SSL with zero manual work.

---

## ⚠️ Important: Large Video File

The file `public/projects/website.mp4` is **~50MB**, which exceeds Cloudflare Pages' 25MB per-file limit on the free plan.

**Options to fix this:**

### Option A — Compress the video (recommended)
```bash
# Compress to under 25MB (adjust quality as needed)
ffmpeg -i public/projects/website.mp4 -crf 28 -preset slow -movflags +faststart public/projects/website.mp4
```

### Option B — Host on Cloudflare R2 (object storage)
1. Create a Cloudflare R2 bucket
2. Upload the video to R2
3. Reference it as `https://your-r2-bucket.r2.dev/website.mp4` in the project data

### Option C — Upload to Cloudflare Stream
1. Use Cloudflare Stream ($5/month for 100GB storage)
2. Upload the video → get a Stream ID
3. Replace the `<video>` element with a Stream embed

### Option D — Remove the video
If you don't need this particular video, just remove it from the project data and delete the file.

---

## File Limits (Cloudflare Pages Free Plan)

- **20,000 files** per deployment
- **25MB** per individual file
- **Unlimited** bandwidth and requests
- **500 builds** per month

All your GIFs, images, and the smaller video (`why-love-te.mp4` at 15.5MB) are within limits.

---

## After Deployment

Every time you `git push` to `main`, Cloudflare automatically:
1. Builds the site
2. Deploys to a preview URL
3. Promotes to production (your custom domain)

You can also deploy from the CLI:
```bash
# Install wrangler CLI
npm install -g wrangler

# Login
wrangler login

# Deploy
wrangler pages deploy out --project-name=ma-studio-portfolio
```

---

## Environment Notes

- The site is **fully static** (no server, no database, no API)
- All content (projects, quotes, bio) is hardcoded in `src/lib/projects.ts`
- Images and videos are in `public/projects/`
- Fonts (Instrument Serif, JetBrains Mono, Instrument Sans) are loaded via `next/font/google` — downloaded at build time, served as static files
