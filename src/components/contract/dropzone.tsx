'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { FileUploader } from './file-uploader';
import { UploadCloud } from 'lucide-react';

interface DropzoneProps {
  onFileSelect: (file: File) => void;
}

export function Dropzone({ onFileSelect }: DropzoneProps) {
  return (
    <FileUploader onFileSelect={onFileSelect} className="w-full">
        <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PDF, DOCX, PNG, or JPG</p>
            </div>
        </div>
    </FileUploader>
  );
}
