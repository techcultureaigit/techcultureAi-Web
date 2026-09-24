"use client";

import Image from "next/image";
import { useRef } from "react";

const ROW_COUNT = 7;
const ITEMS_REPEAT_PER_REEL = 4;

function getRows(items) {
  return Array.from({ length: ROW_COUNT }, (_, rowIndex) => {
    const orderedItems = [
      ...items.slice(rowIndex % items.length),
      ...items.slice(0, rowIndex % items.length),
    ];

    return Array.from(
      { length: ITEMS_REPEAT_PER_REEL },
      () => orderedItems
    ).flat();
  });
}

export default function EmployeeReelGallery({ members = [], className = "" }) {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const rowRefs = useRef([]);
  const dragRef = useRef({ active: false, startX: 0 });

  if (!members.length) return null;

  const rows = getRows(members);

  function updatePointer(clientX, clientY) {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;

    const rect = root.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
    const normalizedX = x / rect.width - 0.5;
    const normalizedY = y / rect.height - 0.5;

    root.style.setProperty("--reel-pointer-x", `${x}px`);
    root.style.setProperty("--reel-pointer-y", `${y}px`);
    stage.style.transform = `perspective(1200px) rotateX(${
      normalizedY * -3.5
    }deg) rotateY(${normalizedX * 4.5}deg) rotateZ(-7deg) scale(1.08) translate3d(${
      normalizedX * 14
    }px, ${normalizedY * 10}px, 0)`;
  }

  function handlePointerMove(event) {
    updatePointer(event.clientX, event.clientY);

    if (!dragRef.current.active) return;
    const distance = event.clientX - dragRef.current.startX;

    rowRefs.current.forEach((row, index) => {
      if (!row) return;
      const direction = index % 2 === 0 ? 1 : -1;
      row.style.transform = `translate3d(${
        distance * direction * (0.7 + index * 0.08)
      }px, 0, 0)`;
    });
  }

  function handlePointerDown(event) {
    dragRef.current = { active: true, startX: event.clientX };
    rootRef.current?.setPointerCapture(event.pointerId);
    rootRef.current?.setAttribute("data-dragging", "true");
  }

  function releasePointer(event) {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    rootRef.current?.removeAttribute("data-dragging");

    if (rootRef.current?.hasPointerCapture(event.pointerId)) {
      rootRef.current.releasePointerCapture(event.pointerId);
    }

    rowRefs.current.forEach((row) => {
      if (row) row.style.transform = "translate3d(0, 0, 0)";
    });
  }

  function resetPointer() {
    if (dragRef.current.active) return;
    if (stageRef.current) {
      stageRef.current.style.transform =
        "perspective(1200px) rotateX(0deg) rotateY(0deg) rotateZ(-7deg) scale(1.08) translate3d(0, 0, 0)";
    }
  }

  return (
    <div
      ref={rootRef}
      className={`employee-reel-gallery ${className}`}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={releasePointer}
      onPointerCancel={releasePointer}
      onPointerLeave={resetPointer}
      role="presentation"
    >
      <div ref={stageRef} className="employee-reel-gallery__stage">
        {rows.map((row, rowIndex) => (
          <div
            key={`employee-row-${rowIndex}`}
            ref={(node) => {
              rowRefs.current[rowIndex] = node;
            }}
            className="employee-reel-gallery__row-shift"
          >
            <div
              className={`employee-reel-gallery__track ${
                rowIndex % 2
                  ? "employee-reel-gallery__track--right"
                  : "employee-reel-gallery__track--left"
              }`}
              style={{
                "--reel-duration": `${70 + rowIndex * 8}s`,
              }}
            >
              {[0, 1].map((copyIndex) => (
                <div
                  key={`employee-row-${rowIndex}-copy-${copyIndex}`}
                  className="employee-reel-gallery__group"
                  aria-hidden={copyIndex === 1}
                >
                  {row.map((member, itemIndex) => (
                    <div
                      key={`${member.name}-${copyIndex}-${itemIndex}`}
                      className={`employee-reel-gallery__tile employee-reel-gallery__tile--${
                        (itemIndex + rowIndex) % 3
                      }`}
                    >
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={copyIndex === 0 ? member.name : ""}
                          fill
                          sizes="(max-width: 768px) 150px, 210px"
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div
                          className={`employee-reel-gallery__fallback bg-gradient-to-br ${member.gradient}`}
                        >
                          <span>{member.initials}</span>
                        </div>
                      )}
                      <div className="employee-reel-gallery__caption">
                        <span>{member.name}</span>
                        <small>{member.designation}</small>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="employee-reel-gallery__brand-glow" aria-hidden />
      <div className="employee-reel-gallery__focus" aria-hidden />
      <div className="employee-reel-gallery__shade" aria-hidden />
    </div>
  );
}
