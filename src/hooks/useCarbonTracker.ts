import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { LogEntry, Challenge } from '../types';
import { CHALLENGES } from '../utils/carbonCalculations';

// Mock seed data for fresh installations
const SEED_LOGS: LogEntry[] = [
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

export function useCarbonTracker() {
  const [logs, setLogs] = useLocalStorage<LogEntry[]>('eco_carbon_logs', SEED_LOGS);
  const [activeChallenges, setActiveChallenges] = useLocalStorage<string[]>('eco_active_challenges', ['challenge_meatless']);
  const [completedChallenges, setCompletedChallenges] = useLocalStorage<string[]>('eco_completed_challenges', []);

  // Strict regex sanitizer to prevent XSS script tags and bad input formats
  const sanitizeLogInput = useCallback((log: Partial<LogEntry>): LogEntry => {
    const safeId = String(log.id || 'log_' + Date.now()).replace(/[^\w-]/g, '');
    const safeDate = String(log.date || '').match(/^\d{4}-\d{2}-\d{2}$/) 
      ? String(log.date) 
      : new Date().toISOString().split('T')[0];
    
    const inputCategory = String(log.category);
    const safeCategory = ['transport', 'energy', 'food', 'shopping'].includes(inputCategory) 
      ? (inputCategory as LogEntry['category']) 
      : 'transport';
    
    const safeCo2 = typeof log.co2 === 'number' && !isNaN(log.co2) ? Number(log.co2.toFixed(4)) : 0;
    const safeType = String(log.type || '').replace(/[^\w-]/g, '');
    const safeDetails = String(log.details || '').replace(/[<>]/g, ''); // neutralize tags
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

  // Handler callbacks
  const addLog = useCallback((rawLog: Partial<LogEntry>) => {
    const cleanLog = sanitizeLogInput(rawLog);
    setLogs(prev => [cleanLog, ...prev]);
  }, [sanitizeLogInput, setLogs]);

  const deleteLog = useCallback((id: string) => {
    const safeId = String(id).replace(/[^\w-]/g, '');
    setLogs(prev => prev.filter(log => log.id !== safeId));
  }, [setLogs]);

  const acceptChallenge = useCallback((id: string) => {
    const safeId = String(id).replace(/[^\w-]/g, '');
    setActiveChallenges(prev => {
      if (!prev.includes(safeId)) {
        return [...prev, safeId];
      }
      return prev;
    });
  }, [setActiveChallenges]);

  const completeChallenge = useCallback((id: string) => {
    const safeId = String(id).replace(/[^\w-]/g, '');
    const challenge = CHALLENGES.find(c => c.id === safeId);
    if (!challenge) return;

    setActiveChallenges(prev => prev.filter(cId => cId !== safeId));
    
    setCompletedChallenges(prev => {
      if (!prev.includes(safeId)) {
        const offsetLog: Partial<LogEntry> = {
          id: `offset_${safeId}_${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          category: challenge.category,
          co2: -challenge.co2Savings,
          type: 'offset',
          details: `Offset: Completed '${challenge.title}' challenge`,
          amount: 1
        };
        addLog(offsetLog);
        return [...prev, safeId];
      }
      return prev;
    });
  }, [addLog, setActiveChallenges, setCompletedChallenges]);

  const cancelChallenge = useCallback((id: string) => {
    const safeId = String(id).replace(/[^\w-]/g, '');
    setActiveChallenges(prev => prev.filter(cId => cId !== safeId));
  }, [setActiveChallenges]);

  // Memoized total carbon saved calculations
  const totalOffsetSavings = useMemo(() => {
    return completedChallenges.reduce((sum, id) => {
      const ch = CHALLENGES.find(c => c.id === id);
      return sum + (ch ? ch.co2Savings : 0);
    }, 0);
  }, [completedChallenges]);

  return {
    logs,
    activeChallenges,
    completedChallenges,
    totalOffsetSavings,
    addLog,
    deleteLog,
    acceptChallenge,
    completeChallenge,
    cancelChallenge
  };
}
