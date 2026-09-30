const HELVETICA_BOLD_WIDTHS: Record<string, number> = {
  ' ': 278,
  A: 722,
  B: 722,
  C: 722,
  D: 722,
  E: 667,
  F: 611,
  G: 778,
  H: 722,
  I: 278,
  J: 556,
  K: 722,
  L: 611,
  M: 833,
  N: 722,
  O: 778,
  P: 667,
  Q: 778,
  R: 722,
  S: 667,
  T: 611,
  U: 722,
  V: 667,
  W: 944,
  X: 667,
  Y: 667,
  Z: 611,
  a: 556,
  b: 611,
  c: 556,
  d: 611,
  e: 556,
  f: 333,
  g: 611,
  h: 611,
  i: 278,
  j: 278,
  k: 556,
  l: 278,
  m: 889,
  n: 611,
  o: 611,
  p: 611,
  q: 611,
  r: 389,
  s: 556,
  t: 333,
  u: 611,
  v: 556,
  w: 778,
  x: 556,
  y: 556,
  z: 500,
  '0': 556,
  '1': 556,
  '2': 556,
  '3': 556,
  '4': 556,
  '5': 556,
  '6': 556,
  '7': 556,
  '8': 556,
  '9': 556,
  '-': 333,
  '.': 278,
  ',': 278,
  "'": 238,
};

/**
 * Width of a string in Helvetica-Bold, in em units (multiples of font size).
 * Used to shrink long names so they stay on one line instead of wrapping and
 * colliding with the subtitle.
 */
export function textWidthEm(text: string): number {
  let total = 0;
  for (const char of text) {
    total += HELVETICA_BOLD_WIDTHS[char] ?? 556;
  }
  return total / 1000;
}

/**
 * Largest font size (<= max) at which `text` fits within `maxWidth` points.
 * Falls back to minSize when the text cannot fit even at the smallest size.
 */
export function fitFontSize(text: string, maxWidth: number, maxSize: number, minSize = 9): number {
  const widthEm = textWidthEm(text);
  if (widthEm <= 0) return maxSize;
  const fitted = Math.floor(maxWidth / widthEm);
  return Math.max(minSize, Math.min(maxSize, fitted));
}
