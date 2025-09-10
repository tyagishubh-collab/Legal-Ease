import AppShell from '@/components/layout/app-shell';
import type { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <div className="flex h-full">
        {children}
      </div>
    </AppShell>
  );
}
