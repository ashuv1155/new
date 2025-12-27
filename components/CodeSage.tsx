import React, { useState } from 'react';
import { generateCode } from '../services/geminiService';
import { Terminal, Play, Copy, Check, Code2 } from 'lucide-react';

const CodeSage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const languages = ['JavaScript', 'TypeScript', 'Python', 'HTML/CSS', 'SQL', 'React', 'Shell'];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setCode('');
    try {
      const result = await generateCode(prompt, language);
      setCode(result);
    } catch (error) {
      console.error(error);
      setCode('// Error generating code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    // Remove markdown code blocks ``` if present for copying
    const cleanCode = code.replace(/```[a-z]*\n/g, '').replace(/```$/g, '');
    navigator.clipboard.writeText(cleanCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-12rem)] flex flex-col gap-6 animate-fade-in">
       <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Code Sage</h2>
          <p className="text-slate-400">Describe the function or component you need, and let Gemini write it.</p>
        </div>
        
        <div className="flex items-center gap-2">
           <select 
             value={language}
             onChange={(e) => setLanguage(e.target.value)}
             className="bg-slate-800 border-slate-700 text-white text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5"
           >
             {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
           </select>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Input Column */}
        <div className="flex flex-col gap-4">
          <div className="flex-1 bg-slate-800 rounded-2xl p-4 border border-slate-700 flex flex-col gap-4">
             <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Code2 className="h-4 w-4" /> Prompt
             </label>
             <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Example: Create a ${language} function that calculates the Fibonacci sequence recursively with memoization.`}
                className="flex-1 bg-transparent border-0 text-slate-200 resize-none focus:ring-0 focus:outline-none placeholder:text-slate-600 font-mono text-sm leading-relaxed"
              />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-brand-900/20 transition-all"
          >
             {loading ? <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" /> : <Play className="h-5 w-5" />}
             {loading ? "Generating..." : "Generate Code"}
          </button>
        </div>

        {/* Output Column */}
        <div className="flex flex-col gap-2 relative bg-[#1e1e1e] rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
          <div className="bg-[#252526] px-4 py-2 flex justify-between items-center border-b border-[#333]">
             <span className="text-xs text-slate-400 font-mono">Editor</span>
             {code && (
               <button 
                 onClick={handleCopy}
                 className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
               >
                 {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                 {copied ? "Copied" : "Copy"}
               </button>
             )}
          </div>
          <div className="flex-1 p-6 overflow-auto font-mono text-sm text-gray-300 leading-relaxed custom-scrollbar">
            {code ? (
              <pre className="whitespace-pre-wrap">{code}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600">
                <Terminal className="h-12 w-12 mb-4 opacity-20" />
                <p>Ready to code.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeSage;
