'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { Bot, User, CornerDownLeft, Loader2, Send, Plus, Paperclip, X } from 'lucide-react';
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
        setSelectedFile(file);
      } else {
        alert('Only PDF and image files are allowed.');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ((!input.trim() && !selectedFile) || isPending) return;
    
    let content = input;
    if (selectedFile) {
        content = `File: ${selectedFile.name}\n\n${input}`;
    }

    const userMessage: Message = { role: 'user', content: content };
    setMessages((prev) => [...prev, userMessage]);
    
    startTransition(async () => {
      const formData = new FormData();
      formData.append('question', input);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const { answer } = await answerQuestionAction({ question: input, file: selectedFile || undefined });
      const assistantMessage: Message = { role: 'assistant', content: answer };
      setMessages((prev) => [...prev, assistantMessage]);
    });
    
    setInput('');
    setSelectedFile(null);
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
              <h1 className="font-headline text-2xl font-bold tracking-tight">
                Contract Q&A
              </h1>
              <p className="mt-4 max-w-lg text-muted-foreground">
                Ask anything about the document.
              </p>
              <div className="mt-6 w-full grid grid-cols-1 gap-3 text-left">
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
                    <p className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br />') }} />
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
      <div className="w-full bg-background/95 px-4 py-3 sm:px-6">
        {selectedFile && (
          <div className="mb-2 flex items-center justify-between rounded-full border bg-card p-2 pl-4 shadow-lg animate-fade-in-up">
            <div className="flex items-center gap-3">
              <Paperclip className="h-5 w-5 text-muted-foreground" />
              <div className="text-sm">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setSelectedFile(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="relative flex w-full items-center rounded-full border-2 border-border/50 bg-card shadow-lg"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="ml-2 h-10 w-10 shrink-0 rounded-full"
            onClick={() => fileInputRef.current?.click()}
          >
            <Plus className="h-5 w-5" />
            <span className="sr-only">Add file</span>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="application/pdf,image/*"
            onChange={handleFileChange}
          />
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your contract..."
            className="h-14 flex-1 border-none bg-transparent pr-12 text-base shadow-none focus-visible:ring-0"
            disabled={isPending}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full"
            disabled={isPending || (!input.trim() && !selectedFile)}
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
