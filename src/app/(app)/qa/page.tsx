'use client';
import { ChatPanel } from '@/components/qa/chat-panel';

export default function QAPage() {
  return (
    <div className="h-[calc(100vh-theme(spacing.16))]">
        <ChatPanel />
    </div>
  );
}
