import { ChartColumn, CreditCard, Wallet } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@modular-payments-console/auth';
import { APP_TITLE, SHELL_NAV_GROUPS } from '@modular-payments-console/config';
import {
  Avatar,
  AvatarFallback,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@modular-payments-console/ui';

const sidebarIcons = {
  'receipt-text': CreditCard,
  wallet: Wallet,
  'chart-column': ChartColumn,
} as const;

export function AppSidebar() {
  const location = useLocation();
  const user = useAuthStore((state) => state.session?.user ?? null);
  const userInitials =
    user?.name
      ?.split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? 'D';

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border/70">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center rounded-md text-sm font-semibold tracking-[0.12em]">
                <span>M</span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">{APP_TITLE}</span>
                <span className="truncate text-xs text-sidebar-foreground/65">
                  Enterprise shell
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {SHELL_NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.id}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => {
                const Icon = sidebarIcons[item.iconKey];
                const isActive = location.pathname.startsWith(
                  item.remoteId ? `/${item.remoteId}` : item.path,
                );

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className="font-medium"
                    >
                      <Link to={item.path}>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/70">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Avatar className="size-8 rounded-md">
                <AvatarFallback className="rounded-md bg-sidebar-accent text-sidebar-accent-foreground">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">
                  {user?.name ?? 'Demo Operator'}
                </span>
                <span className="truncate text-xs text-sidebar-foreground/65">
                  {user?.email ?? 'demo@modular-payments.local'}
                </span>
              </div>
              <SidebarMenuBadge className="bg-sidebar-primary/12 text-sidebar-primary group-data-[collapsible=icon]:hidden">
                Demo
              </SidebarMenuBadge>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
