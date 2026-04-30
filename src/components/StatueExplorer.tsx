import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Float, Center, useGLTF } from '@react-three/drei';
import { STATUE_POINTS } from '../constants';
import { Info, ExternalLink, X, Shield } from 'lucide-react';

interface StatuePoint {
  position: number[];
  title: string;
  description: string;
  image?: string;
}

function StatueModel({ onSelect, selectedPoint }: { onSelect: (p: StatuePoint) => void, selectedPoint: StatuePoint | null }) {
  const { scene } = useGLTF('/models/statue.glb');

  return (
    <group>
      <primitive object={scene} />
      
      {/* Annotations */}
      {STATUE_POINTS.map((point, index) => {
        const isSelected = selectedPoint?.title === point.title;
        return (
          <Html key={index} position={point.position as any} distanceFactor={8}>
            <div className="group relative">
              <button 
                onClick={() => onSelect(point)}
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center cursor-pointer transition-all shadow-md ${
                  isSelected 
                    ? 'bg-splat-orange border-white scale-125 opacity-100' 
                    : 'bg-white/50 border-white/80 hover:bg-white/90 hover:scale-125 opacity-70 hover:opacity-100'
                }`}
              >
                <Info size={8} className={isSelected ? 'text-white' : 'text-splat-orange/80'} />
              </button>
              
              {!selectedPoint && (
                <div className="absolute left-8 top-1/2 -translate-y-1/2 w-48 bg-white p-3 rounded-xl shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none border border-splat-peach">
                  <h4 className="font-bold text-xs text-splat-orange mb-1">{point.title}</h4>
                  <p className="text-[10px] leading-tight text-gray-500">Click to learn more</p>
                </div>
              )}
            </div>
          </Html>
        );
      })}
    </group>
  );
}

export default function StatueExplorer() {
  const [selectedPoint, setSelectedPoint] = useState<StatuePoint | null>(null);

  return (
    <div className="h-full w-full relative bg-splat-peach/30 overflow-hidden flex flex-col md:flex-row">
      {/* Sidebar Info Panel (Approfondimento) */}
      <AnimatePresence>
        {selectedPoint && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 h-full w-full max-w-[300px] md:max-w-[360px] bg-white shadow-2xl z-50 p-6 md:p-10 flex flex-col border-l border-splat-peach/20 overflow-y-auto"
          >
            <motion.div
              key={selectedPoint.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-splat-orange/60">
                  Approfondimento
                </span>
                <button 
                  onClick={() => setSelectedPoint(null)}
                  className="p-1.5 hover:bg-splat-peach/10 rounded-full transition-colors text-gray-400 hover:text-splat-orange"
                >
                  <X size={18} />
                </button>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-display text-splat-orange mb-6 leading-tight uppercase">
                {selectedPoint.title}
              </h3>

              {selectedPoint.image && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8 rounded-2xl overflow-hidden aspect-video shadow-xl bg-gray-100 border border-splat-peach/20"
                >
                  <img 
                    src={selectedPoint.image} 
                    alt={selectedPoint.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              )}

              <div className="w-12 h-1 bg-splat-peach mb-8" />
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                {selectedPoint.description}
              </p>
              
              <div className="mt-12 pt-8 border-t border-gray-100 italic text-[10px] text-gray-400">
                Parte della collezione storica "L'Arancere". 
                Esplora gli altri punti per completare la storia.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 relative order-2 md:order-1 h-full">
        {/* Header Info Overlay (Left Side) */}
        <div className="absolute top-8 left-6 md:top-12 md:left-10 text-left z-10 pointer-events-none w-full max-w-[200px] md:max-w-sm">
          <motion.div
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Shield size={16} className="text-splat-orange" />
              <span className="text-[10px] md:text-xs uppercase tracking-[0.5em] font-bold text-splat-orange block">
                The Legacy in Clay
              </span>
            </div>
            
            <div className="space-y-4">
              <p className="text-[10px] md:text-sm text-gray-600 leading-relaxed font-semibold">
                Captured in <span className="text-splat-orange">"cotto forte"</span> by artist Miro Gianola in 2003, 
                this monument embodies the physical synthesis of the Carnival's spirit.
              </p>
              <p className="text-[9px] md:text-xs text-gray-500 leading-relaxed">
                Meticulously restored and inaugurated on February 8, 2026, it now stands in 
                the historic courtyard of the former Principe Tommaso barracks.
              </p>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="text-[8px] md:text-[10px] text-splat-orange font-bold uppercase tracking-[0.2em] pt-2"
              >
                Tap markers to uncover hidden symbols
              </motion.p>
            </div>
          </motion.div>
        </div>

        {/* 3D Scene */}
        <div className="w-full h-full cursor-grab active:cursor-grabbing min-h-[400px]">
          <Canvas shadows camera={{ position: [0, 0, 10], fov: 35 }}>
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} intensity={2.5} castShadow />
            <spotLight position={[-10, 20, 10]} angle={0.15} penumbra={1} intensity={1.5} />
            
            <Suspense fallback={null}>
              <Center>
                <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
                  <group scale={1} position={[0, -0.5, 0]}>
                    <StatueModel onSelect={setSelectedPoint} selectedPoint={selectedPoint} />
                  </group>
                </Float>
              </Center>
            </Suspense>

            <OrbitControls 
              makeDefault
              enablePan={false}
              enableDamping={true}
              dampingFactor={0.05}
              target={[0, 0, 0]}
              maxPolarAngle={Math.PI / 1.5}
              minPolarAngle={Math.PI / 4}
              minDistance={4}
              maxDistance={12}
              rotateSpeed={0.5}
              autoRotate={!selectedPoint}
              autoRotateSpeed={0.5}
            />
          </Canvas>
        </div>

        {/* Controls Overlay */}
        <div className="absolute bottom-12 left-8 md:left-12 flex flex-col items-start gap-6 z-10">
          <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400 text-left">
            Drag to Rotate<br/>Click markers for details
          </div>
          
          <a 
            href="https://sketchfab.com/3d-models/larancere-f2c9e86023c44360ae938a5d809d6db1"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-black text-white text-[9px] uppercase tracking-widest font-black px-5 py-3 rounded-xl hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 shadow-xl"
          >
            Reference <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
