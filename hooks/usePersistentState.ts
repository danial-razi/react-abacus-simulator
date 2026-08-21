import { useEffect, useState } from 'react';

export const usePersistentState = <T,>(key: string, initialValue: T) => {
    const [value, setValue] = useState<T>(() => {
        if (typeof window === 'undefined') return initialValue;
        try {
            const stored = window.localStorage.getItem(key);
            return stored === null ? initialValue : JSON.parse(stored) as T;
        } catch {
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // The app remains usable when storage is unavailable or full.
        }
    }, [key, value]);

    return [value, setValue] as const;
};
