import React, { useEffect } from 'react';
import useGameStore from './store/useGameStore';
import { Flame, Trees, Skull, MessageCircle, Wheat, Bone, Activity } from 'lucide-react'; 

function App() {
  const progression = useGameStore((state) => state.player_progression);
  const resources = useGameStore((state) => state.primitive_resources);
  const tribe = useGameStore((state) => state.tribe_metrics);
  const knowledge = useGameStore((state) => state.unlocked_knowledge);
  
  const theGreatHunt = useGameStore((state) => state.theGreatHunt);
  const gatherWood = useGameStore((state) => state.gatherWood);
  const shareStories = useGameStore((state) => state.shareStories);
  const stokeFire = useGameStore((state) => state.stokeFire);
  const discoverAgriculture = useGameStore((state) => state.discoverAgriculture);
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
          <h1 className="text-4xl tracking-widest uppercase">The Lineage Ends</h1>
        </div>
      </div>
    );
  }

  const isGlitching = progression.world_corruption_discovered > 0;
  const glitchTextClass = isGlitching ? "font-mono text-emerald-500 animate-pulse" : "";

  return (
    <div className={`min-h-screen p-4 md:p-12 transition-colors duration-1000 ${isGlitching ? 'bg-black text-stone-300 font-mono' : 'bg-stone-950 text-stone-400 font-serif'}`}>
      <div className="max-w-xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="border-b border-stone-800 pb-4 flex justify-between items-end">
          <h1 className="text-2xl text-stone-200 tracking-wider">
            {isGlitching ? <span className="text-emerald-500 font-mono bg-emerald-900/20 px-2">WARNING: BIO_METRICS_DECAYING</span> : "The Encampment"}
          </h1>
          <span className="text-sm opacity-60">Kin: {tribe.population}</span>
        </header>

        {/* Environmental Readout */}
        <section className="space-y-4">
          <div className="flex justify-between items-center text-sm tracking-widest uppercase">
            <span className="flex items-center text-orange-500/80">
              <Flame className="w-4 h-4 mr-2" /> {isGlitching ? "THERMAL_CORE" : "Campfire"}
            </span>
            <span className={glitchTextClass}>{Math.round(tribe.campfire_heat * 100)}%</span>
          </div>
          <div className="w-full bg-stone-900 h-1">
            <div className={`h-full transition-all duration-1000 ease-linear ${isGlitching ? 'bg-emerald-500' : 'bg-orange-600'}`} style={{ width: `${tribe.campfire_heat * 100}%` }}></div>
          </div>

          <div className="flex justify-between items-center text-sm tracking-widest uppercase mt-6">
            <span className="flex items-center text-stone-500">
              <Skull className="w-4 h-4 mr-2" /> Fear
            </span>
            <span className={tribe.fear_level > 0.8 ? 'text-red-500 animate-pulse' : 'text-stone-500'}>
              {Math.round(tribe.fear_level * 100)}%
            </span>
          </div>
          <div className="w-full bg-stone-900 h-1">
            <div className="h-full bg-red-900 transition-all duration-1000 ease-linear" style={{ width: `${tribe.fear_level * 100}%` }}></div>
          </div>

          {/* THE PENALTY: Health Decay appears after Agriculture */}
          {knowledge.agriculture_active && (
            <>
              <div className="flex justify-between items-center text-sm tracking-widest uppercase mt-6">
                <span className="flex items-center text-purple-500">
                  <Activity className="w-4 h-4 mr-2" /> Physical Decay (Arthritis/Cavities)
                </span>
                <span className="text-purple-500 font-mono animate-pulse">
                  {Math.round(tribe.health_decay * 100)}%
                </span>
              </div>
              <div className="w-full bg-stone-900 h-1">
                <div className="h-full bg-purple-600 transition-all duration-1000 ease-linear" style={{ width: `${tribe.health_decay * 100}%` }}></div>
              </div>
            </>
          )}
        </section>

        {/* Resources Storage */}
        <section className="grid grid-cols-4 gap-2 border border-stone-800 p-4 bg-stone-900/20">
          <div className="text-center">
            <span className="block text-[10px] uppercase tracking-widest opacity-50 mb-1">Rations</span>
            <span className={`text-lg text-stone-200 ${glitchTextClass}`}>{Math.floor(resources.food)}</span>
          </div>
          <div className="text-center">
            <span className="block text-[10px] uppercase tracking-widest opacity-50 mb-1">Wood</span>
            <span className={`text-lg text-stone-200 ${glitchTextClass}`}>{resources.firewood}</span>
          </div>
          <div className="text-center">
            <span className="block text-[10px] uppercase tracking-widest opacity-50 mb-1">Flint</span>
            <span className={`text-lg text-stone-200 ${glitchTextClass}`}>{resources.flint}</span>
          </div>
          <div className="text-center">
            <span className="block text-[10px] uppercase tracking-widest opacity-50 mb-1">Culture</span>
            <span className={`text-lg text-stone-200 ${glitchTextClass}`}>{resources.culture}</span>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-8 pt-4">
          {/* LABOR */}
          <section className="space-y-3">
            <h3 className="text-xs tracking-widest uppercase opacity-50 border-b border-stone-800 pb-2">Survival (Labor)</h3>
            <button onClick={theGreatHunt} className="w-full py-3 border border-stone-700 hover:bg-stone-800 transition-colors tracking-widest uppercase text-[10px] flex items-center justify-center">
              <Trees className="w-3 h-3 mr-2 opacity-50" />
              The Great Hunt (+Food, +Fear)
            </button>
            <button onClick={gatherWood} className="w-full py-3 border border-stone-700 hover:bg-stone-800 transition-colors tracking-widest uppercase text-[10px] flex items-center justify-center">
              Gather Dry Wood
            </button>
            <button onClick={stokeFire} disabled={resources.firewood < 1} className="w-full py-3 border border-orange-900/50 text-orange-600/80 hover:bg-orange-950/30 transition-colors tracking-widest uppercase text-[10px] flex items-center justify-center disabled:opacity-30">
              <Flame className="w-3 h-3 mr-2" />
              Stoke Fire (-1 Wood)
            </button>
          </section>

          {/* LEISURE */}
          <section className="space-y-3">
            <h3 className="text-xs tracking-widest uppercase opacity-50 border-b border-stone-800 pb-2">Leisure (Culture)</h3>
            <button 
              onClick={shareStories} 
              disabled={tribe.campfire_heat < 0.5}
              className="w-full py-3 border border-stone-700 hover:bg-stone-800 transition-colors tracking-widest uppercase text-[10px] flex items-center justify-center disabled:opacity-30"
            >
              <MessageCircle className="w-3 h-3 mr-2 opacity-50" />
              Share Myths (-Fear, +Culture)
            </button>
            <div className="text-[10px] opacity-40 italic text-center px-4">
              Requires a warm fire to safely converse.
            </div>
          </section>
        </div>

        {/* THE TRAP */}
        {!knowledge.agriculture_active && (
          <section className="pt-8">
            <button 
              onClick={discoverAgriculture} 
              disabled={resources.culture < 5 || resources.flint < 2} 
              className="w-full py-4 border border-indigo-900 text-indigo-400 hover:bg-indigo-900/20 transition-all tracking-widest uppercase text-xs flex items-center justify-center disabled:opacity-30"
            >
              <Wheat className="w-4 h-4 mr-3" />
              Sow Seeds (Cost: 5 Culture, 2 Flint)
            </button>
            <p className="text-center text-[10px] opacity-40 mt-2">End the need to hunt. Automate the food supply.</p>
          </section>
        )}

      </div>
    </div>
  );
}

export default App;