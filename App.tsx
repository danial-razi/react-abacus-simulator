import React, { useEffect, useState, useMemo } from 'react';
import { AbacusType, Mode } from './types';
import Controls from './components/Controls';
import ComputeMode from './components/ComputeMode';
import TutorialMode from './components/TutorialMode';
import ConvertMode from './components/ConvertMode';
import PracticeMode from './components/PracticeMode';
import { usePersistentState } from './hooks/usePersistentState';
import { setAudioEnabled } from './utils/audio';
import { I18nProvider } from './i18n';
import type { Language } from './types';

const AbacusLogo: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className}>
        <defs>
            <radialGradient id="logoBeadGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
            </radialGradient>
        </defs>
        <line x1="50" y1="0" x2="50" y2="100" stroke="#a08b7a" strokeWidth="8"/>
        <rect x="10" y="46" width="80" height="8" fill="#382a1f"/>
        <circle cx="50" cy="30" r="14" fill="url(#logoBeadGrad)" stroke="#78350f" strokeWidth="3"/>
        <circle cx="50" cy="70" r="14" fill="url(#logoBeadGrad)" stroke="#78350f" strokeWidth="3"/>
    </svg>
);

const App: React.FC = () => {
    const [mode, setMode] = useState<Mode>(Mode.COMPUTE);
    const [abacusType, setAbacusType] = useState<AbacusType>(AbacusType.JAPANESE);
    const [soundEnabled, setSoundEnabled] = usePersistentState('abacus:sound', true);
    const [language, setLanguage] = usePersistentState<Language>('abacus:language', 'en');
    const [numRods, setNumRods] = usePersistentState('abacus:rods', 13);
    const [decimalPlaces, setDecimalPlaces] = usePersistentState('abacus:decimals', 0);

    useEffect(() => setAudioEnabled(soundEnabled), [soundEnabled]);
    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    }, [language]);

    const renderMode = () => {
        switch (mode) {
            case Mode.TUTORIAL:
                return <TutorialMode key={`${abacusType}-${numRods}-${decimalPlaces}`} abacusType={abacusType} numRods={numRods} decimalPlaces={decimalPlaces} />;
            case Mode.PRACTICE:
                return <PracticeMode key={`${abacusType}-${numRods}-${decimalPlaces}`} abacusType={abacusType} numRods={numRods} decimalPlaces={decimalPlaces} />;
            case Mode.CONVERT:
                return <ConvertMode key={`${abacusType}-${numRods}-${decimalPlaces}`} abacusType={abacusType} numRods={numRods} decimalPlaces={decimalPlaces} />;
            case Mode.COMPUTE:
            default:
                return <ComputeMode key={`${abacusType}-${numRods}-${decimalPlaces}`} abacusType={abacusType} numRods={numRods} decimalPlaces={decimalPlaces} />;
        }
    };

    const Header = useMemo(() => (
        <header className="app-header w-full max-w-7xl mx-auto shrink-0 flex items-center justify-center gap-3 py-1 text-start">
             <AbacusLogo className="h-10 w-10 shrink-0 sm:h-12 sm:w-12" />
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-cyan-400 tracking-wider leading-tight">
                    {language === 'fa' ? 'شبیه‌ساز چرتکه' : 'React Abacus Simulator'}
                </h1>
                <p className="hidden text-xs text-gray-400 sm:block">
                    {language === 'fa' ? 'هنر محاسبه با چرتکه را یاد بگیر و تمرین کن.' : 'Learn and master the art of the abacus.'}
                </p>
            </div>
        </header>
    ), [language]);

    return (
        <I18nProvider language={language}>
        <div className="h-[100dvh] overflow-hidden bg-gray-900 text-gray-100 flex flex-col items-center gap-1 p-2 font-sans">
            {Header}
            <main className="w-full max-w-7xl min-h-0 flex-1 flex flex-col items-center gap-2">
                <Controls
                    mode={mode}
                    setMode={setMode}
                    abacusType={abacusType}
                    setAbacusType={setAbacusType}
                    soundEnabled={soundEnabled}
                    setSoundEnabled={setSoundEnabled}
                    language={language}
                    setLanguage={setLanguage}
                    numRods={numRods}
                    setNumRods={setNumRods}
                    decimalPlaces={decimalPlaces}
                    setDecimalPlaces={setDecimalPlaces}
                />
                <div className="w-full min-h-0 flex-1">
                    {renderMode()}
                </div>
            </main>
            <footer className="w-full shrink-0 text-center text-[10px] leading-none text-gray-600">
                <p>{language === 'fa' ? 'ساخته‌شده با React، TypeScript و Tailwind CSS.' : 'Built with React, TypeScript, and Tailwind CSS.'}</p>
            </footer>
        </div>
        </I18nProvider>
    );
};

export default App;
