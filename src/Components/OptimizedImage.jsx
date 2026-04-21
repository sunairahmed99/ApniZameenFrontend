import React, { useState, useEffect, useRef, memo } from 'react';
import { optimizeImageUrl, preloadImage, imageCache } from '../utils/imageOptimization';

const OptimizedImage = ({
    src,
    alt = '',
    width,
    height,
    className = '',
    style = {},
    loading = 'lazy',
    isPriority = false,
    fetchPriority = 'auto',
    quality = 80,
    onLoad,
    onError,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef(null);
    const optimizedSrc = optimizeImageUrl(src, { width, height, quality });
    
    // Generate srcset for better responsiveness if width/height are provided
    const generateSrcSet = () => {
        if (!src || !width || !src.includes('cloudinary.com')) return null;
        
        const sizes = [0.5, 1, 1.5, 2]; // 0.5x for mobile, 1x standard, 2x for retina
        return sizes
            .map(s => {
                const w = Math.round(width * s);
                const h = height ? Math.round(height * s) : null;
                return `${optimizeImageUrl(src, { width: w, height: h, quality })} ${w}w`;
            })
            .join(', ');
    };

    const srcSet = generateSrcSet();

    return (
        <img
            ref={imgRef}
            src={optimizedSrc || src}
            srcSet={srcSet}
            sizes={width ? `(max-width: ${width}px) 100vw, ${width}px` : '100vw'}
            alt={alt}
            width={width}
            height={height}
            className={className}
            style={{
                opacity: isLoaded ? 1 : 0.6,
                transition: 'opacity 0.4s ease-in-out',
                backgroundColor: '#f5f5f5',
                objectFit: 'cover',
                ...style
            }}
            loading={isPriority ? 'eager' : loading}
            fetchpriority={isPriority ? 'high' : fetchPriority}
            onLoad={() => {
                setIsLoaded(true);
                if (onLoad) onLoad();
            }}
            onError={(e) => {
                setIsLoaded(true);
                if (onError) onError(e);
            }}
            {...props}
        />
    );
};

export default memo(OptimizedImage);
