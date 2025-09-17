'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { FileUploader } from './file-uploader';

interface DropzoneProps {
  children: ReactNode;
  onFileSelect: (file: File) => void;
}

export function Dropzone({ children, onFileSelect }: DropzoneProps) {
  return (
    <FileUploader onFileSelect={onFileSelect} className="relative h-full w-full rounded-lg transition-all duration-300">
      <div
        className={cn('relative h-full w-full rounded-lg transition-all duration-300')}
      >
        {children}
      </div>
    </FileUploader>
  );
}
