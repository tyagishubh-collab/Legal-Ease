import { ChatPanel } from '@/components/qa/chat-panel';

export default function QAPage() {
  return (
    <div className="flex h-[calc(100vh-theme(spacing.14))] flex-col">
      <div className="border-b p-4 sm:p-6 lg:p-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Contract Q&A
        </h1>
        <p className="mt-1 text-muted-foreground">
          Ask any question about your contract and get an AI-powered answer with clause references.
        </p>
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatPanel />
      </div>
    </div>
  );
}
