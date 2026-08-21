import React, { useEffect, useMemo } from 'react';
import type { AbacusType, Language } from '../types';
import { useAbacus } from '../hooks/useAbacus';
import { usePersistentState } from '../hooks/usePersistentState';
import { useI18n } from '../i18n';
import { highlightsForValue } from '../domain/abacus';
import Abacus from './Abacus';
import { playButtonClickSound } from '../utils/audio';

interface TutorialModeProps {
    abacusType: AbacusType;
    numRods: number;
    decimalPlaces: number;
}

const tutorialCopy = (language: Language, decimalPlaces: number) => {
    const en = [
        ['Welcome to the Abacus!', "Beads above the beam are worth 5 and beads below it are worth 1. Active beads move towards the beam.", null],
        ["Represent '3'", "Move three lower beads towards the beam on the units rod.", 3],
        ["Represent '5'", "Move one upper bead towards the beam. Each upper bead is worth 5.", 5],
        ["Represent '8'", "Combine one upper bead (5) with three lower beads (3).", 8],
        ["Use the tens rod for '12'", "Set 1 on the tens rod and 2 on the units rod.", 12],
        ["Make '65'", "Set 6 on the tens rod and 5 on the units rod.", 65],
        ["A larger number: '123'", "Use the hundreds, tens, and units rods together.", 123],
        ['Practice makes perfect!', 'You completed the basics. Continue in Practice mode for random challenges.', null],
    ] as const;
    const fa = [
        ['به چرتکه خوش آمدی!', 'مهره‌های بالای تیرک ۵ و مهره‌های پایین آن ۱ ارزش دارند. مهرهٔ فعال به سمت تیرک حرکت می‌کند.', null],
        ["نمایش عدد ۳", 'سه مهرهٔ پایین را روی میلهٔ یکان به سمت تیرک حرکت بده.', 3],
        ["نمایش عدد ۵", 'یک مهرهٔ بالا را به سمت تیرک حرکت بده؛ هر مهرهٔ بالا ۵ ارزش دارد.', 5],
        ["نمایش عدد ۸", 'یک مهرهٔ بالا (۵) را با سه مهرهٔ پایین (۳) ترکیب کن.', 8],
        ["استفاده از دهگان برای ۱۲", 'روی میلهٔ دهگان ۱ و روی میلهٔ یکان ۲ قرار بده.', 12],
        ["ساختن عدد ۶۵", 'روی میلهٔ دهگان ۶ و روی میلهٔ یکان ۵ قرار بده.', 65],
        ["عدد بزرگ‌تر ۱۲۳", 'میله‌های صدگان، دهگان و یکان را با هم به‌کار ببر.', 123],
        ['تمرین، کلید مهارت است!', 'مبانی را تمام کردی؛ در حالت تمرین سراغ چالش‌های تصادفی برو.', null],
    ] as const;
    const steps: ReadonlyArray<readonly [string, string, number | null]> = language === 'fa' ? fa : en;
    if (decimalPlaces === 0) return steps;
    const decimalStep: readonly [string, string, number] = language === 'fa'
        ? ['نمایش عدد اعشاری ۱٫۵', 'یک را روی میلهٔ یکان و پنج را روی اولین میلهٔ اعشار قرار بده.', 1.5]
        : ["Represent decimal '1.5'", 'Set 1 on the units rod and 5 on the first decimal rod.', 1.5];
    return [...steps.slice(0, -1), decimalStep, steps.at(-1)!];
};

const TutorialMode: React.FC<TutorialModeProps> = ({ abacusType, numRods, decimalPlaces }) => {
    const { language, t } = useI18n();
    const { rods, value, clear, config, handleUpperBeadClick, handleLowerBeadClick, setUpperBeadActive, setLowerBeadActive } = useAbacus(abacusType, numRods, decimalPlaces);
    const [savedStep, setStep] = usePersistentState('abacus:tutorial-step', 0);
    const tutorialSteps = useMemo(() => tutorialCopy(language, decimalPlaces), [decimalPlaces, language]);
    const step = Math.min(savedStep, tutorialSteps.length - 1);
    const currentStep = tutorialSteps[step]!;
    const target = currentStep[2];
    const isCorrect = target === null || Math.abs(value - target) < 10 ** -(decimalPlaces + 1);
    const highlights = target === null ? [] : highlightsForValue(target, numRods, abacusType, decimalPlaces);

    useEffect(() => clear(), [clear, step]);

    const move = (direction: number) => {
        playButtonClickSound();
        setStep(Math.max(0, Math.min(tutorialSteps.length - 1, step + direction)));
    };

    return (
        <div className="mode-layout h-full min-h-0 grid grid-rows-[auto_minmax(0,1fr)] gap-2 lg:grid-cols-[19rem_minmax(0,1fr)] lg:grid-rows-1">
            <aside className="rounded-lg border border-gray-700 bg-gray-800/50 p-2 text-center shadow-md lg:flex lg:flex-col lg:justify-center lg:p-4">
                <h2 className="text-base font-bold text-cyan-400 mb-1 lg:text-xl">{currentStep[0]}</h2>
                <p className="text-xs text-gray-300 lg:text-sm">{currentStep[1]}</p>
                <div className="mt-1 flex items-center justify-center gap-3 lg:mt-4 lg:block">
                    {target !== null && <p className="text-sm text-gray-300">{t('target')}: <strong className="font-mono text-xl text-white lg:text-3xl" dir="ltr">{target}</strong></p>}
                    {target !== null && <p aria-live="polite" className={`max-w-md text-xs font-semibold lg:mt-3 ${isCorrect ? 'text-emerald-400' : 'text-amber-300'}`}>{isCorrect ? t('correct') : t('tryAgain')}</p>}
                </div>
                <div className="mt-2 flex items-center justify-center gap-2 lg:mt-5">
                    <button onClick={() => move(-1)} disabled={step === 0} className="px-3 py-2 text-xs bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-500 transition-colors">{t('previous')}</button>
                    <span className="text-xs text-gray-400 font-mono" dir="ltr">{step + 1} / {tutorialSteps.length}</span>
                    <button onClick={() => move(1)} disabled={step === tutorialSteps.length - 1 || !isCorrect} className="px-3 py-2 text-xs bg-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:bg-cyan-700 disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-500 transition-colors">{t('next')}</button>
                </div>
            </aside>

            <div className="min-h-0"><Abacus rods={rods} config={config} decimalPlaces={decimalPlaces} highlights={highlights}
                handleUpperBeadClick={handleUpperBeadClick} handleLowerBeadClick={handleLowerBeadClick}
                setUpperBeadActive={setUpperBeadActive} setLowerBeadActive={setLowerBeadActive}
                interactive={target !== null} /></div>
        </div>
    );
};

export default TutorialMode;
