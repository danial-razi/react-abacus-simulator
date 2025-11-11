
import React, { useState, useEffect } from 'react';
import { AbacusType } from '../types';
import { useAbacus } from '../hooks/useAbacus';
import Abacus from './Abacus';

interface ConvertModeProps {
    abacusType: AbacusType;
    numRods: number;
}

const ConvertMode: React.FC<ConvertModeProps> = ({ abacusType, numRods }) => {
    const { rods, setValue, config, handleUpperBeadClick, handleLowerBeadClick } = useAbacus(abacusType, numRods);
    const [inputValue, setInputValue] = useState('12345');

    useEffect(() => {
        const num = parseInt(inputValue, 10);
        if (!isNaN(num)) {
            setValue(num);
        } else {
            setValue(0);
        }
    }, [inputValue, setValue]);

    useEffect(() => {
        // Reset when switching abacus type
        const num = parseInt(inputValue, 10);
        if (!isNaN(num)) {
            setValue(num);
        } else {
            setValue(0);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [abacusType]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        setInputValue(val);
    };

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="w-full max-w-md text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700 shadow-md">
                <label htmlFor="number-input" className="text-gray-400 text-sm mb-2 block">Enter a number to convert</label>
                <input
                    id="number-input"
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    className="w-full bg-gray-900/70 border border-gray-600 rounded-lg text-center text-4xl p-3 font-mono text-cyan-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                    maxLength={numRods}
                />
            </div>
            
            <Abacus 
                rods={rods} 
                config={config} 
                handleUpperBeadClick={() => {}} // Non-interactive in this mode
                handleLowerBeadClick={() => {}} // Non-interactive in this mode
            />
        </div>
    );
};

export default ConvertMode;
