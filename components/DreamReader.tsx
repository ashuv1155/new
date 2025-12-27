import React, { useState } from 'react';
import { interpretDream } from '../services/geminiService';
import { DreamResponse } from '../types';
import { Moon, Sparkles, Cloud, Stars, Fingerprint, Lightbulb, Loader2 } from 'lucide-react';

const DreamReader: React.FC = () => {
  const [dream, setDream] = useState('');
  const [result, setResult] = useState<DreamResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInterpret = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dream.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await interpretDream(dream);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
          <Moon className="h-8 w-8 text-indigo-400" />
          Dream Reader
        </h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Uncover the hidden meanings in your dreams. Describe what you saw, felt, and experienced.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Input Form */}
        <div className="space-y-6">
           <form onSubmit={handleInterpret} className="bg-slate-800/30 p-1 rounded-2xl border border-indigo-900/30 shadow-2xl relative overflow-hidden group">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                <textarea
                  value={dream}
                  onChange={(e) => setDream(e.target.value)}
                  placeholder="I was flying over a golden city, but my wings were heavy..."
                  className="w-full h-64 bg-slate-900/80 border-0 text-indigo-100 rounded-xl p-6 focus:ring-0 focus:outline-none resize-none placeholder:text-slate-600 text-lg leading-relaxed relative z-10"
                />
                
                <div className="p-4 bg-slate-900/80 relative z-10 rounded-b-xl">
                   <button
                    type="submit"
                    disabled={loading || !dream.trim()}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/40 border border-indigo-500/20"
                  >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                    Interpret Dream
                  </button>
                </div>
           </form>
        </div>

        {/* Output */}
        <div className="min-h-[300px]">
           {result ? (
              <div className="space-y-6 animate-fade-in">
                 {/* Main Card */}
                 <div className="bg-gradient-to-br from-indigo-950 to-slate-900 p-8 rounded-3xl border border-indigo-800/30 shadow-2xl relative overflow-hidden">
                    <Stars className="absolute top-4 right-4 h-6 w-6 text-indigo-400 opacity-20" />
                    <div className="relative z-10 space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-indigo-200 mb-2 flex items-center gap-2">
                                <Cloud className="h-5 w-5" /> Interpretation
                            </h3>
                            <p className="text-slate-300 leading-relaxed text-lg">
                                {result.interpretation}
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                           {result.symbols.map((symbol, i) => (
                               <span key={i} className="px-3 py-1 bg-indigo-900/50 border border-indigo-700/50 rounded-full text-indigo-200 text-xs font-medium uppercase tracking-wider">
                                   {symbol}
                               </span>
                           ))}
                        </div>
                    </div>
                 </div>

                 {/* Secondary Cards */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 flex flex-col gap-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                           <Fingerprint className="h-4 w-4" /> Mood
                        </span>
                        <span className="text-xl text-white font-medium capitalize">{result.mood}</span>
                     </div>
                     <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 flex flex-col gap-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                           <Lightbulb className="h-4 w-4" /> Advice
                        </span>
                        <span className="text-sm text-slate-300 leading-snug">{result.actionableAdvice}</span>
                     </div>
                 </div>
              </div>
           ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 bg-slate-800/20 rounded-3xl border-2 border-dashed border-slate-700/50 p-8 text-center space-y-4">
                  {loading ? (
                      <>
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse rounded-full" />
                            <Moon className="h-16 w-16 text-indigo-400 animate-pulse relative z-10" />
                        </div>
                        <p className="text-indigo-200">Consulting the subconscious...</p>
                      </>
                  ) : (
                      <>
                        <Moon className="h-12 w-12 opacity-20" />
                        <p>Share your dream to reveal its secrets.</p>
                      </>
                  )}
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default DreamReader;