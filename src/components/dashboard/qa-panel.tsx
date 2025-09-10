'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import {
  Bot,
  User,
  CornerDownLeft,
  Loader2,
  PanelRightClose,
  MessageSquare,
} from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { answerQuestionAction } from '@/lib/actions';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function QAPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="h-full w-[350px] border-l bg-card"
    >
      <div className="flex h-full flex-col">
        <CardHeader className="flex-row items-center justify-between border-b p-4">
          <div>
            <CardTitle className="text-lg">AI Q&A Assistant</CardTitle>
            <CardDescription className="text-xs">
              Ask anything about your contract.
            </CardDescription>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon">
              <PanelRightClose className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent asChild>
          <>
            <ScrollArea className="flex-1" ref={scrollAreaRef}>
              <div className="p-4 space-y-6">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center pt-10 text-center">
                    <div className="rounded-full bg-primary/10 p-3">
                      <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="mt-4 font-headline text-lg font-semibold">
                      Ask Me Anything
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      e.g., &quot;Why is clause 6 risky?&quot;
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn('flex items-start gap-3', {
                        'justify-end': message.role === 'user',
                      })}
                    >
                      {message.role === 'assistant' && (
                        <Avatar className="h-8 w-8 border">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot size={16} />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn('max-w-xs rounded-lg px-3 py-2 text-sm', {
                          'bg-primary text-primary-foreground':
                            message.role === 'user',
                          'bg-muted': message.role === 'assistant',
                        })}
                      >
                        <p
                          className="prose prose-sm dark:prose-invert"
                          dangerouslySetInnerHTML={{
                            __html: message.content.replace(/\n/g, '<br />'),
                          }}
                        />
                      </div>
                      {message.role === 'user' && (
                        <Avatar className="h-8 w-8 border">
                          <AvatarFallback>
                            <User size={16} />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))
                )}
                {isPending && (
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 border">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot size={16} />
                      </AvatarFallback>
                    </Avatar>
                    <div className="max-w-xs rounded-lg px-3 py-2 bg-muted flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="border-t p-4">
              <form onSubmit={handleSubmit} className="relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="pr-10 h-10 text-sm"
                  disabled={isPending}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  disabled={isPending || !input.trim()}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CornerDownLeft className="h-4 w-4" />
                  )}
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </div>
          </>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
