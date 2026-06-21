# Codebase Architecture Guide - Eco Friendly Tracker

This document provides a detailed breakdown of the software architecture implemented in the **Eco Friendly Tracker** application. The codebase has been refactored in accordance with **Clean Architecture** patterns and **SOLID** principles, utilizing **TypeScript** for strict type safety.

---

## 📐 High-Level Architecture

The application is structured into decoupled layers where core business rules, storage logic, UI layouts, and presentation layers are separated. This ensures that the application is easy to test, maintain, and extend.

```mermaid
graph TD
  subgraph Presentation Layer
    App[App.tsx Controller]
    Dashboard[Dashboard.tsx View]
    Calculator[Calculator.tsx View]
    Recommendations[Recommendations.tsx View]
    HistoryLog[HistoryLog.tsx View]
  end

  subgraph Domain & Business Logic (Hooks)
    useCarbon[useCarbonTracker.ts State Engine]
    useStorage[useLocalStorage.ts Sync Hook]
  end

  subgraph Data Layer & Utilities
    Calculations[carbonCalculations.ts Core Rules]
    Types[src/types/index.ts Core Interface Schema]
  end

  subgraph UI Components Library
    Card[Card.tsx]
    Button[Button.tsx]
    Select[Select.tsx]
    Slider[Slider.tsx]
  end

  App -->|Orchestrates| useCarbon
  useCarbon -->|Persists via| useStorage
  useCarbon -->|Invokes| Calculations
  useCarbon -->|Exposes types| Types

  App -->|Lazy-loads Views| Dashboard
  App -->|Lazy-loads Views| Calculator
  App -->|Lazy-loads Views| Recommendations
  App -->|Lazy-loads Views| HistoryLog

  Calculator -->|Uses| UIComponents[UI Components Library]
  HistoryLog -->|Uses| UIComponents
  Recommendations -->|Uses| UIComponents
  Dashboard -->|Uses| UIComponents
```

---

## 📁 Scalable Directory Layout

The codebase utilizes a scalable, component-based folder hierarchy:

```
├── .github/workflows/       # CI/CD pipelines (GitHub Actions)
├── src/
│   ├── assets/              # Static styling assets
│   ├── components/
│   │   ├── ui/              # Reusable generic UI components (Card, Button, Select, Slider)
│   │   ├── Dashboard.tsx    # Interactive statistics metrics
│   │   ├── Calculator.tsx   # Emission logging calculator
│   │   ├── Recommendations.tsx # Challenges & tips
│   │   └── HistoryLog.tsx   # Ledger & trends chart
│   ├── hooks/
│   │   ├── useLocalStorage.ts # State persistence driver
│   │   └── useCarbonTracker.ts # Core state business engine
│   ├── types/
│   │   └── index.ts         # Central TypeScript interfaces
│   ├── utils/
│   │   └── carbonCalculations.ts # Coefficients and formulas
│   ├── App.tsx              # Root controller
│   ├── index.css            # Premium layout styles
│   └── main.tsx             # Application entrypoint
├── tsconfig.json            # Base compiler configurations
├── vite.config.ts           # Bundler and Vitest configurations
└── vercel.json              # Vercel deployment routes config
```

---

## 🛠️ SOLID Architectural Principles Applied

### 1. Single Responsibility Principle (SRP)
Each component and module has exactly one reason to change:
*   `carbonCalculations.ts` holds formulas only.
*   `useLocalStorage.ts` governs JSON storage syncing.
*   `useCarbonTracker.ts` handles log logic and challenge updates.
*   UI controls (`Button`, `Card`, `Select`, `Slider`) render visual properties and trigger callback handlers, free of any business logic dependencies.

### 2. Open/Closed Principle (OCP)
The system is open for extension but closed for modification. For instance, new emission categories can be integrated by adding them to `src/types/index.ts` and `EMISSION_FACTORS` in `carbonCalculations.ts` without modifying the core views or components.

### 3. Liskov Substitution Principle (LSP)
All custom UI components subclass standard HTML element props (e.g. `ButtonProps` extends `React.ButtonHTMLAttributes<HTMLButtonElement>`). Any standard HTML button attribute can be substituted into the custom controls without causing interface crashes.

### 4. Interface Segregation Principle (ISP)
TypeScript types in `src/types/index.ts` define discrete, focused interfaces (`LogEntry`, `Challenge`, `EmissionFactors`) rather than a single large configuration object. Views consume only the specific shapes they require.

### 5. Dependency Inversion Principle (DIP)
High-level views (`Dashboard`, `Calculator`, etc.) do not depend directly on low-level storage routines or formulas. Instead, they depend on abstract callbacks and typed objects passed down from the parent controller (`App.tsx`), which consumes the abstracted hooks.

---

## ⚡ Performance Optimizations

1.  **Lazy Loading & Code Splitting**: All major views (`Dashboard`, `Calculator`, `Recommendations`, `HistoryLog`) are imported dynamically via `React.lazy()` and rendered inside `React.Suspense` with an elegant loader fallback, reducing initial load latency.
2.  **Memoization**: All expensive calculations (e.g., categories sum grouping, SVG line coordinates, challenge arrays filtering, ranking thresholds) are wrapped in `useMemo` hooks to avoid recalculation on unrelated re-renders.
3.  **Callback Caching**: Log addition, deletion, and challenge dispatch functions are wrapped in `useCallback` to maintain reference stability and prevent redundant re-renders of children.
