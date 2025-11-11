import React, { useState, useMemo } from 'react';
import { AbacusType, Mode } from './types';
import Controls from './components/Controls';
import ComputeMode from './components/ComputeMode';
import TutorialMode from './components/TutorialMode';
import ConvertMode from './components/ConvertMode';

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
    const numRods = 13;

    const renderMode = () => {
        switch (mode) {
            case Mode.TUTORIAL:
                return <TutorialMode abacusType={abacusType} numRods={numRods} />;
            case Mode.CONVERT:
                return <ConvertMode abacusType={abacusType} numRods={numRods} />;
            case Mode.COMPUTE:
            default:
                return <ComputeMode abacusType={abacusType} numRods={numRods} />;
        }
    };

    const Header = useMemo(() => (
        <header className="w-full max-w-5xl mx-auto p-4 md:p-6 flex flex-col items-center text-center">
             <AbacusLogo className="h-16 w-16 mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 tracking-wider">
                React Abacus Simulator
            </h1>
            <p className="text-gray-400 mt-2">
                Learn and master the art of the abacus.
            </p>
        </header>
    ), []);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 font-sans">
            {Header}
            <main className="w-full flex-grow flex flex-col items-center">
                <Controls
                    mode={mode}
                    setMode={setMode}
                    abacusType={abacusType}
                    setAbacusType={setAbacusType}
                />
                <div className="w-full max-w-5xl mt-6">
                    {renderMode()}
                </div>
            </main>
            <footer className="w-full max-w-5xl mx-auto p-4 text-center text-gray-500 text-sm">
                <p>Built with React, TypeScript, and Tailwind CSS.</p>
            </footer>
        </div>
    );
};

export default App;