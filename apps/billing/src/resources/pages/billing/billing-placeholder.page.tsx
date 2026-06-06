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
import { BillingSectionNav } from './components/billing-section-nav.component';

export function BillingPlaceholderPage({
  sectionId,
}: {
  sectionId: 'charges' | 'plans';
}) {
  const remote = REMOTE_ROUTE_META.billing;
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
        <BillingSectionNav />
      </header>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <Card className="min-w-0 border-border/70">
          <CardHeader>
            <CardTitle>Placeholder surface</CardTitle>
            <CardDescription>
              This route exists to validate nested remote routing, internal page
              composition and shared shell navigation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>
              The final domain rules for {section?.label.toLowerCase()} can be
              added later without changing the federation boundary.
            </p>
            <p>
              Zustand remains global only for shell concerns, while this route
              keeps its future state local to billing.
            </p>
          </CardContent>
        </Card>

        <Card className="min-w-0 border-border/70 bg-accent/40">
          <CardHeader>
            <CardTitle>Future expansion area</CardTitle>
            <CardDescription>
              Reserved for billing-specific workflows, tables and internal
              orchestration once domain rules are defined.
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
