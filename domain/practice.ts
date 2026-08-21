export type PracticeOperator = '+' | '-' | '×' | '÷';
export type OperatorChoice = PracticeOperator | 'mixed';
export type PracticeDifficulty = 'easy' | 'medium' | 'hard';

export interface ArithmeticExercise {
    left: number;
    right: number;
    operator: PracticeOperator;
    result: number;
    difficulty: PracticeDifficulty;
}

interface ExerciseOptions {
    difficulty: PracticeDifficulty;
    operator: OperatorChoice;
    numRods: number;
    decimalPlaces: number;
    random?: () => number;
}

const randomInteger = (minimum: number, maximum: number, random: () => number) =>
    Math.floor(random() * (maximum - minimum + 1)) + minimum;

const chooseOperator = (choice: OperatorChoice, difficulty: PracticeDifficulty, random: () => number): PracticeOperator => {
    if (choice !== 'mixed') return choice;
    const operators: PracticeOperator[] = difficulty === 'hard'
        ? ['+', '-', '×', '×', '÷']
        : ['+', '-', '×', '÷'];
    return operators[randomInteger(0, operators.length - 1, random)]!;
};

const createCandidate = (
    difficulty: PracticeDifficulty,
    operator: PracticeOperator,
    random: () => number,
): ArithmeticExercise => {
    let left: number;
    let right: number;

    if (difficulty === 'easy') {
        if (operator === '+') {
            left = randomInteger(1, 49, random);
            right = randomInteger(1, 49, random);
        } else if (operator === '-') {
            left = randomInteger(10, 99, random);
            right = randomInteger(1, left, random);
        } else if (operator === '×') {
            left = randomInteger(2, 12, random);
            right = randomInteger(2, 12, random);
        } else {
            right = randomInteger(2, 12, random);
            const quotient = randomInteger(2, 12, random);
            left = right * quotient;
        }
    } else if (difficulty === 'medium') {
        if (operator === '+') {
            left = randomInteger(100, 899, random);
            right = randomInteger(10, 999, random);
        } else if (operator === '-') {
            left = randomInteger(100, 999, random);
            right = randomInteger(10, left, random);
        } else if (operator === '×') {
            left = randomInteger(10, 99, random);
            right = randomInteger(10, 99, random);
        } else {
            right = randomInteger(10, 99, random);
            const quotient = randomInteger(10, 99, random);
            left = right * quotient;
        }
    } else if (operator === '+') {
        left = randomInteger(10_000, 499_999, random);
        right = randomInteger(10_000, 499_999, random);
    } else if (operator === '-') {
        left = randomInteger(100_000, 999_999, random);
        right = randomInteger(10_000, left, random);
    } else if (operator === '×') {
        left = randomInteger(100, 999, random);
        right = random() < 0.5
            ? randomInteger(100, 999, random)
            : randomInteger(1_000, 9_999, random);
    } else {
        right = randomInteger(100, 999, random);
        const quotient = randomInteger(100, 999, random);
        left = right * quotient;
    }

    const result = operator === '+' ? left + right
        : operator === '-' ? left - right
        : operator === '×' ? left * right
        : left / right;

    return { left, right, operator, result, difficulty };
};

export const requiredIntegerRods = (difficulty: PracticeDifficulty) =>
    difficulty === 'hard' ? 6 : difficulty === 'medium' ? 3 : 1;

export const exercisePoints = (exercise: ArithmeticExercise) => {
    const base = exercise.difficulty === 'hard' ? 50 : exercise.difficulty === 'medium' ? 25 : 10;
    return exercise.difficulty === 'hard' && exercise.operator === '×' ? base + 25 : base;
};

export const generateExercise = ({
    difficulty,
    operator: choice,
    numRods,
    decimalPlaces,
    random = Math.random,
}: ExerciseOptions): ArithmeticExercise => {
    const integerRods = numRods - decimalPlaces;
    const effectiveDifficulty = integerRods >= requiredIntegerRods(difficulty)
        ? difficulty
        : integerRods >= requiredIntegerRods('medium') ? 'medium' : 'easy';
    const maxResult = Math.floor((10 ** numRods - 1) / 10 ** decimalPlaces);

    for (let attempt = 0; attempt < 500; attempt += 1) {
        const operator = chooseOperator(choice, effectiveDifficulty, random);
        const exercise = createCandidate(effectiveDifficulty, operator, random);
        if (Number.isInteger(exercise.result) && exercise.result >= 0 && exercise.result <= maxResult) {
            return exercise;
        }
    }

    return { left: 1, right: 1, operator: '+', result: 2, difficulty: 'easy' };
};
