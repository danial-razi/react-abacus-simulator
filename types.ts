
export enum AbacusType {
    JAPANESE = 'japanese',
    CHINESE = 'chinese',
}

export enum Mode {
    COMPUTE = 'compute',
    TUTORIAL = 'tutorial',
    PRACTICE = 'practice',
    CONVERT = 'convert',
}

export type Language = 'en' | 'fa';

export interface RodState {
    upperBeadsActive: number;
    lowerBeadsActive: number;
}

export interface AbacusConfig {
    upperBeads: number;
    lowerBeads: number;
}

export interface AbacusHighlight {
    rodIndex: number;
    upperBeads?: number[];
    lowerBeads?: number;
}
