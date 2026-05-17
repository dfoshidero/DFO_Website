import React, { useEffect, useRef, useCallback } from 'react';
import './Card.scss';

function Card({ title, extra, children, onClick, className, style }) {
  const contentRef = useRef(null);

  const handleScroll = useCallback(() => {
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
  }, []);

  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    contentElement.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      contentElement.removeEventListener('scroll', handleScroll);
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
        <h2 className="title">{title}</h2>
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
