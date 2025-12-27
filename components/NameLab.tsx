
import React, { useState } from 'react';
import { generateNames } from '../services/geminiService';
import { NameGenResponse } from '../types';
import { FlaskConical, Loader2, Sparkles, Tag, Copy, Check } from 'lucide-react';

const NameLab: React.FC = () => {
  const [category, setCategory] = useState('Brand');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<NameGenResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedName, setCopiedName] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await generateNames(category, description);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopiedName(name);
    setTimeout(() => setCopiedName(null), 2000);
  };

  const categories = ['Brand', 'Startup', 'Product', 'Podcast', 'Pet', 'Fantasy Character'];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
          <FlaskConical className="h-8 w-8 text-fuchsia-400" />
          Name Lab
        </h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Need a name? Describe your vibe, keywords, and core values, and we'll distill the perfect moniker.
        </p>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 max-w-3xl mx-auto">
        <form onSubmit={handleGenerate} className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase">What are we naming?</label>
                <div className="flex flex-wrap gap-2">
                   {categories.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            category === cat 
                            ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-900/30' 
                            : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                   ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase">Description & Keywords</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="E.g. A sustainable coffee shop that feels modern and minimal..."
                    className="w-full h-32 bg-slate-900 border-slate-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-fuchsia-500 focus:outline-none resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={loading || !description.trim()}
                className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-900/20"
            >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                Generate Names
            </button>
        </form>
      </div>

      {result && (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="text-center">
                <span className="bg-fuchsia-900/30 text-fuchsia-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-fuchsia-900/50">
                    Category: {result.category}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {result.suggestions.map((item, idx) => (
                    <div key={idx} className="group bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-fuchsia-500/50 transition-all hover:-translate-y-1 hover:shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => copyToClipboard(item.name)}
                                className="text-slate-400 hover:text-white"
                                title="Copy Name"
                            >
                                {copiedName === item.name ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            <h3 className="text-2xl font-bold text-white tracking-tight">{item.name}</h3>
                            <div className="h-px w-10 bg-fuchsia-500/50"></div>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {item.rationale}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default NameLab;
