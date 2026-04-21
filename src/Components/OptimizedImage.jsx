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
    const optimizedSrc = optimizeImageUrl(src, { width, height, quality });
    const imgRef = useRef(null);

    useEffect(() => {
        if (imgRef.current && imgRef.current.complete) {
            setIsLoaded(true);
        }
    }, [src]);

    return (
        <img
            ref={imgRef}
            src={optimizedSrc || src}
            alt={alt}
            width={width}
            height={height}
            className={className}
            style={{
                opacity: isLoaded ? 1 : 0.6,
                transition: 'opacity 0.4s ease-in-out',
                backgroundColor: '#f5f5f5',
                ...style
            }}
            loading={isPriority ? 'eager' : loading}
            fetchPriority={isPriority ? 'high' : fetchPriority}
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
