import React, { useState } from 'react';
import type { AbacusType } from '../types';
import { useAbacus } from '../hooks/useAbacus';
import { usePersistentState } from '../hooks/usePersistentState';
import { useI18n } from '../i18n';
import { playButtonClickSound } from '../utils/audio';
import Abacus from './Abacus';

interface PracticeModeProps {
    abacusType: AbacusType;
    numRods: number;
    decimalPlaces: number;
}

type Difficulty = 'easy' | 'medium' | 'hard';

const createTarget = (difficulty: Difficulty, numRods: number, decimalPlaces: number) => {
    const requestedDigits = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
    const integerDigits = Math.max(1, Math.min(requestedDigits, numRods - decimalPlaces));
    const scale = 10 ** decimalPlaces;
    const maxScaled = 10 ** integerDigits * scale - 1;
    return (Math.floor(Math.random() * maxScaled) + 1) / scale;
};

const PracticeMode: React.FC<PracticeModeProps> = ({ abacusType, numRods, decimalPlaces }) => {
    const { language, t } = useI18n();
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [target, setTarget] = useState(() => createTarget('easy', numRods, decimalPlaces));
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [best, setBest] = usePersistentState('abacus:practice-best', 0);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const { rods, value, clear, config, handleUpperBeadClick, handleLowerBeadClick, setUpperBeadActive, setLowerBeadActive } = useAbacus(abacusType, numRods, decimalPlaces);

    const format = (number: number) => number.toLocaleString(language === 'fa' ? 'fa-IR' : 'en-US', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    });

    const nextChallenge = (nextDifficulty = difficulty) => {
        playButtonClickSound();
        clear();
        setTarget(createTarget(nextDifficulty, numRods, decimalPlaces));
        setFeedback(null);
    };

    const changeDifficulty = (nextDifficulty: Difficulty) => {
        setDifficulty(nextDifficulty);
        setStreak(0);
        nextChallenge(nextDifficulty);
    };

    const checkAnswer = () => {
        if (feedback === 'correct') return;
        const correct = Math.abs(value - target) < 10 ** -(decimalPlaces + 1);
        if (!correct) {
            setFeedback('wrong');
            setStreak(0);
            return;
        }
        playButtonClickSound();
        const nextScore = score + 10 + streak * 2;
        setScore(nextScore);
        setStreak(current => current + 1);
        setBest(Math.max(best, nextScore));
        setFeedback('correct');
    };

    return (
        <div className="flex flex-col items-center gap-6">
            <section className="w-full max-w-2xl rounded-xl border border-gray-700 bg-gray-800/50 p-4 text-center">
                <div className="mb-4 flex flex-wrap justify-center gap-4 text-sm text-gray-300">
                    <span>{t('score')}: <strong className="text-cyan-300">{score}</strong></span>
                    <span>{t('streak')}: <strong className="text-cyan-300">{streak}</strong></span>
                    <span>{t('best')}: <strong className="text-cyan-300">{best}</strong></span>
                </div>
                <label className="mx-auto mb-4 block max-w-xs text-sm text-gray-400">
                    <span className="mb-2 block">{t('difficulty')}</span>
                    <select value={difficulty} onChange={(event) => changeDifficulty(event.target.value as Difficulty)} className="w-full rounded-lg bg-gray-900 px-3 py-2 text-gray-100">
                        <option value="easy">{t('easy')}</option><option value="medium">{t('medium')}</option><option value="hard">{t('hard')}</option>
                    </select>
                </label>
                <p className="text-gray-400">{t('target')}</p>
                <p className="font-mono text-5xl font-bold text-cyan-400" dir="ltr">{format(target)}</p>
                <p className="mt-2 text-gray-400">{t('currentValue')}: <span className="font-mono text-white" dir="ltr">{format(value)}</span></p>
                {feedback && <p role="status" className={`mt-3 font-semibold ${feedback === 'correct' ? 'text-emerald-400' : 'text-amber-300'}`}>{feedback === 'correct' ? t('practiceCorrect') : t('practiceWrong')}</p>}
            </section>

            <Abacus rods={rods} config={config} decimalPlaces={decimalPlaces}
                handleUpperBeadClick={handleUpperBeadClick} handleLowerBeadClick={handleLowerBeadClick}
                setUpperBeadActive={setUpperBeadActive} setLowerBeadActive={setLowerBeadActive} />

            <div className="flex flex-wrap justify-center gap-3">
                <button onClick={checkAnswer} disabled={feedback === 'correct'} className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-emerald-300">{t('check')}</button>
                <button onClick={() => nextChallenge()} className="rounded-lg bg-cyan-600 px-6 py-3 font-semibold text-white hover:bg-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-300">{t('newChallenge')}</button>
            </div>
        </div>
    );
};

export default PracticeMode;
