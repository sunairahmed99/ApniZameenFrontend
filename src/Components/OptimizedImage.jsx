import React, { useState, memo } from 'react';
import { optimizeImageUrl } from '../utils/imageOptimization';

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
    const optimizedSrc = optimizeImageUrl(src, { width, height, quality });

    // Generate a mobile-first srcset for Cloudinary images
    const generateSrcSet = () => {
        if (!src || !width || !src.includes('cloudinary.com')) return null;
        // Provide 4 breakpoints: 320w (mobile), 640w, actual width, 2x retina
        const breakpoints = [320, 640, width, width * 2].filter((w, i, arr) => w > 0 && arr.indexOf(w) === i);
        return breakpoints
            .map(w => {
                const h = height ? Math.round((height / width) * w) : null;
                return `${optimizeImageUrl(src, { width: w, height: h, quality })} ${w}w`;
            })
            .join(', ');
    };

    // Responsive sizes: prefers viewport width on mobile, capped at component width on desktop
    const generateSizes = () => {
        if (!width) return '100vw';
        return `(max-width: 576px) 100vw, (max-width: 992px) 50vw, ${width}px`;
    };

    const srcSet = generateSrcSet();

    return (
        <img
            src={optimizedSrc || src}
            srcSet={srcSet}
            sizes={generateSizes()}
            alt={alt}
            width={width}
            height={height}
            className={className}
            style={{
                opacity: isLoaded ? 1 : 0.6,
                transition: 'opacity 0.3s ease-in-out',
                backgroundColor: '#f5f5f5',
                objectFit: 'cover',
                ...style
            }}
            loading={isPriority ? 'eager' : loading}
            fetchpriority={isPriority ? 'high' : fetchPriority}
            // decoding=async prevents image decode from blocking main thread
            decoding={isPriority ? 'sync' : 'async'}
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
