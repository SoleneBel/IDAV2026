import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isGame = location.pathname === '/game';

  const navLinks = [
    { to: '/', label: 'Explore' },
    { to: '/statue', label: "L'Arancere" },
    { to: '/experience', label: 'Experience' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="absolute top-0 left-0 right-0 z-50 p-6 md:p-10 flex justify-between items-center pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto"
        >
          <Link to="/" className="block">
            <img 
              src="/splat.png" 
              alt="SPLAT !" 
              className="w-32 md:w-50 object-contain drop-shadow-sm hover:scale-105 transition-transform cursor-pointer" 
            />
          </Link>
        </motion.div>
        
        {/* Desktop Nav */}
        <nav className="pointer-events-auto hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.to}
              to={link.to} 
              className={`text-xs uppercase tracking-[0.2em] font-black transition-colors ${
                location.pathname === link.to ? 'text-splat-orange' : 'text-gray-900 hover:text-splat-orange'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <div className="md:hidden pointer-events-auto">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-splat-orange active:scale-95 transition-transform"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="fixed inset-0 bg-white z-40 p-10 flex flex-col justify-center items-end pointer-events-auto md:hidden"
            >
              <div className="flex flex-col gap-8 text-right">
                {navLinks.map((link) => (
                  <motion.div
                    key={link.to}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      to={link.to}
                      onClick={() => setIsMenuOpen(false)}
                      className={`text-4xl font-display uppercase tracking-tighter ${
                        location.pathname === link.to ? 'text-splat-orange' : 'text-gray-900'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow overflow-hidden">
        {children}
      </main>

      {!isGame && (
        <footer className="p-8 text-center text-[10px] uppercase tracking-[0.2em] opacity-40">
          © 2026 SPLAT ! • All fights are friendly • Avoid the face
        </footer>
      )}
    </div>
  );
}
