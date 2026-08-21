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
        <div className="mode-layout h-full min-h-0 grid grid-rows-[auto_minmax(0,1fr)] gap-2 lg:grid-cols-[19rem_minmax(0,1fr)] lg:grid-rows-1">
            <section className="rounded-xl border border-gray-700 bg-gray-800/50 p-2 text-center lg:flex lg:flex-col lg:justify-center lg:p-4">
                <div className="mb-1 flex flex-wrap justify-center gap-3 text-xs text-gray-300 lg:mb-3">
                    <span>{t('score')}: <strong className="text-cyan-300">{score}</strong></span>
                    <span>{t('streak')}: <strong className="text-cyan-300">{streak}</strong></span>
                    <span>{t('best')}: <strong className="text-cyan-300">{best}</strong></span>
                </div>
                <label className="mx-auto mb-1 flex max-w-xs items-center justify-center gap-2 text-xs text-gray-400 lg:mb-3 lg:block">
                    <span className="lg:mb-1 lg:block">{t('difficulty')}</span>
                    <select value={difficulty} onChange={(event) => changeDifficulty(event.target.value as Difficulty)} className="rounded-lg bg-gray-900 px-2 py-1 text-gray-100 lg:w-full">
                        <option value="easy">{t('easy')}</option><option value="medium">{t('medium')}</option><option value="hard">{t('hard')}</option>
                    </select>
                </label>
                <div className="flex items-baseline justify-center gap-2 lg:block">
                    <p className="text-xs text-gray-400">{t('target')}</p>
                    <p className="font-mono text-2xl font-bold text-cyan-400 lg:text-5xl" dir="ltr">{format(target)}</p>
                    <p className="text-xs text-gray-400 lg:mt-2">{t('currentValue')}: <span className="font-mono text-white" dir="ltr">{format(value)}</span></p>
                </div>
                {feedback && <p role="status" className={`mt-1 text-xs font-semibold lg:mt-3 ${feedback === 'correct' ? 'text-emerald-400' : 'text-amber-300'}`}>{feedback === 'correct' ? t('practiceCorrect') : t('practiceWrong')}</p>}
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
