'use client';
import { ShieldCheck } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useState } from 'react';
import type { MouseEvent } from 'react';

type Ripple = {
  key: number;
  x: number;
  y: number;
  size: number;
};

export function AnimatedHeroContent() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const onButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const newRipple: Ripple = {
      key: Date.now(),
      size: diameter,
      x: e.clientX - button.offsetLeft - radius,
      y: e.clientY - button.offsetTop - radius,
    };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(currentRipples => currentRipples.filter(r => r.key !== newRipple.key));
    }, 600);
  };

  return (
    <>
      <div className="group relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 transition-transform duration-300 hover:scale-110">
        <div className="absolute inset-0 rounded-full logo-glow" />
        <ShieldCheck className="h-10 w-10 text-primary transition-transform duration-300 group-hover:rotate-12" />
      </div>
      <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
        <span className="typing-effect inline-block">Welcome to <span className="text-primary">LegalEase</span></span>
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground fade-in-text">
        Your AI-powered legal assistant. Analyze documents, understand complex clauses, and assess risks with confidence.
      </p>
      <div className="mt-8 fade-in-text">
        <Button
          asChild
          size="lg"
          className="relative overflow-hidden rounded-full border border-primary/20 bg-primary/10 px-8 py-6 font-semibold text-primary shadow-2xl shadow-primary/20 backdrop-blur-md transition-all duration-300 hover:bg-primary/20 hover:text-primary hover:-translate-y-1 hover:shadow-primary/40 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
          onClick={onButtonClick}
        >
          <Link href="/dashboard">
            <span className="relative z-10">Get Started</span>
            <span className="absolute inset-0 z-0">
              {ripples.map(ripple => (
                <span
                  key={ripple.key}
                  className="absolute animate-ripple rounded-full bg-white/30 pointer-events-none"
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                    width: ripple.size,
                    height: ripple.size,
                  }}
                />
              ))}
            </span>
          </Link>
        </Button>
      </div>
    </>
  );
}
