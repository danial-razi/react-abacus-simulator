import React, { useRef } from 'react';
import { playBeadSound } from '../utils/audio';
import type { Deck } from '../domain/abacus';

type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

interface BeadProps {
    id: string;
    cx: number;
    cy: number;
    r: number;
    deck: Deck;
    isActive: boolean;
    label: string;
    onToggle: () => void;
    onSetActive: (active: boolean) => void;
    onNavigate: (key: ArrowKey) => void;
    isHighlighted?: boolean;
    disabled?: boolean;
}

const Bead: React.FC<BeadProps> = ({
    id,
    cx,
    cy,
    r,
    deck,
    isActive,
    label,
    onToggle,
    onSetActive,
    onNavigate,
    isHighlighted = false,
    disabled = false,
}) => {
    const pointerStartY = useRef<number | null>(null);

    const runAction = (action: () => void) => {
        if (disabled) return;
        playBeadSound();
        action();
    };

    const handlePointerDown = (event: React.PointerEvent<SVGGElement>) => {
        if (disabled) return;
        pointerStartY.current = event.clientY;
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handlePointerUp = (event: React.PointerEvent<SVGGElement>) => {
        if (disabled || pointerStartY.current === null) return;
        const deltaY = event.clientY - pointerStartY.current;
        pointerStartY.current = null;

        if (Math.abs(deltaY) < 8) {
            runAction(onToggle);
            return;
        }

        const shouldActivate = deck === 'upper' ? deltaY > 0 : deltaY < 0;
        if (shouldActivate !== isActive) runAction(() => onSetActive(shouldActivate));
    };

    const handleKeyDown = (event: React.KeyboardEvent<SVGGElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            runAction(onToggle);
            return;
        }
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault();
            onNavigate(event.key as ArrowKey);
        }
    };

    return (
        <g
            id={id}
            role="button"
            aria-label={label}
            aria-pressed={isActive}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onKeyDown={handleKeyDown}
            className={`abacus-bead group ${disabled ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
            style={isHighlighted ? { filter: 'url(#glow)' } : undefined}
        >
            <ellipse
                cx={cx}
                cy={cy}
                rx={r}
                ry={r * 0.8}
                className={`bead-face stroke-2 transition-all duration-200 ${
                    isHighlighted
                        ? 'fill-cyan-400 stroke-cyan-200 group-hover:fill-cyan-300'
                        : 'fill-amber-600 stroke-amber-800 group-hover:fill-amber-500'
                }`}
            />
            <ellipse
                aria-hidden="true"
                cx={cx}
                cy={cy}
                rx={r * 0.7}
                ry={r * 0.55}
                className={`pointer-events-none opacity-50 ${
                    isHighlighted
                        ? 'fill-cyan-300 group-hover:fill-cyan-200'
                        : 'fill-amber-500 group-hover:fill-amber-400'
                }`}
            />
        </g>
    );
};

export default Bead;
