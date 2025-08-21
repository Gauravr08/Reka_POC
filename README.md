# REKA•POC — Next.js App Router (Cyberpunk)

A POC replicating key flows from a multimodal AI platform: **Vision**, **Research**, **Chat**, **Speech**, and **Spaces**, plus a **Dashboard**. Dark cyberpunk UI.

## Quickstart

```bash
pnpm create next-app reka-poc --ts --eslint --tailwind --app --src-dir=false --import-alias "@/*"
# Replace generated files with repo content
pnpm i
cp .env.example .env.local # fill keys
pnpm dev
```

### Environment
- `OPENAI_API_KEY` or `OPENROUTER_API_KEY` (either works; both supported)
- `EXA_API_KEY` for research

### Modules
- **Dashboard**: fake KPIs & charts via Recharts.
- **Vision**: image upload → OpenAI/OpenRouter vision chat completions.
- **Research**: EXA AI `/search` endpoint → list of results.
- **Chat**: streaming chat via server route proxy with OpenAI/OpenRouter.
- **Speech**: Web Speech API (client-side) + server endpoints for TTS/STT (optional).
- **Spaces**: localStorage-based workspace manager with export.

### Notes
- This is POC-level; please harden auth, rate-limits, error handling for production.
- You can theme further via `tailwind.config.ts` and `styles/globals.css`.
- Swap models by editing `lib/providers.ts` or per-module UI controls.
