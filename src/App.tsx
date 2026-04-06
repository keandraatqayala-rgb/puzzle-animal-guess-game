import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Clock, Image as ImageIcon, Play, RotateCcw, ChevronRight } from 'lucide-react';

const ANIMALS = [
  { name: 'Lion', url: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?auto=format&fit=crop&w=800&q=80' },
  { name: 'Elephant', url: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80' },
  { name: 'Giraffe', url: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=800&q=80' },
  { name: 'Tiger', url: 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=800&q=80' },
  { name: 'Penguin', url: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=800&q=80' },
  { name: 'Kangaroo', url: 'https://images.unsplash.com/photo-1562569633-622303bafef5?auto=format&fit=crop&w=800&q=80' },
  { name: 'Panda', url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=800&q=80' },
  { name: 'Zebra', url: 'https://images.unsplash.com/photo-1501705388883-4ed8a543392c?auto=format&fit=crop&w=800&q=80' },
  { name: 'Koala', url: 'https://images.unsplash.com/photo-1598449426314-8b02525e8733?auto=format&fit=crop&w=800&q=80' },
  { name: 'Dolphin', url: 'https://images.unsplash.com/photo-1607153333881-88487779f427?auto=format&fit=crop&w=800&q=80' },
];

const TOTAL_TIME = 20;
const TOTAL_BLOCKS = 9;

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function App() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'level_end' | 'game_over'>('start');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [blockOrder, setBlockOrder] = useState<number[]>([]);
  const [wrongGuess, setWrongGuess] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const initLevel = () => {
    setBlockOrder(shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8]));
    setTimeLeft(TOTAL_TIME);
    setGuess('');
    setMessage('');
    setWrongGuess(false);
    setGameState('playing');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const startGame = () => {
    setCurrentLevel(0);
    setScore(0);
    initLevel();
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  const handleTimeUp = () => {
    setGameState('level_end');
    setMessage(`Time's up! It was a ${ANIMALS[currentLevel].name}.`);
  };

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameState !== 'playing' || !guess.trim()) return;

    const currentAnimal = ANIMALS[currentLevel].name.toLowerCase();
    if (guess.trim().toLowerCase() === currentAnimal) {
      const pointsEarned = Math.max(10, timeLeft * 10);
      setScore((prev) => prev + pointsEarned);
      setGameState('level_end');
      setMessage(`Correct! +${pointsEarned} points`);
    } else {
      setWrongGuess(true);
      setTimeout(() => setWrongGuess(false), 500);
      setGuess('');
    }
  };

  const nextLevel = () => {
    if (currentLevel < ANIMALS.length - 1) {
      setCurrentLevel((prev) => prev + 1);
      initLevel();
    } else {
      setGameState('game_over');
    }
  };

  const revealedCount = gameState === 'playing'
    ? Math.floor((TOTAL_TIME - timeLeft) / (TOTAL_TIME / TOTAL_BLOCKS))
    : TOTAL_BLOCKS;

  const revealedBlocks = new Set(blockOrder.slice(0, revealedCount));

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-md flex flex-col gap-6">
        
        <header className="flex items-center justify-between bg-neutral-800 p-4 rounded-2xl shadow-lg border border-neutral-700">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-lg">Level {currentLevel + 1}/{ANIMALS.length}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-amber-400">
              <Trophy className="w-5 h-5" />
              <span className="font-bold text-lg">{score}</span>
            </div>
            <div className={`flex items-center gap-1.5 ${timeLeft <= 5 ? 'text-red-400' : 'text-emerald-400'}`}>
              <Clock className="w-5 h-5" />
              <span className="font-bold text-lg w-6 text-center">{timeLeft}s</span>
            </div>
          </div>
        </header>

        <main className="bg-neutral-800 p-4 sm:p-6 rounded-3xl shadow-xl border border-neutral-700 flex flex-col items-center gap-6">
          
          {gameState === 'start' && (
            <div className="text-center py-12 flex flex-col items-center gap-4">
              <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="w-12 h-12 text-blue-400" />
              </div>
              <h1 className="text-3xl font-black tracking-tight">Guess the Animal</h1>
              <p className="text-neutral-400 max-w-[250px]">
                Identify the animal before the blocks disappear. The faster you guess, the higher your score!
              </p>
              <button
                onClick={startGame}
                className="mt-4 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold transition-colors active:scale-95 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                Start Game
              </button>
            </div>
          )}

          {(gameState === 'playing' || gameState === 'level_end') && (
            <>
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-neutral-900 shadow-inner border border-neutral-700">
                <img
                  src={ANIMALS[currentLevel].url}
                  alt="Animal to guess"
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={false}
                      animate={{
                        opacity: revealedBlocks.has(i) ? 0 : 1,
                        scale: revealedBlocks.has(i) ? 0.8 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                      className="bg-neutral-800 border border-neutral-700/50 backdrop-blur-sm"
                    />
                  ))}
                </div>
              </div>

              <div className="w-full h-24 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {gameState === 'playing' ? (
                    <motion.form
                      key="playing"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0, x: wrongGuess ? [-10, 10, -10, 10, 0] : 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ x: { duration: 0.4 } }}
                      onSubmit={handleGuess}
                      className="flex flex-col gap-3 w-full"
                    >
                      <div className="relative">
                        <input
                          ref={inputRef}
                          type="text"
                          value={guess}
                          onChange={(e) => setGuess(e.target.value)}
                          placeholder="Type animal name..."
                          className={`w-full bg-neutral-900 border ${wrongGuess ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-neutral-700 focus:border-blue-500 focus:ring-blue-500/20'} rounded-xl px-4 py-3 text-lg outline-none focus:ring-4 transition-all`}
                          autoComplete="off"
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="absolute right-2 top-2 bottom-2 bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-lg font-semibold transition-colors active:scale-95 cursor-pointer"
                        >
                          Guess
                        </button>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="level_end"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-3 w-full"
                    >
                      <div className={`text-xl font-bold ${message.startsWith('Correct') ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {message}
                      </div>
                      <button
                        onClick={nextLevel}
                        className="flex items-center gap-2 bg-white text-neutral-900 hover:bg-neutral-200 px-6 py-2.5 rounded-xl font-bold transition-colors active:scale-95 cursor-pointer"
                      >
                        {currentLevel < ANIMALS.length - 1 ? 'Next Animal' : 'See Results'}
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}

          {gameState === 'game_over' && (
            <div className="text-center py-12 flex flex-col items-center gap-4">
              <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-12 h-12 text-amber-400" />
              </div>
              <h2 className="text-3xl font-black tracking-tight">Game Over!</h2>
              <p className="text-neutral-400 text-lg">
                Your final score is <span className="text-white font-bold">{score}</span>
              </p>
              <button
                onClick={startGame}
                className="mt-6 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold transition-colors active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
