import { create } from 'zustand';

const useGameStore = create((set) => ({
  // 1. SYSTEM DATA SCHEMA
  player_progression: {
    generation: 1,
    firmware_fragments: 0,
    world_corruption_discovered: 0.0,
  },

  primitive_resources: {
    food: 40,
    firewood: 8,
    culture: 0,
  },

  tribe_metrics: {
    population: 6,
    campfire_heat: 1.0,
    fear_level: 0.10,
    health_decay: 0.0,
  },

  unlocked_knowledge: {
    agriculture_active: false,
  },

  // NEW: Visual Entity Coordinates inside a hidden 6x6 grid matrix
  map_entities: {
    tribe_positions: [[2,2], [2,3], [3,2], [3,3], [1,2], [4,3]],
    predator_position: null,
  },

  // 2. LABOR & LEISURE INTERACTIONS
  forage: () => set((state) => {
    // Moving people randomly on the grid when foraging to simulate movement
    const newPositions = state.map_entities.tribe_positions.map(() => [
      Math.floor(Math.random() * 6),
      Math.floor(Math.random() * 6)
    ]);
    return {
      primitive_resources: { ...state.primitive_resources, food: state.primitive_resources.food + 15 },
      map_entities: { ...state.map_entities, tribe_positions: newPositions }
    };
  }),

  shareStories: () => set((state) => ({
    primitive_resources: { ...state.primitive_resources, culture: state.primitive_resources.culture + 1 },
    tribe_metrics: { ...state.tribe_metrics, fear_level: Math.max(0, state.tribe_metrics.fear_level - 0.15) }
  })),

  stokeFire: () => set((state) => {
    if (state.primitive_resources.firewood >= 1) {
      return {
        primitive_resources: { ...state.primitive_resources, firewood: state.primitive_resources.firewood - 1 },
        tribe_metrics: { ...state.tribe_metrics, campfire_heat: Math.min(1.0, state.tribe_metrics.campfire_heat + 0.4) }
      };
    }
    return state;
  }),

  discoverAgriculture: () => set((state) => ({
    unlocked_knowledge: { ...state.unlocked_knowledge, agriculture_active: true },
    player_progression: { ...state.player_progression, world_corruption_discovered: 0.20 }
  })),

  // NEW INTERVENTION: PRESTIGE / HARD RESET PROTOCOL
  executeCycleReset: () => set((state) => {
    // Calculate rewards based on performance before memory wipe
    const earnedFragments = Math.floor(state.primitive_resources.culture / 3) + 1;
    
    return {
      // Increment Loop
      player_progression: {
        generation: state.player_progression.generation + 1,
        firmware_fragments: state.player_progression.firmware_fragments + earnedFragments,
        world_corruption_discovered: 0.0, // Re-stabilize matrix
      },
      // Clear data fields back to primitive baseline
      primitive_resources: { food: 50, firewood: 10, culture: 0 },
      tribe_metrics: { population: 6, campfire_heat: 1.0, fear_level: 0.10, health_decay: 0.0 },
      unlocked_knowledge: { agriculture_active: false },
      map_entities: {
        tribe_positions: [[2,2], [2,3], [3,2], [3,3], [1,2], [4,3]],
        predator_position: null
      }
    };
  }),

  // 3. INTERNAL COMPUTATION ENGINE
  tick: () => set((state) => {
    let { campfire_heat, fear_level, population, health_decay } = state.tribe_metrics;
    let { food } = state.primitive_resources;
    let { tribe_positions, predator_position } = state.map_entities;
    let isAgri = state.unlocked_knowledge.agriculture_active;

    campfire_heat = Math.max(0, campfire_heat - 0.02);
    food = Math.max(0, food - (population * 0.15));

    // Simulated Entity Behavioral Shifts on Tick
    if (Math.random() > 0.6) {
      // Randomly make people shift tiles slightly inside their territory
      tribe_positions = tribe_positions.map(([r, c]) => {
        const dr = Math.random() > 0.5 ? 1 : -1;
        const dc = Math.random() > 0.5 ? 1 : -1;
        return [Math.max(0, Math.min(5, r + dr)), Math.max(0, Math.min(5, c + dc))];
      });
    }

    if (isAgri) {
      food += (population * 0.25);
      health_decay = Math.min(1.0, health_decay + 0.015);
      
      // The AI Matrix launches a hunting countermeasure: A predator spawns on the coordinates
      if (!predator_position) predator_position = [0, 0];
      else {
        // Hunter AI tracks towards center coordinates
        const [pr, pc] = predator_position;
        predator_position = [pr < 3 ? pr + 1 : pr, pc < 3 ? pc + 1 : pc];
      }
    }

    return {
      primitive_resources: { ...state.primitive_resources, food: Number(food.toFixed(1)) },
      tribe_metrics: { ...state.tribe_metrics, campfire_heat, fear_level, health_decay, population },
      map_entities: { tribe_positions, predator_position }
    };
  })
}));

export default useGameStore;