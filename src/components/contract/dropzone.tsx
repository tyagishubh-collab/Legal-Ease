'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { FileUploader } from './file-uploader';
import { UploadCloud, FileUp, X } from 'lucide-react';
import { Button } from '../ui/button';

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export function Dropzone({ onFileSelect, selectedFile, onClear }: DropzoneProps) {
  return (
    <FileUploader onFileSelect={onFileSelect} className="w-full max-w-3xl">
        <div className="w-full h-64 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer bg-card hover:bg-muted/50 transition-colors relative overflow-hidden">
            {!selectedFile ? (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center z-10">
                    <UploadCloud className="w-10 h-10 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-base text-muted-foreground">
                        <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PDF, PNG, or JPG</p>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center z-10 p-4">
                    <FileUp className="w-10 h-10 mb-4 text-primary" />
                    <p className="font-semibold text-lg">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 rounded-full" onClick={(e) => { e.stopPropagation(); onClear()}}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    </FileUploader>
  );
}
