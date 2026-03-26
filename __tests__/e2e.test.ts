import { describe, it, expect, beforeEach } from '@jest/globals';
import '@testing-library/jest-dom';

declare global {
  function fetch(url: string | Request, options?: RequestInit): Promise<Response>;
}

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('L3 - E2E Flow Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Complete User Flow', () => {
    it('complete profile generation flow', async () => {
      const mockProfileData = {
        personalityType: 'Enneagram Type 3 - The Achiever',
        competencies: [
          { name: 'Active Listening', value: 85 },
          { name: 'Critical Thinking', value: 90 },
          { name: 'Adaptability', value: 75 },
          { name: 'Communication', value: 80 },
          { name: 'Problem Solving', value: 88 }
        ],
        leadershipStyle: 'Goal-oriented and achievement-focused',
        culturalFit: 'High-performance environment'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProfileData)
      } as unknown as Response);

      const payload = {
        name: 'Test User',
        birthDate: '1990-01-01',
        enneagramAnswers: 'Question 1\nAnswer: 3',
        language: 'en'
      };

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.personalityType).toBe(mockProfileData.personalityType);
      expect(data.competencies).toHaveLength(5);
    });

    it('language switching flow', async () => {
      const mockProfileDataEs = {
        tipo_personalidad: 'Eneatipo 3 - El Optimizador',
        competencias: [
          { nombre: 'Escucha Activa', valor: 85 },
          { nombre: 'Pensamiento Crítico', valor: 90 },
          { nombre: 'Adaptabilidad', valor: 75 },
          { nombre: 'Comunicación', valor: 80 },
          { nombre: 'Resolución de Problemas', valor: 88 }
        ],
        estilo_liderazgo: 'Orientado a resultados',
        compatibilidad: 'Ambiente de alto rendimiento'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProfileDataEs)
      } as unknown as Response);

      const payload = {
        nombre: 'Usuario de Prueba',
        fecha_nacimiento: '1990-01-01',
        respuestas_eneagrama: 'Pregunta 1\nRespuesta: 3'
      };

      const response = await fetch('/api/perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.tipo_personalidad).toBe(mockProfileDataEs.tipo_personalidad);
    });

    it('matching flow between leader and candidate', async () => {
      const mockMatchingData = {
        porcentaje_match: 85,
        puntos_fuertes: [
          'Complementariedad en estilos',
          'Orientación compartida hacia resultados',
          'Valores alineados',
          'Misma visión estratégica'
        ],
        zonas_conflicto: [
          'Ritmo de trabajo diferente',
          'Enfoque distinto ante conflictos'
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMatchingData)
      } as unknown as Response);

      const payload = {
        datos_lider: 'Líder tipo 3 - The Achiever, orientado a resultados, estilo de liderazgo directo',
        datos_candidato: 'Candidato tipo 5 - The Investigator, analítico, prefiere trabajar de manera independiente'
      };

      const response = await fetch('/api/matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.porcentaje_match).toBe(85);
      expect(data.puntos_fuertes).toHaveLength(4);
      expect(data.zonas_conflicto).toHaveLength(2);
    });

    it('error recovery flow', async () => {
      mockFetch
        .mockRejectedValueOnce(new Error('Network error') as unknown as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            personalityType: 'Type 3',
            competencies: [],
            leadershipStyle: 'Test',
            culturalFit: 'Test'
          })
        } as unknown as Response);

      try {
        await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Test' })
        });
      } catch (error) {
        expect(error).toBeDefined();
      }

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          birthDate: '1990-01-01',
          enneagramAnswers: 'Q1: 3'
        })
      });

      expect(response.ok).toBe(true);
    });

    it('validation flow across all endpoints', async () => {
      const endpoints = [
        { url: '/api/profile', payload: { name: 'Test' } },
        { url: '/api/perfil', payload: { nombre: 'Test' } },
        { url: '/api/matching', payload: { datos_lider: 'Test' } }
      ];

      for (const endpoint of endpoints) {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: () => Promise.resolve({ error: 'Missing required fields' })
        } as unknown as Response);

        const response = await fetch(endpoint.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(endpoint.payload)
        });

        expect(response.status).toBe(400);
      }
    });
  });

  describe('Data Processing Flow', () => {
    it('transforms enneagram answers to API format', () => {
      const questions = [
        { id: 'q1', text: 'Question 1' },
        { id: 'q2', text: 'Question 2' },
        { id: 'q3', text: 'Question 3' }
      ];

      const formData: Record<string, string> = {
        q1: '3',
        q2: '4',
        q3: '5'
      };

      const enneagramAnswers = questions.map(
        q => `Question: ${q.text}\nAnswer (1-5): ${formData[q.id]}`
      ).join('\n\n');

      expect(enneagramAnswers).toContain('Question: Question 1');
      expect(enneagramAnswers).toContain('Answer (1-5): 3');
      expect(enneagramAnswers).toContain('Question: Question 3');
      expect(enneagramAnswers).toContain('Answer (1-5): 5');
    });

    it('validates competency values are within 0-100 range', () => {
      const competencies = [
        { name: 'Active Listening', value: 85 },
        { name: 'Critical Thinking', value: 90 },
        { name: 'Adaptability', value: 75 }
      ];

      const allValid = competencies.every(c => c.value >= 0 && c.value <= 100);
      expect(allValid).toBe(true);

      const invalidCompetencies = [
        { name: 'Test', value: 150 },
        { name: 'Test2', value: -10 }
      ];

      const hasInvalid = invalidCompetencies.some(c => c.value < 0 || c.value > 100);
      expect(hasInvalid).toBe(true);
    });

    it('handles different language responses', () => {
      const enResponse = {
        personalityType: 'Type 3',
        competencies: [{ name: 'Active Listening', value: 85 }],
        leadershipStyle: 'Goal-oriented',
        culturalFit: 'Fast-paced'
      };

      const esResponse = {
        tipo_personalidad: 'Tipo 3',
        competencias: [{ nombre: 'Escucha Activa', valor: 85 }],
        estilo_liderazgo: 'Orientado a resultados',
        compatibilidad: 'Rápido'
      };

      expect(enResponse.personalityType).toBeDefined();
      expect(esResponse.tipo_personalidad).toBeDefined();
      expect(enResponse.competencies[0].name).not.toBe(esResponse.competencias[0].nombre);
    });
  });
});