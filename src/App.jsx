import React, { useEffect } from 'react';
import useGameStore from './store/useGameStore';
import { Flame, Skull, MessageCircle, Wheat, RefreshCw, Cpu } from 'lucide-react'; 

function App() {
  const progression = useGameStore((state) => state.player_progression);
  const resources = useGameStore((state) => state.primitive_resources);
  const tribe = useGameStore((state) => state.tribe_metrics);
  const knowledge = useGameStore((state) => state.unlocked_knowledge);
  const mapEntities = useGameStore((state) => state.map_entities);
  
  const forage = useGameStore((state) => state.forage);
  const shareStories = useGameStore((state) => state.shareStories);
  const stokeFire = useGameStore((state) => state.stokeFire);
  const discoverAgriculture = useGameStore((state) => state.discoverAgriculture);
  const executeCycleReset = useGameStore((state) => state.executeCycleReset);
  const tick = useGameStore((state) => state.tick);

  useEffect(() => {
    const gameLoop = setInterval(() => { tick(); }, 1000);
    return () => clearInterval(gameLoop);
  }, [tick]);

  const isGlitching = progression.world_corruption_discovered > 0;

  // Render a 6x6 Matrix Map Area programmatically
  const renderMap = () => {
    let grid = [];
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        // Identify if any entity occupies this coordinate slice
        const hasHuman = mapEntities.tribe_positions.some(([hr, hc]) => hr === r && hc === c);
        const hasPredator = mapEntities.predator_position && mapEntities.predator_position[0] === r && mapEntities.predator_position[1] === c;

        grid.push(
          <div 
            key={`${r}-${c}`} 
            className={`aspect-square border border-stone-900/40 flex items-center justify-center text-sm transition-all duration-300 relative
              ${knowledge.agriculture_active ? 'bg-amber-950/10' : 'bg-emerald-950/10'} 
              ${r === 3 && c === 3 ? 'bg-orange-950/30 border border-orange-900/40' : ''}`} // Central Fire tile
          >
            {/* Center fire icon */}
            {r === 3 && c === 3 && tribe.campfire_heat > 0.1 && (
              <Flame className="w-3 h-3 text-orange-700 animate-pulse absolute" />
            )}
            
            {/* Render Entities inside DOM elements */}
            {hasHuman && <span className="animate-bounce z-10 select-none">🧑‍🎨</span>}
            {hasPredator && <span className="text-red-500 font-bold animate-ping absolute">01</span>}
            {hasPredator && <span className="z-10 select-none">🐯</span>}
          </div>
        );
      }
    }
    return grid;
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 flex items-center justify-center transition-colors duration-1000 ${isGlitching ? 'bg-black text-stone-300 font-mono' : 'bg-stone-950 text-stone-400 font-serif'}`}>
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* SIDEBAR PANELS: SYSTEMS CONTROL */}
        <div className="space-y-6">
          <header className="border-b border-stone-800 pb-4">
            <div className="text-xs opacity-50 font-mono">EVOLUTION LOOP: BATCH_00{progression.generation}</div>
            <h1 className="text-xl text-stone-100 tracking-wider flex justify-between items-center">
              {isGlitching ? <span className="text-emerald-500">MATRIX_INVERSION_WARN</span> : "Primitive Settlement"}
              <span className="text-xs text-indigo-400 font-mono">Fragments: {progression.firmware_fragments}</span>
            </h1>
          </header>

          {/* Core Metrics Progress Displays */}
          <section className="bg-stone-900/30 border border-stone-800 p-4 space-y-3">
            <div>
              <div className="flex justify-between text-xs uppercase mb-1">
                <span>Thermal Energy (Fire)</span>
                <span>{Math.round(tribe.campfire_heat * 100)}%</span>
              </div>
              <div className="w-full bg-stone-950 h-1"><div className="h-full bg-orange-600 transition-all duration-1000" style={{ width: `${tribe.campfire_heat * 100}%` }}></div></div>
            </div>
            {knowledge.agriculture_active && (
              <div>
                <div className="flex justify-between text-xs text-purple-400 uppercase mb-1">
                  <span>Biological Bone/Teeth Decay</span>
                  <span>{Math.round(tribe.health_decay * 100)}%</span>
                </div>
                <div className="w-full bg-stone-950 h-1"><div className="h-full bg-purple-600 transition-all duration-1000" style={{ width: `${tribe.health_decay * 100}%` }}></div></div>
              </div>
            )}
          </section>

          {/* Resources */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs border border-stone-800 p-3 bg-stone-900/10">
            <div><span className="opacity-40 block">Food</span><span className="text-stone-200 text-sm font-bold">{Math.floor(resources.food)}</span></div>
            <div><span className="opacity-40 block">Firewood</span><span className="text-stone-200 text-sm font-bold">{resources.firewood}</span></div>
            <div><span className="opacity-40 block">Culture</span><span className="text-stone-200 text-sm font-bold">{resources.culture}</span></div>
          </div>

          {/* Interactive Input Triggers */}
          <div className="space-y-2">
            <button onClick={forage} className="w-full py-2.5 border border-stone-800 hover:bg-stone-900 text-xs uppercase tracking-wider">Forage Sector (-Energy / Move Tribes)</button>
            <button onClick={shareStories} disabled={tribe.campfire_heat < 0.4} className="w-full py-2.5 border border-stone-800 hover:bg-stone-900 text-xs uppercase tracking-wider disabled:opacity-30">Share Origin Myths (+Culture)</button>
            <button onClick={stokeFire} disabled={resources.firewood < 1} className="w-full py-2.5 border border-orange-950 text-orange-600/80 hover:bg-orange-950/20 text-xs uppercase tracking-wider disabled:opacity-30">Stoke Center Fire</button>
          </div>

          {/* THE PRESTIGE TRIGGER */}
          {(tribe.health_decay >= 0.70 || tribe.population <= 1) && (
            <div className="pt-4 border-t border-dashed border-rose-900/50">
              <button onClick={executeCycleReset} className="w-full py-3 bg-rose-950/40 border border-rose-500 text-rose-400 font-mono text-xs uppercase tracking-widest flex items-center justify-center hover:bg-rose-500 hover:text-black transition-all animate-pulse">
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Execute System Cycle Reset (Prestige)
              </button>
              <p className="text-[10px] text-center opacity-50 mt-1">Liquidate current biomass clone family for permanent firmware memory.</p>
            </div>
          )}
        </div>

        {/* MAIN DISPLAY PANEL: DYNAMIC 2D GRID VISUAL MAP */}
        <div className="space-y-4">
          <div className="text-xs tracking-widest uppercase opacity-60 flex justify-between font-mono">
            <span>🔴 ENVIRONMENT ECOSYSTEM MATRIX VIEW</span>
            {isGlitching && <span className="text-emerald-500 flex items-center"><Cpu className="w-3 h-3 mr-1 animate-spin" /> RENDERING_ERROR_0x9F</span>}
          </div>
          
          <div className="grid grid-cols-6 border border-stone-800 bg-stone-900/10 rounded overflow-hidden select-none">
            {renderMap()}
          </div>
          
          {!knowledge.agriculture_active ? (
            <button onClick={discoverAgriculture} disabled={resources.culture < 5} className="w-full py-3 border border-indigo-900 text-indigo-400 text-xs uppercase font-mono tracking-widest disabled:opacity-30">
              <Wheat className="w-4 h-4 inline mr-2" /> Unlock Crop Agriculture (Calorie Automation)
            </button>
          ) : (
            <div className="text-[11px] opacity-50 bg-stone-900/40 p-3 rounded font-mono text-center border border-stone-800">
              [SYSTEM_ALERT]: Agriculture protocol deployed. High-calorie grain density active. Skeletal structure loading density failing...
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;