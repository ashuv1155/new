import React, { useState } from 'react';
import { generateGiftIdeas } from '../services/geminiService';
import { GiftResponse } from '../types';
import { Gift, Loader2, Heart, Tag, ShoppingBag, Sparkles } from 'lucide-react';

const GiftScout: React.FC = () => {
  const [recipient, setRecipient] = useState('');
  const [occasion, setOccasion] = useState('');
  const [budget, setBudget] = useState('');
  const [interests, setInterests] = useState('');
  const [result, setResult] = useState<GiftResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !interests.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await generateGiftIdeas(recipient, occasion, budget, interests);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
          <Gift className="h-8 w-8 text-pink-400" />
          Gift Scout
        </h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Find the perfect gift for anyone. Tell us about them, and we'll do the shopping research.
        </p>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 max-w-3xl mx-auto">
        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase">Recipient (Relation)</label>
                <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="E.g. Mom, Best Friend, Boss..."
                    className="w-full bg-slate-900 border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase">Occasion</label>
                <input
                    type="text"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    placeholder="E.g. Birthday, Anniversary..."
                    className="w-full bg-slate-900 border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase">Budget</label>
                <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="E.g. $50, Under $200..."
                    className="w-full bg-slate-900 border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase">Interests / Hobbies</label>
                <input
                    type="text"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="E.g. Gardening, Sci-Fi, Cooking..."
                    className="w-full bg-slate-900 border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
            </div>
            <div className="sm:col-span-2 pt-2">
                <button
                    type="submit"
                    disabled={loading || !recipient.trim()}
                    className="w-full bg-pink-600 hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-900/20"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                    Find Gifts
                </button>
            </div>
        </form>
      </div>

      {result && (
        <div className="space-y-6 animate-fade-in pb-10">
           <div className="flex items-center gap-2 text-pink-300 font-medium justify-center">
             <Heart className="h-5 w-5 fill-pink-500/20" />
             <span>Top Picks for {result.recipient}</span>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {result.suggestions.map((gift, idx) => (
                   <div key={idx} className="bg-white text-slate-900 rounded-2xl overflow-hidden shadow-xl hover:-translate-y-1 transition-transform duration-300 flex flex-col">
                       <div className="bg-pink-100 p-6 border-b border-pink-200">
                           <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">{gift.item}</h3>
                           <div className="flex items-center gap-2 text-sm font-semibold text-pink-700">
                               <Tag className="h-4 w-4" /> {gift.estimatedPrice}
                           </div>
                       </div>
                       <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                           <p className="text-slate-600 text-sm leading-relaxed">
                               {gift.reason}
                           </p>
                           <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                               <ShoppingBag className="h-4 w-4" />
                               Find at: <span className="text-pink-600">{gift.whereToBuy}</span>
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

export default GiftScout;