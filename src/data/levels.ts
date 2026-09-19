export interface WordEntry {
  id: string;
  word: string; // Target Amharic word
  normalizedWord?: string;
  clue: string; // Amharic definition / clue
  direction: 'across' | 'down';
  startRow: number;
  startCol: number;
  category?: string;
}

export interface LevelConfig {
  levelNumber: number;
  title: string;
  gridSize: number;
  targetScore: number;
  words: WordEntry[];
  rackTiles: string[];
}

export const LEVELS: LevelConfig[] = [
  {
    levelNumber: 1,
    title: "ደረጃ ፩ - መሠረታዊ (Beginner 7x7)",
    gridSize: 7,
    targetScore: 40,
    words: [
      {
        id: "1-across",
        word: "ሰው",
        clue: "የሰው ልጅ፣ ፍጡር (Human being)",
        direction: "across",
        startRow: 1,
        startCol: 1,
        category: "ማህበራዊ"
      },
      {
        id: "2-down",
        word: "ሰላም",
        clue: "እርቅ፣ ሰላምና ጤና (Peace & harmony)",
        direction: "down",
        startRow: 1,
        startCol: 1,
        category: "ባህል"
      },
      {
        id: "3-across",
        word: "ላም",
        clue: "ወተት የምትሰጥ እንስሳ (Cow)",
        direction: "across",
        startRow: 2,
        startCol: 1,
        category: "እንስሳት"
      },
      {
        id: "4-across",
        word: "ምግብ",
        clue: "የሚበላ ነገር (Food)",
        direction: "across",
        startRow: 3,
        startCol: 1,
        category: "ምግብ"
      },
      {
        id: "5-down",
        word: "ብርሃን",
        clue: "መብራት፣ ፀሐይ የሚሰጠው ጭላንጭል (Light)",
        direction: "down",
        startRow: 3,
        startCol: 3,
        category: "ተፈጥሮ"
      }
    ],
    rackTiles: ["ሰ", "ው", "ላ", "ም", "ም", "ግ", "ብ", "ር", "ሃ", "ን", "ሀ", "ለ", "አ", "በ"]
  },
  {
    levelNumber: 2,
    title: "ደረጃ ፪ - መካከለኛ (Intermediate 7x7)",
    gridSize: 7,
    targetScore: 65,
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
        word: "ትምህርት",
        clue: "ዕውቀት የሚገኝበት መስክ (Education)",
        direction: "down",
        startRow: 2,
        startCol: 1,
        category: "ትምህርት"
      },
      {
        id: "3-across",
        word: "ትግል",
        clue: "ለዓላማ የሚደረግ ጥረት (Struggle)",
        direction: "across",
        startRow: 6,
        startCol: 1,
        category: "ተግባር"
      },
      {
        id: "4-down",
        word: "ያለፈ",
        clue: "ያለፈ ጊዜ ወይም ታሪክ (Past)",
        direction: "down",
        startRow: 2,
        startCol: 4,
        category: "ጊዜ"
      },
      {
        id: "5-across",
        word: "ፈጣን",
        clue: "ችኩል፣ ፈጣን እንቅስቃሴ (Fast/Quick)",
        direction: "across",
        startRow: 4,
        startCol: 4,
        category: "ባህሪ"
      },
      {
        id: "6-across",
        word: "ህዝብ",
        clue: "የሀገር ነዋሪዎችና ማህበረሰብ (People/Public)",
        direction: "across",
        startRow: 4,
        startCol: 1,
        category: "ማህበራዊ"
      },
      {
        id: "7-down",
        word: "ብል",
        clue: "ብልህ ወይም ብልሃተኛ (Clever/Artful)",
        direction: "down",
        startRow: 4,
        startCol: 3,
        category: "ባህሪ"
      }
    ],
    rackTiles: ["ኢ", "ት", "ዮ", "ጵ", "ያ", "ም", "ህ", "ር", "ት", "ግ", "ል", "ለ", "ፈ", "ጣ", "ን", "ህ", "ዝ", "ብ", "ል", "ሀ", "ወ", "በ", "ሰ"]
  },
  {
    levelNumber: 3,
    title: "ደረጃ ፫ - ከፍተኛ (Advanced 8x8)",
    gridSize: 8,
    targetScore: 95,
    words: [
      {
        id: "1-across",
        word: "መፅሐፍ",
        clue: "ዕውቀት የሚገኝበት ጽሑፍ (Book)",
        direction: "across",
        startRow: 1,
        startCol: 1,
        category: "ትምህርት"
      },
      {
        id: "2-down",
        word: "መሪ",
        clue: "አመራር የሚሰጥ ሰው (Leader)",
        direction: "down",
        startRow: 1,
        startCol: 1,
        category: "ማህበራዊ"
      },
      {
        id: "3-across",
        word: "ታሪክ",
        clue: "ያለፈ ሁኔታና ሁነቶች መዝገብ (History)",
        direction: "across",
        startRow: 2,
        startCol: 0,
        category: "ትምህርት"
      },
      {
        id: "4-down",
        word: "ክብር",
        clue: "ማዕረግና ታላቅነት (Honor/Respect)",
        direction: "down",
        startRow: 2,
        startCol: 2,
        category: "ባህል"
      },
      {
        id: "5-across",
        word: "ብርሃን",
        clue: "መብራትና ፀሐይ የሚሰጡት ጭላንጭል (Light)",
        direction: "across",
        startRow: 3,
        startCol: 2,
        category: "ተፈጥሮ"
      },
      {
        id: "6-down",
        word: "ንብ",
        clue: "ማር የምትሰራ ትንሽ እንስሳ (Bee)",
        direction: "down",
        startRow: 3,
        startCol: 5,
        category: "ተፈጥሮ"
      },
      {
        id: "7-across",
        word: "ሀብት",
        clue: "ጥሪት፣ ንብረትና ብልጽግና (Wealth/Resource)",
        direction: "across",
        startRow: 4,
        startCol: 4,
        category: "ልማት"
      },
      {
        id: "8-down",
        word: "ትግል",
        clue: "ለዓላማ የሚደረግ ጥረት (Struggle)",
        direction: "down",
        startRow: 4,
        startCol: 6,
        category: "ተግባር"
      },
      {
        id: "9-across",
        word: "ልብ",
        clue: "የስሜትና የደም ዝውውር አካል (Heart/Mind)",
        direction: "across",
        startRow: 6,
        startCol: 6,
        category: "አካል"
      },
      {
        id: "10-across",
        word: "እድገት",
        clue: "ወደፊት የሚደረግ ብልጽግና (Progress/Growth)",
        direction: "across",
        startRow: 5,
        startCol: 1,
        category: "ልማት"
      }
    ],
    rackTiles: ["መ", "ፅ", "ሐ", "ፍ", "ታ", "ሪ", "ክ", "ብ", "ር", "ሃ", "ን", "ር", "ሀ", "ብ", "ት", "እ", "ድ", "ገ", "ት", "ግ", "ል", "ብ", "ወ", "በ", "ሰ", "አ", "ል"]
  }
];
