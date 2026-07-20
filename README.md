# ScoreUp — AI SAT Coach

**Live app: [sakshamsingla8b-netizen.github.io/sat-coach](https://sakshamsingla8b-netizen.github.io/sat-coach/)** — free, no sign-up, no API key needed.

An AI study coach for the SAT. Paste a question you got wrong and it explains the concept step by step, generates fresh practice questions on that topic, and tracks your weak areas over time.

Built by a student prepping for the SAT — the tool I wished existed.

## Features

- **Analyze** — paste any SAT question + your answer; get a step-by-step solution, the key concept, and the common trap.
- **Practice** — generate SAT-style multiple-choice questions on any topic, with instant feedback and short explanations.
- **Progress** — every analyzed question feeds a dashboard that ranks your weakest topics by accuracy.
- **No key, no account** — just open the link and use it.

## How it works (architecture)

```
Browser (index.html on GitHub Pages)
        │  question / topic
        ▼
Cloudflare Worker proxy  ←  holds the API key as an encrypted secret
        │  forwards request
        ▼
Groq API (openai/gpt-oss-120b)
```

- The front end is a single HTML file — no build step, hosted free on **GitHub Pages**.
- AI calls go through a **Cloudflare Worker** (`proxy/worker.js`) that holds the API key server-side, so users never need their own. The key never appears in this repo or in the browser.
- The proxy has basic abuse guards: only allowed origins can call it, requests are size-capped, and output tokens are limited.
- Progress data lives in the browser's localStorage — private to each user, no server database.

## Run your own copy

1. **Fork/clone** this repo and enable GitHub Pages (Settings → Pages → deploy from `main`).
2. Create a free **Cloudflare Worker**, paste in `proxy/worker.js`, and add your own Groq API key as a secret named `GROQ_API_KEY` (Worker → Settings → Variables and Secrets).
3. In `worker.js`, put your own site URL in `ALLOWED_ORIGINS`.
4. In `index.html`, set `PROXY_URL` to your worker's URL.

That's it — a static host plus one serverless function.

## Development notes

Interesting problems solved along the way:

- **Wrong-answer highlighting** — instead of trusting the model's answer index (which it sometimes mislabels), the app asks for the correct choice's exact text and matches it against the options client-side.
- **Math accuracy** — upgraded the model to a reasoning-focused one after catching arithmetic slips in generated questions.
- **Key security** — moved from user-supplied keys to a serverless proxy so the app is usable by anyone while the key stays secret.

## Roadmap

- Photo upload — snap a question instead of typing it
- Full-length adaptive practice sets with scoring
- Shareable weak-area report cards

## License

MIT
