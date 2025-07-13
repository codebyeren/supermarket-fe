import React, { useState, useEffect, useRef } from 'react';
import { 
  createDynamicThumbnail, 
  createLazyImageUrl, 
  createBlurPlaceholder,
  getFallbackImage,
  type ImageSize 
} from '../../utils/imageUtils';
import './LazyImage.css';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  size?: ImageSize;
  placeholderSize?: ImageSize;
  fallbackCategory?: 'default' | 'product' | 'user' | 'banner';
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  onLoad?: () => void;
  onError?: () => void;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  srcSet?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  size,
  placeholderSize = { width: 20, height: 15 },
  fallbackCategory = 'default',
  quality = 80,
  format = 'webp',
  onLoad,
  onError,
  loading = 'lazy',
  sizes,
  srcSet
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Tạo URL ảnh tối ưu
  const getOptimizedImageUrl = (): string => {
    if (!src || hasError) {
      return getFallbackImage(fallbackCategory);
    }

    if (size) {
      return createDynamicThumbnail(src, {
        size,
        quality,
        format
      });
    }

    return src;
  };

  // Tạo placeholder URL
  const getPlaceholderUrl = (): string => {
    if (!src) return getFallbackImage(fallbackCategory);
    
    return createBlurPlaceholder(src, placeholderSize);
  };

  // Tạo srcSet nếu không được cung cấp
  const getSrcSet = (): string => {
    if (srcSet) return srcSet;
    
    if (!src || size) return '';
    
    const sizes = [320, 640, 768, 1024, 1280];
    return sizes
      .map(size => {
        const thumbnailUrl = createDynamicThumbnail(src, {
          size: { width: size, height: Math.round(size * 0.75) },
          quality,
          format
        });
        return `${thumbnailUrl} ${size}w`;
      })
      .join(', ');
  };

  // Tạo sizes attribute nếu không được cung cấp
  const getSizes = (): string => {
    if (sizes) return sizes;
    
    return '(max-width: 320px) 280px, (max-width: 640px) 600px, (max-width: 768px) 720px, (max-width: 1024px) 960px, 1200px';
  };

  // Intersection Observer để lazy loading
  useEffect(() => {
    if (loading === 'lazy' && imgRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observerRef.current?.disconnect();
            }
          });
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.1
        }
      );

      observerRef.current.observe(imgRef.current);
    } else {
      setIsInView(true);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading]);

  // Load ảnh khi component vào viewport
  useEffect(() => {
    if (isInView) {
      const optimizedUrl = getOptimizedImageUrl();
      setImageSrc(optimizedUrl);
    }
  }, [isInView, src, size, quality, format]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setImageSrc(getFallbackImage(fallbackCategory));
    onError?.();
  };

  const placeholderUrl = getPlaceholderUrl();
  const finalSrcSet = getSrcSet();
  const finalSizes = getSizes();

  return (
    <div className={`lazy-image-container ${className}`}>
      {/* Placeholder blur */}
      {!isLoaded && (
        <img
          src={placeholderUrl}
          alt=""
          className="lazy-image-placeholder"
          aria-hidden="true"
        />
      )}
      
      {/* Main image */}
      <img
        ref={imgRef}
        src={imageSrc || placeholderUrl}
        alt={alt}
        className={`lazy-image ${isLoaded ? 'lazy-image-loaded' : ''}`}
        loading={loading}
        srcSet={finalSrcSet}
        sizes={finalSizes}
        onLoad={handleLoad}
        onError={handleError}
      />
      
      {/* Loading spinner */}
      {!isLoaded && !hasError && (
        <div className="lazy-image-spinner">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default LazyImage; 