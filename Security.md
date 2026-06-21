# Security Audit & Audit Safeguards - Eco Friendly Tracker

This document outlines the security architecture, threat models, input validation protocols, and client-side sanitization policies implemented in the **Eco Friendly Tracker** application.

---

## 🛡️ Input Sanitization & XSS Mitigation

Cross-Site Scripting (XSS) is the primary threat vector for client-side single-page applications. The application enforces a strict input sanitization pipeline inside the core state hook `useCarbonTracker.ts` before committing entries to memory or local storage.

### 1. Neutralizing HTML Script Tags
All descriptive string details inputted by the user are sanitized by removing dangerous HTML bracket delimiters:
```typescript
const safeDetails = String(log.details || '').replace(/[<>]/g, '');
```
*   **Vector**: An attacker inputs `<script>alert('xss')</script>`.
*   **Result**: The delimiters are stripped out, resulting in `scriptalert("xss")/script`, which renders as plain, harmless text in the browser DOM and prevents injection.

### 2. Form Field & ID Character Whitelisting
All ID fields and code tokens are sanitized to alphanumeric and dash characters only:
```typescript
const safeId = String(log.id).replace(/[^\w-]/g, '');
const safeType = String(log.type || '').replace(/[^\w-]/g, '');
```
This blocks any directory traversal, database injection attempts, or specialized encoding attacks.

### 3. Date Pattern Enforcement
Date strings are checked against a strict ISO 8601 pattern:
```typescript
const safeDate = String(log.date || '').match(/^\d{4}-\d{2}-\d{2}$/) 
  ? String(log.date) 
  : new Date().toISOString().split('T')[0];
```
This forces all logged dates to conform strictly to the `YYYY-MM-DD` standard format, preventing SQL-like injection strings in date parsing blocks.

### 4. Numeric Bounds and Type Coercion
Range slider values can be modified in the DOM by attackers to pass unexpected types (e.g. `NaN`, infinite decimals, or nested arrays). The application validates all numeric values before logging:
```typescript
const safeCo2 = typeof log.co2 === 'number' && !isNaN(log.co2) ? Number(log.co2.toFixed(4)) : 0;
const safeAmount = typeof log.amount === 'number' && !isNaN(log.amount) ? Number(log.amount.toFixed(2)) : 0;
```
If a value is invalid or `NaN`, it defaults back to `0`, preventing memory overflow or calculator crashes.

---

## 🔒 Storage Security & Quota Resilience

Client storage (`localStorage`) is vulnerable to quota overflows and parsing crashes if a user or external script tampers with the keys.

### 1. Robust JSON Deserialization
If a storage key is corrupted (e.g. holds invalid JSON), the application catches the error and falls back to a clean initial state:
```typescript
try {
  const item = window.localStorage.getItem(key);
  return item ? (JSON.parse(item) as T) : initialValue;
} catch (error) {
  console.warn(`Error reading localStorage key "${key}":`, error);
  return initialValue;
}
```

### 2. Disk Quota Exceptions Handling
When browser space is exceeded, writing to `localStorage` throws a `DOMException` (QuotaExceededError). The application isolates this side effect inside a nested `try-catch` inside `setValue` so that disk failure warnings are logged gracefully without crashing the UI thread.

---

## 🛡️ Secure Deployment (CSP & TLS)

1.  **Vercel Routing Security**: `vercel.json` configures modern HTTP security headers including `X-Frame-Options: DENY` (clickjacking prevention) and `X-Content-Type-Options: nosniff`.
2.  **HTTPS Enforcement**: All production traffic is served exclusively over secure TLS 1.3 channels.
