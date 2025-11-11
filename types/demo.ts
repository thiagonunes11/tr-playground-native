import { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

/**
 * Demo configuration interface
 */
export interface Demo {
  /** Unique identifier for the demo */
  id: string;
  
  /** Display title for the demo card */
  title: string;
  
  /** Brief description of what the demo does */
  description: string;
  
  /** Ionicons icon name for the demo card */
  icon: ComponentProps<typeof Ionicons>['name'];
  
  /** Route path for the demo (e.g., '/demos/api-validation') */
  route: string;
  
  /** Optional category for grouping demos */
  category?: string;
}
