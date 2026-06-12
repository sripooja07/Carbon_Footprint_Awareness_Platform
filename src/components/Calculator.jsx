import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Zap, 
  Utensils, 
  ShoppingBag, 
  Calendar, 
  Plus, 
  Check, 
  Compass,
  AlertCircle
} from 'lucide-react';
import { 
  calculateTransport, 
  calculateEnergy, 
  calculateFood, 
  calculateShopping, 
  getLabel,
  getUnit
} from '../utils/carbonCalculations';

export default function Calculator({ onAddLog }) {
  const [activeTab, setActiveTab] = useState('transport');
  const [showToast, setShowToast] = useState(false);
  const [lastLogged, setLastLogged] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let logEntry = {
      id: 'log_' + Date.now(),
      date,
      category: activeTab,
      co2: liveEstimate,
    };

    if (activeTab === 'transport') {
      logEntry.type = transportType;
      logEntry.amount = distance;
      logEntry.details = `${distance} km via ${getLabel(transportType)}`;
    } else if (activeTab === 'energy') {
      logEntry.type = energyType;
      logEntry.amount = energyAmount;
      logEntry.details = `${energyAmount} ${getUnit(energyType)} of ${getLabel(energyType)}`;
    } else if (activeTab === 'food') {
      logEntry.type = foodType;
      logEntry.amount = foodDays;
      logEntry.details = `${foodDays} days of ${getLabel(foodType)}`;
    } else if (activeTab === 'shopping') {
      logEntry.type = shoppingCategory;
      logEntry.amount = shoppingQty;
      logEntry.details = `${shoppingQty}x ${getLabel(shoppingCategory)}`;
    }

    onAddLog(logEntry);
    
    // Toast notification
    setLastLogged(logEntry.details);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);

    // Reset default parameters but keep selected types
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
          onClick={() => setActiveTab('transport')}
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
          onClick={() => setActiveTab('energy')}
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
          onClick={() => setActiveTab('food')}
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
          onClick={() => setActiveTab('shopping')}
        >
          <ShoppingBag size={18} aria-hidden="true" /> Shopping & Waste
        </button>
      </div>

      <div className="glass-panel card-content">
        <form onSubmit={handleSubmit}>
          
          {/* TRANSPORT TAB PANEL */}
          {activeTab === 'transport' && (
            <div id="panel-transport" role="tabpanel" aria-labelledby="tab-transport">
              <div className="form-group">
                <label htmlFor="transport-type" className="form-label">
                  Transportation Mode
                  <span className="form-label-desc">Select how you traveled</span>
                </label>
                <select 
                  id="transport-type"
                  value={transportType} 
                  onChange={(e) => setTransportType(e.target.value)}
                >
                  <option value="car_petrol">Petrol Car</option>
                  <option value="car_diesel">Diesel Car</option>
                  <option value="car_hybrid">Hybrid Car</option>
                  <option value="car_electric">Electric Car</option>
                  <option value="motorbike">Motorbike</option>
                  <option value="bus">Public Bus</option>
                  <option value="train">Train</option>
                  <option value="flight_short">Short-haul Flight (&lt; 3 hours)</option>
                  <option value="flight_long">Long-haul Flight (&gt; 3 hours)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="transport-distance" className="form-label">
                  Distance Traveled
                  <span className="form-label-value">{distance} km</span>
                </label>
                <input 
                  id="transport-distance"
                  type="range" 
                  min="1" 
                  max={transportType.includes('flight') ? "5000" : "500"} 
                  step={transportType.includes('flight') ? "50" : "5"}
                  value={distance} 
                  onChange={(e) => setDistance(parseInt(e.target.value))}
                />
                <div className="flex-between" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  <span>1 km</span>
                  <span>{transportType.includes('flight') ? "5000 km" : "500 km"}</span>
                </div>
              </div>
            </div>
          )}

          {/* ENERGY TAB PANEL */}
          {activeTab === 'energy' && (
            <div id="panel-energy" role="tabpanel" aria-labelledby="tab-energy">
              <div className="form-group">
                <label htmlFor="energy-type" className="form-label">
                  Energy Source
                  <span className="form-label-desc">Utility billing category</span>
                </label>
                <select 
                  id="energy-type"
                  value={energyType} 
                  onChange={(e) => setEnergyType(e.target.value)}
                >
                  <option value="electricity_grid">Grid Electricity (Standard)</option>
                  <option value="electricity_green">Renewable Electricity (100% Green Tariff)</option>
                  <option value="natural_gas">Natural Gas</option>
                  <option value="heating_oil">Heating Oil</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="energy-amount" className="form-label">
                  Usage Amount
                  <span className="form-label-value">{energyAmount} {getUnit(energyType)}</span>
                </label>
                <input 
                  id="energy-amount"
                  type="range" 
                  min="5" 
                  max="1000" 
                  step="5"
                  value={energyAmount} 
                  onChange={(e) => setEnergyAmount(parseInt(e.target.value))}
                />
                <div className="flex-between" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  <span>5 {getUnit(energyType)}</span>
                  <span>1000 {getUnit(energyType)}</span>
                </div>
              </div>
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

              <div className="form-group">
                <label htmlFor="food-days" className="form-label">
                  Duration
                  <span className="form-label-value">{foodDays} days</span>
                </label>
                <input 
                  id="food-days"
                  type="range" 
                  min="1" 
                  max="30" 
                  step="1"
                  value={foodDays} 
                  onChange={(e) => setFoodDays(parseInt(e.target.value))}
                />
                <div className="flex-between" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  <span>1 day</span>
                  <span>30 days</span>
                </div>
              </div>
            </div>
          )}

          {/* SHOPPING & WASTE TAB PANEL */}
          {activeTab === 'shopping' && (
            <div id="panel-shopping" role="tabpanel" aria-labelledby="tab-shopping">
              <div className="form-group">
                <label htmlFor="shopping-category" className="form-label">
                  Category
                  <span className="form-label-desc">Select purchased items or waste logging</span>
                </label>
                <select 
                  id="shopping-category"
                  value={shoppingCategory} 
                  onChange={(e) => setShoppingCategory(e.target.value)}
                >
                  <option value="clothing_item">Clothing (New apparel purchase)</option>
                  <option value="smartphone">Smartphone (New device purchase)</option>
                  <option value="laptop">Laptop/PC (New machine purchase)</option>
                  <option value="furniture_item">Furniture/Home goods</option>
                  <option value="general_waste_bag">Landfill Waste (Standard garbage bags)</option>
                  <option value="recycling_offset">Recyclable Waste (Offset bags diverted)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="shopping-qty" className="form-label">
                  Quantity
                  <span className="form-label-value">{shoppingQty} {getUnit(shoppingCategory)}</span>
                </label>
                <input 
                  id="shopping-qty"
                  type="range" 
                  min="1" 
                  max="10" 
                  step="1"
                  value={shoppingQty} 
                  onChange={(e) => setShoppingQty(parseInt(e.target.value))}
                />
                <div className="flex-between" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  <span>1 unit</span>
                  <span>10 units</span>
                </div>
              </div>
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
            <div className="calc-banner-val">
              {liveEstimate.toFixed(1)} <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>kg CO₂e</span>
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">
              <Plus size={18} aria-hidden="true" /> Log Activity
            </button>
          </div>
        </form>
      </div>

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
