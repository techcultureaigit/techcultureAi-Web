'use client';

import { useRef } from 'react';
import './SpotlightCard.css';

/** Brand spotlight — logo orange glow */
export const BRAND_SPOTLIGHT = 'rgba(254, 96, 47, 0.22)';
export const TEAL_SPOTLIGHT = 'rgba(13, 148, 136, 0.2)';

const SpotlightCard = ({
  children,
  className = '',
  spotlightColor = BRAND_SPOTLIGHT,
}) => {
  const divRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    divRef.current.style.setProperty('--mouse-x', `${x}px`);
    divRef.current.style.setProperty('--mouse-y', `${y}px`);
    divRef.current.style.setProperty('--spotlight-color', spotlightColor);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`card-spotlight ${className}`}
    >
      <div className="card-spotlight__content">{children}</div>
    </div>
  );
};

export default SpotlightCard;
