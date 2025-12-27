
import React from 'react';
import { AppTab } from '../types';
import { Palette, PenTool, Eye, Zap, Lightbulb, Terminal, Map, Utensils, Gamepad2, Moon, Briefcase, Gift, Dumbbell, Music, Globe, Clapperboard, User, GraduationCap, Cpu, FlaskConical, BookOpenText, AtSign } from 'lucide-react';

interface HeaderProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: AppTab.PALETTE, label: 'Palette AI', icon: Palette },
    { id: AppTab.WRITER, label: 'Content Polish', icon: PenTool },
    { id: AppTab.VISION, label: 'Vision Lab', icon: Eye },
    { id: AppTab.IDEAS, label: 'Idea Spark', icon: Lightbulb },
    { id: AppTab.CODE, label: 'Code Sage', icon: Terminal },
    { id: AppTab.TRAVEL, label: 'Journey AI', icon: Map },
    { id: AppTab.RECIPE, label: 'Culinary AI', icon: Utensils },
    { id: AppTab.TRIVIA, label: 'Trivia Master', icon: Gamepad2 },
    { id: AppTab.DREAM, label: 'Dream Reader', icon: Moon },
    { id: AppTab.CAREER, label: 'Career Ally', icon: Briefcase },
    { id: AppTab.GIFT, label: 'Gift Scout', icon: Gift },
    { id: AppTab.WORKOUT, label: 'Fit Pulse', icon: Dumbbell },
    { id: AppTab.SONG, label: 'Song Smith', icon: Music },
    { id: AppTab.LANG, label: 'Lang Learn', icon: Globe },
    { id: AppTab.MOVIE, label: 'Movie Match', icon: Clapperboard },
    { id: AppTab.CHARACTER, label: 'Character Forge', icon: User },
    { id: AppTab.FLASHCARDS, label: 'Study Buddy', icon: GraduationCap },
    { id: AppTab.TECH, label: 'Tech Insider', icon: Cpu },
    { id: AppTab.NAME, label: 'Name Lab', icon: FlaskConical },
    { id: AppTab.STORY, label: 'Story Sprout', icon: BookOpenText },
    { id: AppTab.BIO, label: 'Bio Builder', icon: AtSign },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 p-2 rounded-lg shadow-lg shadow-brand-900/50">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden sm:block">
              Lumina
            </h1>
          </div>
          
          <div className="overflow-x-auto no-scrollbar ml-4">
            <nav className="flex space-x-1 sm:space-x-2">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap
                      ${isActive 
                        ? 'bg-slate-800 text-brand-500 shadow-sm' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
