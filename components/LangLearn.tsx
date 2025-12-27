
import React, { useState } from 'react';
import { generateLanguageLesson } from '../services/geminiService';
import { LangLessonResponse } from '../types';
import { Globe, Loader2, MessageCircle, BookOpen } from 'lucide-react';

const LangLearn: React.FC = () => {
  const [language, setLanguage] = useState('');
  const [scenario, setScenario] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [result, setResult] = useState<LangLessonResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!language.trim() || !scenario.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await generateLanguageLesson(language, scenario, level);
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
          <Globe className="h-8 w-8 text-cyan-400" />
          Lang Learn
        </h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Quickly master essential phrases for any situation. Choose a language and a scenario.
        </p>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 max-w-3xl mx-auto">
        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase">Target Language</label>
                <input
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="E.g. Japanese, French, Swahili..."
                    className="w-full bg-slate-900 border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase">Difficulty</label>
                <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full bg-slate-900 border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                >
                    <option value="Beginner">Beginner (Tourist)</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced (Business)</option>
                </select>
            </div>

            <div className="sm:col-span-2 space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase">Scenario</label>
                <input
                    type="text"
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value)}
                    placeholder="E.g. Ordering street food, Asking for directions, Introducing yourself..."
                    className="w-full bg-slate-900 border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
            </div>

            <div className="sm:col-span-2 pt-2">
                <button
                    type="submit"
                    disabled={loading || !language.trim() || !scenario.trim()}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
                    Create Lesson
                </button>
            </div>
        </form>
      </div>

      {result && (
        <div className="space-y-8 animate-fade-in pb-10">
           <div className="text-center">
               <h3 className="text-2xl font-bold text-white mb-2">{result.scenario}</h3>
               <span className="bg-cyan-900/30 text-cyan-400 px-3 py-1 rounded-full text-sm font-medium border border-cyan-900/50">
                 {result.language}
               </span>
           </div>

           <div className="grid gap-4">
              {result.phrases.map((phrase, idx) => (
                  <div key={idx} className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-cyan-500/50 transition-colors shadow-lg">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                          <div className="flex-1 space-y-2">
                              <h4 className="text-xl font-bold text-white">{phrase.original}</h4>
                              <p className="text-cyan-300 font-mono text-sm">{phrase.phonetic}</p>
                          </div>
                          
                          <div className="hidden md:block w-px h-12 bg-slate-700"></div>
                          
                          <div className="flex-1 space-y-2">
                              <h5 className="text-lg font-medium text-slate-200">{phrase.translation}</h5>
                              <div className="flex items-start gap-2 text-sm text-slate-400">
                                  <MessageCircle className="h-4 w-4 mt-0.5 shrink-0 text-cyan-600" />
                                  <span>{phrase.tip}</span>
                              </div>
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

export default LangLearn;
