# AI Rules for Development

This document defines rules that AI assistants (Cursor, MCP tools) must follow when modifying this repository.

## 1. Architecture

- **Modular architecture**: Keep features in self-contained modules. One primary responsibility per module.
- **Layers**: Prefer clear separation: `pages` → `components` → `hooks` → `lib` / `integrations`. Do not put business logic in UI components.
- **Scalable structure**: Add new features under existing directories; do not introduce new top-level folders without alignment with these rules.
- **No circular dependencies**: Modules may depend downward only (e.g. pages may import components, not the reverse for app logic).

## 2. Code Quality

- **Clean code**: Use descriptive names, small functions, and minimal nesting. Extract magic numbers and strings to constants.
- **TypeScript**: Use strict types. Prefer `interface` for object shapes. Avoid `any`; use `unknown` and type guards when needed.
- **DRY**: Share logic via hooks, utilities, or shared components. Do not duplicate non-trivial logic.
- **Single source of truth**: Config, env, and feature flags in dedicated modules; reference them, do not re-define.

## 3. Performance

- **Performance optimization**: Lazy-load routes and heavy components. Memoize expensive computations and callbacks when profiling shows benefit. Avoid unnecessary re-renders.
- **Bundle size**: Prefer minimal dependencies. Before adding a package, check if the same can be achieved with existing deps or a small util.
- **Assets**: Optimize images and use appropriate formats. Prefer SVGs for icons.

## 4. Dependencies

- **Minimal dependencies**: Add a dependency only when the requirement cannot be met with current stack or a small amount of code.
- **Alignment with stack**: Prefer solutions that fit TypeScript, TailwindCSS, Framer Motion, Supabase, and Vercel deployment. Do not add conflicting or redundant libraries.

## 5. UI / Design

- **Premium UI design principles**: Consistent spacing (Tailwind scale), clear hierarchy, accessible contrast and focus states. Use design tokens (e.g. CSS variables or Tailwind theme) for colors and typography.
- **Motion**: Use Framer Motion for meaningful animation only; respect `prefers-reduced-motion` where applicable.
- **Accessibility**: Semantic HTML, ARIA when needed, keyboard navigation. Do not rely on color alone for information.

## 6. Testing & Debugging

- **AI testing**: Write and update tests when adding or changing behavior. Prefer integration tests for critical flows; unit tests for pure logic.
- **AI debugging**: Prefer structured logs and error boundaries. Do not leave `console.log` in production paths without a guard or logger.

## 7. Refactoring

- **Automated refactoring**: Preserve behavior. Prefer small, incremental steps. Run tests and lint after each logical change.
- **No logic changes**: When adding AI infrastructure or config, do not modify existing application logic unless explicitly requested.

## Stack Reference

- **Runtime / build**: Next.js or Vite (see PROJECT_CONTEXT.md for current setup)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animation**: Framer Motion
- **Backend / data**: Supabase
- **Deployment**: Vercel
