'use client';

import { useState, FormEvent, useEffect, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getTopLawyersAction } from '@/lib/actions';
import type { TopLawyer } from '@/lib/types';
import { AlertCircle, Loader2, MapPin, Star, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Skeleton } from '../ui/skeleton';

export function TopLawyers() {
  const [lawyers, setLawyers] = useState<TopLawyer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [city, setCity] = useState('');
  const [searchedCity, setSearchedCity] = useState('');
  
  const handleCitySearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!city) {
        setError('Please enter a city name.');
        return;
    };
    
    setIsLoading(true);
    setError(null);
    setLawyers([]);
    setSearchedCity(city);

    try {
      const { lawyers: fetchedLawyers } = await getTopLawyersAction({ cityName: city });
      
      if (!fetchedLawyers || fetchedLawyers.length === 0) {
        setError(`No lawyers were found in or around "${city}". Please try a different city.`);
      } else {
        setLawyers(fetchedLawyers);
      }

    } catch (err) {
      const errorMessage = (err as Error).message || `An unexpected error occurred while searching for lawyers in "${city}".`;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
    
  const renderContent = () => {
    if (isLoading) {
      return (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/4 mt-1" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-10 w-full mt-4" />
                    </CardContent>
                </Card>
            ))}
        </div>
      );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-destructive/10 rounded-lg">
                <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                <h3 className="text-lg font-semibold text-destructive">Search Failed</h3>
                <p className="text-destructive/80 text-sm max-w-sm">{error}</p>
            </div>
        );
    }

    if (lawyers.length > 0) {
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lawyers.map((lawyer, i) => (
              <motion.div
                key={lawyer.placeId || lawyer.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg">{lawyer.name}</CardTitle>
                    {lawyer.rating && lawyer.rating > 0 && (
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="font-bold text-amber-500">{lawyer.rating.toFixed(1)}</span>
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <div className="flex-grow">
                        {lawyer.address && (
                          <div className="flex items-start gap-2 text-muted-foreground text-sm">
                              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <span>{lawyer.address}</span>
                          </div>
                        )}
                    </div>
                    <Button 
                        asChild 
                        className="mt-4 w-full"
                        disabled={!lawyer.placeId}
                        onClick={() => lawyer.placeId && window.open(`https://www.google.com/maps/search/?api=1&query=Lawyer&query_place_id=${lawyer.placeId}`, '_blank')}>
                      <a target="_blank" rel="noopener noreferrer">
                        View on Maps
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.IFrame>
            ))}
          </div>
        );
    }
    
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect With Nearby Lawyers</CardTitle>
        <CardDescription>
            Enter a city name to find highly-rated legal advisors in that area.
        </CardDescription>
         <form onSubmit={handleCitySearch} className="flex w-full max-w-sm items-center space-x-2 pt-4">
            <Input 
              type="text" 
              placeholder="e.g., San Francisco" 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={isLoading}
              className='text-base'
            />
            <Button type="submit" disabled={isLoading || !city}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className='h-4 w-4'/>}
              Search
            </Button>
          </form>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
