'use client';

import { useCallback } from 'react';
import './GooeyNav.css';

/**
 * Bubble-only gooey particles for the site header.
 * No pill / square active backgrounds — navbar look stays as-is.
 */
export default function HeaderGooeyBubbles({ children, className = '' }) {
  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (distance, pointIndex, totalPoints) => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const makeParticles = useCallback((anchorEl) => {
    if (!anchorEl) return;

    const rect = anchorEl.getBoundingClientRect();
    const layer = document.createElement('div');
    layer.className = 'header-gooey-layer';
    layer.setAttribute('aria-hidden', 'true');
    Object.assign(layer.style, {
      position: 'fixed',
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      pointerEvents: 'none',
      zIndex: '250',
      overflow: 'visible',
    });
    document.body.appendChild(layer);

    const particleCount = 12;
    const particleDistances = [70, 12];
    const particleR = 80;
    const animationTime = 550;
    const timeVariance = 260;
    const colors = [1, 2, 3, 1, 2, 4];
    let maxT = 0;

    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      maxT = Math.max(maxT, t);
      const rotateNoise = noise(particleR / 10);
      const p = {
        start: getXY(particleDistances[0], particleCount - i, particleCount),
        end: getXY(
          particleDistances[1] + noise(7),
          particleCount - i,
          particleCount
        ),
        time: t,
        scale: 1 + noise(0.2),
        color: colors[Math.floor(Math.random() * colors.length)],
        rotate:
          rotateNoise > 0
            ? (rotateNoise + particleR / 20) * 10
            : (rotateNoise - particleR / 20) * 10,
      };

      setTimeout(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        particle.classList.add('particle');
        particle.style.setProperty('--start-x', `${p.start[0]}px`);
        particle.style.setProperty('--start-y', `${p.start[1]}px`);
        particle.style.setProperty('--end-x', `${p.end[0]}px`);
        particle.style.setProperty('--end-y', `${p.end[1]}px`);
        particle.style.setProperty('--time', `${p.time}ms`);
        particle.style.setProperty('--scale', `${p.scale}`);
        particle.style.setProperty(
          '--color',
          `var(--color-${p.color}, #0d9488)`
        );
        particle.style.setProperty('--rotate', `${p.rotate}deg`);
        point.classList.add('point');
        particle.appendChild(point);
        layer.appendChild(particle);
      }, 30);
    }

    setTimeout(() => {
      try {
        layer.remove();
      } catch {
        /* ignore */
      }
    }, maxT + 80);
  }, []);

  const handleClick = (e) => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return;

    const target = e.target.closest(
      'a, [data-gooey], .cursor-pointer, button'
    );
    if (!target) return;
    if (target.closest('.absolute.top-full')) return;

    makeParticles(target);
  };

  return (
    <div
      className={`gooey-nav--header ${className}`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}
