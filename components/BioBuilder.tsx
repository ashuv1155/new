
import React, { useState } from 'react';
import { generateBios } from '../services/geminiService';
import { BioResponse } from '../types';
import { AtSign, Loader2, Sparkles, Copy, Check, UserCircle } from 'lucide-react';

const BioBuilder: React.FC = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [vibe, setVibe] = useState('Professional');
  const [platform, setPlatform] = useState('LinkedIn');
  const [result, setResult] = useState<BioResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await generateBios(name, role, vibe, platform);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const vibes = ['Professional', 'Witty', 'Minimalist', 'Creative', 'Emoji-heavy'];
  const platforms = ['LinkedIn', 'Twitter / X', 'Instagram', 'TikTok'];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
          <AtSign className="h-8 w-8 text-lime-400" />
          Bio Builder
        </h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Craft the perfect first impression. Generate optimized bios for your social media profiles tailored to your persona.
        </p>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 max-w-2xl mx-auto">
        <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-bold uppercase">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="E.g. Jane Doe"
                        className="w-full bg-slate-900 border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-lime-500 focus:outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-bold uppercase">Role / Description</label>
                    <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="E.g. UX Designer loves coffee"
                        className="w-full bg-slate-900 border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-lime-500 focus:outline-none"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                     <label className="text-xs text-slate-400 font-bold uppercase">Vibe</label>
                     <div className="relative">
                        <select 
                            value={vibe}
                            onChange={(e) => setVibe(e.target.value)}
                            className="w-full bg-slate-900 border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-lime-500 focus:outline-none appearance-none"
                        >
                            {vibes.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                     </div>
                </div>
                <div className="space-y-2">
                     <label className="text-xs text-slate-400 font-bold uppercase">Platform</label>
                     <div className="relative">
                        <select 
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            className="w-full bg-slate-900 border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-lime-500 focus:outline-none appearance-none"
                        >
                            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                     </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading || !name.trim() || !role.trim()}
                className="w-full bg-lime-600 hover:bg-lime-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-lime-900/20 mt-2"
            >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                Generate Bios
            </button>
        </form>
      </div>

      {result && (
        <div className="space-y-6 animate-fade-in pb-12 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2">
                <span className="bg-lime-900/30 text-lime-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-lime-900/50">
                    Platform: {result.platform}
                </span>
            </div>

            <div className="grid gap-4">
                {result.options.map((bio, idx) => (
                    <div key={idx} className="bg-slate-800 rounded-xl p-5 border border-slate-700 flex items-start gap-4 hover:border-lime-500/50 transition-colors shadow-lg">
                        <div className="shrink-0 pt-1">
                             <UserCircle className="h-10 w-10 text-slate-600" />
                        </div>
                        <div className="flex-1 space-y-2">
                            <p className="text-white text-lg leading-relaxed font-medium">{bio}</p>
                            <div className="flex justify-end">
                                <button 
                                    onClick={() => copyToClipboard(bio, idx)}
                                    className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800"
                                >
                                    {copiedIndex === idx ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                                    {copiedIndex === idx ? "Copied" : "Copy Bio"}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default BioBuilder;
