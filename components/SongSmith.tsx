import React, { useState } from 'react';
import { generateSong } from '../services/geminiService';
import { SongResponse } from '../types';
import { Music, Loader2, Mic2, Disc, FileAudio } from 'lucide-react';

const SongSmith: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [genre, setGenre] = useState('');
  const [mood, setMood] = useState('');
  const [result, setResult] = useState<SongResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !genre.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await generateSong(genre, mood, topic);
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
          <Music className="h-8 w-8 text-purple-400" />
          Song Smith
        </h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Unleash your inner songwriter. Generate lyrics and chord progressions instantly.
        </p>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 max-w-3xl mx-auto">
        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase">Topic / Story</label>
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="E.g. A long drive home in the rain..."
                    className="w-full bg-slate-900 border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase">Genre</label>
                <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="E.g. Indie Folk, Pop Punk..."
                    className="w-full bg-slate-900 border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase">Mood</label>
                <input
                    type="text"
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    placeholder="E.g. Melancholic, Upbeat..."
                    className="w-full bg-slate-900 border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
            </div>

            <div className="sm:col-span-2 pt-2">
                <button
                    type="submit"
                    disabled={loading || !topic.trim() || !genre.trim()}
                    className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Mic2 className="h-5 w-5" />}
                    Compose Song
                </button>
            </div>
        </form>
      </div>

      {result && (
        <div className="space-y-8 animate-fade-in pb-10">
           {/* Song Header */}
           <div className="relative bg-gradient-to-r from-purple-900/50 to-slate-900 p-8 rounded-2xl border border-purple-500/20 overflow-hidden text-center">
               <Disc className="absolute top-1/2 left-10 -translate-y-1/2 h-40 w-40 text-purple-600/10 animate-spin-slow hidden sm:block" />
               <div className="relative z-10 space-y-2">
                   <h3 className="text-3xl font-bold text-white tracking-tight">{result.title}</h3>
                   <p className="text-purple-300 font-medium uppercase tracking-widest text-sm">{result.style}</p>
               </div>
           </div>

           {/* Lyrics Sheet */}
           <div className="max-w-2xl mx-auto space-y-8">
               {result.sections.map((section, idx) => (
                   <div key={idx} className="relative pl-6 border-l-2 border-slate-700 hover:border-purple-500 transition-colors duration-300">
                       <div className="flex justify-between items-center mb-2">
                           <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{section.type}</span>
                           <span className="text-xs font-mono font-bold text-purple-400 bg-purple-900/20 px-2 py-1 rounded border border-purple-900/50">
                               {section.chords}
                           </span>
                       </div>
                       <p className="text-slate-200 whitespace-pre-line text-lg leading-relaxed font-serif">
                           {section.lyrics}
                       </p>
                   </div>
               ))}
           </div>

           <div className="flex justify-center pt-8">
               <button 
                 onClick={() => navigator.clipboard.writeText(`${result.title}\n\n${result.sections.map(s => `[${s.type}]\nChords: ${s.chords}\n${s.lyrics}`).join('\n\n')}`)}
                 className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
               >
                   <FileAudio className="h-4 w-4" /> Copy Lyrics & Chords
               </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default SongSmith;