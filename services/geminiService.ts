
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, MatchCandidate, CommunityTopic } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize safely
const ai = new GoogleGenAI({ apiKey });

export const GeminiService = {
  /**
   * Generates community discussion topics based on trends or user interests.
   */
  async generateCommunityTopics(language: 'vi' | 'en' = 'vi'): Promise<CommunityTopic[]> {
    try {
      if (!apiKey) return [];
      
      const prompt = `Generate 5 engaging and modern dating/relationship discussion topics for a dating app community. 
      The language MUST be ${language === 'vi' ? 'Vietnamese' : 'English'}.
      Keep it fun, respectful, and viral-worthy.`;

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
   * Suggests a meeting location and time based on two profiles.
   */
  async suggestDatePlan(user: UserProfile, candidate: MatchCandidate, language: 'vi' | 'en' = 'vi'): Promise<any> {
    try {
        if (!apiKey) return null;

        // Use real coordinates if available, otherwise fallback to string location
        const userLoc = user.coordinates ? `${user.coordinates.lat},${user.coordinates.lng}` : user.location;
        const candidateLoc = candidate.location;

        const prompt = `
          Suggest a perfect first date plan for these two people.
          User A Location: ${userLoc}
          User B Location: ${candidateLoc}
          User A Profile: ${JSON.stringify(user)}
          User B Profile: ${JSON.stringify(candidate)}
          
          Important: The response MUST be in ${language === 'vi' ? 'Vietnamese' : 'English'}.
          
          Return a JSON object with:
          - venue name
          - address
          - suggested_time (e.g., "Saturday, 19:30")
          - description
          - reasoning why this fits both.
        `;

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
                        reason: { type: Type.STRING }
                    }
                }
            }
        });
        
        const text = response.text;
        return text ? JSON.parse(text) : null;
    } catch (e) {
        console.error(e);
        return {
            name: "Highlands Coffee",
            address: "N/A",
            suggested_time: "09:00 AM",
            description: language === 'vi' ? "Địa điểm phổ biến." : "Popular spot.",
            reason: language === 'vi' ? "AI đang bận." : "AI is busy."
        };
    }
  },

  /**
   * "Who pays?" predictor based on fun analysis of profiles.
   */
  async predictWhoPays(user: UserProfile, candidate: MatchCandidate, language: 'vi' | 'en' = 'vi'): Promise<{ payer: string, reason: string }> {
      try {
        if (!apiKey) throw new Error("No Key");

        const prompt = `
            Analyze these two profiles playfully and decide who should pay for the first date.
            User A: ${user.name} - ${user.bio}
            User B: ${candidate.name} - ${candidate.bio}
            Output Language: ${language === 'vi' ? 'Vietnamese' : 'English'}.
            Return JSON.
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        payer: { type: Type.STRING, description: "Name of the person or 'Split'" },
                        reason: { type: Type.STRING }
                    }
                }
            }
        });

        const text = response.text;
        return text ? JSON.parse(text) : { payer: "Split", reason: "Fair play!" };
      } catch (e) {
          return { payer: "Rock Paper Scissors", reason: "AI connection failed." };
      }
  },

  /**
   * Finds a real meeting spot using Google Maps Grounding.
   */
  async findMeetingSpot(userLocation: string, matchLocation: string, language: 'vi' | 'en' = 'vi'): Promise<{ text: string, mapLink?: string, placeName?: string }> {
    try {
      if (!apiKey) return { text: language === 'vi' ? "Cần API Key." : "API Key needed.", mapLink: "" };

      // Using Google Maps Tool
      const prompt = `Find a highly rated, popular cafe or restaurant suitable for a first date that is geographically between ${userLocation} and ${matchLocation}. 
      Provide the name and a short reason in ${language === 'vi' ? 'Vietnamese' : 'English'}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleMaps: {} }],
        }
      });

      const candidate = response.candidates?.[0];
      let text = candidate?.content?.parts?.map(p => p.text).join('') || (language === 'vi' ? "Không tìm thấy." : "Not found.");
      
      let mapLink = "";
      let placeName = "";
      
      const chunks = candidate?.groundingMetadata?.groundingChunks || [];
      
      for (const chunk of chunks) {
          if (chunk.web?.uri && (chunk.web.uri.includes('google.com/maps') || chunk.web.uri.includes('maps.google'))) {
              mapLink = chunk.web.uri;
              placeName = chunk.web.title || "Location";
              break;
          }
      }

      if (!placeName && text.length > 0) {
         // Do NOT force a default name here. 
         // If no place is found, we should not attempt to render the map iframe with a bad query.
      }

      return { text, mapLink, placeName };

    } catch (e) {
      console.error("Maps Error:", e);
      return { text: language === 'vi' ? "Lỗi bản đồ." : "Map Error.", mapLink: "" };
    }
  }
};
