import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

// NOTE: In a real production app, you would proxy this through your own backend 
// to avoid exposing the key, or use a restricted key. 
// For this demo, we assume process.env.API_KEY is available.

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIRecommendation = async (
  userMood: string, 
  availableProducts: Product[]
): Promise<string> => {
  try {
    const menuString = availableProducts
      .map(p => `${p.name} (${p.category}): ${p.description}`)
      .join('\n');

    const prompt = `
      Actúa como un chef experto y divertido.
      El usuario dice: "${userMood}".
      
      Aquí está el menú disponible:
      ${menuString}
      
      Recomienda UN solo producto del menú que mejor se adapte al estado de ánimo del usuario.
      Explica brevemente por qué (máximo 2 frases).
      Formato de respuesta: "Te recomiendo [Nombre del Producto]. [Razón]."
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Lo siento, mi cerebro de chef está descansando. ¡Prueba la hamburguesa!";
  } catch (error) {
    console.error("AI Error:", error);
    return "No pude conectar con el chef virtual, pero todo nuestro menú es delicioso.";
  }
};