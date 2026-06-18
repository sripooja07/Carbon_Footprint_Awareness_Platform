import React, { useMemo } from 'react';
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
  CheckCircle
} from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';

export default function Dashboard({ logs, activeChallenges, completedChallenges, challenges, setPage }) {
  
  // Memoize emissions sums grouped by category
  const categoriesSum = useMemo(() => {
    return logs.reduce((acc, log) => {
      const cat = log.category;
      if (!acc[cat]) acc[cat] = 0;
      acc[cat] += log.co2;
      return acc;
    }, { transport: 0, energy: 0, food: 0, shopping: 0 });
  }, [logs]);

  // Memoize total carbon emitted
  const totalEmitted = useMemo(() => {
    return Object.values(categoriesSum).reduce((sum, val) => sum + val, 0);
  }, [categoriesSum]);

  // Memoize total offset savings
  const totalSaved = useMemo(() => {
    return completedChallenges.reduce((sum, id) => {
      const ch = challenges.find(c => c.id === id);
      return sum + (ch ? ch.co2Savings : 0);
    }, 0);
  }, [completedChallenges, challenges]);

  // Carbon budget target (350 kg CO2e per month)
  const budget = 350; 
  
  // Memoize progress fraction
  const progressPercent = useMemo(() => {
    return Math.min((totalEmitted / budget) * 100, 100);
  }, [totalEmitted, budget]);
  
  // Memoize category percentage breakdown
  const breakdown = useMemo(() => {
    const br = {};
    if (totalEmitted > 0) {
      Object.keys(categoriesSum).forEach(cat => {
        br[cat] = Math.round((categoriesSum[cat] / totalEmitted) * 100);
      });
    } else {
      Object.keys(categoriesSum).forEach(cat => br[cat] = 0);
    }
    return br;
  }, [categoriesSum, totalEmitted]);

  // Memoize budget warnings status and gauge accent colors
  const statusInfo = useMemo(() => {
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
    return { statusClass, statusText, gaugeColor };
  }, [totalEmitted, budget]);

  // Circular gauge geometry math (radius = 90, circumference = 2 * PI * r = 565.48)
  const radius = 90;
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);
  const strokeDashoffset = useMemo(() => {
    return circumference - (progressPercent / 100) * circumference;
  }, [progressPercent, circumference]);

  // Memoize active challenges details list
  const activeChallengesList = useMemo(() => {
    return challenges.filter(c => activeChallenges.includes(c.id));
  }, [challenges, activeChallenges]);

  // Memoize user ranking title based on progress metrics
  const userRank = useMemo(() => {
    let rank = 'Eco Novice';
    if (totalSaved > 200 || completedChallenges.length >= 6) {
      rank = 'Green Guardian';
    } else if (totalSaved > 80 || completedChallenges.length >= 3) {
      rank = 'Carbon Reducer';
    } else if (totalSaved > 20 || completedChallenges.length >= 1) {
      rank = 'Eco Conscious';
    }
    return rank;
  }, [totalSaved, completedChallenges]);

  return (
    <div className="dashboard-view">
      <div className="header-container">
        <div>
          <h1 className="welcome-title">My Eco-Dashboard</h1>
          <p className="welcome-subtitle">Track, analyze, and offset your carbon footprint.</p>
        </div>
        <div className="date-badge" role="presentation">
          <Leaf size={16} className="logo-icon" aria-hidden="true" />
          <span>Tracking Period: This Month</span>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid-3">
        <Card className="stat-card" data-testid="emitted-card">
          <div>
            <span className="stat-label">Carbon Emitted</span>
            <div className="stat-value">{totalEmitted.toFixed(1)} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>kg</span></div>
          </div>
          <div className="stat-icon-wrapper amber" aria-hidden="true">
            <Flame size={24} />
          </div>
        </Card>

        <Card className="stat-card" data-testid="saved-card">
          <div>
            <span className="stat-label">Carbon Saved</span>
            <div className="stat-value">{totalSaved.toFixed(1)} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>kg</span></div>
          </div>
          <div className="stat-icon-wrapper emerald" aria-hidden="true">
            <Leaf size={24} />
          </div>
        </Card>

        <Card className="stat-card" data-testid="rank-card">
          <div>
            <span className="stat-label">Eco Rank</span>
            <div className="stat-value" style={{ fontSize: '1.4rem', marginTop: '0.8rem' }}>{userRank}</div>
          </div>
          <div className="stat-icon-wrapper cyan" aria-hidden="true">
            <Award size={24} />
          </div>
        </Card>
      </div>

      {/* Main Analysis Panels */}
      <div className="grid-1-2">
        {/* Left Side: Circular Budget Gauge */}
        <Card 
          title="Monthly Target" 
          icon={<Target size={18} />} 
          className="flex-center" 
          style={{ flexDirection: 'column' }}
          data-testid="target-card"
        >
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
                  stroke={statusInfo.gaugeColor}
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
            <div className={`gauge-status ${statusInfo.statusClass}`}>
              {statusInfo.statusText}
            </div>
          </div>
        </Card>

        {/* Right Side: Category Breakdown */}
        <Card title="Emissions Breakdown" icon={<TrendingUp size={18} />} data-testid="breakdown-card">
          <div className="category-list">
            {/* Transport */}
            <div className="category-item">
              <div className="category-meta">
                <span className="category-name">
                  <Car size={16} style={{ color: 'var(--color-secondary)' }} aria-hidden="true" /> Transportation
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
                  <Zap size={16} style={{ color: 'var(--color-warning)' }} aria-hidden="true" /> Home Energy
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
                  <Utensils size={16} style={{ color: 'var(--color-primary)' }} aria-hidden="true" /> Diet & Food
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
                  <ShoppingBag size={16} style={{ color: 'var(--color-accent)' }} aria-hidden="true" /> Shopping & Waste
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
        </Card>
      </div>

      {/* Active Challenges list */}
      <Card 
        title={`Active Green Goals (${activeChallengesList.length})`}
        icon={<CheckCircle size={18} />}
        action={
          <Button 
            variant="secondary" 
            style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} 
            onClick={() => setPage('insights')}
            ariaLabel="Browse all challenges"
          >
            Browse Challenges
          </Button>
        }
        style={{ marginTop: '1.5rem' }}
        data-testid="active-challenges-card"
      >
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
            <Leaf size={32} className="empty-icon" style={{ opacity: 0.5 }} aria-hidden="true" />
            <p style={{ fontSize: '0.9rem' }}>No active challenges! Taking a challenge helps you target areas of high emissions.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
