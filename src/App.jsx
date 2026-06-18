import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { 
  Leaf, 
  LayoutDashboard, 
  PlusCircle, 
  Award, 
  Clock, 
  Menu, 
  X, 
  User 
} from 'lucide-react';
import { CHALLENGES } from './utils/carbonCalculations';

// Lazy load feature components for optimal bundle chunking
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const Calculator = React.lazy(() => import('./components/Calculator'));
const Recommendations = React.lazy(() => import('./components/Recommendations'));
const HistoryLog = React.lazy(() => import('./components/HistoryLog'));

// Fallback loader component for lazy suspended panels
function ViewLoader() {
  return (
    <div className="flex-center" style={{ height: '350px', flexDirection: 'column', gap: '1rem' }} role="status">
      <Leaf size={40} className="logo-icon" style={{ animation: 'spin 2s linear infinite' }} />
      <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Defying gravity... Loading dashboard</span>
    </div>
  );
}

// Mock seed data to showcase features instantly on first load
const SEED_LOGS = [
  {
    id: 'seed_log_1',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    category: 'transport',
    type: 'car_petrol',
    amount: 150,
    co2: 25.5,
    details: '150 km via Petrol Car (Weekend trip)'
  },
  {
    id: 'seed_log_2',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    category: 'energy',
    type: 'electricity_grid',
    amount: 120,
    co2: 49.2,
    details: '120 kWh of Grid Electricity (Utility estimate)'
  },
  {
    id: 'seed_log_3',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    category: 'food',
    type: 'medium_meat',
    amount: 7,
    co2: 39.4,
    details: '7 days of Medium Meat-eater Diet'
  },
  {
    id: 'seed_log_4',
    date: new Date().toISOString().split('T')[0],
    category: 'shopping',
    type: 'clothing_item',
    amount: 1,
    co2: 12.5,
    details: '1x New Clothing Items'
  }
];

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // State variables with localStorage loading
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('eco_carbon_logs');
    return saved ? JSON.parse(saved) : SEED_LOGS;
  });

  const [activeChallenges, setActiveChallenges] = useState(() => {
    const saved = localStorage.getItem('eco_active_challenges');
    return saved ? JSON.parse(saved) : ['challenge_meatless'];
  });

  const [completedChallenges, setCompletedChallenges] = useState(() => {
    const saved = localStorage.getItem('eco_completed_challenges');
    return saved ? JSON.parse(saved) : [];
  });

  // LocalStorage Syncing
  useEffect(() => {
    localStorage.setItem('eco_carbon_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('eco_active_challenges', JSON.stringify(activeChallenges));
  }, [activeChallenges]);

  useEffect(() => {
    localStorage.setItem('eco_completed_challenges', JSON.stringify(completedChallenges));
  }, [completedChallenges]);

  // Input Sanitizer to block XSS and malicious characters
  const sanitizeLogInput = useCallback((log) => {
    const safeId = String(log.id).replace(/[^\w-]/g, '');
    const safeDate = String(log.date).match(/^\d{4}-\d{2}-\d{2}$/) ? log.date : new Date().toISOString().split('T')[0];
    const safeCategory = ['transport', 'energy', 'food', 'shopping'].includes(log.category) ? log.category : 'transport';
    const safeCo2 = typeof log.co2 === 'number' && !isNaN(log.co2) ? Number(log.co2.toFixed(4)) : 0;
    const safeType = String(log.type || '').replace(/[^\w-]/g, '');
    const safeDetails = String(log.details || '').replace(/[<>]/g, ''); // strip script brackets
    const safeAmount = typeof log.amount === 'number' && !isNaN(log.amount) ? Number(log.amount.toFixed(2)) : 0;

    return {
      id: safeId,
      date: safeDate,
      category: safeCategory,
      co2: safeCo2,
      type: safeType,
      details: safeDetails,
      amount: safeAmount
    };
  }, []);

  // Log handlers with callbacks to prevent child component re-renders
  const handleAddLog = useCallback((rawLog) => {
    const cleanLog = sanitizeLogInput(rawLog);
    setLogs(prev => [cleanLog, ...prev]);
  }, [sanitizeLogInput]);

  const handleDeleteLog = useCallback((id) => {
    const safeId = String(id).replace(/[^\w-]/g, '');
    setLogs(prev => prev.filter(log => log.id !== safeId));
  }, []);

  // Challenge handlers
  const handleAcceptChallenge = useCallback((id) => {
    const safeId = String(id).replace(/[^\w-]/g, '');
    setActiveChallenges(prev => {
      if (!prev.includes(safeId)) {
        return [...prev, safeId];
      }
      return prev;
    });
  }, []);

  const handleCompleteChallenge = useCallback((id) => {
    const safeId = String(id).replace(/[^\w-]/g, '');
    const challenge = CHALLENGES.find(c => c.id === safeId);
    if (!challenge) return;

    setActiveChallenges(prev => prev.filter(cId => cId !== safeId));
    
    setCompletedChallenges(prev => {
      if (!prev.includes(safeId)) {
        const offsetLog = {
          id: `offset_${safeId}_${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          category: challenge.category,
          co2: -challenge.co2Savings,
          type: 'offset',
          details: `Offset: Completed '${challenge.title}' challenge`
        };
        // Add direct log
        handleAddLog(offsetLog);
        return [...prev, safeId];
      }
      return prev;
    });
  }, [handleAddLog]);

  const handleCancelChallenge = useCallback((id) => {
    const safeId = String(id).replace(/[^\w-]/g, '');
    setActiveChallenges(prev => prev.filter(cId => cId !== safeId));
  }, []);

  // Memoized total carbon offset calculations
  const totalOffsetSavings = useMemo(() => {
    return completedChallenges.reduce((sum, id) => {
      const ch = CHALLENGES.find(c => c.id === id);
      return sum + (ch ? ch.co2Savings : 0);
    }, 0);
  }, [completedChallenges]);

  const handleNavigate = useCallback((pageId) => {
    setPage(pageId);
    setSidebarOpen(false);
  }, []);

  return (
    <div className="app-container">
      {/* Mobile Header Banner */}
      <header className="mobile-header">
        <div className="logo-section" style={{ margin: 0 }}>
          <Leaf className="logo-icon" size={24} aria-hidden="true" />
          <span className="logo-text">Eco Friendly Tracker</span>
        </div>
        <button 
          className="menu-toggle" 
          onClick={() => setSidebarOpen(prev => !prev)} 
          aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="logo-section">
          <Leaf className="logo-icon" size={32} aria-hidden="true" style={{ filter: 'drop-shadow(0 0 8px var(--color-primary))' }} />
          <span className="logo-text">Eco Friendly Tracker</span>
        </div>

        <nav aria-label="Sidebar navigation" style={{ flex: 1 }}>
          <ul className="nav-links">
            <li>
              <button 
                type="button"
                className={`nav-item ${page === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleNavigate('dashboard')}
              >
                <LayoutDashboard className="nav-icon" size={20} aria-hidden="true" />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button 
                type="button"
                className={`nav-item ${page === 'track' ? 'active' : ''}`}
                onClick={() => handleNavigate('track')}
              >
                <PlusCircle className="nav-icon" size={20} aria-hidden="true" />
                <span>Track Emissions</span>
              </button>
            </li>
            <li>
              <button 
                type="button"
                className={`nav-item ${page === 'insights' ? 'active' : ''}`}
                onClick={() => handleNavigate('insights')}
              >
                <Award className="nav-icon" size={20} aria-hidden="true" />
                <span>Challenges & Tips</span>
              </button>
            </li>
            <li>
              <button 
                type="button"
                className={`nav-item ${page === 'history' ? 'active' : ''}`}
                onClick={() => handleNavigate('history')}
              >
                <Clock className="nav-icon" size={20} aria-hidden="true" />
                <span>Log History</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-badge" aria-label="User carbon offset account">
            <div className="user-avatar" aria-hidden="true">
              <User size={20} />
            </div>
            <div className="user-info">
              <h4>Eco Friendly Tracker</h4>
              <p>Offset: {totalOffsetSavings.toFixed(0)} kg CO₂e</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content" id="main-content-area">
        <Suspense fallback={<ViewLoader />}>
          {page === 'dashboard' && (
            <Dashboard 
              logs={logs} 
              activeChallenges={activeChallenges} 
              completedChallenges={completedChallenges} 
              challenges={CHALLENGES} 
              setPage={handleNavigate}
            />
          )}
          
          {page === 'track' && (
            <Calculator 
              onAddLog={handleAddLog} 
            />
          )}

          {page === 'insights' && (
            <Recommendations 
              logs={logs}
              activeChallenges={activeChallenges}
              completedChallenges={completedChallenges}
              challenges={CHALLENGES}
              onAcceptChallenge={handleAcceptChallenge}
              onCompleteChallenge={handleCompleteChallenge}
              onCancelChallenge={handleCancelChallenge}
            />
          )}

          {page === 'history' && (
            <HistoryLog 
              logs={logs} 
              onDeleteLog={handleDeleteLog} 
            />
          )}
        </Suspense>
      </main>
    </div>
  );
}

