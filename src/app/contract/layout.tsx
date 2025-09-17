import { Logo } from '@/components/layout/logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ContractLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
        <Logo />
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
