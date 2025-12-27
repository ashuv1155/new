
import React, { useState } from 'react';
import { generateStory } from '../services/geminiService';
import { StoryResponse } from '../types';
import { BookOpenText, Loader2, Feather, GitCommit, User } from 'lucide-react';

const StorySprout: React.FC = () => {
  const [genre, setGenre] = useState('');
  const [theme, setTheme] = useState('');
  const [result, setResult] = useState<StoryResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genre.trim() || !theme.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await generateStory(genre, theme);
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
          <BookOpenText className="h-8 w-8 text-amber-500" />
          Story Sprout
        </h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Plant the seeds of a great story. Enter a genre and theme, and watch a plot structure grow.
        </p>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 max-w-2xl mx-auto">
        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase">Genre</label>
                <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="E.g. Sci-Fi Noir, Cozy Mystery..."
                    className="w-full bg-slate-900 border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase">Theme / Concept</label>
                <input
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="E.g. Forgiveness, Time Travel Paradox..."
                    className="w-full bg-slate-900 border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
            </div>

            <div className="sm:col-span-2 pt-2">
                <button
                    type="submit"
                    disabled={loading || !genre.trim() || !theme.trim()}
                    className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Feather className="h-5 w-5" />}
                    Outline Story
                </button>
            </div>
        </form>
      </div>

      {result && (
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8 relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full pointer-events-none"></div>

            <div className="text-center space-y-2 relative z-10">
                <h3 className="text-3xl font-serif font-bold text-white">{result.title}</h3>
                <p className="text-amber-500 font-medium italic text-lg">"{result.logline}"</p>
                <div className="flex justify-center gap-2 pt-2">
                    <span className="text-xs font-bold text-slate-400 uppercase bg-slate-800 px-3 py-1 rounded-full">{result.genre}</span>
                </div>
            </div>

            <div className="space-y-6 relative z-10">
                 {/* Protagonist */}
                 <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <User className="h-4 w-4" /> Protagonist
                    </h4>
                    <p className="text-slate-300 leading-relaxed">{result.protagonist}</p>
                 </div>

                 {/* Plot Points */}
                 <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <GitCommit className="h-4 w-4" /> Plot Structure
                    </h4>
                    <div className="space-y-4 border-l-2 border-slate-700 ml-2 pl-6">
                        <div className="relative">
                            <span className="absolute -left-[31px] top-1 h-3 w-3 bg-slate-500 rounded-full ring-4 ring-slate-900"></span>
                            <span className="block text-amber-400 text-sm font-bold uppercase mb-1">Inciting Incident</span>
                            <p className="text-slate-300 text-sm">{result.plotPoints.incitingIncident}</p>
                        </div>
                        <div className="relative">
                             <span className="absolute -left-[31px] top-1 h-3 w-3 bg-slate-500 rounded-full ring-4 ring-slate-900"></span>
                            <span className="block text-amber-400 text-sm font-bold uppercase mb-1">Rising Action</span>
                            <p className="text-slate-300 text-sm">{result.plotPoints.risingAction}</p>
                        </div>
                         <div className="relative">
                             <span className="absolute -left-[31px] top-1 h-3 w-3 bg-amber-500 rounded-full ring-4 ring-slate-900 shadow-lg shadow-amber-500/50"></span>
                            <span className="block text-amber-400 text-sm font-bold uppercase mb-1">Climax</span>
                            <p className="text-white text-base font-medium">{result.plotPoints.climax}</p>
                        </div>
                         <div className="relative">
                             <span className="absolute -left-[31px] top-1 h-3 w-3 bg-slate-500 rounded-full ring-4 ring-slate-900"></span>
                            <span className="block text-amber-400 text-sm font-bold uppercase mb-1">Falling Action</span>
                            <p className="text-slate-300 text-sm">{result.plotPoints.fallingAction}</p>
                        </div>
                         <div className="relative">
                             <span className="absolute -left-[31px] top-1 h-3 w-3 bg-slate-500 rounded-full ring-4 ring-slate-900"></span>
                            <span className="block text-amber-400 text-sm font-bold uppercase mb-1">Resolution</span>
                            <p className="text-slate-300 text-sm">{result.plotPoints.resolution}</p>
                        </div>
                    </div>
                 </div>

                 {/* Twist */}
                 <div className="bg-amber-950/20 p-5 rounded-2xl border border-amber-900/50">
                     <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">The Twist</h4>
                     <p className="text-amber-100 italic">{result.twist}</p>
                 </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default StorySprout;
