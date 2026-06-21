import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Zap, 
  Utensils, 
  ShoppingBag, 
  Calendar, 
  Plus, 
  Check, 
  Compass
} from 'lucide-react';
import { 
  calculateTransport, 
  calculateEnergy, 
  calculateFood, 
  calculateShopping, 
  getLabel,
  getUnit
} from '../utils/carbonCalculations';
import { LogEntry } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import Select from './ui/Select';
import Slider from './ui/Slider';

export interface CalculatorProps {
  onAddLog: (log: Partial<LogEntry>) => void;
}

/**
 * Calculator View (TypeScript)
 */
export default function Calculator({ onAddLog }: CalculatorProps) {
  const [activeTab, setActiveTab] = useState<'transport' | 'energy' | 'food' | 'shopping'>('transport');
  const [showToast, setShowToast] = useState(false);
  const [lastLogged, setLastLogged] = useState('');
  const [formError, setFormError] = useState('');

  // Form States
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Transport Form
  const [transportType, setTransportType] = useState('car_petrol');
  const [distance, setDistance] = useState(50);
  
  // Energy Form
  const [energyType, setEnergyType] = useState('electricity_grid');
  const [energyAmount, setEnergyAmount] = useState(150);

  // Food Form
  const [foodType, setFoodType] = useState('medium_meat');
  const [foodDays, setFoodDays] = useState(7);

  // Shopping Form
  const [shoppingCategory, setShoppingCategory] = useState('clothing_item');
  const [shoppingQty, setShoppingQty] = useState(2);

  // Live estimated emission state
  const [liveEstimate, setLiveEstimate] = useState(0);

  // Recalculate live estimate whenever inputs change
  useEffect(() => {
    let est = 0;
    if (activeTab === 'transport') {
      est = calculateTransport(transportType, distance);
    } else if (activeTab === 'energy') {
      est = calculateEnergy(energyType, energyAmount);
    } else if (activeTab === 'food') {
      est = calculateFood(foodType, foodDays);
    } else if (activeTab === 'shopping') {
      est = calculateShopping(shoppingCategory, shoppingQty);
    }
    setLiveEstimate(est);
  }, [activeTab, transportType, distance, energyType, energyAmount, foodType, foodDays, shoppingCategory, shoppingQty]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Input Validation
    if (!date || !date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      setFormError('Please select a valid date.');
      return;
    }

    const logEntry: Partial<LogEntry> = {
      id: 'log_' + Date.now(),
      date,
      category: activeTab,
      co2: liveEstimate,
    };

    if (activeTab === 'transport') {
      if (distance < 1 || isNaN(distance)) {
        setFormError('Travel distance must be at least 1 km.');
        return;
      }
      logEntry.type = transportType;
      logEntry.amount = distance;
      logEntry.details = `${distance} km via ${getLabel(transportType)}`;
    } else if (activeTab === 'energy') {
      if (energyAmount < 1 || isNaN(energyAmount)) {
        setFormError('Energy amount must be at least 1 unit.');
        return;
      }
      logEntry.type = energyType;
      logEntry.amount = energyAmount;
      logEntry.details = `${energyAmount} ${getUnit(energyType)} of ${getLabel(energyType)}`;
    } else if (activeTab === 'food') {
      if (foodDays < 1 || foodDays > 30 || isNaN(foodDays)) {
        setFormError('Duration must be between 1 and 30 days.');
        return;
      }
      logEntry.type = foodType;
      logEntry.amount = foodDays;
      logEntry.details = `${foodDays} days of ${getLabel(foodType)}`;
    } else if (activeTab === 'shopping') {
      if (shoppingQty < 1 || shoppingQty > 10 || isNaN(shoppingQty)) {
        setFormError('Quantity must be between 1 and 10.');
        return;
      }
      logEntry.type = shoppingCategory;
      logEntry.amount = shoppingQty;
      logEntry.details = `${shoppingQty}x ${getLabel(shoppingCategory)}`;
    }

    onAddLog(logEntry);
    
    // Trigger toast notification
    setLastLogged(logEntry.details || '');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);

    // Reset default parameters
    if (activeTab === 'transport') setDistance(50);
    else if (activeTab === 'energy') setEnergyAmount(150);
    else if (activeTab === 'food') setFoodDays(7);
    else if (activeTab === 'shopping') setShoppingQty(2);
  };

  return (
    <div className="calculator-view">
      <div className="header-container">
        <div>
          <h1 className="welcome-title">Track Emissions</h1>
          <p className="welcome-subtitle">Log your activities to calculate their environmental impact in real-time.</p>
        </div>
        <div className="date-badge">
          <Calendar size={16} aria-hidden="true" />
          <label htmlFor="log-date" className="sr-only">Select Activity Date</label>
          <input 
            id="log-date"
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'inherit', 
              fontFamily: 'inherit',
              cursor: 'pointer',
              outline: 'none'
            }} 
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-header" role="tablist" aria-label="Emission Categories">
        <button 
          id="tab-transport"
          type="button"
          role="tab"
          aria-selected={activeTab === 'transport'}
          aria-controls="panel-transport"
          className={`tab-btn ${activeTab === 'transport' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('transport');
            setFormError('');
          }}
        >
          <Car size={18} aria-hidden="true" /> Transport
        </button>
        <button 
          id="tab-energy"
          type="button"
          role="tab"
          aria-selected={activeTab === 'energy'}
          aria-controls="panel-energy"
          className={`tab-btn ${activeTab === 'energy' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('energy');
            setFormError('');
          }}
        >
          <Zap size={18} aria-hidden="true" /> Energy
        </button>
        <button 
          id="tab-food"
          type="button"
          role="tab"
          aria-selected={activeTab === 'food'}
          aria-controls="panel-food"
          className={`tab-btn ${activeTab === 'food' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('food');
            setFormError('');
          }}
        >
          <Utensils size={18} aria-hidden="true" /> Diet & Food
        </button>
        <button 
          id="tab-shopping"
          type="button"
          role="tab"
          aria-selected={activeTab === 'shopping'}
          aria-controls="panel-shopping"
          className={`tab-btn ${activeTab === 'shopping' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('shopping');
            setFormError('');
          }}
        >
          <ShoppingBag size={18} aria-hidden="true" /> Shopping & Waste
        </button>
      </div>

      <Card>
        <form onSubmit={handleSubmit} data-testid="emissions-form">
          {formError && (
            <div 
              style={{ 
                color: 'var(--color-danger)', 
                backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                padding: '0.75rem 1rem', 
                borderRadius: '8px', 
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }} 
              role="alert"
            >
              {formError}
            </div>
          )}

          {/* TRANSPORT TAB PANEL */}
          {activeTab === 'transport' && (
            <div id="panel-transport" role="tabpanel" aria-labelledby="tab-transport">
              <Select 
                id="transport-type"
                label="Transportation Mode"
                description="Select how you traveled"
                value={transportType}
                onChange={(e) => setTransportType((e.target as HTMLSelectElement).value)}
                options={[
                  { value: "car_petrol", label: "Petrol Car" },
                  { value: "car_diesel", label: "Diesel Car" },
                  { value: "car_hybrid", label: "Hybrid Car" },
                  { value: "car_electric", label: "Electric Car" },
                  { value: "motorbike", label: "Motorbike" },
                  { value: "bus", label: "Public Bus" },
                  { value: "train", label: "Train" },
                  { value: "flight_short", label: "Short-haul Flight (< 3 hours)" },
                  { value: "flight_long", label: "Long-haul Flight (> 3 hours)" }
                ]}
              />

              <Slider 
                id="transport-distance"
                label="Distance Traveled"
                min={1}
                max={transportType.includes('flight') ? 5000 : 500}
                step={transportType.includes('flight') ? 50 : 5}
                value={distance}
                unit="km"
                onChange={(e) => setDistance(parseInt(e.target.value))}
              />
            </div>
          )}

          {/* ENERGY TAB PANEL */}
          {activeTab === 'energy' && (
            <div id="panel-energy" role="tabpanel" aria-labelledby="tab-energy">
              <Select 
                id="energy-type"
                label="Energy Source"
                description="Utility billing category"
                value={energyType}
                onChange={(e) => setEnergyType((e.target as HTMLSelectElement).value)}
                options={[
                  { value: "electricity_grid", label: "Grid Electricity (Standard)" },
                  { value: "electricity_green", label: "Renewable Electricity (100% Green Tariff)" },
                  { value: "natural_gas", label: "Natural Gas" },
                  { value: "heating_oil", label: "Heating Oil" }
                ]}
              />

              <Slider 
                id="energy-amount"
                label="Usage Amount"
                min={5}
                max={1000}
                step={5}
                value={energyAmount}
                unit={getUnit(energyType)}
                onChange={(e) => setEnergyAmount(parseInt(e.target.value))}
              />
            </div>
          )}

          {/* DIET & FOOD TAB PANEL */}
          {activeTab === 'food' && (
            <div id="panel-food" role="tabpanel" aria-labelledby="tab-food">
              <div className="form-group">
                <span className="form-label" id="diet-group-label" style={{ marginBottom: '1.25rem' }}>
                  Diet Profile
                  <span className="form-label-desc">Which best describes your eating habits?</span>
                </span>
                <div className="radio-grid" role="radiogroup" aria-labelledby="diet-group-label">
                  <label 
                    className={`radio-card ${foodType === 'heavy_meat' ? 'selected' : ''}`}
                  >
                    <input 
                      type="radio" 
                      name="foodType" 
                      value="heavy_meat" 
                      checked={foodType === 'heavy_meat'} 
                      onChange={() => setFoodType('heavy_meat')}
                      className="sr-only"
                    />
                    <span style={{ fontSize: '1.5rem' }} aria-hidden="true">🥩</span>
                    <span className="radio-card-title">Heavy Meat</span>
                    <span className="radio-card-desc">Meat in almost every meal</span>
                  </label>

                  <label 
                    className={`radio-card ${foodType === 'medium_meat' ? 'selected' : ''}`}
                  >
                    <input 
                      type="radio" 
                      name="foodType" 
                      value="medium_meat" 
                      checked={foodType === 'medium_meat'} 
                      onChange={() => setFoodType('medium_meat')}
                      className="sr-only"
                    />
                    <span style={{ fontSize: '1.5rem' }} aria-hidden="true">🍗</span>
                    <span className="radio-card-title">Medium Meat</span>
                    <span className="radio-card-desc">Average meat consumption</span>
                  </label>

                  <label 
                    className={`radio-card ${foodType === 'low_meat' ? 'selected' : ''}`}
                  >
                    <input 
                      type="radio" 
                      name="foodType" 
                      value="low_meat" 
                      checked={foodType === 'low_meat'} 
                      onChange={() => setFoodType('low_meat')}
                      className="sr-only"
                    />
                    <span style={{ fontSize: '1.5rem' }} aria-hidden="true">🐟</span>
                    <span className="radio-card-title">Low Meat</span>
                    <span className="radio-card-desc">Poultry/fish, red meat rarely</span>
                  </label>

                  <label 
                    className={`radio-card ${foodType === 'vegetarian' ? 'selected' : ''}`}
                  >
                    <input 
                      type="radio" 
                      name="foodType" 
                      value="vegetarian" 
                      checked={foodType === 'vegetarian'} 
                      onChange={() => setFoodType('vegetarian')}
                      className="sr-only"
                    />
                    <span style={{ fontSize: '1.5rem' }} aria-hidden="true">🥚</span>
                    <span className="radio-card-title">Vegetarian</span>
                    <span className="radio-card-desc">No meat, includes dairy/eggs</span>
                  </label>

                  <label 
                    className={`radio-card ${foodType === 'vegan' ? 'selected' : ''}`}
                  >
                    <input 
                      type="radio" 
                      name="foodType" 
                      value="vegan" 
                      checked={foodType === 'vegan'} 
                      onChange={() => setFoodType('vegan')}
                      className="sr-only"
                    />
                    <span style={{ fontSize: '1.5rem' }} aria-hidden="true">🌱</span>
                    <span className="radio-card-title">Vegan</span>
                    <span className="radio-card-desc">Plant-based exclusively</span>
                  </label>
                </div>
              </div>

              <Slider 
                id="food-days"
                label="Duration"
                min={1}
                max={30}
                step={1}
                value={foodDays}
                unit="days"
                onChange={(e) => setFoodDays(parseInt(e.target.value))}
              />
            </div>
          )}

          {/* SHOPPING & WASTE TAB PANEL */}
          {activeTab === 'shopping' && (
            <div id="panel-shopping" role="tabpanel" aria-labelledby="tab-shopping">
              <Select 
                id="shopping-category"
                label="Category"
                description="Select purchased items or waste logging"
                value={shoppingCategory}
                onChange={(e) => setShoppingCategory((e.target as HTMLSelectElement).value)}
                options={[
                  { value: "clothing_item", label: "Clothing (New apparel purchase)" },
                  { value: "smartphone", label: "Smartphone (New device purchase)" },
                  { value: "laptop", label: "Laptop/PC (New machine purchase)" },
                  { value: "furniture_item", label: "Furniture/Home goods" },
                  { value: "general_waste_bag", label: "Landfill Waste (Standard garbage bags)" },
                  { value: "recycling_offset", label: "Recyclable Waste (Offset bags diverted)" }
                ]}
              />

              <Slider 
                id="shopping-qty"
                label="Quantity"
                min={1}
                max={10}
                step={1}
                value={shoppingQty}
                unit={getUnit(shoppingCategory)}
                onChange={(e) => setShoppingQty(parseInt(e.target.value))}
              />
            </div>
          )}

          {/* Live Calculated Emissions Banner */}
          <div className="calculator-banner">
            <div>
              <div className="calc-banner-title">Calculated Carbon Impact</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {activeTab === 'shopping' && shoppingCategory === 'recycling_offset' 
                  ? 'Negative emissions represent a footprint reduction.' 
                  : 'Based on global average lifecycle factors.'}
              </div>
            </div>
            <div className="calc-banner-val" data-testid="live-estimate">
              {liveEstimate.toFixed(1)} <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>kg CO₂e</span>
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifycontent: 'flex-end' }}>
            <Button type="submit">
              <Plus size={18} aria-hidden="true" /> Log Activity
            </Button>
          </div>
        </form>
      </Card>

      {/* Dynamic Recommendation Panel */}
      <div className="glass-panel card-content" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ background: 'rgba(6,182,212,0.1)', color: 'var(--color-secondary)', padding: '0.75rem', borderRadius: '50%' }}>
          <Compass size={24} aria-hidden="true" />
        </div>
        <div>
          <h4 style={{ fontWeight: 600 }}>Real-Time Insights</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            {activeTab === 'transport' && 'Opting for rail transit over car/flights reduces travel emissions by up to 80% per passenger-kilometer.'}
            {activeTab === 'energy' && 'Switching to a 100% renewable grid tariff drops electricity carbon intensity from 0.41 kg/kWh to near-zero (0.02 kg/kWh).'}
            {activeTab === 'food' && 'Transitioning from a heavy meat diet to vegetarian saving ~3.4 kg of CO2e daily, which equals 1,200 kg a year!'}
            {activeTab === 'shopping' && 'A single smartphone has a high manufacturing footprint. Extending its lifespan by 1-2 years delays recycling costs.'}
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="toast-msg" role="status" aria-live="polite">
          <Check size={18} style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Logged Successfully!</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Added {lastLogged}</div>
          </div>
        </div>
      )}
    </div>
  );
}
