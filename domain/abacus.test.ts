import { describe, expect, it } from 'vitest';
import { AbacusType } from '../types';
import { createAbacusState, rodsToValue, setBeadActive, valueToRods } from './abacus';

describe('abacus domain', () => {
    it.each([0, 4, 5, 9, 42, 12345])('round-trips %i on a soroban', (value) => {
        expect(rodsToValue(valueToRods(value, 13, AbacusType.JAPANESE))).toBe(value);
    });

    it('uses one upper bead for canonical suanpan digits', () => {
        expect(valueToRods(9, 1, AbacusType.CHINESE)[0]).toEqual({
            upperBeadsActive: 1,
            lowerBeadsActive: 4,
        });
    });

    it('moves contiguous bead groups', () => {
        const rods = createAbacusState(1);
        const threeActive = setBeadActive(rods, 0, 'lower', 2, true);
        const oneActive = setBeadActive(threeActive, 0, 'lower', 1, false);
        expect(threeActive[0]?.lowerBeadsActive).toBe(3);
        expect(oneActive[0]?.lowerBeadsActive).toBe(1);
    });

    it('supports redundant suanpan values', () => {
        let rods = createAbacusState(1);
        rods = setBeadActive(rods, 0, 'upper', 1, true);
        rods = setBeadActive(rods, 0, 'lower', 4, true);
        expect(rodsToValue(rods)).toBe(15);
    });

    it('keeps the least-significant rods on overflow', () => {
        expect(rodsToValue(valueToRods(1234, 3, AbacusType.JAPANESE))).toBe(234);
    });

    it('round-trips decimal values at the selected precision', () => {
        const rods = valueToRods(12.34, 5, AbacusType.JAPANESE, 2);
        expect(rodsToValue(rods, 2)).toBeCloseTo(12.34);
    });
});
