import React, { useState } from 'react';
import { generatePalette } from '../services/geminiService';
import { PaletteResponse } from '../types';
import { Copy, RefreshCw, Wand2 } from 'lucide-react';

const PaletteGen: React.FC = () => {
  const [mood, setMood] = useState('');
  const [result, setResult] = useState<PaletteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await generatePalette(mood);
      setResult(data);
    } catch (err) {
      setError('Failed to generate palette. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">AI Palette Generator</h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Describe a mood, theme, or concept (e.g., "Cyberpunk rainy night", "Organic minimal coffee shop") and let Gemini craft the perfect color scheme.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="flex gap-4 max-w-2xl mx-auto">
        <input
          type="text"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="Enter a mood or theme..."
          className="flex-1 bg-slate-800 border-slate-700 text-white rounded-xl px-6 py-4 focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={loading || !mood.trim()}
          className="bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-brand-900/20"
        >
          {loading ? (
            <RefreshCw className="animate-spin h-5 w-5" />
          ) : (
            <Wand2 className="h-5 w-5" />
          )}
          Generate
        </button>
      </form>

      {error && (
        <div className="bg-red-900/20 border border-red-900 text-red-200 p-4 rounded-lg text-center">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-white">{result.themeName}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {result.colors.map((color, idx) => (
              <div 
                key={idx} 
                className="group relative bg-slate-800 rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform duration-300 shadow-xl"
              >
                <div 
                  className="h-32 w-full transition-all group-hover:brightness-110"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-sm font-bold text-slate-200">{color.hex}</span>
                    <button 
                      onClick={() => copyToClipboard(color.hex)}
                      className="text-slate-500 hover:text-white transition-colors"
                      title="Copy HEX"
                    >
                      {copiedHex === color.hex ? (
                        <span className="text-xs text-green-400 font-medium">Copied!</span>
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <h4 className="font-medium text-white text-lg">{color.name}</h4>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{color.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaletteGen;
