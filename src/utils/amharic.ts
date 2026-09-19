/**
 * Option A: Canonical Amharic Homophone Normalization Utility
 * Normalizes Amharic characters that represent the same phoneme (homophones).
 *
 * Group 1: ሀ, ሐ, ኀ (plus their orders) -> Normalized to ሀ series
 * Group 2: ሠ, ሰ (plus their orders) -> Normalized to ሰ series
 * Group 3: አ, ዐ (plus their orders) -> Normalized to አ series
 * Group 4: ጸ, ፀ (plus their orders) -> Normalized to ጸ series
 */

const HOMOPHONE_MAP: Record<string, string> = {
  // ሠ -> ሰ
  'ሠ': 'ሰ', 'ሡ': 'ሱ', 'ሢ': 'ሲ', 'ሣ': 'ሳ', 'ሤ': 'ሴ', 'ሥ': 'ስ', 'ሦ': 'ሶ',
  // ሐ / ኀ -> ሀ
  'ሐ': 'ሀ', 'ሑ': 'ሁ', 'ሒ': 'ሂ', 'ሓ': 'ሀ', 'ሔ': 'ሄ', 'ሕ': 'ህ', 'ሖ': 'ሆ',
  'ኀ': 'ሀ', 'ኁ': 'ሁ', 'ኂ': 'ሂ', 'ኃ': 'ሀ', 'ኄ': 'ሄ', 'ኅ': 'ህ', 'ኆ': 'ሆ',
  // ዐ -> አ
  'ዐ': 'አ', 'ዑ': 'ኡ', 'ዒ': 'ኢ', 'ዓ': 'ኣ', 'ዔ': 'ኤ', 'ዕ': 'እ', 'ዖ': 'ኦ',
  // ፀ -> ጸ
  'ፀ': 'ጸ', 'ፁ': 'ጹ', 'ፂ': 'ጺ', 'ፃ': 'ጻ', 'ፄ': 'ጼ', 'ፅ': 'ጽ', 'ፆ': 'ጾ'
};

/**
 * Normalizes a single character or full word.
 * Replaces homophones with their canonical counterpart.
 */
export function normalizeAmharic(text: string): string {
  if (!text) return '';
  return text
    .trim()
    .split('')
    .map((char) => HOMOPHONE_MAP[char] || char)
    .join('');
}

/**
 * Checks if two Amharic strings (words or tiles) are equivalent under homophone normalization.
 */
export function areAmharicEquivalent(str1: string, str2: string): boolean {
  return normalizeAmharic(str1) === normalizeAmharic(str2);
}

/**
 * Letter point values for Scrabble scoring based on character frequency in Amharic.
 */
export const AMHARIC_LETTER_POINTS: Record<string, number> = {
  'ሀ': 2, 'ሁ': 3, 'ሂ': 3, 'ሃ': 2, 'ሄ': 3, 'ህ': 1, 'ሆ': 3,
  'ለ': 1, 'ሉ': 2, 'ሊ': 2, 'ላ': 1, 'ሌ': 2, 'ል': 1, 'ሎ': 2,
  'መ': 1, 'ሙ': 2, 'ሚ': 2, 'ማ': 1, 'ሜ': 2, 'ም': 1, 'ሞ': 2,
  'ሠ': 3, 'ሡ': 4, 'ሢ': 4, 'ሣ': 3, 'ሤ': 4, 'ሥ': 3, 'ሦ': 4,
  'ረ': 1, 'ሩ': 2, 'ሪ': 2, 'ራ': 1, 'ሬ': 2, 'ር': 1, 'ሮ': 2,
  'ሰ': 1, 'ሱ': 2, 'ሲ': 2, 'ሳ': 1, 'ሴ': 2, 'ስ': 1, 'ሶ': 2,
  'ሸ': 2, 'ሹ': 3, 'ሺ': 3, 'ሻ': 2, 'ሼ': 3, 'ሽ': 2, 'ሾ': 3,
  'ቀ': 2, 'ቁ': 3, 'ቂ': 3, 'ቃ': 2, 'ቄ': 3, 'ቅ': 2, 'ቆ': 3,
  'በ': 1, 'ቡ': 2, 'ቢ': 2, 'ባ': 1, 'ቤ': 2, 'ብ': 1, 'ቦ': 2,
  'ተ': 1, 'ቱ': 2, 'ቲ': 2, 'ታ': 1, 'ቴ': 2, 'ት': 1, 'ቶ': 2,
  'ቸ': 3, 'ቹ': 4, 'ቺ': 4, 'ቻ': 3, 'ቼ': 4, 'ች': 3, 'ቾ': 4,
  'ነ': 1, 'ኑ': 2, 'ኒ': 2, 'ና': 1, 'ኔ': 2, 'ን': 1, 'ኖ': 2,
  'ኘ': 3, 'ኙ': 4, 'ኚ': 4, 'ኛ': 3, 'ኜ': 4, 'ኝ': 3, 'ኞ': 4,
  'አ': 1, 'ኡ': 2, 'ኢ': 2, 'ኣ': 1, 'ኤ': 2, 'እ': 1, 'ኦ': 2,
  'ከ': 2, 'ኩ': 3, 'ኪ': 3, 'ካ': 2, 'ኬ': 3, 'ክ': 2, 'ኮ': 3,
  'ወ': 2, 'ዉ': 3, 'ዊ': 3, 'ዋ': 2, 'ዌ': 3, 'ው': 2, 'ዎ': 3,
  'ዘ': 2, 'ዙ': 3, 'ዚ': 3, 'ዛ': 2, 'ዜ': 3, 'ዝ': 2, 'ዞ': 3,
  'የ': 1, 'ዩ': 2, 'ዪ': 2, 'ያ': 1, 'ዬ': 2, 'ይ': 1, 'ዮ': 2,
  'ደ': 1, 'ዱ': 2, 'ዲ': 2, 'ዳ': 1, 'ዴ': 2, 'ድ': 1, 'ዶ': 2,
  'ገ': 2, 'ጉ': 3, 'ጊ': 3, 'ጋ': 2, 'ጌ': 3, 'ግ': 2, 'ጎ': 3,
  'ጠ': 2, 'ጡ': 3, 'ጢ': 3, 'ጣ': 2, 'ጤ': 3, 'ጥ': 2, 'ጦ': 3,
  'ጨ': 3, 'ጩ': 4, 'ጪ': 4, 'ጫ': 3, 'ጬ': 4, 'ጭ': 3, 'ጮ': 4,
  'ጰ': 4, 'ጱ': 5, 'ጲ': 5, 'ጳ': 4, 'ጴ': 5, 'ጵ': 4, 'ጶ': 5,
  'ጸ': 3, 'ጹ': 4, 'ጺ': 4, 'ጻ': 3, 'ጼ': 4, 'ጽ': 3, 'ጾ': 4,
  'ፈ': 2, 'ፉ': 3, 'ፊ': 3, 'ፋ': 2, 'ፌ': 3, 'ፍ': 2, 'ፎ': 3,
  'ፐ': 4, 'ፑ': 5, 'ፒ': 5, 'ፓ': 4, 'ፔ': 5, 'ፕ': 4, 'ፖ': 5
};

export function getLetterPoints(char: string): number {
  return AMHARIC_LETTER_POINTS[char] || 1;
}
