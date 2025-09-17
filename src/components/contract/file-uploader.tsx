'use client';

import { useState, useCallback, useRef, type ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploaderProps {
  children: ReactNode;
  onFileSelect: (file: File) => void;
  className?: string;
  showFile?: boolean;
}

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
];

export function FileUploader({ children, onFileSelect, className, showFile = false }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (ALLOWED_MIME_TYPES.includes(file.type)) {
      setSelectedFile(file);
      onFileSelect(file);
      toast({
        title: 'File Ready',
        description: `"${file.name}" is ready for processing.`,
      });
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
  const clearFile = () => setSelectedFile(null);

  return (
    <div
      className={className}
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
        accept=".pdf,.docx,.png,.jpg,.jpeg"
        onChange={handleInputChange}
      />
      {children && <div onClick={(e) => e.stopPropagation()}>{children}</div>}

      {isDragging && (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-primary bg-background/80 backdrop-blur-sm">
          <UploadCloud className="h-16 w-16 text-primary" />
          <p className="text-lg font-semibold text-primary">Drop your document here</p>
          <p className="text-sm text-muted-foreground">Supports: PDF, DOCX, PNG, JPG</p>
        </div>
      )}

      {showFile && selectedFile && (
        <div className="mt-4 flex items-center justify-between rounded-lg border bg-muted/50 p-3">
            <div className="flex items-center gap-3">
                <FileIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                </div>
            </div>
            <Button variant="ghost" size="icon" onClick={clearFile}>
                <X className="h-4 w-4" />
            </Button>
        </div>
      )}
    </div>
  );
}
