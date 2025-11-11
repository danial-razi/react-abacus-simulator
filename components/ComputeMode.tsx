import React from 'react';
import { AbacusType } from '../types';
import { useAbacus } from '../hooks/useAbacus';
import Abacus from './Abacus';
import { playClearSound } from '../utils/audio';

interface ComputeModeProps {
    abacusType: AbacusType;
    numRods: number;
}

const ComputeMode: React.FC<ComputeModeProps> = ({ abacusType, numRods }) => {
    const { rods, value, clear, config, handleUpperBeadClick, handleLowerBeadClick } = useAbacus(abacusType, numRods);

    const handleClear = () => {
        playClearSound();
        clear();
    };

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="w-full max-w-xl text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700 shadow-md">
                <p className="text-gray-400 text-sm mb-1">Current Value</p>
                <p className="text-4xl lg:text-5xl font-mono font-bold text-cyan-400 tracking-widest break-all">
                    {value.toLocaleString()}
                </p>
            </div>
            
            <Abacus 
                rods={rods} 
                config={config} 
                handleUpperBeadClick={handleUpperBeadClick}
                handleLowerBeadClick={handleLowerBeadClick}
            />

            <button
                onClick={handleClear}
                className="mt-4 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
            >
                Clear Abacus
            </button>
        </div>
    );
};

export default ComputeMode;
