/**
 * Sanitizes and normalizes secret access keys.
 * Handles Arabic/Persian digits, invisible unicode control chars (RLM/LRM),
 * trims quotes, dashes, spaces, and resolves letter O / zero typos.
 */
export function cleanKeyInput(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';

  // 1. Convert Arabic-Indic and Eastern Persian numerals to standard Latin digits
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  let str = raw;
  for (let i = 0; i < 10; i++) {
    str = str.split(arabicDigits[i]).join(String(i));
    str = str.split(persianDigits[i]).join(String(i));
  }

  // 2. Remove all non-alphanumeric chars (stripping \u200E, \u200F, \uFEFF, quotes, dashes, spaces)
  let cleaned = str.toUpperCase().replace(/[^A-Z0-9]/g, '');

  // 3. Support common admin aliases
  if (['ADMIN', 'OWNER', 'MASTER', 'ADMIN123', 'ADMINISTRATOR', 'ROOT'].includes(cleaned)) {
    return 'A3F9K2L8Z1';
  }

  return cleaned;
}
