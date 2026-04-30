import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import Matter from 'matter-js';
import confetti from 'canvas-confetti';
import { RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

// Physics Configuration (Moved inside component for responsiveness)

export default function GamePage() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('ivrea-highscore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [gameState, setGameState] = useState<'aiming' | 'flying' | 'resetting'>('aiming');
  const [hasThrown, setHasThrown] = useState(false);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [bodies, setBodies] = useState<any[]>([]);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [resetKey, setResetKey] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const worldRef = useRef<Matter.World | null>(null);
  
  const GROUND_Y = dimensions.height - 100;
  const SLING_POS = { 
    x: dimensions.width < 768 ? 80 : 200, 
    y: GROUND_Y - (dimensions.height < 600 ? 100 : 150) 
  };

  const resetGame = () => {
    setScore(0);
    setHasThrown(false);
    setGameState('aiming');
    setResetKey(prev => prev + 1);
  };

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('ivrea-highscore', score.toString());
    }
  }, [score, highScore]);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Engine setup
    const engine = Matter.Engine.create();
    const world = engine.world;
    engineRef.current = engine;
    worldRef.current = world;

    // Ground
    const ground = Matter.Bodies.rectangle(dimensions.width / 2, GROUND_Y + 50, dimensions.width * 4, 100, { 
      isStatic: true,
      label: 'ground'
    });
    
    // Level Design (Carriage Structure)
    const createLevel = () => {
      const isMobile = dimensions.width < 768;
      const offsetX = isMobile ? dimensions.width * 0.85 : Math.max(dimensions.width * 0.8, 400);
      const startY = GROUND_Y;
      
      const carriageScale = isMobile ? 0.7 : 1;
      
      const carriage = [
        // Wheels
        Matter.Bodies.circle(offsetX - 60 * carriageScale, startY - 25 * carriageScale, 25 * carriageScale, { friction: 0.5, label: 'wood' }),
        Matter.Bodies.circle(offsetX + 60 * carriageScale, startY - 25 * carriageScale, 25 * carriageScale, { friction: 0.5, label: 'wood' }),
        // Main Platform
        Matter.Bodies.rectangle(offsetX, startY - 60 * carriageScale, 180 * carriageScale, 20 * carriageScale, { label: 'wood' }),
        // Vertical Pillars
        Matter.Bodies.rectangle(offsetX - 70 * carriageScale, startY - 110 * carriageScale, 20 * carriageScale, 100 * carriageScale, { label: 'wood' }),
        Matter.Bodies.rectangle(offsetX + 70 * carriageScale, startY - 110 * carriageScale, 20 * carriageScale, 100 * carriageScale, { label: 'wood' }),
        // Top Roof
        Matter.Bodies.rectangle(offsetX, startY - 160 * carriageScale, 160 * carriageScale, 20 * carriageScale, { label: 'wood' }),
      ];

      // People (Targets)
      const targets = [
        // Bottom row
        Matter.Bodies.rectangle(offsetX, startY - 95 * carriageScale, 40 * carriageScale, 60 * carriageScale, { label: 'target', friction: 1, density: 0.001 }),
        Matter.Bodies.rectangle(offsetX - 50 * carriageScale, startY - 95 * carriageScale, 40 * carriageScale, 60 * carriageScale, { label: 'target', friction: 1, density: 0.001 }),
        Matter.Bodies.rectangle(offsetX + 50 * carriageScale, startY - 95 * carriageScale, 40 * carriageScale, 60 * carriageScale, { label: 'target', friction: 1, density: 0.001 }),
        // Top row
        Matter.Bodies.rectangle(offsetX - 50 * carriageScale, startY - 210 * carriageScale, 40 * carriageScale, 60 * carriageScale, { label: 'target', friction: 1, density: 0.001 }),
        Matter.Bodies.rectangle(offsetX + 50 * carriageScale, startY - 210 * carriageScale, 40 * carriageScale, 60 * carriageScale, { label: 'target', friction: 1, density: 0.001 }),
        Matter.Bodies.rectangle(offsetX, startY - 210 * carriageScale, 40 * carriageScale, 60 * carriageScale, { label: 'target', friction: 1, density: 0.001 }),
      ];

      Matter.World.add(world, [...carriage, ...targets]);
    };

    Matter.World.add(world, [ground]);
    createLevel();

    // Runner
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Sync State and Cleanup
    Matter.Events.on(engine, 'afterUpdate', () => {
      if (!world) return;
      
      const allBodies = Matter.Composite.allBodies(world)
        .map(b => {
          // Remove if too far out (only for non-static)
          if (!b.isStatic && (b.position.y > dimensions.height + 500 || b.position.x > dimensions.width + 1000 || b.position.x < -1000)) {
            Matter.World.remove(world, b);
            return null;
          }
          
          return {
            id: b.id,
            type: b.label,
            x: b.position.x,
            y: b.position.y,
            angle: b.angle,
            width: b.bounds.max.x - b.bounds.min.x,
            height: b.bounds.max.y - b.bounds.min.y,
            isCircle: !!b.circleRadius,
            radius: b.circleRadius,
            isStatic: b.isStatic
          };
        }).filter(b => b !== null);
      
      setBodies(allBodies as any[]);
    });

    // Collision Logic
    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;
        const labels = [bodyA.label, bodyB.label];
        
        if (labels.includes('target')) {
          const target = bodyA.label === 'target' ? bodyA : bodyB;
          const other = target === bodyA ? bodyB : bodyA;
          
          const force = Math.sqrt(other.velocity.x ** 2 + other.velocity.y ** 2);
          
          if (force > 1.5) {
            setScore(s => s + 1);
            confetti({
              origin: { x: target.position.x / dimensions.width, y: target.position.y / dimensions.height },
              colors: ['#FF6321', '#FFDAB9', '#FF8C00'],
              particleCount: 15,
              spread: 45,
              gravity: 0.8,
              scalar: 0.6
            });
          }
        }
      });
    });

    return () => {
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
    };
  }, [dimensions, resetKey]); // Re-run on resize or reset

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (gameState !== 'aiming' || hasThrown) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (Math.hypot(x - SLING_POS.x, y - SLING_POS.y) < 100) {
      setDragPos({ x, y });
    }
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragPos) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDragPos({
      x: clientX - rect.left,
      y: clientY - rect.top
    });
  };

  const handleDragEnd = () => {
    if (!dragPos || !worldRef.current) return;

    const dx = SLING_POS.x - dragPos.x;
    const dy = SLING_POS.y - dragPos.y;

    // Limit launch power
    const power = 0.15;
    
    const orange = Matter.Bodies.circle(SLING_POS.x, SLING_POS.y, 15, {
      restitution: 0.6,
      friction: 0.1,
      label: 'orange',
      density: 0.005
    });

    Matter.Body.setVelocity(orange, { x: dx * power, y: dy * power });
    Matter.World.add(worldRef.current, orange);
    
    setGameState('flying');
    setHasThrown(true);
    setDragPos(null);
  };

  return (
    <div 
      ref={containerRef}
      className="h-screen w-screen relative bg-[#FAF9F6] overflow-hidden select-none cursor-crosshair font-sans"
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
    >
      {/* HUD */}
      <div className="absolute top-0 w-full p-6 md:p-8 flex flex-col md:grid md:grid-cols-3 items-center md:items-start z-30 pointer-events-none gap-4">
        <div className="hidden md:flex items-center gap-4 pointer-events-auto">
          {/* Spacer */}
        </div>

        <div className="text-center flex flex-col items-center pointer-events-auto">
          <h1 className="text-2xl md:text-4xl font-display text-splat-orange tracking-tight leading-none mb-1">BATTLE OF IVREA</h1>
          <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400">Carnevale Strike</p>
          
          <div className="mt-3 md:mt-4 flex items-center gap-2 md:gap-3">
            <div className="px-4 py-2 md:px-6 bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 md:gap-4 font-mono">
              <div className="flex flex-col items-start">
                <span className="text-[7px] md:text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Impacts</span>
                <span className="text-2xl md:text-3xl font-display text-splat-orange leading-none">{score}</span>
              </div>
              <div className="w-[1px] h-6 md:h-8 bg-gray-100" />
              <div className="flex flex-col items-start">
                <span className="text-[7px] md:text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Record</span>
                <span className="text-lg md:text-xl font-display text-gray-300 leading-none">{highScore}</span>
              </div>
            </div>

            <button 
              onClick={resetGame}
              className="p-3 md:p-4 bg-splat-orange text-white rounded-xl md:rounded-2xl shadow-lg hover:rotate-180 transition-transform duration-500 flex items-center justify-center pointer-events-auto group"
              title="Reset Game"
            >
              <RefreshCw className="w-5 h-5 md:w-6 md:h-6 group-active:rotate-180 transition-transform" />
            </button>
          </div>
        </div>

        <div className="hidden md:flex justify-end pointer-events-auto">
          {/* Spacer */}
        </div>
      </div>

      {/* The Arancere (Thrower) and Sling Visuals */}
      <div 
        className="absolute w-24 h-48 pointer-events-none z-20"
        style={{ left: SLING_POS.x - 48, top: SLING_POS.y - 40 }}
      >
        {/* Detailed Arancere Figure (Thrower) */}
        <div className="relative w-full h-full flex flex-col items-center">
           {/* 1. Leather Helmet (The Mask) */}
           <div className="w-9 h-9 bg-[#1a1a1a] rounded-full border-2 border-black shadow-lg relative z-30 overflow-hidden">
             <div className="absolute top-3 left-0 w-full h-1.5 bg-[#444] flex gap-1 px-1">
               <div className="w-full h-full bg-black/40 rounded-sm" />
             </div>
             <div className="absolute top-0 left-1 w-1 h-3 bg-white/5 rounded-full" />
           </div>

           {/* 2. Padded Torso (The Uniform) - Using a classic "Morte" or "Tuchini" inspired look */}
           <div className="w-12 h-20 bg-splat-orange rounded-xl border-2 border-black/20 shadow-md relative z-20 overflow-hidden -mt-1">
              {/* Costume Stripe */}
              <div className="absolute inset-y-0 left-1/2 w-4 bg-white/20 -translate-x-1/2" />
              {/* Padding Lines */}
              <div className="absolute inset-0 flex flex-col justify-around py-4 opacity-10">
                 <div className="h-[1px] bg-black w-full" />
                 <div className="h-[1px] bg-black w-full" />
                 <div className="h-[1px] bg-black w-full" />
              </div>
           </div>

           {/* 3. Legs */}
           <div className="flex gap-1 -mt-1">
              <div className="w-5 h-12 bg-[#2c3e50] rounded-b-lg border-2 border-black/10" />
              <div className="w-5 h-12 bg-[#2c3e50] rounded-b-lg border-2 border-black/10" />
           </div>

           {/* 4. Arms & Sling Line */}
           <div className="absolute inset-0">
             {dragPos ? (
               <svg className="absolute overflow-visible w-full h-full pointer-events-none">
                 {/* Back Arm */}
                 <line 
                   x1="30" y1="50" 
                   x2={dragPos.x - (SLING_POS.x - 48)} 
                   y2={dragPos.y - (SLING_POS.y - 40)} 
                   stroke="#333" 
                   strokeWidth="6" 
                   strokeLinecap="round"
                 />
                 {/* The Elastic/Sling */}
                 <path 
                   d={`M 30,50 Q 48,50 ${dragPos.x - (SLING_POS.x - 48)},${dragPos.y - (SLING_POS.y - 40)}`}
                   fill="none" 
                   stroke="#FF6321" 
                   strokeWidth="3" 
                   strokeLinecap="round"
                   opacity="0.8"
                 />
                 {/* The Orange in hand */}
                 <circle 
                   cx={dragPos.x - (SLING_POS.x - 48)} 
                   cy={dragPos.y - (SLING_POS.y - 40)} 
                   r="12" 
                   fill="#FF6321" 
                   stroke="white" 
                   strokeWidth="2" 
                   className="shadow-lg"
                 />
               </svg>
             ) : (
               <div className="absolute left-0 top-12 w-4 h-12 bg-splat-orange rounded-full border-2 border-black/10 rotate-[45deg] origin-top" />
             )}
           </div>
        </div>
      </div>

      {/* Physics Bodies Rendering */}
      {bodies.map(body => (
        <div
          key={body.id}
          className="absolute pointer-events-none flex items-center justify-center"
          style={{
            left: body.x,
            top: body.y,
            transform: `translate(-50%, -50%) rotate(${body.angle}rad)`,
          }}
        >
          {body.type === 'ground' ? (
            <div 
              className="bg-[#E5E4E2] border-t-4 border-gray-300 w-full h-full opacity-5 bg-[radial-gradient(#000_1px,_transparent_1px)] bg-[length:32px_32px]"
              style={{ width: body.width, height: body.height }}
            />
          ) : body.type === 'orange' ? (
            <div 
              className="bg-splat-orange rounded-full border-2 border-white shadow-md relative"
              style={{ width: 30, height: 30 }}
            >
              <div className="absolute top-0 left-1/2 w-1 h-2 bg-green-700 -translate-x-1/2 rounded-full" />
            </div>
          ) : body.type === 'target' ? (
            <div className="flex flex-col items-center">
              {/* Detailed Arancere Figure (Target) */}
              <div className="relative flex flex-col items-center">
                {/* 1. Leather Helmet (The Mask) */}
                <div className="w-8 h-8 bg-[#1a1a1a] rounded-full border-2 border-black shadow-lg relative z-20 overflow-hidden">
                  {/* Eye Slits / Grille */}
                  <div className="absolute top-3 left-0 w-full h-1.5 bg-[#444] flex gap-1 px-1">
                    <div className="w-full h-full bg-black/40 rounded-sm" />
                  </div>
                  {/* Helmet Detail */}
                  <div className="absolute top-0 left-1 w-1 h-3 bg-white/5 rounded-full" />
                </div>

                {/* 2. Padded Neck Protector */}
                <div className="w-6 h-3 bg-[#2c3e50] -mt-1 rounded-full z-10 border border-black/20" />

                {/* 3. Padded Torso / Quilted Jacket */}
                <div 
                  className="w-11 h-14 rounded-xl border-2 border-black/10 shadow-inner -mt-1 relative z-10 overflow-hidden"
                  style={{ backgroundColor: body.id % 2 === 0 ? '#E8E4C9' : '#D6CFAE' }}
                >
                   {/* Quilted pattern */}
                   <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#000_1px,transparent_1px),linear-gradient(-45deg,#000_1px,transparent_1px)] bg-[length:6px_6px]" />
                   
                   {/* Protective Padding Lines */}
                   <div className="absolute inset-0 flex flex-col justify-around py-2 px-1">
                      <div className="h-[1px] bg-black/5 w-full" />
                      <div className="h-[1px] bg-black/5 w-full" />
                   </div>
                </div>

                {/* 4. Arms silhouette */}
                <div 
                  className="absolute -left-2 top-8 w-4 h-10 rounded-full border-2 border-black/10 rotate-12 z-0" 
                  style={{ backgroundColor: body.id % 2 === 0 ? '#E8E4C9' : '#D6CFAE' }} 
                />
                <div 
                  className="absolute -right-2 top-8 w-4 h-10 rounded-full border-2 border-black/10 -rotate-12 z-0" 
                  style={{ backgroundColor: body.id % 2 === 0 ? '#E8E4C9' : '#D6CFAE' }} 
                />
              </div>
            </div>
          ) : (
            <div 
              className={`border-2 border-[#5D2906] shadow-sm ${body.isCircle ? 'rounded-full bg-gray-800' : 'bg-[#8B4513]'}`}
              style={{ 
                width: body.width,
                height: body.height,
              }} 
            />
          )}
        </div>
      ))}

      {/* Decorative Carriage Elements (Statics) */}
      <div 
        className="absolute pointer-events-none opacity-20 transition-all duration-500"
        style={{ 
          left: Math.max(dimensions.width * 0.8, 300) + 120, 
          top: GROUND_Y - 140 
        }}
      >
         {/* Detailed Horse Silhouette (SVG) */}
         <div className="relative flex gap-4">
            {[0, 1].map((i) => (
              <svg 
                key={i}
                width="140" 
                height="100" 
                viewBox="0 0 512 512" 
                className={`fill-gray-900 ${i === 1 ? '-ml-20 scale-95 opacity-60' : ''}`}
                style={{ transform: i === 1 ? 'translateX(-20px)' : 'none' }}
              >
                <path d="M495.9,328.1c-1.3-4.1-4.8-7.1-9.1-7.6l-51.4-6.3c-11.4-1.4-21.5-8.4-27.1-18.7l-24.1-44.2 c-9.1-16.7-26.6-27.1-45.7-27.1H218.4c-12,0-23.4,4.2-32.4,11.8L83.7,322.3c-4.4,3.7-6.2,9.7-4.5,15.1l20.4,65.6 c1.7,5.5,7.2,8.9,12.7,8.2l34.8-4.3c4.1-0.5,7.7-3.1,9.4-6.8l7.2-15.5c4.7-10.1,14.6-16.4,25.7-16h40.3c11.1-0.4,21,5.9,25.7,16 l7.2,15.5c1.7,3.7,5.3,6.3,9.4,6.8l34.8,4.3c5.5,0.7,11-2.7,12.7-8.2l20.4-65.6c1.7-5.5,0-11.4-4.5-15.1l-102.3-86.3h119.5 c10.3,0,19.3,6.3,22.8,16l24.1,65.7c2.5,6.8,8.2,11.8,15.3,13.2l51.4,10.2c5.5,1.1,11-2.7,12.7-8.2L495.9,328.1z"/>
                <path d="M192,208c0-53,43-96,96-96s96,43,96,96c0,53-43,96-96,96S192,261,192,208z M480,128c0-35.3-28.7-64-64-64h-32 c-35.3,0-64,28.7-64,64s28.7,64,64,64h32C451.3,192,480,163.3,480,128z M128,128c0 35.3 28.7 64 64 64h32 c35.3 0 64-28.7 64-64s-28.7-64-64-64h-32C156.7 64 128 92.7 128,128z"/>
              </svg>
            ))}
            
            {/* Reins connecting to carriage area */}
            <svg className="absolute top-1/2 -left-32 w-48 h-20 overflow-visible">
               <path 
                 d="M0,0 Q100,20 180,0" 
                 fill="none" 
                 stroke="#1a1a1a" 
                 strokeWidth="2" 
                 className="opacity-40"
               />
               <path 
                 d="M0,10 Q100,30 180,10" 
                 fill="none" 
                 stroke="#1a1a1a" 
                 strokeWidth="2" 
                 className="opacity-40"
               />
            </svg>
         </div>
      </div>

      {/* Trajectory Hint */}
      {dragPos && (
        <svg className="absolute inset-0 pointer-events-none z-0">
          <path 
             d={`M ${SLING_POS.x} ${SLING_POS.y} Q ${SLING_POS.x + (SLING_POS.x - dragPos.x) * 1.5} ${SLING_POS.y + (SLING_POS.y - dragPos.y) * 1.5} ${SLING_POS.x + (SLING_POS.x - dragPos.x) * 3} ${GROUND_Y}`}
             fill="none"
             stroke="#FF6321"
             strokeWidth="2"
             strokeDasharray="4 4"
             opacity="0.2"
          />
        </svg>
      )}

      {/* Floating Instructions */}
      {(!hasThrown && gameState === 'aiming' && !dragPos) ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center"
        >
          <div className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-3xl shadow-xl border border-splat-orange/20">
            <p className="text-splat-orange font-display text-2xl tracking-tight mb-1">STRIKE THE CARRIAGE!</p>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]">Drag from the Arancere and release</p>
          </div>
        </motion.div>
      ) : (hasThrown && gameState !== 'resetting') && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center"
        >
          <div className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-3xl shadow-xl border border-splat-orange/20">
            <p className="text-splat-orange font-display text-2xl tracking-tight mb-1">STRIKE COMPLETE</p>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]">Hit Replay for another shot</p>
          </div>
        </motion.div>
      )}

      {/* Game Decoration */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none opacity-5 flex gap-20">
         <div className="text-9xl font-display text-splat-orange">SPLAT</div>
         <div className="text-9xl font-display text-splat-orange">IVREA</div>
      </div>
    </div>
  );
}
