
import React from 'react';
import { RodState, AbacusConfig } from '../types';
import Bead from './Bead';

interface HighlightInfo {
    rodIndex: number;
    upperBeads?: number[];
    lowerBeads?: number;
}

interface AbacusProps {
    rods: RodState[];
    config: AbacusConfig;
    handleUpperBeadClick: (rodIndex: number, beadIndex: number) => void;
    handleLowerBeadClick: (rodIndex: number, beadIndex: number) => void;
    highlights?: HighlightInfo[];
}

const Abacus: React.FC<AbacusProps> = ({ rods, config, handleUpperBeadClick, handleLowerBeadClick, highlights = [] }) => {
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

    return (
        <div className="w-full overflow-x-auto p-4 bg-gray-800 rounded-lg shadow-inner border border-gray-700">
            <svg width="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="xMidYMid meet">
                <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#22d3ee" />
                    </filter>
                </defs>

                {/* Frame */}
                <rect x="0" y="0" width={svgWidth} height={svgHeight} rx="15" fill="#4a3728" stroke="#382a1f" strokeWidth="4" />
                <rect x={framePadding/2} y={framePadding/2} width={svgWidth-framePadding} height={svgHeight-framePadding} rx="10" fill="#6b5643" />
                
                {/* Beam */}
                <rect x={framePadding/2} y={beamY - beamHeight/2} width={svgWidth-framePadding} height={beamHeight} fill="#382a1f" />
                
                {rods.map((rod, i) => {
                    const rodX = framePadding + beadRadius + i * rodSpacing;
                    const isUnitMarker = (rods.length - i - 1) % 3 === 0 && i !== rods.length - 1;
                    const rodHighlight = highlights.find(h => h.rodIndex === i);

                    return (
                        <g key={i}>
                            {/* Rod */}
                            <line
                                x1={rodX} y1={framePadding}
                                x2={rodX} y2={svgHeight - framePadding}
                                stroke="#a08b7a" strokeWidth={rodStrokeWidth}
                            />
                            {isUnitMarker && (
                                <circle cx={rodX} cy={beamY} r="4" fill="white" />
                            )}
                            
                            {/* Upper Beads */}
                            {Array.from({ length: config.upperBeads }).map((_, j) => {
                                const isActive = rod.upperBeads[j];
                                const y = isActive 
                                    ? beamY - beamHeight / 2 - beadRadius - 5
                                    : framePadding + beadRadius + 5 + j * (beadRadius * 2 + 10);
                                const isHighlighted = isActive && (rodHighlight?.upperBeads?.includes(j) ?? false);
                                
                                return (
                                    <Bead
                                        key={`upper-${i}-${j}`}
                                        cx={rodX}
                                        cy={y}
                                        r={beadRadius}
                                        onClick={() => handleUpperBeadClick(i, j)}
                                        isHighlighted={isHighlighted}
                                    />
                                );
                            })}

                            {/* Lower Beads */}
                             {Array.from({ length: config.lowerBeads }).map((_, j) => {
                                const beadIsActive = j < rod.lowerBeadsActive;
                                const y = beadIsActive
                                    ? beamY + beamHeight/2 + beadRadius + 5 + j * (beadRadius * 2 + 10)
                                    : svgHeight - framePadding - beadRadius - 5 - (config.lowerBeads - 1 - j) * (beadRadius * 2 + 10);
                                const isHighlighted = beadIsActive && rodHighlight?.lowerBeads ? j < rodHighlight.lowerBeads : false;

                                return (
                                    <Bead
                                        key={`lower-${i}-${j}`}
                                        cx={rodX}
                                        cy={y}
                                        r={beadRadius}
                                        onClick={() => handleLowerBeadClick(i, j)}
                                        isHighlighted={isHighlighted}
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