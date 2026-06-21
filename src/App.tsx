import React, { useState, useCallback, Suspense } from 'react';
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
import { useCarbonTracker } from './hooks/useCarbonTracker';

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

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Use core business logic custom hook
  const {
    logs,
    activeChallenges,
    completedChallenges,
    totalOffsetSavings,
    addLog,
    deleteLog,
    acceptChallenge,
    completeChallenge,
    cancelChallenge
  } = useCarbonTracker();

  const handleNavigate = useCallback((pageId: string) => {
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
              onAddLog={addLog} 
            />
          )}

          {page === 'insights' && (
            <Recommendations 
              logs={logs}
              activeChallenges={activeChallenges}
              completedChallenges={completedChallenges}
              challenges={CHALLENGES}
              onAcceptChallenge={acceptChallenge}
              onCompleteChallenge={completeChallenge}
              onCancelChallenge={cancelChallenge}
            />
          )}

          {page === 'history' && (
            <HistoryLog 
              logs={logs} 
              onDeleteLog={deleteLog} 
            />
          )}
        </Suspense>
      </main>
    </div>
  );
}
