import { AnimatedHeroContent } from '@/components/landing/animated-hero-content';
import { CursorTrail } from '@/components/landing/cursor-trail';
import { FeatureCards } from '@/components/landing/feature-cards';
import { InteractiveBackground } from '@/components/landing/interactive-background';

export default function LandingPage() {
  return (
    <>
      <CursorTrail />
      <main className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-transparent text-center">
        <InteractiveBackground />
        <div className="relative z-20 flex flex-col items-center p-8">
         <AnimatedHeroContent />
        </div>
        <div className="relative z-20 w-full px-4 pb-16">
          <FeatureCards />
        </div>
      </main>
    </>
  );
}
