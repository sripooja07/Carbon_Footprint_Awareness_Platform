export interface LogEntry {
  id: string;
  date: string;
  category: 'transport' | 'energy' | 'food' | 'shopping';
  co2: number;
  type: string;
  details: string;
  amount: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'transport' | 'energy' | 'food' | 'shopping';
  co2Savings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: string;
}

export interface EmissionFactors {
  transport: {
    car_petrol: number;
    car_diesel: number;
    car_hybrid: number;
    car_electric: number;
    motorbike: number;
    bus: number;
    train: number;
    flight_short: number;
    flight_long: number;
  };
  energy: {
    electricity_grid: number;
    electricity_green: number;
    natural_gas: number;
    heating_oil: number;
    coal: number;
  };
  food: {
    heavy_meat: number;
    medium_meat: number;
    low_meat: number;
    vegetarian: number;
    vegan: number;
  };
  shopping: {
    clothing_item: number;
    smartphone: number;
    laptop: number;
    furniture_item: number;
    general_waste_bag: number;
    recycling_offset: number;
  };
}
