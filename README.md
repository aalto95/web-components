# Web Components Monorepo

A monorepo housing a library of reusable UI Web Components built with [Lit](https://lit.dev/), along with sample consumer apps in React and Angular demonstrating how to integrate them.

## Packages

| Package | Description |
|---|---|
| `@web-components/ui-kit` | Lit-based web component library (`<ui-button>`, `<ui-input>`, `<ui-datepicker>`) |
| `consumer-react` | React (Vite) app consuming the ui-kit |
| `consumer-angular` | Angular app consuming the ui-kit |

## Components

| Component | Default Tag | Features |
|---|---|---|
| **Button** | `<ui-button>` | 4 variants (primary/secondary/outline/ghost), 3 sizes, loading spinner, full-width, icon slots |
| **Input** | `<ui-input>` | Multiple types, label/helper/error text, required indicator, leading/trailing icon slots, sizes |
| **Datepicker** | `<ui-datepicker>` | Calendar popup, month/year nav, locale-aware formatting, min/max validation, configurable first day of week |

All components are themable via CSS custom properties and include ARIA accessibility attributes.

## Prerequisites

- Node.js >= 20
- pnpm >= 10

## Getting Started

```bash
# Install dependencies
pnpm install

# Build the ui-kit (required before running consumers)
pnpm build

# Run the standalone demo (ui-kit only)
pnpm dev:ui-kit

# Run the React consumer app
pnpm dev:react

# Run the Angular consumer app
pnpm dev:angular
```

## Scripts

| Script | Purpose |
|---|---|
| `pnpm build` | Build `@web-components/ui-kit` |
| `pnpm build:react` | Build ui-kit + consumer-react |
| `pnpm build:angular` | Build ui-kit + consumer-angular |
| `pnpm dev:ui-kit` | Start dev server for ui-kit demo page |
| `pnpm dev:react` | Start Vite dev server for React app |
| `pnpm dev:angular` | Start Angular dev server |
| `pnpm typecheck:react` | Run TypeScript type check for React app |

## Theming

Override component styles with CSS custom properties:

```css
--ui-primary-bg: #3b82f6;
--ui-primary-fg: #fff;
--ui-primary-hover: #2563eb;
--ui-focus-ring: #3b82f6;
--ui-input-border: #d1d5db;
--ui-input-error-border: #ef4444;
--ui-calendar-bg: #fff;
```

## Project Structure

```
web-components/
├── package.json
├── pnpm-workspace.yaml
├── packages/
│   ├── ui-kit/               # Shared component library
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── ui-button.ts
│   │   │   ├── ui-input.ts
│   │   │   └── ui-datepicker.ts
│   │   └── demo/
│   ├── consumer-react/       # React consumer app
│   │   └── src/
│   └── consumer-angular/     # Angular consumer app
│       └── src/
```
