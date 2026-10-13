# VocabMotion Studio v0.2

Next.js + Remotion vocabulary motion-graphics editor.

## Run locally

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open http://localhost:3000 to edit vocabulary, choose a scene style, preview and export MP4.

To render a sample video without opening the editor:

```bash
npm run render:sample
```

The output is `out/demo.mp4`. For custom lessons:

```bash
node scripts/render.mjs path/to/lesson.json out/custom.mp4
```

Remotion requires a working Chromium/browser rendering environment for MP4 output.

## Vercel deployment

Vercel hosts **the editor and Remotion Player preview only**. The `/api/render` endpoint deliberately returns HTTP 501 on Vercel until a dedicated render worker is configured.

### Why the render engine runs separately

Remotion's bundler and renderer depend on native Rspack/esbuild binaries. Importing them directly from a Next.js API Route causes Webpack build errors (e.g. `.node` module parse errors). The API Route now launches `scripts/render.mjs` as a separate Node process for local rendering, so Webpack does not bundle those native modules.

Redeploy after updating `main`. You do not need to change Vercel build settings: framework Next.js, build command `npm run build`.

## Implemented

- 9:16 720x1280 30 FPS 30-second video
- Five scenes: intro, concept, contrast, IELTS example, quiz
- Four SVG scene styles: journey, chart, dialogue, process
- Keyword-based template suggestion (not yet AI inference)
- Editable lesson text, JSON import/export, preview
- Local Node MP4 renderer

## Roadmap

AI storyboarding, text-to-speech, synchronized captions, CSV batch creation, dedicated cloud render worker and job queue.

**Status:** Source fixes have been committed. Production build and MP4 rendering still need validation on an environment with npm dependencies and Chromium.
