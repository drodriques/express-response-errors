# Project instructions

- Keep changes and tooling simple.
- Use Biome for linting and formatting. Do not use explicit `any` or `unknown`
  types; use concrete types or meaningful generic parameters.
- Separate functions and logical steps with a blank line. Use braces for control
  statements and avoid nested ternaries.
- Keep each file focused. Keep types near their implementation, shared types in
  `src/types.ts`, public exports in `src/index.ts`, and compatibility wrappers thin.
- Keep the README brief. Put package setup and usage instructions in
  `docs/user_guide.md`, and development instructions in `CONTRIBUTING.md`.
- Keep CI and GitHub Actions workflows disabled. Do not add Git hooks.
- Run checks manually: `npm run validate` before committing and
  `npm run release:check` before preparing a release artifact.
- Keep changes local. Do not push to GitHub or publish to npm without explicit
  user authorization.
