import { describe, it, expect } from 'vitest';
import { toGeezNumber } from './geez';
import { normalizeAmharic, areAmharicEquivalent } from './amharic';

describe("Ge'ez Numeral Utility", () => {
  it('converts single digits correctly', () => {
    expect(toGeezNumber(1)).toBe('፩');
    expect(toGeezNumber(5)).toBe('፭');
    expect(toGeezNumber(9)).toBe('፱');
  });

  it('converts tens and numbers up to 100', () => {
    expect(toGeezNumber(10)).toBe('፲');
    expect(toGeezNumber(12)).toBe('፲፪');
    expect(toGeezNumber(25)).toBe('፳፭');
    expect(toGeezNumber(99)).toBe('፺፱');
    expect(toGeezNumber(100)).toBe('፻');
  });
});

describe('Amharic Homophone Normalization', () => {
  it('normalizes ሠ to ሰ', () => {
    expect(normalizeAmharic('ሠላም')).toBe('ሰላም');
    expect(areAmharicEquivalent('ሠላም', 'ሰላም')).toBe(true);
  });

  it('normalizes ሐ and ኀ to ሀ', () => {
    expect(normalizeAmharic('ሐበሻ')).toBe('ሀበሻ');
    expect(normalizeAmharic('ኀይል')).toBe('ሀይል');
    expect(areAmharicEquivalent('ሐበሻ', 'ሀበሻ')).toBe(true);
  });

  it('normalizes ዐ to አ', () => {
    expect(normalizeAmharic('ዓለም')).toBe('ኣለም'); // Note: ዓ -> ኣ based on map
  });

  it('normalizes ፀ to ጸ', () => {
    expect(normalizeAmharic('ፀሐይ')).toBe('ጸሀይ');
    expect(areAmharicEquivalent('ፀሐይ', 'ጸሀይ')).toBe(true);
  });
});
