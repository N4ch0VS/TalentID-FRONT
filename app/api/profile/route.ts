import { GoogleGenAI, Type } from '@google/genai';
import { NextResponse } from 'next/server';

// Initialize the Gemini client
const ai = new GoogleGenAI({ 
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY 
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, birthDate, enneagramAnswers, language = 'en' } = body;

    if (!name || !birthDate || !enneagramAnswers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const prompt = `
    Act as an expert psychologist in talent assessment.
    Analyze the following candidate to generate a psychometric Talent Profile.
    
    Name: ${name}
    Date of Birth: ${birthDate}
    Questionnaire Answers (20-question Enneagram Test, scale 1-5): 
    ${enneagramAnswers}

    Generate a structured profile with:
    1. personalityType: The main personality type (e.g., Enneagram Type 3) and its probable wing if deducible.
    2. competencies: Exactly 5 key competencies with a value from 0 to 100. IMPORTANT: Use standard competency names inspired by the awesome-skills.com taxonomy (e.g., "Active Listening", "Critical Thinking", "Adaptability", "Complex Problem Solving").
    3. leadershipStyle: A brief description of their leadership style.
    4. culturalFit: What kind of culture or leader makes the best match with this profile.

    IMPORTANT: The response MUST be written in ${language === 'es' ? 'Spanish' : 'English'}.
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
            personalityType: { type: Type.STRING },
            competencies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  value: { type: Type.INTEGER }
                },
                required: ["name", "value"]
              }
            },
            leadershipStyle: { type: Type.STRING },
            culturalFit: { type: Type.STRING }
          },
          required: ["personalityType", "competencies", "leadershipStyle", "culturalFit"]
        }
      }
    });

    if (!response.text) {
      throw new Error("Empty response from Gemini");
    }

    const parsedResponse = JSON.parse(response.text);
    return NextResponse.json(parsedResponse);
    
  } catch (error: any) {
    console.error('Error in /api/profile:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
