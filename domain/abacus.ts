import { AbacusType } from '../types';
import type { AbacusConfig, AbacusHighlight, RodState } from '../types';

export const ABACUS_CONFIGS: Record<AbacusType, AbacusConfig> = {
    [AbacusType.JAPANESE]: { upperBeads: 1, lowerBeads: 4 },
    [AbacusType.CHINESE]: { upperBeads: 2, lowerBeads: 5 },
};

export type Deck = 'upper' | 'lower';

export const createRod = (): RodState => ({
    upperBeadsActive: 0,
    lowerBeadsActive: 0,
});

export const createAbacusState = (numRods: number): RodState[] =>
    Array.from({ length: numRods }, createRod);

export const rodsToValue = (rods: RodState[], decimalPlaces = 0): number =>
    rods.reduce((total, rod, index) => {
        const rodValue = rod.upperBeadsActive * 5 + rod.lowerBeadsActive;
        const exponent = rods.length - 1 - index - decimalPlaces;
        return total + rodValue * 10 ** exponent;
    }, 0);

export const valueToRods = (
    value: number,
    numRods: number,
    abacusType: AbacusType,
    decimalPlaces = 0,
): RodState[] => {
    const rods = createAbacusState(numRods);
    const config = ABACUS_CONFIGS[abacusType];
    const scale = 10 ** decimalPlaces;
    const scaledValue = Math.max(0, Math.round(value * scale));
    const digits = String(scaledValue).slice(-numRods).padStart(numRods, '0');

    return rods.map((_, index) => {
        const digit = Number(digits[index]);
        const upperBeadsActive = digit >= 5 ? 1 : 0;

        return {
            upperBeadsActive: Math.min(upperBeadsActive, config.upperBeads),
            lowerBeadsActive: Math.min(digit - upperBeadsActive * 5, config.lowerBeads),
        };
    });
};

export const setBeadActive = (
    rods: RodState[],
    rodIndex: number,
    deck: Deck,
    beadIndex: number,
    active: boolean,
): RodState[] => {
    const rod = rods[rodIndex];
    if (!rod) return rods;

    const countKey = deck === 'upper' ? 'upperBeadsActive' : 'lowerBeadsActive';
    const currentCount = rod[countKey];
    const nextCount = active
        ? Math.max(currentCount, beadIndex + 1)
        : Math.min(currentCount, beadIndex);

    if (nextCount === currentCount) return rods;

    const nextRods = [...rods];
    nextRods[rodIndex] = { ...rod, [countKey]: nextCount };
    return nextRods;
};

export const toggleBead = (
    rods: RodState[],
    rodIndex: number,
    deck: Deck,
    beadIndex: number,
): RodState[] => {
    const rod = rods[rodIndex];
    if (!rod) return rods;
    const activeCount = deck === 'upper' ? rod.upperBeadsActive : rod.lowerBeadsActive;
    return setBeadActive(rods, rodIndex, deck, beadIndex, beadIndex >= activeCount);
};

export const highlightsForValue = (
    value: number,
    numRods: number,
    abacusType: AbacusType,
    decimalPlaces = 0,
): AbacusHighlight[] => valueToRods(value, numRods, abacusType, decimalPlaces)
    .map((rod, rodIndex) => ({
        rodIndex,
        upperBeads: Array.from({ length: rod.upperBeadsActive }, (_, index) => index),
        lowerBeads: rod.lowerBeadsActive,
    }))
    .filter((highlight) => highlight.upperBeads.length > 0 || highlight.lowerBeads > 0);
