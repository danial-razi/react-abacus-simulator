/** @vitest-environment jsdom */
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import Bead from './Bead';

vi.mock('../utils/audio', () => ({ playBeadSound: vi.fn() }));

const testGlobal = globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean };

beforeAll(() => { testGlobal.IS_REACT_ACT_ENVIRONMENT = true; });
afterAll(() => { testGlobal.IS_REACT_ACT_ENVIRONMENT = false; });

describe('Bead accessibility', () => {
    let container: HTMLDivElement;
    let root: ReturnType<typeof createRoot>;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.append(container);
        root = createRoot(container);
    });

    afterEach(() => {
        act(() => root.unmount());
        container.remove();
    });

    it('exposes its state and label to assistive technology', () => {
        act(() => root.render(
            <svg><Bead id="test-bead" cx={20} cy={20} r={10} deck="lower" isActive label="Lower bead"
                onToggle={() => {}} onSetActive={() => {}} onNavigate={() => {}} /></svg>,
        ));
        const bead = container.querySelector('#test-bead');
        expect(bead?.getAttribute('role')).toBe('button');
        expect(bead?.getAttribute('aria-label')).toBe('Lower bead');
        expect(bead?.getAttribute('aria-pressed')).toBe('true');
        expect(bead?.getAttribute('tabindex')).toBe('0');
    });

    it('moves with Space and supports arrow-key navigation', () => {
        const onToggle = vi.fn();
        const onNavigate = vi.fn();
        act(() => root.render(
            <svg><Bead id="test-bead" cx={20} cy={20} r={10} deck="lower" isActive={false} label="Lower bead"
                onToggle={onToggle} onSetActive={() => {}} onNavigate={onNavigate} /></svg>,
        ));
        const bead = container.querySelector('#test-bead')!;
        act(() => bead.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true })));
        act(() => bead.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })));
        expect(onToggle).toHaveBeenCalledOnce();
        expect(onNavigate).toHaveBeenCalledWith('ArrowRight');
    });
});
