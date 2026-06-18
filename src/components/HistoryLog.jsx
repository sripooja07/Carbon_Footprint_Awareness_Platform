import React, { useMemo } from 'react';
import { 
  Trash2, 
  Car, 
  Zap, 
  Utensils, 
  ShoppingBag, 
  TrendingUp, 
  Info,
  Clock
} from 'lucide-react';
import { getLabel } from '../utils/carbonCalculations';
import Card from './ui/Card';
import Button from './ui/Button';

export default function HistoryLog({ logs, onDeleteLog }) {
  
  // Memoize sorted logs (descending chronological order)
  const sortedLogs = useMemo(() => {
    return [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [logs]);

  // Category Utilities
  const categoryConfig = {
    transport: { icon: <Car size={16} aria-hidden="true" />, color: 'var(--color-secondary)', bg: 'rgba(6, 182, 212, 0.1)' },
    energy: { icon: <Zap size={16} aria-hidden="true" />, color: 'var(--color-warning)', bg: 'rgba(245, 158, 11, 0.1)' },
    food: { icon: <Utensils size={16} aria-hidden="true" />, color: 'var(--color-primary)', bg: 'rgba(16, 185, 129, 0.1)' },
    shopping: { icon: <ShoppingBag size={16} aria-hidden="true" />, color: 'var(--color-accent)', bg: 'rgba(139, 92, 246, 0.1)' }
  };

  // Memoize vector SVG chart path coordinates and metrics calculations
  const chart = useMemo(() => {
    if (logs.length === 0) return { path: '', area: '', points: [], dates: [] };

    // Group net CO2 emissions by date
    const grouped = logs.reduce((acc, log) => {
      acc[log.date] = (acc[log.date] || 0) + log.co2;
      return acc;
    }, {});

    // Sort dates chronologically and take the last 7 logging dates
    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b)).slice(-7);
    const values = sortedDates.map(date => grouped[date]);
    
    if (sortedDates.length === 0) return { path: '', area: '', points: [], dates: [] };

    // SVG Canvas Dimensions
    const width = 600;
    const height = 150;
    const padding = 25;
    
    const maxVal = Math.max(...values, 10); // Minimum scale height is 10kg
    const minVal = 0;
    const range = maxVal - minVal;

    // Map each data point to canvas coordinate systems
    const points = sortedDates.map((date, idx) => {
      const x = padding + (idx / Math.max(sortedDates.length - 1, 1)) * (width - 2 * padding);
      // Invert Y axis for SVG rendering
      const y = height - padding - ((grouped[date] - minVal) / range) * (height - 2 * padding);
      return { x, y, value: grouped[date], date };
    });

    let linePath = '';
    let areaPath = '';

    if (points.length > 0) {
      linePath = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        linePath += ` L ${points[i].x} ${points[i].y}`;
      }

      // Close path loop to fill area gradient
      areaPath = linePath;
      areaPath += ` L ${points[points.length - 1].x} ${height - padding}`;
      areaPath += ` L ${points[0].x} ${height - padding} Z`;
    }

    return { path: linePath, area: areaPath, points, dates: sortedDates };
  }, [logs]);

  return (
    <div className="history-view">
      <div className="header-container">
        <div>
          <h1 className="welcome-title">Log History</h1>
          <p className="welcome-subtitle">Review previous entries and view weekly emission trends.</p>
        </div>
      </div>

      {/* Custom Trend Chart */}
      <Card 
        title="Weekly Emissions Trend" 
        icon={<TrendingUp size={18} />} 
        style={{ marginBottom: '2rem' }}
        data-testid="trend-card"
      >
        {logs.length > 1 && chart.points.length > 1 ? (
          <div>
            <div className="trend-chart-container">
              <svg viewBox="0 0 600 150" className="trend-svg" preserveAspectRatio="none" role="img" aria-label="Weekly carbon emissions trend graph showing your footprint over time.">
                <title>Weekly Carbon Emissions Trend Line Graph</title>
                <defs>
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="25" y1="25" x2="575" y2="25" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="25" y1="75" x2="575" y2="75" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="25" y1="125" x2="575" y2="125" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />

                {/* Area Gradient */}
                {chart.area && (
                  <path d={chart.area} fill="url(#chartGlow)" />
                )}

                {/* Trend Line */}
                {chart.path && (
                  <path 
                    d={chart.path} 
                    fill="none" 
                    stroke="var(--color-primary)" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.3))' }}
                  />
                )}

                {/* Hot Points */}
                {chart.points.map((p, idx) => (
                  <g key={idx}>
                    <circle 
                      cx={p.x} 
                      cy={p.y} 
                      r="5" 
                      fill="var(--bg-secondary)" 
                      stroke="var(--color-primary)" 
                      strokeWidth="2.5" 
                    />
                    <circle 
                      cx={p.x} 
                      cy={p.y} 
                      r="10" 
                      fill="var(--color-primary)" 
                      fillOpacity="0.1" 
                    />
                  </g>
                ))}
              </svg>
            </div>
            
            {/* X Axis Labels */}
            <div className="flex-between" style={{ padding: '0 10px', marginTop: '0.5rem' }}>
              {chart.points.map((p, idx) => {
                const formattedDate = new Date(p.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                return (
                  <div key={idx} style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{p.value.toFixed(1)} kg</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{formattedDate}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex-center" style={{ height: '150px', color: 'var(--text-muted)', fontSize: '0.9rem', flexDirection: 'column', gap: '0.5rem' }}>
            <Info size={24} aria-hidden="true" />
            <span>Need logs across multiple dates to render trend comparison.</span>
          </div>
        )}
      </Card>

      {/* Logs Table Card */}
      <Card title="Activity Log Ledger" icon={<Clock size={18} />} data-testid="ledger-card">
        {sortedLogs.length > 0 ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">Details</th>
                  <th scope="col">Date</th>
                  <th scope="col">Carbon CO₂e</th>
                  <th scope="col" style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedLogs.map(log => {
                  const config = categoryConfig[log.category] || { icon: <Info aria-hidden="true" />, color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.05)' };
                  return (
                    <tr key={log.id} data-testid={`log-row-${log.id}`}>
                      <td style={{ fontWeight: 600 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ 
                            color: config.color, 
                            backgroundColor: config.bg,
                            padding: '0.4rem',
                            borderRadius: '8px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {config.icon}
                          </span>
                          <span style={{ textTransform: 'capitalize' }}>{log.category}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{log.details}</td>
                      <td>{new Date(log.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                      <td style={{ fontWeight: 700, color: log.co2 < 0 ? 'var(--color-primary)' : 'var(--text-primary)' }}>
                        {log.co2 < 0 ? '' : '+'}{log.co2.toFixed(1)} kg
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <Button 
                          variant="secondary"
                          className="delete-btn" 
                          onClick={() => onDeleteLog(log.id)}
                          title="Delete Activity"
                          ariaLabel={`Delete activity: ${log.details}`}
                          data-testid={`delete-btn-${log.id}`}
                          style={{ minWidth: 'auto', padding: '0.4rem' }}
                        >
                          <Trash2 size={16} aria-hidden="true" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <Clock size={40} className="empty-icon" aria-hidden="true" />
            <h3>No activities logged yet</h3>
            <p style={{ marginTop: '0.25rem', fontSize: '0.85rem' }}>Your carbon ledger is currently empty. Activities logged under tracking will show up here.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
