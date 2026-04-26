# CLAUDE.md

We're building the app described in @SPEC.MD. Read that file for general architectural tasks or to double-check the exact database structure, tech stack or application architecture.

Keep you replies extremely concise and focus on conveying the key information. No unnecessary fluff, no long code snippets.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
yarn run dev      # Start development server
yarn run build    # Production build
yarn run start    # Start production server
yarn run lint     # Run ESLint
```

No test runner is configured.

## Stack

- **Next.js 16.2.4** with App Router — read `node_modules/next/dist/docs/` before writing code (APIs may differ from training data)
- **React 19.2.4** — Server Components are the default in App Router
- **TypeScript 5** — strict mode enabled; path alias `@/*` maps to the repo root
- **Tailwind CSS v4** — uses the `@tailwindcss/postcss` plugin (not the classic `tailwind.config.js` approach)
- **ESLint 9** — flat config in `eslint.config.mjs`

## Architecture

All routing lives under `app/` using the App Router file-system convention. There are currently no API routes, no state management library, and no data-fetching layer — the project is a minimal starter.

Fonts are loaded via `next/font/google` (Geist + Geist Mono) and exposed as CSS variables; global styles and Tailwind imports are in `app/globals.css`. Dark mode is handled purely via the `prefers-color-scheme` CSS media query.
