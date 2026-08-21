import React, { useEffect, useState } from 'react';
import type { AbacusType } from '../types';
import { useAbacus } from '../hooks/useAbacus';
import { useI18n } from '../i18n';
import Abacus from './Abacus';

interface ConvertModeProps {
    abacusType: AbacusType;
    numRods: number;
    decimalPlaces: number;
}

const ConvertMode: React.FC<ConvertModeProps> = ({ abacusType, numRods, decimalPlaces }) => {
    const { t } = useI18n();
    const { rods, setValue, config } = useAbacus(abacusType, numRods, decimalPlaces);
    const [inputValue, setInputValue] = useState(decimalPlaces > 0 ? '123.45' : '12345');

    useEffect(() => {
        const parsed = Number(inputValue);
        setValue(Number.isFinite(parsed) ? parsed : 0);
    }, [inputValue, setValue]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cleaned = event.target.value.replace(',', '.').replace(/[^0-9.]/g, '');
        const [integer = '', ...fractionParts] = cleaned.split('.');
        const integerLimit = Math.max(1, numRods - decimalPlaces);
        const limitedInteger = integer.slice(0, integerLimit);
        if (decimalPlaces === 0 || fractionParts.length === 0) {
            setInputValue(limitedInteger);
            return;
        }
        setInputValue(`${limitedInteger}.${fractionParts.join('').slice(0, decimalPlaces)}`);
    };

    return (
        <div className="mode-layout h-full min-h-0 grid grid-rows-[auto_minmax(0,1fr)] gap-2 lg:grid-cols-[19rem_minmax(0,1fr)] lg:grid-rows-1">
            <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700 shadow-md lg:self-center">
                <label htmlFor="number-input" className="text-gray-400 text-xs mb-1 block">{t('enterNumber')}</label>
                <input id="number-input" type="text" inputMode="decimal" value={inputValue} onChange={handleChange}
                    className="w-full bg-gray-900/70 border border-gray-600 rounded-lg text-center text-2xl p-2 font-mono text-cyan-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none" dir="ltr" />
            </div>
            <div className="min-h-0"><Abacus rods={rods} config={config} decimalPlaces={decimalPlaces}
                handleUpperBeadClick={() => {}} handleLowerBeadClick={() => {}} interactive={false} /></div>
        </div>
    );
};

export default ConvertMode;
