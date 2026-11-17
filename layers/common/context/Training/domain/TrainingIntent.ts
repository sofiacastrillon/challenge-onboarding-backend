export const TRAINING_INTENTS = ['ventas', 'soporte', 'cancelacion'] as const;

export type TrainingIntent = (typeof TRAINING_INTENTS)[number];
