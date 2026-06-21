import { EmissionFactors, Challenge } from '../types';

/**
 * Carbon Footprint Emission Factors (in kg CO2e per unit)
 * Sources: US EPA, UK DEFRA, and IPCC reports.
 */
export const EMISSION_FACTORS: EmissionFactors = {
  transport: {
    car_petrol: 0.17, // per km
    car_diesel: 0.16, // per km
    car_hybrid: 0.10, // per km
    car_electric: 0.05, // per km (grid charging average)
    motorbike: 0.11, // per km
    bus: 0.08, // per passenger-km
    train: 0.04, // per passenger-km
    flight_short: 0.15, // per passenger-km (< 1000 km, ~1.5h flight)
    flight_long: 0.12, // per passenger-km (>= 1000 km)
  },
  energy: {
    electricity_grid: 0.41, // per kWh (standard grid average)
    electricity_green: 0.02, // per kWh (wind/solar offset grid)
    natural_gas: 0.20, // per kWh
    heating_oil: 2.68, // per liter
    coal: 0.34, // per kWh equivalent
  },
  food: {
    heavy_meat: 7.26, // daily kg CO2e per person
    medium_meat: 5.63, // daily kg CO2e per person
    low_meat: 4.67, // daily kg CO2e per person
    vegetarian: 3.81, // daily kg CO2e per person
    vegan: 2.89, // daily kg CO2e per person
  },
  shopping: {
    clothing_item: 12.5, // per item (average t-shirt/jeans lifecycle)
    smartphone: 80.0, // manufacturing footprint per new device
    laptop: 250.0, // manufacturing footprint per new laptop
    furniture_item: 50.0, // average piece of furniture
    general_waste_bag: 2.5, // per standard garbage bag (landfill)
    recycling_offset: -1.2, // reduction per bag recycled
  }
};

/**
 * Calculate transportation emissions
 * @param {string} type - Vehicle type
 * @param {number} distance - Distance in km
 * @returns {number} emissions in kg CO2e
 */
export const calculateTransport = (type: string, distance: number): number => {
  const factor = EMISSION_FACTORS.transport[type as keyof EmissionFactors['transport']] || 0;
  return distance * factor;
};

/**
 * Calculate energy emissions
 * @param {string} type - Energy source type
 * @param {number} amount - Amount in kWh (or liters for heating oil)
 * @returns {number} emissions in kg CO2e
 */
export const calculateEnergy = (type: string, amount: number): number => {
  const factor = EMISSION_FACTORS.energy[type as keyof EmissionFactors['energy']] || 0;
  return amount * factor;
};

/**
 * Calculate food emissions for a duration of days
 * @param {string} dietType - Diet type
 * @param {number} days - Number of days
 * @returns {number} emissions in kg CO2e
 */
export const calculateFood = (dietType: string, days = 1): number => {
  const factor = EMISSION_FACTORS.food[dietType as keyof EmissionFactors['food']] || 0;
  return days * factor;
};

/**
 * Calculate consumption/shopping emissions
 * @param {string} category - Shopping item category
 * @param {number} quantity - Quantity of items
 * @returns {number} emissions in kg CO2e
 */
export const calculateShopping = (category: string, quantity: number): number => {
  const factor = EMISSION_FACTORS.shopping[category as keyof EmissionFactors['shopping']] || 0;
  return quantity * factor;
};

/**
 * Returns clean readable label for emission keys
 */
export const getLabel = (key: string): string => {
  const labels: Record<string, string> = {
    car_petrol: "Petrol Car",
    car_diesel: "Diesel Car",
    car_hybrid: "Hybrid Car",
    car_electric: "Electric Car",
    motorbike: "Motorbike",
    bus: "Bus Ride",
    train: "Train Ride",
    flight_short: "Short-haul Flight",
    flight_long: "Long-haul Flight",
    electricity_grid: "Grid Electricity",
    electricity_green: "Renewable Electricity",
    natural_gas: "Natural Gas",
    heating_oil: "Heating Oil",
    heavy_meat: "Heavy Meat-eater Diet",
    medium_meat: "Medium Meat-eater Diet",
    low_meat: "Low Meat-eater Diet",
    vegetarian: "Vegetarian Diet",
    vegan: "Vegan Diet",
    clothing_item: "New Clothing Items",
    smartphone: "New Smartphone",
    laptop: "New Laptop/PC",
    furniture_item: "Furniture/Home Items",
    general_waste_bag: "Landfill Waste",
    recycling_offset: "Recycling Waste Offset"
  };
  return labels[key] || key;
};

/**
 * Returns units label for emission keys
 */
export const getUnit = (key: string): string => {
  if (key.startsWith("car_") || ["motorbike", "bus", "train"].includes(key)) {
    return "km";
  }
  if (key === "flight_short" || key === "flight_long") {
    return "passenger-km";
  }
  if (key.includes("electricity") || key === "natural_gas") {
    return "kWh";
  }
  if (key === "heating_oil") {
    return "Liters";
  }
  if (key.includes("diet") || key.includes("meat") || ["vegetarian", "vegan"].includes(key)) {
    return "Days";
  }
  if (key === "recycling_offset") {
    return "bags recycled";
  }
  if (key === "general_waste_bag") {
    return "bags to landfill";
  }
  return "qty";
};

/**
 * Default challenges database with estimated weekly CO2e savings (in kg)
 */
export const CHALLENGES: Challenge[] = [
  {
    id: "challenge_meatless",
    title: "Meatless Week",
    description: "Switch to a vegetarian or vegan diet for 7 days.",
    category: "food",
    co2Savings: 24.0,
    difficulty: "Medium",
    duration: "7 days"
  },
  {
    id: "challenge_carfree",
    title: "Car-Free Commute",
    description: "Walk, bike, or take public transit instead of driving for 30 km.",
    category: "transport",
    co2Savings: 5.1,
    difficulty: "Medium",
    duration: "Flexible"
  },
  {
    id: "challenge_thermostat",
    title: "Thermostat Tune-down",
    description: "Lower your home heating by 2°C (or raise AC by 2°C) for a week.",
    category: "energy",
    co2Savings: 8.5,
    difficulty: "Easy",
    duration: "7 days"
  },
  {
    id: "challenge_cold_wash",
    title: "Cold Wash Laundry",
    description: "Wash all your clothes in cold water for a month (approx. 10 loads).",
    category: "energy",
    co2Savings: 6.0,
    difficulty: "Easy",
    duration: "30 days"
  },
  {
    id: "challenge_no_flight",
    title: "Staycation Advocate",
    description: "Choose a local vacation spot instead of taking a short-haul flight.",
    category: "transport",
    co2Savings: 150.0,
    difficulty: "Hard",
    duration: "One-time"
  },
  {
    id: "challenge_secondhand",
    title: "Thrift & Pre-loved",
    description: "Buy secondhand or repair instead of buying 2 new clothing items.",
    category: "shopping",
    co2Savings: 25.0,
    difficulty: "Easy",
    duration: "One-time"
  },
  {
    id: "challenge_unplug",
    title: "Standby Phantom Killer",
    description: "Unplug chargers, TVs, and devices at night when not in use for a week.",
    category: "energy",
    co2Savings: 3.5,
    difficulty: "Easy",
    duration: "7 days"
  },
  {
    id: "challenge_recycle",
    title: "Zero Waste Hero",
    description: "Divert all recyclable plastic, paper, and metal from landfill for a week.",
    category: "shopping",
    co2Savings: 6.0,
    difficulty: "Easy",
    duration: "7 days"
  }
];
