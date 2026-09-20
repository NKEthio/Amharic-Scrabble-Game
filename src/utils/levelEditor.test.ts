import { describe, it, expect } from 'vitest';
import { validateGridWords, generateRackTiles, formatLevelAsTypeScript } from './levelEditor';
import type { WordEntry, LevelConfig } from '../data/levels';

describe('levelEditor utility functions', () => {
  const sampleWords: WordEntry[] = [
    {
      id: '1-across',
      word: 'ሰው',
      clue: 'Human',
      direction: 'across',
      startRow: 1,
      startCol: 1
    },
    {
      id: '2-down',
      word: 'ሰላም',
      clue: 'Peace',
      direction: 'down',
      startRow: 1,
      startCol: 1
    }
  ];

  it('validates overlapping grid words correctly when characters match or homophones match', () => {
    const result = validateGridWords(sampleWords);
    expect(result.hasConflict).toBe(false);
    expect(result.conflicts).toHaveLength(0);
    expect(result.gridMap['1-1'].char).toBe('ሰ');
  });

  it('detects letter conflicts on intersecting grid cells', () => {
    const conflictingWords: WordEntry[] = [
      {
        id: '1-across',
        word: 'ሰው',
        clue: 'Human',
        direction: 'across',
        startRow: 1,
        startCol: 1
      },
      {
        id: '2-down',
        word: 'ላም',
        clue: 'Cow',
        direction: 'down',
        startRow: 1,
        startCol: 1
      }
    ];

    const result = validateGridWords(conflictingWords);
    expect(result.hasConflict).toBe(true);
    expect(result.conflicts).toHaveLength(1);
    expect(result.conflicts[0]).toEqual({
      row: 1,
      col: 1,
      char1: 'ሰ',
      char2: 'ላ'
    });
  });

  it('generates rack tiles automatically from words plus extra distractors', () => {
    const tiles = generateRackTiles(sampleWords, 'ሀለ');
    expect(tiles).toEqual(['ሰ', 'ው', 'ሰ', 'ላ', 'ም', 'ሀ', 'ለ']);
  });

  it('formats level configuration into clean TypeScript string', () => {
    const sampleLevel: LevelConfig = {
      levelNumber: 4,
      title: 'ደረጃ ፬ - ልዩ ደረጃ',
      gridSize: 7,
      targetScore: 50,
      words: sampleWords,
      rackTiles: ['ሰ', 'ው', 'ላ', 'ም']
    };

    const formatted = formatLevelAsTypeScript(sampleLevel);
    expect(formatted).toContain('levelNumber: 4');
    expect(formatted).toContain('title: "ደረጃ ፬ - ልዩ ደረጃ"');
    expect(formatted).toContain('word: "ሰላም"');
    expect(formatted).toContain('rackTiles: ["ሰ","ው","ላ","ም"]');
  });
});
