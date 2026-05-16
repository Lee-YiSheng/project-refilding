import React, { useEffect } from 'react';
import useGameStore from './store/useGameStore';
import { Sun, Moon, Zap, Leaf } from 'lucide-react'; // Our icons

function App() {
  // 1. Connect to the Engine (Read the data and actions)
  const systemState = useGameStore((state) => state.system_state);
  const resources = useGameStore((state) => state.resources);
  const toggleDayNight = useGameStore((state) => state.toggleDayNight);
  const tick = useGameStore((state) => state.tick);

  // 2. Set up the automated Game Loop (Runs 1 tick every second)
  useEffect(() => {
    const gameLoop = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(gameLoop); // Cleanup if component closes
  }, [tick]);

  // 3. The Visual Layout (Tailwind CSS handles the styling)
  return (
    <div className={`min-h-screen p-8 transition-colors duration-1000 ${systemState.is_night ? 'bg-slate-900 text-slate-300' : 'bg-slate-50 text-slate-800'}`}>
      
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header Section */}
        <header className="flex justify-between items-center pb-4 border-b border-current/20">
          <h1 className="text-3xl font-bold">Project: Refilding</h1>
          <div className="text-right">
            <p className="text-sm opacity-70">Day {systemState.day_count}</p>
            <p className="font-mono text-lg">{systemState.is_night ? 'NIGHT SHIFT' : 'SOLAR PEAK'}</p>
          </div>
        </header>

        {/* Governor Dashboard Controls */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Resource Card: Energy */}
          <div className="p-6 rounded-lg border border-current/20 flex items-center space-x-4">
            <Zap className={`w-8 h-8 ${systemState.is_night ? 'text-blue-400' : 'text-yellow-500'}`} />
            <div>
              <p className="text-sm opacity-70">Solar Energy</p>
              <p className="text-2xl font-mono">{resources.solar_energy}</p>
            </div>
          </div>

          {/* Resource Card: Biomass */}
          <div className="p-6 rounded-lg border border-current/20 flex items-center space-x-4">
            <Leaf className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm opacity-70">Biomass Reserves</p>
              <p className="text-2xl font-mono">{resources.biomass}</p>
            </div>
          </div>
          
        </div>

        {/* AI Intervention Controls */}
        <div className="pt-8">
          <button 
            onClick={toggleDayNight}
            className="flex items-center px-6 py-3 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            {systemState.is_night ? <Sun className="w-5 h-5 mr-2" /> : <Moon className="w-5 h-5 mr-2" />}
            Force Cycle Change
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;