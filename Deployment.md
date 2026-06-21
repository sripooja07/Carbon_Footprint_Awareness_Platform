# Production Deployment Guide - Eco Friendly Tracker

This document provides instructions on how to build, test, package, and deploy the **Eco Friendly Tracker** application in a production environment.

---

## 🚀 Deployment Targets

The application is a static React application, optimized for high-performance content delivery networks (CDNs) and zero-configuration serverless hosting platforms.

---

## ☁️ Option A: Production Deployment on Vercel (Recommended)

Vercel is the primary host target because it automatically reads `vercel.json` headers, handles HTTPS TLS termination, and configures smart edge cache routing.

### Continuous Deployment via GitHub Actions Integration
Every commit pushed to the `main` branch will build and deploy instantly:
1. Go to the [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New" ➔ "Project"**.
3. Import your GitHub repository.
4. Keep the default settings (Vercel automatically detects the Vite config and npm build scripts).
5. Click **"Deploy"**.

---

## 🛠️ Option B: Local Production Build

To inspect production assets locally or host on a private Nginx/Apache server:
1. Compile and bundle the production distribution folder:
   ```bash
   npm run build
   ```
2. The compiler creates a highly-optimized static folder named `dist/` in your workspace root, grouping minimized CSS styles and code-split JavaScript chunks.
3. Preview the compiled production build locally:
   ```bash
   npm run preview
   ```

---

## 📦 Vercel Configuration Setup (`vercel.json`)

The workspace includes a configured `vercel.json` file to manage SPA routing rules and inject HTTP security headers:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

---

## 🤖 Continuous Integration Workflow CI/CD

The workspace includes a automated GitHub Actions CI workflow in `.github/workflows/ci.yml`.

### CI Actions Pipeline
1.  **Triggers**: Runs on every `push` and `pull_request` targeting the `main` or `master` branches.
2.  **Environment**: Spins up an `ubuntu-latest` VM runner loaded with Node.js 20.
3.  **Dependencies**: Performs clean, locked dependency installations (`npm ci`).
4.  **TypeScript Verification**: Runs strict type checks (`npm run typecheck`).
5.  **Lint Enforcement**: Asserts ESLint stylistic formatting rules (`npm run lint`).
6.  **Test coverage verification**: Executes all Vitest test suites and compiles coverage metrics (`npm run coverage`).
