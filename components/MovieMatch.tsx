
import React, { useState } from 'react';
import { generateMovieRecs } from '../services/geminiService';
import { MovieResponse } from '../types';
import { Clapperboard, Loader2, Film, Star, User } from 'lucide-react';

const MovieMatch: React.FC = () => {
  const [genre, setGenre] = useState('');
  const [mood, setMood] = useState('');
  const [similarTo, setSimilarTo] = useState('');
  const [result, setResult] = useState<MovieResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genre.trim() || !mood.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await generateMovieRecs(genre, mood, similarTo);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
          <Clapperboard className="h-8 w-8 text-red-500" />
          Movie Match
        </h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Discover your next favorite film. Tell us what you're in the mood for, and we'll curate the perfect watchlist.
        </p>
      </div>

      <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 max-w-3xl mx-auto shadow-2xl">
        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase">Genre</label>
                <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="E.g. Sci-Fi, Thriller, Rom-Com..."
                    className="w-full bg-slate-950 border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase">Current Mood</label>
                <input
                    type="text"
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    placeholder="E.g. Nostalgic, Need a laugh, Intense..."
                    className="w-full bg-slate-950 border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
            </div>

            <div className="sm:col-span-2 space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase">Movies I Like (Optional)</label>
                <input
                    type="text"
                    value={similarTo}
                    onChange={(e) => setSimilarTo(e.target.value)}
                    placeholder="E.g. Inception, The Matrix..."
                    className="w-full bg-slate-950 border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
            </div>

            <div className="sm:col-span-2 pt-2">
                <button
                    type="submit"
                    disabled={loading || !genre.trim() || !mood.trim()}
                    className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/20"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Film className="h-5 w-5" />}
                    Find Movies
                </button>
            </div>
        </form>
      </div>

      {result && (
        <div className="space-y-8 animate-fade-in pb-10">
           <div className="border-b border-slate-800 pb-4">
               <h3 className="text-2xl font-bold text-white">{result.collectionTitle}</h3>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {result.recommendations.map((movie, idx) => (
                  <div key={idx} className="group relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-red-500/50 transition-all duration-300 hover:-translate-y-1 shadow-xl">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Film className="h-24 w-24 text-white" />
                      </div>
                      
                      <div className="p-6 relative z-10 h-full flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-bold bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">{movie.year}</span>
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500/20" />
                          </div>
                          
                          <h4 className="text-xl font-bold text-white mb-1 leading-tight">{movie.title}</h4>
                          <div className="flex items-center gap-1 text-xs text-red-400 mb-4 font-medium uppercase tracking-wider">
                              <User className="h-3 w-3" /> {movie.director}
                          </div>
                          
                          <p className="text-slate-400 text-sm leading-relaxed flex-1">
                              {movie.reason}
                          </p>
                      </div>
                      
                      <div className="h-1 w-full bg-gradient-to-r from-red-600 to-slate-900 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                  </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default MovieMatch;
