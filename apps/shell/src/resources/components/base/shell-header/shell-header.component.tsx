import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShellPageContext } from '@modular-payments-console/contracts';
import { useAuthStore } from '@modular-payments-console/auth';
import { shellEventBus } from '@modular-payments-console/event-bus';
import {
  AUTH_ROUTES,
  REMOTE_ROUTE_META,
} from '@modular-payments-console/config';
import {
  Badge,
  Button,
  Separator,
  SidebarTrigger,
  ThemeModeToggle,
  getRemoteBadgeVariant,
} from '@modular-payments-console/ui';

const FALLBACK_SHELL_PAGE_CONTEXT: ShellPageContext = {
  label: 'Shell',
  title: 'Secure shell workspace',
  description:
    'Shared theme, shared cache and federated remotes orchestrated in one host.',
  breadcrumbs: ['Operations', 'Shell'],
};

function buildRoutePageContext(
  remoteId: keyof typeof REMOTE_ROUTE_META,
  sectionId: string,
): ShellPageContext {
  const remote = REMOTE_ROUTE_META[remoteId];
  const section =
    remote.sections.find((currentSection) => currentSection.id === sectionId) ??
    remote.sections[0];

  if (!section) {
    return FALLBACK_SHELL_PAGE_CONTEXT;
  }

  return {
    remoteId,
    label: remote.label,
    title: section.id === 'overview' ? remote.headline : section.label,
    description:
      section.id === 'overview' ? remote.description : section.description,
    breadcrumbs: ['Operations', remote.label, section.label],
  };
}

export function ShellHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [pageContext, setPageContext] = useState<ShellPageContext | null>(null);
  const routePageContext =
    Object.values(REMOTE_ROUTE_META)
      .flatMap((remote) =>
        remote.sections.map((section) => ({
          remoteId: remote.id,
          sectionId: section.id,
          path: section.path,
        })),
      )
      .find((entry) => location.pathname.startsWith(entry.path)) ?? null;
  const resolvedPageContext = {
    ...(routePageContext
      ? buildRoutePageContext(
          routePageContext.remoteId,
          routePageContext.sectionId,
        )
      : FALLBACK_SHELL_PAGE_CONTEXT),
    ...(pageContext ?? {}),
  };

  const handleLogout = () => {
    logout();
    navigate(AUTH_ROUTES.login, { replace: true });
  };

  useEffect(() => {
    return shellEventBus.subscribe('shell:page-context', (nextPageContext) => {
      if (nextPageContext) {
        setPageContext(nextPageContext);
      }
    });
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border/70 bg-background/95 px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <div className="flex min-w-0 items-center gap-2">
        <Badge
          variant={
            resolvedPageContext.remoteId
              ? getRemoteBadgeVariant(resolvedPageContext.remoteId)
              : 'soft'
          }
          className="shrink-0"
        >
          {resolvedPageContext.label}
        </Badge>
        <p className="truncate text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          {resolvedPageContext.breadcrumbs.join(' / ')}
        </p>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <ThemeModeToggle />
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:bg-red-500/10 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300"
          onClick={handleLogout}
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}
