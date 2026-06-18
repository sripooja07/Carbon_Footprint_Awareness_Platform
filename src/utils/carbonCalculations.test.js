import { describe, it, expect } from 'vitest';
import { 
  calculateTransport, 
  calculateEnergy, 
  calculateFood, 
  calculateShopping, 
  getLabel, 
  getUnit,
  EMISSION_FACTORS,
  CHALLENGES
} from './carbonCalculations';

describe('Carbon Calculations Utility', () => {
  describe('calculateTransport', () => {
    it('should calculate emissions for petrol cars correctly', () => {
      const distance = 100;
      const result = calculateTransport('car_petrol', distance);
      expect(result).toBe(distance * EMISSION_FACTORS.transport.car_petrol);
    });

    it('should return 0 for unknown vehicle types', () => {
      expect(calculateTransport('spaceshuttle', 1000)).toBe(0);
    });
  });

  describe('calculateEnergy', () => {
    it('should calculate standard electricity energy usage footprint correctly', () => {
      const amount = 200;
      const result = calculateEnergy('electricity_grid', amount);
      expect(result).toBe(amount * EMISSION_FACTORS.energy.electricity_grid);
    });

    it('should calculate renewable electricity usage offset correctly', () => {
      const amount = 200;
      const result = calculateEnergy('electricity_green', amount);
      expect(result).toBe(amount * EMISSION_FACTORS.energy.electricity_green);
    });
  });

  describe('calculateFood', () => {
    it('should calculate meat diet carbon footprint for a week correctly', () => {
      const result = calculateFood('heavy_meat', 7);
      expect(result).toBe(7 * EMISSION_FACTORS.food.heavy_meat);
    });

    it('should default days parameter to 1', () => {
      const result = calculateFood('vegan');
      expect(result).toBe(1 * EMISSION_FACTORS.food.vegan);
    });
  });

  describe('calculateShopping', () => {
    it('should calculate carbon emissions for clothing purchases correctly', () => {
      const result = calculateShopping('clothing_item', 3);
      expect(result).toBe(3 * EMISSION_FACTORS.shopping.clothing_item);
    });

    it('should calculate negative emissions for recycling offset bags', () => {
      const result = calculateShopping('recycling_offset', 5);
      expect(result).toBe(5 * EMISSION_FACTORS.shopping.recycling_offset);
      expect(result).toBeLessThan(0);
    });
  });

  describe('Labels and Units helpers', () => {
    it('should map type identifiers to clean labels', () => {
      expect(getLabel('car_petrol')).toBe('Petrol Car');
      expect(getLabel('electricity_grid')).toBe('Grid Electricity');
      expect(getLabel('vegan')).toBe('Vegan Diet');
      expect(getLabel('unknown_key')).toBe('unknown_key');
    });

    it('should fetch correct units', () => {
      expect(getUnit('car_diesel')).toBe('km');
      expect(getUnit('flight_short')).toBe('passenger-km');
      expect(getUnit('electricity_grid')).toBe('kWh');
      expect(getUnit('heating_oil')).toBe('Liters');
      expect(getUnit('vegan')).toBe('Days');
      expect(getUnit('clothing_item')).toBe('qty');
    });
  });

  describe('CHALLENGES Database', () => {
    it('should contain a valid set of challenge objects', () => {
      expect(Array.isArray(CHALLENGES)).toBe(true);
      expect(CHALLENGES.length).toBeGreaterThan(0);
      
      const first = CHALLENGES[0];
      expect(first).toHaveProperty('id');
      expect(first).toHaveProperty('title');
      expect(first).toHaveProperty('co2Savings');
      expect(first).toHaveProperty('difficulty');
    });
  });
});
