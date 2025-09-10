import AppShell from '@/components/layout/app-shell';
import { QAPanel } from '@/components/dashboard/qa-panel';
import { Button } from '@/components/ui/button';
import { PanelRightClose } from 'lucide-react';
import type { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <div className="flex h-full">
        {children}
        <div className="hidden lg:block">
          <QAPanel />
        </div>
      </div>
    </AppShell>
  );
}
