'use client';

import { useEffect, useRef } from 'react';

export function CursorTrail() {
  const trailRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const trail = trailRef.current;
    if (!trail) return;

    const createParticle = (x: number, y: number, speed: number) => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      document.body.appendChild(particle);

      const size = Math.max(2, 8 - speed / 10);
      const angle = Math.random() * 360;
      const distance = Math.random() * 30 + 20;
      const hue = 275 + Math.random() * 30; // Indigo/Purple range

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background = `hsl(${hue}, 100%, 70%)`;
      particle.style.boxShadow = `0 0 ${size * 2}px hsl(${hue}, 100%, 70%)`;
      particle.style.transform = `translate(${x}px, ${y}px)`;
      
      particlesRef.current.push(particle);

      const animation = particle.animate(
        [
          { opacity: 1, transform: `translate(${x}px, ${y}px) scale(1)` },
          {
            opacity: 0,
            transform: `translate(
              ${x + Math.cos(angle) * distance}px,
              ${y + Math.sin(angle) * distance}px
            ) scale(0)`,
          },
        ],
        {
          duration: Math.random() * 800 + 400,
          easing: 'ease-out',
        }
      );

      animation.onfinish = () => {
        particle.remove();
        particlesRef.current = particlesRef.current.filter(p => p !== particle);
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      if (trail.style) {
         trail.style.transform = `translate(${clientX}px, ${clientY}px)`;
      }

      const dx = clientX - lastPos.current.x;
      const dy = clientY - lastPos.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);

      if (speed > 10) {
        createParticle(clientX, clientY, speed);
      }

      lastPos.current = { x: clientX, y: clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      particlesRef.current.forEach(p => p.remove());
    };
  }, []);

  return <div ref={trailRef} className="cursor-trail"></div>;
}
