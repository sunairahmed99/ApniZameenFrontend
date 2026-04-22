import React, { useState, useEffect, useRef } from 'react';

// On mobile networks, start loading sections earlier (300px ahead)
// so users don't see blank sections while scrolling
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
const DEFAULT_ROOT_MARGIN = isMobile ? '300px' : '150px';

const LazySection = ({ children, height = '200px', rootMargin = DEFAULT_ROOT_MARGIN }) => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        // If IntersectionObserver not supported (old browsers), show immediately
        if (!('IntersectionObserver' in window)) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Disconnect immediately after first trigger — no ongoing cost
                    observer.disconnect();
                }
            },
            { rootMargin }
        );

        const el = sectionRef.current;
        if (el) observer.observe(el);

        return () => observer.disconnect();
    }, []); // No deps needed — rootMargin is stable

    return (
        <div
            ref={sectionRef}
            style={{
                minHeight: !isVisible ? height : 'auto',
                // Hint to browser: skip layout/paint for off-screen sections
                contentVisibility: isVisible ? 'visible' : 'auto',
                containIntrinsicSize: !isVisible ? `0 ${height}` : undefined,
            }}
        >
            {isVisible ? children : null}
        </div>
    );
};

export default LazySection;
