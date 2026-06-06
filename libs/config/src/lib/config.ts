import {
  RemoteId,
  RemoteRouteMeta,
  ShellPageContext,
  ShellNavGroup,
  ShellNavItem,
} from '@modular-payments-console/contracts';

export const APP_NAME = 'modular-payments-console';
export const APP_TITLE = 'Modular Payments Console';

export const MOCK_API_PORT = 3333;
export const API_BASE_URL = `http://localhost:${MOCK_API_PORT}/api`;
export const AUTH_STORAGE_KEY = 'modular-payments-console.auth';
export const THEME_STORAGE_KEY = 'modular-payments-console.theme';
export const THEME_COLOR_STORAGE_KEY = 'modular-payments-console.theme-color';

export const AUTH_ROUTES = {
  login: '/auth/login',
  register: '/auth/register',
} as const;

export const PRIVATE_HOME_ROUTE = '/billing/overview';

export const DEMO_CREDENTIALS = {
  email: 'demo@modular-payments.local',
  password: 'Password123!',
} as const;

export const DEFAULT_SHELL_PAGE_CONTEXT: ShellPageContext = {
  label: 'Shell',
  title: 'Secure shell workspace',
  description:
    'Shared theme, shared cache and federated remotes orchestrated in one host.',
  breadcrumbs: ['Operations', 'Shell'],
};

export const REMOTE_ROUTE_META: Record<RemoteId, RemoteRouteMeta> = {
  billing: {
    id: 'billing',
    label: 'Billing',
    basePath: '/billing',
    defaultPath: '/billing/overview',
    dashboardPath: '/billing/dashboard',
    headline: 'Billing command center',
    description:
      'Monitor placeholder charging flows, subscriptions and collection health.',
    sections: [
      {
        id: 'overview',
        label: 'Overview',
        path: '/billing/overview',
        description:
          'Executive placeholder metrics and recent billing activity.',
      },
      {
        id: 'charges',
        label: 'Charges',
        path: '/billing/charges',
        description:
          'A placeholder list for future charge orchestration flows.',
      },
      {
        id: 'plans',
        label: 'Plans',
        path: '/billing/plans',
        description: 'A placeholder surface for plan and pricing composition.',
      },
    ],
  },
  wallet: {
    id: 'wallet',
    label: 'Wallet',
    basePath: '/wallet',
    defaultPath: '/wallet/overview',
    dashboardPath: '/wallet/dashboard',
    headline: 'Wallet operations hub',
    description:
      'Track placeholder balance, payouts and treasury movement in one place.',
    sections: [
      {
        id: 'overview',
        label: 'Overview',
        path: '/wallet/overview',
        description:
          'Placeholder metrics, balance visibility and payout context.',
      },
      {
        id: 'balance',
        label: 'Balance',
        path: '/wallet/balance',
        description: 'A placeholder surface for balance details and snapshots.',
      },
      {
        id: 'transfers',
        label: 'Transfers',
        path: '/wallet/transfers',
        description: 'A placeholder queue for transfers and payout operations.',
      },
    ],
  },
  analytics: {
    id: 'analytics',
    label: 'Analytics',
    basePath: '/analytics',
    defaultPath: '/analytics/overview',
    dashboardPath: '/analytics/dashboard',
    headline: 'Analytics insight center',
    description:
      'Validate reporting placeholders, signals and observation workflows.',
    sections: [
      {
        id: 'overview',
        label: 'Overview',
        path: '/analytics/overview',
        description:
          'High-level placeholder reporting cards and activity summaries.',
      },
      {
        id: 'reports',
        label: 'Reports',
        path: '/analytics/reports',
        description: 'A placeholder catalog for recurring and ad-hoc reports.',
      },
      {
        id: 'insights',
        label: 'Insights',
        path: '/analytics/insights',
        description: 'A placeholder workspace for derived insights and notes.',
      },
    ],
  },
};

export function createShellPageContext(
  remoteId: RemoteId,
  sectionId?: string,
): ShellPageContext {
  const remote = REMOTE_ROUTE_META[remoteId];
  const fallbackSection = remote.sections[0] ?? {
    id: 'overview',
    label: 'Overview',
    path: remote.defaultPath,
    description: remote.description,
  };
  const section =
    remote.sections.find((currentSection) => currentSection.id === sectionId) ??
    fallbackSection;

  return {
    remoteId,
    label: remote.label,
    title: section.id === 'overview' ? remote.headline : section.label,
    description:
      section.id === 'overview' ? remote.description : section.description,
    breadcrumbs: ['Operations', remote.label, section.label],
  };
}

const remoteSidebarItems: ShellNavItem[] = [
  {
    id: 'billing',
    label: REMOTE_ROUTE_META.billing.label,
    path: REMOTE_ROUTE_META.billing.defaultPath,
    iconKey: 'receipt-text',
    description: REMOTE_ROUTE_META.billing.description,
    remoteId: 'billing',
  },
  {
    id: 'wallet',
    label: REMOTE_ROUTE_META.wallet.label,
    path: REMOTE_ROUTE_META.wallet.defaultPath,
    iconKey: 'wallet',
    description: REMOTE_ROUTE_META.wallet.description,
    remoteId: 'wallet',
  },
  {
    id: 'analytics',
    label: REMOTE_ROUTE_META.analytics.label,
    path: REMOTE_ROUTE_META.analytics.defaultPath,
    iconKey: 'chart-column',
    description: REMOTE_ROUTE_META.analytics.description,
    remoteId: 'analytics',
  },
];

export const SHELL_NAV_GROUPS: ShellNavGroup[] = [
  {
    id: 'operations',
    label: 'Operations',
    items: remoteSidebarItems,
  },
];
