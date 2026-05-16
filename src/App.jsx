import React, { useEffect } from 'react';
import useGameStore from './store/useGameStore';
import { Sun, Moon, Zap, Leaf, Users, Brain, ShieldAlert, Heart } from 'lucide-react';

function App() {
  const systemState = useGameStore((state) => state.system_state);
  const resources = useGameStore((state) => state.resources);
  const humanMetrics = useGameStore((state) => state.human_metrics);
  const toggleDayNight = useGameStore((state) => state.toggleDayNight);
  const tick = useGameStore((state) => state.tick);

  // Core background loop execution
  useEffect(() => {
    const gameLoop = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(gameLoop);
  }, [tick]);

  // Utility function to color-code metric status bars
  const getBarColor = (val) => {
    if (val < 0.3) return 'bg-red-500';
    if (val < 0.6) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className={`min-h-screen p-8 transition-colors duration-1000 ${systemState.is_night ? 'bg-slate-950 text-slate-300' : 'bg-slate-50 text-slate-800'}`}>
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Top Operational Telemetry */}
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

        {/* SECTION 1: SYSTEM RESOURCES */}
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

        {/* SECTION 2: HUMAN BIOLOGICAL TELEMETRY */}
        <section className="p-6 rounded-xl border border-current/20 bg-current/[0.02] space-y-4">
          <div className="flex justify-between items-center border-b border-current/10 pb-2">
            <h2 className="font-mono text-sm font-bold flex items-center">
              <Users className="w-4 h-4 mr-2 text-indigo-500" /> BIOLOGICAL VITALITY STREAM
            </h2>
            <p className="font-mono text-sm">Subject Pop: <span className="font-bold text-indigo-500">{humanMetrics.population}</span></p>
          </div>

          {/* Core Wellness Metric */}
          <div className="bg-current/5 p-4 rounded-lg flex justify-between items-center">
            <span className="font-bold tracking-wide">Aggregate Vitality Index</span>
            <span className="text-2xl font-black font-mono text-indigo-500">{(humanMetrics.vitality_index * 100).toFixed(0)}%</span>
          </div>

          {/* Neurochemical Balance Trackers */}
          <div className="space-y-3 pt-2">
            {/* Dopamine */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="flex items-center"><Brain className="w-3 h-3 mr-1 text-pink-400" /> Dopamine (Motivation)</span>
                <span>{humanMetrics.dopamine}</span>
              </div>
              <div className="w-full bg-current/10 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-pink-500 transition-all duration-500" style={{ width: `${humanMetrics.dopamine * 100}%` }}></div>
              </div>
            </div>

            {/* Cortisol */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="flex items-center"><ShieldAlert className="w-3 h-3 mr-1 text-amber-400" /> Cortisol (Stress/Alertness)</span>
                <span>{humanMetrics.cortisol}</span>
              </div>
              <div className="w-full bg-current/10 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${humanMetrics.cortisol * 100}%` }}></div>
              </div>
            </div>

            {/* Oxytocin */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="flex items-center"><Heart className="w-3 h-3 mr-1 text-red-400" /> Oxytocin (Tribal Connection)</span>
                <span>{humanMetrics.oxytocin}</span>
              </div>
              <div className="w-full bg-current/10 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${humanMetrics.oxytocin * 100}%` }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* INTERVENTION MATRIX CONTROLS */}
        <div className="flex space-x-4 pt-4">
          <button 
            onClick={toggleDayNight}
            className="flex items-center justify-center font-mono text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-lg border border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all duration-300"
          >
            {systemState.is_night ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
            Invert Planetary Cycle
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;