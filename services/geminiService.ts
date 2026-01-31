import { GoogleGenAI, Type } from "@google/genai";
import { Campaign, GeneratedPostData, SocialPlatform } from "../types";

// Helper to create client with latest key
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCampaignPosts = async (
  campaign: Campaign, 
  days: number, 
  startDate: string,
  platform: SocialPlatform
): Promise<GeneratedPostData[]> => {
  const ai = getAiClient();
  const model = "gemini-3-flash-preview";

  const platformGuidelines = {
    instagram: "Focus on visual storytelling, use 15-20 hashtags, casual and engaging tone.",
    linkedin: "Professional tone, focus on industry insights and leadership, use 3-5 hashtags.",
    twitter: "Short, punchy, under 280 characters if possible (thread style if longer), 2-3 hashtags.",
    facebook: "Community focused, conversational, moderate length."
  };

  const prompt = `
    You are an expert social media manager for a company with the following profile:
    - Company Name: ${campaign.companyName}
    - Niche: ${campaign.niche}
    - Services: ${campaign.services}
    - Target Audience: ${campaign.targetAudience}
    - Brand Voice: ${campaign.brandVoice}

    Please generate a social media content calendar for ${days} days starting from ${startDate} specifically for ${platform.toUpperCase()}.
    
    Platform Rules: ${platformGuidelines[platform]}

    For each day, provide:
    1. A creative caption formatted for ${platform}.
    2. Relevant hashtags.
    3. A detailed visual description (prompt) for generating an image or video. 
       ${campaign.logo ? "Note: The visual should seamlessly incorporate the brand's logo style." : ""}
    4. Suggest whether an 'image' or 'video' is best for this post.
    5. If the visual type is 'video', provide a short script (voiceover or action description).
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.STRING, description: "The date or day of the week" },
              caption: { type: Type.STRING, description: "Engaging social media caption" },
              hashtags: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "List of relevant hashtags"
              },
              visualDescription: { type: Type.STRING, description: "Prompt for visual generation" },
              visualType: { type: Type.STRING, enum: ['image', 'video'], description: "Recommended visual type" },
              videoScript: { type: Type.STRING, description: "Script for the video if visualType is video" }
            },
            required: ["day", "caption", "hashtags", "visualDescription", "visualType"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text) as GeneratedPostData[];
  } catch (error) {
    console.error("Error generating posts:", error);
    throw new Error("Failed to generate content. Please try again.");
  }
};

export const consultMarketingExpert = async (
  history: { role: 'user' | 'model', text: string }[],
  campaign: Campaign | null
): Promise<string> => {
  const ai = getAiClient();
  const model = "gemini-3-pro-preview";
  
  // Updated instruction to be concise and direct
  let systemInstruction = `
    You are a world-class Digital Marketing Consultant and Growth Hacker. 
    CRITICAL INSTRUCTION: Provide extremely concise, high-impact advice. 
    - Do NOT write blog posts or long introductions.
    - Get straight to the point immediately.
    - Use bullet points for lists.
    - Keep responses under 100 words unless explicitly asked for a detailed strategy.
    - Be professional, sharp, and direct.
  `;
  
  if (campaign) {
    systemInstruction += `
      Context for this session:
      - Company: ${campaign.companyName}
      - Niche: ${campaign.niche}
      - Target Audience: ${campaign.targetAudience}
      - Brand Voice: ${campaign.brandVoice}
    `;
  }

  const contents = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  try {
    const response = await ai.models.generateContent({
      model,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Error in consultation:", error);
    return "I apologize, but I'm having trouble connecting to the marketing database right now.";
  }
};

export const generateImage = async (prompt: string, referenceImage?: string): Promise<string> => {
  const ai = getAiClient();
  // Using gemini-2.5-flash-image for general image generation/editing
  const model = "gemini-2.5-flash-image";

  const parts: any[] = [{ text: prompt }];

  if (referenceImage) {
    // Strip prefix if present (data:image/png;base64,)
    const base64Data = referenceImage.split(',')[1] || referenceImage;
    const mimeType = referenceImage.split(';')[0].split(':')[1] || 'image/png';
    
    parts.push({
      inlineData: {
        mimeType: mimeType,
        data: base64Data
      }
    });
    // Add instruction to prioritize the logo/reference
    parts[0].text += " Incorporate the visual style and elements of the provided reference image/logo naturally into the composition.";
  }

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: parts
    }
  });

  // Extract base64 image from parts
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
};

export const editImage = async (imageBase64: string, prompt: string): Promise<string> => {
  const ai = getAiClient();
  const model = "gemini-2.5-flash-image";

  // Strip prefix if present for API call
  const base64Data = imageBase64.split(',')[1] || imageBase64;
  const mimeType = imageBase64.split(';')[0].split(':')[1] || 'image/png';

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType,
            data: base64Data
          }
        },
        { text: prompt }
      ]
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No edited image returned");
};