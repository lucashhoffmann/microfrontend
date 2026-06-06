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
import { WalletSectionNav } from './components/wallet-section-nav.component';

export function WalletPlaceholderPage({
  sectionId,
}: {
  sectionId: 'balance' | 'transfers';
}) {
  const remote = REMOTE_ROUTE_META.wallet;
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
        <WalletSectionNav />
      </header>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <Card className="min-w-0 border-border/70">
          <CardHeader>
            <CardTitle>Placeholder surface</CardTitle>
            <CardDescription>
              This route keeps the navigation real while the wallet domain rules
              and state model are still being defined.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>
              Future treasury widgets, payout tables and filters will stay
              internal to wallet without leaking state back into the shell.
            </p>
            <p>
              The shared cache and shell layout are already in place for that
              future evolution.
            </p>
          </CardContent>
        </Card>

        <Card className="min-w-0 border-border/70 bg-accent/40">
          <CardHeader>
            <CardTitle>Future expansion area</CardTitle>
            <CardDescription>
              Reserved for wallet-specific controls, detail panels and
              operational widgets once the real product flow is defined.
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
