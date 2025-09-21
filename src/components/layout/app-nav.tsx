'use client';

import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { LayoutDashboard, FileText, BotMessageSquare, User } from 'lucide-react';
import { useSidebar } from '../ui/sidebar';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/contract', label: 'Contract Analysis', icon: FileText },
  { href: '/qa', label: 'Contract Q&A', icon: BotMessageSquare },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function AppNav() {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(item.href)}
            tooltip={{
              content: item.label,
              hidden: state === 'expanded',
            }}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
