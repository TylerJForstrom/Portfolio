# Personal Portfolio - Tyler Forstrom

A fast, self-contained one-page portfolio for showcasing software engineering
projects, live demos, source code, and a small project-focused chatbot.

The site is intentionally simple: no framework, no build step, and no backend.
It can be deployed directly from the repo root on Netlify, Cloudflare Pages, or
GitHub Pages.

## Featured Projects

- Photon Forge: a browser-based 3D ray-traced light puzzle game with Three.js,
  draggable optics, camera controls, solved-state feedback, and a sandbox level
  builder for custom source/target/wall puzzles.
- Portfolio Insight Copilot: a static fintech AI demo with a portfolio builder,
  broad U.S. listed ticker search, simulation-backed estimates, benchmark
  comparison, transparent risk scoring, citations, and non-advisory guardrails.
- Agent-Based Market Simulator and Strategy Validation Firewall: a Python market
  simulation and strategy validation system that also provides calibration data
  for the portfolio copilot demo.
- Ripple: a JavaScript and Canvas wave-interference puzzle game.

## Chatbot

`chatbot.js` contains a small curated knowledge base that answers questions about
Tyler's projects, skills, background, and contact information. It runs fully in
the browser with keyword scoring, so it has no API cost and avoids making claims
outside the curated project descriptions.

## View Locally

Double-click `index.html`, or serve the folder:

```powershell
python -m http.server 8091
```

Then open `http://localhost:8091`.

## Deploy

Static files live at the repo root, so Netlify can deploy with default settings:

- Build command: leave blank
- Publish directory: leave blank or use `/`
- Production branch: `main`

Every push to `main` redeploys automatically.
