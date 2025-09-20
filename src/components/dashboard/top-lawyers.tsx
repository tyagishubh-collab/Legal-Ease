'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getTopLawyersAction, getApproxLocationAction } from '@/lib/actions';
import type { TopLawyer } from '@/lib/types';
import { AlertCircle, Loader2, MapPin, Star, WifiOff, LocateFixed } from 'lucide-react';
import { motion } from 'framer-motion';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

type AlertState = {
  isOpen: boolean;
  title: string;
  message: string;
};

export function TopLawyers() {
  const [lawyers, setLawyers] = useState<TopLawyer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);
  const [alertState, setAlertState] = useState<AlertState>({ isOpen: false, title: '', message: '' });

  useEffect(() => {
    const fetchLocationAndLawyers = () => {
      setIsLoading(true);
      setError(null);

      if (!navigator.geolocation) {
        showErrorAlert('Geolocation Not Supported', 'Your browser does not support geolocation. We will try to find your approximate location.');
        fetchApproxLocation();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { lat, lng } = { lat: position.coords.latitude, lng: position.coords.longitude };
          fetchLawyers({ lat, lng });
        },
        (geoError) => {
          if (geoError.code === geoError.PERMISSION_DENIED) {
            showErrorAlert('Location Access Denied', 'You have denied location access. To find nearby lawyers, please enable it in your browser settings. We will now try to find your approximate location.');
          } else {
             showErrorAlert('Location Error', `Could not determine your location (Error ${geoError.code}). We will try to find your approximate location.`);
          }
          fetchApproxLocation();
        },
        { timeout: 7000, maximumAge: 60000 }
      );
    };

    const fetchApproxLocation = async () => {
      setIsFallback(true);
      try {
        const { lat, lng } = await getApproxLocationAction();
        fetchLawyers({ lat, lng });
      } catch (e) {
        console.error(e);
        setError('Unable to determine your location. We could not find any lawyers for you at this time.');
        setIsLoading(false);
      }
    };

    const fetchLawyers = async ({ lat, lng }: { lat: number; lng: number }) => {
      try {
        const result = await getTopLawyersAction({ lat, lng });
        if (result.lawyers.length === 0) {
            setError("We couldn't find any lawyers in your immediate area. You may want to try searching a nearby city.");
        }
        setLawyers(result.lawyers);
      } catch (e) {
        console.error(e);
        setError('Could not fetch lawyer data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    const showErrorAlert = (title: string, message: string) => {
      setAlertState({ isOpen: true, title, message });
    };

    fetchLocationAndLawyers();
  }, []);

  const closeAlert = () => {
    setAlertState({ isOpen: false, title: '', message: '' });
  };

  const renderContent = () => {
    if (isLoading) {
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

    if (error && lawyers.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-muted/50 rounded-lg">
          <AlertCircle className="w-12 h-12 text-destructive/80 mb-4" />
          <h3 className="text-lg font-semibold text-foreground">An Error Occurred</h3>
          <p className="text-muted-foreground text-sm max-w-sm">{error}</p>
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
    <>
    <Card>
      <CardHeader>
        <CardTitle>Top Lawyers Near You</CardTitle>
        <CardDescription className="flex items-center gap-2">
            Find highly-rated legal advisors in your area.
            {isFallback && !isLoading && !error && (
                <span className="text-xs text-muted-foreground flex items-center gap-1.5 p-1 bg-muted rounded-md">
                    <LocateFixed className="w-3 h-3" />
                    Using approximate location
                </span>
            )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
    <AlertDialog open={alertState.isOpen} onOpenChange={(open) => !open && closeAlert()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alertState.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {alertState.message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={closeAlert}>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
