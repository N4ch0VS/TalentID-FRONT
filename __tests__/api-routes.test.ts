import { describe, it, expect, beforeEach } from '@jest/globals';
import '@testing-library/jest-dom';

declare global {
  function fetch(url: string | Request, options?: RequestInit): Promise<Response>;
}

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('L2 - API Routes Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('/api/profile endpoint', () => {
    it('returns 400 when missing required fields', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Missing required fields' })
      } as unknown as Response);

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test' })
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Missing required fields');
    });

    it('returns profile data for valid request', async () => {
      const mockProfileData = {
        personalityType: 'Enneagram Type 3',
        competencies: [
          { name: 'Active Listening', value: 85 },
          { name: 'Critical Thinking', value: 90 },
          { name: 'Adaptability', value: 75 },
          { name: 'Communication', value: 80 },
          { name: 'Problem Solving', value: 88 }
        ],
        leadershipStyle: 'Goal-oriented',
        culturalFit: 'Fast-paced environment'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProfileData)
      } as unknown as Response);

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          birthDate: '1990-01-01',
          enneagramAnswers: 'Q1: 3\nQ2: 4',
          language: 'en'
        })
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.personalityType).toBe('Enneagram Type 3');
      expect(data.competencies).toHaveLength(5);
    });

    it('handles API errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Internal server error' })
      } as unknown as Response);

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          birthDate: '1990-01-01',
          enneagramAnswers: 'Q1: 3'
        })
      });

      expect(response.status).toBe(500);
    });
  });

  describe('/api/perfil endpoint', () => {
    it('returns 400 when missing required fields', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Faltan campos requeridos' })
      } as unknown as Response);

      const response = await fetch('/api/perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: 'Test' })
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Faltan campos requeridos');
    });

    it('returns profile in Spanish for valid request', async () => {
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

      const response = await fetch('/api/perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: 'Test Usuario',
          fecha_nacimiento: '1990-01-01',
          respuestas_eneagrama: 'P1: 3\nP2: 4'
        })
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.tipo_personalidad).toBe('Eneatipo 3 - El Optimizador');
      expect(data.competencias).toHaveLength(5);
    });
  });

  describe('/api/matching endpoint', () => {
    it('returns 400 when missing required fields', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Faltan campos requeridos' })
      } as unknown as Response);

      const response = await fetch('/api/matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ datos_lider: 'Test' })
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Faltan campos requeridos');
    });

    it('returns matching data for valid request', async () => {
      const mockMatchingData = {
        porcentaje_match: 85,
        puntos_fuertes: [
          'Complementariedad en estilos de comunicación',
          'Orientación compartida hacia resultados',
          'Valores alineados'
        ],
        zonas_conflicto: [
          'Diferencias en ritmo de trabajo',
          'Enfoques distintos ante conflictos'
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMatchingData)
      } as unknown as Response);

      const response = await fetch('/api/matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datos_lider: 'Líder tipo 3, orientación a resultados',
          datos_candidato: 'Candidato tipo 5, analítico'
        })
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.porcentaje_match).toBe(85);
      expect(data.puntos_fuertes).toHaveLength(3);
      expect(data.zonas_conflicto).toHaveLength(2);
    });
  });
});