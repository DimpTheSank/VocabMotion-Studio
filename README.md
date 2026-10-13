# VocabMotion Studio v0.4 — Hybrid Scene Builder

Next.js + Remotion vocabulary animation editor with a server-side OpenAI storyboard generator.

## Vercel setup

Set these Environment Variables in Vercel → Project → Settings → Environment Variables:

- `OPENAI_API_KEY` — OpenAI API key (server only; never use NEXT_PUBLIC_)
- `STUDIO_ACCESS_CODE` — a long random password you choose to protect the paid AI endpoint
- `OPENAI_STORYBOARD_MODEL` — optional; defaults to `gpt-4o-mini`
- `OPENAI_IMAGE_MODEL` — optional; defaults to `gpt-image-1` (image generation may require account verification and separate billing)

**Important:** GitHub repo and Vercel deployment may be public. The AI route intentionally refuses to run without `STUDIO_ACCESS_CODE`. This prevents anonymous visitors from spending your API budget. Do not commit the values to GitHub. Redeploy after adding or changing env vars.

The UI has a Studio Access Code field. Enter the password you set in Vercel, fill the vocabulary fields, then click **Generate with AI**. The browser sends the code only to the server over HTTPS; the OpenAI API key remains server-side.

## What AI generates

A five-scene storyboard in strict JSON: title, caption, narration, SVG scene background, 2–5 individual SVG asset layers with positions, sizes, motions and delays, and an optional AI image prompt. Each layer can be edited and previewed with Remotion Player.

The scene builder currently supports **18 predefined SVG objects, 5 backgrounds and 7 motions**. AI composes these from a controlled asset vocabulary; it cannot draw an arbitrary new SVG object on its own. Legacy four-template lessons remain supported.\n\nClick **Tạo nền bằng AI** on an individual scene to make one paid image generation request. This is opt-in and asks for confirmation. The generated WebP is embedded in that scene's JSON as a base64 data URL (larger file, not cloud-persisted). SVG layers still animate above the image. A generated background is not a rigged or articulated animated character. Image API support and billing depend on the OpenAI account. Narration is text only; there is no TTS/audio synchronization yet.

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
- Per-scene text, duration, SVG asset/background/motion/position editing
- Opt-in AI-generated image background for individual scenes (paid API, embedded in JSON)
- JSON import/export and local Node MP4 renderer
- No animated image character rigging, voice synthesis, batch generation or cloud render worker yet

The code was committed to GitHub. Production build, AI text generation and AI image generation still need validation after redeploy. On a public site, a shared access code is basic protection only; production use should add user authentication and rate limits.
