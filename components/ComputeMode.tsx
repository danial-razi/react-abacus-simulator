import React, { useEffect, useState } from 'react';
import type { AbacusType } from '../types';
import { useAbacus } from '../hooks/useAbacus';
import { useI18n } from '../i18n';
import Abacus from './Abacus';
import { playButtonClickSound, playClearSound } from '../utils/audio';

interface ComputeModeProps {
    abacusType: AbacusType;
    numRods: number;
    decimalPlaces: number;
}

type Operator = '+' | '-' | '×' | '÷';

const ComputeMode: React.FC<ComputeModeProps> = ({ abacusType, numRods, decimalPlaces }) => {
    const { language, t } = useI18n();
    const [operand, setOperand] = useState('1');
    const [operator, setOperator] = useState<Operator>('+');
    const [error, setError] = useState<string | null>(null);
    const {
        rods, value, setValue, clear, config, handleUpperBeadClick, handleLowerBeadClick,
        setUpperBeadActive, setLowerBeadActive, undo, redo, canUndo, canRedo,
    } = useAbacus(abacusType, numRods, decimalPlaces);

    useEffect(() => {
        const handleShortcut = (event: KeyboardEvent) => {
            if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'z') return;
            event.preventDefault();
            if (event.shiftKey) redo();
            else undo();
        };
        window.addEventListener('keydown', handleShortcut);
        return () => window.removeEventListener('keydown', handleShortcut);
    }, [redo, undo]);

    const handleClear = () => {
        playClearSound();
        setError(null);
        clear();
    };

    const calculate = (event: React.FormEvent) => {
        event.preventDefault();
        const amount = Number(operand);
        if (!Number.isFinite(amount)) return;

        let result = value;
        if (operator === '+') result += amount;
        if (operator === '-') result -= amount;
        if (operator === '×') result *= amount;
        if (operator === '÷') {
            if (amount === 0) {
                setError(t('divideByZero'));
                return;
            }
            result /= amount;
        }

        if (result < 0) {
            setError(t('negativeResult'));
            return;
        }

        const maxValue = (10 ** numRods - 1) / 10 ** decimalPlaces;
        if (result > maxValue) {
            result = maxValue;
            setError(t('resultClamped'));
        } else {
            setError(null);
        }
        playButtonClickSound();
        setValue(result);
    };

    const formattedValue = value.toLocaleString(language === 'fa' ? 'fa-IR' : 'en-US', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    });

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="w-full max-w-xl text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700 shadow-md">
                <p className="text-gray-400 text-sm mb-1">{t('currentValue')}</p>
                <p aria-live="polite" className="text-4xl lg:text-5xl font-mono font-bold text-cyan-400 tracking-widest break-all" dir="ltr">
                    {formattedValue}
                </p>
            </div>

            <form onSubmit={calculate} className="w-full max-w-xl rounded-lg border border-gray-700 bg-gray-800/50 p-4">
                <h2 className="mb-3 font-semibold text-gray-200">{t('arithmetic')}</h2>
                <div className="grid grid-cols-[auto_1fr_auto] gap-2">
                    <select aria-label={t('arithmetic')} value={operator} onChange={(event) => setOperator(event.target.value as Operator)} className="rounded-lg bg-gray-900 px-4 py-3 text-xl text-cyan-300">
                        {(['+', '-', '×', '÷'] as const).map((item) => <option key={item}>{item}</option>)}
                    </select>
                    <input aria-label={t('operand')} inputMode="decimal" value={operand} onChange={(event) => setOperand(event.target.value.replace(/[^0-9.]/g, ''))} className="min-w-0 rounded-lg border border-gray-600 bg-gray-900 px-3 py-3 font-mono text-gray-100 focus:border-cyan-500 focus:outline-none" dir="ltr" />
                    <button className="rounded-lg bg-cyan-600 px-4 py-3 font-semibold text-white hover:bg-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-300">{t('apply')}</button>
                </div>
                {error && <p role="alert" className="mt-3 text-sm text-amber-300">{error}</p>}
            </form>

            <Abacus rods={rods} config={config} decimalPlaces={decimalPlaces}
                handleUpperBeadClick={handleUpperBeadClick} handleLowerBeadClick={handleLowerBeadClick}
                setUpperBeadActive={setUpperBeadActive} setLowerBeadActive={setLowerBeadActive} />

            <div className="flex flex-wrap justify-center gap-3 mt-4">
                <button onClick={undo} disabled={!canUndo} className="px-5 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-cyan-400">{t('undo')}</button>
                <button onClick={redo} disabled={!canRedo} className="px-5 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-cyan-400">{t('redo')}</button>
                <button onClick={handleClear} className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 transition-colors">{t('clear')}</button>
            </div>
        </div>
    );
};

export default ComputeMode;
