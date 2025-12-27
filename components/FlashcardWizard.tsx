
import React, { useState } from 'react';
import { generateFlashcards } from '../services/geminiService';
import { FlashcardSet } from '../types';
import { GraduationCap, Loader2, RotateCw, BrainCircuit } from 'lucide-react';

const FlashcardWizard: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(6);
  const [result, setResult] = useState<FlashcardSet | null>(null);
  const [loading, setLoading] = useState(false);
  // Track flipped state for each card by ID
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setResult(null);
    setFlipped({});

    try {
      const data = await generateFlashcards(topic, count);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFlip = (id: number) => {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
          <GraduationCap className="h-8 w-8 text-teal-400" />
          Study Buddy
        </h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Ace your exams. Enter a subject, and we'll generate study flashcards for you.
        </p>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 max-w-2xl mx-auto">
        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Subject (e.g., Photosynthesis, World War II)..."
                    className="w-full bg-slate-900 border-slate-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
            </div>
            
            <div className="sm:w-32">
                 <select
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value))}
                    className="w-full bg-slate-900 border-slate-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                 >
                     <option value={4}>4 Cards</option>
                     <option value={6}>6 Cards</option>
                     <option value={8}>8 Cards</option>
                     <option value={10}>10 Cards</option>
                 </select>
            </div>

            <button
                type="submit"
                disabled={loading || !topic.trim()}
                className="bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-900/20"
            >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <BrainCircuit className="h-5 w-5" />}
                Generate
            </button>
        </form>
      </div>

      {result && (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="text-center">
                <h3 className="text-xl font-semibold text-white">Study Set: {result.topic}</h3>
                <p className="text-slate-500 text-sm mt-1">Click cards to flip</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {result.cards.map((card) => {
                    const isFlipped = flipped[card.id];
                    return (
                        <div 
                            key={card.id}
                            className="group h-64 perspective-1000 cursor-pointer"
                            onClick={() => toggleFlip(card.id)}
                        >
                            <div 
                                className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                                style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                            >
                                {/* Front */}
                                <div 
                                    className="absolute inset-0 backface-hidden bg-slate-800 rounded-2xl border border-slate-700 p-8 flex flex-col items-center justify-center text-center shadow-xl group-hover:border-teal-500/50 transition-colors"
                                    style={{ backfaceVisibility: 'hidden' }}
                                >
                                    <span className="text-xs font-bold text-teal-500 uppercase tracking-widest mb-4">Question</span>
                                    <h4 className="text-xl font-medium text-white">{card.front}</h4>
                                    <RotateCw className="absolute bottom-4 right-4 h-5 w-5 text-slate-600 opacity-50" />
                                </div>

                                {/* Back */}
                                <div 
                                    className="absolute inset-0 backface-hidden bg-teal-900 rounded-2xl border border-teal-700 p-8 flex flex-col items-center justify-center text-center shadow-xl rotate-y-180"
                                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                >
                                    <span className="text-xs font-bold text-teal-300 uppercase tracking-widest mb-4">Answer</span>
                                    <p className="text-lg text-white leading-relaxed">{card.back}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardWizard;
