import { lazy, ReactNode, Suspense, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { createApiClient } from '@modular-payments-console/api-client';
import {
  authSelectors,
  subscribeToAuthSync,
  syncAuthStoreFromStorage,
  useAuthStore,
} from '@modular-payments-console/auth';
import {
  API_BASE_URL,
  AUTH_ROUTES,
  PRIVATE_HOME_ROUTE,
} from '@modular-payments-console/config';
import { AuthSession } from '@modular-payments-console/contracts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@modular-payments-console/ui';
import { PrivateShellLayout } from '../../resources/layouts/private-shell-layout/private-shell-layout.component';
import { PublicShellLayout } from '../../resources/layouts/public-shell-layout/public-shell-layout.component';
import { FederatedRemoteBoundary } from '../../resources/components/base/federated-remote-boundary/federated-remote-boundary.component';

const AuthRoutes = lazy(() => import('auth/Routes'));
const BillingRoutes = lazy(() => import('billing/Routes'));
const WalletRoutes = lazy(() => import('wallet/Routes'));
const AnalyticsRoutes = lazy(() => import('analytics/Routes'));

const apiClient = createApiClient({
  baseUrl: API_BASE_URL,
  getAccessToken: () => useAuthStore.getState().token,
});

function ShellLoadingState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <Card className="w-full max-w-lg border-border/80">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="size-3 rounded-full bg-primary animate-pulse" />
            Preparing shell composition and session state...
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function useSessionBootstrap() {
  const token = useAuthStore(authSelectors.token);
  const bootstrapStatus = useAuthStore(authSelectors.bootstrapStatus);
  const setBootstrapStatus = useAuthStore((state) => state.setBootstrapStatus);
  const hydrateSession = useAuthStore((state) => state.hydrateSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  const sessionQuery = useQuery({
    queryKey: ['auth-session', token],
    enabled: Boolean(token),
    retry: false,
    queryFn: () => apiClient.get<AuthSession>('/auth/me'),
  });

  useEffect(() => {
    syncAuthStoreFromStorage();

    return subscribeToAuthSync();
  }, []);

  useEffect(() => {
    if (!token) {
      setBootstrapStatus('anonymous');
    }
  }, [setBootstrapStatus, token]);

  useEffect(() => {
    if (token && sessionQuery.isPending) {
      setBootstrapStatus('loading');
    }
  }, [setBootstrapStatus, sessionQuery.isPending, token]);

  useEffect(() => {
    if (sessionQuery.data) {
      hydrateSession(sessionQuery.data);
    }
  }, [hydrateSession, sessionQuery.data]);

  useEffect(() => {
    if (sessionQuery.isError) {
      clearSession();
    }
  }, [clearSession, sessionQuery.isError]);

  if (!token) {
    return 'anonymous';
  }

  if (sessionQuery.isPending) {
    return 'loading';
  }

  return bootstrapStatus;
}

function ShellRootRedirect() {
  const bootstrapStatus = useSessionBootstrap();

  if (bootstrapStatus === 'loading') {
    return (
      <ShellLoadingState
        title="Restoring shell session"
        description="The host is checking the persisted mock session before composing private remotes."
      />
    );
  }

  return (
    <Navigate
      replace
      to={
        bootstrapStatus === 'authenticated'
          ? PRIVATE_HOME_ROUTE
          : AUTH_ROUTES.login
      }
    />
  );
}

function PublicRemoteFrame({ children }: { children: ReactNode }) {
  const bootstrapStatus = useSessionBootstrap();

  if (bootstrapStatus === 'loading') {
    return (
      <ShellLoadingState
        title="Validating current session"
        description="Hold on while the shell decides whether to keep you in the public auth flow."
      />
    );
  }

  if (bootstrapStatus === 'authenticated') {
    return <Navigate replace to={PRIVATE_HOME_ROUTE} />;
  }

  return <PublicShellLayout>{children}</PublicShellLayout>;
}

function ProtectedRemoteFrame({ children }: { children: ReactNode }) {
  const bootstrapStatus = useSessionBootstrap();

  if (bootstrapStatus === 'loading' || bootstrapStatus === 'idle') {
    return (
      <ShellLoadingState
        title="Loading protected workspace"
        description="The shell is preparing the shared session, theme and cache providers before rendering remotes."
      />
    );
  }

  if (bootstrapStatus !== 'authenticated') {
    return <Navigate replace to={AUTH_ROUTES.login} />;
  }

  return <PrivateShellLayout>{children}</PrivateShellLayout>;
}

function FederatedRemoteSlot({
  children,
  remoteLabel,
}: {
  children: ReactNode;
  remoteLabel: string;
}) {
  const location = useLocation();

  return (
    <FederatedRemoteBoundary
      remoteLabel={remoteLabel}
      resetKey={location.pathname}
    >
      {children}
    </FederatedRemoteBoundary>
  );
}

export function ShellRouter() {
  return (
    <Suspense
      fallback={
        <ShellLoadingState
          title="Loading federated route"
          description="A remote module is being composed into the shell."
        />
      }
    >
      <Routes>
        <Route path="/" element={<ShellRootRedirect />} />
        <Route
          path="/auth/*"
          element={
            <PublicRemoteFrame>
              <FederatedRemoteSlot remoteLabel="Auth remote">
                <AuthRoutes />
              </FederatedRemoteSlot>
            </PublicRemoteFrame>
          }
        />
        <Route
          path="/billing/*"
          element={
            <ProtectedRemoteFrame>
              <FederatedRemoteSlot remoteLabel="Billing remote">
                <BillingRoutes />
              </FederatedRemoteSlot>
            </ProtectedRemoteFrame>
          }
        />
        <Route
          path="/wallet/*"
          element={
            <ProtectedRemoteFrame>
              <FederatedRemoteSlot remoteLabel="Wallet remote">
                <WalletRoutes />
              </FederatedRemoteSlot>
            </ProtectedRemoteFrame>
          }
        />
        <Route
          path="/analytics/*"
          element={
            <ProtectedRemoteFrame>
              <FederatedRemoteSlot remoteLabel="Analytics remote">
                <AnalyticsRoutes />
              </FederatedRemoteSlot>
            </ProtectedRemoteFrame>
          }
        />
        <Route path="*" element={<ShellRootRedirect />} />
      </Routes>
    </Suspense>
  );
}
