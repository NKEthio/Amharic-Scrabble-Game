import type { WordEntry, LevelConfig } from '../data/levels';
import { normalizeAmharic } from './amharic';

export interface GridValidationResult {
  hasConflict: boolean;
  conflicts: Array<{ row: number; col: number; char1: string; char2: string }>;
  gridMap: Record<string, { char: string; wordIds: string[] }>;
}

/**
 * Validates word placements on the grid.
 * Checks if intersecting letters between words match (accounting for homophones or exact characters).
 */
export function validateGridWords(words: WordEntry[]): GridValidationResult {
  const gridMap: Record<string, { char: string; wordIds: string[] }> = {};
  const conflicts: Array<{ row: number; col: number; char1: string; char2: string }> = [];

  for (const w of words) {
    if (!w.word) continue;
    const chars = Array.from(w.word);

    for (let i = 0; i < chars.length; i++) {
      const r = w.direction === 'across' ? w.startRow : w.startRow + i;
      const c = w.direction === 'across' ? w.startCol + i : w.startCol;
      const key = `${r}-${c}`;
      const currentChar = chars[i];

      if (gridMap[key]) {
        const existingChar = gridMap[key].char;
        if (normalizeAmharic(existingChar) !== normalizeAmharic(currentChar)) {
          conflicts.push({
            row: r,
            col: c,
            char1: existingChar,
            char2: currentChar
          });
        }
        gridMap[key].wordIds.push(w.id);
      } else {
        gridMap[key] = {
          char: currentChar,
          wordIds: [w.id]
        };
      }
    }
  }

  return {
    hasConflict: conflicts.length > 0,
    conflicts,
    gridMap
  };
}

/**
 * Auto-generates the tile rack from all required letters in the level words,
 * plus optional extra distractor tiles.
 */
export function generateRackTiles(words: WordEntry[], distractorTilesInput: string = ''): string[] {
  const wordChars: string[] = [];

  for (const w of words) {
    if (!w.word) continue;
    const chars = Array.from(w.word);
    for (const ch of chars) {
      if (ch.trim()) {
        wordChars.push(ch.trim());
      }
    }
  }

  const distractors = Array.from(distractorTilesInput)
    .map((c) => c.trim())
    .filter(Boolean);

  return [...wordChars, ...distractors];
}

/**
 * Formats a LevelConfig object into TypeScript code string for easy copy-pasting.
 */
export function formatLevelAsTypeScript(level: LevelConfig): string {
  const wordsFormatted = level.words.map((w) => {
    return `    {\n` +
      `      id: ${JSON.stringify(w.id)},\n` +
      `      word: ${JSON.stringify(w.word)},\n` +
      `      clue: ${JSON.stringify(w.clue)},\n` +
      `      direction: ${JSON.stringify(w.direction)},\n` +
      `      startRow: ${w.startRow},\n` +
      `      startCol: ${w.startCol}${w.category ? `,\n      category: ${JSON.stringify(w.category)}` : ''}\n` +
      `    }`;
  }).join(',\n');

  const rackTilesFormatted = JSON.stringify(level.rackTiles);

  return `{\n` +
    `  levelNumber: ${level.levelNumber},\n` +
    `  title: ${JSON.stringify(level.title)},\n` +
    `  gridSize: ${level.gridSize},\n` +
    `  targetScore: ${level.targetScore},\n` +
    `  words: [\n${wordsFormatted}\n  ],\n` +
    `  rackTiles: ${rackTilesFormatted}\n` +
    `}`;
}
