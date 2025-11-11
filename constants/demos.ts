import { Demo } from '@/types/demo';

/**
 * List of all available demos in the playground
 * Add new demos here to automatically display them on the home screen
 */
export const DEMOS: Demo[] = [
  {
    id: 'button-tap',
    title: 'Button Tap',
    description: 'Validate button click functionality',
    icon: 'hand-left-outline',
    route: '/demos/button-tap',
  },
  {
    id: 'audio-validation',
    title: 'Audio Validation',
    description: 'Validate audio playback functionality',
    icon: 'volume-high-outline',
    route: '/demos/audio-validation',
  },
];
