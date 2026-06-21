# Quality Assurance & Testing Plan - Eco Friendly Tracker

This document details the testing architecture, validation methodologies, and execution instructions for the **Eco Friendly Tracker** application.

---

## 🧪 Testing Stack

The project relies on a modern testing pipeline built for reliability, type-safety, and speed:
*   **Vitest**: Next-generation test runner, executing test suites in parallel.
*   **React Testing Library (RTL)**: User-centric rendering tests that interact with components the way a user would.
*   **jsdom**: A simulated browser environment for Node.js, enabling rapid DOM assertions without browser overhead.
*   **V8 Coverage**: Comprehensive, low-overhead native coverage metrics.

---

## 📈 Test Coverage Summary

The test suite achieves **97%+ statement coverage** and **88%+ branch coverage**, verifying all edge cases, input validation checks, and state transitions.

### Coverage Breakdown by Area

| File Area | Statements Coverage | Branch Coverage | Test Objective |
| :--- | :--- | :--- | :--- |
| **src/utils/carbonCalculations.ts** | **100%** | **100%** | Formulas, emission categories, coefficients, labels, units. |
| **src/components/ui/** (UI Library) | **100%** | **93.7%** | Rendering, variant classes, disabled states, accessibility. |
| **src/hooks/** (Hooks Core) | **97.5%** | **87.2%** | useLocalStorage JSON error handling, useCarbonTracker sanitization. |
| **src/components/** (Views Core) | **97.4%** | **85.0%** | Form inputs, validation alerts, navigation, ledger charts. |
| **src/App.tsx** | **100%** | **100%** | Core navigation integration, Suspense rendering, mobile banners. |

---

## 🔬 Core Testing Strategies & Patterns

### 1. Decoupled Business Logic Hook Testing
Hooks are tested using `@testing-library/react`'s `renderHook` and `act` utilities:
*   **useLocalStorage.test.ts**: Verifies loading initial defaults, setting new state values, parsing invalid JSON strings, and handling quota exceeding errors safely by mocking `Storage.prototype.setItem`.
*   **useCarbonTracker.test.ts**: Validates log ledger additions, entry deletions, XSS sanitization constraints, and acceptance/completion/quitting of gamified challenges.

### 2. Validation Constraints & Dynamic JSDOM Boundaries
In standard DOM environments, setting range values out of bounds (e.g., passing `'15'` to range with `max="10"`) is clamped by the browser. To test our business validator:
*   Tests programmatically set attributes on the input element (e.g., `slider.setAttribute('max', '20')`) before firing events.
*   This bypasses range constraints and confirms the validator correctly displays warning alerts for values outside the `[1, 10]` range.

### 3. Isolated Route Controller Integration
*   `App.test.tsx` mocks all lazy-loaded subcomponents (`Dashboard`, `Calculator`, `Recommendations`, `HistoryLog`) to isolate and test navigation routes, state syncing, and tab-clicking behaviors without layout execution side effects.

---

## 🚀 Running Test Suites Locally

### Install testing dependencies
```bash
npm install
```

### Run all tests once
```bash
npm run test
```

### Run tests in watch mode (interactive development)
```bash
npm run test:watch
```

### Check code coverage report
```bash
npm run coverage
```
The console will print a detailed tabular breakdown, and a full interactive HTML report will be generated under the `coverage/` directory. Open `coverage/index.html` in your web browser to trace covered lines visually.
