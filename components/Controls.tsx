import React from 'react';
import { AbacusType, Mode } from '../types';
import { playModeSwitchSound } from '../utils/audio';
import { useI18n } from '../i18n';
import type { Language } from '../types';

interface ControlsProps {
    mode: Mode;
    setMode: (mode: Mode) => void;
    abacusType: AbacusType;
    setAbacusType: (type: AbacusType) => void;
    soundEnabled: boolean;
    setSoundEnabled: (enabled: boolean) => void;
    language: Language;
    setLanguage: (language: Language) => void;
    numRods: number;
    setNumRods: (rods: number) => void;
    decimalPlaces: number;
    setDecimalPlaces: (places: number) => void;
}

const CalculatorIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="16" height="20" x="4" y="2" rx="2" />
        <line x1="8" x2="16" y1="6" y2="6" />
        <line x1="16" x2="16" y1="14" y2="18" />
        <line x1="12" x2="12" y1="14" y2="18" />
        <line x1="8" x2="8" y1="14" y2="18" />
    </svg>
);

const BookOpenIcon: React.FC<{className?: string}> = ({className}) => (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
);

const ArrowRightLeftIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m16 3 4 4-4 4" />
        <path d="M20 7H4" />
        <path d="m8 21-4-4 4-4" />
        <path d="M4 17h16" />
    </svg>
);

const TargetIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
        <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>
    </svg>
);


const Controls: React.FC<ControlsProps> = ({
    mode, setMode, abacusType, setAbacusType, soundEnabled, setSoundEnabled,
    language, setLanguage, numRods, setNumRods, decimalPlaces, setDecimalPlaces,
}) => {
    const { t } = useI18n();
    
    const modeButtons = [
        { id: Mode.COMPUTE, label: t('compute'), icon: <CalculatorIcon /> },
        { id: Mode.TUTORIAL, label: t('tutorial'), icon: <BookOpenIcon /> },
        { id: Mode.PRACTICE, label: t('practice'), icon: <TargetIcon /> },
        { id: Mode.CONVERT, label: t('convert'), icon: <ArrowRightLeftIcon /> },
    ];

    const typeButtons = [
        { id: AbacusType.JAPANESE, label: t('japanese') },
        { id: AbacusType.CHINESE, label: t('chinese') },
    ];

    const handleModeChange = (newMode: Mode) => {
        if (mode !== newMode) {
            playModeSwitchSound();
            setMode(newMode);
        }
    };

    const handleTypeChange = (newType: AbacusType) => {
        if (abacusType !== newType) {
            playModeSwitchSound();
            setAbacusType(newType);
        }
    };

    return (
        <div className="controls-panel w-full shrink-0 bg-gray-800/50 p-2 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700">
            <div className="grid grid-cols-2 lg:grid-cols-[1.35fr_1.15fr_.8fr_.7fr] gap-2">
                {/* Mode Selection */}
                <div className="flex-1 w-full sm:w-auto">
                    <span className="text-xs font-semibold text-gray-400 mb-1 block">{t('mode')}</span>
                    <div className="flex bg-gray-900/70 p-0.5 rounded-lg" role="group" aria-label="Application mode">
                        {modeButtons.map(button => (
                            <button
                                key={button.id}
                                onClick={() => handleModeChange(button.id)}
                                aria-pressed={mode === button.id}
                                className={`flex-1 min-w-0 px-1.5 py-1.5 text-xs rounded-md transition-all duration-200 flex items-center justify-center gap-1 ${
                                    mode === button.id
                                        ? 'bg-cyan-500 text-white shadow'
                                        : 'text-gray-300 hover:bg-gray-700/50'
                                }`}
                            >
                                {button.icon}
                                <span className="hidden xl:inline">{button.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Abacus Type Selection */}
                <div className="flex-1 w-full sm:w-auto">
                    <span className="text-xs font-semibold text-gray-400 mb-1 block">{t('abacusType')}</span>
                     <div className="flex bg-gray-900/70 p-0.5 rounded-lg" role="group" aria-label="Abacus type">
                        {typeButtons.map(button => (
                            <button
                                key={button.id}
                                onClick={() => handleTypeChange(button.id)}
                                aria-pressed={abacusType === button.id}
                                className={`flex-1 min-w-0 px-1.5 py-1.5 text-xs rounded-md transition-all duration-200 truncate ${
                                    abacusType === button.id
                                        ? 'bg-cyan-500 text-white shadow'
                                        : 'text-gray-300 hover:bg-gray-700/50'
                                }`}
                            >
                               {button.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <label className="text-xs text-gray-400">
                        <span className="mb-1 block font-semibold">{t('rods')}</span>
                        <select value={numRods} onChange={(event) => setNumRods(Number(event.target.value))} className="w-full rounded-lg bg-gray-900/70 px-2 py-1.5 text-xs text-gray-100 focus-visible:ring-2 focus-visible:ring-cyan-400">
                            {[5, 9, 13].map((count) => <option key={count} value={count}>{count}</option>)}
                        </select>
                    </label>
                    <label className="text-xs text-gray-400">
                        <span className="mb-1 block font-semibold truncate">{t('decimals')}</span>
                        <select value={decimalPlaces} onChange={(event) => setDecimalPlaces(Number(event.target.value))} className="w-full rounded-lg bg-gray-900/70 px-2 py-1.5 text-xs text-gray-100 focus-visible:ring-2 focus-visible:ring-cyan-400">
                            {[0, 1, 2, 3].map((count) => <option key={count} value={count}>{count}</option>)}
                        </select>
                    </label>
                </div>
                <div className="grid grid-cols-2 gap-2 self-end">
                    <button
                        type="button"
                        aria-pressed={soundEnabled}
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="w-full min-w-0 px-2 py-1.5 text-xs rounded-lg bg-gray-900/70 text-gray-200 hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 truncate"
                    >
                        {soundEnabled ? t('soundOn') : t('soundOff')}
                    </button>
                    <button
                        type="button"
                        onClick={() => setLanguage(language === 'en' ? 'fa' : 'en')}
                        className="w-full min-w-0 px-2 py-1.5 text-xs rounded-lg bg-gray-900/70 text-gray-200 hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 truncate"
                    >
                        {t('language')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Controls;
