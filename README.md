# VocabMotion Studio v0.2

Next.js + Remotion vocabulary motion-graphics editor.

## Local development

Node.js 20+ and Chromium/FFmpeg environment required for MP4 rendering.

```bash
npm install
npm run dev
```

Visit http://localhost:3000. Edit lesson fields, choose a visual template, preview, and export MP4 locally. `npm run render:sample` renders the default composition.

## Implemented

- 9:16 720×1280 30 FPS 30-second video
- Five animated scenes: intro, concept, contrast, IELTS example, quiz
- Four selectable SVG styles: journey, chart, dialogue, process
- Keyword-based style suggestion (not AI API inference)
- Editable text, JSON export/import, Remotion Player preview
- Local Node render endpoint

## Not implemented

- AI-generated storyboards, real TTS, synchronized captions, CSV batch generation, hosted render worker, job queue, authentication
- Direct MP4 export on Vercel (the endpoint returns 501 there)

## Deployment

Deploy Next.js editor to Vercel. MP4 exports require a separate render worker or Remotion Lambda. Do not expose API keys in the client.

This is an initial code scaffold. Full npm build and browser rendering have not yet been verified.
