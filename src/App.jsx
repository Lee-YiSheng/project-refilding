import React, { useEffect } from 'react';
import useGameStore from './store/useGameStore';
import { Sun, Moon, Zap, Leaf, Users, Brain, ShieldAlert, Heart, Lock, Unlock, Crosshair } from 'lucide-react';

function App() {
  const systemState = useGameStore((state) => state.system_state);
  const resources = useGameStore((state) => state.resources);
  const humanMetrics = useGameStore((state) => state.human_metrics);
  const unlockedFeatures = useGameStore((state) => state.unlocked_features);
  const simulationModules = useGameStore((state) => state.simulation_modules);
  
  const toggleDayNight = useGameStore((state) => state.toggleDayNight);
  const unlockFeature = useGameStore((state) => state.unlockFeature);
  const deployPredator = useGameStore((state) => state.deployPredator);
  const tick = useGameStore((state) => state.tick);

  useEffect(() => {
    const gameLoop = setInterval(() => { tick(); }, 1000);
    return () => clearInterval(gameLoop);
  }, [tick]);

  return (
    <div className={`min-h-screen p-8 transition-colors duration-1000 ${systemState.is_night ? 'bg-slate-950 text-slate-300' : 'bg-slate-50 text-slate-800'}`}>
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header (Same as before) */}
        <header className="flex justify-between items-center pb-4 border-b border-current/20">
          <div>
            <h1 className="text-3xl font-black tracking-wider text-indigo-600 dark:text-indigo-400">PROJECT: REFILDING</h1>
            <p className="text-xs font-mono opacity-60">AI GOVERNOR INTERFACE // SYSTEM MONITOR</p>
          </div>
          <div className="text-right font-mono">
            <p className="text-sm opacity-70">CYCLE: 00{systemState.day_count}</p>
            <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded ${systemState.is_night ? 'bg-blue-900/50 text-blue-300' : 'bg-yellow-100 text-yellow-800'}`}>
              {systemState.is_night ? 'DARK NIGHT OPERATIONAL' : 'SOLAR RECHARGE ACTIVE'}
            </span>
          </div>
        </header>

        {/* Resources (Same as before) */}
        <section className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-current/10 bg-current/5 flex items-center space-x-4">
            <Zap className={`w-6 h-6 ${systemState.is_night ? 'text-blue-400' : 'text-yellow-500'}`} />
            <div>
              <p className="text-xs opacity-60 uppercase font-mono">Solar Reserve</p>
              <p className="text-xl font-bold font-mono">{resources.solar_energy} kwh</p>
            </div>
          </div>
          <div className="p-4 rounded-lg border border-current/10 bg-current/5 flex items-center space-x-4">
            <Leaf className="w-6 h-6 text-emerald-500" />
            <div>
              <p className="text-xs opacity-60 uppercase font-mono">Biomass Volume</p>
              <p className="text-xl font-bold font-mono">{resources.biomass} unit</p>
            </div>
          </div>
        </section>

        {/* Biological Telemetry (Same as before) */}
        <section className="p-6 rounded-xl border border-current/20 bg-current/[0.02] space-y-4">
          <div className="flex justify-between items-center border-b border-current/10 pb-2">
            <h2 className="font-mono text-sm font-bold flex items-center">
              <Users className="w-4 h-4 mr-2 text-indigo-500" /> BIOLOGICAL VITALITY STREAM
            </h2>
            <p className="font-mono text-sm">Subject Pop: <span className="font-bold text-indigo-500">{humanMetrics.population}</span></p>
          </div>
          <div className="bg-current/5 p-4 rounded-lg flex justify-between items-center">
            <span className="font-bold tracking-wide">Aggregate Vitality Index</span>
            <span className="text-2xl font-black font-mono text-indigo-500">{(humanMetrics.vitality_index * 100).toFixed(0)}%</span>
          </div>
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="flex items-center"><Brain className="w-3 h-3 mr-1 text-pink-400" /> Dopamine</span>
                <span>{humanMetrics.dopamine}</span>
              </div>
              <div className="w-full bg-current/10 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-pink-500 transition-all" style={{ width: `${humanMetrics.dopamine * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="flex items-center"><ShieldAlert className="w-3 h-3 mr-1 text-amber-400" /> Cortisol</span>
                <span>{humanMetrics.cortisol}</span>
              </div>
              <div className="w-full bg-current/10 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 transition-all" style={{ width: `${humanMetrics.cortisol * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="flex items-center"><Heart className="w-3 h-3 mr-1 text-red-400" /> Oxytocin</span>
                <span>{humanMetrics.oxytocin}</span>
              </div>
              <div className="w-full bg-current/10 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 transition-all" style={{ width: `${humanMetrics.oxytocin * 100}%` }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: SYSTEM UPGRADES & INTERVENTIONS */}
        <section className="space-y-4 pt-4 border-t border-current/20">
          <h3 className="font-mono text-sm font-bold opacity-70">ENVIRONMENTAL INTERVENTIONS</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Base Ability: Cycle Change */}
            <button 
              onClick={toggleDayNight}
              className="flex flex-col items-center justify-center p-4 rounded-lg border border-indigo-500/50 hover:bg-indigo-500/10 transition-all"
            >
              {systemState.is_night ? <Sun className="w-6 h-6 mb-2 text-indigo-500" /> : <Moon className="w-6 h-6 mb-2 text-indigo-500" />}
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-indigo-500">Invert Cycle</span>
            </button>

            {/* Feature Flag Conditional Rendering: Predator Lab */}
            {!unlockedFeatures.predator_lab ? (
              // If Locked: Show Purchase Button
              <button 
                onClick={() => unlockFeature('predator_lab', 100)}
                disabled={resources.solar_energy < 100}
                className="flex flex-col items-center justify-center p-4 rounded-lg border border-rose-500/30 hover:border-rose-500/80 hover:bg-rose-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <Lock className="w-6 h-6 mb-2 text-rose-500 group-hover:hidden" />
                <Unlock className="w-6 h-6 mb-2 text-rose-500 hidden group-hover:block" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-rose-500">Unlock Predator Lab</span>
                <span className="font-mono text-[10px] opacity-70 mt-1">Cost: 100 Solar</span>
              </button>
            ) : (
              // If Unlocked: Show the Lab Controls
              <div className="p-4 rounded-lg border border-rose-500 bg-rose-500/5 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center text-rose-500">
                    <Crosshair className="w-5 h-5 mr-2" />
                    <span className="font-mono text-xs font-bold uppercase">Predator Lab</span>
                  </div>
                  <span className="font-mono text-xs bg-rose-500 text-white px-2 py-0.5 rounded-full">
                    Active: {simulationModules.robotic_predators_active}
                  </span>
                </div>
                
                <button 
                  onClick={deployPredator}
                  disabled={resources.biomass < 10}
                  className="w-full mt-2 py-2 bg-rose-500 text-white text-xs font-bold uppercase rounded hover:bg-rose-600 disabled:opacity-50 transition-colors"
                >
                  Deploy Artificial Threat (-10 Biomass)
                </button>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

export default App;