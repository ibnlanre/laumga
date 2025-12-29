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

Utilize the `@ibnlanre/builder` library for all API interactions to maintain consistency and type safety.

- **Queries:** Employ `api.module.function.$use(params)` for parameterized queries, ensuring `params` aligns with the function signature.
- **Mutations:** Use `api.module.function.$get()` for operations without parameters.
- Depend on the builder's `$use` (for parameterized keys and execution) and `$get` (for stable keys) rather than manually constructing query keys or directly accessing the cache.
- Organize domain modules with the following structure:
  - `schema.ts`: Zod schemas (upstream payloads employ `FieldValue` for log entries; downstream conversions transform timestamps to `Date`).
  - `types.ts`: Strict Firestore generics and `Variables` helpers.
  - `index.ts`: CRUD operations and builder integration. Limit to CRUD functions (like `create`, `update`, `get`, `list`, `remove`) and export a single `module` object via `createBuilder`.
  - `options.ts`: TanStack Query options definitions using `queryOptions` and `useServerFn`.
  - `hooks.ts`: React Query bindings (custom hooks that use the options).
- For intricate workflows, incorporate `options.ts` to define query options. Use `useServerFn` to wrap builder methods (`module.$use.method`) and `queryOptions` to define the query key (`module.method.$get`) and function. This enables consistent data fetching on both server and client.
- Ensure every `create`/`update` mutation accepts a `{ user, data }` structure, performs schema validation, and applies audit fields using `record(user)`. Integrate schemas based on `dateSchema`/`fieldValueSchema` (refer to `src/schema/date.ts`) to store `FieldValue` timestamps upstream and return `Date` objects downstream.
- Keep `index.ts` lean: **only** wire `create`, `update`, `list`, `get`, `remove`. Delegate specialized filters (e.g., state-based chapters, publish/archive, member counts) to `options.ts`, where `Variables<T>` configurations can be prebuilt.
- In derived hooks, persist use of builder-generated keys (`module.method.$use(params)`) for `queryKey` and `queryFn`, even for narrowed list queries via `filterBy`, `sortBy`, `limit`, etc. Refrain from creating custom endpoints for single-record fetches when a filtered `list` is adequate.
- When a workflow touches ancillary collections (e.g., event registrations), create a separate module directory under the api folder for it (e.g., `event-registration/`). The core builder still exposes only CRUD, while handlers coordinate multi-collection logic and reuse base hooks for data hydration.
- Enforce uniqueness (e.g., `slug`) in `create` handlers through Firestore queries prior to insertions.
- Log user metadata for all status changes (like `created`, `published`, `updated`, `archived`) with `record(user)`.

## Forms & Validation

- Use Mantine Form combined with Zod for validation.
- Import `zod4resolver` from `"mantine-form-zod-resolver"`.
- Validation schemas must reside in their respective domain modules, not in global files.
- Example: `createMandateSchema` in `src/api/mandate.ts`.
- Reference: `src/components/account-credentials-form.tsx` (registration form with password strength).

## Components & Styling

- **Mantine:** For interactive UI elements (forms, buttons). Only use `@mantine/modals` for modals.
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
- **Indexes:** Manage Firestore indexes in `firestore.indexes.json`. Complex queries (e.g., equality filter + sort on different fields) require composite indexes.
- **Timestamps:** Use `src/schema/date.ts` for date/timestamp validation. This ensures compatibility between Firebase Admin (Server) and Firebase Web (Client) SDKs, which use different Timestamp classes.

## Code Conventions

- **Filenames:** Use kebab-case (e.g., `account-credentials-form.tsx`).
- **Exports:** Use named exports only.
- **React Components:** Define as function declarations.
- **Types:** Use interfaces for props; import strict types from `src/services/types.ts`. Avoid `any` or `unknown`.
- **Timestamps:** Store as numbers; use `date-fns` for date manipulations.
- **Imports:** Import directly from source files; avoid barrel exports. Remove unused code and mocks.
- **Refactors**: Kindly stop changing perfectly good code. Only suggest refactors that improve performance, fix bugs, or enhance readability in a meaningful way.

## Common Pitfalls

- Avoid editing `src/routeTree.gen.ts` manually, as it is auto-generated.
- Keep validation schemas in domain-specific modules (e.g., `src/api/mandate.ts`) rather than global files.
- Use the `@ibnlanre/builder` library's `$use` and `$get` methods for queries and mutations; do not create keys manually.
- Do not commit secrets; reference `.env.example` for environment variables.
- Rely on the `meta` field in API hooks for notifications instead of calling `notifications.show` directly.
- Use Firebase-generated document IDs exclusively; avoid custom or random IDs.
- Implement tabular data displays with the `DataTable` component only.
- Prefer Mantine's built-in components (e.g., tabs, steppers, accordions) over custom implementations.
- Manage modals using `@mantine/modals` instead of the basic Mantine Modal.
- Stick to current APIs and patterns; avoid deprecated ones by consulting the latest documentation.
- Remove obvious comments, duplicate code, dummy data, and commented-out code unless it provides essential context.
- Enforce strict typing; prohibit `any` or `unknown` types without review.
- Ensure `validateSearch` uses Zod schemas validated with `zodValidator`.
- Extend or reuse `src/api/upload.ts` for Firebase Storage uploads; do not reimplement.
- Use Mantine form contexts for multi-step forms to prevent prop drilling.
- Avoid nesting function components inside other function components.
- Exclude functions from `useEffect` dependency arrays.
- Replace "required" props on Mantine form inputs with `withAsterisk`.
- Prohibit barrel exports for components, hooks, or API functions.
- Import directly from source files; avoid re-exports from index files (except when the source is an index file).
- Ensure all components and pages function with real data.
- Connect all modals and forms to actual API endpoints, handling responses appropriately.
- Do not use percentage-based widths; use fixed widths or Tailwind's responsive utilities instead; except when absolutely necessary.
- Do not use `React.`
- Instead of `children: ReactNode;`, use `PropsWithChildren` for component props.

## Key Files & Examples

Query Options:\*\* `src/api/article/options.ts` (pattern for server/client data fetching)

- **Route Pattern:** `src/routes/_public/index.tsx`
- **Hooks with Builder Keys:** `src/services/hooks.ts`
- **Uploads with Firebase Storage:** `src/api/upload.ts` (use for file uploads)

---

If any section is unclear or incomplete, provide feedback to improve these instructions. Keep updates concise and actionable.
