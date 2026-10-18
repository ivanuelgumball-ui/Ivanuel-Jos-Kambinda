/**
 * Cryptographic security and utility helpers for BCB Shoes
 * Password hashing uses SHA-256 through the browser's native Web Crypto API.
 * The plaintext admin password is NEVER exposed in the codebase.
 */

// Initial admin email and SHA-256 hash of initial password
export const INITIAL_ADMIN_EMAIL = 'agnelocastelobranco@gmail.com';
export const INITIAL_ADMIN_PASSWORD_HASH = '50b4eaf62bba81e5bab350210c32960f0050f99b0de4401d8c927e539fc44b43';

export async function hashString(text: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(text.trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Format currency numbers in Angolan Kwanza (Kz)
 * e.g., 85000 -> "85.000 Kz"
 */
export function formatKz(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0 Kz';
  return new Intl.NumberFormat('pt-AO', {
    maximumFractionDigits: 0,
  }).format(amount) + ' Kz';
}

/**
 * Format dates in Portuguese (Angola)
 */
export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('pt-AO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return isoString;
  }
}

/**
 * Generate a clean order code, e.g. BCB-2026-4921
 */
export function generateOrderNumber(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `BCB-2026-${randomNum}`;
}
