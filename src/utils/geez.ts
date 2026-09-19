/**
 * Converts a standard decimal integer to its Ge'ez numeral representation.
 * Ge'ez numerals: ፩=1, ፪=2, ፫=3, ፬=4, ፭=5, ፮=6, ፯=7, ፰=8, ፱=9, ፲=10, ፳=20, ፴=30, ፵=40, ፶=50, ፷=60, ፯=70, ፰=80, ፱=90, ፹=80, ፺=90, ፻=100
 */

const GEEZ_ONES = ['', '፩', '፪', '፫', '፬', '፭', '፮', '፯', '፰', '፱'];
const GEEZ_TENS = ['', '፲', '፳', '፴', '፵', '፶', '፷', '፯', '፹', '፺'];

export function toGeezNumber(num: number): string {
  if (num === 0) return '0';
  if (num < 0) return num.toString();
  if (num > 10000) return num.toString();

  let result = '';

  // Handle Hundreds / Thousands if needed
  if (num >= 100) {
    const hundredCount = Math.floor(num / 100);
    num %= 100;
    if (hundredCount > 1) {
      result += toGeezNumber(hundredCount);
    }
    result += '፻';
  }

  const tens = Math.floor(num / 10);
  const ones = num % 10;

  result += GEEZ_TENS[tens] || '';
  result += GEEZ_ONES[ones] || '';

  return result || '0';
}
