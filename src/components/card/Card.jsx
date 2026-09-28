import React, { useEffect, useRef, useCallback } from 'react';
import './Card.scss';

function Card({ title, titleAction, extra, children, onClick, className, style }) {
  const contentRef = useRef(null);

  const frameRef = useRef(0);

  // Reading scrollTop/scrollHeight forces layout, and writing maskImage forces
  // paint. Doing both on every scroll event thrashes; coalescing to one update
  // per animation frame gives the same result for a fraction of the work.
  const handleScroll = useCallback(() => {
    if (frameRef.current) return;

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;

      const el = contentRef.current;
      if (!el) return;

      const { scrollTop, scrollHeight, clientHeight } = el;

      if (scrollHeight > clientHeight) {
        const topOpacity = Math.min((scrollHeight - scrollTop - clientHeight) / 20, 1);
        const bottomOpacity = Math.min(scrollTop / 20, 1);
        el.style.maskImage = `linear-gradient(to bottom, rgba(0, 0, 0, ${topOpacity}) 0%, black 20%, black 80%, rgba(0, 0, 0, ${bottomOpacity}) 100%)`;
      } else {
        el.style.maskImage = 'none';
      }
    });
  }, []);

  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    contentElement.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      contentElement.removeEventListener('scroll', handleScroll);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [handleScroll]);

  const cardClasses = `card ${className || ''}`;

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      style={style}
    >
      <div className="card-header">
        <div className="title-group">
          <h2 className="title">{title}</h2>
          {titleAction}
        </div>
        <div className="extra">
          {typeof extra === 'string' ? (
            <span>{extra}</span>
          ) : (
            <div>{extra}</div>
          )}
        </div>
      </div>
      <div className="content" ref={contentRef}>
        {children}
      </div>
    </div>
  );
}

export default Card;
