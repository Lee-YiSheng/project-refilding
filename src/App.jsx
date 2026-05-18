import React, { useEffect } from 'react';
import useGameStore from './store/useGameStore';
import { Flame, Trees, Skull, Moon, Wrench, Cpu } from 'lucide-react'; 

function App() {
  const progression = useGameStore((state) => state.player_progression);
  const resources = useGameStore((state) => state.primitive_resources);
  const tribe = useGameStore((state) => state.tribe_metrics);
  const knowledge = useGameStore((state) => state.unlocked_knowledge);
  
  const forage = useGameStore((state) => state.forage);
  const stokeFire = useGameStore((state) => state.stokeFire);
  const searchTheDark = useGameStore((state) => state.searchTheDark);
  const craftSpears = useGameStore((state) => state.craftSpears);
  const examineRoot = useGameStore((state) => state.examineRoot);
  const tick = useGameStore((state) => state.tick);

  useEffect(() => {
    const gameLoop = setInterval(() => { tick(); }, 1000);
    return () => clearInterval(gameLoop);
  }, [tick]);

  if (tribe.population <= 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-900 font-serif">
        <div className="text-center">
          <Skull className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h1 className="text-4xl tracking-widest uppercase">The Fire Died</h1>
        </div>
      </div>
    );
  }

  // --- GLITCH LOGIC ---
  // If corruption is > 0, we apply weird classes to the UI to simulate the matrix breaking.
  const isGlitching = progression.world_corruption_discovered > 0;
  const glitchTextClass = isGlitching ? "font-mono text-emerald-500 animate-pulse" : "";

  return (
    <div className={`min-h-screen p-4 md:p-12 transition-colors duration-1000 ${isGlitching ? 'bg-black text-stone-300 font-mono' : 'bg-stone-950 text-stone-400 font-serif'}`}>
      <div className="max-w-xl mx-auto space-y-12">
        
        {/* Header */}
        <header className="border-b border-stone-800 pb-4 flex justify-between items-end">
          <h1 className="text-2xl text-stone-200 tracking-wider">
            {progression.world_corruption_discovered > 0.3 ? (
              <span className="text-emerald-500 font-mono bg-emerald-900/20 px-2">SYS_NODE_01_ACTIVE</span>
            ) : "The Settlement"}
          </h1>
          <span className="text-sm opacity-60">Kin remaining: {tribe.population}</span>
        </header>

        {/* Environmental Readout */}
        <section className="space-y-4">
          <div className="flex justify-between items-center text-sm tracking-widest uppercase">
            <span className="flex items-center text-orange-500/80">
              <Flame className="w-4 h-4 mr-2" />
              {isGlitching ? "THERMAL_OUTPUT" : "Campfire"}
            </span>
            <span className={glitchTextClass}>{Math.round(tribe.campfire_heat * 100)}%</span>
          </div>
          <div className="w-full bg-stone-900 h-1">
            <div className={`h-full transition-all duration-1000 ease-linear ${isGlitching ? 'bg-emerald-500' : 'bg-orange-600'}`} style={{ width: `${tribe.campfire_heat * 100}%` }}></div>
          </div>

          <div className="flex justify-between items-center text-sm tracking-widest uppercase mt-6">
            <span className="flex items-center text-stone-500">
              <Skull className="w-4 h-4 mr-2" />
              Fear
            </span>
            <span className={tribe.fear_level > 0.8 ? 'text-red-500 animate-pulse' : 'text-stone-500'}>
              {Math.round(tribe.fear_level * 100)}%
            </span>
          </div>
          <div className="w-full bg-stone-900 h-1">
            <div className="h-full bg-red-900 transition-all duration-1000 ease-linear" style={{ width: `${tribe.fear_level * 100}%` }}></div>
          </div>
        </section>

        {/* Resources Storage */}
        <section className="grid grid-cols-3 gap-4 border border-stone-800 p-4 bg-stone-900/20">
          <div>
            <span className="block text-xs uppercase tracking-widest opacity-50 mb-1">Rations</span>
            <span className={`text-xl text-stone-200 ${glitchTextClass}`}>{Math.floor(resources.food)}</span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-widest opacity-50 mb-1">Dry Wood</span>
            <span className={`text-xl text-stone-200 ${glitchTextClass}`}>{resources.firewood}</span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-widest opacity-50 mb-1">Sharp Flint</span>
            <span className={`text-xl text-stone-200 ${glitchTextClass}`}>{resources.flint}</span>
          </div>
        </section>

        {/* High Friction Labor Actions */}
        <section className="grid grid-cols-2 gap-4 pt-4">
          <button onClick={forage} className="w-full py-4 border border-stone-700 hover:bg-stone-800 transition-colors tracking-widest uppercase text-xs flex flex-col items-center justify-center">
            <Trees className="w-5 h-5 mb-2 opacity-50" />
            {knowledge.sharpened_sticks ? "Hunt with Spears" : "Scour Treeline"}
          </button>
          
          <button onClick={stokeFire} disabled={resources.firewood < 1} className="w-full py-4 border border-orange-900/50 text-orange-600/80 hover:bg-orange-950/30 transition-colors tracking-widest uppercase text-xs flex flex-col items-center justify-center disabled:opacity-30">
            <Flame className="w-5 h-5 mb-2" />
            Stoke Embers
          </button>
        </section>

        {/* Discovery Actions */}
        <section className="space-y-4 pt-4 border-t border-stone-800">
          
          <button onClick={searchTheDark} className="w-full py-4 border border-stone-800 text-stone-500 hover:text-stone-300 hover:border-stone-500 transition-all tracking-widest uppercase text-xs flex items-center justify-center">
            <Moon className="w-4 h-4 mr-3" />
            Search the Dark (+Fear, +Flint)
          </button>

          {/* Upgrade Path */}
          {!knowledge.sharpened_sticks && (
             <button onClick={craftSpears} disabled={resources.flint < 3 || resources.firewood < 2} className="w-full py-4 border border-indigo-900 text-indigo-400 hover:bg-indigo-900/20 transition-all tracking-widest uppercase text-xs flex items-center justify-center disabled:opacity-30">
              <Wrench className="w-4 h-4 mr-3" />
              Bind Sharp Stones (3 Flint, 2 Wood)
            </button>
          )}

          {/* THE ANOMALY (Appears after crafting tools) */}
          {knowledge.metallic_roots_found && (
            <button onClick={examineRoot} className="w-full p-4 mt-8 border border-emerald-500 bg-emerald-900/10 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all tracking-widest uppercase text-xs text-left animate-pulse">
              <Cpu className="w-5 h-5 mb-2 inline-block mr-2" />
              Examine Metallic Root (Corruption: {Math.round(progression.world_corruption_discovered * 100)}%)
              <p className="normal-case opacity-70 mt-2 font-mono text-[10px]">
                "The vine is cold. It pulses with a rhythm not born of blood."
              </p>
            </button>
          )}

        </section>

      </div>
    </div>
  );
}

export default App;