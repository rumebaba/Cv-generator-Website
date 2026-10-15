# CV Generator

A client-side CV builder. Fill in a 12-step form, save to the cloud, and export a PDF or DOCX. Nothing is uploaded for document generation — every export happens in the browser.

- **Live:** https://cv-generator-website-xi.vercel.app
- **Firebase project:** `cv-builder-website-7e761`

## Stack

React 19 · TypeScript 6 · Vite 8 · Tailwind CSS 4 · Firebase 12 (Auth + Firestore) · TipTap 3 · `@react-pdf/renderer` · `docx`

## Getting started

```bash
npm install
cp .env.example .env    # then fill in the values below
npm run dev
```

### Environment variables

All six are Firebase **client** config, which is public by design — the app's real protection is `firestore.rules`. They are inlined into the built bundle, so there is nothing secret to keep here.

| Variable | Notes |
|---|---|
| `VITE_FIREBASE_API_KEY` | |
| `VITE_FIREBASE_AUTH_DOMAIN` | |
| `VITE_FIREBASE_PROJECT_ID` | |
| `VITE_FIREBASE_STORAGE_BUCKET` | Unused by the app; retained alongside `storage.rules` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Unused — messaging is not initialised |
| `VITE_FIREBASE_APP_ID` | |

`.env` is gitignored. The live values can be read from the deployed bundle if you just need the public client config.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server on port 5173 |
| `npm run build` | `tsc -b && vite build` — **type errors block the build** |
| `npm test` | `typecheck` + all three `verify:*` scripts. The main gate. |
| `npm run typecheck` | `tsc -b`. Do not change this to `tsc --noEmit` — see *Gotchas* |
| `npm run lint` | ESLint, `--max-warnings 0`. Currently clean. |
| `npm run format` / `format:check` | Prettier over `src/` |

### Verification scripts

There is no unit-test framework. Behaviour is guarded by three headless scripts, run by `npm test`:

| Script | Guards |
|---|---|
| `verify:steps` | Every wizard step maps to a data key; Step 8 credentials and Step 10 certifications are genuinely distinct shapes; step bounds are 1..12 |
| `verify:sections` | Renders all 6 PDF templates, asserts **every section appears** and **hides when deselected**, and that Step 11 languages take precedence over the legacy Step 7 field while still falling back to it when empty |
| `verify:creative` | PDF content-stream geometry: long names never overlap the subtitle or overflow the sidebar, bullet spacing stays tight, reading order is preserved, output stays within 2 pages |

These download `tsx` on demand via `npx --yes`, so they need network access.

## Architecture

```
src/
  types/form.ts          FormData (2 objects + 9 arrays), FormStep, TOTAL_STEPS, initial* factories
  hooks/useForm.tsx      single reducer + context; sessionStorage persistence under 'cv-form-data'
  hooks/useTemplate.tsx  template selection, localStorage under 'cv-template'
  services/submitClient.tsx  Firestore CRUD with timeouts and an 850 KB document guard
  services/generateDocx.ts    DOCX export
  components/forms/      Step1..Step12
  components/pdf/        6 templates + PDFPreview modal
  pages/                 route components
```

- **State** — `useForm` is the single source of truth. The URL (`/form/step/:n`) is authoritative for the current step; the reducer's `currentStep` mirrors it.
- **Section visibility** — Step 12 stores `selectedSections`, persisted with the CV. Every renderer gates on `shouldShow(key)`, which is **fail-open** (`!== false`) so older CVs without the field still render fully.
- **Saving** — 3-second debounced auto-save to `clients/{id}`, guarded by several refs (`busyRef`, `latestSnapshotRef`, `scopeRef`, `savedSnapshotRef`) to survive unmounts, account switches and concurrent writes. Section toggles are saved too.
- **Exports** — PDF is rendered by `@react-pdf/renderer`; DOCX by `docx`. Both are produced in the browser and downloaded via an object URL. **Firebase Storage is not used.**
- **Providers** — `ErrorBoundary > BrowserRouter > AuthProvider > ToastProvider > AppRoutes`.

### Templates

Six, each with a distinct visual identity: `classic`, `modern`, `minimal`, `executive`, `creative`, `compact`. All render all 11 sections. `verify:sections` enforces that, so a template dropping one fails the build gate.

### Templates page

`/templates` shows **hand-rolled DOM previews**, not the real PDF output. They use your real form data with `"John Smith"` fallbacks, so they are indicative only — the `PDFPreview` modal is the source of truth.

## Deploying

### Vercel (the web app)

Set the six `VITE_FIREBASE_*` variables as **build-time** environment variables. `vercel.json` builds with `npm run build` and serves `dist` with an SPA rewrite.

### Firebase (rules only — there is no hosting)

```bash
npm i -g firebase-tools
firebase use --add          # pick cv-builder-website-7e761
firebase deploy --only firestore:rules
```

`firestore.rules` changes **do not take effect until this is run**. `storage.rules` is unused and does not need deploying.

Admin access is granted by a custom claim, or by a verified email hardcoded in `firestore.rules`. Since this repository is public, prefer the claim. Note there is no `firebase-admin` dependency here — setting the claim is done out of band.

## Gotchas

Things that will bite you:

- **`npm run typecheck` must stay `tsc -b`.** The root `tsconfig.json` is a solution file (`"files": []` + references). Plain `tsc --noEmit` follows no references and checks **zero files** while exiting 0 — it will silently pass a broken codebase.
- **Line endings are LF.** `.gitattributes` enforces `eol=lf` and `.prettierrc` sets `endOfLine: "lf"`. Without the attribute, Git's `core.autocrlf` rewrites the tree to CRLF on Windows checkout and Prettier then reports an error on *every line of every file*.
- **Tailwind is v4 and CSS-first.** There is no `tailwind.config.js`; the theme lives in a `@theme` block in `src/index.css`. Adding a `@config` directive would resurrect the old v3-style file.
- **`scripts/` is in no tsconfig.** It is excluded from `tsc -b`, so type errors there only appear when the scripts run.
- **`src/services/submitClient.tsx` is `.tsx` but contains no JSX.**
- **PDF filenames** are now derived from the candidate's name; DOCX always was.

## Known limitations

- Validation blocks advancing a step and now explains why, but **per-field error highlighting is not wired up** — `setErrors` exists in the reducer and is still never called, so the `error` props on individual inputs remain `undefined`.
- `completedSteps` is always empty: `COMPLETE_STEP` is never dispatched, so the stepper never shows the green "completed" state.
- Two PDF templates render their Skills or Credentials blocks more than once (Creative's credentials appear in both the sidebar and an "Additional" section; Modern's skills appear in the sidebar and the main column).
- Rich text uses `prose` classes but `@tailwindcss/typography` is **not** installed, so those styles do nothing.
- The rich-text editor does not sync external changes to its `value` — a cloud resume will not repopulate an already-mounted editor.
- Images embedded via the rich-text toolbar have no size cap, unlike the Step 1 profile photo (2 MB). Base64 images can exceed the `sessionStorage` quota, where the write failure is silent.
- `/admin` is reachable by any signed-in user at the router level; enforcement is by Firestore rules only.
- Contact messages are unauthenticated writes (shape- and size-validated, but no captcha or rate limit).