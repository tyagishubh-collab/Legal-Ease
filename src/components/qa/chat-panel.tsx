'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { Bot, User, CornerDownLeft, Loader2, Send } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { answerQuestionAction } from '@/lib/actions';
import { cn } from '@/lib/utils';
import { Logo } from '../layout/logo';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    startTransition(async () => {
      const { answer } = await answerQuestionAction({ question: input });
      const assistantMessage: Message = { role: 'assistant', content: answer };
      setMessages((prev) => [...prev, assistantMessage]);
    });
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="relative flex h-full flex-col">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 sm:p-6 lg:p-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-10 text-center animate-fade-in-slow">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-10 w-10 text-primary" />
              </div>
              <h1 className="font-headline text-3xl font-bold tracking-tight">
                Hello, how can I help?
              </h1>
              <p className="mt-4 max-w-lg text-muted-foreground">
                Ask me anything about your contract. You can start with questions like:
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  <div className="p-4 rounded-lg border bg-card hover:bg-muted/50 cursor-pointer" onClick={() => setInput('What are my key obligations?')}>
                      <h3 className="font-semibold text-sm">Key Obligations</h3>
                      <p className="text-xs text-muted-foreground mt-1">What are my key obligations under this agreement?</p>
                  </div>
                   <div className="p-4 rounded-lg border bg-card hover:bg-muted/50 cursor-pointer" onClick={() => setInput('Which clauses are high-risk?')}>
                      <h3 className="font-semibold text-sm">Risk Analysis</h3>
                      <p className="text-xs text-muted-foreground mt-1">Which clauses pose the highest risk to me?</p>
                  </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn('flex items-start gap-4 animate-fade-in-up', {
                    'justify-end': message.role === 'user',
                  })}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-9 w-9 border">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot size={20} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-2xl rounded-2xl px-5 py-3 shadow-sm',
                      {
                        'bg-blue-600 dark:bg-blue-500 text-white rounded-br-none': message.role === 'user',
                        'bg-card border rounded-bl-none': message.role === 'assistant',
                      }
                    )}
                  >
                    <p className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '&lt;br /&gt;') }} />
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-9 w-9 border">
                      <AvatarFallback>
                        <User size={20} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isPending && (
                <div className="flex items-start gap-4 animate-fade-in-up">
                  <Avatar className="h-9 w-9 border">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot size={20} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="max-w-xl rounded-2xl px-5 py-4 bg-card border rounded-bl-none flex items-center shadow-sm">
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="w-full bg-background/95 px-4 py-3 sm:px-6 md:absolute md:bottom-4 md:left-1/2 md:w-full md:max-w-3xl md:-translate-x-1/2 md:bg-transparent md:p-0">
        <form onSubmit={handleSubmit} className="relative">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your contract..."
            className="h-14 w-full rounded-full border-2 border-border/50 bg-card pr-14 shadow-lg"
            disabled={isPending}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full"
            disabled={isPending || !input.trim()}
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
