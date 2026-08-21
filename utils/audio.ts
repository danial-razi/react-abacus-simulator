// A simple audio utility to generate sounds using the Web Audio API.
// This avoids needing to host and load audio files.

let audioContext: AudioContext | null = null;
let audioEnabled = true;

export const setAudioEnabled = (enabled: boolean) => {
    audioEnabled = enabled;
};

const getAudioContext = (): AudioContext | null => {
    // Return null during server-side rendering
    if (typeof window === 'undefined') return null;

    if (!audioContext) {
        try {
            const AudioContextClass = window.AudioContext || (window as Window & {
                webkitAudioContext?: typeof AudioContext;
            }).webkitAudioContext;
            if (!AudioContextClass) return null;
            audioContext = new AudioContextClass();
        } catch {
            console.error("Web Audio API is not supported in this browser");
            return null;
        }
    }
    return audioContext;
};

const playSound = (type: OscillatorType, frequency: number, duration: number, volume: number, rampTo: number = 0.0001, rampTime: number = duration) => {
    if (!audioEnabled) return;
    const ctx = getAudioContext();
    // Resume context if it's suspended (autoplay policies)
    if (ctx?.state === 'suspended') {
        ctx.resume();
    }
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(rampTo, ctx.currentTime + rampTime);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
};

export const playBeadSound = () => {
    playSound('sine', 880, 0.1, 0.2); // Sharp, high-pitched click
};

export const playButtonClickSound = () => {
    playSound('triangle', 440, 0.15, 0.15); // Softer, standard click
};

export const playClearSound = () => {
    if (!audioEnabled) return;
    const ctx = getAudioContext();
    if (ctx?.state === 'suspended') {
        ctx.resume();
    }
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
};

export const playModeSwitchSound = () => {
    if (!audioEnabled) return;
    const ctx = getAudioContext();
    if (ctx?.state === 'suspended') {
        ctx.resume();
    }
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(300, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
};
