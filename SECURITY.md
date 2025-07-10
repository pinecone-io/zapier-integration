# Security Policy

## Known Vulnerabilities

This project currently has known vulnerabilities in transitive dependencies, as reported by automated tools (e.g., Dependabot, npm audit). These vulnerabilities are present due to requirements of upstream dependencies and cannot be resolved directly within this project at this time.

### 1. `crypto-js` (Critical)

- **Advisories:**
  - [GHSA-xwcq-pm8m-c4vf](https://github.com/advisories/GHSA-xwcq-pm8m-c4vf) (PBKDF2 much weaker than standard)
  - [GHSA-3w3w-pxmm-2w2j](https://github.com/advisories/GHSA-3w3w-pxmm-2w2j) (Insecure random numbers)
- **Origin:**
  - `crypto-js` is a transitive dependency of `zapier-platform-core` via `fernet`.
  - This project does **not** use `crypto-js` directly.
- **Mitigation:**
  - Do not use `crypto-js` directly in your own code.
  - Monitor for updates to `zapier-platform-core` and `fernet` that address these vulnerabilities.
  - If you are forking or extending this project, avoid introducing direct usage of `crypto-js`.

### 2. `esbuild` (Moderate, Development)

- **Advisory:**
  - [GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99)
- **Origin:**
  - `esbuild` is a transitive dependency of dev tools such as `vite` and `vitest`.
  - This project does **not** use `esbuild` directly in production code.
- **Mitigation:**
  - Only affects development environments. Do not expose dev servers to untrusted networks.
  - Monitor for updates to `vite`, `vitest`, and related tools.

### 3. `brace-expansion` (Low, Development)

- **Advisory:**
  - [GHSA-xg9f-g7g7-2323](https://github.com/advisories/GHSA-xg9f-g7g7-2323)
- **Origin:**
  - Used by dev dependencies only.
- **Mitigation:**
  - Only affects development environments. Monitor for updates to dev tools.

## General Guidance

- **Do not use vulnerable packages directly** in your own code.
- **Monitor upstream dependencies** (`zapier-platform-core`, `fernet`, `vite`, `vitest`, etc.) for security updates.
- **Update this project** as soon as upstream fixes are available.
- **Document these issues** for your team and users.

## Reporting a Vulnerability

If you discover a security issue in this project, please open an issue or contact the maintainers. If the issue is in an upstream dependency, consider reporting it to the relevant project as well. 