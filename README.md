# Ground Up

A 14-week AI skills learning platform. Built as a design-to-code implementation using Vite + React + TypeScript.

## Screens

| Screen | Description |
|--------|-------------|
| **Landing** | Course overview, 14-step roadmap, and sign-up |
| **Onboarding** | 3-step flow: background → goal → schedule |
| **Dashboard** | Today's task, streak, heatmap, and step progress |
| **Lesson** | Split-pane notes editor with task checklist and vault scaffold export |
| **Checkpoint** | Hard gate with pass/fail criteria before advancing |
| **Portfolio** | Projects, skills, and shareable write-ups |

## Tech stack

- [Vite 5](https://vitejs.dev/) — build tool
- [React 18](https://react.dev/) — UI
- [TypeScript 5](https://www.typescriptlang.org/) — strict mode throughout
- [JSZip](https://stuk.github.io/jszip/) — vault scaffold download

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Other commands

```bash
npm run build    # type-check + production build → dist/
npm run preview  # serve the production build locally
```

## Project structure

```
src/
├── App.tsx              # Shell, routing, mode toggle
├── main.tsx             # Entry point
├── data.ts              # Types + FRESH / DEMO data factories
├── progress.tsx         # React context (replaces window globals)
├── primitives.tsx       # Shared icons + UI atoms
├── styles.css           # Design tokens, utilities, components
└── components/
    ├── Landing.tsx
    ├── Onboarding.tsx
    ├── Dashboard.tsx
    ├── Lesson.tsx
    ├── Checkpoint.tsx
    ├── Portfolio.tsx
    └── Sidebar.tsx
```

## Demo mode

Use the toggle in the top bar to switch between **Fresh** (Day 1 learner) and **Demo** (Priya Mehta, Step 4 Week 7) to see the app in different states.
