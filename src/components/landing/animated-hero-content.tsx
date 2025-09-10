'use client';
import { ShieldCheck } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useRef } from 'react';

export function AnimatedHeroContent() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const onButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${e.clientY - button.offsetTop - radius}px`;
    circle.classList.add('absolute', 'rounded-full', 'bg-white/30', 'pointer-events-none', 'transform', 'scale-0', 'animate-ripple');
    
    // Using a key makes React treat it as a new element, restarting animation
    circle.setAttribute('key', Date.now().toString());

    const ripple = button.getElementsByClassName('ripple-container')[0];
    if (ripple) {
      ripple.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    }
  };

  return (
    <>
      <div className="group relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 transition-transform duration-300 hover:scale-110">
        <div className="absolute inset-0 rounded-full logo-glow" />
        <ShieldCheck className="h-10 w-10 text-primary transition-transform duration-300 group-hover:rotate-12" />
      </div>
      <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
        <span className="typing-effect inline-block">Welcome to <span className="text-primary">ClauseWise</span></span>
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground fade-in-text">
        Your AI-powered legal assistant. Analyze documents, understand complex clauses, and assess risks with confidence.
      </p>
      <div className="mt-8 fade-in-text">
        <Button
          ref={buttonRef as any}
          asChild
          size="lg"
          className="relative overflow-hidden rounded-full border border-primary/20 bg-primary/10 px-8 py-6 font-semibold text-primary shadow-2xl shadow-primary/20 backdrop-blur-md transition-all duration-300 hover:bg-primary/20 hover:text-primary hover:-translate-y-1 hover:shadow-primary/40 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
          onClick={onButtonClick}
        >
          <Link href="/dashboard">
            <span className="ripple-container absolute inset-0"/>
            Get Started
          </Link>
        </Button>
      </div>
    </>
  );
}
