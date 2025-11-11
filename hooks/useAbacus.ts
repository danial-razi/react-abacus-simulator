
import { useState, useCallback, useMemo, useEffect } from 'react';
import { AbacusType, RodState, AbacusConfig } from '../types';

const ABACUS_CONFIGS: Record<AbacusType, AbacusConfig> = {
    [AbacusType.JAPANESE]: { upperBeads: 1, lowerBeads: 4 },
    [AbacusType.CHINESE]: { upperBeads: 2, lowerBeads: 5 },
};

export const useAbacus = (abacusType: AbacusType, numRods: number) => {
    const config = ABACUS_CONFIGS[abacusType];

    const getInitialRodState = useCallback((): RodState => ({
        upperBeads: Array(config.upperBeads).fill(false),
        lowerBeadsActive: 0,
    }), [config]);

    const getInitialState = useCallback(() => Array(numRods).fill(null).map(getInitialRodState), [numRods, getInitialRodState]);

    const [rods, setRods] = useState<RodState[]>(getInitialState());

    useEffect(() => {
        setRods(getInitialState());
    }, [abacusType, numRods, getInitialState]);

    const value = useMemo(() => {
        return rods.reduce((acc, rod, index) => {
            const upperValue = rod.upperBeads.filter(Boolean).length * 5;
            const lowerValue = rod.lowerBeadsActive;
            const rodValue = upperValue + lowerValue;
            return acc + rodValue * Math.pow(10, rods.length - 1 - index);
        }, 0);
    }, [rods]);

    const clear = useCallback(() => {
        setRods(getInitialState());
    }, [getInitialState]);

    const setValue = useCallback((num: number) => {
        const newRods: RodState[] = getInitialState();
        let numStr = Math.floor(num).toString();
        
        if (numStr.length > numRods) {
            numStr = numStr.slice(numStr.length - numRods);
        }

        const startIndex = numRods - numStr.length;

        for (let i = 0; i < numStr.length; i++) {
            let digit = parseInt(numStr[i], 10);
            const rodIndex = startIndex + i;
            
            const newRod: RodState = {
                upperBeads: Array(config.upperBeads).fill(false),
                lowerBeadsActive: 0,
            };

            if (config.upperBeads === 2) { // Chinese suanpan
                 if (digit >= 10) {
                    newRod.upperBeads[0] = true;
                    newRod.upperBeads[1] = true;
                    digit -= 10;
                } else if (digit >= 5) {
                    newRod.upperBeads[0] = true;
                    digit -= 5;
                }
            } else { // Japanese soroban
                if (digit >= 5) {
                    newRod.upperBeads[0] = true;
                    digit -= 5;
                }
            }
            newRod.lowerBeadsActive = digit;
            newRods[rodIndex] = newRod;
        }
        setRods(newRods);

    }, [config, numRods, getInitialState]);

    const handleUpperBeadClick = useCallback((rodIndex: number, beadIndex: number) => {
        setRods(prevRods => {
            const newRods = [...prevRods];
            const rod = { ...newRods[rodIndex] };
            rod.upperBeads = [...rod.upperBeads];
            rod.upperBeads[beadIndex] = !rod.upperBeads[beadIndex];
            newRods[rodIndex] = rod;
            return newRods;
        });
    }, []);

    const handleLowerBeadClick = useCallback((rodIndex: number, beadIndex: number) => {
        setRods(prevRods => {
            const newRods = [...prevRods];
            const rod = newRods[rodIndex];
            const clickedBeadIsActive = beadIndex < rod.lowerBeadsActive;
            
            if (clickedBeadIsActive) {
                newRods[rodIndex] = { ...rod, lowerBeadsActive: beadIndex };
            } else {
                newRods[rodIndex] = { ...rod, lowerBeadsActive: beadIndex + 1 };
            }
            return newRods;
        });
    }, []);

    return { rods, value, setValue, clear, config, handleUpperBeadClick, handleLowerBeadClick };
};
