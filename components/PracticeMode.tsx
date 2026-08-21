import React, { useState } from 'react';
import type { AbacusType } from '../types';
import { useAbacus } from '../hooks/useAbacus';
import { usePersistentState } from '../hooks/usePersistentState';
import { useI18n } from '../i18n';
import {
    exercisePoints,
    generateExercise,
    requiredIntegerRods,
} from '../domain/practice';
import type {
    OperatorChoice,
    PracticeDifficulty,
} from '../domain/practice';
import { playButtonClickSound } from '../utils/audio';
import Abacus from './Abacus';

interface PracticeModeProps {
    abacusType: AbacusType;
    numRods: number;
    decimalPlaces: number;
}

const PracticeMode: React.FC<PracticeModeProps> = ({ abacusType, numRods, decimalPlaces }) => {
    const { language, t } = useI18n();
    const [difficulty, setDifficulty] = useState<PracticeDifficulty>('easy');
    const [operatorChoice, setOperatorChoice] = useState<OperatorChoice>('mixed');
    const [exercise, setExercise] = useState(() => generateExercise({
        difficulty: 'easy', operator: 'mixed', numRods, decimalPlaces,
    }));
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [best, setBest] = usePersistentState('abacus:practice-best', 0);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const { rods, value, clear, config, handleUpperBeadClick, handleLowerBeadClick, setUpperBeadActive, setLowerBeadActive } = useAbacus(abacusType, numRods, decimalPlaces);
    const integerRods = numRods - decimalPlaces;

    const format = (number: number) => number.toLocaleString(language === 'fa' ? 'fa-IR' : 'en-US', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    });

    const formatOperand = (number: number) => number.toLocaleString(language === 'fa' ? 'fa-IR' : 'en-US');

    const nextChallenge = (
        nextDifficulty: PracticeDifficulty = difficulty,
        nextOperator: OperatorChoice = operatorChoice,
    ) => {
        playButtonClickSound();
        clear();
        setExercise(generateExercise({
            difficulty: nextDifficulty,
            operator: nextOperator,
            numRods,
            decimalPlaces,
        }));
        setAttempts(0);
        setFeedback(null);
    };

    const changeDifficulty = (nextDifficulty: PracticeDifficulty) => {
        setDifficulty(nextDifficulty);
        setStreak(0);
        nextChallenge(nextDifficulty, operatorChoice);
    };

    const changeOperator = (nextOperator: OperatorChoice) => {
        setOperatorChoice(nextOperator);
        setStreak(0);
        nextChallenge(difficulty, nextOperator);
    };

    const checkAnswer = () => {
        if (feedback === 'correct') return;
        const correct = Math.abs(value - exercise.result) < 10 ** -(decimalPlaces + 1);
        if (!correct) {
            setAttempts(current => current + 1);
            setFeedback('wrong');
            setStreak(0);
            return;
        }

        playButtonClickSound();
        const nextScore = score + exercisePoints(exercise) + streak * 2;
        setScore(nextScore);
        setStreak(current => current + 1);
        setBest(Math.max(best, nextScore));
        setFeedback('correct');
    };

    const operationOptions: Array<{ value: OperatorChoice; label: string }> = [
        { value: 'mixed', label: t('mixed') },
        { value: '+', label: t('addition') },
        { value: '-', label: t('subtraction') },
        { value: '×', label: t('multiplication') },
        { value: '÷', label: t('division') },
    ];

    return (
        <div className="mode-layout h-full min-h-0 grid grid-rows-[auto_minmax(0,1fr)] gap-2 lg:grid-cols-[21rem_minmax(0,1fr)] lg:grid-rows-1">
            <section className="rounded-xl border border-gray-700 bg-gray-800/50 p-2 text-center lg:flex lg:flex-col lg:justify-center lg:p-4">
                <div className="mb-1 flex flex-wrap justify-center gap-3 text-xs text-gray-300 lg:mb-3">
                    <span>{t('score')}: <strong className="text-cyan-300">{score}</strong></span>
                    <span>{t('streak')}: <strong className="text-cyan-300">{streak}</strong></span>
                    <span>{t('best')}: <strong className="text-cyan-300">{best}</strong></span>
                </div>

                <div className="mx-auto mb-1 grid w-full max-w-sm grid-cols-2 gap-2 text-xs text-gray-400 lg:mb-3">
                    <label>
                        <span className="mb-1 block">{t('difficulty')}</span>
                        <select value={difficulty} onChange={(event) => changeDifficulty(event.target.value as PracticeDifficulty)} className="w-full rounded-lg bg-gray-900 px-2 py-1 text-gray-100">
                            <option value="easy">{t('easy')}</option>
                            <option value="medium" disabled={integerRods < requiredIntegerRods('medium')}>{t('medium')}</option>
                            <option value="hard" disabled={integerRods < requiredIntegerRods('hard')}>{t('hard')}</option>
                        </select>
                    </label>
                    <label>
                        <span className="mb-1 block">{t('operation')}</span>
                        <select value={operatorChoice} onChange={(event) => changeOperator(event.target.value as OperatorChoice)} className="w-full rounded-lg bg-gray-900 px-2 py-1 text-gray-100">
                            {operationOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                    </label>
                </div>

                <p className="text-[11px] text-gray-400">{t('solveExercise')}</p>
                <p className="my-1 font-mono text-2xl font-bold text-cyan-400 lg:my-3 lg:text-4xl" dir="ltr">
                    {formatOperand(exercise.left)} {exercise.operator} {formatOperand(exercise.right)} = {language === 'fa' ? '؟' : '?'}
                </p>
                <p className="text-xs text-gray-400">{t('currentValue')}: <span className="font-mono text-white" dir="ltr">{format(value)}</span></p>

                {feedback && (
                    <p role="status" className={`mt-1 text-xs font-semibold lg:mt-3 ${feedback === 'correct' ? 'text-emerald-400' : 'text-amber-300'}`}>
                        {feedback === 'correct' ? t('practiceCorrect') : t('practiceWrong')}
                        {feedback === 'wrong' && attempts >= 2 && (
                            <span className="ms-2 text-gray-200">{t('answerWas')}: <span dir="ltr">{format(exercise.result)}</span></span>
                        )}
                    </p>
                )}

                {integerRods < requiredIntegerRods('hard') && (
                    <p className="mt-1 text-[10px] text-gray-500">
                        {integerRods < requiredIntegerRods('medium') ? t('mediumNeedsRods') : t('hardNeedsRods')}
                    </p>
                )}

                <div className="mt-1 flex flex-wrap justify-center gap-2 lg:mt-4">
                    <button onClick={checkAnswer} disabled={feedback === 'correct'} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-emerald-300">{t('check')}</button>
                    <button onClick={() => nextChallenge()} className="rounded-lg bg-cyan-600 px-3 py-2 text-xs font-semibold text-white hover:bg-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-300">{t('newChallenge')}</button>
                </div>
            </section>

            <div className="min-h-0"><Abacus rods={rods} config={config} decimalPlaces={decimalPlaces}
                handleUpperBeadClick={handleUpperBeadClick} handleLowerBeadClick={handleLowerBeadClick}
                setUpperBeadActive={setUpperBeadActive} setLowerBeadActive={setLowerBeadActive} /></div>
        </div>
    );
};

export default PracticeMode;
