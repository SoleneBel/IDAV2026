import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import StatueExplorer from '../components/StatueExplorer';
import { 
  History, 
  Users, 
  Sparkles, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Music, 
  Volume2,
  Trophy,
  Shield,
  Flame,
  Anchor
} from 'lucide-react';

const CURIOSITIES = [
  {
    id: 1,
    title: 'The "Pich e Pala"',
    content: 'The emblem of the historic carnival combines the Phrygian cap, a pickaxe and shovel (symbolizing farm work), and the Abb\u2019s short sword with an orange, encapsulating the tradition.',
    icon: <Shield className="text-splat-orange" size={32} />
  },
  {
    id: 2,
    title: '"Arvedze a giobia \u2018n bot"',
    content: 'The traditional celebratory phrase meaning "See you on next Thursday at 1 o\'clock", marking the deep, cyclical bond Ivrea has with its carnival.',
    icon: <Music className="text-splat-orange" size={32} />
  },
  {
    id: 3,
    title: 'Lo Scarlo',
    content: 'A tall pole wrapped in dry heather is set ablaze to close the Carnival. A fire that burns quickly to the top is celebrated as a powerful omen for a prosperous year.',
    icon: <Flame className="text-splat-orange" size={32} />
  },
  {
    id: 4,
    title: 'Ground vs Carts',
    content: 'The battle pits foot-throwers (representing citizens) against those on horse-drawn carts (tyrant\'s guards). While the carts wear heavy leather armor and helmets, the foot-throwers have no protection.',
    icon: <Trophy className="text-splat-orange" size={32} />
  },
  {
    id: 5,
    title: 'La Preda in Dora',
    content: 'A medieval ritual where a stone from the tyrant\'s ruined castle is thrown into the river. It symbolizes the city\'s eternal vow to never let oppression rise again.',
    icon: <Anchor className="text-splat-orange" size={32} />
  },
  {
    id: 6,
    title: 'The Chivalry Code',
    content: 'Amidst the chaotic battle, a strict code of honor prevails. Fierce one-on-one duels between throwers often end with a handshake or a nod of mutual respect.',
    icon: <Users className="text-splat-orange" size={32} />
  }
];

const AUDIO_TRACKS = [
  { 
    id: 'battle', 
    name: 'The Battle', 
    desc: 'The chaotic sounds of the square and flying oranges.',
    src: '/music/FOOD FIGHT.mp3' 
  },
  { 
    id: 'anthem', 
    name: 'The Carnival Anthem', 
    desc: 'The official historic song "Canzone del Carnevale".',
    src: '/music/Inno_Storico_Carnevale_Di_Ivrea.mp3' 
  },
  { 
    id: 'pifferi', 
    name: 'Pifferi e Tamburi', 
    desc: 'Traditional marching fifes and drums.',
    src: '/music/pifferi.mp3' 
  }
];

export default function StatuePage() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const nextSlide = () => setSlideIndex((prev) => (prev + 1) % CURIOSITIES.length);
  const prevSlide = () => setSlideIndex((prev) => (prev - 1 + CURIOSITIES.length) % CURIOSITIES.length);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const time = parseFloat(e.target.value);
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleTrack = (id: string) => {
    if (!audioRef.current) return;

    if (playingTrack === id) {
      audioRef.current.pause();
      setPlayingTrack(null);
    } else {
      const track = AUDIO_TRACKS.find(t => t.id === id);
      if (track) {
        audioRef.current.src = track.src;
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        setPlayingTrack(id);
      }
    }
  };

  return (
    <div className="bg-splat-white min-h-screen">
      <audio 
        ref={audioRef} 
        onEnded={() => setPlayingTrack(null)} 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        className="hidden"
      />
      {/* 0. Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center p-6 md:p-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl"
        >
          <span className="text-[10px] md:text-sm uppercase tracking-[0.4em] md:tracking-[0.6em] font-bold text-splat-orange mb-4 md:mb-8 block font-mono">
            Tradition & Rebellion
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-8xl font-display leading-[0.9] md:leading-[0.85] text-splat-orange mb-6 md:mb-12 select-none">
            THE IVREA <br /> CARNIVAL
          </h2>
          <p className="max-w-xl mx-auto text-gray-500 text-sm md:text-xl leading-relaxed font-medium px-4">
            Step into the heart of Italy's most unique festival. A three-day battle 
            in which oranges becomes a symbol of freedom and historical pride.
          </p>
        </motion.div>

        {/* Floating background elements */}
        <div className="absolute top-1/4 -left-20 w-48 h-48 md:w-64 md:h-64 bg-splat-orange/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 md:w-80 md:h-80 bg-splat-peach/30 rounded-full blur-3xl" />
        
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-splat-orange flex flex-col items-center gap-2"
        >
          <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold opacity-50">Scroll to Explore</span>
          <ChevronDown size={20} />
        </motion.div>
      </section>

      {/* 1. History Section (The Legend) */}
      <section className="py-20 md:py-48 px-6 md:px-24 bg-white relative overflow-hidden border-b border-splat-peach/20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 text-splat-orange mb-3 md:mb-6">
              <History size={18} className="md:w-6 md:h-6" />
              <span className="text-[10px] md:text-sm font-bold uppercase tracking-wider">The Legend</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-6xl font-display text-splat-orange mb-4 md:mb-8 uppercase leading-tight">
              A Rebellion <br className="hidden md:block" /> Against Tyranny
            </h2>
            <div className="space-y-4 md:space-y-6 text-gray-600 text-sm md:text-lg leading-relaxed">
              <p>
                The foundations of the Carnival lie in a medieval rebellion. Legend has it that 
                the city was once ruled by a cruel baron who attempted to exercise the "jus primae noctis" 
                over the daughter of a local miller.
              </p>
              <p className="font-semibold text-splat-orange">
                Violetta, the miller's daughter, chose defiance over submission. 
              </p>
              <p>
                She beheaded the tyrant, sparking a popular uprising that saw the citizens 
                storm the castle (the "Castellazzo") and tear it down stone by stone, 
                reclaiming their freedom.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-video md:aspect-square rounded-3xl md:rounded-[3.3rem] overflow-hidden shadow-2xl relative group"
          >
            <iframe
              className="w-full h-full object-cover"
              src="https://www.youtube.com/embed/5BhRe00O-sQ?autoplay=1&mute=0&loop=1&playlist=5BhRe00O-sQ&controls=1&showinfo=0&rel=0"
              title="Historical Carnival of Ivrea - Battle of the Oranges"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <div className="absolute inset-0 bg-splat-orange/10 group-hover:bg-transparent transition-colors pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 z-10">
              <p className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] font-bold text-white mb-1 drop-shadow-md">Live Action</p>
              <p className="font-display text-lg md:text-xl text-white uppercase drop-shadow-md">The Battle of the Oranges</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Character Section */}
      <section className="py-20 md:py-48 px-6 md:px-24 bg-splat-white border-b border-splat-peach/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-16 md:mb-24 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="flex items-center gap-3 text-splat-orange mb-3"
            >
              <Users size={18} className="md:w-6 md:h-6" />
              <span className="text-[10px] md:text-sm font-bold uppercase tracking-wider">Protagonists</span>
            </motion.div>
            <h2 className="text-2xl md:text-6xl font-display text-splat-orange uppercase leading-none">
              The Soul of the Feast
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Mugnaia",
                name: "The Miller's Daughter",
                desc: "Violetta, the undisputed heroine. She rides her carriage through the crowds, throwing mimosa flowers and symbolizing the city's freedom.",
                color: "bg-white",
                image: "/mugnaia.jpg"
              },
              {
                title: "Generale",
                name: "The General",
                desc: "A Napoleonic figure who leads the celebration. He is responsible for maintaining order and representing the military tradition of the revolution.",
                color: "bg-splat-peach/5 md:bg-splat-peach/10",
                image: "/generale.jpg"
              },
              {
                title: "Aranceri",
                name: "The Orange Throwers",
                desc: "Representing both the people (on foot) and the tyrant's guards (on carts), they engage in the famous citrus-fueled battle.",
                color: "bg-white",
                image: "/aranceri.jpg"
              }
            ].map((char, i) => (
              <motion.div
                key={char.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className={`${char.color} p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-splat-peach/30 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 overflow-hidden`}
              >
                <div className="aspect-[4/3] -mx-6 -mt-6 md:-mx-10 md:-mt-10 mb-6 md:mb-8 overflow-hidden bg-gray-100">
                   <img 
                    src={char.image} 
                    alt={char.title} 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" 
                    referrerPolicy="no-referrer"
                   />
                </div>
                <div className="text-[9px] md:text-[10px] uppercase font-black text-splat-orange/50 tracking-[0.2em] md:tracking-[0.3em] mb-4">
                  Personaggio
                </div>
                <h3 className="text-2xl md:text-3xl font-display text-splat-orange mb-2 uppercase leading-none">
                  {char.title}
                </h3>
                <h4 className="text-[10px] md:text-sm font-black text-gray-400 mb-4 md:mb-6 uppercase tracking-widest">{char.name}</h4>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-medium">
                  {char.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. The Statue (L'Arancere section) */}
      <section className="py-20 md:py-48 px-4 md:px-24 bg-white border-b border-splat-peach/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-12 md:mb-16 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="flex items-center gap-3 text-splat-orange mb-3 md:mb-6"
            >
              <History size={18} className="md:w-6 md:h-6" />
              <span className="text-[10px] md:text-sm font-bold uppercase tracking-widest">Ivrea Heritage</span>
            </motion.div>
            <h2 className="text-3xl md:text-8xl font-display text-splat-orange uppercase leading-none mb-4 md:mb-8 px-2">
              L'ARANCERE
            </h2>
            <div className="max-w-3xl mx-auto px-4">
              <p className="text-gray-500 text-sm md:text-2xl leading-relaxed font-medium">
                The iconic representation of a carnival orange thrower. 
                Explore the details of the fighter's pose and the historical weight of the battle.
              </p>
            </div>
          </div>
          
          {/* Container Frame to isolate interaction */}
          <div className="relative aspect-square md:aspect-video w-full rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl border-[8px] md:border-[24px] border-splat-peach/10 bg-splat-peach/5">
            <div className="absolute inset-0 z-0">
               <StatueExplorer />
            </div>
          </div>
          
          <div className="mt-8 md:mt-12 text-center px-4">
            <p className="text-[8px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.4em] font-black text-splat-orange/40">
              Interactive Examination • Use Mouse/Touch to Explore
            </p>
          </div>
        </div>
      </section>

      {/* 4. Hear the Carnival (Audio) */}
      <section className="py-20 md:py-48 px-6 md:px-24 bg-splat-white border-b border-splat-peach/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
             <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
             >
                <div className="flex items-center gap-3 text-splat-orange mb-3 md:mb-6">
                  <Play size={18} className="md:w-6 md:h-6 fill-current" />
                  <span className="text-[10px] md:text-sm font-bold uppercase tracking-wider">Immersive Audio</span>
                </div>
                <h2 className="text-2xl md:text-6xl font-display text-splat-orange mb-6 md:mb-8 uppercase leading-tight">
                  Hear the <br className="hidden md:block" /> Rebellion
                </h2>
                <p className="text-gray-600 text-sm md:text-lg leading-relaxed font-medium mb-6 md:mb-12">
                  Close your eyes and feel the atmosphere of Ivrea. From the roaring battle 
                  in the square to the legendary hymns that have guided the rebellion for centuries.
                </p>

                <div className="space-y-3 md:space-y-4">
                   {AUDIO_TRACKS.map((track) => (
                      <div 
                        key={track.id}
                        className={`group p-4 md:p-6 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          playingTrack === track.id 
                            ? 'bg-splat-orange border-splat-orange shadow-orange-200/50 shadow-xl' 
                            : 'bg-white border-splat-peach/20 hover:border-splat-orange hover:shadow-lg'
                        }`}
                        onClick={() => toggleTrack(track.id)}
                      >
                         <div className="flex items-center gap-4 md:gap-6">
                            <div className={`p-3 md:p-4 rounded-xl transition-all ${
                               playingTrack === track.id ? 'bg-white/20' : 'bg-splat-peach/10 text-splat-orange'
                            }`}>
                               {playingTrack === track.id ? (
                                 <Pause size={16} className="md:w-5 md:h-5 fill-current text-white" />
                               ) : (
                                 <Play size={16} className="md:w-5 md:h-5 fill-current" />
                               )}
                            </div>
                            <div>
                               <h4 className={`text-xs md:text-sm font-bold uppercase tracking-widest ${
                                 playingTrack === track.id ? 'text-white' : 'text-gray-800'
                               }`}>
                                 {track.name}
                               </h4>
                               <p className={`text-[10px] md:text-xs ${
                                 playingTrack === track.id ? 'text-white/70' : 'text-gray-400'
                               }`}>
                                 {track.desc}
                               </p>
                            </div>
                         </div>
                         
                         <div className="flex items-end gap-0.5 md:gap-1 h-4 md:h-6">
                            {[1, 2, 3, 4, 5].map((bar) => (
                               <motion.div
                                 key={bar}
                                 animate={{ height: playingTrack === track.id ? [4, 16, 8, 12, 4] : 2 }}
                                 transition={{ repeat: Infinity, duration: 0.5 + bar * 0.1, ease: "linear" }}
                                 className={`w-0.5 rounded-full ${
                                   playingTrack === track.id ? 'bg-white' : 'bg-splat-orange/20'
                                 }`}
                               />
                            ))}
                         </div>
                      </div>
                   ))}
                </div>
             </motion.div>

             <div className="relative">
                <div className="absolute inset-0 bg-splat-orange rounded-3xl md:rounded-[4rem] -rotate-3 opacity-10" />
                <motion.div 
                  className="relative bg-white aspect-square md:aspect-[4/5] rounded-3xl md:rounded-[4rem] p-8 md:p-12 border border-splat-peach/30 shadow-2xl flex flex-col items-center justify-center overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                >
                   <motion.div 
                     animate={{ scale: playingTrack ? [1, 1.5, 1] : 1, opacity: playingTrack ? [0.1, 0, 0.1] : 0.05 }}
                     transition={{ repeat: Infinity, duration: 2 }}
                     className="absolute w-48 h-48 md:w-80 md:h-80 border-4 border-splat-orange rounded-full"
                   />
                   
                   <div className="relative z-10 text-center w-full px-4 md:px-8">
                     <div className={`w-20 h-20 md:w-32 md:h-32 rounded-full flex items-center justify-center transition-all duration-700 mx-auto mb-6 md:mb-10 ${
                       playingTrack ? 'bg-splat-orange scale-110 shadow-2xl shadow-orange-500/20' : 'bg-splat-peach/10'
                     }`}>
                        <Volume2 size={32} className={`md:w-12 md:h-12 ${playingTrack ? 'text-white translate-x-1' : 'text-splat-orange/40'}`} />
                     </div>
                     <h3 className="text-xl md:text-3xl font-display text-splat-orange uppercase leading-tight mb-4 md:mb-8">
                       {playingTrack ? playingTrack.replace('-', ' ') : 'Select a sound'}
                     </h3>

                     {playingTrack && (
                       <motion.div 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="w-full max-w-xs mx-auto"
                       >
                         <input 
                           type="range" 
                           min="0" 
                           max={duration || 0} 
                           value={currentTime} 
                           onChange={handleSeek}
                           className="w-full h-1 bg-splat-peach/30 rounded-lg appearance-none cursor-pointer accent-splat-orange mb-3"
                         />
                         <div className="flex justify-between text-[9px] font-bold text-splat-orange/60 uppercase tracking-widest">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                         </div>
                       </motion.div>
                     )}
                   </div>
                </motion.div>
             </div>
          </div>
        </div>
      </section>

      {/* 5. Hidden Gems (Curiosities Slideshow) */}
      <section className="py-20 md:py-48 px-4 md:px-24 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center mb-12 md:mb-16 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="flex items-center gap-3 text-splat-orange mb-3"
            >
              <Sparkles size={18} className="md:w-6 md:h-6" />
              <span className="text-[10px] md:text-sm font-bold uppercase tracking-wider">Hidden Gems</span>
            </motion.div>
            <h2 className="text-2xl md:text-6xl font-display text-splat-orange uppercase">
              Carnival Curiosities
            </h2>
          </div>

          <div className="relative bg-splat-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-24 border border-splat-peach/20 shadow-2xl overflow-hidden min-h-[350px] md:min-h-[400px] flex items-center justify-center">
             <AnimatePresence mode="wait">
                <motion.div
                   key={slideIndex}
                   initial={{ opacity: 0, x: 50, scale: 0.95 }}
                   animate={{ opacity: 1, x: 0, scale: 1 }}
                   exit={{ opacity: 0, x: -50, scale: 0.95 }}
                   transition={{ duration: 0.5, ease: "anticipate" }}
                   className="relative z-10 text-center max-w-2xl"
                >
                   <div className="mb-6 md:mb-8 flex justify-center">
                      <div className="p-4 md:p-6 bg-white rounded-2xl md:rounded-3xl shadow-lg border border-splat-peach/30 inline-block">
                         {React.cloneElement(CURIOSITIES[slideIndex].icon as React.ReactElement<any>, { size: 24, className: 'md:w-8 md:h-8 text-splat-orange' })}
                      </div>
                   </div>
                   <h3 className="text-2xl md:text-5xl font-display text-splat-orange mb-4 md:mb-6 uppercase leading-tight">
                     {CURIOSITIES[slideIndex].title}
                   </h3>
                   <p className="text-base md:text-xl text-gray-600 leading-relaxed font-medium">
                     {CURIOSITIES[slideIndex].content}
                   </p>
                </motion.div>
             </AnimatePresence>

             {/* Mobile Navigation Arrows */}
             <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 md:hidden">
                <button onClick={prevSlide} className="p-3 rounded-full bg-white text-splat-orange shadow-lg">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={nextSlide} className="p-3 rounded-full bg-white text-splat-orange shadow-lg">
                  <ChevronRight size={20} />
                </button>
             </div>

             {/* Desktop Navigation Arrows */}
             <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-8">
                <button onClick={prevSlide} className="p-4 rounded-full bg-white text-splat-orange shadow-xl hover:bg-splat-orange hover:text-white transition-all transform hover:scale-110 active:scale-95">
                  <ChevronLeft size={24} />
                </button>
             </div>
             <div className="hidden md:block absolute top-1/2 -translate-y-1/2 right-8">
                <button onClick={nextSlide} className="p-4 rounded-full bg-white text-splat-orange shadow-xl hover:bg-splat-orange hover:text-white transition-all transform hover:scale-110 active:scale-95">
                  <ChevronRight size={24} />
                </button>
             </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <section className="py-20 md:py-24 bg-splat-orange text-white text-center">
        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           className="max-w-2xl mx-auto px-6"
        >
          <h2 className="text-3xl md:text-6xl font-display uppercase mb-6 md:mb-8">Ready for the Battle?</h2>
          <p className="text-white/80 text-sm md:text-base font-medium mb-8 md:mb-12">
            The History of Ivrea is written in the juice of oranges. 
            Join the rebellion, wear your Phrygian cap, and become part of the legend.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link 
              to="/game" 
              className="bg-black/20 text-white border-2 border-white/20 px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-bold uppercase tracking-widest text-[9px] md:text-[10px] hover:bg-white hover:text-splat-orange transition-all flex items-center justify-center gap-2"
            >
              Play the Battle
            </Link>
            <Link 
              to="/experience" 
              className="bg-black/20 text-white border-2 border-white/20 px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-bold uppercase tracking-widest text-[9px] md:text-[10px] hover:bg-white hover:text-splat-orange transition-all flex items-center justify-center gap-2"
            >
              Full Cultural Experience
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
