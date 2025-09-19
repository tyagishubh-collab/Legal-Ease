'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import AppNav from '@/components/layout/app-nav';
import { Logo } from '@/components/layout/logo';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { ThemeToggle } from '../ui/theme-toggle';
import { Avatar, AvatarFallback } from '../ui/avatar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  
  const handleFileSelect = (file: File) => {
    // In a real app, you might navigate to the contract page
    // or start a global upload process.
    console.log('File selected in AppShell:', file.name);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex h-14 items-center gap-4 px-3.5">
              <Logo />
              <div className="flex-1" />
              <div className="md:hidden">
                <SidebarTrigger />
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <AppNav />
          </SidebarContent>
          <SidebarFooter className="border-t">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LogOut />
              <span className="group-data-[collapsible=icon]:hidden">
                Logout
              </span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-background px-4 lg:px-6">
            <div className="hidden md:block">
              <SidebarTrigger />
            </div>
            <div className="flex-1">
              {/* Optional: Add a search bar or other header content here */}
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
            </div>
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
