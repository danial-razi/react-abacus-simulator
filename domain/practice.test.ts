import { describe, expect, it } from 'vitest';
import { generateExercise } from './practice';
import type { PracticeOperator } from './practice';

const seededRandom = (seed = 123456) => {
    let state = seed >>> 0;
    return () => {
        state = (state * 1664525 + 1013904223) >>> 0;
        return state / 2 ** 32;
    };
};

const calculate = (left: number, right: number, operator: PracticeOperator) => {
    if (operator === '+') return left + right;
    if (operator === '-') return left - right;
    if (operator === '×') return left * right;
    return left / right;
};

describe('practice exercise generator', () => {
    it.each(['+', '-', '×', '÷'] as const)('generates valid %s exercises at every level', (operator) => {
        const random = seededRandom();
        for (const difficulty of ['easy', 'medium', 'hard'] as const) {
            const exercise = generateExercise({ difficulty, operator, numRods: 13, decimalPlaces: 0, random });
            expect(exercise.result).toBe(calculate(exercise.left, exercise.right, exercise.operator));
            expect(exercise.result).toBeGreaterThanOrEqual(0);
            expect(Number.isInteger(exercise.result)).toBe(true);
        }
    });

    it('makes hard multiplication three-by-three or three-by-four digits', () => {
        const random = seededRandom(42);
        const exercises = Array.from({ length: 80 }, () => generateExercise({
            difficulty: 'hard', operator: '×', numRods: 13, decimalPlaces: 0, random,
        }));

        expect(exercises.every(({ left }) => left >= 100 && left <= 999)).toBe(true);
        expect(exercises.every(({ right }) => right >= 100 && right <= 9_999)).toBe(true);
        expect(exercises.some(({ right }) => right >= 1_000)).toBe(true);
        expect(exercises.every(({ left, right, result }) => result === left * right)).toBe(true);
    });

    it('keeps hard three-digit multiplication inside a six-rod abacus', () => {
        const random = seededRandom(7);
        for (let index = 0; index < 30; index += 1) {
            const exercise = generateExercise({
                difficulty: 'hard', operator: '×', numRods: 6, decimalPlaces: 0, random,
            });
            expect(exercise.left).toBeGreaterThanOrEqual(100);
            expect(exercise.right).toBeGreaterThanOrEqual(100);
            expect(exercise.result).toBeLessThanOrEqual(999_999);
        }
    });

    it('creates exact hard divisions with three-digit divisors and quotients', () => {
        const exercise = generateExercise({
            difficulty: 'hard', operator: '÷', numRods: 13, decimalPlaces: 0, random: seededRandom(99),
        });
        expect(exercise.right).toBeGreaterThanOrEqual(100);
        expect(exercise.result).toBeGreaterThanOrEqual(100);
        expect(exercise.left % exercise.right).toBe(0);
    });

    it('falls back to a representable level when integer rods are limited', () => {
        const exercise = generateExercise({
            difficulty: 'hard', operator: 'mixed', numRods: 5, decimalPlaces: 3, random: seededRandom(),
        });
        expect(exercise.difficulty).toBe('easy');
        expect(exercise.result).toBeLessThanOrEqual(99);
    });
});
