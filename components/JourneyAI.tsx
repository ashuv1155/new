import React, { useState } from 'react';
import { planTrip } from '../services/geminiService';
import { TripResponse } from '../types';
import { Map, Loader2, Calendar, DollarSign, MapPin } from 'lucide-react';

const JourneyAI: React.FC = () => {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState('Medium');
  const [result, setResult] = useState<TripResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await planTrip(destination, days, budget);
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
        <h2 className="text-3xl font-bold text-white">Journey AI</h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Enter your dream destination and let us craft a day-by-day itinerary tailored to your budget.
        </p>
      </div>

      <form onSubmit={handlePlan} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="sm:col-span-2 space-y-2">
            <label className="text-xs text-slate-400 font-medium uppercase">Destination</label>
            <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Kyoto, Paris, New York..."
                className="w-full bg-slate-900 border-slate-700 text-white rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
            </div>
        </div>

        <div className="space-y-2">
             <label className="text-xs text-slate-400 font-medium uppercase">Duration (Days)</label>
             <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                <input
                    type="number"
                    min="1"
                    max="14"
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value))}
                    className="w-full bg-slate-900 border-slate-700 text-white rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
            </div>
        </div>

        <div className="space-y-2">
             <label className="text-xs text-slate-400 font-medium uppercase">Budget</label>
             <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-slate-900 border-slate-700 text-white rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none appearance-none"
                >
                    <option value="Budget">Budget</option>
                    <option value="Medium">Medium</option>
                    <option value="Luxury">Luxury</option>
                </select>
            </div>
        </div>

        <button
          type="submit"
          disabled={loading || !destination.trim()}
          className="sm:col-span-4 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-brand-900/20"
        >
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <Map className="h-5 w-5" />
          )}
          Plan Trip
        </button>
      </form>

      {result && (
        <div className="space-y-8 animate-fade-in pb-10">
           <div className="text-center">
              <h3 className="text-2xl font-bold text-white">{result.tripName}</h3>
              <p className="text-brand-400 font-medium mt-1 uppercase tracking-widest text-sm">Itinerary</p>
           </div>

           <div className="relative border-l-2 border-slate-700 ml-4 md:ml-auto md:mr-auto md:max-w-2xl space-y-12">
               {result.days.map((day) => (
                   <div key={day.day} className="relative pl-8">
                       <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-brand-500 ring-4 ring-slate-900" />
                       <div className="space-y-3">
                           <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-brand-400 uppercase tracking-wider bg-brand-900/30 px-2 py-1 rounded">Day {day.day}</span>
                                <h4 className="text-xl font-semibold text-white">{day.theme}</h4>
                           </div>
                           <ul className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50 space-y-3">
                               {day.activities.map((activity, i) => (
                                   <li key={i} className="flex items-start gap-3 text-slate-300">
                                       <span className="h-1.5 w-1.5 rounded-full bg-slate-500 mt-2 shrink-0" />
                                       <span className="leading-relaxed">{activity}</span>
                                   </li>
                               ))}
                           </ul>
                       </div>
                   </div>
               ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default JourneyAI;