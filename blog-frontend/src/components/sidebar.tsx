import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useRouter } from 'next/navigation';
import { getUserRole } from '@/lib/auth';

export function AppSidebar() {
  const router = useRouter();
  const userRole = getUserRole();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <h2 className="text-2xl font-bold">Dashboard</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push('/dashboard')}>
                  Dashboard Home
                </SidebarMenuButton>
              </SidebarMenuItem>
              {userRole === 'admin' && (
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => router.push('/dashboard/manage-users')}>
                    Manage Users
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push('/dashboard/manage-articles')}>
                  Manage Articles
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push('/')}>
                  Back to Home
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="px-3 py-2">
            <p className="text-sm text-muted-foreground">Logged in as: {userRole}</p>
          </div>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
