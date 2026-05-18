import { create } from 'zustand';

const useGameStore = create((set) => ({
  // 1. THE DATA SCHEMA
  player_progression: {
    current_epoch: 1, 
    world_corruption_discovered: 0.0, // 0.0 to 1.0
  },

  primitive_resources: {
    food: 20,
    firewood: 5,
    flint: 0,
  },

  tribe_metrics: {
    population: 5,
    campfire_heat: 1.0, 
    fear_level: 0.20,   
    superstition_level: 1.0, 
  },

  unlocked_knowledge: {
    sharpened_sticks: false,
    metallic_roots_found: false,
  },

  // 2. PLAYER ACTIONS
  forage: () => set((state) => {
    // If they have sharpened sticks, they get double food
    const multiplier = state.unlocked_knowledge.sharpened_sticks ? 2 : 1;
    const foundWood = Math.random() > 0.7;
    
    return {
      primitive_resources: {
        ...state.primitive_resources,
        food: state.primitive_resources.food + (2 * multiplier),
        firewood: state.primitive_resources.firewood + (foundWood ? 1 : 0)
      }
    };
  }),

  stokeFire: () => set((state) => {
    if (state.primitive_resources.firewood >= 1) {
      return {
        primitive_resources: {
          ...state.primitive_resources,
          firewood: state.primitive_resources.firewood - 1
        },
        tribe_metrics: {
          ...state.tribe_metrics,
          campfire_heat: Math.min(1.0, state.tribe_metrics.campfire_heat + 0.4),
          fear_level: Math.max(0, state.tribe_metrics.fear_level - 0.15) 
        }
      };
    }
    return state;
  }),

  // NEW ACTION: High Risk, High Reward
  searchTheDark: () => set((state) => {
    // Venturing away from the fire causes massive fear and lowers heat, but yields Flint
    return {
      primitive_resources: {
        ...state.primitive_resources,
        flint: state.primitive_resources.flint + 1
      },
      tribe_metrics: {
        ...state.tribe_metrics,
        fear_level: Math.min(1.0, state.tribe_metrics.fear_level + 0.3),
        campfire_heat: Math.max(0, state.tribe_metrics.campfire_heat - 0.2)
      }
    };
  }),

  // NEW ACTION: Crafting the first tool
  craftSpears: () => set((state) => {
    if (state.primitive_resources.flint >= 3 && state.primitive_resources.firewood >= 2) {
      return {
        primitive_resources: {
          ...state.primitive_resources,
          flint: state.primitive_resources.flint - 3,
          firewood: state.primitive_resources.firewood - 2
        },
        unlocked_knowledge: {
          ...state.unlocked_knowledge,
          sharpened_sticks: true,
          metallic_roots_found: true // Crafting digs too deep and exposes a wire
        },
        // The Glitch Begins
        player_progression: {
          ...state.player_progression,
          current_epoch: 2, 
          world_corruption_discovered: 0.10
        }
      };
    }
    return state;
  }),

  // NEW ACTION: Investigating the Anomaly
  examineRoot: () => set((state) => {
    return {
      player_progression: {
        ...state.player_progression,
        world_corruption_discovered: Math.min(1.0, state.player_progression.world_corruption_discovered + 0.15)
      },
      tribe_metrics: {
        ...state.tribe_metrics,
        superstition_level: Math.max(0, state.tribe_metrics.superstition_level - 0.2) // Truth replaces superstition
      }
    }
  }),

  // 3. THE ENGINE
  tick: () => set((state) => {
    let { campfire_heat, fear_level, population } = state.tribe_metrics;
    let { food } = state.primitive_resources;

    campfire_heat = Math.max(0, campfire_heat - 0.03);

    if (campfire_heat < 0.3) {
      fear_level = Math.min(1.0, fear_level + 0.04); 
    } else {
      fear_level = Math.max(0.0, fear_level - 0.02); 
    }

    food = Math.max(0, food - (population * 0.05));

    if (campfire_heat === 0 && fear_level >= 0.9 && population > 0) {
      if (Math.random() > 0.9) population -= 1;
    }

    return {
      primitive_resources: { ...state.primitive_resources, food: Number(food.toFixed(1)) },
      tribe_metrics: { ...state.tribe_metrics, campfire_heat: Number(campfire_heat.toFixed(2)), fear_level: Number(fear_level.toFixed(2)), population }
    };
  })
}));

export default useGameStore;