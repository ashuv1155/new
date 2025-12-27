import React, { useState } from 'react';
import { generateTrivia } from '../services/geminiService';
import { TriviaResponse } from '../types';
import { Gamepad2, Loader2, CheckCircle, XCircle, Trophy, HelpCircle } from 'lucide-react';

const TriviaGen: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [result, setResult] = useState<TriviaResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setResult(null);
    setSelectedAnswers({});
    setRevealed({});

    try {
      const data = await generateTrivia(topic, difficulty);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (questionId: number, option: string) => {
    if (revealed[questionId]) return; // Prevent changing after reveal
    setSelectedAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleReveal = (questionId: number) => {
    setRevealed(prev => ({ ...prev, [questionId]: true }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">Trivia Master</h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Challenge yourself! Enter any topic and we'll generate a quiz to test your knowledge.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Topic (e.g., 90s Music, Space, Cats)..."
          className="flex-1 bg-slate-800 border-slate-700 text-white rounded-xl px-6 py-4 focus:ring-2 focus:ring-brand-500 focus:outline-none"
        />
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="bg-slate-800 border-slate-700 text-white rounded-xl px-6 py-4 focus:ring-2 focus:ring-brand-500 focus:outline-none"
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-900/20"
        >
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <Gamepad2 className="h-5 w-5" />
          )}
          Start Quiz
        </button>
      </form>

      {result && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-center gap-2 text-brand-400 font-medium">
            <Trophy className="h-5 w-5" />
            <span>Quiz: {result.topic}</span>
          </div>

          <div className="grid gap-6">
            {result.questions.map((q, idx) => {
              const isRevealed = revealed[idx];
              const selected = selectedAnswers[idx];
              const isCorrect = selected === q.correctAnswer;
              
              return (
                <div key={idx} className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
                  <div className="p-6 border-b border-slate-700/50">
                    <h3 className="text-lg font-semibold text-white flex gap-3">
                      <span className="text-slate-500 font-mono">0{idx + 1}.</span> 
                      {q.question}
                    </h3>
                  </div>
                  
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {q.options.map((option) => {
                      let btnClass = "bg-slate-900 border-slate-700 hover:bg-slate-700 text-slate-300";
                      
                      if (isRevealed) {
                        if (option === q.correctAnswer) {
                          btnClass = "bg-green-900/30 border-green-500 text-green-200";
                        } else if (selected === option && option !== q.correctAnswer) {
                          btnClass = "bg-red-900/30 border-red-500 text-red-200 opacity-50";
                        } else {
                          btnClass = "bg-slate-900 border-slate-800 text-slate-600 opacity-50";
                        }
                      } else if (selected === option) {
                         btnClass = "bg-brand-900/30 border-brand-500 text-brand-200";
                      }

                      return (
                        <button
                          key={option}
                          onClick={() => handleSelect(idx, option)}
                          disabled={isRevealed}
                          className={`
                            p-4 rounded-xl border text-left transition-all duration-200 flex justify-between items-center
                            ${btnClass}
                          `}
                        >
                          {option}
                          {isRevealed && option === q.correctAnswer && <CheckCircle className="h-5 w-5 text-green-500" />}
                          {isRevealed && selected === option && option !== q.correctAnswer && <XCircle className="h-5 w-5 text-red-500" />}
                        </button>
                      );
                    })}
                  </div>

                  {selected && !isRevealed && (
                    <div className="px-6 pb-6">
                      <button 
                        onClick={() => handleReveal(idx)}
                        className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium transition-colors"
                      >
                        Check Answer
                      </button>
                    </div>
                  )}

                  {isRevealed && (
                    <div className={`px-6 pb-6 animate-fade-in ${isCorrect ? 'text-green-200' : 'text-slate-300'}`}>
                       <div className="bg-slate-900/50 rounded-lg p-4 text-sm flex gap-3 items-start">
                          <HelpCircle className="h-5 w-5 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block mb-1">{isCorrect ? "Correct!" : "Explanation:"}</span>
                            {q.explanation}
                          </div>
                       </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TriviaGen;