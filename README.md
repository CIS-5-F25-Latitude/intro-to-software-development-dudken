[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/DMgPsbn3)
# Tiny App / 2D Game Starter (Codespaces + Copilot + GitHub Pages)

Build ANY small project you want (2D game encouraged). Keep scope tiny so you can finish and share a public link.

What you’ll use
- GitHub (your repo)
- Codespaces (coding in the browser)
- Copilot (AI suggestions — you edit)
- Git (commits on `main`)
- GitHub Pages (public link)

---

## Quick Start (Step-by-Step)

1) Create your repo
- Using a template: click “Use this template” → “Create a new repository”.
- Or fork: click “Fork”.
- Or Classroom: accept the assignment (creates your repo automatically).

2) Open in Codespaces
- In your repo, click “Code” → “Create codespace on main”.
- Wait for VS Code in the browser to load.

3) Preview the app
- Open `index.html` → click “Open in Browser” or the Preview button.
- You should see a blank starter with a canvas and HUD.

4) Plan with Issues (3 tiny tasks)
- Go to “Issues” → “New issue” → choose “Story”.
- Create 3 small Issues with Acceptance Criteria (AC).
- Example (Pong): “Ball bounces off walls” — AC: bounces on all edges; no stick.

5) Build the first Issue (small slice)
- Edit `app.js` and related files.
- Use Copilot for suggestions, but read and edit the code.

6) Commit with Git (do this every small step)
- Terminal (commands):
  ```bash
  git add .
  git commit -m "feat: ball bounces off walls"
  git push origin main
  ```

7) Deploy (GitHub Pages)
- Repo → Settings → Pages → Build and deployment → Deploy from branch.
- Branch: `main`; Folder: `/ (root)` → Save.
- Wait ~1 minute; a link appears. Open it and share.

8) Repeat: next Issue → small commit(s) → push → test link

---

## Student Choice — Examples (Keep It Tiny)

2D Games (recommended)
- Pong: paddle moves; ball bounces; score to 3.
- Breakout: ball hits small grid of bricks; clear to win.
- Snake: grow to length 8; game over on self-collision.
- Flappy clone: pass 5 pipes; game over on ground/pipe.
- Endless runner: avoid obstacles for 30 seconds.
- Collector: move to collect 10 coins; avoid 2 slow enemies.

Non‑Game (also fine)
- Mad Libs generator; Flashcards; Simple To‑Do (with localStorage); Quiz (5 Qs).

Scope guardrails
- One screen (or few); no login; no server.
- One clear win/goal condition.
- 2–4 core features total.

---

## Files

- `index.html` — Minimal page with HUD and a `<canvas id="game">`.
- `style.css` — Readable fonts, spacing, focus outlines.
- `app.js` — Your main logic, tiny game loop included.
- `utils.js` — Helpers: `clamp`, `randInt`, `shuffle`, `formatTime`.
- `storage.js` — Save/load small data with `localStorage`.

Optional extras you can add later: sounds, themes, difficulty curve.

---

## Workflow: Issues → Small Commits → Deploy

1) Create 3 Issues
- Example (Pong):
  - Ball bounces off walls (AC: bounces on all 4 edges; speed stays constant)
  - Paddle moves with arrows (AC: left/right only; stops at edges)
  - Score to 3 and restart (AC: show score; at 3 show restart button)

2) Work one Issue at a time
- Implement the smallest piece first (e.g., just move the ball).

3) Commit early, commit small
- Example messages:
  - `feat: draw moving ball`
  - `feat: bounce on left/right walls`
  - `feat: bounce on top/bottom walls`
  - `feat: paddle moves with arrows`
  - `feat: show score and restart`

4) Push to `main` and test the live link

5) Close the Issue when AC are met

Tip: Copilot can draft, but you are responsible for the final code. Read and edit!

---

## Deploy Details (GitHub Pages)

- Settings → Pages → “Deploy from branch” → `main` + `/ (root)` → Save.
- If you change only HTML/CSS/JS, Pages will update within ~1–2 minutes after each push to `main`.
- Your link format is usually: `https://<your-username>.github.io/<your-repo>/`.

If it doesn’t load
- Make sure `index.html` is at the repo root.
- Confirm Pages points to `main` and root.
- Wait and refresh. If still stuck, ask for help.

---

## localStorage Helpers

```js
// storage.js
saveData('highScore', 7);
const hs = loadData('highScore', 0);
```

Use this to keep small data across refreshes on the same device.

---

## Helpful Copilot Prompts

- “Create a simple game loop with `requestAnimationFrame` that moves a ball.”
- “Add keyboard controls for left/right arrows with a max speed.”
- “Write a function `clamp(value, min, max)` with 2 examples.”
- “Propose a basic rectangle collision check and explain it with comments.”
- “Draft accessible HTML for a HUD with score and a restart button.”

---

## Troubleshooting

- Nothing shows: open `index.html` in the preview. Check DevTools Console for errors.
- Keyboard doesn’t work: click the canvas first to focus; log key events to verify.
- Pages 404: re-check Pages settings; make sure you pushed to `main`.
- Codespaces slow: reload the tab; reopen the Codespace.

---

## Responsible AI Use

- AI drafts; you decide. Read and edit any generated code.
- If AI wrote a big chunk, add a note in your README or a PR description: what it generated and what you changed.

Good luck — keep it tiny, ship it, and share your link!

