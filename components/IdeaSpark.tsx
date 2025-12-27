import React, { useState } from 'react';
import { generateIdeas } from '../services/geminiService';
import { IdeaResponse } from '../types';
import { Lightbulb, Loader2, Sparkles, Target } from 'lucide-react';

const IdeaSpark: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState<IdeaResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await generateIdeas(topic);
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
        <h2 className="text-3xl font-bold text-white">Idea Spark</h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Stuck on a problem? Enter a topic, industry, or question, and let AI brainstorm creative solutions for you.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="flex gap-4 max-w-2xl mx-auto">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="E.g., Sustainable packaging, Mobile game mechanics..."
          className="flex-1 bg-slate-800 border-slate-700 text-white rounded-xl px-6 py-4 focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-brand-900/20"
        >
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <Sparkles className="h-5 w-5" />
          )}
          Spark
        </button>
      </form>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
           {/* Header Card */}
           <div className="md:col-span-2 bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 text-center">
              <h3 className="text-xl font-semibold text-brand-300">Brainstorming: {result.topic}</h3>
           </div>

           {result.ideas.map((idea, idx) => (
             <div 
              key={idx}
              className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 hover:bg-slate-800 hover:border-brand-500/50 transition-all duration-300 group"
             >
                <div className="flex items-start gap-4">
                  <div className="bg-slate-700/50 p-3 rounded-lg group-hover:bg-brand-900/30 group-hover:text-brand-400 transition-colors">
                    <Lightbulb className="h-6 w-6" />
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-lg font-bold text-white">{idea.title}</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{idea.description}</p>
                    <div className="flex items-center gap-2 text-xs font-medium text-brand-400 pt-2">
                       <Target className="h-3 w-3" />
                       <span className="uppercase tracking-wider">Impact</span>
                       <span className="text-slate-400 normal-case font-normal border-l border-slate-600 pl-2">
                         {idea.impact}
                       </span>
                    </div>
                  </div>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default IdeaSpark;
