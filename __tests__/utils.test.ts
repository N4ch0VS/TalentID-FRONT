import { describe, it, expect } from '@jest/globals';
import { cn } from '@/lib/utils';

describe('L0 - Utils', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      const result = cn('foo', 'bar');
      expect(result).toBe('foo bar');
    });

    it('handles conditional classes', () => {
      const isActive = true;
      const result = cn('base', isActive && 'active');
      expect(result).toContain('base');
      expect(result).toContain('active');
    });

    it('handles falsy values', () => {
      const result = cn('foo', false && 'bar', null, undefined, '');
      expect(result).toBe('foo');
    });
  });
});