// Utility functions for image handling and thumbnails

export interface ImageSize {
  width: number;
  height: number;
}

export interface ThumbnailConfig {
  size: ImageSize;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

/**
 * Tạo thumbnail động từ URL ảnh gốc
 * @param originalUrl URL ảnh gốc
 * @param config Cấu hình thumbnail
 * @returns URL thumbnail
 */
export const createDynamicThumbnail = (
  originalUrl: string,
  config: ThumbnailConfig
): string => {
  // Nếu sử dụng Cloudinary
  if (originalUrl.includes('cloudinary.com')) {
    return createCloudinaryThumbnail(originalUrl, config);
  }
  
  // Nếu sử dụng ImageKit
  if (originalUrl.includes('imagekit.io')) {
    return createImageKitThumbnail(originalUrl, config);
  }
  
  // Nếu sử dụng Imgix
  if (originalUrl.includes('imgix.net')) {
    return createImgixThumbnail(originalUrl, config);
  }
  
  // Fallback: trả về ảnh gốc
  return originalUrl;
};

/**
 * Tạo thumbnail với Cloudinary
 */
const createCloudinaryThumbnail = (
  originalUrl: string,
  config: ThumbnailConfig
): string => {
  const { size, quality = 80, format = 'webp' } = config;
  const { width, height } = size;
  
  // Thay thế transformation parameters
  return originalUrl
    .replace(/\/upload\//, `/upload/c_scale,w_${width},h_${height},q_${quality},f_${format}/`)
    .replace(/\.(jpg|jpeg|png|webp)/, `.${format}`);
};

/**
 * Tạo thumbnail với ImageKit
 */
const createImageKitThumbnail = (
  originalUrl: string,
  config: ThumbnailConfig
): string => {
  const { size, quality = 80, format = 'webp' } = config;
  const { width, height } = size;
  
  const params = new URLSearchParams({
    tr: `w-${width},h-${height},q-${quality},f-${format}`
  });
  
  return `${originalUrl}?${params.toString()}`;
};

/**
 * Tạo thumbnail với Imgix
 */
const createImgixThumbnail = (
  originalUrl: string,
  config: ThumbnailConfig
): string => {
  const { size, quality = 80, format = 'webp' } = config;
  const { width, height } = size;
  
  const params = new URLSearchParams({
    w: width.toString(),
    h: height.toString(),
    q: quality.toString(),
    fm: format
  });
  
  return `${originalUrl}?${params.toString()}`;
};

/**
 * Tạo responsive image srcset
 */
export const createResponsiveSrcSet = (
  originalUrl: string,
  sizes: number[]
): string => {
  return sizes
    .map(size => {
      const thumbnailUrl = createDynamicThumbnail(originalUrl, {
        size: { width: size, height: Math.round(size * 0.75) }
      });
      return `${thumbnailUrl} ${size}w`;
    })
    .join(', ');
};

/**
 * Tạo responsive image sizes attribute
 */
export const createResponsiveSizes = (breakpoints: { [key: string]: string }): string => {
  return Object.entries(breakpoints)
    .map(([media, size]) => `${media} ${size}`)
    .join(', ');
};

/**
 * Lazy load image với placeholder
 */
export const createLazyImageUrl = (
  originalUrl: string,
  placeholderSize: ImageSize = { width: 20, height: 15 }
): string => {
  return createDynamicThumbnail(originalUrl, {
    size: placeholderSize,
    quality: 10,
    format: 'webp'
  });
};

/**
 * Tạo blur placeholder cho lazy loading
 */
export const createBlurPlaceholder = (
  originalUrl: string,
  size: ImageSize = { width: 20, height: 15 }
): string => {
  return createDynamicThumbnail(originalUrl, {
    size,
    quality: 5,
    format: 'webp'
  });
};

/**
 * Kiểm tra xem ảnh có load được không
 */
export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Tạo fallback image URL
 */
export const getFallbackImage = (category: string = 'default'): string => {
  const fallbackImages = {
    default: '/img/placeholder.jpg',
    product: '/img/product-placeholder.jpg',
    user: '/img/user-placeholder.jpg',
    banner: '/img/banner-placeholder.jpg'
  };
  
  return fallbackImages[category as keyof typeof fallbackImages] || fallbackImages.default;
};

/**
 * Tối ưu hóa ảnh cho web
 */
export const optimizeImageForWeb = (
  originalUrl: string,
  maxWidth: number = 1200,
  quality: number = 85
): string => {
  return createDynamicThumbnail(originalUrl, {
    size: { width: maxWidth, height: Math.round(maxWidth * 0.75) },
    quality,
    format: 'webp'
  });
};

/**
 * Tạo avatar từ tên người dùng
 */
export const createAvatarFromName = (
  name: string,
  size: number = 100
): string => {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  
  const color = colors[name.length % colors.length];
  
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" 
            fill="white" text-anchor="middle" dy="0.35em">${initials}</text>
    </svg>
  `)}`;
};

/**
 * Kiểm tra xem trình duyệt có hỗ trợ WebP không
 */
export const supportsWebP = (): boolean => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

/**
 * Lấy format ảnh tối ưu cho trình duyệt
 */
export const getOptimalImageFormat = (): 'webp' | 'jpeg' => {
  return supportsWebP() ? 'webp' : 'jpeg';
}; 