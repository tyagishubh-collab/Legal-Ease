'use client';

import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface DropzoneProps {
  children: ReactNode;
}

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
];

export function Dropzone({ children }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (ALLOWED_MIME_TYPES.includes(file.type)) {
        // In a real app, you would handle the file upload here.
        // For example, upload to a server or process on the client.
        toast({
          title: 'Upload Successful',
          description: `File "${file.name}" is ready for processing.`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a PDF, DOCX, PNG, or JPG file.',
        });
      }
      e.dataTransfer.clearData();
    }
  }, [toast]);

  return (
    <div
      className={cn('relative h-full w-full rounded-lg transition-all duration-300', {
        'bg-primary/5': isDragging,
      })}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-primary bg-background/80 backdrop-blur-sm">
          <UploadCloud className="h-16 w-16 text-primary" />
          <p className="text-lg font-semibold text-primary">Drop your document here</p>
          <p className="text-sm text-muted-foreground">Supports: PDF, DOCX, PNG, JPG</p>
        </div>
      )}
      {children}
    </div>
  );
}
