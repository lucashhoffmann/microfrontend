import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@modular-payments-console/ui';

interface FederatedRemoteBoundaryProps {
  children: ReactNode;
  remoteLabel: string;
  resetKey: string;
}

interface FederatedRemoteBoundaryState {
  hasError: boolean;
}

export class FederatedRemoteBoundary extends Component<
  FederatedRemoteBoundaryProps,
  FederatedRemoteBoundaryState
> {
  state: FederatedRemoteBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: FederatedRemoteBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="flex min-h-[calc(100svh-10rem)] items-center justify-center px-4 py-10">
        <Card className="w-full max-w-xl border-border/80 shadow-sm">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="size-5" />
              <span className="text-sm font-medium uppercase tracking-[0.16em]">
                Federated remote fallback
              </span>
            </div>
            <CardTitle>
              {this.props.remoteLabel} did not load correctly
            </CardTitle>
            <CardDescription>
              The shell stayed online, but this remote failed during Module
              Federation composition. That keeps the host resilient while teams
              troubleshoot the affected domain independently.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="sm:w-auto"
              onClick={() => window.location.reload()}
              type="button"
            >
              <RefreshCw />
              Reload shell
            </Button>
            <p className="text-sm leading-6 text-muted-foreground">
              In production, this is the place to plug retry telemetry, remote
              health checks or a dedicated support flow.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
}
