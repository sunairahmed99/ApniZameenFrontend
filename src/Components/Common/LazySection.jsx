import React, { useState, useEffect, useRef } from 'react';

const LazySection = ({ children, height = '200px', rootMargin = '100px' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { rootMargin }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, [rootMargin]);

    return (
        <div ref={sectionRef} style={{ minHeight: !isVisible ? height : 'auto' }}>
            {isVisible ? children : null}
        </div>
    );
};

export default LazySection;
