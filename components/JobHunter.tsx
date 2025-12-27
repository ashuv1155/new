import React, { useState } from 'react';
import { generateCareerHelp } from '../services/geminiService';
import { CareerResponse } from '../types';
import { Briefcase, FileText, Loader2, Target, Copy, Check } from 'lucide-react';

const JobHunter: React.FC = () => {
  const [jobDesc, setJobDesc] = useState('');
  const [userBg, setUserBg] = useState('');
  const [mode, setMode] = useState<'cover_letter' | 'resume_tips'>('cover_letter');
  const [result, setResult] = useState<CareerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDesc.trim() || !userBg.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await generateCareerHelp(jobDesc, userBg, mode);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
          <Briefcase className="h-8 w-8 text-blue-400" />
          Career Ally
        </h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Paste a job description and your experience to generate a tailored cover letter or receive resume optimization tips.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Column */}
        <div className="space-y-6">
           <form onSubmit={handleGenerate} className="flex flex-col gap-6">
                <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 w-fit">
                    <button
                        type="button"
                        onClick={() => setMode('cover_letter')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'cover_letter' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                    >
                        Cover Letter
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('resume_tips')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'resume_tips' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                    >
                        Resume Tips
                    </button>
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Job Description</label>
                    <textarea
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                        placeholder="Paste the job description here..."
                        className="w-full h-40 bg-slate-800 border-slate-700 text-white rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Your Experience / Resume</label>
                    <textarea
                        value={userBg}
                        onChange={(e) => setUserBg(e.target.value)}
                        placeholder="Paste your resume or summary of experience here..."
                        className="w-full h-40 bg-slate-800 border-slate-700 text-white rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none text-sm"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !jobDesc.trim() || !userBg.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <FileText className="h-5 w-5" />}
                    {mode === 'cover_letter' ? 'Generate Letter' : 'Analyze Resume'}
                </button>
           </form>
        </div>

        {/* Output Column */}
        <div className="flex flex-col h-full min-h-[500px]">
           <div className="bg-slate-900 border border-slate-800 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-2xl relative">
              {result ? (
                 <>
                    <div className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center">
                        <h3 className="font-semibold text-white truncate">{result.title}</h3>
                        <button 
                            onClick={handleCopy}
                            className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs bg-slate-700 px-2 py-1 rounded"
                        >
                            {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                            {copied ? "Copied" : "Copy"}
                        </button>
                    </div>
                    <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                        <div className="whitespace-pre-wrap text-slate-300 leading-relaxed font-serif text-lg">
                            {result.content}
                        </div>
                        
                        {result.keywords.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-slate-700">
                                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Target className="h-4 w-4" /> Recommended Keywords
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {result.keywords.map((kw, i) => (
                                        <span key={i} className="px-2.5 py-1 bg-blue-900/30 border border-blue-800 rounded text-blue-200 text-xs font-medium">
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                 </>
              ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-600 p-8 text-center space-y-4">
                      {loading ? (
                          <>
                            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                            <p className="animate-pulse">Analyzing career data...</p>
                          </>
                      ) : (
                          <>
                            <Briefcase className="h-16 w-16 opacity-20" />
                            <p>Ready to assist with your job search.</p>
                          </>
                      )}
                  </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default JobHunter;