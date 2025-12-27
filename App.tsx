
import React, { useState } from 'react';
import Header from './components/Header';
import PaletteGen from './components/PaletteGen';
import WriterBot from './components/WriterBot';
import VisionBot from './components/VisionBot';
import IdeaSpark from './components/IdeaSpark';
import CodeSage from './components/CodeSage';
import JourneyAI from './components/JourneyAI';
import CulinaryAI from './components/CulinaryAI';
import TriviaGen from './components/TriviaGen';
import DreamReader from './components/DreamReader';
import JobHunter from './components/JobHunter';
import GiftScout from './components/GiftScout';
import FitPulse from './components/FitPulse';
import SongSmith from './components/SongSmith';
import LangLearn from './components/LangLearn';
import MovieMatch from './components/MovieMatch';
import CharacterForge from './components/CharacterForge';
import FlashcardWizard from './components/FlashcardWizard';
import TechInsider from './components/TechInsider';
import NameLab from './components/NameLab';
import StorySprout from './components/StorySprout';
import BioBuilder from './components/BioBuilder';
import { AppTab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.PALETTE);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.PALETTE:
        return <PaletteGen />;
      case AppTab.WRITER:
        return <WriterBot />;
      case AppTab.VISION:
        return <VisionBot />;
      case AppTab.IDEAS:
        return <IdeaSpark />;
      case AppTab.CODE:
        return <CodeSage />;
      case AppTab.TRAVEL:
        return <JourneyAI />;
      case AppTab.RECIPE:
        return <CulinaryAI />;
      case AppTab.TRIVIA:
        return <TriviaGen />;
      case AppTab.DREAM:
        return <DreamReader />;
      case AppTab.CAREER:
        return <JobHunter />;
      case AppTab.GIFT:
        return <GiftScout />;
      case AppTab.WORKOUT:
        return <FitPulse />;
      case AppTab.SONG:
        return <SongSmith />;
      case AppTab.LANG:
        return <LangLearn />;
      case AppTab.MOVIE:
        return <MovieMatch />;
      case AppTab.CHARACTER:
        return <CharacterForge />;
      case AppTab.FLASHCARDS:
        return <FlashcardWizard />;
      case AppTab.TECH:
        return <TechInsider />;
      case AppTab.NAME:
        return <NameLab />;
      case AppTab.STORY:
        return <StorySprout />;
      case AppTab.BIO:
        return <BioBuilder />;
      default:
        return <PaletteGen />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-brand-500 selection:text-white pb-12">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[120px]" />
      </div>
    </div>
  );
};

export default App;
