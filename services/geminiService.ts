



import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, MatchCandidate, CommunityTopic, DatePlan } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize safely
const ai = new GoogleGenAI({ apiKey });

export const GeminiService = {
  /**
   * Helper: Calculate distance between two coordinates in km
   */
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    const d = R * c; // Distance in km
    return parseFloat(d.toFixed(1));
  },

  /**
   * Generates community discussion topics based on trends or user interests.
   */
  async generateCommunityTopics(language: 'vi' | 'en' = 'vi'): Promise<CommunityTopic[]> {
    try {
      if (!apiKey) return [];
      
      const prompt = `Generate 5 engaging and modern dating/relationship discussion topics. Language: ${language}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                likes: { type: Type.NUMBER },
                comments: { type: Type.NUMBER },
              },
              required: ['id', 'title', 'description', 'tags']
            }
          }
        }
      });

      const text = response.text;
      if (!text) return [];
      return JSON.parse(text) as CommunityTopic[];

    } catch (error) {
      console.error("Gemini Topic Error:", error);
      return [];
    }
  },

  /**
   * Suggests a meeting location, time, and 'who pays' logic in one go.
   * Optimized for extreme speed (short prompt, less tokens).
   */
  async suggestDatePlan(user: UserProfile, candidate: MatchCandidate, language: 'vi' | 'en' = 'vi'): Promise<DatePlan | null> {
    try {
        if (!apiKey) return null;

        const userLoc = user.coordinates ? `${user.coordinates.lat},${user.coordinates.lng}` : user.location;
        const candidateLoc = candidate.location;
        const sharedInterests = user.interests.filter(i => candidate.interests.includes(i)).join(', ');

        // Ultra-fast prompt. Explicitly asking for ONE single best location.
        const prompt = `User(${userLoc}), Match(${candidateLoc}). Interests: ${sharedInterests}.
          Return strictly ONE unique date plan object.
          1. Best venue at midpoint.
          2. Specific time.
          3. Payer logic (Me/Them/Split).
          Lang: ${language}. JSON.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        address: { type: Type.STRING },
                        suggested_time: { type: Type.STRING },
                        description: { type: Type.STRING },
                        reason: { type: Type.STRING },
                        coordinates: { 
                            type: Type.OBJECT, 
                            properties: { lat: { type: Type.NUMBER }, lng: { type: Type.NUMBER } } 
                        },
                        whoPays: {
                            type: Type.OBJECT, 
                            properties: { payer: { type: Type.STRING }, reason: { type: Type.STRING } }
                        }
                    }
                }
            }
        });
        
        const text = response.text;
        return text ? JSON.parse(text) : null;
    } catch (e) {
        console.error(e);
        return {
            name: "The Coffee House",
            address: "Center City",
            suggested_time: "19:00",
            description: language === 'vi' ? "Địa điểm phổ biến." : "Popular spot.",
            reason: "Safe choice",
            coordinates: { lat: 10.7769, lng: 106.7009 },
            whoPays: { payer: "Split", reason: "First date rule" }
        };
    }
  },

  async findMeetingSpot(userLocation: string, matchLocation: string, language: 'vi' | 'en' = 'vi'): Promise<{ text: string, mapLink?: string, placeName?: string }> {
     // Legacy method kept for fallback
      return { text: "Use suggestDatePlan", mapLink: "" };
  }
};
