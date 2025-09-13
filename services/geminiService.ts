
import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const imagePart = (base64Data: string) => ({
  inlineData: {
    mimeType: 'image/png',
    data: base64Data,
  },
});

export const extractTextFromImage = async (base64Data: string): Promise<string> => {
  const textPart = {
    text: "Extrahiere den gesamten Text aus diesem Bild. Gib nur den extrahierten Text ohne zusätzliche Erklärungen oder Formatierungen zurück.",
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart(base64Data), textPart] },
  });

  return response.text;
};

export const generatePromptFromImage = async (base64Data: string): Promise<string> => {
  const textPart = {
    text: `Analysiere dieses Bild und erstelle einen detaillierten, professionellen Bilderprompt im JSON-Format. 
    Der Prompt sollte Schlüsselelemente wie Subjekt, Szenerie, Stil, Komposition, Beleuchtung und Farben beschreiben. 
    Gib nur das JSON-Objekt zurück.`,
  };

  const promptSchema = {
    type: Type.OBJECT,
    properties: {
      subject: { type: Type.STRING, description: 'Hauptmotiv des Bildes in wenigen Worten.' },
      setting: { type: Type.STRING, description: 'Die Umgebung, der Hintergrund oder die Szenerie.' },
      style: { type: Type.STRING, description: 'Der künstlerische Stil (z.B. fotorealistisch, Anime, Aquarell, digital art).' },
      composition: { type: Type.STRING, description: 'Der Bildaufbau und die Kameraeinstellungen (z.B. Nahaufnahme, Weitwinkel, Vogelperspektive).' },
      lighting: { type: Type.STRING, description: 'Die Lichtverhältnisse und die erzeugte Stimmung (z.B. golden hour, dramatic lighting, studio light).' },
      colors: { type: Type.STRING, description: 'Die dominante Farbpalette oder Farbstimmung (z.B. leuchtende Farben, monochromatisch, Pastelltöne).' },
      details: { type: Type.STRING, description: 'Zusätzliche wichtige Details oder Elemente im Bild.' }
    },
    required: ["subject", "setting", "style", "composition", "lighting", "colors", "details"]
  };
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart(base64Data), textPart] },
    config: {
      responseMimeType: 'application/json',
      responseSchema: promptSchema
    }
  });

  const jsonString = response.text;
  try {
    const parsedJson = JSON.parse(jsonString);
    return JSON.stringify(parsedJson, null, 2);
  } catch (error) {
    console.error("Failed to parse JSON, returning raw text:", error);
    return jsonString;
  }
};
