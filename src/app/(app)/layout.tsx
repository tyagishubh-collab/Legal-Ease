import AppShell from '@/components/layout/app-shell';
import type { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen w-screen flex">
        <AppShell>
            {children}
        </AppShell>
    </div>
  );
}
