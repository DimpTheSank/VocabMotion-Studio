# VocabMotion Studio v0.3 — AI Storyboard MVP

Next.js + Remotion vocabulary animation editor with a server-side OpenAI storyboard generator.

## Vercel setup

Set these Environment Variables in Vercel → Project → Settings → Environment Variables:

- `OPENAI_API_KEY` — OpenAI API key (server only; never use NEXT_PUBLIC_)
- `STUDIO_ACCESS_CODE` — a long random password you choose to protect the paid AI endpoint
- `OPENAI_STORYBOARD_MODEL` — optional; defaults to `gpt-4o-mini`

**Important:** GitHub repo and Vercel deployment may be public. The AI route intentionally refuses to run without `STUDIO_ACCESS_CODE`. This prevents anonymous visitors from spending your API budget. Do not commit the values to GitHub. Redeploy after adding or changing env vars.

The UI has a Studio Access Code field. Enter the password you set in Vercel, fill the vocabulary fields, then click **Generate with AI**. The browser sends the code only to the server over HTTPS; the OpenAI API key remains server-side.

## What AI generates

A five-scene storyboard in strict JSON: title, caption, narration, supported SVG scene style, positive/blocked animation state, duration, and object notes. Scenes can be edited and previewed with Remotion Player.

The **objects** array contains creative direction only. New objects are **not** dynamically drawn yet: animation currently uses four reusable SVG styles (journey, chart, dialogue, process). Narration is text only; there is no TTS/audio synchronization yet.

## Run locally

Node.js 20+:

```bash
npm install
```

Create `.env.local` with `OPENAI_API_KEY=...` and `STUDIO_ACCESS_CODE=...`. Then:

```bash
npm run dev
```

Visit http://localhost:3000.

## Local MP4 export

Vercel hosts the editor and preview, **not** MP4 rendering. The `/api/render` endpoint returns HTTP 501 on Vercel until a separate render worker is configured.

To render a sample lesson:

```bash
npm run render:sample
```

For a custom lesson or storyboard JSON saved from the UI:

```bash
node scripts/render.mjs vocabmotion-lesson.json out/custom.mp4
```

Rendering requires Chromium and Remotion dependencies installed on the local machine.

## Current status

- Next.js editing UI and Remotion preview
- Protected server-side OpenAI storyboard generation (strict JSON schema)
- Per-scene text, duration, visual template and obstacle editing
- JSON import/export and local Node MP4 renderer
- No image generation, voice synthesis, batch generation or cloud render worker yet

The code was committed to GitHub. Production build and live API generation still need validation after redeploy.
