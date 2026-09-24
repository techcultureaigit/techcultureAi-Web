"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import "./BounceCards.css";

export default function BounceCards({
  className = "",
  images = [],
  items = [],
  containerWidth = 400,
  containerHeight = 400,
  animationDelay = 0.5,
  animationStagger = 0.06,
  easeType = "elastic.out(1, 0.8)",
  transformStyles = [
    "rotate(10deg) translate(-170px)",
    "rotate(5deg) translate(-85px)",
    "rotate(-3deg)",
    "rotate(-10deg) translate(85px)",
    "rotate(2deg) translate(170px)",
  ],
  enableHover = true,
  onActiveChange,
}) {
  const containerRef = useRef(null);
  const cards = useMemo(
    () =>
      items.length
        ? items
        : images.map((image, index) => ({
            image,
            name: `Client ${index + 1}`,
            company: "",
          })),
    [images, items]
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".bounce-card",
        { scale: 0 },
        {
          scale: 1,
          stagger: animationStagger,
          ease: easeType,
          delay: animationDelay,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [animationStagger, easeType, animationDelay]);

  const getNoRotationTransform = (transform) => {
    if (/rotate\([\s\S]*?\)/.test(transform)) {
      return transform.replace(/rotate\([\s\S]*?\)/, "rotate(0deg)");
    }
    return transform === "none"
      ? "rotate(0deg)"
      : `${transform} rotate(0deg)`;
  };

  const getPushedTransform = (baseTransform, offsetX) => {
    const translateRegex = /translate\(([-0-9.]+)px\)/;
    const match = baseTransform.match(translateRegex);

    if (match) {
      const newX = parseFloat(match[1]) + offsetX;
      return baseTransform.replace(
        translateRegex,
        `translate(${newX}px)`
      );
    }

    return baseTransform === "none"
      ? `translate(${offsetX}px)`
      : `${baseTransform} translate(${offsetX}px)`;
  };

  const pushSiblings = (hoveredIndex) => {
    if (!enableHover || !containerRef.current) return;

    const select = gsap.utils.selector(containerRef);

    cards.forEach((_, index) => {
      const target = select(`.bounce-card-${index}`);
      const baseTransform = transformStyles[index] || "none";
      gsap.killTweensOf(target);

      if (index === hoveredIndex) {
        gsap.to(target, {
          transform: getNoRotationTransform(baseTransform),
          zIndex: cards.length + 1,
          duration: 0.4,
          ease: "back.out(1.4)",
          overwrite: "auto",
        });
      } else {
        const offsetX = index < hoveredIndex ? -150 : 150;
        const distance = Math.abs(hoveredIndex - index);

        gsap.to(target, {
          transform: getPushedTransform(baseTransform, offsetX),
          zIndex: index + 1,
          duration: 0.4,
          ease: "back.out(1.4)",
          delay: distance * 0.04,
          overwrite: "auto",
        });
      }
    });

    onActiveChange?.(hoveredIndex);
  };

  const resetSiblings = () => {
    if (!enableHover || !containerRef.current) return;

    const select = gsap.utils.selector(containerRef);

    cards.forEach((_, index) => {
      const target = select(`.bounce-card-${index}`);
      gsap.killTweensOf(target);
      gsap.to(target, {
        transform: transformStyles[index] || "none",
        zIndex: index + 1,
        duration: 0.4,
        ease: "back.out(1.4)",
        overwrite: "auto",
      });
    });
  };

  return (
    <div
      className={`bounceCardsContainer ${className}`}
      ref={containerRef}
      style={{
        width: containerWidth,
        height: containerHeight,
      }}
    >
      {cards.map((item, index) => (
        <div
          key={item.name || index}
          className={`bounce-card bounce-card-${index}`}
          style={{
            transform: transformStyles[index] || "none",
            zIndex: index + 1,
          }}
          onMouseEnter={() => pushSiblings(index)}
          onMouseLeave={resetSiblings}
          onFocus={() => pushSiblings(index)}
          onBlur={resetSiblings}
          tabIndex={enableHover ? 0 : -1}
        >
          <Image
            className="bounce-card__image"
            src={item.image}
            alt={item.name || `Client ${index + 1}`}
            fill
            sizes="(max-width: 768px) 150px, 220px"
            unoptimized
          />
          <div className="bounce-card__overlay">
            <span>{item.name}</span>
            <small>{item.company}</small>
          </div>
        </div>
      ))}
    </div>
  );
}
