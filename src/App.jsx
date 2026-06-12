import React, { useState, useEffect } from 'react';
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
import Dashboard from './components/Dashboard';
import Calculator from './components/Calculator';
import Recommendations from './components/Recommendations';
import HistoryLog from './components/HistoryLog';
import { CHALLENGES } from './utils/carbonCalculations';

// Mock seed data for the first visit to "wow" the user immediately
const SEED_LOGS = [
  {
    id: 'seed_log_1',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days ago
    category: 'transport',
    type: 'car_petrol',
    amount: 150,
    co2: 25.5, // 150km * 0.17
    details: '150 km via Petrol Car (Weekend trip)'
  },
  {
    id: 'seed_log_2',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days ago
    category: 'energy',
    type: 'electricity_grid',
    amount: 120,
    co2: 49.2, // 120 kWh * 0.41
    details: '120 kWh of Grid Electricity (Utility estimate)'
  },
  {
    id: 'seed_log_3',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 day ago
    category: 'food',
    type: 'medium_meat',
    amount: 7,
    co2: 39.4, // 7 days * 5.63
    details: '7 days of Medium Meat-eater Diet'
  },
  {
    id: 'seed_log_4',
    date: new Date().toISOString().split('T')[0], // today
    category: 'shopping',
    type: 'clothing_item',
    amount: 1,
    co2: 12.5, // 1 item * 12.5
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
    return saved ? JSON.parse(saved) : ['challenge_meatless']; // Seed one active challenge
  });

  const [completedChallenges, setCompletedChallenges] = useState(() => {
    const saved = localStorage.getItem('eco_completed_challenges');
    return saved ? JSON.parse(saved) : [];
  });

  // Save changes to local storage
  useEffect(() => {
    localStorage.setItem('eco_carbon_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('eco_active_challenges', JSON.stringify(activeChallenges));
  }, [activeChallenges]);

  useEffect(() => {
    localStorage.setItem('eco_completed_challenges', JSON.stringify(completedChallenges));
  }, [completedChallenges]);

  // Log handlers
  const handleAddLog = (newLog) => {
    setLogs(prev => [newLog, ...prev]);
  };

  const handleDeleteLog = (id) => {
    setLogs(prev => prev.filter(log => log.id !== id));
  };

  // Challenge handlers
  const handleAcceptChallenge = (id) => {
    if (!activeChallenges.includes(id)) {
      setActiveChallenges(prev => [...prev, id]);
    }
  };

  const handleCompleteChallenge = (id) => {
    const challenge = CHALLENGES.find(c => c.id === id);
    if (!challenge) return;

    // Remove from active
    setActiveChallenges(prev => prev.filter(cId => cId !== id));
    
    // Add to completed if not already there
    if (!completedChallenges.includes(id)) {
      setCompletedChallenges(prev => [...prev, id]);
      
      // Log an offset entry (negative emission) into the carbon ledger
      const offsetLog = {
        id: `offset_${id}_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        category: challenge.category,
        co2: -challenge.co2Savings, // Carbon offset savings
        type: 'offset',
        details: `Offset: Completed '${challenge.title}' challenge`
      };
      handleAddLog(offsetLog);
    }
  };

  const handleCancelChallenge = (id) => {
    setActiveChallenges(prev => prev.filter(cId => cId !== id));
  };

  // Get total carbon offset savings for sidebar
  const totalOffsetSavings = completedChallenges.reduce((sum, id) => {
    const ch = CHALLENGES.find(c => c.id === id);
    return sum + (ch ? ch.co2Savings : 0);
  }, 0);

  const handleNavigate = (pageId) => {
    setPage(pageId);
    setSidebarOpen(false);
  };

  return (
    <div className="app-container">
      {/* Mobile Header Banner */}
      <header className="mobile-header">
        <div className="logo-section" style={{ margin: 0 }}>
          <Leaf className="logo-icon" size={24} />
          <span className="logo-text">EcoFootprint</span>
        </div>
        <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="logo-section">
          <Leaf className="logo-icon" size={32} />
          <span className="logo-text">EcoFootprint</span>
        </div>

        <nav style={{ flex: 1 }}>
          <ul className="nav-links">
            <li>
              <button 
                type="button"
                className={`nav-item ${page === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleNavigate('dashboard')}
              >
                <LayoutDashboard className="nav-icon" size={20} />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button 
                type="button"
                className={`nav-item ${page === 'track' ? 'active' : ''}`}
                onClick={() => handleNavigate('track')}
              >
                <PlusCircle className="nav-icon" size={20} />
                <span>Track Emissions</span>
              </button>
            </li>
            <li>
              <button 
                type="button"
                className={`nav-item ${page === 'insights' ? 'active' : ''}`}
                onClick={() => handleNavigate('insights')}
              >
                <Award className="nav-icon" size={20} />
                <span>Challenges & Tips</span>
              </button>
            </li>
            <li>
              <button 
                type="button"
                className={`nav-item ${page === 'history' ? 'active' : ''}`}
                onClick={() => handleNavigate('history')}
              >
                <Clock className="nav-icon" size={20} />
                <span>Log History</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-badge">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-info">
              <h4>Eco Tracker</h4>
              <p>Saved: {totalOffsetSavings.toFixed(0)} kg CO₂e</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
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
      </main>
    </div>
  );
}
