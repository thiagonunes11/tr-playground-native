import { Demo } from '@/types/demo';

/**
 * How a scenario reaches the credentials:
 * - `form`: email and password on one screen
 * - `two-step`: email first, then password on a second step
 * - `without-form`: the form stays hidden until a Login button is tapped
 */
export type LoginScenarioKind = 'form' | 'two-step' | 'without-form';

export interface LoginScenario {
  /** Matches the web playground slug, e.g. /loginScenarios/simple-login */
  slug: string;
  title: string;
  description: string;
  icon: Demo['icon'];
  kind: LoginScenarioKind;
  /** Text of the button that submits the credentials */
  submitLabel: string;
}

/** Mirrors https://tr-playground.netlify.app/loginScenarios, in the same order */
export const LOGIN_SCENARIOS: LoginScenario[] = [
  {
    slug: 'simple-login',
    title: 'Simple Login',
    description:
      'A plain email and password form. Enter the email, enter the password and click Login.',
    icon: 'log-in-outline',
    kind: 'form',
    submitLabel: 'Login',
  },
  {
    slug: 'two-step-login',
    title: '2-Step Login',
    description:
      'Email and password split across two steps. Enter the email and click Next, then confirm the email shown, enter the password and click Login.',
    icon: 'footsteps-outline',
    kind: 'two-step',
    submitLabel: 'Login',
  },
  {
    slug: 'simple-log-in',
    title: 'Simple Log In',
    description:
      'A plain email and password form. Enter the email, enter the password and click Log In.',
    icon: 'log-in-outline',
    kind: 'form',
    submitLabel: 'Log In',
  },
  {
    slug: 'simple-signin',
    title: 'Simple Signin',
    description:
      'A plain email and password form. Enter the email, enter the password and click Signin.',
    icon: 'log-in-outline',
    kind: 'form',
    submitLabel: 'Signin',
  },
  {
    slug: 'simple-sign-in',
    title: 'Simple Sign In',
    description:
      'A plain email and password form. Enter the email, enter the password and click Sign In.',
    icon: 'log-in-outline',
    kind: 'form',
    submitLabel: 'Sign In',
  },
  {
    slug: 'login-without-form',
    title: 'Login without form',
    description: 'A page without the Login form displayed by default.',
    icon: 'lock-closed-outline',
    kind: 'without-form',
    submitLabel: 'Login',
  },
];

/** Shapes a scenario as a Demo so the hub can reuse DemoCard */
export const loginScenarioAsDemo = (scenario: LoginScenario): Demo => ({
  id: `login-scenario-${scenario.slug}`,
  title: scenario.title,
  description: scenario.description,
  icon: scenario.icon,
  route: `/demos/login-scenarios/${scenario.slug}`,
});
