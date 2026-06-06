import {
  API_BASE_URL,
  APP_NAME,
  AUTH_ROUTES,
  createShellPageContext,
  DEFAULT_SHELL_PAGE_CONTEXT,
  PRIVATE_HOME_ROUTE,
  REMOTE_ROUTE_META,
  SHELL_NAV_GROUPS,
} from './config';

describe('config', () => {
  it('exports the shell and remote navigation defaults', () => {
    expect(APP_NAME).toBe('modular-payments-console');
    expect(API_BASE_URL).toBe('http://localhost:3333/api');
    expect(
      REMOTE_ROUTE_META.billing.sections.map((section) => section.id),
    ).toEqual(['overview', 'charges', 'plans']);
    expect(SHELL_NAV_GROUPS[0].items.map((item) => item.id)).toEqual([
      'billing',
      'wallet',
      'analytics',
    ]);
    expect(AUTH_ROUTES.login).toBe('/auth/login');
    expect(PRIVATE_HOME_ROUTE).toBe('/billing/overview');
    expect(DEFAULT_SHELL_PAGE_CONTEXT.title).toBe('Secure shell workspace');
    expect(createShellPageContext('wallet', 'balance')).toEqual({
      remoteId: 'wallet',
      label: 'Wallet',
      title: 'Balance',
      description: 'A placeholder surface for balance details and snapshots.',
      breadcrumbs: ['Operations', 'Wallet', 'Balance'],
    });
  });
});
