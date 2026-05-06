# FAANG Tracker — Samjith

Personal FAANG interview preparation tracker. Built with Next.js + TypeScript. All data stored in localStorage — no backend, no accounts, never resets.

## Features

- **Dashboard** — streak, XP level, today's focus card, phase progress
- **Schedule** — 8-week day-by-day tracker with problem checklists, mood, time logged, notes
- **Problems** — full filterable table of all ~150 Phase 1 problems with LeetCode links
- **Patterns** — 12 core C++ pattern templates with when-to-use guides
- **Mock Timer** — interview simulator with phase breakdown and session debrief scoring
- **Notes** — per-day notes + global scratch pad, auto-saved
- **Stats** — XP/level progression, difficulty breakdown, mood distribution, pattern coverage

## Deploy to Vercel (one command)

```bash
npm install -g vercel
vercel
```

Follow the prompts. Done. Your tracker is live.

## Local dev

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Data persistence

All data is stored in `localStorage` under the key `faang_tracker_v2`. It persists across browser sessions and page refreshes. To back it up, open DevTools → Application → Local Storage → copy the value.

## Stack

- Next.js 16 (App Router, static export)
- TypeScript
- Zero external UI libraries
- localStorage for persistence
