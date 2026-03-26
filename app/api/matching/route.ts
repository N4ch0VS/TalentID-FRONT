import { GoogleGenAI, Type } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ 
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY 
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { datos_lider, datos_candidato } = body;

    if (!datos_lider || !datos_candidato) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const prompt = `
    Actúa como un experto en recursos humanos y dinámica de equipos.
    Analiza los siguientes perfiles para determinar su compatibilidad laboral.
    
    Datos del Líder: ${datos_lider}
    Datos del Candidato: ${datos_candidato}

    Genera un Informe de Compatibilidad estructurado con:
    1. porcentaje_match: Un valor de 0 a 100 indicando la compatibilidad general.
    2. puntos_fuertes: Una lista de 3 a 5 puntos fuertes de esta combinación de trabajo.
    3. zonas_conflicto: Una lista de 2 a 3 posibles zonas de fricción o conflicto probable.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            porcentaje_match: { type: Type.INTEGER },
            puntos_fuertes: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            zonas_conflicto: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["porcentaje_match", "puntos_fuertes", "zonas_conflicto"]
        }
      }
    });

    if (!response.text) {
      throw new Error("Respuesta vacía de Gemini");
    }

    const parsedResponse = JSON.parse(response.text);
    return NextResponse.json(parsedResponse);
    
  } catch (error: any) {
    console.error('Error en /api/matching:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}
