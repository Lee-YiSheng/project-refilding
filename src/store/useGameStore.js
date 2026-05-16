import { create } from 'zustand';

const useGameStore = create((set) => ({
  // 1. Expanded Data Schema
  system_state: {
    is_night: false,
    day_count: 1,
  },
  resources: {
    solar_energy: 100,
    biomass: 100,
  },
  // NEW: Biological tracking variables
  human_metrics: {
    population: 150,
    dopamine: 0.50,   // Range: 0.0 to 1.0 (Motivation/Reward)
    cortisol: 0.35,   // Range: 0.0 to 1.0 (Stress/Alertness)
    oxytocin: 0.60,   // Range: 0.0 to 1.0 (Social Bonding)
    vitality_index: 0.75
  },

  // 2. Actions
  toggleDayNight: () => set((state) => ({
    system_state: {
      ...state.system_state,
      is_night: !state.system_state.is_night,
      day_count: state.system_state.is_night ? state.system_state.day_count + 1 : state.system_state.day_count
    }
  })),

  // Updated Tick: Computes resources AND human biology simultaneously
  tick: () => set((state) => {
    const isNight = state.system_state.is_night;
    
    // Resource calculations
    const energyChange = isNight ? -5 : 10;
    const newEnergy = Math.max(0, state.resources.solar_energy + energyChange);

    // NEW: Biological Simulation Math
    let newDopamine = state.human_metrics.dopamine;
    let newCortisol = state.human_metrics.cortisol;
    let newOxytocin = state.human_metrics.oxytocin;

    if (isNight) {
      // Night Phase: Cortisol drops naturally as humans rest, but oxytocin ticks up due to close tribal quarters/sleep
      newCortisol = Math.max(0.10, newCortisol - 0.02);
      newOxytocin = Math.min(1.00, newOxytocin + 0.01);
      // Dopamine drops slightly as active digital stimulation is removed by the AI
      newDopamine = Math.max(0.20, newDopamine - 0.01);
    } else {
      // Day Phase: Cortisol ascends to provoke waking alertness. 
      // If dopamine is too high (over-stimulated), oxytocin (socializing) begins to decay—simulating isolation.
      newCortisol = Math.min(0.80, newCortisol + 0.03);
      if (newDopamine > 0.60) {
        newOxytocin = Math.max(0.10, newOxytocin - 0.02);
      }
    }

    // Overall Vitality Index is an aggregate of balanced neurochemistry
    // High cortisol (stress) or absolute zero dopamine destroys vitality
    const newVitality = (newDopamine + (1 - newCortisol) + newOxytocin) / 3;

    return {
      resources: {
        ...state.resources,
        solar_energy: newEnergy
      },
      human_metrics: {
        ...state.human_metrics,
        dopamine: Number(newDopamine.toFixed(2)),
        cortisol: Number(newCortisol.toFixed(2)),
        oxytocin: Number(newOxytocin.toFixed(2)),
        vitality_index: Number(newVitality.toFixed(2))
      }
    };
  })
}));

export default useGameStore;