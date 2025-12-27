
import { GoogleGenAI, Type } from "@google/genai";
import { ColorItem, PaletteResponse, WriteTone, IdeaResponse, TripResponse, RecipeResponse, TriviaResponse, DreamResponse, CareerResponse, GiftResponse, WorkoutResponse, SongResponse, LangLessonResponse, MovieResponse, CharacterResponse, FlashcardSet, TechExplanationResponse, NameGenResponse, StoryResponse, BioResponse } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_TEXT = 'gemini-2.5-flash';
const MODEL_VISION = 'gemini-2.5-flash'; // Supports multimodal input
const MODEL_CODING = 'gemini-3-pro-preview'; // Recommended for coding tasks

export const generatePalette = async (mood: string): Promise<PaletteResponse> => {
  const ai = getAI();
  
  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: `Generate a color palette based on this mood or theme: "${mood}". 
    Provide a creative name for the theme, and 5 distinct colors with their hex codes, names, and a suggested usage for each in a UI context.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          themeName: { type: Type.STRING },
          colors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                hex: { type: Type.STRING, description: "Hex code e.g. #FF0000" },
                name: { type: Type.STRING },
                usage: { type: Type.STRING, description: "e.g. Primary button, Background, Accent" },
              },
              required: ["hex", "name", "usage"]
            }
          }
        },
        required: ["themeName", "colors"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as PaletteResponse;
};

export const polishContent = async (text: string, tone: WriteTone): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: `Rewrite the following text to have a ${tone} tone. Keep the core meaning but improve flow and vocabulary.
    
    Text:
    ${text}`,
  });
  
  return response.text || "Could not generate content.";
};

export const analyzeImage = async (base64Image: string, mimeType: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODEL_VISION,
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType
          }
        },
        {
          text: "Analyze this image. Describe what is happening, the mood, and the main objects visible. Keep it under 150 words."
        }
      ]
    }
  });

  return response.text || "Could not analyze image.";
};

export const generateIdeas = async (topic: string): Promise<IdeaResponse> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: `Generate 5 creative and unique ideas/concepts for the following topic: "${topic}". 
    For each idea, provide a catchy title, a clear description, and a potential impact/benefit.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          ideas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                impact: { type: Type.STRING }
              },
              required: ["title", "description", "impact"]
            }
          }
        },
        required: ["topic", "ideas"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as IdeaResponse;
};

export const generateCode = async (prompt: string, language: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODEL_CODING,
    contents: `Write efficient and clean ${language} code for the following task. 
    Provide only the code within markdown code blocks. Add brief comments within the code where necessary.
    
    Task: ${prompt}`,
  });

  return response.text || "// Could not generate code.";
};

export const planTrip = async (destination: string, days: number, budget: string): Promise<TripResponse> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: `Plan a ${days}-day trip to ${destination} with a ${budget} budget. 
    Provide a name for the trip, and a daily itinerary. For each day, give a theme title and a list of specific activities.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          destination: { type: Type.STRING },
          tripName: { type: Type.STRING },
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.NUMBER },
                theme: { type: Type.STRING },
                activities: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["day", "theme", "activities"]
            }
          }
        },
        required: ["destination", "tripName", "days"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as TripResponse;
};

export const generateRecipe = async (ingredients: string, type: string): Promise<RecipeResponse> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: `Create a delicious ${type} recipe using these ingredients: ${ingredients}. 
    You can assume basic pantry staples (salt, oil, etc.).
    Provide a name, description, estimated cooking time, difficulty level, calorie estimate, list of ingredients with quantities, and step-by-step instructions.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          cookingTime: { type: Type.STRING },
          difficulty: { type: Type.STRING },
          calories: { type: Type.STRING },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          instructions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["name", "description", "cookingTime", "ingredients", "instructions", "difficulty", "calories"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as RecipeResponse;
};

export const generateTrivia = async (topic: string, difficulty: string): Promise<TriviaResponse> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: `Generate 5 trivia questions about "${topic}" at a "${difficulty}" difficulty level.
    For each question, provide 4 options (one correct, three wrong), the correct answer string (must match one of the options exactly), and a brief explanation.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.NUMBER },
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["id", "question", "options", "correctAnswer", "explanation"]
            }
          }
        },
        required: ["topic", "questions"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as TriviaResponse;
};

export const interpretDream = async (dream: string): Promise<DreamResponse> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: `Act as a professional dream interpreter (Jungian/Freudian blend). Interpret the following dream:
    "${dream}"
    Provide a thoughtful interpretation, identify key symbols, determine the overall mood, and give one piece of actionable advice or reflection.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          interpretation: { type: Type.STRING },
          symbols: { type: Type.ARRAY, items: { type: Type.STRING } },
          mood: { type: Type.STRING },
          actionableAdvice: { type: Type.STRING }
        },
        required: ["interpretation", "symbols", "mood", "actionableAdvice"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as DreamResponse;
};

export const generateCareerHelp = async (jobDesc: string, userBg: string, type: 'cover_letter' | 'resume_tips'): Promise<CareerResponse> => {
  const ai = getAI();
  const prompt = type === 'cover_letter' 
    ? `Write a professional cover letter for the following job description, incorporating the candidate's background. 
       Job Description: "${jobDesc}"
       Candidate Background: "${userBg}"`
    : `Analyze the following job description and candidate background. Provide a list of actionable tips to optimize the resume for this specific role, and highlight missing keywords.
       Job Description: "${jobDesc}"
       Candidate Background: "${userBg}"`;

  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Title of the document or analysis" },
          content: { type: Type.STRING, description: "The full body of the cover letter or list of tips (can be markdown)" },
          keywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Important ATS keywords to include" }
        },
        required: ["title", "content", "keywords"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as CareerResponse;
};

export const generateGiftIdeas = async (recipient: string, occasion: string, budget: string, interests: string): Promise<GiftResponse> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: `Suggest 5 unique and thoughtful gift ideas for a "${recipient}" for the occasion of "${occasion}".
    Budget: ${budget}. Interests: ${interests}.
    For each gift, provide the item name, an estimated price range, a reason why it fits, and a generic type of store to buy it from.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recipient: { type: Type.STRING },
          suggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                item: { type: Type.STRING },
                estimatedPrice: { type: Type.STRING },
                reason: { type: Type.STRING },
                whereToBuy: { type: Type.STRING }
              },
              required: ["item", "estimatedPrice", "reason", "whereToBuy"]
            }
          }
        },
        required: ["recipient", "suggestions"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as GiftResponse;
};

export const generateWorkout = async (level: string, goal: string, equipment: string, duration: string): Promise<WorkoutResponse> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: `Create a structured ${duration} minute workout for a ${level} fitness level. Goal: ${goal}. Equipment available: ${equipment}.
    Include a warm-up, a main workout with exercises (sets, reps/time, brief notes), and a cool-down.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          routineName: { type: Type.STRING },
          warmup: { type: Type.ARRAY, items: { type: Type.STRING } },
          exercises: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                sets: { type: Type.STRING },
                reps: { type: Type.STRING },
                notes: { type: Type.STRING }
              },
              required: ["name", "sets", "reps", "notes"]
            }
          },
          cooldown: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["routineName", "warmup", "exercises", "cooldown"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as WorkoutResponse;
};

export const generateSong = async (genre: string, mood: string, topic: string): Promise<SongResponse> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: `Write a song about "${topic}" in the style of "${genre}" with a "${mood}" mood.
    Structure the song with standard sections (Verse, Chorus, Bridge, etc).
    For each section, provide the lyrics AND the chord progression used.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          style: { type: Type.STRING },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, description: "e.g. Verse 1, Chorus" },
                chords: { type: Type.STRING, description: "e.g. Am - F - C - G" },
                lyrics: { type: Type.STRING, description: "The lyrics for this section" }
              },
              required: ["type", "chords", "lyrics"]
            }
          }
        },
        required: ["title", "style", "sections"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as SongResponse;
};

export const generateLanguageLesson = async (language: string, scenario: string, level: string): Promise<LangLessonResponse> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: `Create a mini language lesson for "${language}" at a "${level}" level. 
    Scenario: "${scenario}".
    Provide 5 essential phrases for this scenario. For each, include the original text, a phonetic pronunciation guide, the English translation, and a helpful usage tip.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          language: { type: Type.STRING },
          scenario: { type: Type.STRING },
          phrases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.STRING },
                phonetic: { type: Type.STRING },
                translation: { type: Type.STRING },
                tip: { type: Type.STRING }
              },
              required: ["original", "phonetic", "translation", "tip"]
            }
          }
        },
        required: ["language", "scenario", "phrases"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as LangLessonResponse;
};

export const generateMovieRecs = async (genre: string, mood: string, similarTo: string): Promise<MovieResponse> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: `Recommend 5 movies for someone who likes "${genre}" movies, is currently in a "${mood}" mood, and enjoys films like "${similarTo}".
    Provide a collection title, and for each recommendation include the title, release year, director, and a convincing reason why it fits.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          collectionTitle: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                year: { type: Type.STRING },
                director: { type: Type.STRING },
                reason: { type: Type.STRING }
              },
              required: ["title", "year", "director", "reason"]
            }
          }
        },
        required: ["collectionTitle", "recommendations"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as MovieResponse;
};

export const generateCharacter = async (genre: string, role: string): Promise<CharacterResponse> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: `Create a detailed and unique character profile for a "${role}" character in a "${genre}" story.
    Include their name, a catchy tagline, age, occupation, 3 personality traits, a compelling 1-paragraph backstory, 3 key strengths, and 2 major weaknesses.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          tagline: { type: Type.STRING },
          age: { type: Type.STRING },
          occupation: { type: Type.STRING },
          traits: { type: Type.ARRAY, items: { type: Type.STRING } },
          backstory: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["name", "tagline", "age", "occupation", "traits", "backstory", "strengths", "weaknesses"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as CharacterResponse;
};

export const generateFlashcards = async (topic: string, count: number): Promise<FlashcardSet> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: `Create a set of ${count} study flashcards for the topic "${topic}".
    For each card, provide a "front" (a question or term) and a "back" (the answer or definition). Ensure they are concise and accurate.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          cards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.NUMBER },
                front: { type: Type.STRING },
                back: { type: Type.STRING }
              },
              required: ["id", "front", "back"]
            }
          }
        },
        required: ["topic", "cards"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as FlashcardSet;
};

export const explainTech = async (topic: string, level: string): Promise<TechExplanationResponse> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: `Explain the concept of "${topic}" to an audience with a "${level}" level of understanding.
    Provide a clear and simple explanation, a relatable real-world analogy to help visualize it, and define 3 key terms related to the topic.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          explanation: { type: Type.STRING },
          analogy: { type: Type.STRING },
          keyTerms: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING },
                definition: { type: Type.STRING }
              },
              required: ["term", "definition"]
            }
          }
        },
        required: ["topic", "explanation", "analogy", "keyTerms"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as TechExplanationResponse;
};

export const generateNames = async (category: string, description: string): Promise<NameGenResponse> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: `Generate 10 creative and unique names for a "${category}" described as: "${description}".
    For each name, provide a brief rationale explaining why it fits or the meaning behind it.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          suggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                rationale: { type: Type.STRING }
              },
              required: ["name", "rationale"]
            }
          }
        },
        required: ["category", "suggestions"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as NameGenResponse;
};

export const generateStory = async (genre: string, theme: string): Promise<StoryResponse> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: `Create a compelling story plot outline for a "${genre}" story with the theme "${theme}".
    Include a Title, a one-sentence Logline, a brief Protagonist description, key Plot Points (Inciting Incident, Rising Action, Climax, Falling Action, Resolution), and a Plot Twist.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          logline: { type: Type.STRING },
          genre: { type: Type.STRING },
          protagonist: { type: Type.STRING },
          plotPoints: {
            type: Type.OBJECT,
            properties: {
              incitingIncident: { type: Type.STRING },
              risingAction: { type: Type.STRING },
              climax: { type: Type.STRING },
              fallingAction: { type: Type.STRING },
              resolution: { type: Type.STRING }
            },
            required: ["incitingIncident", "risingAction", "climax", "fallingAction", "resolution"]
          },
          twist: { type: Type.STRING }
        },
        required: ["title", "logline", "genre", "protagonist", "plotPoints", "twist"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as StoryResponse;
};

export const generateBios = async (name: string, role: string, vibe: string, platform: string): Promise<BioResponse> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: `Generate 5 varied social media bios for "${name}", who is a "${role}". The vibe should be "${vibe}".
    These bios are for "${platform}". Ensure they fit the typical character limits and style of that platform.
    Return a list of strings.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          platform: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["platform", "options"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as BioResponse;
};
