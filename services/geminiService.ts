import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCreativeBio = async (name: string, category: string, vibe: string): Promise<string> => {
  try {
    const prompt = `
      Write a short, engaging, and warm "About Me" bio for a creator named ${name} who creates content about "${category}".
      The vibe should be "${vibe}".
      The goal is to encourage visitors to "buy them a chai" (support them via small donations).
      Keep it under 300 characters. No hashtags.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "I create cool stuff. Support my work!";
  } catch (error) {
    console.error("Error generating bio:", error);
    return `Hi, I'm ${name}. I create ${category} content. If you love what I do, consider supporting me!`;
  }
};
