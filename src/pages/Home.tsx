import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Globe from '../components/Globe';
import { Festival } from '../constants';
import { ExternalLink, X, ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);

  // Random position for the Easter Egg orange, constrained to outer safe zones to avoid central text and global elements
  const orangePos = useMemo(() => {
    const corners = [
      { top: '15vh', left: '10vw' },   // Top Left (under logo area)
      { top: '15vh', left: '85vw' },   // Top Right (under nav area)
      { top: '80vh', left: '10vw' },   // Bottom Left
      { top: '80vh', left: '85vw' },   // Bottom Right
    ];
    // Add small random jitter within these safe spots
    const base = corners[Math.floor(Math.random() * corners.length)];
    const topVal = parseInt(base.top);
    const leftVal = parseInt(base.left);
    
    return {
      top: `${topVal + (Math.random() * 5 - 2.5)}vh`,
      left: `${leftVal + (Math.random() * 5 - 2.5)}vw`
    };
  }, []);

  return (
    <div className="flex flex-col relative">
      {/* Random Floating Orange (Easter Egg) */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        style={{
          position: 'absolute',
          top: orangePos.top,
          left: orangePos.left,
          zIndex: 100,
        }}
        className="pointer-events-auto"
      >
        <Link 
          to="/game"
          className="block group"
          title="Hidden Game!"
        >
          <motion.img 
            src="/orange.png" 
            alt="Easter Egg Orange" 
            className="w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-2xl cursor-pointer bg-orange-500 rounded-full border-2 border-white/50"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            whileHover={{ scale: 1.2, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
          />
        </Link>
      </motion.div>
      {/* Hero Content Section */}
      <section className="min-h-screen flex flex-col items-center justify-center p-6 md:p-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl"
        >
          <span className="text-[10px] md:text-sm uppercase tracking-[0.4em] md:tracking-[0.6em] font-bold text-splat-orange mb-4 md:mb-8 block font-mono">
            Worldwide Friendly Battles
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-8xl font-display leading-[0.9] md:leading-[0.85] text-splat-orange mb-6 md:mb-12 select-none">
            SPLAT YOUR <br /> WORLD
          </h2>
          <p className="text-sm md:text-xl max-w-xl mx-auto text-gray-500 leading-relaxed font-medium px-4">
            From citrus-filled streets to color-drenched plazas. 
            Discover the most vibrant festivals where the only rule is to have fun.
          </p>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-12 md:mt-16 text-splat-orange flex flex-col items-center gap-2 z-20"
        >
          <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold opacity-100 drop-shadow-sm">Scroll to Explore the World</span>
          <ChevronDown size={20} className="md:w-6 md:h-6" />
        </motion.div>

        {/* Floating background elements matching StatuePage style */}
        <div className="absolute top-1/4 -left-20 w-48 h-48 md:w-64 md:h-64 bg-splat-orange/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 md:w-80 md:h-80 bg-splat-peach/30 rounded-full blur-3xl" />
      </section>

      {/* 3D Globe Section */}
      <section className="h-[80vh] md:h-screen w-full relative flex items-center justify-center bg-white/50">
        <div className="w-full h-full">
          <Globe onSelect={setSelectedFestival} />
        </div>
        
        {/* Info Popup Overlay */}
        <AnimatePresence>
          {selectedFestival && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-8 md:bottom-12 right-0 left-0 mx-auto w-[92%] md:w-[450px] bg-white border border-splat-peach p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(255,99,33,0.15)] z-20"
            >
              <button 
                onClick={() => setSelectedFestival(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 hover:bg-splat-peach/20 rounded-full transition-colors group"
              >
                <X size={18} className="text-splat-orange/40 group-hover:text-splat-orange" />
              </button>

              <div className="pr-2 md:pr-4">
                <div className="flex gap-2 items-center mb-3 md:mb-4">
                  <span className="px-2 py-0.5 md:px-3 md:py-1 bg-splat-peach text-splat-orange text-[8px] md:text-[9px] uppercase tracking-widest font-bold rounded-full">
                    {selectedFestival.country}
                  </span>
                  <span className="text-[8px] md:text-[9px] uppercase tracking-widest font-bold text-gray-400">
                    {selectedFestival.date}
                  </span>
                </div>
                
                <h3 className="text-3xl md:text-5xl font-display text-splat-orange mb-3 md:mb-4 leading-none">
                  {selectedFestival.name}
                </h3>
                
                <p className="text-xs md:text-base text-gray-500 mb-6 md:mb-8 leading-relaxed font-medium">
                  {selectedFestival.description}
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-splat-peach/30 pt-6">
                  <a 
                    href={selectedFestival.link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[9px] md:text-[10px] uppercase tracking-widest font-black flex items-center justify-center sm:justify-start gap-2 hover:text-splat-orange transition-colors"
                  >
                    Official Site <ExternalLink size={14} />
                  </a>

                  {selectedFestival.id === 'ivrea' ? (
                    <Link 
                      to="/statue"
                      className="bg-splat-orange text-white text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-black px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl flex items-center justify-center gap-3 hover:bg-splat-tangerine transition-all hover:-translate-y-1 shadow-lg shadow-splat-orange/20"
                    >
                      Discover More <ArrowRight size={16} />
                    </Link>
                  ) : null}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Decorative Blur Elements */}
      <div className="fixed top-1/4 -left-32 w-96 h-96 bg-splat-peach/20 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 -right-32 w-96 h-96 bg-splat-orange/10 blur-[120px] rounded-full pointer-events-none -z-10" />
    </div>
  );
}
