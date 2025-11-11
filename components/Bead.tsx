
import React from 'react';
import { playBeadSound } from '../utils/audio';

interface BeadProps {
    cx: number;
    cy: number;
    r: number;
    onClick: () => void;
    isHighlighted?: boolean;
}

const Bead: React.FC<BeadProps> = ({ cx, cy, r, onClick, isHighlighted = false }) => {
    const handleClick = () => {
        playBeadSound();
        onClick();
    };

    return (
        <g 
            onClick={handleClick} 
            className="cursor-pointer group"
            style={isHighlighted ? { filter: 'url(#glow)' } : undefined}
        >
            <ellipse
                cx={cx}
                cy={cy}
                rx={r}
                ry={r * 0.8}
                className={`stroke-2 transition-all duration-200 ${
                    isHighlighted
                        ? 'fill-cyan-400 stroke-cyan-200 group-hover:fill-cyan-300'
                        : 'fill-amber-600 stroke-amber-800 group-hover:fill-amber-500'
                }`}
            />
             <ellipse
                cx={cx}
                cy={cy}
                rx={r * 0.7}
                ry={r * 0.55}
                className={`opacity-50 ${
                    isHighlighted
                        ? 'fill-cyan-300 group-hover:fill-cyan-200'
                        : 'fill-amber-500 group-hover:fill-amber-400'
                }`}
            />
        </g>
    );
};

export default Bead;