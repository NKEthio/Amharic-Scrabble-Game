export interface WordEntry {
  id: string;
  word: string; // Target Amharic word (e.g. "ሰላም")
  normalizedWord?: string; // Optional pre-calculated canonical form
  clue: string; // Amharic definition / clue
  direction: 'across' | 'down';
  startRow: number;
  startCol: number;
  category?: string;
}

export interface LevelConfig {
  levelNumber: number;
  title: string;
  gridSize: number; // e.g., 5 for 5x5, 7 for 7x7, 9 for 9x9
  targetScore: number;
  words: WordEntry[];
  rackTiles: string[]; // Extra tiles for player's rack
}

export const LEVELS: LevelConfig[] = [
  {
    levelNumber: 1,
    title: "ደረጃ ፩ - መሠረታዊ (Beginner 5x5)",
    gridSize: 5,
    targetScore: 20,
    words: [
      {
        id: "1-across",
        word: "ሰላም",
        clue: "እርቅ፣ ሰላምና ጤና (Peace & harmony)",
        direction: "across",
        startRow: 1,
        startCol: 1,
        category: "ባህል"
      },
      {
        id: "2-down",
        word: "ሰው",
        clue: "የሰው ልጅ፣ ፍጡር (Human being)",
        direction: "down",
        startRow: 1,
        startCol: 1,
        category: "ማህበራዊ"
      },
      {
        id: "3-across",
        word: "ወተት",
        clue: "ከላም የሚገኝ ነጭ መጠጥ (Milk)",
        direction: "across",
        startRow: 3,
        startCol: 1,
        category: "ምግብ"
      }
    ],
    rackTiles: ["ሰ", "ላ", "ም", "ወ", "ተ", "ት", "ሠ", "ው", "ሀ", "ለ"]
  },
  {
    levelNumber: 2,
    title: "ደረጃ ፪ - መካከለኛ (Intermediate 7x7)",
    gridSize: 7,
    targetScore: 40,
    words: [
      {
        id: "1-across",
        word: "ኢትዮጵያ",
        clue: "የፍቅርና የጀግኖች ሀገር (Ethiopia)",
        direction: "across",
        startRow: 2,
        startCol: 0,
        category: "ሀገር"
      },
      {
        id: "2-down",
        word: "ታሪክ",
        clue: "ያለፈ ሁኔታና ሁነቶች መዝገብ (History)",
        direction: "down",
        startRow: 0,
        startCol: 3,
        category: "ትምህርት"
      },
      {
        id: "3-across",
        word: "ቡና",
        clue: "የኢትዮጵያ ባህላዊ መጠጥና ሀብት (Coffee)",
        direction: "across",
        startRow: 4,
        startCol: 2,
        category: "ባህል"
      }
    ],
    rackTiles: ["ኢ", "ት", "ዮ", "ጵ", "ያ", "ታ", "ሪ", "ክ", "ቡ", "ና", "ሰ", "ም", "ወ", "ሀ"]
  },
  {
    levelNumber: 3,
    title: "ደረጃ ፫ - ከፍተኛ (Advanced 9x9)",
    gridSize: 9,
    targetScore: 70,
    words: [
      {
        id: "1-across",
        word: "መፅሐፍ",
        clue: "ዕውቀት የሚገኝበት ጽሑፍ (Book)",
        direction: "across",
        startRow: 2,
        startCol: 1,
        category: "ትምህርት"
      },
      {
        id: "2-down",
        word: "ባህል",
        clue: "የሕዝብ ወግና ልማድ (Culture)",
        direction: "down",
        startRow: 1,
        startCol: 3,
        category: "ባህል"
      },
      {
        id: "3-across",
        word: "ህብረት",
        clue: "አንድነትና ስምምነት (Unity & Solidarity)",
        direction: "across",
        startRow: 5,
        startCol: 2,
        category: "ማህበራዊ"
      }
    ],
    rackTiles: ["መ", "ጽ", "ሐ", "ፍ", "ባ", "ህ", "ል", "ህ", "ብ", "ረ", "ት", "ሠ", "ሰ", "አ", "ዐ"]
  }
];
