import { useEffect } from 'react';
import {
  ShellEventMap,
  ShellPageContext,
} from '@modular-payments-console/contracts';
import { createEventBus } from './event-bus';

export const shellEventBus = createEventBus<ShellEventMap>();

export function publishShellPageContext(context: ShellPageContext) {
  shellEventBus.publish('shell:page-context', context);
}

export function useSyncShellPageContext(context: ShellPageContext) {
  useEffect(() => {
    publishShellPageContext(context);
  }, [
    context.description,
    context.label,
    context.remoteId,
    context.title,
    context.breadcrumbs.join('>'),
  ]);
}
