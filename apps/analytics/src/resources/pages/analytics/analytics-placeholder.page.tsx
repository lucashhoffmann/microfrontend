import {
  createShellPageContext,
  REMOTE_ROUTE_META,
} from '@modular-payments-console/config';
import { useSyncShellPageContext } from '@modular-payments-console/event-bus';
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  getRemoteBadgeVariant,
} from '@modular-payments-console/ui';
import { AnalyticsSectionNav } from './components/analytics-section-nav.component';

export function AnalyticsPlaceholderPage({
  sectionId,
}: {
  sectionId: 'reports' | 'insights';
}) {
  const remote = REMOTE_ROUTE_META.analytics;
  const section = remote.sections.find(
    (currentSection) => currentSection.id === sectionId,
  );

  useSyncShellPageContext(createShellPageContext(remote.id, sectionId));

  return (
    <section className="min-w-0 space-y-6">
      <header className="space-y-3">
        <Badge variant={getRemoteBadgeVariant(remote.id)}>{remote.label}</Badge>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            {section?.label ?? remote.label}
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            {section?.description}
          </p>
        </div>
        <AnalyticsSectionNav />
      </header>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <Card className="min-w-0 border-border/70">
          <CardHeader>
            <CardTitle>Placeholder surface</CardTitle>
            <CardDescription>
              This route is intentionally lightweight so the remote can evolve
              its future reporting UX without changing the shell contract.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>
              Future analytics filters, charts and insight panels will stay
              isolated to the remote while reusing the shared shell framing.
            </p>
            <p>
              The current page validates nested navigation, theming and
              remote-local composition only.
            </p>
          </CardContent>
        </Card>

        <Card className="min-w-0 border-border/70 bg-accent/40">
          <CardHeader>
            <CardTitle>Future expansion area</CardTitle>
            <CardDescription>
              Reserved for analytics-specific widgets, report builders and
              insight detail flows once the domain rules are defined.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Section path: {section?.path}</p>
            <p>Remote base path: {remote.basePath}</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
