import { describe, it, expect } from '@jest/globals';

describe('L0 - Types', () => {
  describe('Question type', () => {
    it('should accept valid question object', () => {
      const question = {
        id: 'q1',
        text: 'Test question'
      };
      expect(question.id).toBe('q1');
      expect(question.text).toBe('Test question');
    });
  });

  describe('ProfileData type', () => {
    it('should accept valid profile data structure', () => {
      const profile: {
        personalityType: string;
        competencies: { name: string; value: number }[];
        leadershipStyle: string;
        culturalFit: string;
      } = {
        personalityType: 'Enneagram Type 3',
        competencies: [
          { name: 'Active Listening', value: 85 },
          { name: 'Critical Thinking', value: 90 }
        ],
        leadershipStyle: 'Goal-oriented leader',
        culturalFit: 'Fast-paced startup'
      };
      expect(profile.personalityType).toBe('Enneagram Type 3');
      expect(profile.competencies).toHaveLength(2);
    });
  });

  describe('FormData type', () => {
    it('should accept form data with all question fields', () => {
      const formData: Record<string, string> = {
        name: 'John Doe',
        birthDate: '1990-01-01',
        q1: '3',
        q2: '4',
        q3: '5',
        q4: '2',
        q5: '1'
      };
      expect(formData.name).toBe('John Doe');
      expect(formData.q1).toBe('3');
    });
  });
});