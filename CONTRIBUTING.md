# Contributing to React Abacus Simulator

Thank you for helping make abacus learning more accessible and enjoyable. Contributions of all sizes are welcome, including bug fixes, tests, documentation, translations, accessibility improvements, and new learning features.

## Before You Start

- Check the [open issues](https://github.com/danial-razi/react-abacus-simulator/issues) before starting work.
- Comment on an issue if you would like to work on it, especially when it is labeled `help wanted` or `good first issue`.
- Open an issue before making a large feature or architectural change so the approach can be discussed first.
- Keep pull requests focused. Unrelated changes are easier to review as separate pull requests.

## Local Setup

You will need Git, Node.js, and npm.

1. Fork the repository on GitHub.
2. Clone your fork:

   ```bash
   git clone git@github.com:YOUR_USERNAME/react-abacus-simulator.git
   cd react-abacus-simulator
   ```

3. Install the exact dependency versions from the lockfile:

   ```bash
   npm ci
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Create a focused branch for your change:

   ```bash
   git switch -c feature/short-description
   ```

## Useful Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run typecheck` | Check TypeScript types without emitting files |
| `npm run lint` | Run ESLint with zero warnings allowed |
| `npm test` | Run the Vitest test suite once |
| `npm run build` | Type-check and create a production build |
| `npm run check` | Run the complete local quality gate |

Run `npm run check` before opening a pull request.

## Project Structure

- `components/` contains the application modes and interactive UI.
- `domain/` contains pure abacus and practice logic and its unit tests.
- `hooks/` contains shared React state logic.
- `i18n.tsx` contains English and Persian UI messages.
- `public/` contains the PWA manifest, icons, and service worker.
- `styles/` contains the Tailwind entry point and global styles.

## Development Guidelines

### Behavior and tests

- Keep calculation and bead-state rules in `domain/` when they do not require React.
- Add or update tests for behavior changes and bug fixes.
- Cover both Japanese Soroban and Chinese Suanpan behavior when a change affects bead rules.
- Include decimal-place and limited-rod cases when they are relevant.

### Accessibility

- Preserve keyboard support for interactive controls.
- Use semantic elements and meaningful accessible names.
- Make focus visible and do not rely on color alone to communicate state.
- Test controls with the keyboard at minimum; screen-reader verification is encouraged for accessibility-focused changes.

### Internationalization

- Add every new UI message to both `en` and `fa` in `i18n.tsx`.
- Verify that layouts work in both left-to-right and right-to-left directions.
- Avoid hard-coded user-facing text inside components.

### UI and responsive behavior

- Follow the existing visual language and Tailwind patterns.
- Check both desktop and narrow mobile viewports.
- Keep bead targets large enough to click or drag comfortably.
- Respect the user's reduced-motion preference.

### Persistence and PWA changes

- Treat existing `localStorage` keys as user data. Avoid renaming or deleting them without a migration.
- Keep the app usable when storage is unavailable.
- When changing service-worker caching behavior, update the cache version and verify a production build both online and offline.

## Pull Requests

In your pull request:

- Explain what changed and why.
- Link the related issue with `Closes #123` when applicable.
- Include screenshots or a short recording for visible UI changes.
- Describe how you tested the change.
- Mention any follow-up work or known limitations.
- Confirm that `npm run check` passes locally.

Maintainers may request changes to keep behavior, accessibility, and project scope consistent. Reviews should be constructive and focused on the contribution.

## Reporting Bugs

A useful bug report includes:

- Clear reproduction steps.
- The expected and actual behavior.
- Browser, operating system, and device details.
- The selected abacus type, rod count, decimal places, language, and mode when relevant.
- Screenshots or a short recording when they help explain the problem.

## License

By contributing, you agree that your contributions will be licensed under the repository's [MIT License](LICENSE).
