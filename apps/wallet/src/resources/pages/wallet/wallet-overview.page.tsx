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
  getActivityStatusBadgeVariant,
  getRemoteBadgeVariant,
  Skeleton,
} from '@modular-payments-console/ui';
import { useWalletDashboardUseCase } from '../../../app/modules/dashboard/use-wallet-dashboard.use-case';
import { WalletSectionNav } from './components/wallet-section-nav.component';

export function WalletOverviewPage() {
  const remote = REMOTE_ROUTE_META.wallet;
  const dashboard = useWalletDashboardUseCase();

  useSyncShellPageContext(createShellPageContext(remote.id, 'overview'));

  return (
    <section className="min-w-0 space-y-6">
      <header className="space-y-3">
        <Badge variant={getRemoteBadgeVariant(remote.id)}>{remote.label}</Badge>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            {remote.headline}
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            {remote.description}
          </p>
        </div>
        <WalletSectionNav />
      </header>

      <div className="grid min-w-0 gap-4 lg:grid-cols-3">
        {dashboard.isPending
          ? Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-36 rounded-md" />
            ))
          : dashboard.data?.stats.map((stat) => (
              <Card key={stat.id} className="min-w-0 border-border/70">
                <CardHeader>
                  <CardDescription>{stat.title}</CardDescription>
                  <CardTitle className="text-3xl">{stat.value}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {stat.helper}
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <Card className="min-w-0 border-border/70">
          <CardHeader>
            <CardTitle>
              {dashboard.data?.title ?? 'Loading wallet dashboard'}
            </CardTitle>
            <CardDescription>
              {dashboard.data?.description ??
                'Fetching placeholder wallet operations from the mock API.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboard.isPending ? (
              <>
                <Skeleton className="h-16 rounded-lg" />
                <Skeleton className="h-16 rounded-lg" />
              </>
            ) : (
              dashboard.data?.activity.map((item) => (
                <div
                  key={item.id}
                  className="rounded-md border border-border/60 bg-background/70 p-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="font-medium">{item.title}</p>
                    <Badge
                      variant={getActivityStatusBadgeVariant(item.status)}
                      className="capitalize"
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {item.summary}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="min-w-0 border-border/60 bg-accent/35">
          <CardHeader>
            <CardTitle>Shared session awareness</CardTitle>
            <CardDescription>
              Wallet reads the same auth token and query cache that the shell
              exposes to every protected remote.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>
              The balance views stay remote-owned while auth and theme stay
              shared.
            </p>
            <p>
              That split keeps wallet isolated without re-implementing global
              providers or route protection.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
