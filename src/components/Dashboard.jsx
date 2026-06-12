import React from 'react';
import { 
  Leaf, 
  Flame, 
  Target, 
  Award, 
  Zap, 
  Car, 
  Utensils, 
  ShoppingBag, 
  TrendingUp, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { getLabel } from '../utils/carbonCalculations';

export default function Dashboard({ logs, activeChallenges, completedChallenges, challenges, setPage }) {
  // Calculate emissions by category
  const categoriesSum = logs.reduce((acc, log) => {
    const cat = log.category;
    if (!acc[cat]) acc[cat] = 0;
    acc[cat] += log.co2;
    return acc;
  }, { transport: 0, energy: 0, food: 0, shopping: 0 });

  const totalEmitted = Object.values(categoriesSum).reduce((sum, val) => sum + val, 0);

  // Calculate total saved carbon from completed challenges
  const totalSaved = completedChallenges.reduce((sum, id) => {
    const ch = challenges.find(c => c.id === id);
    return sum + (ch ? ch.co2Savings : 0);
  }, 0);

  // Carbon budget (350 kg CO2e per month / 87.5 kg per week)
  const budget = 350; 
  const progressPercent = Math.min((totalEmitted / budget) * 100, 100);
  
  // Calculate percentage breakdown for categories
  const breakdown = {};
  if (totalEmitted > 0) {
    Object.keys(categoriesSum).forEach(cat => {
      breakdown[cat] = Math.round((categoriesSum[cat] / totalEmitted) * 100);
    });
  } else {
    Object.keys(categoriesSum).forEach(cat => breakdown[cat] = 0);
  }

  // Determine status color/text based on budget
  let statusClass = 'status-optimal';
  let statusText = 'Eco Champion (Within Budget)';
  let gaugeColor = 'var(--color-primary)';
  
  if (totalEmitted > budget) {
    statusClass = 'status-danger';
    statusText = 'Carbon Budget Exceeded';
    gaugeColor = 'var(--color-danger)';
  } else if (totalEmitted > budget * 0.75) {
    statusClass = 'status-warning';
    statusText = 'Approaching Budget Limit';
    gaugeColor = 'var(--color-warning)';
  }

  // Circular gauge math (radius = 90, circumference = 2 * PI * r = 565.48)
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Active challenges details
  const activeChallengesList = challenges.filter(c => activeChallenges.includes(c.id));

  // Determine rank based on completed challenges and savings
  let userRank = 'Eco Novice';
  if (totalSaved > 200 || completedChallenges.length >= 6) {
    userRank = 'Green Guardian';
  } else if (totalSaved > 80 || completedChallenges.length >= 3) {
    userRank = 'Carbon Reducer';
  } else if (totalSaved > 20 || completedChallenges.length >= 1) {
    userRank = 'Eco Conscious';
  }

  return (
    <div className="dashboard-view">
      <div className="header-container">
        <div>
          <h1 className="welcome-title">My Eco-Dashboard</h1>
          <p className="welcome-subtitle">Track, analyze, and offset your carbon footprint.</p>
        </div>
        <div className="date-badge">
          <Leaf size={16} className="logo-icon" />
          <span>Tracking Period: This Month</span>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid-3">
        <div className="glass-panel stat-card">
          <div>
            <span className="stat-label">Carbon Emitted</span>
            <div className="stat-value">{totalEmitted.toFixed(1)} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>kg</span></div>
          </div>
          <div className="stat-icon-wrapper amber">
            <Flame size={24} />
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div>
            <span className="stat-label">Carbon Saved</span>
            <div className="stat-value">{totalSaved.toFixed(1)} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>kg</span></div>
          </div>
          <div className="stat-icon-wrapper emerald">
            <Leaf size={24} />
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div>
            <span className="stat-label">Eco Rank</span>
            <div className="stat-value" style={{ fontSize: '1.4rem', marginTop: '0.8rem' }}>{userRank}</div>
          </div>
          <div className="stat-icon-wrapper cyan">
            <Award size={24} />
          </div>
        </div>
      </div>

      {/* Main Analysis Panels */}
      <div className="grid-1-2">
        {/* Left Side: Circular Budget Gauge */}
        <div className="glass-panel card-content flex-center" style={{ flexDirection: 'column' }}>
          <h3 className="card-title" style={{ width: '100%', justifyContent: 'flex-start' }}>
            <Target size={18} className="logo-icon" /> Monthly Target
          </h3>
          <div 
            className="gauge-container"
            role="img"
            aria-label={`Carbon budget status: ${totalEmitted.toFixed(0)} kg CO₂e emitted out of a monthly budget of ${budget} kg.`}
          >
            <div className="gauge-svg-wrapper">
              <svg className="gauge-svg" aria-hidden="true">
                <title>Carbon Budget Utilization Gauge</title>
                <circle 
                  className="gauge-bg" 
                  cx="110" 
                  cy="110" 
                  r={radius} 
                />
                <circle 
                  className="gauge-fill" 
                  cx="110" 
                  cy="110" 
                  r={radius} 
                  stroke={gaugeColor}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <div className="gauge-text-overlay" aria-hidden="true">
                <div className="gauge-val">{totalEmitted.toFixed(0)}</div>
                <div className="gauge-unit">kg CO₂e</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Budget: {budget} kg
                </div>
              </div>
            </div>
            <div className={`gauge-status ${statusClass}`}>
              {statusText}
            </div>
          </div>
        </div>

        {/* Right Side: Category Breakdown */}
        <div className="glass-panel card-content">
          <h3 className="card-title">
            <TrendingUp size={18} className="logo-icon" /> Emissions Breakdown
          </h3>
          <div className="category-list">
            {/* Transport */}
            <div className="category-item">
              <div className="category-meta">
                <span className="category-name">
                  <Car size={16} style={{ color: 'var(--color-secondary)' }} /> Transportation
                </span>
                <span className="category-percentage">
                  {categoriesSum.transport.toFixed(1)} kg ({breakdown.transport || 0}%)
                </span>
              </div>
              <div className="progress-track">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${breakdown.transport || 0}%`, 
                    backgroundColor: 'var(--color-secondary)' 
                  }}
                ></div>
              </div>
            </div>

            {/* Energy */}
            <div className="category-item">
              <div className="category-meta">
                <span className="category-name">
                  <Zap size={16} style={{ color: 'var(--color-warning)' }} /> Home Energy
                </span>
                <span className="category-percentage">
                  {categoriesSum.energy.toFixed(1)} kg ({breakdown.energy || 0}%)
                </span>
              </div>
              <div className="progress-track">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${breakdown.energy || 0}%`, 
                    backgroundColor: 'var(--color-warning)' 
                  }}
                ></div>
              </div>
            </div>

            {/* Food */}
            <div className="category-item">
              <div className="category-meta">
                <span className="category-name">
                  <Utensils size={16} style={{ color: 'var(--color-primary)' }} /> Diet & Food
                </span>
                <span className="category-percentage">
                  {categoriesSum.food.toFixed(1)} kg ({breakdown.food || 0}%)
                </span>
              </div>
              <div className="progress-track">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${breakdown.food || 0}%`, 
                    backgroundColor: 'var(--color-primary)' 
                  }}
                ></div>
              </div>
            </div>

            {/* Shopping */}
            <div className="category-item">
              <div className="category-meta">
                <span className="category-name">
                  <ShoppingBag size={16} style={{ color: 'var(--color-accent)' }} /> Shopping & Waste
                </span>
                <span className="category-percentage">
                  {categoriesSum.shopping.toFixed(1)} kg ({breakdown.shopping || 0}%)
                </span>
              </div>
              <div className="progress-track">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${breakdown.shopping || 0}%`, 
                    backgroundColor: 'var(--color-accent)' 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Challenges list */}
      <div className="glass-panel card-content" style={{ marginTop: '1.5rem' }}>
        <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
          <h3 className="card-title" style={{ margin: 0 }}>
            <CheckCircle size={18} className="logo-icon" /> Active Green Goals ({activeChallengesList.length})
          </h3>
          <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} onClick={() => setPage('insights')}>
            Browse Challenges
          </button>
        </div>
        {activeChallengesList.length > 0 ? (
          <div className="challenge-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
            {activeChallengesList.map(c => (
              <div key={c.id} className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.01)', borderStyle: 'dashed' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{c.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', height: '40px', overflow: 'hidden' }}>{c.description}</p>
                <div className="flex-between" style={{ marginTop: '0.75rem', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Save {c.co2Savings} kg</span>
                  <span style={{ color: 'var(--text-muted)' }}>{c.difficulty}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ padding: '2rem 1rem' }}>
            <Leaf size={32} className="empty-icon" style={{ opacity: 0.5 }} />
            <p style={{ fontSize: '0.9rem' }}>No active challenges! Taking a challenge helps you target areas of high emissions.</p>
          </div>
        )}
      </div>
    </div>
  );
}
