import React, { useRef } from 'react';
import './HorizontalScroll.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const HorizontalScroll = ({ children }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300; // Adjust scroll amount as needed
      if (direction === 'left') {
        current.scrollLeft -= scrollAmount;
      } else {
        current.scrollLeft += scrollAmount;
      }
    }
  };

  return (
    <div className="horizontal-scroll-container">
      <button className="scroll-btn left" onClick={() => scroll('left')}>
        <FaChevronLeft />
      </button>
      <div className="scroll-content" ref={scrollRef}>
        {children}
      </div>
      <button className="scroll-btn right" onClick={() => scroll('right')}>
        <FaChevronRight />
      </button>
    </div>
  );
};

export default HorizontalScroll;
