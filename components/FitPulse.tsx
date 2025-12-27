import React, { useState } from 'react';
import { generateWorkout } from '../services/geminiService';
import { WorkoutResponse } from '../types';
import { Dumbbell, Loader2, Timer, Activity, Zap } from 'lucide-react';

const FitPulse: React.FC = () => {
  const [level, setLevel] = useState('Intermediate');
  const [goal, setGoal] = useState('');
  const [equipment, setEquipment] = useState('');
  const [duration, setDuration] = useState('30');
  const [result, setResult] = useState<WorkoutResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim() || !equipment.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await generateWorkout(level, goal, equipment, duration);
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
          <Activity className="h-8 w-8 text-emerald-400" />
          Fit Pulse
        </h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Your AI Personal Trainer. Define your goals and equipment, and get a tailored workout routine instantly.
        </p>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 max-w-3xl mx-auto">
        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase">Fitness Level</label>
                <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full bg-slate-900 border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase">Duration (Minutes)</label>
                <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-slate-900 border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="45">45 Minutes</option>
                    <option value="60">60 Minutes</option>
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase">Goal</label>
                <input
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="E.g. Weight Loss, Muscle Gain, Flexibility..."
                    className="w-full bg-slate-900 border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase">Equipment Available</label>
                <input
                    type="text"
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                    placeholder="E.g. Dumbbells, Yoga Mat, None..."
                    className="w-full bg-slate-900 border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
            </div>

            <div className="sm:col-span-2 pt-2">
                <button
                    type="submit"
                    disabled={loading || !goal.trim() || !equipment.trim()}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Dumbbell className="h-5 w-5" />}
                    Generate Workout
                </button>
            </div>
        </form>
      </div>

      {result && (
        <div className="space-y-6 animate-fade-in pb-10">
           <div className="text-center">
              <h3 className="text-2xl font-bold text-white">{result.routineName}</h3>
              <div className="flex items-center justify-center gap-4 mt-2 text-emerald-400">
                  <span className="flex items-center gap-1 text-sm bg-emerald-900/30 px-3 py-1 rounded-full"><Activity className="h-4 w-4" /> {level}</span>
                  <span className="flex items-center gap-1 text-sm bg-emerald-900/30 px-3 py-1 rounded-full"><Timer className="h-4 w-4" /> {duration} min</span>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* Warmup */}
               <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-700/50">
                   <h4 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                       <Zap className="h-5 w-5 text-yellow-400" /> Warm Up
                   </h4>
                   <ul className="space-y-2">
                       {result.warmup.map((item, i) => (
                           <li key={i} className="text-slate-400 text-sm flex items-start gap-2">
                               <span className="text-yellow-500 mt-1">•</span> {item}
                           </li>
                       ))}
                   </ul>
               </div>

               {/* Main Circuit */}
               <div className="md:col-span-2 bg-emerald-900/10 p-5 rounded-2xl border border-emerald-900/50">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                       <Dumbbell className="h-5 w-5 text-emerald-400" /> Main Circuit
                    </h4>
                    <div className="space-y-4">
                        {result.exercises.map((ex, i) => (
                            <div key={i} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                <div>
                                    <h5 className="font-bold text-white">{ex.name}</h5>
                                    <p className="text-xs text-slate-400">{ex.notes}</p>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-medium text-emerald-300 bg-slate-900/50 px-3 py-1.5 rounded-lg shrink-0">
                                    <span>{ex.sets} Sets</span>
                                    <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                    <span>{ex.reps}</span>
                                </div>
                            </div>
                        ))}
                    </div>
               </div>

               {/* Cooldown */}
               <div className="md:col-span-3 bg-slate-800/30 p-5 rounded-2xl border border-slate-700/50">
                   <h4 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                       <Activity className="h-5 w-5 text-blue-400" /> Cool Down
                   </h4>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {result.cooldown.map((item, i) => (
                            <div key={i} className="text-slate-400 text-sm flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span> {item}
                            </div>
                        ))}
                   </div>
               </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default FitPulse;