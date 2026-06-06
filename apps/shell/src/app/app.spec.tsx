import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { clearSession } from '@modular-payments-console/auth';
import { AUTH_STORAGE_KEY } from '@modular-payments-console/config';
import App from './app';

describe('Shell App', () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearSession();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders the public auth shell when visiting the login route', async () => {
    render(
      <MemoryRouter initialEntries={['/auth/login']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole('heading', { name: /sign in to the shell/i }),
    ).toBeTruthy();
    expect(
      screen.getByText(/enterprise microfrontend workspace/i),
    ).toBeTruthy();
  });

  it('redirects the root route to the public auth flow when no session exists', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole('heading', { name: /sign in to the shell/i }),
    ).toBeTruthy();
  });

  it('redirects authenticated users away from the public auth flow', async () => {
    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        state: {
          token: 'mock-token:user_demo',
          session: {
            token: 'mock-token:user_demo',
            user: {
              id: 'user_demo',
              name: 'Demo Operator',
              email: 'demo@modular-payments.local',
            },
          },
        },
      }),
    );

    (global.fetch as jest.Mock).mockImplementation(
      (input: RequestInfo | URL) => {
        const url = input.toString();

        if (url.endsWith('/auth/me')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            headers: {
              get: () => 'application/json',
            },
            json: async () => ({
              token: 'mock-token:user_demo',
              user: {
                id: 'user_demo',
                name: 'Demo Operator',
                email: 'demo@modular-payments.local',
              },
            }),
          });
        }

        if (url.endsWith('/billing/dashboard')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            headers: {
              get: () => 'application/json',
            },
            json: async () => ({
              remoteId: 'billing',
              title: 'Billing overview',
              description: 'Billing placeholder dashboard',
              stats: [
                {
                  id: 'open-invoices',
                  title: 'Open invoices',
                  value: '128',
                  helper: '14 due this week',
                },
              ],
              activity: [
                {
                  id: 'billing-1',
                  title: 'Card retry campaign',
                  summary: 'Retry sequence scheduled for demo subscriptions.',
                  status: 'in-progress',
                },
              ],
            }),
          });
        }

        return Promise.reject(new Error(`Unhandled fetch mock for ${url}`));
      },
    );

    render(
      <MemoryRouter initialEntries={['/auth/login']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole('heading', { name: /billing command center/i }),
    ).toBeTruthy();
    expect(
      await screen.findByText('Operations / Billing / Overview'),
    ).toBeTruthy();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3333/api/auth/me',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-token:user_demo',
          }),
        }),
      );
    });
  });
});
