
import React, { useState } from 'react';
import { generateCharacter } from '../services/geminiService';
import { CharacterResponse } from '../types';
import { User, Loader2, Shield, AlertTriangle, Fingerprint, Book, Sword } from 'lucide-react';

const CharacterForge: React.FC = () => {
  const [genre, setGenre] = useState('');
  const [role, setRole] = useState('');
  const [result, setResult] = useState<CharacterResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genre.trim() || !role.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await generateCharacter(genre, role);
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
          <Sword className="h-8 w-8 text-orange-400" />
          Character Forge
        </h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Create unforgettable characters for your stories or games. Specify the genre and role, and we'll flesh out the details.
        </p>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 max-w-2xl mx-auto">
        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase">Genre / Setting</label>
                <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="E.g. Cyberpunk, High Fantasy, Noir..."
                    className="w-full bg-slate-900 border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase">Role / Archetype</label>
                <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="E.g. Reluctant Hero, Villain, Wise Mentor..."
                    className="w-full bg-slate-900 border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
            </div>

            <div className="sm:col-span-2 pt-2">
                <button
                    type="submit"
                    disabled={loading || !genre.trim() || !role.trim()}
                    className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <User className="h-5 w-5" />}
                    Forge Character
                </button>
            </div>
        </form>
      </div>

      {result && (
        <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl overflow-hidden shadow-2xl animate-fade-in relative max-w-3xl mx-auto">
            {/* Header / ID Card */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 border-b border-slate-700 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                <div className="h-24 w-24 bg-slate-700 rounded-full flex items-center justify-center border-4 border-slate-600 shrink-0">
                    <User className="h-12 w-12 text-slate-400" />
                </div>
                <div className="flex-1 space-y-1">
                    <h3 className="text-3xl font-bold text-white tracking-tight">{result.name}</h3>
                    <p className="text-orange-400 font-medium italic">"{result.tagline}"</p>
                    <div className="flex flex-wrap gap-3 justify-center sm:justify-start pt-2">
                        <span className="text-xs font-bold text-slate-400 uppercase bg-slate-950 px-3 py-1 rounded-full border border-slate-700">
                           Age: <span className="text-slate-200">{result.age}</span>
                        </span>
                         <span className="text-xs font-bold text-slate-400 uppercase bg-slate-950 px-3 py-1 rounded-full border border-slate-700">
                           Occupation: <span className="text-slate-200">{result.occupation}</span>
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-8 space-y-8">
                 {/* Traits */}
                 <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Fingerprint className="h-4 w-4" /> Personality Traits
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {result.traits.map((trait, i) => (
                            <span key={i} className="px-3 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 text-sm font-medium">
                                {trait}
                            </span>
                        ))}
                    </div>
                 </div>

                 {/* Backstory */}
                 <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50">
                     <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Book className="h-4 w-4" /> Backstory
                    </h4>
                    <p className="text-slate-300 leading-relaxed font-serif text-lg">
                        {result.backstory}
                    </p>
                 </div>

                 {/* Strengths & Weaknesses */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div>
                        <h4 className="text-xs font-bold text-green-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Shield className="h-4 w-4" /> Strengths
                        </h4>
                        <ul className="space-y-2">
                            {result.strengths.map((s, i) => (
                                <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" /> {s}
                                </li>
                            ))}
                        </ul>
                     </div>
                     <div>
                        <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" /> Weaknesses
                        </h4>
                        <ul className="space-y-2">
                            {result.weaknesses.map((w, i) => (
                                <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" /> {w}
                                </li>
                            ))}
                        </ul>
                     </div>
                 </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default CharacterForge;
