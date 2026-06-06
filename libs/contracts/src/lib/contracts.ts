export type RemoteId = 'billing' | 'wallet' | 'analytics';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorTheme = 'default' | 'violet' | 'red' | 'green' | 'blue';

export type AppEventMap = Record<string, unknown>;

export interface ShellPageContext {
  label: string;
  title: string;
  description: string;
  breadcrumbs: string[];
  remoteId?: RemoteId;
}

export interface ShellEventMap extends AppEventMap {
  'shell:page-context': ShellPageContext;
}

export type ActivityStatus =
  | 'ready'
  | 'queued'
  | 'in-progress'
  | 'complete'
  | 'attention';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface DashboardStatCard {
  id: string;
  title: string;
  value: string;
  helper: string;
}

export interface DashboardActivityItem {
  id: string;
  title: string;
  summary: string;
  status: ActivityStatus;
}

export interface RemoteDashboardResponse {
  remoteId: RemoteId;
  title: string;
  description: string;
  stats: DashboardStatCard[];
  activity: DashboardActivityItem[];
}

export interface RemoteRouteSection {
  id: string;
  label: string;
  path: string;
  description: string;
}

export interface RemoteRouteMeta {
  id: RemoteId;
  label: string;
  basePath: string;
  defaultPath: string;
  dashboardPath: string;
  description: string;
  headline: string;
  sections: RemoteRouteSection[];
}

export interface ShellNavItem {
  id: string;
  label: string;
  path: string;
  iconKey: 'receipt-text' | 'wallet' | 'chart-column';
  description: string;
  remoteId?: RemoteId;
}

export interface ShellNavGroup {
  id: string;
  label: string;
  items: ShellNavItem[];
}
