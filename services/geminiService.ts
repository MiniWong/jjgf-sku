import { GoogleGenAI, Type } from "@google/genai";
import { Category } from "../types";

export const generateSampleData = async (apiKey: string): Promise<Partial<Category>[]> => {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Generate a realistic set of product attribute data for a framed artwork SKU system primarily in Chinese for a Chinese market application.
    
    I need 5 specific categories populated matching these keys:
    1. frame (框条): Code (e.g., K1, K2) and Abbreviation (e.g., 黑框, 金框, 银拉丝). 4 items.
    2. size (尺寸): Code (e.g., 4060, 5070, 6080) and Abbreviation (e.g., 40x60, 50x70, 60x80). 4 items.
    3. color (颜色): Code (e.g., BK, GD, SV, WD) and Abbreviation (e.g., 黑, 金, 银, 木纹). 4 items.
    4. orientation (横竖): Code (e.g., H, S) and Abbreviation (e.g., 横, 竖). MUST include 'H' and 'S' exactly.
    5. image (画面): Code (e.g., s001, s002, h001, h002). 6 items. Mix codes starting with 's' and 'h' (case insensitive) to test filtering rules. No abbreviation needed for image (or keep it empty).

    Return strictly JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    key: { type: Type.STRING, enum: ['frame', 'size', 'color', 'orientation', 'image'] },
                    options: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                code: { type: Type.STRING },
                                abbr: { type: Type.STRING }
                            }
                        }
                    }
                }
            }
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
    return [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};