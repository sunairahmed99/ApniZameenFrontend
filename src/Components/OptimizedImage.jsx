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
    placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3C/svg%3E',
    onLoad,
    onError,
    ...props
}) => {
    const optimizedSrc = optimizeImageUrl(src, { width, height, quality });
    const [imageSrc, setImageSrc] = useState(isPriority ? optimizedSrc : placeholder);
    const [isLoaded, setIsLoaded] = useState(isPriority);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        if (!src || isPriority) return;

        // Check cache first
        if (imageCache.has(src)) {
            setImageSrc(imageCache.get(src));
            setIsLoaded(true);
            return;
        }

        // Preload image
        preloadImage(optimizedSrc)
            .then(() => {
                imageCache.set(src, optimizedSrc);
                setImageSrc(optimizedSrc);
                setIsLoaded(true);
                if (onLoad) onLoad();
            })
            .catch((error) => {
                setHasError(true);
                if (onError) onError(error);
            });
    }, [src, width, height, quality, onLoad, onError, isPriority, optimizedSrc]);

    return (
        <img
            ref={imgRef}
            src={imageSrc}
            alt={alt}
            width={width}
            height={height}
            className={className}
            style={{
                ...style,
                opacity: isLoaded ? 1 : (isPriority ? 1 : 0.5),
                transition: isPriority ? 'none' : 'opacity 0.3s ease-in-out'
            }}
            loading={isPriority ? 'eager' : loading}
            fetchpriority={isPriority ? 'high' : fetchPriority}
            {...props}
        />
    );
};

export default memo(OptimizedImage);
