# Laumga AI Agent Quickstart

## Stack & Core Patterns
- **Tech:** React + TypeScript (Vite), Mantine (forms/modals) + Tailwind (layout), TanStack Router (file-based routing), Firebase (auth + Firestore), `@ibnlanre/builder` API abstraction.
- **Routing:** File-based under `src/routes/`. Export `createFileRoute()` per file. **Never edit `src/routeTree.gen.ts`** (auto-generated).
- **Builder API Keys:**
  - Queries: `api.module.function.$use(params)` (matches function signature)
  - Mutations: `api.module.function.$get()` (no params)
  - Example: `src/services/hooks.ts` (all hooks updated to use this pattern)

## Forms & Validation
- Use Mantine Form + Zod (`zod4resolver` from `"mantine-form-zod-resolver"`).
- Validation schemas live in domain modules, not global files (e.g., `createMandateSchema` in `src/api/mandate.ts`).
- Example: `src/components/account-credentials-form.tsx` (registration form with password strength).

## Component & Style Rules
- Mantine for interactive UI (forms, buttons, modals), Tailwind for layout/tokens.
- Theme tokens in `src/routes/__root.tsx` (e.g., `deep-forest`, `institutional-green`).
- Shared components in `src/components/`, route-specific in subfolders under `src/routes/`.
- Components meant specifically for a certain route should live in a subfolder under the `src/layouts` folder.
- Avoid inline `style` props except for `backgroundImage`.

## Code Conventions
- Filenames: kebab-case. Named exports only. Function declarations for React components.
- Types: Interfaces for props, strict types from `src/services/types.ts`. No `any`/`unknown`.
- Timestamps: Numbers only. Use date-fns for date logic.
- Clean imports: Direct from source files, no barrels. Remove unused code/mocks.

## Common Pitfalls
- Don't edit `src/routeTree.gen.ts`.
- Don't keep validation schemas in global files—move to domain modules.
- Don't use manual arrays for query/mutation keys—always use builder's `$use`/`$get`.
- Don't commit secrets (see `.env.example`).

## Key Files & Examples
- Route pattern: `src/routes/_public/index.tsx`
- Hooks with builder keys: `src/services/hooks.ts`

---
If any section is unclear or incomplete, ask for feedback to improve these instructions. Keep edits concise and actionable.
