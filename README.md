# 🇪🇹 Amharic Scrabble Game (የአማርኛ ስክራብል)

An Ethiopian Cultural Scrabble & Word-Building game created with React, TypeScript, Vite, and Tailwind CSS.

---

## 🌟 Key Features

1. **Amharic Homophone Normalization (Option A)**:
   - Amharic letters sharing the same phoneme (e.g. `ሰ` vs `ሠ`, `ሀ` vs `ሐ` vs `ኀ`, `አ` vs `ዐ`, `ጸ` vs `ፀ`) are automatically treated as equivalent. Placing `ሰላም` for the target word `ሠላም` awards full points and completes the word.
2. **Ge'ez Numerals (የግዕዝ ቁጥሮች)**:
   - Scores, level numbers, tile point values, and clue badge indices are displayed using authentic Ge'ez numerals (`፩`, `፪`, `፫`, `፬`, `፭`, `፲`...).
3. **Progressive Grid Levels**:
   - Level 1: 5x5 Grid (Beginner)
   - Level 2: 7x7 Grid (Intermediate)
   - Level 3: 9x9 Grid (Advanced)
4. **Interactive Clues & Token Reveal**:
   - Each word has an Amharic definition and orientation (Across/Down).
   - Players can spend 5 tokens to reveal target words if stuck.
5. **Ethiopian Visual Aesthetics**:
   - Features traditional Tibeb geometric patterns, wood tile textures, and green-yellow-red accent gradients.

---

## 🛠️ Developer Guide: Adding Custom Words & Levels

Developers can easily customize levels or add new words by editing `src/data/levels.ts`.

### Word Entry Structure (`WordEntry`)

```typescript
export interface WordEntry {
  id: string;             // Unique identifier (e.g. "1-across")
  word: string;           // Target Amharic word (e.g. "ሰላም")
  clue: string;           // Amharic definition / clue
  direction: 'across' | 'down';
  startRow: number;       // Grid row index (0-based)
  startCol: number;       // Grid column index (0-based)
  category?: string;      // Category label (e.g. "ባህል", "ምግብ")
}
```

### Adding a New Level Configuration (`LevelConfig`)

```typescript
{
  levelNumber: 4,
  title: "ደረጃ ፬ - ልዩ ደረጃ",
  gridSize: 9,
  targetScore: 100,
  words: [
    {
      id: "4-across",
      word: "ፍቅር",
      clue: "የልብ ወዳጅነትና አክብሮት (Love & affection)",
      direction: "across",
      startRow: 3,
      startCol: 2,
      category: "ስሜት"
    }
  ],
  rackTiles: ["ፍ", "ቅ", "ር", "ሰ", "ላ", "ም"]
}
```

---

## 🔮 Planned / Future Enhancements

- **Local Storage Persistence**: Saving high scores and unlocked level progress across browser sessions.
- **Game Sound Effects**: Traditional Krar / Ethiopian instrumental sound clips when placing tiles and completing levels.
- **Interactive Ge'ez Number Guide**: A hover popover to help players learn Ge'ez numerals while playing.
- **Multiplayer Pass-and-Play**: 2-player mode on a single device.

---

## 🚀 Development Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run unit tests
npm run test

# Build for production
npm run build
```
