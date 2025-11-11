import React from 'react';
import { AbacusType, Mode } from '../types';
import { playModeSwitchSound } from '../utils/audio';

interface ControlsProps {
    mode: Mode;
    setMode: (mode: Mode) => void;
    abacusType: AbacusType;
    setAbacusType: (type: AbacusType) => void;
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


const Controls: React.FC<ControlsProps> = ({ mode, setMode, abacusType, setAbacusType }) => {
    
    const modeButtons = [
        { id: Mode.COMPUTE, label: 'Compute', icon: <CalculatorIcon /> },
        { id: Mode.TUTORIAL, label: 'Tutorial', icon: <BookOpenIcon /> },
        { id: Mode.CONVERT, label: 'Convert', icon: <ArrowRightLeftIcon /> },
    ];

    const typeButtons = [
        { id: AbacusType.JAPANESE, label: 'Japanese (Soroban)' },
        { id: AbacusType.CHINESE, label: 'Chinese (Suanpan)' },
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
        <div className="w-full max-w-5xl bg-gray-800/50 p-4 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Mode Selection */}
                <div className="flex-1 w-full sm:w-auto">
                    <span className="text-sm font-semibold text-gray-400 mb-2 block">Mode</span>
                    <div className="flex bg-gray-900/70 p-1 rounded-lg">
                        {modeButtons.map(button => (
                            <button
                                key={button.id}
                                onClick={() => handleModeChange(button.id)}
                                className={`flex-1 px-3 py-2 text-sm rounded-md transition-all duration-200 flex items-center justify-center gap-2 ${
                                    mode === button.id
                                        ? 'bg-cyan-500 text-white shadow'
                                        : 'text-gray-300 hover:bg-gray-700/50'
                                }`}
                            >
                                {button.icon}
                                <span className="hidden sm:inline">{button.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Abacus Type Selection */}
                <div className="flex-1 w-full sm:w-auto">
                    <span className="text-sm font-semibold text-gray-400 mb-2 block">Abacus Type</span>
                     <div className="flex bg-gray-900/70 p-1 rounded-lg">
                        {typeButtons.map(button => (
                            <button
                                key={button.id}
                                onClick={() => handleTypeChange(button.id)}
                                className={`flex-1 px-3 py-2 text-sm rounded-md transition-all duration-200 ${
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
            </div>
        </div>
    );
};

export default Controls;
