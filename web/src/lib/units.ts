/**
 * Maharashtra land-area units.
 *   1 guntha = 1,089 sq.ft      40 guntha = 1 acre = 43,560 sq.ft
 *   1 are    = 100 sq.m         1 sq.m = 10.7639104 sq.ft
 */
export const SQFT_PER_GUNTHA = 1089;
export const SQFT_PER_ACRE = 43560;
export const SQFT_PER_SQM = 10.7639104;
export const SQFT_PER_ARE = 100 * SQFT_PER_SQM;

export const sqftToGuntha = (sqft: number) => sqft / SQFT_PER_GUNTHA;
export const sqftToSqm = (sqft: number) => sqft / SQFT_PER_SQM;
export const sqftToAcre = (sqft: number) => sqft / SQFT_PER_ACRE;
export const gunthaToSqft = (guntha: number) => guntha * SQFT_PER_GUNTHA;
export const areToSqft = (are: number) => are * SQFT_PER_ARE;

/** Indian digit grouping (12,34,567). */
export function formatNumber(value: number, fractionDigits = 2): string {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatInr(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

/** ₹ in lakh / crore wording, e.g. 3.58 crore. */
export function formatInrShort(value: number): string {
  if (value >= 1e7) return `₹${formatNumber(value / 1e7, 2)} crore`;
  return `₹${formatNumber(value / 1e5, 2)} lakh`;
}
