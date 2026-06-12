# 🍃 EcoFootprint - Carbon Footprint Tracker & Advisor

EcoFootprint is an elegant, interactive single-page web application designed to help individuals track, understand, and reduce their carbon footprint through simple activity logs, gamified environmental challenges, and personalized, actionable insights.

Built using **React + Vite** and styled with **Vanilla CSS (Glassmorphism)**, it is lightweight, runs completely client-side, and is configured for direct deployment to Vercel.

---

## ⚡ Key Features

*   **Premium Glassmorphic Dashboard**: A fully responsive interface featuring a circular, animated SVG emission progress gauge.
*   **Real-time Calculators**: Sliders and inputs that dynamically compute carbon footprints (in kg CO₂e) for Travel, Home Energy, Diet, and Shopping.
*   **Gamified Carbon Offset Challenges**: Users commit to green actions (e.g., "Meatless Week") and log negative carbon values as offsets once completed.
*   **Custom Analytics Graph**: A vector SVG-based line chart showcasing weekly emission trends without heavy external library payloads.
*   **Browser Persistence**: Syncs all logs, active goals, and user states locally in browser `localStorage`.
*   **SEO & Vercel Optimization**: Implements semantic HTML, meta descriptions, and custom single-page routing policies (`vercel.json`).

---

## 📂 File Structure

```text
├── public/                 # Static assets (Favicons, base icons)
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx       # Main stats overview & target gauges
│   │   ├── Calculator.jsx      # Slide-input forms with live estimates
│   │   ├── Recommendations.jsx # Optimization tips & commitment cards
│   │   └── HistoryLog.jsx      # Ledger list & vector trend graphs
│   ├── utils/
│   │   └── carbonCalculations.js # Carbon coefficient databases (EPA/DEFRA)
│   ├── App.jsx             # Main router & state manager
│   ├── index.css           # Styling system & CSS variables
│   └── main.jsx            # React mounting shell
├── vercel.json             # Vercel SPA routing configurations
└── vite.config.js          # Vite build options
```

---

## 🛠️ Local Development

To run the application locally on your machine, navigate to the project directory and run:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open the printed URL (usually `http://localhost:5173`) in your web browser.

3. **Build Production Distribution Bundle**:
   ```bash
   npm run build
   ```

---

## ☁️ Deploying to Vercel

The application is fully configured for deployment on [Vercel](https://vercel.com).

### Option A: Using the Vercel CLI
Run the following in the project root:
```bash
npm install -g vercel
vercel
vercel --prod
```

### Option B: GitHub Integration (Continuous Deployment)
1. Push this code to your GitHub repository.
2. Go to the [Vercel Dashboard](https://vercel.com/dashboard).
3. Click **"Add New" ➔ "Project"** and import this repository.
4. Keep the default Vite build settings and click **"Deploy"**. Vercel will rebuild and publish your changes every time you push to the `main` branch.
