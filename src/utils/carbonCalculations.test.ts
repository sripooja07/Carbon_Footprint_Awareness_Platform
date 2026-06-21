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

describe('carbonCalculations utility', () => {
  describe('calculateTransport', () => {
    it('calculates transport emissions correctly for known vehicle types', () => {
      expect(calculateTransport('car_petrol', 100)).toBe(17);
      expect(calculateTransport('car_electric', 200)).toBe(10);
      expect(calculateTransport('flight_short', 1000)).toBe(150);
    });

    it('returns 0 for unknown vehicle types', () => {
      expect(calculateTransport('unknown_type', 100)).toBe(0);
    });

    it('works with boundary distance of 0', () => {
      expect(calculateTransport('car_petrol', 0)).toBe(0);
    });
  });

  describe('calculateEnergy', () => {
    it('calculates energy emissions correctly for known energy types', () => {
      expect(calculateEnergy('electricity_grid', 100)).toBe(41);
      expect(calculateEnergy('heating_oil', 10)).toBe(26.8);
    });

    it('returns 0 for unknown energy types', () => {
      expect(calculateEnergy('unknown_energy', 100)).toBe(0);
    });
  });

  describe('calculateFood', () => {
    it('calculates diet emissions correctly', () => {
      expect(calculateFood('heavy_meat', 7)).toBe(7.26 * 7);
      expect(calculateFood('vegan', 10)).toBe(2.89 * 10);
    });

    it('defaults to 1 day if not specified', () => {
      expect(calculateFood('vegetarian')).toBe(3.81);
    });

    it('returns 0 for unknown diet types', () => {
      expect(calculateFood('unknown_diet', 5)).toBe(0);
    });
  });

  describe('calculateShopping', () => {
    it('calculates shopping emissions correctly', () => {
      expect(calculateShopping('smartphone', 2)).toBe(160);
      expect(calculateShopping('recycling_offset', 5)).toBe(-6.0);
    });

    it('returns 0 for unknown shopping category', () => {
      expect(calculateShopping('unknown_shop', 2)).toBe(0);
    });
  });

  describe('getLabel', () => {
    it('returns correct label for valid keys', () => {
      expect(getLabel('car_petrol')).toBe('Petrol Car');
      expect(getLabel('vegan')).toBe('Vegan Diet');
      expect(getLabel('furniture_item')).toBe('Furniture/Home Items');
    });

    it('returns key itself if label is unknown', () => {
      expect(getLabel('non_existent_key')).toBe('non_existent_key');
    });
  });

  describe('getUnit', () => {
    it('returns correct unit for transport types', () => {
      expect(getUnit('car_diesel')).toBe('km');
      expect(getUnit('motorbike')).toBe('km');
      expect(getUnit('flight_short')).toBe('passenger-km');
    });

    it('returns correct unit for energy types', () => {
      expect(getUnit('electricity_grid')).toBe('kWh');
      expect(getUnit('heating_oil')).toBe('Liters');
    });

    it('returns correct unit for food types', () => {
      expect(getUnit('heavy_meat')).toBe('Days');
      expect(getUnit('vegan')).toBe('Days');
    });

    it('returns correct unit for waste and recycling', () => {
      expect(getUnit('recycling_offset')).toBe('bags recycled');
      expect(getUnit('general_waste_bag')).toBe('bags to landfill');
    });

    it('returns default unit for other shopping categories', () => {
      expect(getUnit('smartphone')).toBe('qty');
      expect(getUnit('unknown')).toBe('qty');
    });
  });

  describe('constants structures', () => {
    it('defines emission factors structures correctly', () => {
      expect(EMISSION_FACTORS).toHaveProperty('transport');
      expect(EMISSION_FACTORS).toHaveProperty('energy');
      expect(EMISSION_FACTORS).toHaveProperty('food');
      expect(EMISSION_FACTORS).toHaveProperty('shopping');
    });

    it('defines challenges array correctly', () => {
      expect(Array.isArray(CHALLENGES)).toBe(true);
      expect(CHALLENGES.length).toBeGreaterThan(0);
      expect(CHALLENGES[0]).toHaveProperty('id');
      expect(CHALLENGES[0]).toHaveProperty('title');
    });
  });
});
