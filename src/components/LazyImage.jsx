import React, { useState, useRef, useEffect } from 'react';
import { Box, Image, Skeleton } from '@chakra-ui/react';
import { createOptimizedImageUrl, createImageSrcSet, getImageSizes, createLazyLoadObserver } from '../utils/imageOptimization';

const LazyImage = ({
  src,
  alt,
  width,
  height,
  sizes = [400, 800, 1200],
  breakpoints,
  fallbackSrc,
  placeholder = true,
  loading = 'lazy',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!imageRef.current || loading === 'eager') {
      setIsInView(true);
      return;
    }

    observerRef.current = createLazyLoadObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '50px' }
    );

    observerRef.current.observe(imageRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [loading]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setHasError(true);
    onError?.(e);
  };

  const optimizedSrc = createOptimizedImageUrl(src, {
    width: width || 800,
    height: height || 600,
    quality: 85,
    format: 'webp'
  });

  const srcSet = createImageSrcSet(src, sizes);
  const imageSizes = getImageSizes(breakpoints);

  return (
    <Box ref={imageRef} position="relative" {...props}>
      {placeholder && !isLoaded && !hasError && (
        <Skeleton
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          borderRadius="inherit"
        />
      )}
      
      {isInView && (
        <Image
          src={hasError ? fallbackSrc : optimizedSrc}
          srcSet={!hasError ? srcSet : undefined}
          sizes={!hasError ? imageSizes : undefined}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          opacity={isLoaded ? 1 : 0}
          transition="opacity 0.3s ease-in-out"
          loading={loading}
          decoding="async"
          {...props}
        />
      )}
    </Box>
  );
};

export default LazyImage;