'use client';

import { useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getTopLawyersAction } from '@/lib/actions';
import type { TopLawyer } from '@/lib/types';
import { AlertCircle, Loader2, MapPin, Star, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';

export function TopLawyers() {
  const [lawyers, setLawyers] = useState<TopLawyer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if ('geolocation' in navigator) {
      startTransition(() => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { lat, lng } = { lat: position.coords.latitude, lng: position.coords.longitude };
              const result = await getTopLawyersAction({ lat, lng });
              setLawyers(result.lawyers);
            } catch (e) {
              console.error(e);
              setError('Could not fetch lawyer data. Please try again later.');
            }
          },
          (err) => {
            setError('Location access denied. Please enable location services to find nearby lawyers.');
          }
        );
      });
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, []);

  const renderContent = () => {
    if (isPending) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 w-3/4 bg-muted rounded-md" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-4 w-1/2 bg-muted rounded-md" />
                <div className="h-4 w-full bg-muted rounded-md" />
                <div className="h-10 w-32 bg-muted rounded-md mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-muted/50 rounded-lg">
          <AlertCircle className="w-12 h-12 text-destructive/80 mb-4" />
          <h3 className="text-lg font-semibold text-foreground">An Error Occurred</h3>
          <p className="text-muted-foreground text-sm max-w-sm">{error}</p>
        </div>
      );
    }
    
    if (lawyers.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center text-center p-8 bg-muted/50 rounded-lg">
            <WifiOff className="w-12 h-12 text-muted-foreground/80 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No Lawyers Found</h3>
            <p className="text-muted-foreground text-sm max-w-sm">We couldn't find any lawyers in your immediate area. You may want to try searching a nearby city.</p>
          </div>
        );
      }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lawyers.map((lawyer, i) => (
          <motion.div
            key={lawyer.placeId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg">{lawyer.name}</CardTitle>
                {lawyer.rating > 0 && (
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="font-bold text-amber-500">{lawyer.rating.toFixed(1)}</span>
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  </div>
                )}
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <div className="flex-grow">
                    <div className="flex items-start gap-2 text-muted-foreground text-sm">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{lawyer.address}</span>
                    </div>
                </div>
                <Button 
                    asChild 
                    className="mt-4 w-full"
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=Lawyer&query_place_id=${lawyer.placeId}`, '_blank')}>
                  <a target="_blank" rel="noopener noreferrer">
                    View on Maps
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Lawyers Near You</CardTitle>
        <CardDescription>
          Find highly-rated legal advisors in your area based on your current location.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
