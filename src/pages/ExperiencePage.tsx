import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Award,
  Volume2,
  VolumeX,
  ArrowRight,
  RefreshCcw,
  MapPin,
  Crown,
  Users,
  Shield,
  Sprout,
  Sparkles,
  Info,
  ChevronLeft,
  Zap,
  Trophy,
  Eye,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';

interface HeritageMarker {
  label: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Question {
  id: number;
  level: number;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
  marker: HeritageMarker;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    level: 1,
    text: 'Where does the Battle of the Oranges take place?',
    options: ['Turin', 'Milan', 'Ivrea', 'Rome'],
    correct: 2,
    explanation:
      'The Battle of the Oranges takes place in Ivrea, a historic town in Piedmont, northern Italy.',
    marker: {
      label: 'Place',
      title: 'Ivrea, Piedmont',
      description:
        'Ivrea is the city where the Historic Carnival transforms streets and squares into a symbolic civic ritual.',
      icon: <MapPin className="w-4 h-4" />,
    },
  },
  {
    id: 2,
    level: 1,
    text: 'What does the Battle of the Oranges mainly symbolize?',
    options: [
      'A harvest celebration',
      'A popular rebellion against tyranny',
      'A religious ritual',
      'A military parade',
    ],
    correct: 1,
    explanation:
      'The battle represents the people\'s revolt against oppressive power and is connected to freedom and civic identity.',
    marker: {
      label: 'Symbol',
      title: 'Rebellion and freedom',
      description:
        'The Carnival narrative remembers a community that stands against tyranny through a highly codified public performance.',
      icon: <Crown className="w-4 h-4" />,
    },
  },
  {
    id: 3,
    level: 1,
    text: 'Who is the Mugnaia in the Ivrea Carnival tradition?',
    options: [
      'A military leader',
      'A symbolic heroine of freedom',
      'A religious figure',
      'A festival merchant',
    ],
    correct: 1,
    explanation:
      'The Mugnaia is the heroine of the local tradition, commonly associated with Violetta and the refusal of oppression.',
    marker: {
      label: 'Figure',
      title: 'The Mugnaia',
      description:
      'Introduced as a central Carnival figure in the nineteenth century, the Mugnaia embodies dignity, courage and liberation.',
      icon: <Sparkles className="w-4 h-4" />,
    },
  },
  {
    id: 4,
    level: 2,
    text: 'What do the oranges symbolically represent during the battle?',
    options: [
      'Trade goods',
      'Weapons of the people',
      'Religious offerings',
      'Musical instruments',
    ],
    correct: 1,
    explanation:
      'In the ritual battle, oranges become symbolic projectiles that replace older forms of confrontation.',
    marker: {
      label: 'Object',
      title: 'Oranges as symbolic weapons',
      description:
        'The orange is not only a game object: in this context, it becomes a visual symbol of collective resistance.',
      icon: <Shield className="w-4 h-4" />,
    },
  },
  {
    id: 5,
    level: 2,
    text: 'What do the teams on foot represent?',
    options: [
      'The feudal armies',
      'The people who revolted',
      'The musicians',
      'The visiting audience',
    ],
    correct: 1,
    explanation:
      'The teams on foot represent the people, while the aranceri on horse-drawn carts represent the opposing forces.',
    marker: {
      label: 'Roles',
      title: 'People and power',
      description:
        'The structure of the battle makes the opposition visible: people on foot against forces represented on carts.',
      icon: <Users className="w-4 h-4" />,
    },
  },
  {
    id: 6,
    level: 2,
    text: 'Why is La Tomatina a useful comparison?',
    options: [
      'Both are religious rituals',
      'Both are food-based public battles',
      'Both happen in Italy',
      'Both use oranges',
    ],
    correct: 1,
    explanation:
      'Both involve collective food-based play, but Ivrea carries a stronger historical and civic symbolism.',
    marker: {
      label: 'Comparison',
      title: 'Festival comparison',
      description:
        'Comparing Ivrea with La Tomatina helps distinguish playful participation from historically grounded civic memory.',
      icon: <Info className="w-4 h-4" />,
    },
  },
  {
    id: 7,
    level: 2,
    text: 'How is the modern event connected to sustainability?',
    options: [
      'The oranges are reused as souvenirs',
      'The orange pulp can be collected for composting',
      'The oranges are made of plastic',
      'The battle avoids any public cleaning',
    ],
    correct: 1,
    explanation:
      'After the battle, the orange pulp can be collected and treated as organic material, connecting tradition with contemporary sustainability.',
    marker: {
      label: 'Today',
      title: 'Sustainability and care',
      description:
        'The contemporary event is not only spectacular: it also requires organization, cleaning and responsible treatment of organic waste.',
      icon: <Sprout className="w-4 h-4" />,
    },
  },
];

const OrangeIcon = ({ size = 22, animate = false }: { size?: number; animate?: boolean }) => (
  <motion.div
    initial={animate ? { scale: 0, rotate: -180, y: -50 } : false}
    animate={animate ? { scale: 1, rotate: 0, y: 0 } : {}}
    transition={animate ? { type: 'spring', stiffness: 400, damping: 12 } : {}}
  >
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="17" r="12.5" fill="#FF6321" stroke="#E35113" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" fill="#FFD2A1" opacity="0.35" />
      <path d="M16 5c3-3 6-2 7 0-3 1-5 2-7 0Z" fill="#4B7F2A" />
      <path d="M16 5c-1.5 2-1.5 3.5-1 5" stroke="#3D6624" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  </motion.div>
);

const OrangeBasket = ({ count, total }: { count: number; total: number }) => {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-44 h-28">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-12 border-2 border-amber-300 rounded-t-full bg-amber-50" />
        <div className="absolute bottom-0 left-0 right-0 h-20 rounded-b-[2rem] rounded-t-xl border-2 border-amber-200 bg-amber-100 shadow-inner overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,#C9822D,#C9822D_8px,transparent_8px,transparent_16px)]" />
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap-reverse justify-center gap-1.5">
          <AnimatePresence>
            {Array.from({ length: count }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, y: -35, opacity: 0, rotate: -30 }}
                animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 18 }}
              >
                <OrangeIcon size={21} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {count === 0 && (
          <div className="absolute inset-x-0 bottom-6 text-center pointer-events-none">
            <p className="text-[9px] font-bold uppercase tracking-widest text-amber-700/45">
              Correct answers fill the basket
            </p>
          </div>
        )}
      </div>

      <p className="mt-2 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
        Cultural oranges collected: <span className="text-splat-orange">{count}</span>/{total}
      </p>
    </div>
  );
};

const HeritagePath = ({
  unlocked,
  currentIndex,
  onMarkerHover,
}: {
  unlocked: boolean[];
  currentIndex: number;
  onMarkerHover: (index: number | null) => void;
}) => {
  return (
    <div className="w-full rounded-3xl bg-white border border-orange-50 shadow-sm p-5 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-splat-orange">
            Heritage Path
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Unlock cultural markers with correct answers.
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-display text-splat-orange">
            {unlocked.filter(Boolean).length}/{QUESTIONS.length}
          </p>
          <p className="text-[9px] uppercase tracking-widest text-gray-400">markers</p>
        </div>
      </div>

      <div className="relative pt-3">
        <div className="absolute top-7 left-5 right-5 h-0.5 bg-gray-100 rounded-full" />
        <motion.div
          className="absolute top-7 left-5 h-0.5 bg-splat-orange rounded-full"
          animate={{
            width: `${Math.max(0, (unlocked.filter(Boolean).length - 1) / (QUESTIONS.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.4 }}
        />

        <div className="relative flex justify-between">
          {QUESTIONS.map((q, idx) => {
            const isUnlocked = unlocked[idx];
            const isCurrent = idx === currentIndex;

            return (
              <div
                key={q.id}
                className="flex flex-col items-center gap-2 w-10 group"
                onMouseEnter={() => onMarkerHover(idx)}
                onMouseLeave={() => onMarkerHover(null)}
              >
                <motion.div
                  animate={{
                    scale: isCurrent ? 1.08 : 1,
                  }}
                  className={[
                    'w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer',
                    isUnlocked
                      ? 'bg-splat-orange border-splat-orange text-white shadow-lg shadow-orange-200'
                      : isCurrent
                        ? 'bg-white border-splat-orange text-splat-orange ring-4 ring-orange-100'
                        : 'bg-white border-gray-200 text-gray-300',
                  ].join(' ')}
                >
                  {isUnlocked ? q.marker.icon : <span className="text-[10px] font-bold">{idx + 1}</span>}
                </motion.div>

                <span
                  className={[
                    'text-[8px] font-bold uppercase tracking-wider text-center leading-tight',
                    isUnlocked ? 'text-splat-orange' : 'text-gray-300',
                  ].join(' ')}
                >
                  {q.marker.label}
                </span>

                <AnimatePresence>
                  {isUnlocked && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute -top-10 bg-gray-800 text-white text-[8px] font-bold px-2 py-1 rounded-full whitespace-nowrap z-20 pointer-events-none"
                    >
                      <Eye className="w-3 h-3 inline mr-1" />
                      {q.marker.title.length > 15 ? q.marker.title.slice(0, 12) + '...' : q.marker.title}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const HeritageMarkerCard = ({ marker }: { marker: HeritageMarker }) => (
  <motion.div
    initial={{ opacity: 0, y: 12, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    className="mt-5 rounded-2xl border border-orange-100 bg-orange-50/50 p-5"
  >
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-full bg-white text-splat-orange flex items-center justify-center shadow-sm">
        {marker.icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-splat-orange mb-1">
          Unlocked marker · {marker.label}
        </p>
        <h4 className="font-display text-lg text-gray-900 mb-1">{marker.title}</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{marker.description}</p>
      </div>
    </div>
  </motion.div>
);

const LevelCompleteModal = ({ level, onClose }: { level: number; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 30 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-2xl border-t-4 border-splat-orange"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-16 h-16 rounded-full bg-splat-orange/10 flex items-center justify-center mx-auto mb-4">
        <Trophy className="w-8 h-8 text-splat-orange" />
      </div>
      <h3 className="text-2xl font-display font-bold text-gray-900 mb-2">
        Level {level} Complete!
      </h3>
      <p className="text-gray-500 text-sm mb-6">
        {level === 1 
          ? 'You\'ve mastered the Historical Foundations. Now explore the Cultural Interpretation!' 
          : 'Amazing! You\'ve completed the full cultural journey of Ivrea\'s Carnival.'}
      </p>
      <button
        onClick={onClose}
        className="bg-splat-orange text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-orange-700 transition-all"
      >
        Continue Journey
      </button>
    </motion.div>
  </motion.div>
);

export default function ExperiencePage() {
  const [currentStep, setCurrentStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [unlockedMarkers, setUnlockedMarkers] = useState<boolean[]>(
    Array(QUESTIONS.length).fill(false)
  );
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [pendingNextLevel, setPendingNextLevel] = useState(false);
  const [hoveredMarker, setHoveredMarker] = useState<number | null>(null);
  const [floatingOrange, setFloatingOrange] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const currentLevel = currentQuestion.level;
  const questionsInCurrentLevel = QUESTIONS.filter(q => q.level === currentLevel).length;
  const correctInCurrentLevel = QUESTIONS.filter((q, idx) => q.level === currentLevel && unlockedMarkers[idx]).length;
  const isLevelJustCompleted = correctInCurrentLevel === questionsInCurrentLevel && correctInCurrentLevel > 0 && !unlockedMarkers[currentQuestionIndex + 1] && currentLevel === 1;

  const resultContent = useMemo(() => {
    if (score >= 6) {
      return {
        title: 'Excellent cultural understanding',
        profile: 'Cultural Heritage Expert',
        message:
          'You identified the key historical, symbolic and contemporary layers of Ivrea\'s Carnival.',
      };
    }

    if (score >= 4) {
      return {
        title: 'Strong knowledge of European traditions',
        profile: 'Heritage Explorer',
        message:
          'You understood the main cultural symbols and the civic meaning behind the battle.',
      };
    }

    if (score >= 2) {
      return {
        title: 'Good start — explore more',
        profile: 'Cultural Apprentice',
        message:
          'You captured the basics. Review the markers to strengthen your interpretation.',
      };
    }

    return {
      title: 'Keep exploring the story',
      profile: 'First-time Visitor',
      message:
        'The tradition is layered. Try again and follow the path from place to meaning.',
    };
  }, [score]);

  const playSound = (type: 'button' | 'correct' | 'wrong' | 'complete', force = false) => {
    if (!force && !isAudioEnabled) return;

    try {
      const AudioContextClass =
        window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

      if (!AudioContextClass) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }

      const now = ctx.currentTime;

      const makeTone = (
        frequency: number,
        duration: number,
        typeOsc: OscillatorType,
        volume: number,
        delay = 0
      ) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = typeOsc;
        osc.frequency.setValueAtTime(frequency, now + delay);
        gain.gain.setValueAtTime(volume, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + duration);
      };

      if (type === 'button') {
        makeTone(880, 0.08, 'sine', 0.08);
      }

      if (type === 'correct') {
        makeTone(523.25, 0.18, 'triangle', 0.12);
        makeTone(659.25, 0.18, 'triangle', 0.1, 0.12);
        makeTone(880, 0.22, 'triangle', 0.09, 0.24);
      }

      if (type === 'wrong') {
        makeTone(220, 0.22, 'sawtooth', 0.06);
        makeTone(146.83, 0.24, 'sawtooth', 0.04, 0.16);
      }

      if (type === 'complete') {
        makeTone(523.25, 0.15, 'triangle', 0.12);
        makeTone(659.25, 0.15, 'triangle', 0.12, 0.15);
        makeTone(784, 0.15, 'triangle', 0.12, 0.3);
        makeTone(1046.5, 0.3, 'triangle', 0.1, 0.45);
      }
    } catch {
    }
  };

  useEffect(() => {
    if (isLevelJustCompleted && !pendingNextLevel && !showLevelComplete) {
      setShowLevelComplete(true);
      playSound('complete');
      setPendingNextLevel(true);
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { y: 0.5 },
        colors: ['#FF6321', '#FFDAB9', '#FF8C42', '#FFB347'],
        startVelocity: 25,
      });
    }
  }, [isLevelJustCompleted, pendingNextLevel, showLevelComplete]);

  useEffect(() => {
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        void audioContextRef.current.close();
      }
    };
  }, []);

  const handleOptionSelect = (index: number) => {
    if (showExplanation) return;

    setSelectedOption(index);
    setShowExplanation(true);

    const isCorrect = index === currentQuestion.correct;

    if (isCorrect) {
      setScore((previous) => previous + 1);
      setStreak((prev) => {
        const newStreak = prev + 1;
        if (newStreak > bestStreak) setBestStreak(newStreak);
        return newStreak;
      });
      setUnlockedMarkers((previous) => {
        const next = [...previous];
        next[currentQuestionIndex] = true;
        return next;
      });

      setFloatingOrange(true);
      setTimeout(() => setFloatingOrange(false), 800);

      playSound('correct');

      confetti({
        particleCount: 35,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#FF6321', '#FFDAB9', '#FF8C42', '#FFB347'],
      });
    } else {
      setStreak(0);
      playSound('wrong');
    }
  };

  const handleCloseLevelComplete = () => {
    setShowLevelComplete(false);
  };

  const handleNext = () => {
    playSound('button');

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex((previous) => previous + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setCurrentStep('result');
    }
  };

  const resetQuiz = () => {
    playSound('button');
    setCurrentStep('intro');
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setUnlockedMarkers(Array(QUESTIONS.length).fill(false));
    setShowLevelComplete(false);
    setPendingNextLevel(false);
  };

  const selectedIsCorrect =
    selectedOption !== null && selectedOption === currentQuestion.correct;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white pt-32 pb-12 px-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-10">
          <div className="w-40 hidden md:block" /> { /* Spacer */ }

          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-splat-orange"
          >
            <BookOpen className="w-6 h-6" />
            <span className="font-display text-xl uppercase tracking-tight">
              Cultural Experience
            </span>
          </motion.div>

          <div className="flex items-center gap-3">
            {streak > 1 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-full"
              >
                <Zap className="w-3 h-3 text-splat-orange" />
                <span className="text-[9px] font-bold text-splat-orange">{streak} streak</span>
              </motion.div>
            )}
            <button
              type="button"
              onClick={() => {
                const nextState = !isAudioEnabled;
                setIsAudioEnabled(nextState);
                if (nextState) playSound('button', true);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-orange-50 transition-colors text-splat-orange"
              aria-label={isAudioEnabled ? 'Disable sound' : 'Enable sound'}
            >
              {isAudioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">
                Sound {isAudioEnabled ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentStep === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-[0_24px_70px_rgba(255,99,33,0.09)] border border-orange-50 text-center overflow-hidden relative"
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-50 rounded-full" />
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                    className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center"
                  >
                    <OrangeIcon size={42} />
                  </motion.div>
                </div>

                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-splat-orange mb-4">
                  Game · Culture · Heritage
                </p>

                <h1 className="text-2xl md:text-6xl font-display text-gray-900 mb-6 leading-tight">
                  Beyond the Oranges:
                  <br />
                  A Cultural Journey
                </h1>

                <p className="text-gray-500 text-xs md:text-base leading-relaxed mb-8 max-w-lg mx-auto">
                  Explore how Ivrea transforms local memory, civic resistance and Carnival ritual
                  into one of Europe's most distinctive collective performances.
                </p>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-10 text-left">
                  {[
                    {
                      title: 'Two levels',
                      text: 'From historical foundations to cultural interpretation.',
                    },
                    {
                      title: 'Orange basket',
                      text: 'Each correct answer adds one symbolic orange.',
                    },
                    {
                      title: 'Heritage path',
                      text: 'Unlock markers that explain the meaning of the tradition.',
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl bg-orange-50/60 border border-orange-100 p-4"
                    >
                      <p className="text-xs md:text-sm font-bold text-gray-900 mb-1">{item.title}</p>
                      <p className="text-[10px] md:text-xs text-gray-500 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playSound('button');
                    setCurrentStep('quiz');
                  }}
                  className="w-full sm:w-auto bg-splat-orange text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs md:text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-200"
                >
                  Begin Cultural Experience
                </button>

                <p className="mt-6 text-[10px] text-gray-400 uppercase tracking-[0.25em]">
                  Based on official Ivrea Carnival materials and cultural heritage references
                </p>
              </div>
            </motion.div>
          )}

          {currentStep === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              className="space-y-6"
            >
              <div className="grid lg:grid-cols-[1fr_1.25fr] gap-6 items-start">
                <div className="space-y-5 order-2 lg:order-1">
                  <div className="rounded-3xl bg-white border border-orange-50 shadow-sm p-6 relative overflow-hidden">
                    {bestStreak >= 3 && (
                      <div className="absolute top-2 right-2 opacity-20">
                        <Trophy className="w-8 h-8 text-splat-orange" />
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-splat-orange">
                          Level {currentLevel}
                        </p>
                        <h2 className="font-display text-xl md:text-2xl text-gray-900 mt-1">
                          {currentLevel === 1
                            ? 'Historical Foundations'
                            : 'Cultural Interpretation'}
                        </h2>
                        {bestStreak >= 3 && (
                          <p className="text-[8px] text-splat-orange font-bold mt-1">
                            Best streak: {bestStreak} 🔥
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="font-display text-2xl md:text-3xl text-splat-orange">{score}</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                          / {QUESTIONS.length}
                        </p>
                      </div>
                    </div>

                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-6">
                      <motion.div
                        className="h-full bg-splat-orange"
                        animate={{
                          width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%`,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>

                    <OrangeBasket count={score} total={QUESTIONS.length} />
                  </div>

                  <HeritagePath
                    unlocked={unlockedMarkers}
                    currentIndex={currentQuestionIndex}
                    onMarkerHover={setHoveredMarker}
                  />
                </div>

                <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_20px_55px_rgba(255,99,33,0.07)] border border-orange-50 relative overflow-hidden order-1 lg:order-2">
                  <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-orange-50/60 rounded-bl-full -mr-12 -mt-12 md:-mr-16 md:-mt-16" />

                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-4">
                      Question {currentQuestionIndex + 1} / {QUESTIONS.length}
                    </p>

                    <h3 className="text-lg md:text-3xl font-display text-gray-900 mb-6 md:mb-8 leading-snug">
                      {currentQuestion.text}
                    </h3>

                    <div className="grid gap-3">
                      {currentQuestion.options.map((option, idx) => {
                        const isCorrect = idx === currentQuestion.correct;
                        const isSelected = selectedOption === idx;

                        let className =
                          'bg-gray-50 hover:bg-orange-50 border-gray-100 text-gray-700';

                        if (showExplanation) {
                          if (isCorrect) {
                            className = 'bg-green-50 border-green-200 text-green-700';
                          } else if (isSelected) {
                            className = 'bg-red-50 border-red-200 text-red-700 opacity-70';
                          } else {
                            className = 'bg-gray-50 border-gray-100 text-gray-400 opacity-45';
                          }
                        }

                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => handleOptionSelect(idx)}
                            disabled={showExplanation}
                            className={`w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between group ${className}`}
                          >
                            <span className="font-medium text-sm md:text-base">{option}</span>
                            {showExplanation && isCorrect && (
                              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                            )}
                            {showExplanation && isSelected && !isCorrect && (
                              <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <AnimatePresence>
                      {showExplanation && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-8 pt-8 border-t border-gray-100"
                        >
                          <div className="flex gap-4">
                            <div className="mt-1">
                              {selectedIsCorrect ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )}
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-splat-orange mb-2">
                                {selectedIsCorrect
                                  ? 'Historical connection identified'
                                  : 'Review the cultural context'}
                              </p>
                              <p className="text-gray-600 leading-relaxed text-sm">
                                {currentQuestion.explanation}
                              </p>
                            </div>
                          </div>

                          {selectedIsCorrect && (
                            <HeritageMarkerCard marker={currentQuestion.marker} />
                          )}

                          <div className="flex justify-end mt-8">
                            <button
                              type="button"
                              onClick={handleNext}
                              className="flex items-center gap-2 bg-gray-900 text-white px-7 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-splat-orange transition-colors"
                            >
                              {currentQuestionIndex < QUESTIONS.length - 1
                                ? 'Continue Journey'
                                : 'Complete Experience'}
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-[0_30px_80px_rgba(255,99,33,0.1)] border border-orange-100 text-center overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Award className="w-36 h-36 text-splat-orange -rotate-12" />
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-50 text-splat-orange mb-6">
                  <Award className="w-9 h-9" />
                </div>

                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-splat-orange mb-3">
                  Your Cultural Intelligence Profile
                </p>

                <h2 className="text-5xl font-display text-gray-900 mb-2">
                  {score} / {QUESTIONS.length}
                </h2>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {resultContent.profile}
                </h3>

                <p className="text-splat-orange font-bold mb-4">
                  {resultContent.title}
                </p>

                <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
                  {resultContent.message}
                </p>

                <div className="grid md:grid-cols-2 gap-5 mb-8 text-left">
                  <div className="rounded-3xl bg-orange-50/60 border border-orange-100 p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-splat-orange mb-3">
                      Final basket
                    </p>
                    <OrangeBasket count={score} total={QUESTIONS.length} />
                  </div>

                  <div className="rounded-3xl bg-gray-50 border border-gray-100 p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-4">
                      Unlocked markers
                    </p>

                    <div className="space-y-2">
                      {QUESTIONS.map((q, idx) => (
                        <div
                          key={q.id}
                          className={[
                            'flex items-center gap-3 rounded-2xl p-3',
                            unlockedMarkers[idx] ? 'bg-white text-gray-900' : 'bg-gray-100 text-gray-300',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              'w-8 h-8 rounded-full flex items-center justify-center',
                              unlockedMarkers[idx]
                                ? 'bg-splat-orange text-white'
                                : 'bg-white text-gray-300',
                            ].join(' ')}
                          >
                            {q.marker.icon}
                          </div>
                          <div>
                            <p className="text-xs font-bold">{q.marker.title}</p>
                            <p className="text-[9px] uppercase tracking-widest">
                              {unlockedMarkers[idx] ? 'Unlocked' : 'Locked'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    type="button"
                    onClick={resetQuiz}
                    className="flex items-center justify-center gap-2 border-2 border-gray-100 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:border-splat-orange transition-all"
                  >
                    <RefreshCcw className="w-4 h-4" />
                    Restart Journey
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playSound('button');
                      window.location.href = '/';
                    }}
                    className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-splat-orange transition-all"
                  >
                    Return Home
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-auto pt-12 text-center opacity-30">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em]">
          Historical Intelligence • University Cultural Experience
        </p>
      </div>

      <AnimatePresence>
        {showLevelComplete && (
          <LevelCompleteModal level={currentLevel} onClose={handleCloseLevelComplete} />
        )}
      </AnimatePresence>
    </div>
  );
}
