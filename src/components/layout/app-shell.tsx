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
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';

export default function AppShell({ children }: { children: React.ReactNode }) {
  
  const handleFileSelect = (file: File) => {
    // In a real app, you might navigate to the contract page
    // or start a global upload process.
    console.log('File selected in AppShell:', file.name);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex h-14 items-center gap-4 px-3.5">
              <Logo />
              <div className="flex-1" />
              <SidebarTrigger className="md:hidden" />
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
          <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-background px-4">
            <SidebarTrigger className="hidden md:flex" />
            <div className="flex-1">
              {/* Optional: Add a search bar or other header content here */}
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/profile">
                <Avatar className="h-9 w-9 cursor-pointer">
                  <AvatarImage src="https://picsum.photos/seed/1/200" data-ai-hint="user avatar" />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
