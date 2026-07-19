# ScoreUp — AI SAT Coach

An AI study coach for the SAT. Paste a question you got wrong, and it explains the concept, tells you why your answer missed, generates fresh practice questions on that topic, and tracks your weak areas over time.

Built by a student prepping for the SAT — the tool I wished existed.

## Features

- **Analyze** — paste any SAT question + your answer; get a step-by-step solution, the key concept, and the common trap.
- **Practice** — generate 3 fresh SAT-style multiple-choice questions on any topic, with instant feedback and explanations.
- **Progress** — every analyzed question feeds a dashboard that ranks your weakest topics by accuracy.
- **Private by design** — your API key lives only in your browser's localStorage and is sent straight to your chosen API. No server, no accounts.

## Tech

Single-file front end (HTML + CSS + vanilla JS). No build step. AI features use any OpenAI-compatible chat-completions endpoint.

## Run locally

Just open `index.html` in a browser. That's it.

For a local server (recommended so future features like fetch work cleanly):

```bash
# Python
python3 -m http.server 8000
# then open http://localhost:8000
```

## Connect an AI provider

Open **Settings** in the app and paste:

- **API key** — from your provider
- **Endpoint** — an OpenAI-compatible URL
- **Model** — a model name that provider offers

Works with:

| Provider | Endpoint | Notes |
|---|---|---|
| OpenAI | `https://api.openai.com/v1/chat/completions` | model e.g. `gpt-4o-mini` |
| Groq (free tier) | `https://api.groq.com/openai/v1/chat/completions` | fast + free, e.g. `llama-3.3-70b-versatile` |
| OpenRouter | `https://openrouter.ai/api/v1/chat/completions` | many models |
| Together | `https://api.together.xyz/v1/chat/completions` | |

Tip: start with **Groq's free tier** so you (and your users) don't need to pay to try it.

## Deploy (get it live + get real users)

Any static host works — no backend needed:

- **GitHub Pages** — push this folder to a repo, enable Pages. Free.
- **Netlify / Vercel / Cloudflare Pages** — drag-and-drop the folder, get a live URL in minutes.

Then share the link in SAT prep communities (Reddit r/SAT, Discord servers, your school group) and watch usage. **Real users are what turn this from a school project into a flagship achievement** — track how many people use it and their feedback; those numbers belong in your applications and essays.

## Roadmap ideas (great ways to keep leveling it up)

- Proxy the API through a tiny serverless function so users don't need their own key
- Image upload (photograph a question instead of typing it)
- Full-length adaptive practice tests with scoring
- Accounts + cloud sync so progress follows the user across devices
- Shareable "weak-area report" cards

## License

MIT — do whatever you want with it.
