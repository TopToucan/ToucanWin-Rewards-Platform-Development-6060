// Image optimization utilities
export const createOptimizedImageUrl = (baseUrl, options = {}) => {
  const {
    width = 800,
    height = 600,
    quality = 80,
    format = 'webp',
    fit = 'crop'
  } = options;

  // For Unsplash images, add optimization parameters
  if (baseUrl.includes('unsplash.com')) {
    const params = new URLSearchParams({
      auto: 'format',
      fit: fit,
      w: width.toString(),
      h: height.toString(),
      q: quality.toString(),
      fm: format
    });
    
    return `${baseUrl}&${params.toString()}`;
  }

  // For other images, return as-is (could be extended for other services)
  return baseUrl;
};

export const createImageSrcSet = (baseUrl, sizes = [400, 800, 1200]) => {
  return sizes.map(size => 
    `${createOptimizedImageUrl(baseUrl, { width: size })} ${size}w`
  ).join(', ');
};

export const getImageSizes = (breakpoints = {
  sm: '400px',
  md: '800px',
  lg: '1200px'
}) => {
  return `(max-width: 640px) ${breakpoints.sm}, (max-width: 1024px) ${breakpoints.md}, ${breakpoints.lg}`;
};

// Lazy loading intersection observer
export const createLazyLoadObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  };

  return new IntersectionObserver(callback, { ...defaultOptions, ...options });
};

// Preload critical images
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// WebP support detection
export const supportsWebP = () => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};