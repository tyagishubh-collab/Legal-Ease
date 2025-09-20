'use client';

import { useState, useCallback, useRef, type ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  children: ReactNode;
  onFileSelect: (file: File) => void;
  className?: string;
  showFile?: boolean;
}

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export function FileUploader({ children, onFileSelect, className }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (ALLOWED_MIME_TYPES.includes(file.type)) {
      onFileSelect(file);
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload a PDF, DOCX, PNG, or JPG file.',
      });
    }
  }, [onFileSelect, toast]);

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
      handleFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, [handleFile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => inputRef.current?.click();

  return (
    <div
      className={cn("relative", className)}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={triggerFileSelect}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg,.docx"
        onChange={handleInputChange}
      />
      
      {children}
      
      {isDragging && (
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 rounded-lg bg-background/80 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in">
          <UploadCloud className="h-16 w-16 text-primary animate-pulse" />
          <p className="text-lg font-semibold text-primary">Drop document here</p>
          <p className="text-sm text-muted-foreground">Supports: PDF, DOCX, PNG, JPG</p>
        </div>
      )}
    </div>
  );
}
