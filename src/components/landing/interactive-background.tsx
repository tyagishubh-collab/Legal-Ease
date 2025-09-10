'use client';

import { useEffect, useRef } from 'react';

export function InteractiveBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 30;
      const y = (clientY / innerHeight - 0.5) * 30;
      container.style.transform = `translate(${x}px, ${y}px) rotateX(${-y / 2}deg) rotateY(${x / 2}deg) scale(1.1)`;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10 h-full w-full transition-transform duration-300 ease-out"
      style={{ perspective: '800px' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_48px] opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.1),transparent_70%)]" />
    </div>
  );
}
