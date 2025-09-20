'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Globe } from 'lucide-react';

export function MapChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Connect with nearby advisors</CardTitle>
        <CardDescription>
          Find legal advisors in your area.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-[210px]">
        <div className='flex flex-col items-center justify-center text-muted-foreground/50'>
            <Globe className='h-16 w-16' />
            <p className='mt-2 text-sm font-semibold'>Map data unavailable</p>
        </div>
      </CardContent>
    </Card>
  );
}
