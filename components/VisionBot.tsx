import React, { useState, useRef } from 'react';
import { analyzeImage } from '../services/geminiService';
import { Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react';

const VisionBot: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Extract the base64 data part
        const base64Data = base64String.split(',')[1];
        setImage(base64Data);
        setMimeType(file.type);
        setAnalysis(''); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image || !mimeType) return;
    setLoading(true);
    try {
      const result = await analyzeImage(image, mimeType);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
      setAnalysis('Failed to analyze image.');
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setMimeType('');
    setAnalysis('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
       <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">Vision Lab</h2>
        <p className="text-slate-400">Upload an image to get an AI-powered breakdown of its contents and mood.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Upload Area */}
        <div className="space-y-4">
          <div 
            className={`
              relative border-2 border-dashed rounded-2xl h-80 flex flex-col items-center justify-center transition-all overflow-hidden
              ${image ? 'border-brand-500 bg-slate-900' : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-500'}
            `}
          >
            {image ? (
              <>
                <img 
                  src={`data:${mimeType};base64,${image}`} 
                  alt="Preview" 
                  className="w-full h-full object-contain p-4"
                />
                <button 
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </>
            ) : (
              <label className="cursor-pointer flex flex-col items-center gap-4 w-full h-full justify-center">
                <div className="p-4 bg-slate-800 rounded-full">
                  <Upload className="h-8 w-8 text-slate-400" />
                </div>
                <div className="text-center">
                  <p className="text-white font-medium">Click to upload image</p>
                  <p className="text-sm text-slate-500">JPG, PNG, WEBP up to 5MB</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*" 
                  className="hidden" 
                />
              </label>
            )}
          </div>
          
          <button
            onClick={handleAnalyze}
            disabled={!image || loading}
            className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-900/20"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" /> Analyzing...
              </>
            ) : (
              <>
                <ImageIcon className="h-5 w-5" /> Analyze Image
              </>
            )}
          </button>
        </div>

        {/* Results Area */}
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 min-h-[320px] flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-brand-500 rounded-full"></span>
            Analysis Result
          </h3>
          
          <div className="flex-1 text-slate-300 leading-relaxed whitespace-pre-line">
            {analysis ? (
              <div className="animate-fade-in">{analysis}</div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 italic">
                {loading ? (
                  <p className="animate-pulse">Gemini is looking at your image...</p>
                ) : (
                  <p>Upload an image and click analyze to see the magic.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionBot;
