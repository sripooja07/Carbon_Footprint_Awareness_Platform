import React from 'react';
import { 
  Award, 
  Compass, 
  Flame, 
  Leaf, 
  Zap, 
  Car, 
  Utensils, 
  ShoppingBag, 
  Check, 
  Calendar,
  ChevronRight,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';

export default function Recommendations({ 
  logs, 
  activeChallenges, 
  completedChallenges, 
  challenges, 
  onAcceptChallenge, 
  onCompleteChallenge, 
  onCancelChallenge 
}) {
  
  // Calculate category totals to generate dynamic insights
  const categoriesSum = logs.reduce((acc, log) => {
    acc[log.category] = (acc[log.category] || 0) + log.co2;
    return acc;
  }, { transport: 0, energy: 0, food: 0, shopping: 0 });

  const totalEmitted = Object.values(categoriesSum).reduce((sum, val) => sum + val, 0);

  // Find the highest emissions category
  let highestCategory = 'none';
  let highestValue = 0;
  Object.keys(categoriesSum).forEach(cat => {
    if (categoriesSum[cat] > highestValue) {
      highestValue = categoriesSum[cat];
      highestCategory = cat;
    }
  });

  // Category Icons & Color utilities
  const catDetails = {
    transport: { icon: <Car size={18} />, color: 'var(--color-secondary)', label: 'Transportation' },
    energy: { icon: <Zap size={18} />, color: 'var(--color-warning)', label: 'Home Energy' },
    food: { icon: <Utensils size={18} />, color: 'var(--color-primary)', label: 'Diet & Food' },
    shopping: { icon: <ShoppingBag size={18} />, color: 'var(--color-accent)', label: 'Shopping & Waste' },
    none: { icon: <Compass size={18} />, color: 'var(--color-primary)', label: 'Allround' }
  };

  // Generate dynamic warning card based on highest emission source
  const getDynamicInsight = () => {
    if (totalEmitted === 0) {
      return {
        title: "Start Tracking to Unlock Insights",
        desc: "Add logs on the 'Track' tab (flights, car commutes, utility usage) so we can analyze your habits and generate custom reduction actions.",
        type: 'info'
      };
    }
    
    switch (highestCategory) {
      case 'transport':
        return {
          title: "Transportation is your largest source of emissions",
          desc: `Your travel accounts for ${Math.round((highestValue/totalEmitted)*100)}% of your carbon footprint (${highestValue.toFixed(1)} kg). Consolidating car trips, carpooling, or replacing short trips (<2 km) with cycling or walking represents your fastest path to reduction.`,
          type: 'warning'
        };
      case 'energy':
        return {
          title: "Home Energy consumption is dominating your score",
          desc: `Energy usage makes up ${Math.round((highestValue/totalEmitted)*100)}% of your emissions (${highestValue.toFixed(1)} kg). Consider contacting your power provider for a green power tariff, washing clothes on cold water cycles, and checking for stand-by vampire power draw.`,
          type: 'warning'
        };
      case 'food':
        return {
          title: "Your Diet has the highest carbon contribution",
          desc: `Diet represents ${Math.round((highestValue/totalEmitted)*100)}% of your score (${highestValue.toFixed(1)} kg). Red meat (beef, lamb) has an impact up to 5x higher than chicken or fish, and 10x higher than plant-based proteins. Adopting a flexible vegetarian or vegan diet even a few days a week will sharply cut emissions.`,
          type: 'warning'
        };
      case 'shopping':
        return {
          title: "Shopping and Landfill waste are driving your footprint",
          desc: `Material items and waste represent ${Math.round((highestValue/totalEmitted)*100)}% of your footprint (${highestValue.toFixed(1)} kg). Manufacturing new apparel and electronics is carbon-heavy. Aim to prioritize quality secondhand items and recycle all metal, glass, and paper bags to divert waste from landfills.`,
          type: 'warning'
        };
      default:
        return {
          title: "Your footprint is balanced across categories",
          desc: "Great job maintaining a balanced profile! To push your footprint further down, explore the modular challenges below and see where you can trim numbers.",
          type: 'info'
        };
    }
  };

  const insight = getDynamicInsight();

  return (
    <div className="recommendations-view">
      <div className="header-container">
        <div>
          <h1 className="welcome-title">Personalized Insights</h1>
          <p className="welcome-subtitle">Tailored reduction recommendations and gamified carbon-saving challenges.</p>
        </div>
      </div>

      {/* Dynamic Recommendation Panel */}
      <div 
        className="glass-panel card-content" 
        style={{ 
          marginBottom: '2.5rem',
          borderLeft: `4px solid ${insight.type === 'warning' ? 'var(--color-warning)' : 'var(--color-primary)'}`,
          background: 'linear-gradient(135deg, rgba(20,27,54,0.7) 0%, rgba(20,27,54,0.4) 100%)'
        }}
      >
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
          <div style={{ 
            backgroundColor: insight.type === 'warning' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)', 
            color: insight.type === 'warning' ? 'var(--color-warning)' : 'var(--color-primary)', 
            padding: '0.85rem', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {insight.type === 'warning' ? <AlertTriangle size={24} /> : <Leaf size={24} />}
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{insight.title}</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: '1.6' }}>{insight.desc}</p>
          </div>
        </div>
      </div>

      {/* Challenges Section */}
      <h2 className="section-title">
        <Award size={20} className="logo-icon" /> Reduce Emission Challenges
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        Commit to sustainable challenges, lower your carbon footprint, and earn points for your carbon savings account.
      </p>

      <div className="challenge-grid">
        {challenges.map(c => {
          const isActive = activeChallenges.includes(c.id);
          const isCompleted = completedChallenges.includes(c.id);
          const detail = catDetails[c.category] || catDetails.none;

          return (
            <div key={c.id} className="glass-panel challenge-card">
              <span className={`challenge-badge ${c.difficulty.toLowerCase()}`}>
                {c.difficulty}
              </span>

              <div>
                <span 
                  style={{ 
                    color: detail.color, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.4rem', 
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  {detail.icon} {detail.label}
                </span>
                
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '0.5rem', color: 'var(--text-primary)' }}>
                  {c.title}
                </h3>
                
                <div className="challenge-saving">
                  <TrendingDown size={16} /> Save {c.co2Savings} kg CO₂e
                </div>

                <p className="challenge-desc">
                  {c.description}
                </p>
              </div>

              <div className="challenge-meta-row">
                <span className="challenge-duration">
                  <Calendar size={14} /> {c.duration}
                </span>

                {isCompleted ? (
                  <span style={{ 
                    color: 'var(--color-primary)', 
                    fontWeight: 700, 
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    background: 'rgba(16,185,129,0.1)',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '20px'
                  }}>
                    <Check size={14} /> Completed
                  </span>
                ) : isActive ? (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '8px' }}
                      onClick={() => onCancelChallenge(c.id)}
                    >
                      Quit
                    </button>
                    <button 
                      className="btn btn-primary" 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '8px' }}
                      onClick={() => onCompleteChallenge(c.id)}
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <button 
                    className="btn btn-secondary" 
                    style={{ 
                      padding: '0.4rem 0.8rem', 
                      fontSize: '0.8rem', 
                      borderRadius: '8px', 
                      borderColor: 'rgba(16, 185, 129, 0.3)',
                      color: 'var(--color-primary)'
                    }}
                    onClick={() => onAcceptChallenge(c.id)}
                  >
                    Accept
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
