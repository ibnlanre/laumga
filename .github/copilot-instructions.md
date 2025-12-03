# Laumga AI Agent Quickstart

## Overview

This guide outlines essential patterns and conventions for developing the Laumga application. Adhere to these guidelines to maintain consistency, code quality, and architectural integrity.

## Technology Stack

- **Frontend:** React + TypeScript with Vite build tool
- **UI Framework:** Mantine (forms, modals, interactive components) + Tailwind CSS (layout and styling)
- **Routing:** TanStack Router (file-based routing)
- **Backend Services:** Firebase (Authentication, Firestore database, Storage)
- **API Abstraction:** `@ibnlanre/builder` library for consistent API interactions

## Design System

- **Primary Color Scheme:**
  - Olive: #77874b
  - Deep Forest: #002313
  - Institutional Green: #006838
  - Vibrant Lime: #8dc63f
  - Sage Green: #cbe5a7
  - Mist Green: #f4f9ec
- Theme tokens are defined in `src/routes/__root.tsx` (e.g., `deep-forest`, `institutional-green`).

## Routing

- Routes are file-based and located under `src/routes/`.
- Each route file must export a `createFileRoute()` function.
- **Critical:** Never manually edit `src/routeTree.gen.ts` (auto-generated file).
- **Search Params Validation:** Use Zod with `zodValidator` from `@tanstack/zod-adapter` for validating search parameters.
  - Example:

    ```tsx
    import { createFileRoute } from "@tanstack/react-router";
    import { zodValidator } from "@tanstack/zod-adapter";
    import { z } from "zod";

    const productSearchSchema = z.object({
      page: z.number().default(1),
      filter: z.string().default(""),
      sort: z.enum(["newest", "oldest", "price"]).default("newest"),
    });

    export const Route = createFileRoute("/shop/products/")({
      validateSearch: zodValidator(productSearchSchema),
    });
    ```

## API Patterns

Use the `@ibnlanre/builder` library for all API interactions:

- **Queries:** `api.module.function.$use(params)` - matches the function signature.
- **Mutations:** `api.module.function.$get()` - no parameters required.
- Reference: `src/services/hooks.ts` (all hooks follow this pattern).

## Forms & Validation

- Use Mantine Form combined with Zod for validation.
- Import `zod4resolver` from `"mantine-form-zod-resolver"`.
- Validation schemas must reside in their respective domain modules, not in global files.
- Example: `createMandateSchema` in `src/api/mandate.ts`.
- Reference: `src/components/account-credentials-form.tsx` (registration form with password strength).

## Components & Styling

- **Mantine:** For interactive UI elements (forms, buttons, modals).
- **Tailwind CSS:** For layout, spacing, and utility classes.
- Shared components: Place in `src/components/`.
- Route-specific components: Place in subfolders under `src/routes/`.
- Route-specific components: Place in subfolders under `src/layouts/`.
- Avoid inline `style` props, except for `backgroundImage`.

## Firebase Usage

- When calling Firebase's `collection` method, use the associated `CollectionReference<T>` type for type safety. For example, for a `user` collection, use `collection(firestore, 'user')` with `CollectionReference<User>`.
- When calling Firebase's `doc` method, use the associated `DocumentReference<T>` type. For example, for a `user` document, use `doc(firestore, 'user', userId)` with `DocumentReference<User>`.
- Proper typing eliminates the need for casting data, reducing runtime errors from type mismatches.
- For `updateDoc`, pass data directly or use `UpdateData<T>` for the variable type to ensure correct Firestore interpretation.
- For `setDoc` or `addDoc`, pass data directly or use `WithFieldValue<T>` for the variable type to ensure correct Firestore interpretation.

## Code Conventions

- **Filenames:** Use kebab-case (e.g., `account-credentials-form.tsx`).
- **Exports:** Use named exports only.
- **React Components:** Define as function declarations.
- **Types:** Use interfaces for props; import strict types from `src/services/types.ts`. Avoid `any` or `unknown`.
- **Timestamps:** Store as numbers; use `date-fns` for date manipulations.
- **Imports:** Import directly from source files; avoid barrel exports. Remove unused code and mocks.

## Common Pitfalls

- Do not edit `src/routeTree.gen.ts`.
- Do not store validation schemas in global files—keep them in domain modules.
- Do not manually create query/mutation keys—always use the builder's `$use` and `$get` methods.
- Do not commit secrets (refer to `.env.example` for environment variables).
- Avoid invoking `notifications.show` directly; rely on the `meta` field in API hooks.
- Use Firebase-generated document IDs instead of custom or random IDs.
- Leverage Mantine's built-in components (tabs, steppers, accordions) instead of custom implementations.
- Use `@mantine/modals` for modal management instead of the basic Mantine Modal component.
- Do not use deprecated APIs or patterns; refer to the latest documentation.
- Do not add comments that state the obvious or explain well-written code.
- Eliminate duplicate code, dummy data, and commented-out code, except if it contains useful context.
- Do not use `any` or `unknown` types; always use strict typing. Exceptions must be reviewed.
- `validateSearch` must use Zod schemas with `zodValidator`.

## Key Files & Examples

- **Route Pattern:** `src/routes/_public/index.tsx`
- **Hooks with Builder Keys:** `src/services/hooks.ts`
- **Uploads with Firebase Storage:** `src/api/upload.ts`

---

If any section is unclear or incomplete, provide feedback to improve these instructions. Keep updates concise and actionable.

