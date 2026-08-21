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
        <div className="mode-layout h-full min-h-0 grid grid-rows-[auto_minmax(0,1fr)] gap-2 lg:grid-cols-[19rem_minmax(0,1fr)] lg:grid-rows-1">
            <aside className="grid grid-cols-[.7fr_1.3fr] gap-2 lg:flex lg:min-h-0 lg:flex-col">
                <div className="min-w-0 text-center p-2 bg-gray-800/50 rounded-lg border border-gray-700 shadow-md lg:py-4">
                    <p className="text-gray-400 text-xs mb-0.5">{t('currentValue')}</p>
                    <p aria-live="polite" className="text-2xl lg:text-4xl font-mono font-bold text-cyan-400 tracking-wider break-all" dir="ltr">{formattedValue}</p>
                </div>

                <form onSubmit={calculate} className="min-w-0 rounded-lg border border-gray-700 bg-gray-800/50 p-2 lg:p-3">
                    <h2 className="hidden mb-2 text-sm font-semibold text-gray-200 lg:block">{t('arithmetic')}</h2>
                    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-1.5">
                        <select aria-label={t('arithmetic')} value={operator} onChange={(event) => setOperator(event.target.value as Operator)} className="rounded-lg bg-gray-900 px-2 py-2 text-lg text-cyan-300">
                            {(['+', '-', '×', '÷'] as const).map((item) => <option key={item}>{item}</option>)}
                        </select>
                        <input aria-label={t('operand')} inputMode="decimal" value={operand} onChange={(event) => setOperand(event.target.value.replace(/[^0-9.]/g, ''))} className="min-w-0 rounded-lg border border-gray-600 bg-gray-900 px-2 py-2 font-mono text-gray-100 focus:border-cyan-500 focus:outline-none" dir="ltr" />
                        <button className="rounded-lg bg-cyan-600 px-2 py-2 text-xs font-semibold text-white hover:bg-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-300 lg:px-3">{t('apply')}</button>
                    </div>
                    {error && <p role="alert" className="mt-1 text-xs text-amber-300">{error}</p>}
                </form>

                <div className="col-span-2 flex justify-center gap-1.5 lg:flex-wrap">
                    <button onClick={undo} disabled={!canUndo} className="px-3 py-2 text-xs bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-cyan-400">{t('undo')}</button>
                    <button onClick={redo} disabled={!canRedo} className="px-3 py-2 text-xs bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-cyan-400">{t('redo')}</button>
                    <button onClick={handleClear} className="px-3 py-2 text-xs bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 transition-colors">{t('clear')}</button>
                </div>
            </aside>

            <div className="min-h-0">
                <Abacus rods={rods} config={config} decimalPlaces={decimalPlaces}
                    handleUpperBeadClick={handleUpperBeadClick} handleLowerBeadClick={handleLowerBeadClick}
                    setUpperBeadActive={setUpperBeadActive} setLowerBeadActive={setLowerBeadActive} />
            </div>
        </div>
    );
};

export default ComputeMode;
