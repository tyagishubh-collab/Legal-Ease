'use client';

import { X } from 'lucide-react';
import Image from 'next/image';

interface ImageViewerProps {
  src: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageViewer({ src, isOpen, onClose }: ImageViewerProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in-0"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white/80 hover:text-white transition-opacity z-10"
        onClick={onClose}
      >
        <X className="h-8 w-8" />
      </button>
      <div
        className="relative w-[90vw] h-[90vh] max-w-4xl max-h-4xl animate-in zoom-in-90"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt="Profile Picture"
          layout="fill"
          objectFit="contain"
          className="rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
}
