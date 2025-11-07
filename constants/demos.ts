import { Demo } from '@/types/demo';

/**
 * List of all available demos in the playground
 * Add new demos here to automatically display them on the home screen
 */
export const DEMOS: Demo[] = [
  {
    id: 'test-demo',
    title: 'Test Demo',
    description: 'A working demo to test navigation and layout',
    icon: 'flask-outline',
    route: '/demos/test-demo',
  },
];
