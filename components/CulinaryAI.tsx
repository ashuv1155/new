import React, { useState } from 'react';
import { generateRecipe } from '../services/geminiService';
import { RecipeResponse } from '../types';
import { Utensils, Loader2, ChefHat, Clock, Flame, List, AlignLeft } from 'lucide-react';

const CulinaryAI: React.FC = () => {
  const [ingredients, setIngredients] = useState('');
  const [mealType, setMealType] = useState('Dinner');
  const [result, setResult] = useState<RecipeResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await generateRecipe(ingredients, mealType);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">Culinary AI</h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Got random ingredients? List them below and let our AI Chef create a custom recipe for you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Input Form */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-xl">
                 <form onSubmit={handleGenerate} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs text-slate-400 font-medium uppercase flex items-center gap-2">
                            <Utensils className="h-4 w-4" /> Meal Type
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {mealTypes.map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setMealType(type)}
                                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                                        mealType === type 
                                        ? 'bg-brand-600 text-white' 
                                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-slate-400 font-medium uppercase">Ingredients</label>
                        <textarea
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            placeholder="E.g., Chicken breast, rice, lemon, garlic..."
                            className="w-full h-32 bg-slate-900 border-slate-600 text-white rounded-xl p-4 focus:ring-2 focus:ring-brand-500 focus:outline-none resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !ingredients.trim()}
                        className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-900/20"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <ChefHat className="h-5 w-5" />}
                        Create Recipe
                    </button>
                 </form>
            </div>
        </div>

        {/* Result Card */}
        <div className="lg:col-span-2">
            {result ? (
                <div className="bg-white text-slate-900 rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
                    <div className="bg-amber-100 p-8 border-b border-amber-200">
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <h3 className="text-3xl font-serif font-bold text-slate-900 mb-2">{result.name}</h3>
                                <p className="text-slate-700 italic">{result.description}</p>
                            </div>
                            <div className="bg-white/50 p-3 rounded-full">
                                <ChefHat className="h-8 w-8 text-amber-600" />
                            </div>
                        </div>
                        
                        <div className="flex gap-4 mt-6 text-sm font-medium text-slate-700">
                            <div className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-full">
                                <Clock className="h-4 w-4 text-amber-600" /> {result.cookingTime}
                            </div>
                            <div className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-full">
                                <Flame className="h-4 w-4 text-orange-500" /> {result.calories}
                            </div>
                            <div className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-full">
                                <span className={`h-2 w-2 rounded-full ${result.difficulty === 'Easy' ? 'bg-green-500' : result.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                                {result.difficulty}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 grid md:grid-cols-2 gap-8">
                        <div>
                             <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <List className="h-4 w-4 text-amber-600" /> Ingredients
                             </h4>
                             <ul className="space-y-2">
                                 {result.ingredients.map((ing, i) => (
                                     <li key={i} className="flex items-start gap-2 text-slate-700 text-sm border-b border-slate-100 pb-2 last:border-0">
                                         <span className="text-amber-500 font-bold">•</span> {ing}
                                     </li>
                                 ))}
                             </ul>
                        </div>
                        <div>
                             <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <AlignLeft className="h-4 w-4 text-amber-600" /> Instructions
                             </h4>
                             <ol className="space-y-4">
                                 {result.instructions.map((step, i) => (
                                     <li key={i} className="flex gap-3 text-slate-700 text-sm">
                                         <span className="flex-shrink-0 h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                                             {i + 1}
                                         </span>
                                         <span className="leading-relaxed pt-0.5">{step}</span>
                                     </li>
                                 ))}
                             </ol>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-full min-h-[400px] bg-slate-800/30 border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center text-slate-500">
                    {loading ? (
                         <div className="text-center space-y-3">
                             <Loader2 className="h-10 w-10 animate-spin mx-auto text-brand-500" />
                             <p className="animate-pulse">The chef is thinking...</p>
                         </div>
                    ) : (
                        <div className="text-center space-y-2">
                            <Utensils className="h-12 w-12 mx-auto opacity-20" />
                            <p>Recipe card will appear here</p>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CulinaryAI;