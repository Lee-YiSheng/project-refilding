import { create } from 'zustand';

const useGameStore = create((set) => ({
  // 1. Core State
  system_state: { is_night: false, day_count: 1 },
  resources: { solar_energy: 150, biomass: 50 }, // Starting with enough energy to buy the lab
  
  // 2. Biological Metrics
  human_metrics: {
    population: 150,
    dopamine: 0.50,
    cortisol: 0.35,
    oxytocin: 0.60,
    vitality_index: 0.75
  },

  // 3. NEW: Modules and Feature Flags
  unlocked_features: {
    predator_lab: false, // Hidden by default
  },
  simulation_modules: {
    robotic_predators_active: 0,
  },

  // Actions
  toggleDayNight: () => set((state) => ({
    system_state: {
      ...state.system_state,
      is_night: !state.system_state.is_night,
      day_count: state.system_state.is_night ? state.system_state.day_count + 1 : state.system_state.day_count
    }
  })),

  // NEW: System architecture for unlocking features
  unlockFeature: (featureName, cost) => set((state) => {
    if (state.resources.solar_energy >= cost && !state.unlocked_features[featureName]) {
      return {
        resources: { ...state.resources, solar_energy: state.resources.solar_energy - cost },
        unlocked_features: { ...state.unlocked_features, [featureName]: true }
      };
    }
    return state; // Do nothing if they can't afford it
  }),

  // NEW: Deploying a predator uses 10 Biomass
  deployPredator: () => set((state) => {
    if (state.resources.biomass >= 10) {
      return {
        resources: { ...state.resources, biomass: state.resources.biomass - 10 },
        simulation_modules: { 
          ...state.simulation_modules, 
          robotic_predators_active: state.simulation_modules.robotic_predators_active + 1 
        }
      };
    }
    return state;
  }),

  // Updated Tick: Now factors in Predators
  tick: () => set((state) => {
    const isNight = state.system_state.is_night;
    const predators = state.simulation_modules.robotic_predators_active;
    
    // Resource Math
    const energyChange = isNight ? -5 : 10;
    // Biomass slowly grows over time
    const biomassChange = isNight ? 1 : 2; 

    // Biology Math
    let newDopamine = state.human_metrics.dopamine;
    let newCortisol = state.human_metrics.cortisol;
    let newOxytocin = state.human_metrics.oxytocin;
    let popChange = 0;

    if (isNight) {
      newCortisol = Math.max(0.10, newCortisol - 0.02);
      newOxytocin = Math.min(1.00, newOxytocin + 0.01);
      newDopamine = Math.max(0.20, newDopamine - 0.01);
    } else {
      newCortisol = Math.min(0.80, newCortisol + 0.03);
      if (newDopamine > 0.60) newOxytocin = Math.max(0.10, newOxytocin - 0.02);
    }

    // PREDATOR INTERVENTION MODIFIERS
    if (predators > 0) {
      // Predators spike cortisol drastically (Eustress)
      newCortisol = Math.min(1.00, newCortisol + (0.05 * predators));
      // Threat forces the tribe together (High Oxytocin)
      newOxytocin = Math.min(1.00, newOxytocin + (0.03 * predators));
      // The thrill of survival boosts dopamine
      newDopamine = Math.min(1.00, newDopamine + (0.02 * predators));

      // Negative feedback loop: Too many predators reduce population slightly
      if (Math.random() < (0.1 * predators)) {
        popChange = -1;
      }
    }

    const newVitality = (newDopamine + (1 - newCortisol) + newOxytocin) / 3;

    return {
      resources: {
        ...state.resources,
        solar_energy: Math.max(0, state.resources.solar_energy + energyChange),
        biomass: state.resources.biomass + biomassChange
      },
      human_metrics: {
        ...state.human_metrics,
        population: Math.max(0, state.human_metrics.population + popChange),
        dopamine: Number(newDopamine.toFixed(2)),
        cortisol: Number(newCortisol.toFixed(2)),
        oxytocin: Number(newOxytocin.toFixed(2)),
        vitality_index: Number(newVitality.toFixed(2))
      }
    };
  })
}));

export default useGameStore;