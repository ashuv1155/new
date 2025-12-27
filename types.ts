
export enum AppTab {
  PALETTE = 'PALETTE',
  WRITER = 'WRITER',
  VISION = 'VISION',
  IDEAS = 'IDEAS',
  CODE = 'CODE',
  TRAVEL = 'TRAVEL',
  RECIPE = 'RECIPE',
  TRIVIA = 'TRIVIA',
  DREAM = 'DREAM',
  CAREER = 'CAREER',
  GIFT = 'GIFT',
  WORKOUT = 'WORKOUT',
  SONG = 'SONG',
  LANG = 'LANG',
  MOVIE = 'MOVIE',
  CHARACTER = 'CHARACTER',
  FLASHCARDS = 'FLASHCARDS',
  TECH = 'TECH',
  NAME = 'NAME',
  STORY = 'STORY',
  BIO = 'BIO',
}

export interface ColorItem {
  hex: string;
  name: string;
  usage: string;
}

export interface PaletteResponse {
  themeName: string;
  colors: ColorItem[];
}

export enum WriteTone {
  PROFESSIONAL = 'Professional',
  WITTY = 'Witty',
  CONCISE = 'Concise',
  POETIC = 'Poetic',
}

export interface VisionResult {
  description: string;
  tags: string[];
}

export interface IdeaItem {
  title: string;
  description: string;
  impact: string;
}

export interface IdeaResponse {
  topic: string;
  ideas: IdeaItem[];
}

export interface DayPlan {
  day: number;
  theme: string;
  activities: string[];
}

export interface TripResponse {
  destination: string;
  tripName: string;
  days: DayPlan[];
}

export interface RecipeResponse {
  name: string;
  description: string;
  cookingTime: string;
  difficulty: string;
  calories: string;
  ingredients: string[];
  instructions: string[];
}

export interface TriviaQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface TriviaResponse {
  topic: string;
  questions: TriviaQuestion[];
}

export interface DreamResponse {
  interpretation: string;
  symbols: string[];
  mood: string;
  actionableAdvice: string;
}

export interface CareerResponse {
  title: string;
  content: string;
  keywords: string[];
}

export interface GiftIdea {
  item: string;
  estimatedPrice: string;
  reason: string;
  whereToBuy: string;
}

export interface GiftResponse {
  recipient: string;
  suggestions: GiftIdea[];
}

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  notes: string;
}

export interface WorkoutResponse {
  routineName: string;
  warmup: string[];
  exercises: Exercise[];
  cooldown: string[];
}

export interface SongSection {
  type: string;
  chords: string;
  lyrics: string;
}

export interface SongResponse {
  title: string;
  style: string;
  sections: SongSection[];
}

export interface Phrase {
  original: string;
  phonetic: string;
  translation: string;
  tip: string;
}

export interface LangLessonResponse {
  language: string;
  scenario: string;
  phrases: Phrase[];
}

export interface MovieRec {
  title: string;
  year: string;
  director: string;
  reason: string;
}

export interface MovieResponse {
  collectionTitle: string;
  recommendations: MovieRec[];
}

export interface CharacterResponse {
  name: string;
  tagline: string;
  age: string;
  occupation: string;
  traits: string[];
  backstory: string;
  strengths: string[];
  weaknesses: string[];
}

export interface Flashcard {
  id: number;
  front: string;
  back: string;
}

export interface FlashcardSet {
  topic: string;
  cards: Flashcard[];
}

export interface TechTerm {
  term: string;
  definition: string;
}

export interface TechExplanationResponse {
  topic: string;
  explanation: string;
  analogy: string;
  keyTerms: TechTerm[];
}

export interface NameSuggestion {
  name: string;
  rationale: string;
}

export interface NameGenResponse {
  category: string;
  suggestions: NameSuggestion[];
}

export interface StoryResponse {
  title: string;
  logline: string;
  genre: string;
  protagonist: string;
  plotPoints: {
    incitingIncident: string;
    risingAction: string;
    climax: string;
    fallingAction: string;
    resolution: string;
  };
  twist: string;
}

export interface BioResponse {
  platform: string;
  options: string[];
}
