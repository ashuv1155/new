import React, { useState } from 'react';
import { polishContent } from '../services/geminiService';
import { WriteTone } from '../types';
import { Sparkles, ArrowRight, Copy, Check } from 'lucide-react';

const WriterBot: React.FC = () => {
  const [input, setInput] = useState('');
  const [tone, setTone] = useState<WriteTone>(WriteTone.PROFESSIONAL);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePolish = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput('');
    try {
      const result = await polishContent(input, tone);
      setOutput(result);
    } catch (error) {
      console.error(error);
      setOutput('Error generating content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-12rem)] flex flex-col gap-6 animate-fade-in">
       <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Content Polisher</h2>
          <p className="text-slate-400">Refine your drafts with intelligent rewriting.</p>
        </div>
        
        <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
          {(Object.values(WriteTone) as WriteTone[]).map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                tone === t 
                  ? 'bg-brand-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
        {/* Input Column */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Original Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your rough draft here..."
            className="flex-1 bg-slate-800 border-slate-700 border rounded-2xl p-6 text-slate-200 resize-none focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all placeholder:text-slate-600 text-lg leading-relaxed"
          />
        </div>

        {/* Action Button (Mobile only, hidden on MD) */}
        <div className="md:hidden">
            <button
              onClick={handlePolish}
              disabled={loading || !input.trim()}
              className="w-full bg-brand-600 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
            >
               {loading ? "Polishing..." : "Polish Text"}
            </button>
        </div>

        {/* Output Column */}
        <div className="flex flex-col gap-2 relative">
          <label className="text-sm font-medium text-brand-400 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Polished Result
          </label>
          <div className="flex-1 bg-slate-900/50 border border-brand-900/30 rounded-2xl p-6 relative group overflow-hidden">
             {/* Desktop Action Button Overlay */}
            {!output && !loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-[2px]">
                <button
                  onClick={handlePolish}
                  disabled={!input.trim()}
                  className="bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-medium shadow-lg shadow-brand-500/30 transition-all flex items-center gap-2 transform hover:scale-105"
                >
                  <ArrowRight className="h-5 w-5" />
                  Polish Content
                </button>
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 z-10">
                <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-brand-200 animate-pulse">Refining your words...</p>
              </div>
            )}

            <div className="h-full overflow-auto text-lg leading-relaxed text-slate-100 whitespace-pre-wrap">
              {output}
            </div>

            {output && (
              <button
                onClick={handleCopy}
                className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
                title="Copy to clipboard"
              >
                {copied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriterBot;
