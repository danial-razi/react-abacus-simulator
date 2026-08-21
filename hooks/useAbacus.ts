
import { useState, useCallback, useMemo } from 'react';
import type { AbacusType, RodState } from '../types';
import {
    ABACUS_CONFIGS,
    createAbacusState,
    rodsToValue,
    setBeadActive,
    toggleBead,
    valueToRods,
} from '../domain/abacus';

export const useAbacus = (abacusType: AbacusType, numRods: number, decimalPlaces = 0) => {
    const config = ABACUS_CONFIGS[abacusType];

    const getInitialState = useCallback(() => createAbacusState(numRods), [numRods]);

    const [history, setHistory] = useState<{ past: RodState[][]; present: RodState[]; future: RodState[][] }>(() => ({
        past: [],
        present: getInitialState(),
        future: [],
    }));

    const commit = useCallback((update: (rods: RodState[]) => RodState[]) => {
        setHistory(current => {
            const next = update(current.present);
            if (next === current.present) return current;
            return {
                past: [...current.past.slice(-49), current.present],
                present: next,
                future: [],
            };
        });
    }, []);

    const rods = history.present;

    const value = useMemo(() => {
        return rodsToValue(rods, decimalPlaces);
    }, [decimalPlaces, rods]);

    const clear = useCallback(() => {
        commit(() => getInitialState());
    }, [commit, getInitialState]);

    const setValue = useCallback((num: number) => {
        commit(() => valueToRods(num, numRods, abacusType, decimalPlaces));
    }, [abacusType, commit, decimalPlaces, numRods]);

    const handleUpperBeadClick = useCallback((rodIndex: number, beadIndex: number) => {
        commit(prevRods => toggleBead(prevRods, rodIndex, 'upper', beadIndex));
    }, [commit]);

    const handleLowerBeadClick = useCallback((rodIndex: number, beadIndex: number) => {
        commit(prevRods => toggleBead(prevRods, rodIndex, 'lower', beadIndex));
    }, [commit]);

    const setUpperBeadActive = useCallback((rodIndex: number, beadIndex: number, active: boolean) => {
        commit(prevRods => setBeadActive(prevRods, rodIndex, 'upper', beadIndex, active));
    }, [commit]);

    const setLowerBeadActive = useCallback((rodIndex: number, beadIndex: number, active: boolean) => {
        commit(prevRods => setBeadActive(prevRods, rodIndex, 'lower', beadIndex, active));
    }, [commit]);

    const undo = useCallback(() => {
        setHistory(current => {
            const previous = current.past.at(-1);
            if (!previous) return current;
            return {
                past: current.past.slice(0, -1),
                present: previous,
                future: [current.present, ...current.future],
            };
        });
    }, []);

    const redo = useCallback(() => {
        setHistory(current => {
            const next = current.future[0];
            if (!next) return current;
            return {
                past: [...current.past, current.present],
                present: next,
                future: current.future.slice(1),
            };
        });
    }, []);

    return {
        rods,
        value,
        setValue,
        clear,
        config,
        handleUpperBeadClick,
        handleLowerBeadClick,
        setUpperBeadActive,
        setLowerBeadActive,
        undo,
        redo,
        canUndo: history.past.length > 0,
        canRedo: history.future.length > 0,
    };
};
