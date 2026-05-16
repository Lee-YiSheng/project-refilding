import { create } from 'zustand';

// This is your Engine. No UI lives here, only data and logic.
const useGameStore = create((set) => ({
  // 1. The Data Schema (The JSON state)
  system_state: {
    is_night: false,
    day_count: 1,
  },
  resources: {
    solar_energy: 0,
    biomass: 100,
  },

  // 2. The Actions (How the rest of the game is allowed to change the data)
  
  // Action A: Toggle Day/Night
  toggleDayNight: () => set((state) => ({
    system_state: {
      ...state.system_state,
      is_night: !state.system_state.is_night,
      // If turning to day, increase the day count
      day_count: state.system_state.is_night ? state.system_state.day_count + 1 : state.system_state.day_count
    }
  })),

  // Action B: A single "Tick" of the game clock
  tick: () => set((state) => {
    // If it's day, generate energy. If night, lose energy.
    const energyChange = state.system_state.is_night ? -5 : 10;
    
    return {
      resources: {
        ...state.resources,
        solar_energy: Math.max(0, state.resources.solar_energy + energyChange) // Prevents going below 0
      }
    };
  })
}));

export default useGameStore;