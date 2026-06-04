# AGENTS.md

## Tech Stack

- **Package manager**: pnpm (v10+) with workspaces
- **Components**: Lit 3 (LitElement, `static properties`, `static styles`)
- **Consumers**: React 19 (Vite 8), Angular 18 (CLI)
- **Language**: TypeScript 6 (ui-kit, consumer-react), TS 5.5 (consumer-angular)
- **Build**: tsc (ui-kit), Vite (react), Angular CLI (angular)

## Architecture

- Monorepo at `packages/*` — `@web-components/ui-kit` is the core library; consumers import it via `workspace:*`
- Components are registered as custom elements via `customElements.define()` at module scope
- Consumers import `@web-components/ui-kit` to trigger side-effect registration, then use elements declaratively in their templates
- React consumer provides JSX type declarations in `src/custom-elements.d.ts` (augments `React.JSX.IntrinsicElements`)
- Angular consumer uses `CUSTOM_ELEMENTS_SCHEMA` in its standalone component

## Build Commands

| Command | Action |
|---|---|
| `pnpm build` | Build ui-kit (tsc) |
| `pnpm build:react` | Build ui-kit + consumer-react |
| `pnpm build:angular` | Build ui-kit + consumer-angular |
| `pnpm check` | Run Biome lint + format check |
| `pnpm check:fix` | Auto-fix all safe Biome issues |
| `pnpm dev:ui-kit` | Demo server for ui-kit components |
| `pnpm dev:react` | Vite dev server for React app |
| `pnpm dev:angular` | `ng serve` for Angular app |
| `pnpm format` | Check formatting with Biome |
| `pnpm format:fix` | Auto-format with Biome |
| `pnpm lint` | Run Biome linter |
| `pnpm lint:fix` | Auto-fix lint issues with Biome |
| `pnpm typecheck:react` | TypeScript type check for React |

## Conventions

- **Lit components**: Use `static properties` property declarations (not decorators). Declare types with `declare`. Use `attribute` mapping for hyphenated attributes. Use `state: true` for internal reactive state.
- **CSS**: Scoped via `static styles` with `css` tagged template literals. Use CSS custom properties for theming with fallback values. BEM-like class naming (`btn--primary`, `input-container--small`).
- **Events**: Dispatch `CustomEvent` with `bubbles: true` and `composed: true`. Event names are lowercase (`input`, `change`).
- **React integration**: Use refs + `useEffect` for event listeners (see `useInputEvent` custom hook pattern). Set properties via element refs for two-way binding.
- **Angular integration**: Use standard attribute/event binding syntax. Angular handles property binding for known attributes automatically.
- **No comments** in code unless absolutely necessary.
- **Imports**: TypeScript with `.js` extensions for ESM compatibility.
- **Project structure**: Each component is its own `.ts` file. Barrel export from `index.ts`.
