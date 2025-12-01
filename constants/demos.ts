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
    id: 'camera-validation',
    title: 'Camera Validation',
    description: 'Validate camera functionality and photo capture',
    icon: 'camera-outline',
    route: '/demos/camera-validation',
  },
  {
    id: 'checkbox-interaction',
    title: 'Checkbox Interaction',
    description: 'Validate checkbox selection and interaction functionality',
    icon: 'checkbox-outline',
    route: '/demos/checkbox-interaction',
  },
  {
    id: 'audio-validation',
    title: 'Audio Validation',
    description: 'Validate audio playback functionality',
    icon: 'volume-high-outline',
    route: '/demos/audio-validation',
  },
  {
    id: 'delete-elements',
    title: 'Delete Elements',
    description: 'Add and delete elements from a list',
    icon: 'trash-outline',
    route: '/demos/delete-elements',
  },
  {
    id: 'date-picker',
    title: 'Date Picker',
    description: 'Choose a date and see the value change',
    icon: 'calendar-outline',
    route: '/demos/date-picker',
  },
  {
    id: 'dynamic-login',
    title: 'Dynamic Login Text',
    description: 'Login form with random button text',
    icon: 'key-outline',
    route: '/demos/dynamic-login',
  },
  {
    id: 'swipe-horizontal',
    title: 'Swipe Horizontal',
    description: 'Test horizontal swipe gestures',
    icon: 'swap-horizontal-outline',
    route: '/demos/swipe-horizontal',
  },
  {
    id: 'swipe-vertical',
    title: 'Swipe Vertical',
    description: 'Test vertical swipe gestures',
    icon: 'swap-vertical-outline',
    route: '/demos/swipe-vertical',
  },
  {
    id: 'counter',
    title: 'Counter',
    description: 'Simple counter with increment/decrement',
    icon: 'calculator-outline',
    route: '/demos/counter',
  },
];
