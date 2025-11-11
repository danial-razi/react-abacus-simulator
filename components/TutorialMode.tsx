
import React, { useState, useEffect, useMemo } from 'react';
import { AbacusType } from '../types';
import { useAbacus } from '../hooks/useAbacus';
import Abacus from './Abacus';
import { playButtonClickSound } from '../utils/audio';

interface TutorialModeProps {
    abacusType: AbacusType;
    numRods: number;
}

const getTutorialSteps = (numRods: number) => [
    { 
        title: "Welcome to the Abacus!", 
        description: "Beads above the beam are 'heaven beads' (worth 5), below are 'earth beads' (worth 1). Active beads move towards the beam.", 
        number: 0,
        highlights: []
    },
    { 
        title: "Representing '3'", 
        description: "Count to 3 by pushing up three 'earth' beads on the units rod (far right). Each is worth 1.", 
        number: 3,
        highlights: [{ rodIndex: numRods - 1, lowerBeads: 3 }]
    },
    { 
        title: "Representing '5'", 
        description: "Represent 5 by moving one 'heaven' bead down. Heaven beads are worth 5.", 
        number: 5,
        highlights: [{ rodIndex: numRods - 1, upperBeads: [0] }]
    },
    { 
        title: "Representing '8'", 
        description: "Combine beads to make 8. One heaven bead (5) + three earth beads (3) = 8.", 
        number: 8,
        highlights: [{ rodIndex: numRods - 1, upperBeads: [0], lowerBeads: 3 }]
    },
    { 
        title: "Using the Tens Rod for '12'", 
        description: "For 12, activate '1' on the tens rod (second from right) and '2' on the units rod.", 
        number: 12,
        highlights: [
            { rodIndex: numRods - 2, lowerBeads: 1 },
            { rodIndex: numRods - 1, lowerBeads: 2 }
        ]
    },
    { 
        title: "Making '65'", 
        description: "To represent 65, form a '6' (5+1) on the tens rod and a '5' on the units rod.", 
        number: 65,
        highlights: [
            { rodIndex: numRods - 2, upperBeads: [0], lowerBeads: 1 },
            { rodIndex: numRods - 1, upperBeads: [0] }
        ]
    },
    { 
        title: "Complex Number '123'", 
        description: "Represent 123 using three rods. '1' for hundreds, '2' for tens, and '3' for units.", 
        number: 123,
        highlights: [
            { rodIndex: numRods - 3, lowerBeads: 1 },
            { rodIndex: numRods - 2, lowerBeads: 2 },
            { rodIndex: numRods - 1, lowerBeads: 3 }
        ]
    },
    { 
        title: "Practice Makes Perfect!", 
        description: "You've learned the basics! Switch to Compute mode to practice your new skills.", 
        number: 0,
        highlights: []
    },
];


const TutorialMode: React.FC<TutorialModeProps> = ({ abacusType, numRods }) => {
    const { rods, value, setValue, config } = useAbacus(abacusType, numRods);
    const [step, setStep] = useState(0);

    const tutorialSteps = useMemo(() => getTutorialSteps(numRods), [numRods]);

    useEffect(() => {
        setValue(tutorialSteps[step].number);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step, abacusType, tutorialSteps]);
    
    const currentStep = tutorialSteps[step];
    
    const goToNext = () => {
        if (step < tutorialSteps.length - 1) {
            playButtonClickSound();
            setStep(s => s + 1);
        }
    };
    const goToPrev = () => {
        if (step > 0) {
            playButtonClickSound();
            setStep(s => s - 1);
        }
    };

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="w-full max-w-2xl text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700 shadow-md">
                <h2 className="text-xl font-bold text-cyan-400 mb-2">{currentStep.title}</h2>
                <p className="text-gray-300">{currentStep.description}</p>
                 <p className="mt-4 text-3xl font-mono font-bold text-white tracking-widest">
                    {value.toLocaleString()}
                </p>
            </div>
            
            <Abacus 
                rods={rods} 
                config={config} 
                handleUpperBeadClick={()=>{}}
                handleLowerBeadClick={()=>{}}
                highlights={currentStep.highlights}
            />

            <div className="flex items-center gap-4 mt-4">
                <button
                    onClick={goToPrev}
                    disabled={step === 0}
                    className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-500 transition-colors"
                >
                    Previous
                </button>
                <span className="text-gray-400 font-mono">{step + 1} / {tutorialSteps.length}</span>
                <button
                    onClick={goToNext}
                    disabled={step === tutorialSteps.length - 1}
                    className="px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:bg-cyan-700 disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-500 transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default TutorialMode;