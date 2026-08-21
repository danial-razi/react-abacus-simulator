
import React from 'react';
import type { RodState, AbacusConfig, AbacusHighlight } from '../types';
import Bead from './Bead';
import { useI18n } from '../i18n';

interface AbacusProps {
    rods: RodState[];
    config: AbacusConfig;
    handleUpperBeadClick: (rodIndex: number, beadIndex: number) => void;
    handleLowerBeadClick: (rodIndex: number, beadIndex: number) => void;
    setUpperBeadActive?: (rodIndex: number, beadIndex: number, active: boolean) => void;
    setLowerBeadActive?: (rodIndex: number, beadIndex: number, active: boolean) => void;
    highlights?: AbacusHighlight[];
    interactive?: boolean;
    decimalPlaces?: number;
}

type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

const Abacus: React.FC<AbacusProps> = ({
    rods,
    config,
    handleUpperBeadClick,
    handleLowerBeadClick,
    setUpperBeadActive,
    setLowerBeadActive,
    highlights = [],
    interactive = true,
    decimalPlaces = 0,
}) => {
    const { t } = useI18n();
    const numRods = rods.length;
    const framePadding = 20;
    const rodSpacing = 60;
    const beadRadius = 20;
    const beamHeight = 15;
    const rodStrokeWidth = 4;

    const totalUpperBeadsHeight = config.upperBeads * (beadRadius * 2 + 10);
    const totalLowerBeadsHeight = config.lowerBeads * (beadRadius * 2 + 10);
    
    const upperSectionHeight = totalUpperBeadsHeight + 20;
    const lowerSectionHeight = totalLowerBeadsHeight + 20;
    
    const svgHeight = upperSectionHeight + lowerSectionHeight + beamHeight + framePadding * 2;
    const svgWidth = (numRods - 1) * rodSpacing + framePadding * 2 + beadRadius * 2;
    
    const beamY = upperSectionHeight + framePadding;

    const beadId = (rodIndex: number, deck: 'upper' | 'lower', beadIndex: number) =>
        `abacus-bead-${rodIndex}-${deck}-${beadIndex}`;

    const navigate = (rodIndex: number, deck: 'upper' | 'lower', beadIndex: number, key: ArrowKey) => {
        let nextRod = rodIndex;
        let nextDeck = deck;
        let nextBead = beadIndex;

        if (key === 'ArrowLeft') nextRod = Math.max(0, rodIndex - 1);
        if (key === 'ArrowRight') nextRod = Math.min(rods.length - 1, rodIndex + 1);
        if (key === 'ArrowUp') {
            if (deck === 'lower' && beadIndex === 0) {
                nextDeck = 'upper';
                nextBead = 0;
            } else if (deck === 'lower') {
                nextBead = beadIndex - 1;
            } else {
                nextBead = Math.min(config.upperBeads - 1, beadIndex + 1);
            }
        }
        if (key === 'ArrowDown') {
            if (deck === 'upper' && beadIndex === 0) {
                nextDeck = 'lower';
                nextBead = 0;
            } else if (deck === 'upper') {
                nextBead = beadIndex - 1;
            } else {
                nextBead = Math.min(config.lowerBeads - 1, beadIndex + 1);
            }
        }

        document.getElementById(beadId(nextRod, nextDeck, nextBead))?.focus();
    };

    return (
        <div className="abacus-stage w-full h-full min-h-0 overflow-hidden p-1 sm:p-2 bg-gray-800 rounded-lg shadow-inner border border-gray-700 flex items-center justify-center">
            <svg
                role="group"
                aria-label={t('interactiveAbacus')}
                width="100%"
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                preserveAspectRatio="xMidYMid meet"
                className="block h-full max-h-full w-full touch-none"
            >
                <title>{`${t('interactiveAbacus')}. ${t('abacusHelp')}`}</title>
                <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#22d3ee" />
                    </filter>
                </defs>

                {/* Frame */}
                <rect aria-hidden="true" x="0" y="0" width={svgWidth} height={svgHeight} rx="15" fill="#4a3728" stroke="#382a1f" strokeWidth="4" />
                <rect aria-hidden="true" x={framePadding/2} y={framePadding/2} width={svgWidth-framePadding} height={svgHeight-framePadding} rx="10" fill="#6b5643" />
                
                {/* Beam */}
                <rect aria-hidden="true" x={framePadding/2} y={beamY - beamHeight/2} width={svgWidth-framePadding} height={beamHeight} fill="#382a1f" />
                
                {rods.map((rod, i) => {
                    const rodX = framePadding + beadRadius + i * rodSpacing;
                    const exponent = rods.length - i - 1 - decimalPlaces;
                    const isUnitMarker = exponent === 0;
                    const isGroupMarker = exponent !== 0 && exponent % 3 === 0;
                    const rodHighlight = highlights.find(h => h.rodIndex === i);

                    return (
                        <g key={i}>
                            {/* Rod */}
                            <line
                                x1={rodX} y1={framePadding}
                                x2={rodX} y2={svgHeight - framePadding}
                                stroke="#a08b7a" strokeWidth={rodStrokeWidth}
                            />
                            {(isUnitMarker || isGroupMarker) && (
                                <circle aria-hidden="true" cx={rodX} cy={beamY} r={isUnitMarker ? 5 : 3} fill={isUnitMarker ? '#22d3ee' : 'white'} />
                            )}
                            
                            {/* Upper Beads */}
                            {Array.from({ length: config.upperBeads }).map((_, j) => {
                                const isActive = j < rod.upperBeadsActive;
                                const y = isActive 
                                    ? beamY - beamHeight / 2 - beadRadius - 5 - j * (beadRadius * 2 + 10)
                                    : framePadding + beadRadius + 5 + (config.upperBeads - 1 - j) * (beadRadius * 2 + 10);
                                const isHighlighted = rodHighlight?.upperBeads?.includes(j) ?? false;
                                
                                return (
                                    <Bead
                                        key={`upper-${i}-${j}`}
                                        id={beadId(i, 'upper', j)}
                                        cx={rodX}
                                        cy={y}
                                        r={beadRadius}
                                        deck="upper"
                                        isActive={isActive}
                                        label={`${t('upperBead')} ${j + 1}، ${t('rod')} ${numRods - i}، ${t('value')} 5`}
                                        onToggle={() => handleUpperBeadClick(i, j)}
                                        onSetActive={(active) => setUpperBeadActive?.(i, j, active)}
                                        onNavigate={(key) => navigate(i, 'upper', j, key)}
                                        isHighlighted={isHighlighted}
                                        disabled={!interactive}
                                    />
                                );
                            })}

                            {/* Lower Beads */}
                             {Array.from({ length: config.lowerBeads }).map((_, j) => {
                                const beadIsActive = j < rod.lowerBeadsActive;
                                const y = beadIsActive
                                    ? beamY + beamHeight/2 + beadRadius + 5 + j * (beadRadius * 2 + 10)
                                    : svgHeight - framePadding - beadRadius - 5 - (config.lowerBeads - 1 - j) * (beadRadius * 2 + 10);
                                const isHighlighted = rodHighlight?.lowerBeads ? j < rodHighlight.lowerBeads : false;

                                return (
                                    <Bead
                                        key={`lower-${i}-${j}`}
                                        id={beadId(i, 'lower', j)}
                                        cx={rodX}
                                        cy={y}
                                        r={beadRadius}
                                        deck="lower"
                                        isActive={beadIsActive}
                                        label={`${t('lowerBead')} ${j + 1}، ${t('rod')} ${numRods - i}، ${t('value')} 1`}
                                        onToggle={() => handleLowerBeadClick(i, j)}
                                        onSetActive={(active) => setLowerBeadActive?.(i, j, active)}
                                        onNavigate={(key) => navigate(i, 'lower', j, key)}
                                        isHighlighted={isHighlighted}
                                        disabled={!interactive}
                                    />
                                );
                            })}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

export default Abacus;
