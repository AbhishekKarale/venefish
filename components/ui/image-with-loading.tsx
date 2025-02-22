import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface ImageWithLoadingProps extends Omit<ImageProps, 'onLoadingComplete'> {
  overlayClassName?: string;
}

export function ImageWithLoading({
  className,
  overlayClassName,
  ...props
}: ImageWithLoadingProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full">
      <div
        className={cn(
          "absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse transition-opacity duration-500",
          overlayClassName
        )}
        style={{ opacity: isLoading ? 1 : 0 }}
      />
      <Image
        {...props}
        className={cn(
          "transition-all duration-500",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </div>
  );
} 