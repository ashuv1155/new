
import React, { useState } from 'react';
import { explainTech } from '../services/geminiService';
import { TechExplanationResponse } from '../types';
import { Cpu, Loader2, BookOpen, Lightbulb, Hash } from 'lucide-react';

const TechInsider: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [result, setResult] = useState<TechExplanationResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExplain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await explainTech(topic, level);
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
          <Cpu className="h-8 w-8 text-sky-400" />
          Tech Insider
        </h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Confused by buzzwords? Enter a tech concept, and we'll break it down into simple terms with real-world analogies.
        </p>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 max-w-2xl mx-auto">
        <form onSubmit={handleExplain} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="E.g. Blockchain, Machine Learning, Docker..."
              className="w-full bg-slate-900 border-slate-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
          
          <div className="sm:w-40">
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full bg-slate-900 border-slate-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            >
              <option value="5-Year-Old">Like I'm 5</option>
              <option value="Beginner">Beginner</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-900/20"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
            Explain
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-6 animate-fade-in pb-12">
           <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8">
              {/* Header */}
              <div className="border-b border-slate-800 pb-6">
                <span className="text-sky-400 font-mono text-xs uppercase tracking-widest mb-2 block">Concept</span>
                <h3 className="text-3xl font-bold text-white">{result.topic}</h3>
              </div>

              {/* Explanation */}
              <div className="space-y-6">
                 <div>
                    <h4 className="text-lg font-semibold text-white mb-2">The Breakdown</h4>
                    <p className="text-slate-300 leading-relaxed text-lg">{result.explanation}</p>
                 </div>

                 <div className="bg-sky-900/10 border-l-4 border-sky-500 p-6 rounded-r-xl">
                    <h4 className="text-sky-400 font-bold uppercase text-xs tracking-wider mb-2 flex items-center gap-2">
                       <Lightbulb className="h-4 w-4" /> The Analogy
                    </h4>
                    <p className="text-sky-100 italic font-serif text-lg">"{result.analogy}"</p>
                 </div>
              </div>

              {/* Key Terms */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                 {result.keyTerms.map((item, idx) => (
                    <div key={idx} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                       <h5 className="font-bold text-white mb-2 flex items-center gap-2 text-sm">
                          <Hash className="h-3 w-3 text-slate-500" /> {item.term}
                       </h5>
                       <p className="text-xs text-slate-400 leading-relaxed">{item.definition}</p>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default TechInsider;
