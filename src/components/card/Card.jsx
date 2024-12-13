import React, { useEffect, useRef, useState, useCallback } from 'react';
import './Card.scss';

function Card({ title, extra, children, onClick, className, style, scroll }) {
  const contentRef = useRef(null);
  const maxSpeed = 0.5; // Adjusted maximum speed limit
  const [isHovering, setIsHovering] = useState(false);
  const isScrollingDown = useRef(true);
  const animationFrameRef = useRef(null);
  const lastFrameTime = useRef(performance.now());
  const scrollAmount = useRef(0); // Accumulator for scroll amount

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      let maskImage;

      if (scrollHeight > clientHeight) {
        const topOpacity = Math.min((scrollHeight - scrollTop - clientHeight) / 20, 1);
        const bottomOpacity = Math.min(scrollTop / 20, 1);
        maskImage = `linear-gradient(to bottom, rgba(0, 0, 0, ${topOpacity}) 0%, black 20%, black 80%, rgba(0, 0, 0, ${bottomOpacity}) 100%)`;
        contentRef.current.style.maskImage = maskImage;
      } else {
        contentRef.current.style.maskImage = 'none';
      }
    }
  };

  const handleAutoScroll = useCallback(() => {
    const now = performance.now();
    const deltaTime = now - lastFrameTime.current;
    lastFrameTime.current = now;

    if (contentRef.current && scroll && !isHovering) {
      const speed = maxSpeed * deltaTime / (600 / 60);
      scrollAmount.current += speed;

      if (scrollAmount.current >= 1 || scrollAmount.current <= -1) {
        let newScrollTop;

        if (isScrollingDown.current) {
          newScrollTop = contentRef.current.scrollTop + Math.floor(scrollAmount.current);
          if (newScrollTop >= contentRef.current.scrollHeight - contentRef.current.clientHeight) {
            isScrollingDown.current = false;
          }
        } else {
          newScrollTop = contentRef.current.scrollTop - Math.floor(Math.abs(scrollAmount.current));
          if (newScrollTop <= 0) {
            isScrollingDown.current = true;
          }
        }

        if (contentRef.current) {
          contentRef.current.scrollTop = newScrollTop;
          handleScroll();
          scrollAmount.current = 0; // Reset the accumulator
        }
      }
    }

    if (!isHovering) {
      animationFrameRef.current = requestAnimationFrame(handleAutoScroll);
    }
  }, [scroll, isHovering, maxSpeed]);

  useEffect(() => {
    const contentElement = contentRef.current;

    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      handleScroll();

      if (scroll && window.innerWidth > 768) {
        animationFrameRef.current = requestAnimationFrame(handleAutoScroll);
      }
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener('scroll', handleScroll);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleAutoScroll, scroll]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };
  const handleMouseLeave = () => {
    setIsHovering(false);
    animationFrameRef.current = requestAnimationFrame(handleAutoScroll);
  };

  const cardClasses = `card ${className || ''}`;

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card-header">
        <h2 className="title">{title}</h2>
        <div className="extra">
          {typeof extra === 'string' ? (
            <span>{extra}</span>
          ) : (
            <div>{extra}</div>
          )}
        </div>
      </div>
      <div className='content' ref={contentRef}>
        {children}
      </div>
    </div>
  );
}

export default Card;
