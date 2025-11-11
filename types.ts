
export enum AbacusType {
    JAPANESE = 'japanese',
    CHINESE = 'chinese',
}

export enum Mode {
    COMPUTE = 'compute',
    TUTORIAL = 'tutorial',
    CONVERT = 'convert',
}

export interface RodState {
    upperBeads: boolean[];
    lowerBeadsActive: number;
}

export interface AbacusConfig {
    upperBeads: number;
    lowerBeads: number;
}
