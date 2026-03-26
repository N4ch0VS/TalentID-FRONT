import { GoogleGenAI, Type } from '@google/genai';
import { NextResponse } from 'next/server';

// Initialize the Gemini client
const ai = new GoogleGenAI({ 
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY 
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre, fecha_nacimiento, respuestas_eneagrama } = body;

    if (!nombre || !fecha_nacimiento || !respuestas_eneagrama) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const prompt = `
    Actúa como un psicólogo experto en evaluación de talento.
    Analiza al siguiente candidato para generar un Perfil de Talento psicométrico.
    
    Nombre: ${nombre}
    Fecha de nacimiento: ${fecha_nacimiento}
    Respuestas del cuestionario (Test Eneagrama de 20 preguntas, escala 1-5): 
    ${respuestas_eneagrama}

    Genera un perfil estructurado con:
    1. tipo_personalidad: El tipo de personalidad principal (ej. Eneatipo 3) y su ala probable si es posible deducirla.
    2. competencias: Exactamente 5 competencias clave con un valor de 0 a 100.
    3. estilo_liderazgo: Breve descripción de su estilo de liderazgo.
    4. compatibilidad: Qué tipo de cultura o líder hace mejor match con este perfil.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tipo_personalidad: { type: Type.STRING },
            competencias: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nombre: { type: Type.STRING },
                  valor: { type: Type.INTEGER }
                },
                required: ["nombre", "valor"]
              }
            },
            estilo_liderazgo: { type: Type.STRING },
            compatibilidad: { type: Type.STRING }
          },
          required: ["tipo_personalidad", "competencias", "estilo_liderazgo", "compatibilidad"]
        }
      }
    });

    if (!response.text) {
      throw new Error("Respuesta vacía de Gemini");
    }

    const parsedResponse = JSON.parse(response.text);
    return NextResponse.json(parsedResponse);
    
  } catch (error: any) {
    console.error('Error en /api/perfil:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}
