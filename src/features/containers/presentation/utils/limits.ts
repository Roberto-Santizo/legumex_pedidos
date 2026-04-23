// Created by Luis

// Standard limits — used as visual reference (CapacityBar turns red when exceeded)
export const MAX_PALLETS = 20;
export const MAX_POUNDS = 40_000;

// Absolute hard limit — the only threshold that actually blocks adding orders
// Pallets have no hard block: containers can exceed 20 pallets if needed
export const HARD_MAX_POUNDS = 42_000;

// Soft limit — only triggers a visual warning, does not block confirmation
export const MIN_POUNDS_RECOMMENDED = 20_000;

/** Returns true if adding an order would overflow the absolute weight limit */
export function wouldExceedPounds(current: number, adding: number): boolean {
    return current + adding > HARD_MAX_POUNDS;
}

/** Percentage used for a given capacity value, capped at 100 */
export function usagePercent(used: number, max: number): number {
    return Math.min(Math.round((used / max) * 100), 100);
}
